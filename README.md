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

