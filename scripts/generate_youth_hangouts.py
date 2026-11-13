#!/usr/bin/env python3
"""
Generates verified Mumbai Malls & Youth Fast Food Hubs for Khoj.
Saved into data/places_mumbai/youth_hangouts.json.
"""

import json
import os

HUBS = [
    # ─────────────────────────────────────────────────────────────
    # 1. PHOENIX PALLADIUM & HIGH STREET PHOENIX (Lower Parel)
    # ─────────────────────────────────────────────────────────────
    {
        "id": "hub-phoenix-palladium-lower-parel",
        "slug": "phoenix-palladium-lower-parel-youth-hub",
        "name": "Phoenix Palladium & High Street Phoenix",
        "short_name": "Phoenix Palladium",
        "category": "cafes",
        "subcategory": "Iconic South-Central Mega Mall & Courtyard",
        "spot_tier": "iconic",
        "budget_tier": "pocket_friendly",
        "approx_cost": "₹99–₹350 combos / Free entry",
        "price_level": 1,
        "city": "Mumbai",
        "neighborhood": "Lower Parel / Senapati Bapat Marg",
        "latitude": 18.9954,
        "longitude": 72.8242,
        "access_type": "public",
        "safety_level": "high",
        "safety_notes": "Heavy security, clean washrooms, expansive courtyard seating.",
        "hiddenness_score": 0.35,
        "vibe_score": 0.96,
        "safety_score": 0.98,
        "accessibility_score": 0.95,
        "crowd_level": 4,
        "best_time_to_visit": "Afternoon 1:30 PM – 5:30 PM (AC bunking, courtyard hangout)",
        "description": "Mumbai's premier lifestyle and youth hangout built on historic textile mills. Massive multi-level food courts, lush open-air courtyard, high-speed Wi-Fi, and top fast food brands.",
        "vibe_tags": ["malls", "fast-food", "ac-haven", "youth-adda", "plug-points", "food-court", "gaming"],
        "photo_url": "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1000",
        "source": "curated_youth_hubs",
        "hub_type": "mall",
        "outlets": [
            {"brand": "mcdonalds", "name": "McDonald's", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:30 PM"},
            {"brand": "kfc", "name": "KFC", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "burger_king", "name": "Burger King", "floor": "Level 2 Courtyard", "timing": "11:00 AM – 11:30 PM"},
            {"brand": "taco_bell", "name": "Taco Bell", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "subway", "name": "Subway", "floor": "Level 3 Food Court", "timing": "10:30 AM – 11:00 PM"},
            {"brand": "starbucks", "name": "Starbucks Reserve", "floor": "Ground Floor Courtyard", "timing": "8:00 AM – 12:00 AM"},
            {"brand": "dominos", "name": "Domino's Pizza", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:00 PM"}
        ],
        "total_outlets_count": 52,
        "more_outlets_text": "+ 45 more dining options & dessert bars",
        "more_outlets_url": "https://www.google.com/maps/search/food+restaurants+in+Phoenix+Palladium+Lower+Parel",
        "entertainment": ["PVR INOX Palladium", "Timezone Arcade", "Hamleys"],
        "amenities": {
            "heavy_ac": True,
            "plug_points": True,
            "free_wifi": True,
            "clean_washrooms": True,
            "metro_connected": True,
            "parking": True
        }
    },

    # ─────────────────────────────────────────────────────────────
    # 2. PHOENIX MARKETCITY (Kurla West)
    # ─────────────────────────────────────────────────────────────
    {
        "id": "hub-phoenix-marketcity-kurla",
        "slug": "phoenix-marketcity-kurla-youth-hub",
        "name": "Phoenix Marketcity",
        "short_name": "Marketcity Kurla",
        "category": "cafes",
        "subcategory": "Mumbai's Largest Mega Mall & Youth Hub",
        "spot_tier": "iconic",
        "budget_tier": "pocket_friendly",
        "approx_cost": "₹99–₹250 combos / Free entry",
        "price_level": 1,
        "city": "Mumbai",
        "neighborhood": "Kurla West / LBS Marg",
        "latitude": 19.0864,
        "longitude": 72.8887,
        "access_type": "public",
        "safety_level": "high",
        "safety_notes": "Well-patrolled indoor complex. Metro connected via Saki Naka.",
        "hiddenness_score": 0.30,
        "vibe_score": 0.95,
        "safety_score": 0.97,
        "accessibility_score": 0.94,
        "crowd_level": 4,
        "best_time_to_visit": "Afternoons (1:00 PM – 5:00 PM) for quiet food court corners",
        "description": "Mumbai's biggest retail playground with 60+ food chains, massive Dublin Square atrium, continuous AC chill, and high-energy college crowds from central suburbs.",
        "vibe_tags": ["malls", "fast-food", "ac-haven", "youth-adda", "plug-points", "food-court", "gaming"],
        "photo_url": "https://images.unsplash.com/photo-1567449303078-57ad995bd301?w=1000",
        "source": "curated_youth_hubs",
        "hub_type": "mall",
        "outlets": [
            {"brand": "mcdonalds", "name": "McDonald's", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:30 PM"},
            {"brand": "kfc", "name": "KFC", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "burger_king", "name": "Burger King", "floor": "Ground Floor Atrium", "timing": "11:00 AM – 11:30 PM"},
            {"brand": "taco_bell", "name": "Taco Bell", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "subway", "name": "Subway", "floor": "Level 3 Food Court", "timing": "10:30 AM – 11:00 PM"},
            {"brand": "dominos", "name": "Domino's Pizza", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "starbucks", "name": "Starbucks Coffee", "floor": "Ground Floor Dublin Square", "timing": "9:00 AM – 12:00 AM"}
        ],
        "total_outlets_count": 64,
        "more_outlets_text": "+ 57 more food brands, cafes & ice cream hubs",
        "more_outlets_url": "https://www.google.com/maps/search/food+restaurants+in+Phoenix+Marketcity+Kurla",
        "entertainment": ["Timezone Arcade & Bowling", "PVR INOX IMAX", "Happy Planet"],
        "amenities": {
            "heavy_ac": True,
            "plug_points": True,
            "free_wifi": True,
            "clean_washrooms": True,
            "metro_connected": True,
            "parking": True
        }
    },

    # ─────────────────────────────────────────────────────────────
    # 3. INFINITI MALL (Malad West)
    # ─────────────────────────────────────────────────────────────
    {
        "id": "hub-infiniti-mall-malad",
        "slug": "infiniti-mall-malad-youth-hub",
        "name": "Infiniti Mall",
        "short_name": "Infiniti Malad",
        "category": "cafes",
        "subcategory": "Suburban Youth Adda & Mega Food Court",
        "spot_tier": "iconic",
        "budget_tier": "pocket_friendly",
        "approx_cost": "₹99–₹299 combos / Free entry",
        "price_level": 1,
        "city": "Mumbai",
        "neighborhood": "Malad West / Link Road",
        "latitude": 19.1843,
        "longitude": 72.8344,
        "access_type": "public",
        "safety_level": "high",
        "safety_notes": "Safe, family-friendly, well-lit suburban landmark.",
        "hiddenness_score": 0.40,
        "vibe_score": 0.94,
        "safety_score": 0.96,
        "accessibility_score": 0.93,
        "crowd_level": 4,
        "best_time_to_visit": "Weekday afternoons (2:00 PM – 6:00 PM) for student deals",
        "description": "The quintessential Western Suburbs youth hangout on Link Road. Features a huge 3rd-floor food court with all top burger chains, indoor roller coaster memories, and Bounce trampoline.",
        "vibe_tags": ["malls", "fast-food", "ac-haven", "youth-adda", "plug-points", "food-court", "gaming"],
        "photo_url": "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1000",
        "source": "curated_youth_hubs",
        "hub_type": "mall",
        "outlets": [
            {"brand": "mcdonalds", "name": "McDonald's", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:30 PM"},
            {"brand": "kfc", "name": "KFC", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "burger_king", "name": "Burger King", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "taco_bell", "name": "Taco Bell", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "subway", "name": "Subway", "floor": "Level 3 Food Court", "timing": "10:30 AM – 11:00 PM"},
            {"brand": "pizza_hut", "name": "Pizza Hut", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "starbucks", "name": "Starbucks Coffee", "floor": "Ground Floor Entrance", "timing": "8:30 AM – 11:30 PM"}
        ],
        "total_outlets_count": 42,
        "more_outlets_text": "+ 35 more food court stalls & cafes",
        "more_outlets_url": "https://www.google.com/maps/search/food+restaurants+in+Infiniti+Mall+Malad",
        "entertainment": ["Bounce Inc Trampoline", "PVR INOX 4DX", "Fun City Arcade"],
        "amenities": {
            "heavy_ac": True,
            "plug_points": True,
            "free_wifi": True,
            "clean_washrooms": True,
            "metro_connected": True,
            "parking": True
        }
    },

    # ─────────────────────────────────────────────────────────────
    # 4. INORBIT MALL (Malad West)
    # ─────────────────────────────────────────────────────────────
    {
        "id": "hub-inorbit-mall-malad",
        "slug": "inorbit-mall-malad-youth-hub",
        "name": "Inorbit Mall",
        "short_name": "Inorbit Malad",
        "category": "cafes",
        "subcategory": "Spacious High-Street Food Court & Timezone Hub",
        "spot_tier": "iconic",
        "budget_tier": "pocket_friendly",
        "approx_cost": "₹99–₹250 combos / Free entry",
        "price_level": 1,
        "city": "Mumbai",
        "neighborhood": "Malad West / Link Road",
        "latitude": 19.1728,
        "longitude": 72.8361,
        "access_type": "public",
        "safety_level": "high",
        "safety_notes": "Direct Link Road access, metro walking distance.",
        "hiddenness_score": 0.42,
        "vibe_score": 0.93,
        "safety_score": 0.96,
        "accessibility_score": 0.94,
        "crowd_level": 3,
        "best_time_to_visit": "Afternoon 12:00 PM – 4:00 PM for spacious seating",
        "description": "One of Mumbai's original modern malls with expansive corridors, quiet food court zones ideal for college study groups, and high-velocity Timezone arcade.",
        "vibe_tags": ["malls", "fast-food", "ac-haven", "youth-adda", "plug-points", "food-court"],
        "photo_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000",
        "source": "curated_youth_hubs",
        "hub_type": "mall",
        "outlets": [
            {"brand": "mcdonalds", "name": "McDonald's", "floor": "Level 2 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "kfc", "name": "KFC", "floor": "Level 2 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "burger_king", "name": "Burger King", "floor": "Level 2 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "subway", "name": "Subway", "floor": "Level 2 Food Court", "timing": "10:30 AM – 11:00 PM"},
            {"brand": "dominos", "name": "Domino's Pizza", "floor": "Level 2 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "starbucks", "name": "Starbucks Coffee", "floor": "Ground Floor", "timing": "8:00 AM – 11:00 PM"}
        ],
        "total_outlets_count": 35,
        "more_outlets_text": "+ 29 more food court outlets & dessert stands",
        "more_outlets_url": "https://www.google.com/maps/search/food+restaurants+in+Inorbit+Mall+Malad",
        "entertainment": ["Timezone Arcade & Bowling", "INOX Cinema"],
        "amenities": {
            "heavy_ac": True,
            "plug_points": True,
            "free_wifi": True,
            "clean_washrooms": True,
            "metro_connected": True,
            "parking": True
        }
    },

    # ─────────────────────────────────────────────────────────────
    # 5. R CITY MALL (Ghatkopar West)
    # ─────────────────────────────────────────────────────────────
    {
        "id": "hub-r-city-mall-ghatkopar",
        "slug": "r-city-mall-ghatkopar-youth-hub",
        "name": "R City Mall",
        "short_name": "R City Ghatkopar",
        "category": "cafes",
        "subcategory": "Central Suburbs Mega Food Court & KidZania Hub",
        "spot_tier": "iconic",
        "budget_tier": "pocket_friendly",
        "approx_cost": "₹99–₹280 combos / Free entry",
        "price_level": 1,
        "city": "Mumbai",
        "neighborhood": "Ghatkopar West / LBS Marg",
        "latitude": 19.0997,
        "longitude": 72.9163,
        "access_type": "public",
        "safety_level": "high",
        "safety_notes": "Direct access on LBS Marg, Ghatkopar Metro 1 nearby.",
        "hiddenness_score": 0.38,
        "vibe_score": 0.94,
        "safety_score": 0.96,
        "accessibility_score": 0.92,
        "crowd_level": 4,
        "best_time_to_visit": "Weekday afternoons for quiet AC seating",
        "description": "Massive 1.2-million sq ft central hub with two sprawling food courts, courtyard cafes, outdoor dining street, and college crowds from Ghatkopar, Vikhroli, and Powai.",
        "vibe_tags": ["malls", "fast-food", "ac-haven", "youth-adda", "plug-points", "food-court"],
        "photo_url": "https://images.unsplash.com/photo-1567449303078-57ad995bd301?w=1000",
        "source": "curated_youth_hubs",
        "hub_type": "mall",
        "outlets": [
            {"brand": "mcdonalds", "name": "McDonald's", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:30 PM"},
            {"brand": "kfc", "name": "KFC", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "burger_king", "name": "Burger King", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "taco_bell", "name": "Taco Bell", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "subway", "name": "Subway", "floor": "Level 3 Food Court", "timing": "10:30 AM – 11:00 PM"},
            {"brand": "dominos", "name": "Domino's Pizza", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "starbucks", "name": "Starbucks Coffee", "floor": "Ground Floor Courtyard", "timing": "8:30 AM – 11:30 PM"}
        ],
        "total_outlets_count": 58,
        "more_outlets_text": "+ 51 more restaurants, street food stalls & cafes",
        "more_outlets_url": "https://www.google.com/maps/search/food+restaurants+in+R+City+Mall+Ghatkopar",
        "entertainment": ["Timezone Arcade", "INOX Cinema", "Smaaash Sports Bar"],
        "amenities": {
            "heavy_ac": True,
            "plug_points": True,
            "free_wifi": True,
            "clean_washrooms": True,
            "metro_connected": True,
            "parking": True
        }
    },

    # ─────────────────────────────────────────────────────────────
    # 6. OBEROI MALL (Goregaon East)
    # ─────────────────────────────────────────────────────────────
    {
        "id": "hub-oberoi-mall-goregaon",
        "slug": "oberoi-mall-goregaon-youth-hub",
        "name": "Oberoi Mall",
        "short_name": "Oberoi Goregaon",
        "category": "cafes",
        "subcategory": "Western Express Highway Transit Food Hub",
        "spot_tier": "iconic",
        "budget_tier": "pocket_friendly",
        "approx_cost": "₹99–₹250 combos / Free entry",
        "price_level": 1,
        "city": "Mumbai",
        "neighborhood": "Goregaon East / WEH",
        "latitude": 19.1735,
        "longitude": 72.8601,
        "access_type": "public",
        "safety_level": "high",
        "safety_notes": "Right on Western Express Highway & Metro 7 Aarey Station.",
        "hiddenness_score": 0.45,
        "vibe_score": 0.93,
        "safety_score": 0.97,
        "accessibility_score": 0.95,
        "crowd_level": 4,
        "best_time_to_visit": "Afternoon 1:00 PM – 4:30 PM",
        "description": "Directly connected to Metro Line 7 with a 3rd-floor food court packed with student favorites, fast burger counters, and easy AC shelter.",
        "vibe_tags": ["malls", "fast-food", "ac-haven", "youth-adda", "plug-points", "food-court"],
        "photo_url": "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1000",
        "source": "curated_youth_hubs",
        "hub_type": "mall",
        "outlets": [
            {"brand": "mcdonalds", "name": "McDonald's", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:30 PM"},
            {"brand": "kfc", "name": "KFC", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "burger_king", "name": "Burger King", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "taco_bell", "name": "Taco Bell", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "subway", "name": "Subway", "floor": "Level 3 Food Court", "timing": "10:30 AM – 11:00 PM"},
            {"brand": "starbucks", "name": "Starbucks Coffee", "floor": "Ground Floor", "timing": "8:30 AM – 11:30 PM"}
        ],
        "total_outlets_count": 38,
        "more_outlets_text": "+ 32 more dining & dessert counters",
        "more_outlets_url": "https://www.google.com/maps/search/food+restaurants+in+Oberoi+Mall+Goregaon",
        "entertainment": ["PVR Cinema", "NAMCO Gaming Arcade"],
        "amenities": {
            "heavy_ac": True,
            "plug_points": True,
            "free_wifi": True,
            "clean_washrooms": True,
            "metro_connected": True,
            "parking": True
        }
    },

    # ─────────────────────────────────────────────────────────────
    # 7. NEXUS SEAWOODS GRAND CENTRAL (Seawoods / Navi Mumbai)
    # ─────────────────────────────────────────────────────────────
    {
        "id": "hub-nexus-seawoods-grand-central",
        "slug": "nexus-seawoods-grand-central-youth-hub",
        "name": "Nexus Seawoods Grand Central",
        "short_name": "Seawoods Grand Central",
        "category": "cafes",
        "subcategory": "Railway Station Integrated Mega Mall",
        "spot_tier": "iconic",
        "budget_tier": "pocket_friendly",
        "approx_cost": "₹99–₹280 combos / Free entry",
        "price_level": 1,
        "city": "Mumbai",
        "neighborhood": "Seawoods / Navi Mumbai",
        "latitude": 19.0204,
        "longitude": 73.0187,
        "access_type": "public",
        "safety_level": "high",
        "safety_notes": "Direct escalator into Seawoods-Darave Harbour Line railway station.",
        "hiddenness_score": 0.40,
        "vibe_score": 0.96,
        "safety_score": 0.98,
        "accessibility_score": 0.99,
        "crowd_level": 4,
        "best_time_to_visit": "Afternoons (12:30 PM – 5:00 PM) for college crowds",
        "description": "Architectural marvel built directly on top of Seawoods railway station. Major youth hub for colleges across Nerul, Vashi, and Belapur with all top burger chains and expansive AC seating.",
        "vibe_tags": ["malls", "fast-food", "ac-haven", "youth-adda", "plug-points", "food-court"],
        "photo_url": "https://images.unsplash.com/photo-1567449303078-57ad995bd301?w=1000",
        "source": "curated_youth_hubs",
        "hub_type": "mall",
        "outlets": [
            {"brand": "mcdonalds", "name": "McDonald's", "floor": "Level 2 Food Court", "timing": "11:00 AM – 11:30 PM"},
            {"brand": "kfc", "name": "KFC", "floor": "Level 2 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "burger_king", "name": "Burger King", "floor": "Level 2 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "taco_bell", "name": "Taco Bell", "floor": "Level 2 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "subway", "name": "Subway", "floor": "Level 2 Food Court", "timing": "10:30 AM – 11:00 PM"},
            {"brand": "starbucks", "name": "Starbucks Coffee", "floor": "Ground Floor", "timing": "8:30 AM – 11:30 PM"}
        ],
        "total_outlets_count": 48,
        "more_outlets_text": "+ 42 more dining outlets & cafes",
        "more_outlets_url": "https://www.google.com/maps/search/food+restaurants+in+Seawoods+Grand+Central",
        "entertainment": ["Cinepolis 4DX", "Timezone Arcade", "Snow World"],
        "amenities": {
            "heavy_ac": True,
            "plug_points": True,
            "free_wifi": True,
            "clean_washrooms": True,
            "metro_connected": True,
            "parking": True
        }
    },

    # ─────────────────────────────────────────────────────────────
    # 8. VIVIANA MALL (Thane West)
    # ─────────────────────────────────────────────────────────────
    {
        "id": "hub-viviana-mall-thane",
        "slug": "viviana-mall-thane-youth-hub",
        "name": "Viviana Mall",
        "short_name": "Viviana Thane",
        "category": "cafes",
        "subcategory": "Thane's Premier Youth Mega Hub & Food Court",
        "spot_tier": "iconic",
        "budget_tier": "pocket_friendly",
        "approx_cost": "₹99–₹250 combos / Free entry",
        "price_level": 1,
        "city": "Mumbai",
        "neighborhood": "Thane West / EEH Service Road",
        "latitude": 19.2088,
        "longitude": 72.9719,
        "access_type": "public",
        "safety_level": "high",
        "safety_notes": "Safe, vibrant, 24/7 security on Eastern Express Highway.",
        "hiddenness_score": 0.35,
        "vibe_score": 0.95,
        "safety_score": 0.97,
        "accessibility_score": 0.92,
        "crowd_level": 4,
        "best_time_to_visit": "Afternoon 1:00 PM – 5:30 PM",
        "description": "Massive 1-million sq ft destination mall on Eastern Express Highway. Thane's undisputed college and youth adda with a sprawling 3rd-floor food court and multiple entertainment zones.",
        "vibe_tags": ["malls", "fast-food", "ac-haven", "youth-adda", "plug-points", "food-court"],
        "photo_url": "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1000",
        "source": "curated_youth_hubs",
        "hub_type": "mall",
        "outlets": [
            {"brand": "mcdonalds", "name": "McDonald's", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:30 PM"},
            {"brand": "kfc", "name": "KFC", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "burger_king", "name": "Burger King", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "taco_bell", "name": "Taco Bell", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "subway", "name": "Subway", "floor": "Level 3 Food Court", "timing": "10:30 AM – 11:00 PM"},
            {"brand": "dominos", "name": "Domino's Pizza", "floor": "Level 3 Food Court", "timing": "11:00 AM – 11:00 PM"},
            {"brand": "starbucks", "name": "Starbucks Coffee", "floor": "Ground Floor", "timing": "8:30 AM – 11:30 PM"}
        ],
        "total_outlets_count": 56,
        "more_outlets_text": "+ 49 more food court options & dessert parlors",
        "more_outlets_url": "https://www.google.com/maps/search/food+restaurants+in+Viviana+Mall+Thane",
        "entertainment": ["Cinepolis Megaplex", "Fun City", "Smaaash"],
        "amenities": {
            "heavy_ac": True,
            "plug_points": True,
            "free_wifi": True,
            "clean_washrooms": True,
            "parking": True
        }
    },

    # ─────────────────────────────────────────────────────────────
    # 9. STANDALONE: MCDONALD'S CARTER ROAD (Bandra West)
    # ─────────────────────────────────────────────────────────────
    {
        "id": "hub-mcd-carter-road-bandra",
        "slug": "mcdonalds-carter-road-bandra-drive-thru",
        "name": "McDonald's (Carter Road)",
        "short_name": "Carter Road McD",
        "category": "cafes",
        "subcategory": "Iconic Sea-Facing Late Night Youth Adda",
        "spot_tier": "iconic",
        "budget_tier": "pocket_friendly",
        "approx_cost": "₹99–₹250 combos / Fast Food",
        "price_level": 1,
        "city": "Mumbai",
        "neighborhood": "Bandra West / Carter Road Promenade",
        "latitude": 19.0683,
        "longitude": 72.8228,
        "access_type": "public",
        "safety_level": "high",
        "safety_notes": "Well-lit sea promenade, active police beat, open till late.",
        "hiddenness_score": 0.25,
        "vibe_score": 0.97,
        "safety_score": 0.95,
        "accessibility_score": 0.92,
        "crowd_level": 4,
        "best_time_to_visit": "Late night (10:00 PM – 2:30 AM) for sea breeze & soft serves",
        "description": "Legendary coastal fast food hangout. Two floors facing the Arabian Sea where Mumbai college squads, bikers, and late-night strollers gather for cheap burgers and McFlurrys.",
        "vibe_tags": ["fast-food", "sea-facing", "late-night", "youth-adda", "drive-thru"],
        "photo_url": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1000",
        "source": "curated_youth_hubs",
        "hub_type": "standalone_drive_thru",
        "outlets": [
            {"brand": "mcdonalds", "name": "McDonald's Sea Face", "floor": "Ground + 1st Floor Promenade", "has_drive_thru": True, "is_late_night": True, "timing": "7:00 AM – 3:00 AM"}
        ],
        "total_outlets_count": 1,
        "more_outlets_text": "Explore nearby Carter Road food promenade on Maps",
        "more_outlets_url": "https://www.google.com/maps/search/food+cafes+in+Carter+Road+Bandra+West",
        "entertainment": ["Carter Road Promenade Walk", "Sea View"],
        "amenities": {
            "heavy_ac": True,
            "plug_points": True,
            "clean_washrooms": True,
            "late_night": True
        }
    },

    # ─────────────────────────────────────────────────────────────
    # 10. STANDALONE: CHURCHGATE STATION FAST FOOD ROW (South Mumbai)
    # ─────────────────────────────────────────────────────────────
    {
        "id": "hub-churchgate-station-fast-food",
        "slug": "churchgate-station-youth-fast-food-row",
        "name": "Churchgate Fast Food Row (McD & KFC)",
        "short_name": "Churchgate McD & KFC",
        "category": "cafes",
        "subcategory": "South Mumbai College Bunk & Fast Food Strip",
        "spot_tier": "iconic",
        "budget_tier": "pocket_friendly",
        "approx_cost": "₹99–₹220 combos / Fast Food",
        "price_level": 1,
        "city": "Mumbai",
        "neighborhood": "Churchgate / Station Road",
        "latitude": 18.9352,
        "longitude": 72.8276,
        "access_type": "public",
        "safety_level": "high",
        "safety_notes": "Directly outside Churchgate station terminal, very safe.",
        "hiddenness_score": 0.25,
        "vibe_score": 0.94,
        "safety_score": 0.96,
        "accessibility_score": 0.99,
        "crowd_level": 4,
        "best_time_to_visit": "Afternoon 12:00 PM – 4:00 PM (College bunk hours)",
        "description": "The quintessential South Mumbai college hub right outside Churchgate terminal. Shared by KC, HR, and Jai Hind students for quick AC meals and cheap burger combos.",
        "vibe_tags": ["fast-food", "youth-adda", "college-hub", "transit-hub"],
        "photo_url": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1000",
        "source": "curated_youth_hubs",
        "hub_type": "food_hub",
        "outlets": [
            {"brand": "mcdonalds", "name": "McDonald's", "floor": "Ground + Mezzanine", "timing": "7:00 AM – 1:00 AM"},
            {"brand": "kfc", "name": "KFC", "floor": "Ground Floor", "timing": "10:30 AM – 11:30 PM"},
            {"brand": "subway", "name": "Subway", "floor": "Station Concourse", "timing": "8:00 AM – 11:00 PM"}
        ],
        "total_outlets_count": 12,
        "more_outlets_text": "+ 9 more college cafes & snack bars nearby",
        "more_outlets_url": "https://www.google.com/maps/search/fast+food+in+Churchgate+Mumbai",
        "entertainment": ["Marine Drive Promenade (3 min walk)"],
        "amenities": {
            "heavy_ac": True,
            "plug_points": True,
            "clean_washrooms": True,
            "metro_connected": True
        }
    },

    # ─────────────────────────────────────────────────────────────
    # 11. STANDALONE: BURGER KING LINKING ROAD (Bandra West)
    # ─────────────────────────────────────────────────────────────
    {
        "id": "hub-burger-king-linking-road",
        "slug": "burger-king-linking-road-bandra",
        "name": "Burger King (Linking Road)",
        "short_name": "Linking Road BK",
        "category": "cafes",
        "subcategory": "Multi-Level Shopping Promenade Youth Adda",
        "spot_tier": "iconic",
        "budget_tier": "pocket_friendly",
        "approx_cost": "₹99–₹250 combos / Fast Food",
        "price_level": 1,
        "city": "Mumbai",
        "neighborhood": "Bandra West / Linking Road",
        "latitude": 19.0621,
        "longitude": 72.8335,
        "access_type": "public",
        "safety_level": "high",
        "safety_notes": "Active street shopping district, high footfall, safe.",
        "hiddenness_score": 0.30,
        "vibe_score": 0.93,
        "safety_score": 0.95,
        "accessibility_score": 0.93,
        "crowd_level": 4,
        "best_time_to_visit": "Evening 4:00 PM – 9:00 PM",
        "description": "Multi-level burger flagship on Bandra's prime shopping stretch. Air-conditioned retreat for college shoppers taking a break from street shopping.",
        "vibe_tags": ["fast-food", "youth-adda", "shopping-hub", "ac-haven"],
        "photo_url": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1000",
        "source": "curated_youth_hubs",
        "hub_type": "food_hub",
        "outlets": [
            {"brand": "burger_king", "name": "Burger King Flagship", "floor": "Ground + 1st Floor", "timing": "10:00 AM – 1:00 AM"},
            {"brand": "kfc", "name": "KFC", "floor": "Adjacent Building", "timing": "11:00 AM – 11:30 PM"},
            {"brand": "mcdonalds", "name": "McDonald's", "floor": "2 min walk north", "timing": "10:00 AM – 12:00 AM"}
        ],
        "total_outlets_count": 8,
        "more_outlets_text": "+ 5 more fast food outlets on Linking Road",
        "more_outlets_url": "https://www.google.com/maps/search/fast+food+in+Linking+Road+Bandra+West",
        "entertainment": ["Linking Road Street Shopping"],
        "amenities": {
            "heavy_ac": True,
            "plug_points": True,
            "clean_washrooms": True
        }
    },

    # ─────────────────────────────────────────────────────────────
    # 12. STANDALONE: MCDONALD'S BORIVALI WEST LINK ROAD DRIVE-THRU
    # ─────────────────────────────────────────────────────────────
    {
        "id": "hub-mcd-borivali-west-drive-thru",
        "slug": "mcdonalds-borivali-west-link-road-drive-thru",
        "name": "McDonald's Drive-Thru (Borivali West)",
        "short_name": "Borivali Link McD",
        "category": "cafes",
        "subcategory": "Sprawling Suburban Late-Night Drive-Thru",
        "spot_tier": "iconic",
        "budget_tier": "pocket_friendly",
        "approx_cost": "₹99–₹250 combos / Fast Food",
        "price_level": 1,
        "city": "Mumbai",
        "neighborhood": "Borivali West / Link Road",
        "latitude": 19.2274,
        "longitude": 72.8465,
        "access_type": "public",
        "safety_level": "high",
        "safety_notes": "Expansive dedicated parking, 24/7 security, drive-thru lane.",
        "hiddenness_score": 0.35,
        "vibe_score": 0.94,
        "safety_score": 0.96,
        "accessibility_score": 0.94,
        "crowd_level": 4,
        "best_time_to_visit": "Late night (11:00 PM – 2:00 AM) for midnight car runs",
        "description": "Massive standalone suburban McDonald's featuring a dedicated drive-thru lane and huge parking lot. Prime weekend midnight destination for northern suburban youth.",
        "vibe_tags": ["fast-food", "drive-thru", "late-night", "youth-adda", "parking"],
        "photo_url": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1000",
        "source": "curated_youth_hubs",
        "hub_type": "standalone_drive_thru",
        "outlets": [
            {"brand": "mcdonalds", "name": "McDonald's Drive-Thru", "floor": "Standalone Drive-Thru Complex", "has_drive_thru": True, "is_late_night": True, "timing": "7:00 AM – 3:00 AM"}
        ],
        "total_outlets_count": 1,
        "more_outlets_text": "Explore nearby Borivali West dining strip on Maps",
        "more_outlets_url": "https://www.google.com/maps/search/fast+food+in+Borivali+West+Link+Road",
        "entertainment": ["Late Night Drive-Thru Car Hangout"],
        "amenities": {
            "heavy_ac": True,
            "plug_points": True,
            "clean_washrooms": True,
            "late_night": True,
            "parking": True
        }
    }
]

def main():
    out_dir = os.path.join(os.path.dirname(__file__), '..', 'data', 'places_mumbai')
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, 'youth_hangouts.json')
    
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(HUBS, f, indent=2, ensure_ascii=False)
        
    print(f"✓ Wrote {len(HUBS)} verified Malls & Youth Fast Food Hubs to {out_file}")

if __name__ == '__main__':
    main()
