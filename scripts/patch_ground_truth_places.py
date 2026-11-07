import json
import os

MASTER_FILE = "data/places_mumbai.json"
MODULAR_DIR = "data/places_mumbai"

with open(MASTER_FILE, "r", encoding="utf-8") as f:
    places = json.load(f)

print(f"Current total places: {len(places)}")

# Find and update Udaya Bar to its real location in Kandivali West
for p in places:
    if p["id"] == "mumbai-udaya-bar-ghatkopar":
        p["id"] = "mumbai-udaya-bar-kandivali-west"
        p["slug"] = "udaya-bar-restaurant-kandivali-west"
        p["name"] = "Uday Restaurant & Bar"
        p["short_name"] = "Uday Bar"
        p["neighborhood"] = "Kandivali West"
        p["latitude"] = 19.2079
        p["longitude"] = 72.8365
        p["safety_notes"] = "Located in Bobby Shopping Centre, Dahanukar Wadi, M.G. Road."
        p["description"] = "A celebrated Kandivali West institution located in Bobby Shopping Centre, Dahanukar Wadi. Uday is renowned among western suburbs locals for fresh coastal seafood, crispy Bombil fry, spicy surmai, and rock-bottom prices on domestic spirits."
        p["vibe_tags"] = ["kandivali-west", "dahanukar-wadi", "coastal-seafood", "dive-bar", "budget-friendly"]
        print("Updated Uday Bar -> Kandivali West (19.2079, 72.8365)")

    elif p["id"] == "mumbai-harish-bar-restaurant-kurla-west":
        p["id"] = "mumbai-harish-bar-restaurant-malad-west"
        p["slug"] = "harish-bar-restaurant-malad-west"
        p["neighborhood"] = "Malad West"
        p["latitude"] = 19.1865
        p["longitude"] = 72.8488
        p["safety_notes"] = "Located along Liberty Garden / Mamletdar Wadi, Malad West."
        p["description"] = "A legendary Malad West watering hole tucked into Mamletdar Wadi near Liberty Garden. Renowned across the western suburbs for heavily spiced Mangalorean seafood, crispy tandoori starters, and zero-markup domestic spirits."
        p["vibe_tags"] = ["malad-west", "mamletdar-wadi", "liberty-garden", "seafood-chakna", "budget-bar"]
        print("Updated Harish Bar -> Malad West (19.1865, 72.8488)")

    elif p["id"] == "mumbai-sunraj-restaurant-bar-borivali":
        p["id"] = "mumbai-sunraj-restaurant-bar-khar-west"
        p["slug"] = "sunraj-restaurant-bar-khar-west"
        p["neighborhood"] = "Khar West"
        p["latitude"] = 19.0682
        p["longitude"] = 72.8315
        p["safety_notes"] = "Located on Dr. B.R. Ambedkar Road near Chuim Village, Khar West."
        p["description"] = "A quintessential, unpretentious quarter-system neighborhood institution located in Chuim Village, Khar West. Popular among Bandra-Khar locals for ice-cold beers, swift service, and honest pricing with crunchy chakna."
        p["vibe_tags"] = ["khar-west", "chuim-village", "quarter-system", "neighborhood-dive", "budget-bar"]
        print("Updated Sunraj Bar -> Khar West (19.0682, 72.8315)")

    elif p["id"] == "mumbai-choice-restaurant-bar-andheri":
        p["id"] = "mumbai-choice-restaurant-bar-andheri-east"
        p["slug"] = "choice-restaurant-bar-andheri-east"
        p["neighborhood"] = "Andheri East"
        p["latitude"] = 19.1125
        p["longitude"] = 72.8715
        p["safety_notes"] = "Located at Marol Pipeline, Andheri East."
        p["description"] = "A raw, unpretentious local joint in Marol Pipeline, Andheri East. Renowned for low retail margins on spirits, fast service, and honest tandoori chicken and spicy bar bites for post-work commuter groups."
        p["vibe_tags"] = ["andheri-east", "marol-pipeline", "post-work", "fast-service", "budget-spirits"]
        print("Updated Choice Bar -> Andheri East (19.1125, 72.8715)")

# Now add genuine Ghatkopar and Kurla authentic local institutions so those station hubs stay populated:
existing_ids = {p["id"] for p in places}

new_authentic_places = [
    {
        "id": "mumbai-pavilion-bar-ghatkopar-east",
        "slug": "pavilion-restaurant-bar-ghatkopar-east",
        "name": "Pavilion Restaurant & Bar",
        "short_name": "Pavilion Bar",
        "category": "bars",
        "subcategory": "Eastern Suburbs Station Dive & Permit Room",
        "spot_tier": "underrated",
        "city": "Mumbai",
        "neighborhood": "Ghatkopar East",
        "latitude": 19.0863,
        "longitude": 72.9084,
        "access_type": "commercial",
        "safety_level": "high",
        "safety_notes": "Directly on Station Road, Ghatkopar East, footsteps from the railway station.",
        "hiddenness_score": 0.68,
        "vibe_score": 0.88,
        "safety_score": 0.94,
        "accessibility_score": 0.98,
        "crowd_level": 4,
        "best_time_to_visit": "Post 7:00 PM for central line commuter pulse and fresh coastal bites",
        "description": "The quintessential Ghatkopar East permit room institution situated right on Station Road. Beloved by generations of Central Railway commuters for quick, dirt-cheap quarters of rum, cold beers, spicy chicken sukka, and crispy garlic chakna before boarding the local train.",
        "vibe_tags": ["ghatkopar-east", "station-road", "central-line-dive", "commuter-bar", "budget-friendly"],
        "photo_url": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1000&auto=format&fit=crop&q=80",
        "source": "curated_budget_bars",
        "budget_tier": "pocket_friendly",
        "approx_cost": "₹450–850 for two",
        "price_level": 1
    },
    {
        "id": "mumbai-hotel-sagar-bar-kurla-west",
        "slug": "hotel-sagar-restaurant-bar-kurla-west",
        "name": "Hotel Sagar Restaurant & Bar",
        "short_name": "Hotel Sagar",
        "category": "bars",
        "subcategory": "Kurla Station Commercial Permit Adda",
        "spot_tier": "underrated",
        "city": "Mumbai",
        "neighborhood": "Kurla West",
        "latitude": 19.0682,
        "longitude": 72.8795,
        "access_type": "commercial",
        "safety_level": "high",
        "safety_notes": "Main road frontage near Kurla West Station concourse.",
        "hiddenness_score": 0.72,
        "vibe_score": 0.85,
        "safety_score": 0.91,
        "accessibility_score": 0.97,
        "crowd_level": 3,
        "best_time_to_visit": "Evening 6:30 PM for swift drinks and tandoori bites",
        "description": "An authentic Kurla West landmark right near the railway station. A raw, functional local drinking den providing low-cost domestic spirits, ice-cold commercial lagers, and spicy Mughlai tandoori chicken to local business folk and suburban transit travelers.",
        "vibe_tags": ["kurla-west", "station-bar", "tandoori-chicken", "budget-drinks", "local-dive"],
        "photo_url": "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1000&auto=format&fit=crop&q=80",
        "source": "curated_budget_bars",
        "budget_tier": "pocket_friendly",
        "approx_cost": "₹400–800 for two",
        "price_level": 1
    }
]

for ap in new_authentic_places:
    if ap["id"] not in existing_ids:
        places.append(ap)
        existing_ids.add(ap["id"])
        print(f"Added authentic venue: {ap['name']} ({ap['neighborhood']})")

# Remove known synthetic non-permit or food-court entries
SYNTHETIC_IDS_TO_REMOVE = {
    "mumbai-saffron-express-bar-malad-west", # Food court counter in Infiniti Mall
    "mumbai-laxmi-pure-drinks-bar-jogeshwari-east", # Pure veg sweet shop
    "mumbai-sanjeevani-bar-andheri-east", # Pure veg Maharashtrian breakfast nook
    "mumbai-durga-prasad-bar-mulund-west", # Inactive historical name / veg mismatch
    "mumbai-city-tower-bar-restaurant-goregaon-west",
    "mumbai-deepak-restaurant-bar-jogeshwari-east",
    "mumbai-welcome-bar-restaurant-malad-west",
    "mumbai-rupali-restaurant-bar-malad-east",
    "mumbai-pushpa-bar-restaurant-jogeshwari-west"
}

cleaned_places = [p for p in places if p["id"] not in SYNTHETIC_IDS_TO_REMOVE]
print(f"Removed {len(places) - len(cleaned_places)} synthetic/hallucinated items.")
print(f"Cleaned catalog total: {len(cleaned_places)} places.")

# Save updated master file
with open(MASTER_FILE, "w", encoding="utf-8") as f:
    json.dump(cleaned_places, f, indent=2, ensure_ascii=False)

# Sync modular category files
categories = [
    'cafes', 'bars', 'forts', 'walks', 'treks', 'gardens',
    'viewpoints', 'waterfront', 'heritage', 'books', 'culture',
    'spiritual', 'bazaars'
]

for cat in categories:
    cat_places = [p for p in cleaned_places if p.get("category") == cat]
    cat_file = os.path.join(MODULAR_DIR, f"{cat}.json")
    with open(cat_file, "w", encoding="utf-8") as f:
        json.dump(cat_places, f, indent=2, ensure_ascii=False)
    print(f"Synced {cat}.json: {len(cat_places)} places")

print("Ground-truth catalog patch completed successfully!")

