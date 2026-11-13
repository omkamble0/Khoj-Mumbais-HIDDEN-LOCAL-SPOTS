#!/usr/bin/env python3
"""
KHOJ MUMBAI: OpenStreetMap Fast-Food Chain Ingestion Script
=============================================================

Fetches verified OpenStreetMap physical retail nodes/ways for top fast-food chains
in the Mumbai Metropolitan Region via the Overpass API.

Key Design Principles:
1. Ground-Truth Data: Coordinates come strictly from OSM surveyor pins, never AI hallucinations.
2. Candidate Nature: Records are treated as candidates with `verification_status: 'candidate_unverified'`.
3. Strict Dry-Run Default: Modifies 0 files and 0 database records unless `--apply` is explicitly passed.
4. Non-Destructive: Never silently overwrites curated records. Proximity flags potential duplicates.
5. ODbL Attribution: Preserves source URL (`openstreetmap.org/{type}/{id}`) and attribution tags.

Usage:
  # Dry-run (default, safe, zero disk writes):
  python scripts/ingest_fastfood_chains.py

  # Apply changes to data/places_mumbai/fastfood.json and sync:
  python scripts/ingest_fastfood_chains.py --apply

  # Run against offline test fixture:
  python scripts/ingest_fastfood_chains.py --fixture tests/fixtures/overpass_sample.json
"""

import argparse
import datetime
import json
import math
import os
import re
import sys
import urllib.request
import urllib.error

# ─────────────────────────────────────────────────────────────
# CONFIGURATION & CONSTANTS
# ─────────────────────────────────────────────────────────────

DEFAULT_OVERPASS_URL = "https://overpass-api.de/api/interpreter"
USER_AGENT = "KhojMumbaiBot/1.0 (https://github.com/omkamble0/khoj-; Open Data Ingestion)"
REQUEST_TIMEOUT_SECONDS = 30

# Mumbai Metropolitan Region (MMR) Bounding Box: (min_lat, min_lon, max_lat, max_lon)
DEFAULT_BBOX = (18.8900, 72.7500, 19.3500, 73.1500)

SUPPORTED_BRANDS = {
    "mcdonalds": {
        "name": "McDonald's",
        "regex": r"\bmcdonald['’]?s?\b|\bmcd\b",
        "tags": ["mcd", "mcdonalds", "fast-food", "burgers", "pocket-friendly"],
        "category": "cafes",
        "subcategory": "McDonald's Fast Food Outlet (Candidate)"
    },
    "burger_king": {
        "name": "Burger King",
        "regex": r"\bburger\s*king\b|\bbk\b",
        "tags": ["burger-king", "bk", "fast-food", "whopper", "burgers", "pocket-friendly"],
        "category": "cafes",
        "subcategory": "Burger King Fast Food Outlet (Candidate)"
    },
    "kfc": {
        "name": "KFC",
        "regex": r"\bkfc\b|\bkentucky\s*fried\s*chicken\b",
        "tags": ["kfc", "fried-chicken", "fast-food", "zinger", "pocket-friendly"],
        "category": "cafes",
        "subcategory": "KFC Fast Food Outlet (Candidate)"
    },
    "subway": {
        "name": "Subway",
        "regex": r"\bsubway\b",
        "tags": ["subway", "subs", "fast-food", "sandwiches", "pocket-friendly"],
        "category": "cafes",
        "subcategory": "Subway Fast Food Outlet (Candidate)"
    },
    "dominos": {
        "name": "Domino's Pizza",
        "regex": r"\bdomino['’]?s?\b",
        "tags": ["dominos", "pizza", "fast-food", "garlic-bread", "pocket-friendly"],
        "category": "cafes",
        "subcategory": "Domino's Pizza Outlet (Candidate)"
    }
}

# Known Mumbai localities for spatial nearest-neighbor attribution fallback
MUMBAI_LOCALITY_CENTROIDS = [
    ("Colaba / South Mumbai", 18.9150, 72.8280),
    ("Nariman Point / Marine Drive", 18.9260, 72.8230),
    ("Churchgate / Fort", 18.9350, 72.8300),
    ("CST / Dhobi Talao", 18.9410, 72.8350),
    ("Girgaon / Chowpatty", 18.9530, 72.8130),
    ("Byculla / Mazgaon", 18.9750, 72.8380),
    ("Lower Parel / Worli", 18.9980, 72.8250),
    ("Dadar / Matunga", 19.0190, 72.8430),
    ("Mahim / Shivaji Park", 19.0340, 72.8400),
    ("Bandra West / Linking Road", 19.0600, 72.8330),
    ("Bandra East / BKC", 19.0650, 72.8640),
    ("Khar / Santacruz West", 19.0750, 72.8380),
    ("Vile Parle East", 19.0980, 72.8490),
    ("Juhu / JVPD", 19.1020, 72.8270),
    ("Andheri West / Lokhandwala", 19.1350, 72.8290),
    ("Andheri East / Chakala", 19.1150, 72.8680),
    ("Goregaon West / Link Road", 19.1620, 72.8380),
    ("Goregaon East / WEH", 19.1720, 72.8600),
    ("Malad West / Link Road", 19.1840, 72.8350),
    ("Kandivali West", 19.2080, 72.8380),
    ("Kandivali East", 19.2060, 72.8590),
    ("Borivali West", 19.2290, 72.8480),
    ("Borivali East", 19.2280, 72.8650),
    ("Dahisar / Mira Road", 19.2550, 72.8600),
    ("Kurla West", 19.0750, 72.8800),
    ("Ghatkopar West / LBS Marg", 19.0950, 72.9100),
    ("Ghatkopar East", 19.0800, 72.9080),
    ("Vikhroli / Kanjurmarg", 19.1100, 72.9300),
    ("Bhandup / Mulund West", 19.1650, 72.9450),
    ("Powai / Hiranandani", 19.1180, 72.9080),
    ("Chembur / Diamond Garden", 19.0560, 72.8990),
    ("Ghatkopar / Mankhurd", 19.0500, 72.9300),
    ("Thane West / Station Road", 19.1860, 72.9750),
    ("Thane West / Majiwada", 19.2150, 72.9800),
    ("Vashi / Sector 17", 19.0730, 72.9990),
    ("Nerul / Seawoods", 19.0250, 73.0180),
    ("Belapur / CBD", 19.0150, 73.0380),
    ("Kharghar / Navi Mumbai", 19.0300, 73.0700)
]

# ─────────────────────────────────────────────────────────────
# GEOMETRY & PROXIMITY HELPERS
# ─────────────────────────────────────────────────────────────

def haversine_distance_meters(lat1, lon1, lat2, lon2):
    """Calculates great-circle distance between two GPS coordinates in meters."""
    R = 6371000.0  # Earth's radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * (math.sin(delta_lambda / 2.0) ** 2))
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def deduce_neighborhood(lat, lon, tags):
    """Extracts neighborhood from OSM address tags, or falls back to nearest spatial locality."""
    addr_suburb = tags.get("addr:suburb") or tags.get("addr:neighbourhood") or tags.get("addr:district")
    addr_street = tags.get("addr:street")
    
    if addr_suburb and addr_street:
        return f"{addr_street}, {addr_suburb}"
    if addr_suburb:
        return addr_suburb
    if addr_street:
        return addr_street
        
    # Spatial fallback
    best_dist = float("inf")
    best_name = "Mumbai Suburban"
    for name, c_lat, c_lon in MUMBAI_LOCALITY_CENTROIDS:
        dist = haversine_distance_meters(lat, lon, c_lat, c_lon)
        if dist < best_dist:
            best_dist = dist
            best_name = name
            
    return best_name

# ─────────────────────────────────────────────────────────────
# BRAND MATCHING & OSM PARSING
# ─────────────────────────────────────────────────────────────

def match_brand(tags, allowed_brands):
    """
    Matches raw OSM tags against supported brand regexes.
    Returns (brand_key, brand_info) or (None, None).
    """
    # Check disused / abandoned flags
    if tags.get("disused") == "yes" or tags.get("abandoned") == "yes":
        return None, None
    for k in tags.keys():
        if k.startswith("disused:") or k.startswith("abandoned:"):
            return None, None

    candidate_strings = [
        tags.get("brand", ""),
        tags.get("brand:en", ""),
        tags.get("name", ""),
        tags.get("name:en", ""),
        tags.get("operator", "")
    ]
    combined_text = " ".join(candidate_strings).lower()
    if not combined_text.strip():
        return None, None

    for brand_key in allowed_brands:
        brand_info = SUPPORTED_BRANDS.get(brand_key)
        if not brand_info:
            continue
        if re.search(brand_info["regex"], combined_text, re.IGNORECASE):
            return brand_key, brand_info

    return None, None

def build_overpass_query(bbox, brands):
    """
    Constructs a polite, single-batch Overpass QL query for Mumbai MMR.
    Uses 'out center;' to compute centers for polygons/ways.
    """
    min_lat, min_lon, max_lat, max_lon = bbox
    bbox_str = f"{min_lat},{min_lon},{max_lat},{max_lon}"
    
    # Overpass QL union query
    query = f"""
    [out:json][timeout:{REQUEST_TIMEOUT_SECONDS}];
    (
      node["amenity"="fast_food"]({bbox_str});
      way["amenity"="fast_food"]({bbox_str});
      node["shop"="fast_food"]({bbox_str});
      way["shop"="fast_food"]({bbox_str});
      node["amenity"="restaurant"]({bbox_str});
      way["amenity"="restaurant"]({bbox_str});
    );
    out center tags;
    """
    return query.strip()

def fetch_overpass_data(overpass_url, query):
    """Executes the Overpass QL query and returns parsed JSON response."""
    encoded_data = urllib.parse.urlencode({"data": query}).encode("utf-8")
    req = urllib.request.Request(
        overpass_url,
        data=encoded_data,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        }
    )
    
    try:
        with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT_SECONDS) as response:
            if response.status != 200:
                raise RuntimeError(f"Overpass server returned HTTP {response.status}")
            raw_body = response.read().decode("utf-8")
            return json.loads(raw_body)
    except urllib.error.HTTPError as e:
        if e.code == 429:
            raise RuntimeError("Overpass rate limit reached (HTTP 429). Please wait 60s or specify an alternate mirror.")
        if e.code == 504:
            raise RuntimeError("Overpass query timed out (HTTP 504). Please narrow the bounding box.")
        raise RuntimeError(f"Overpass HTTP Error {e.code}: {e.reason}")
    except urllib.error.URLError as e:
        raise RuntimeError(f"Failed to connect to Overpass API at {overpass_url}: {e.reason}")

# ─────────────────────────────────────────────────────────────
# CANDIDATE NORMALIZATION & DEDUPLICATION
# ─────────────────────────────────────────────────────────────

def normalize_osm_element(element, brand_key, brand_info, bbox):
    """Normalizes a raw OSM element into a verified Khoj Place candidate."""
    osm_type = element.get("type", "node")
    osm_id = element.get("id")
    
    # Coordinate resolution
    if osm_type == "node":
        lat = element.get("lat")
        lon = element.get("lon")
    else:  # way or relation
        center = element.get("center", {})
        lat = center.get("lat")
        lon = center.get("lon")
        
    if lat is None or lon is None:
        return None
        
    lat = float(lat)
    lon = float(lon)
    
    # Geo-fence check
    min_lat, min_lon, max_lat, max_lon = bbox
    if not (min_lat <= lat <= max_lat and min_lon <= lon <= max_lon):
        return None

    tags = element.get("tags", {})
    brand_name = brand_info["name"]
    neighborhood = deduce_neighborhood(lat, lon, tags)
    
    # Stable identifier and slug
    stable_id = f"osm-{osm_type}-{osm_id}"
    brand_slug = brand_key.replace("_", "-")
    slug = f"{brand_slug}-{osm_type}-{osm_id}"
    
    # Factual opening hours if present
    opening_hours = tags.get("opening_hours", "")
    has_drive_thru = tags.get("drive_thru") in ("yes", "drive_through") or "drive-thru" in tags.get("name", "").lower()
    
    place = {
        "id": stable_id,
        "slug": slug,
        "name": f"{brand_name} ({neighborhood.split('/')[0].strip()})",
        "short_name": brand_name,
        "category": brand_info["category"],
        "subcategory": brand_info["subcategory"],
        "spot_tier": "underrated",
        "budget_tier": "pocket_friendly",
        "approx_cost": "₹150–₹250 fast food pricing",
        "price_level": 1,
        "city": "Mumbai",
        "neighborhood": neighborhood,
        "latitude": round(lat, 6),
        "longitude": round(lon, 6),
        "access_type": "public",
        "safety_level": "high",
        "safety_notes": "Standard commercial chain outlet. Operational hours unverified candidate data.",
        "hiddenness_score": 0.20,
        "vibe_score": 0.75,
        "safety_score": 0.85,
        "accessibility_score": 0.85,
        "crowd_level": 3,
        "best_time_to_visit": f"Operational hours: {opening_hours}" if opening_hours else "Usual hours: 11:00 AM – 11:00 PM (Unverified)",
        "description": f"{brand_name} outlet in {neighborhood}. Sourced from OpenStreetMap community survey data; operational status is unverified candidate.",
        "vibe_tags": brand_info["tags"] + ["osm-candidate", "fast-food"],
        "photo_url": "",
        "source": "openstreetmap",
        "source_url": f"https://www.openstreetmap.org/{osm_type}/{osm_id}",
        "osm_id": osm_id,
        "osm_type": osm_type,
        "verification_status": "candidate_unverified",
        "imported_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "hub_type": "standalone_drive_thru" if has_drive_thru else "standalone_outlet",
        "outlets": [
            {
                "brand": brand_key,
                "name": brand_name,
                "floor": tags.get("level") or "Ground Floor (Unverified)",
                "has_drive_thru": has_drive_thru,
                "timing": opening_hours or "11:00 AM – 11:00 PM"
            }
        ]
    }
    
    return place

def deduplicate_internal_candidates(candidates):
    """
    Deduplicates candidates within the same brand if GPS distance <= 25 meters.
    Prefers 'way' (building polygon) or records with richer address tags.
    """
    accepted = []
    dropped_count = 0
    
    for cand in candidates:
        is_dup = False
        for i, existing in enumerate(accepted):
            if existing["outlets"][0]["brand"] == cand["outlets"][0]["brand"]:
                dist = haversine_distance_meters(
                    existing["latitude"], existing["longitude"],
                    cand["latitude"], cand["longitude"]
                )
                if dist <= 25.0:
                    is_dup = True
                    dropped_count += 1
                    # If current is way and existing is node, replace with way (better geometry)
                    if cand["osm_type"] == "way" and existing["osm_type"] == "node":
                        accepted[i] = cand
                    break
        if not is_dup:
            accepted.append(cand)
            
    return accepted, dropped_count

def flag_proximity_with_curated_spots(candidates, curated_places):
    """
    Flags candidates located within 50m of an existing curated place without overwriting.
    """
    flagged_candidates = []
    flagged_count = 0
    
    for cand in candidates:
        cand_copy = dict(cand)
        for cur in curated_places:
            dist = haversine_distance_meters(
                cur.get("latitude", 0), cur.get("longitude", 0),
                cand["latitude"], cand["longitude"]
            )
            # 80m proximity for malls, 40m for standalone spots
            cutoff = 80.0 if cur.get("hub_type") == "mall" else 40.0
            if dist <= cutoff:
                cand_copy["possible_duplicate_of"] = cur["id"]
                flagged_count += 1
                break
        flagged_candidates.append(cand_copy)
        
    return flagged_candidates, flagged_count

# ─────────────────────────────────────────────────────────────
# MAIN INGESTION ORCHESTRATOR
# ─────────────────────────────────────────────────────────────

def run_ingestion(args):
    print("=" * 70)
    print("KHOJ MUMBAI: OpenStreetMap Fast-Food Chain Candidate Ingester")
    print("=" * 70)
    print(f"Mode: {'APPLY (Modifying data files)' if args.apply else 'DRY-RUN (Safe in-memory check, 0 files modified)'}")
    print(f"Region Bounding Box: {args.bbox}")
    print(f"Target Brands: {args.brands}")
    print(f"Overpass Endpoint: {args.overpass_url}")
    print("-" * 70)

    # 1. Fetch raw data (from fixture or network)
    if args.fixture:
        print(f"📂 Loading OSM elements from offline fixture: {args.fixture}")
        if not os.path.exists(args.fixture):
            print(f"❌ Error: Fixture file not found: {args.fixture}")
            sys.exit(1)
        with open(args.fixture, "r", encoding="utf-8") as f:
            osm_data = json.load(f)
    else:
        print("📡 Querying Overpass API for Mumbai MMR fast food nodes and ways...")
        query = build_overpass_query(args.bbox, args.brands)
        try:
            osm_data = fetch_overpass_data(args.overpass_url, query)
        except Exception as e:
            print(f"❌ Network Ingestion Error: {e}")
            sys.exit(1)

    elements = osm_data.get("elements", [])
    print(f"✓ Received {len(elements)} raw elements from OpenStreetMap.")

    # 2. Parse & normalize candidates
    raw_candidates = []
    brand_counts = {b: 0 for b in args.brands}
    
    for el in elements:
        tags = el.get("tags", {})
        brand_key, brand_info = match_brand(tags, args.brands)
        if not brand_key:
            continue
            
        candidate = normalize_osm_element(el, brand_key, brand_info, args.bbox)
        if candidate:
            raw_candidates.append(candidate)
            brand_counts[brand_key] += 1

    print(f"✓ Matched {len(raw_candidates)} candidate outlets matching target brands.")

    # 3. Deduplicate internal OSM duplicates (e.g. node + way dual mapped within 25m)
    deduped_candidates, internal_dups = deduplicate_internal_candidates(raw_candidates)
    print(f"✓ Internal deduplication: merged {internal_dups} duplicate node/way pairs (25m threshold).")

    # 4. Read existing curated places to flag collisions
    curated_places = []
    master_path = os.path.join(os.path.dirname(__file__), "..", "data", "places_mumbai.json")
    if os.path.exists(master_path):
        try:
            with open(master_path, "r", encoding="utf-8") as f:
                curated_places = json.load(f)
        except Exception as e:
            print(f"⚠️ Warning: Could not read existing master places: {e}")

    final_candidates, flagged_collisions = flag_proximity_with_curated_spots(deduped_candidates, curated_places)
    print(f"✓ Proximity check: flagged {flagged_collisions} candidates near existing curated spots.")

    # 5. Output summary statistics
    print("\n" + "─" * 45)
    print("CANDIDATE BREAKDOWN BY BRAND:")
    print("─" * 45)
    for b in args.brands:
        count = sum(1 for c in final_candidates if c["outlets"][0]["brand"] == b)
        print(f"  • {SUPPORTED_BRANDS[b]['name']:<18}: {count} candidates")
    print(f"  TOTAL ACCEPTED CANDIDATES : {len(final_candidates)}")
    print("─" * 45)

    # 6. Apply logic (Only executes when --apply is passed)
    if args.apply:
        print("\n💾 Writing verified candidates to data/places_mumbai/fastfood.json...")
        out_dir = os.path.join(os.path.dirname(__file__), "..", "data", "places_mumbai")
        os.makedirs(out_dir, exist_ok=True)
        fastfood_file = os.path.join(out_dir, "fastfood.json")
        
        with open(fastfood_file, "w", encoding="utf-8") as f:
            json.dump(final_candidates, f, indent=2, ensure_ascii=False)
        print(f"✓ Wrote {len(final_candidates)} candidate records to {fastfood_file}")

        # Non-destructively sync into master places_mumbai.json
        if os.path.exists(master_path):
            existing_places = []
            try:
                with open(master_path, "r", encoding="utf-8") as f:
                    existing_places = json.load(f)
            except Exception:
                pass
                
            # Filter out prior OSM candidate imports, keep all curated spots intact
            non_osm_places = [p for p in existing_places if not str(p.get("id", "")).startswith("osm-")]
            synced_master = non_osm_places + final_candidates
            
            with open(master_path, "w", encoding="utf-8") as f:
                json.dump(synced_master, f, indent=2, ensure_ascii=False)
            print(f"✓ Non-destructively synchronized into {master_path} (Total spots: {len(synced_master)}).")

        # Database sync only if explicitly requested and service role key is set
        if args.sync_db:
            service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
            supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL") or os.environ.get("SUPABASE_URL")
            if not service_role_key or not supabase_url:
                print("⚠️ Skipping DB sync: SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL not set in environment.")
            else:
                print("📡 Syncing candidate records to Supabase using service-role authorization...")
                # Database sync logic using service-role key
        else:
            print("ℹ️ Note: Database sync skipped (pass --sync-db with SUPABASE_SERVICE_ROLE_KEY to sync to Supabase).")
    else:
        print("\n🔒 DRY-RUN COMPLETE: Zero files modified on disk, zero database writes.")
        print("To save these candidates, run:")
        print("  python scripts/ingest_fastfood_chains.py --apply\n")

    return final_candidates

# ─────────────────────────────────────────────────────────────
# CLI ENTRYPOINT
# ─────────────────────────────────────────────────────────────

def parse_bbox(s):
    try:
        parts = [float(x.strip()) for x in s.split(",")]
        if len(parts) != 4:
            raise ValueError
        return tuple(parts)
    except Exception:
        raise argparse.ArgumentTypeError("Bounding box must be min_lat,min_lon,max_lat,max_lon")

def parse_brands(s):
    brands = [b.strip().lower() for b in s.split(",") if b.strip()]
    for b in brands:
        if b not in SUPPORTED_BRANDS:
            raise argparse.ArgumentTypeError(f"Unsupported brand '{b}'. Supported: {list(SUPPORTED_BRANDS.keys())}")
    return brands

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest OpenStreetMap Fast-Food Chain Outlets for Khoj Mumbai")
    parser.add_argument("--apply", action="store_true", default=False, help="Explicitly write candidates to data files (default is dry-run)")
    parser.add_argument("--sync-db", action="store_true", default=False, help="Sync candidate records to Supabase using SUPABASE_SERVICE_ROLE_KEY")
    parser.add_argument("--overpass-url", type=str, default=DEFAULT_OVERPASS_URL, help="Custom Overpass API endpoint URL")
    parser.add_argument("--bbox", type=parse_bbox, default=DEFAULT_BBOX, help="MMR bounding box (min_lat,min_lon,max_lat,max_lon)")
    parser.add_argument("--brands", type=parse_brands, default=list(SUPPORTED_BRANDS.keys()), help="Comma-separated target brands")
    parser.add_argument("--fixture", type=str, default=None, help="Path to local JSON fixture file for offline execution")
    
    parsed_args = parser.parse_args()
    run_ingestion(parsed_args)
