# KHOJ | खोज · Hyperlocal Discovery & Urban Transit Engine
> **A high-performance geospatial web app mapping 460+ verified hidden sanctuaries, heritage forts, viewpoints, and urban transit corridors across the Mumbai Metropolitan Region.**  LINK - (https://khoj-dusky.vercel.app/)

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet)](https://leafletjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-PostGIS-336791?style=for-the-badge&logo=postgresql)](https://postgis.net/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🌟 Executive Summary & Engineering Highlights

**KHOJ (खोज)** is an urban mobility and geospatial exploration platform designed specifically for Mumbai commuters, foodies, and explorers. It solves the fragmentation of local travel by combining curated hidden sanctuaries with station-by-station transit corridors (Western, Central, Harbour local lines and Metro Lines 1, 2A, 7, 3).

### Key Architectural Achievements:
- **460+ Ground-Truth Curated Sanctuaries:** Station-by-station micro-batched hidden gems, heritage forts, viewpoints, historic bazaars, and classic permit rooms audited against physical locations with **0 ghost venues**, **0 railway track markers**, and **0 cross-city drift**.
- **Multi-Tier Edge & Spatial Architecture:** 
  - **L1 (Client):** IndexedDB browser caching for instant `<5ms` offline-resilient map reloads.
  - **L2 (Edge CDN):** Vercel Edge caching (`s-maxage=3600`) for sub-30ms global payload delivery.
  - **L3 (Database):** Native PostgreSQL 16 + PostGIS spatial indexing (`ST_DWithin`, GIST R-Trees) on AWS Mumbai (`ap-south-1`).
- **Dynamic 2-Tier Payload Delivery:** Lightweight marker skeleton (`~35 KB`) for 60fps initial map rendering, with on-demand hydration for detailed reviews, menus, and safety notes.
- **Mobile-First Adaptive Drawer UX:** Responsive bottom sheet that seamlessly transitions between an unobtrusive **Peek Card (~130px)** leaving 80% of the screen for the interactive map, and an **Expanded View** with Google Maps reviews and turn-by-turn navigation.
- **Clean Transit Proximity Engine:** Dynamically calculates the single closest transit hub (Local Suburban Train vs. Metro), rendering an elegant directional walking connector with walking duration estimates.

---



## 🛠️ Tech Stack & Tools

- **Framework:** Next.js 14 (App Router, Server Components, Route Handlers)
- **Language:** TypeScript 5 (Strict Mode, 100% type coverage)
- **Styling:** Tailwind CSS with custom Desi Pop / Matchbox risograph aesthetic (`#FAF6EE` Wabi, `#141518` Sumi, `#BE123C` Crimson)
- **Geospatial Mapping:** Leaflet.js with CartoDB Voyager tiles (Zero-billing API guarantee)
- **Database & Spatial Engine:** PostgreSQL 16 + PostGIS, `pg_trgm` trigram indexing
- **Automated Validation:** Python CI dataset provenance & boundary integrity test suite (`scripts/validate_dataset_integrity.py`)
- **Icons & UI:** Lucide React, Tactile spring micro-interactions

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/omkamble0/khoj-.git
cd khoj-
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001`) in your browser.

### 4. Run Production Build Verification
```bash
npm run build
```

---

## 📂 Project Structure

```
├── app/
│   ├── api/places/nearby/      # Radius & bounding-box spatial retrieval
│   ├── api/places/skeleton/    # Ultra-lightweight Tier 1 marker payload (<35 KB)
│   ├── api/places/[id]/        # On-demand Tier 2 venue detail hydration
│   ├── layout.tsx              # Root HTML layout with viewport & PWA meta
│   └── page.tsx                # Main Discovery Map interactive experience
├── components/
│   ├── discovery/              # Header, FilterBar, PlaceCardDrawer, RastaRoulette
│   ├── map/                    # Leaflet DiscoveryMap, DynamicMap wrapper
│   └── transit/                # TactileSliderBar, Transit filters
├── data/
│   ├── places_mumbai.json      # Master single-source-of-truth dataset (610+ places)
│   └── places_mumbai/          # Modularized domain subsets (fastfood, cafes, heritage)
├── lib/
│   ├── scoring.ts              # Composite ranking algorithm (distance decay, crowd score)
│   ├── supabase.ts             # Cloud PostGIS client with zero-downtime local fallback
│   ├── transit.ts              # Mumbai suburban & metro station graph & routing
│   └── types.ts                # TypeScript interfaces & domain models
├── scripts/
│   ├── seed_*_batch.js         # Verified station-by-station micro-batch seeders
│   └── validate_dataset_integrity.py # Dataset boundary & provenance assertion suite
└── supabase/
    └── schema.sql              # Production PostGIS schema, GIST indexes & RLS rules
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
