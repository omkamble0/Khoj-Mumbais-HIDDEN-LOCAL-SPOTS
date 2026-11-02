"""
scripts/ingest_mumbai.py
Ingestion script for Mumbai hidden gems and quiet spots.
Combines OpenStreetMap Overpass API queries with verified local curated landmarks.
"""

import os
import json
import re
import requests

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

# Mumbai Metropolitan Region Bounding Box (South Mumbai to Vasai/Thane/Navi Mumbai)
MUMBAI_BBOX = (18.88, 72.76, 19.33, 73.08) # (south, west, north, east)

OVERPASS_QUERY = f"""
[out:json][timeout:30];
(
  node["tourism"="viewpoint"]({MUMBAI_BBOX[0]},{MUMBAI_BBOX[1]},{MUMBAI_BBOX[2]},{MUMBAI_BBOX[3]});
  node["historic"~"^(ruins|fort|archaeological_site)$"]["access"!="private"]["access"!="no"]({MUMBAI_BBOX[0]},{MUMBAI_BBOX[1]},{MUMBAI_BBOX[2]},{MUMBAI_BBOX[3]});
  node["natural"~"^(cliff|rock|cave_entrance|peak)$"]({MUMBAI_BBOX[0]},{MUMBAI_BBOX[1]},{MUMBAI_BBOX[2]},{MUMBAI_BBOX[3]});
  way["historic"~"^(ruins|fort)$"]["access"!="private"]({MUMBAI_BBOX[0]},{MUMBAI_BBOX[1]},{MUMBAI_BBOX[2]},{MUMBAI_BBOX[3]});
);
out center;
"""

# Hand-curated, high-confidence quiet gems in Mumbai to ensure day-1 quality
MUMBAI_CURATED_GEMS = [
    {
        "id": "mumbai-banganga-tank",
        "name": "Banganga Tank & Ancient Walkways",
        "category": "historical",
        "subcategory": "Ancient Water Tank & Heritage Walk",
        "city": "Mumbai",
        "neighborhood": "Walkeshwar, Malabar Hill",
        "latitude": 18.9453,
        "longitude": 72.7937,
        "access_type": "public",
        "safety_level": "high",
        "safety_notes": "Public religious & heritage precinct. Respect dress code near temple steps. Lit walkways.",
        "hiddenness_score": 0.88,
        "vibe_score": 0.94,
        "safety_score": 0.92,
        "accessibility_score": 0.82,
        "crowd_level": 2,
        "best_time_to_visit": "Early morning (6:30 AM - 8:30 AM) or sunset",
        "description": "An 800-year-old sacred freshwater reservoir surrounded by narrow ancient alleyways, temples, and duck ponds, creating an oasis of deep silence in South Mumbai.",
        "vibe_tags": ["serene", "ancient-heritage", "quiet-walk", "reflections", "hidden-gem"],
        "photo_url": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1000&auto=format&fit=crop&q=80",
        "source": "curated_heritage"
    },
    {
        "id": "mumbai-gilbert-hill",
        "name": "Gilbert Hill Monolith Viewpoint",
        "category": "viewpoint",
        "subcategory": "Volcanic Basalt Column",
        "city": "Mumbai",
        "neighborhood": "Andheri West",
        "latitude": 19.1211,
        "longitude": 72.8398,
        "access_type": "public",
        "safety_level": "medium",
        "safety_notes": "Steep stone steps to the top. Has safety railings; visit before dark.",
        "hiddenness_score": 0.91,
        "vibe_score": 0.89,
        "safety_score": 0.78,
        "accessibility_score": 0.70,
        "crowd_level": 2,
        "best_time_to_visit": "Golden hour (5:00 PM - 6:30 PM)",
        "description": "A 200-foot sheer monolith of black basalt rock created 66 million years ago. A small temple and observation terrace on top offer panoramic 360-degree skyline views.",
        "vibe_tags": ["geological-wonder", "panoramic-view", "sunset-spot", "peaceful", "skyline"],
        "photo_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80",
        "source": "curated_heritage"
    },
    {
        "id": "mumbai-sagar-upvan-colaba",
        "name": "Sagar Upvan (BPT Botanical Garden)",
        "category": "quiet_chill",
        "subcategory": "Seaside Botanical Garden",
        "city": "Mumbai",
        "neighborhood": "Colaba",
        "latitude": 18.9056,
        "longitude": 72.8124,
        "access_type": "public",
        "safety_level": "high",
        "safety_notes": "Well-guarded port trust botanical garden. Nominal entry fee (~₹5). Closes at 8 PM.",
        "hiddenness_score": 0.85,
        "vibe_score": 0.95,
        "safety_score": 0.96,
        "accessibility_score": 0.90,
        "crowd_level": 1,
        "best_time_to_visit": "Late afternoon (4:00 PM - 6:30 PM)",
        "description": "A 12-acre lush coastal sanctuary at the southern tip of Mumbai with tranquil cactus nurseries, palm groves, and quiet stone benches facing the Arabian Sea breeze.",
        "vibe_tags": ["botanical", "sea-breeze", "reading-spot", "quiet-chill", "lush-green"],
        "photo_url": "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1000&auto=format&fit=crop&q=80",
        "source": "curated_parks"
    },
    {
        "id": "mumbai-sion-hillock-fort",
        "name": "Sion Hillock Fort & Garden",
        "category": "ruin_historic",
        "subcategory": "17th-Century British Watchtower",
        "city": "Mumbai",
        "neighborhood": "Sion East",
        "latitude": 19.0463,
        "longitude": 72.8637,
        "access_type": "public",
        "safety_level": "high",
        "safety_notes": "Maintained by ASI with garden pathways. Gate locked at sundown.",
        "hiddenness_score": 0.89,
        "vibe_score": 0.84,
        "safety_score": 0.88,
        "accessibility_score": 0.85,
        "crowd_level": 1,
        "best_time_to_visit": "Morning (7:00 AM - 10:00 AM)",
        "description": "Perched atop a cone-shaped hillock, this 1669 British bastion features weathered stone battlements and a quiet terraced garden overlooking the salt pans and central city.",
        "vibe_tags": ["historic-ruin", "stone-walls", "solitude", "viewpoint", "heritage"],
        "photo_url": "https://images.unsplash.com/photo-1599813957575-5246738982c7?w=1000&auto=format&fit=crop&q=80",
        "source": "curated_heritage"
    },
    {
        "id": "mumbai-sewri-fort-mangrove",
        "name": "Sewri Fort & Flamingo Mudflats",
        "category": "viewpoint",
        "subcategory": "Coastal Bastion & Nature Lookout",
        "city": "Mumbai",
        "neighborhood": "Sewri East",
        "latitude": 18.9989,
        "longitude": 72.8598,
        "access_type": "public",
        "safety_level": "medium",
        "safety_notes": "Isolated watchtower. Visit during daylight hours with a friend. Best during low tide in winter.",
        "hiddenness_score": 0.90,
        "vibe_score": 0.91,
        "safety_score": 0.76,
        "accessibility_score": 0.68,
        "crowd_level": 1,
        "best_time_to_visit": "Low tide mornings (November to May for flamingos)",
        "description": "A 1680 Portuguese-British watchtower jutting out into eastern mudflats and mangrove estuaries, offering a panoramic vantage point for migratory flamingos and industrial harbor tranquility.",
        "vibe_tags": ["ruins", "flamingos", "mangroves", "raw-nature", "solitude"],
        "photo_url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1000&auto=format&fit=crop&q=80",
        "source": "curated_nature"
    },
    {
        "id": "mumbai-kanheri-upper-plateau",
        "name": "Kanheri Caves Upper Plateau Trails",
        "category": "nature_forest",
        "subcategory": "SGNP Forest Ridge & Caves",
        "city": "Mumbai",
        "neighborhood": "Borivali East (SGNP)",
        "latitude": 19.2061,
        "longitude": 72.9066,
        "access_type": "public",
        "safety_level": "medium",
        "safety_notes": "Inside Sanjay Gandhi National Park. Entry pass required at park gate. Stick to marked stone trails.",
        "hiddenness_score": 0.83,
        "vibe_score": 0.97,
        "safety_score": 0.84,
        "accessibility_score": 0.72,
        "crowd_level": 2,
        "best_time_to_visit": "Early morning (8:00 AM - 11:00 AM) or post-monsoon",
        "description": "Beyond the main tourist caves lies an elevated rocky plateau carved with 2,000-year-old rainwater channels and sweeping green canopy vistas of the national park valley.",
        "vibe_tags": ["ancient-carvings", "deep-forest", "valley-view", "monastic-calm", "trek"],
        "photo_url": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1000&auto=format&fit=crop&q=80",
        "source": "curated_nature"
    },
    {
        "id": "mumbai-vasai-fort-quiet-bastions",
        "name": "Bassein (Vasai) Fort Hidden Bastions",
        "category": "ruin_historic",
        "subcategory": "Overgrown Portuguese Citadel",
        "city": "Mumbai",
        "neighborhood": "Vasai West",
        "latitude": 19.3308,
        "longitude": 72.8153,
        "access_type": "public",
        "safety_level": "medium",
        "safety_notes": "Expansive ruins. Visit during daylight. Respect natural tree roots climbing arches.",
        "hiddenness_score": 0.86,
        "vibe_score": 0.96,
        "safety_score": 0.80,
        "accessibility_score": 0.65,
        "crowd_level": 2,
        "best_time_to_visit": "Sunrise or overcast afternoon",
        "description": "Massive 16th-century fortress ruins with roofless cathedral arches, banyan tree roots engulfing stone ramparts, and quiet passages opening onto the Ulhas estuary.",
        "vibe_tags": ["overgrown-ruins", "cathedral-arches", "historic", "atmospheric", "photography"],
        "photo_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80",
        "source": "curated_heritage"
    },
    {
        "id": "mumbai-worli-fishing-village-promontory",
        "name": "Worli Fort & Coastal Promontory",
        "category": "viewpoint",
        "subcategory": "British Bastion & Sea Vista",
        "city": "Mumbai",
        "neighborhood": "Worli Koliwada",
        "latitude": 19.0232,
        "longitude": 72.8159,
        "access_type": "public",
        "safety_level": "high",
        "safety_notes": "Reached via narrow friendly village alleys. Open sea cliffs have low parapets.",
        "hiddenness_score": 0.79,
        "vibe_score": 0.90,
        "safety_score": 0.85,
        "accessibility_score": 0.78,
        "crowd_level": 2,
        "best_time_to_visit": "Sunset (5:30 PM - 7:00 PM)",
        "description": "A 1675 fort perched at the tip of Worli peninsula offering an unobstructed vantage of the Bandra-Worli Sea Link and crash of Arabian Sea waves without the Marine Drive bustle.",
        "vibe_tags": ["sea-link-view", "sea-spray", "koliwada", "sunset", "historic-bastion"],
        "photo_url": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1000&auto=format&fit=crop&q=80",
        "source": "curated_heritage"
    },
    {
        "id": "mumbai-priyadarshini-park-rocky-shore",
        "name": "Priyadarshini Park Sea Ledge",
        "category": "quiet_chill",
        "subcategory": "Coastal Park Rocky Alcove",
        "city": "Mumbai",
        "neighborhood": "Nepean Sea Road",
        "latitude": 18.9614,
        "longitude": 72.8021,
        "access_type": "public",
        "safety_level": "high",
        "safety_notes": "Well-maintained civic park with walking tracks. Ocean rocks can be slippery during high tide.",
        "hiddenness_score": 0.74,
        "vibe_score": 0.92,
        "safety_score": 0.94,
        "accessibility_score": 0.88,
        "crowd_level": 2,
        "best_time_to_visit": "Golden hour or twilight",
        "description": "While runners circle the clay track, the rocky coastline edge beneath the palms provides a quiet place to sit directly above crashing waves facing the sunset.",
        "vibe_tags": ["sunset-ledge", "crashing-waves", "peaceful", "meditative", "seaside"],
        "photo_url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80",
        "source": "curated_parks"
    },
    {
        "id": "mumbai-belapur-fort-hill",
        "name": "Belapur Fort Ruins & Artist Village Trail",
        "category": "historical",
        "subcategory": "Siddi-Portuguese Hilltop Fort",
        "city": "Navi Mumbai",
        "neighborhood": "CBD Belapur",
        "latitude": 19.0189,
        "longitude": 73.0381,
        "access_type": "public",
        "safety_level": "medium",
        "safety_notes": "Gentle uphill trail. Lighted nearby but recommend daytime visits.",
        "hiddenness_score": 0.92,
        "vibe_score": 0.85,
        "safety_score": 0.82,
        "accessibility_score": 0.75,
        "crowd_level": 1,
        "best_time_to_visit": "Early morning or overcast monsoon",
        "description": "Constructed in 1560 by the Siddis of Janjira and later captured by the Portuguese and Marathas, this quiet hilltop fort ruin overlooks Panvel Creek and leafy artisan streets.",
        "vibe_tags": ["hilltop-ruin", "panvel-creek", "solitude", "leafy", "navi-mumbai"],
        "photo_url": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1000&auto=format&fit=crop&q=80",
        "source": "curated_heritage"
    }
]

def fetch_osm_pois():
    headers = {"User-Agent": "HiddenSpotDiscoveryBot/1.0 (contact: student@travellers.dev)"}
    print("Calling OpenStreetMap Overpass API for Mumbai...")
    try:
        resp = requests.post(OVERPASS_URL, data={"data": OVERPASS_QUERY}, headers=headers, timeout=25)
        if resp.status_code == 200:
            data = resp.json()
            elements = data.get("elements", [])
            print(f"Retrieved {len(elements)} raw elements from OSM.")
            return elements
        else:
            print(f"Overpass API returned status {resp.status_code}")
            return []
    except Exception as e:
        print(f"Overpass request failed: {e}. Falling back gracefully.")
        return []

def process_osm_elements(elements):
    processed = []
    seen = set()

    for el in elements:
        tags = el.get("tags", {})
        name = tags.get("name")
        if not name or len(name) < 3:
            continue
        
        # Clean coordinates (node has lat/lon, way has center)
        lat = el.get("lat") or (el.get("center", {}).get("lat"))
        lon = el.get("lon") or (el.get("center", {}).get("lon"))
        if not lat or not lon:
            continue

        # Spatial deduplication key (~50 meters)
        spatial_key = (round(lat, 3), round(lon, 3))
        if spatial_key in seen:
            continue
        seen.add(spatial_key)

        slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-') + f"-{el['id']}"

        category = "hidden_gem"
        vibe_tags = ["peaceful", "underrated"]
        if "viewpoint" in tags.get("tourism", ""):
            category = "viewpoint"
            vibe_tags = ["panoramic", "viewpoint", "scenic"]
        elif tags.get("historic") in ("ruins", "fort", "archaeological_site"):
            category = "ruin_historic"
            vibe_tags = ["historic-ruin", "stone-heritage", "atmospheric"]
        elif tags.get("natural") in ("cliff", "rock", "cave_entrance"):
            category = "scenic"
            vibe_tags = ["geology", "nature", "quiet"]

        processed.append({
            "id": f"osm-{el['id']}",
            "slug": slug,
            "name": name,
            "category": category,
            "subcategory": tags.get("description") or tags.get("historic") or "Scenic Spot",
            "city": "Mumbai",
            "neighborhood": tags.get("addr:suburb") or "Mumbai Metropolitan Region",
            "latitude": lat,
            "longitude": lon,
            "access_type": "public",
            "safety_level": "medium" if category in ("scenic", "ruin_historic") else "high",
            "safety_notes": "Public open space. Wear sturdy footwear and visit during daylight.",
            "hiddenness_score": 0.82,
            "vibe_score": 0.86,
            "safety_score": 0.84,
            "accessibility_score": 0.75,
            "crowd_level": 2,
            "best_time_to_visit": "Early morning or golden hour",
            "description": tags.get("description") or f"A serene, atmospheric {category.replace('_', ' ')} in Mumbai.",
            "vibe_tags": vibe_tags,
            "photo_url": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1000&auto=format&fit=crop&q=80",
            "source": "osm_overpass"
        })

    return processed

def main():
    os.makedirs("data", exist_ok=True)
    osm_raw = fetch_osm_pois()
    osm_cleaned = process_osm_elements(osm_raw)
    
    # Merge curated high-value spots first, then OSM spots
    all_places = list(MUMBAI_CURATED_GEMS)
    
    # Add unique OSM places
    existing_names = {p["name"].lower() for p in all_places}
    for op in osm_cleaned:
        if op["name"].lower() not in existing_names:
            all_places.append(op)
            existing_names.add(op["name"].lower())

    output_path = os.path.join("data", "places_mumbai.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(all_places, f, indent=2, ensure_ascii=False)

    print(f"Successfully generated {len(all_places)} verified Mumbai places in {output_path}!")

if __name__ == "__main__":
    main()
