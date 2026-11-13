# HiddenSpot: Mumbai Edition
> Discover quiet, scenic, atmospheric, and underrated local spots across Mumbai without the crowds or tourist traps.

---

## What We Built

- **Interactive Discovery Map:** Built with Leaflet.js and CartoDB Voyager tiles (100% free, no credit card or paid map API keys required).
- **Curated & Safe Data Strategy:** Pre-seeded with 15 verified, public-access, safe, and atmospheric hidden gems in Mumbai (Banganga ancient walkways, Gilbert Hill volcanic basalt column, Sewri flamingo mudflats & fort, Sagar Upvan coastal garden, Bassein/Vasai quiet overgrown bastions, Kanheri upper plateau trails, and more).
- **Data-Driven Scoring Algorithm:** Places are ranked dynamically based on hiddenness (30%), atmospheric vibe (20%), safety level (20%), distance decay (15%), accessibility (10%), and source trust (5%).
- **Radius & Vibe Filters:** Filter by 5km, 10km, 20km, 40km, category pills (Quiet & Calm, Viewpoints, Heritage & Forts, Forest Trails, Lakeside/Sea), and low-crowd toggle.
- **Safety & Access Verification:** Every location has an explicit public access label (`Public & Safe`, `Daylight / Care Required`) and an instant "Report Issue" modal to flag private property or closed trails.
- **One-Click Turn-by-Turn Navigation:** Deep links directly into Google Maps or Apple Maps without requiring complex routing servers.
- **Offline / Local Favorites:** Save favorite spots directly to your browser without needing to sign up.

---

## Tech Stack 

- **Frontend:** Next.js 14 (App Router, React 18, TypeScript, Tailwind CSS)
- **Map:** Leaflet.js with CartoDB Voyager raster tiles
- **Database / PostGIS Ready:** Schema included in `db/schema.sql` for 1-click import into Supabase free tier.
- **Data Ingestion:** Python script in `scripts/ingest_mumbai.py` for Overpass API querying.

---

## Quickstart

### 1. Install dependencies (already installed)
```bash
npm install
```

### 2. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Re-run Mumbai Ingestion Script
To fetch updated OpenStreetMap tags or add new locations:
```bash
python scripts/ingest_mumbai.py
```

---

## Fast-Food Chain Ingestion Pipeline (OpenStreetMap Overpass)

An automated, non-destructive ingestion pipeline to retrieve and stage top fast-food chains (**McDonald's, Burger King, KFC, Subway, Domino's Pizza**) across the Mumbai Metropolitan Region (MMR) via the OpenStreetMap (OSM) Overpass API.

### Key Principles & Safety Guardrails
- **Zero Scraping:** Strictly uses legal, open OSM Overpass API endpoints. Never scrapes Google Maps or Google Places.
- **Dry-Run by Default:** Running the script without flags modifies **0 files** and makes **0 database writes**.
- **Candidate Status (No Hallucinations):** Sourced places are tagged with `verification_status: 'candidate_unverified'` and display an attribution badge (`⚠️ OpenStreetMap Candidate (Unverified)`) in the UI drawer with a direct link to the OSM node/way.
- **Curated Preservation:** Curated records (`hub-*`, `mcd-*`, `mumbai-*`) are **never overwritten**.
- **Dual-Mapping Deduplication:** OSM mappers often map a venue as both an internal node and a building way. Outlets within 25 meters of each other are deduplicated automatically, prioritizing polygon/way footprints over simple point nodes.
- **Proximity Flagging:** Outlets within 40m (or 80m for same-brand) of an existing curated spot are flagged with `possible_duplicate_of` for human review rather than merged blindly.
- **ODbL Attribution:** Complies with OpenStreetMap copyright requirements by attributing `© OpenStreetMap contributors` with links to `https://www.openstreetmap.org/copyright`.

### Running the Pipeline

#### 1. Dry Run (Safe Inspection - Default)
Fetches candidates from Overpass, runs parsing, brand matching, bounding-box validation, and prints a statistical summary without writing any files:
```bash
python scripts/ingest_fastfood_chains.py
```

#### 2. Apply Candidates to Staging File
Writes validated candidate records to `data/places_mumbai/fastfood.json`:
```bash
python scripts/ingest_fastfood_chains.py --apply
```

#### 3. Offline Testing with Sample Fixtures
Run ingestion completely offline against mocked OSM API output:
```bash
python scripts/ingest_fastfood_chains.py --fixture tests/fixtures/overpass_sample.json
```

#### 4. Custom Bounding Box & Target Brands
```bash
# Example: Only McDonald's and KFC in Bandra/Khar bounding box
python scripts/ingest_fastfood_chains.py --brands mcdonalds,kfc --bbox 19.04,72.81,19.08,72.85
```

### Running the Automated Test Suite
A comprehensive Python unit test suite validates brand regex matching, disused/abandoned filtering, geo-fence enforcement, way center coordinate extraction, stable ID formatting, internal deduplication, and dry-run file isolation:
```bash
python tests/test_fastfood_ingest.py
```

### Supabase Production Ingestion & Security
- **Service Role Secret Only:** Direct writes to Supabase require the `SUPABASE_SERVICE_ROLE_KEY` environment variable (never the public `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- When credentials are not provided, candidates remain safely staged in `data/places_mumbai/fastfood.json` where they can be reviewed and loaded through local bundles.

### Known Limitations & Manual Review Steps
1. **Operating Hours & Phone Numbers:** OSM coverage for Indian fast-food branches often omits `opening_hours` or official contact details. Missing fields are left `undefined` rather than fabricated.
2. **Ghost Outlets & Closures:** OSM data can lag behind reality. Outlets tagged `disused:amenity` or `abandoned:amenity` are filtered out automatically, but permanently closed branches without OSM updates will still appear as unverified candidates until flagged by users or verified via field checks.
3. **Malls & Food Courts:** OSM nodes inside malls often lack exact floor or unit numbers. Outlets detected within known mall perimeters retain unverified status until verified against mall directory layouts.

---

### 4. Deploying to Vercel for Free ($0)
1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: HiddenSpot Mumbai MVP"
   git remote add origin https://github.com/<your-username>/hidden-spot.git
   git push -u origin main
   ```
2. Import the repository into [Vercel](https://vercel.com).
3. Vercel automatically detects Next.js and deploys it with SSL, edge caching, and serverless API routes at $0 cost!

