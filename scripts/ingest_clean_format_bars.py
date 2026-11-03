import json
import os

MASTER_FILE = "data/places_mumbai.json"
MODULAR_BARS = "data/places_mumbai/bars.json"

with open(MASTER_FILE, "r", encoding="utf-8") as f:
    master_places = json.load(f)

existing_ids = {p["id"] for p in master_places}
existing_names = {p["name"].strip().lower() for p in master_places}

# Raw input items from user
raw_items = [
    {
        "name": "Deepa Bar & Restaurant",
        "category": "bars",
        "neighborhood": "Bandra West",
        "address": "Swami Vivekananda Road, near National Library Naka, Bandra West, Mumbai, Maharashtra 400050",
        "price": "₹600–1,200 for two",
        "rating": 4.1,
        "vibe": "A cozy, low-profile neighborhood hideout popular with long-time Bandra residents looking for low-cost domestic beers. The kitchen serves excellent, fiery coastal fish thalis and classic bar bites.",
        "lat": 19.0596,
        "lng": 72.8398,
        "tags": ["bandra-west", "dive-bar", "coastal-thali", "budget-beer", "local-hideout"],
        "photo": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Choice Restaurant & Bar",
        "category": "bars",
        "neighborhood": "Andheri West",
        "address": "Near Seven Bungalows Metro Station, JP Road, Andheri West, Mumbai, Maharashtra 400053",
        "price": "₹500–1,000 for two",
        "rating": 3.9,
        "vibe": "A raw, completely unpretentious local permit room where the retail markup on spirits is kept to an absolute minimum. It draws a daily post-work crowd seeking fast service and cheap quarters of liquor.",
        "lat": 19.1205,
        "lng": 72.8465,
        "tags": ["permit-room", "andheri-west", "budget-spirits", "post-work", "fast-service"],
        "photo": "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Asiad Bar & Restaurant",
        "category": "bars",
        "neighborhood": "Vile Parle West",
        "address": "Near Prime Mall, Irla Road, Vile Parle West, Mumbai, Maharashtra 400056",
        "price": "₹600–1,100 for two",
        "rating": 4.0,
        "vibe": "A popular neighborhood dive known for its highly competitive domestic beer bottle pricing. It is a favorite weekend pre-gaming spot for local college groups before they head out to more expensive lounges.",
        "lat": 19.1042,
        "lng": 72.8385,
        "tags": ["vile-parle", "irla-road", "college-pregame", "cheap-beer", "student-friendly"],
        "photo": "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Universal Cafe",
        "category": "bars",
        "neighborhood": "Fort",
        "address": "265, Shahid Bhagat Singh Road, near CST, Fort, Mumbai, Maharashtra 400001",
        "price": "₹500–900 for two",
        "rating": 4.2,
        "vibe": "A historic, high-ceilinged Iranian-style cafe setup that functions as a vintage beer parlor. It draws a massive crowd of students and travelers looking for affordable chilled mugs of draught beer.",
        "lat": 18.9388,
        "lng": 72.8365,
        "tags": ["iranian-cafe", "fort", "beer-parlor", "draft-beer", "vintage-mumbai"],
        "photo": "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Garden Jolly Bar & Restaurant",
        "category": "bars",
        "neighborhood": "Kala Ghoda",
        "address": "Rope Walk Lane, behind Jehangir Art Gallery, Kala Ghoda, Fort, Mumbai, Maharashtra 400001",
        "price": "₹600–1,200 for two",
        "rating": 4.1,
        "vibe": "Tucked away down a quiet alley in South Mumbai's arts district, this no-frills den offers an escape from the neighborhood's premium pricing. The retro rock playlist and cheap house pours keep it consistently packed.",
        "lat": 18.9288,
        "lng": 72.8322,
        "tags": ["kala-ghoda", "rope-walk-lane", "arts-district", "retro-rock", "hidden-dive"],
        "photo": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Capitol Family Restaurant & Bar",
        "category": "bars",
        "neighborhood": "Fort",
        "address": "Capitol Cinema Building, opposite CSMT Terminus, Fort, Mumbai, Maharashtra 400001",
        "price": "₹500–1,000 for two",
        "rating": 3.8,
        "vibe": "A rapid-turnover local hub located right inside a vintage cinema building. It is perfect for commuters looking for a fast, cheap pint of beer and spicy chicken lollipops before catching an outstation train.",
        "lat": 18.9412,
        "lng": 72.8348,
        "tags": ["csmt-terminus", "capitol-cinema", "heritage-building", "commuter-bar", "fast-pints"],
        "photo": "https://images.unsplash.com/photo-1574096079513-d8259312b785?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "New Majestic Bar & Restaurant",
        "category": "bars",
        "neighborhood": "Fort",
        "address": "Opposite CSMT Station, Murzban Road, Fort, Mumbai, Maharashtra 400001",
        "price": "₹450–900 for two",
        "rating": 3.9,
        "vibe": "Widely noted by price-sensitive regulars as one of the most budget-friendly alcohol options right near the railway terminus. The service is lightning-fast, and the atmosphere is noisy, local, and lively.",
        "lat": 18.9421,
        "lng": 72.8339,
        "tags": ["murzban-road", "csmt", "station-dive", "budget-alcohol", "fast-service"],
        "photo": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Sher-E-Punjab Bar",
        "category": "bars",
        "neighborhood": "Fort",
        "address": "262, Shahid Bhagat Singh Road, Fort, Mumbai, Maharashtra 400001",
        "price": "₹700–1,300 for two",
        "rating": 4.0,
        "vibe": "A traditional corner permit room that trades heavily on cheap pitchers of domestic draft lagers. Regulars flock here for the heavy, satisfying North Indian tandoori appetizers that pair perfectly with dark rum.",
        "lat": 18.9372,
        "lng": 72.8359,
        "tags": ["fort", "draft-pitchers", "tandoori-kebabs", "punjabi-dhaba-bar", "old-monk"],
        "photo": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Madira Bar and Restaurant",
        "category": "bars",
        "neighborhood": "Parel East",
        "address": "Dr. Ambedkar Road, near Parel ST Depot, Parel East, Mumbai, Maharashtra 400012",
        "price": "₹500–1,000 for two",
        "rating": 3.9,
        "vibe": "A straightforward neighborhood permit room heavily patronized by local office workers and hospital staff winding down after long shifts. It offers rock-bottom pricing on domestic whiskey and standard crunchy bar snacks.",
        "lat": 19.0012,
        "lng": 72.8428,
        "tags": ["parel-east", "permit-room", "post-shift", "crunchy-chakna", "budget-whiskey"],
        "photo": "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Sunil Restaurant & Bar (Lower Parel)",
        "category": "bars",
        "neighborhood": "Lower Parel",
        "address": "Mathuradas Mill Compound Lane, Tulsi Pipe Road, Lower Parel, Mumbai, Maharashtra 400013",
        "price": "₹600–1,200 for two",
        "rating": 4.0,
        "vibe": "Hidden within walking distance of Mumbai's most massive corporate mill compounds, this bar serves as a budget refuge. It is the ultimate choice for corporate employees looking to drink on a budget after hours.",
        "lat": 18.9958,
        "lng": 72.8272,
        "tags": ["lower-parel", "mathuradas-mill", "corporate-refuge", "after-hours", "budget-drinks"],
        "photo": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Pritam Restaurant & Bar (Tavern)",
        "category": "bars",
        "neighborhood": "Dadar West",
        "address": "Pritam Estates, Dr. Ambedkar Road, Dadar TT Circle / Dadar West, Mumbai, Maharashtra 400014",
        "price": "₹800–1,400 for two",
        "rating": 4.1,
        "vibe": "While the main restaurant is legendary, the ground-floor tavern section of this institution maintains highly accessible domestic spirit pricing. The vibe is old-school retro, and the butter chicken is legendary.",
        "lat": 19.0175,
        "lng": 72.8448,
        "tags": ["dadar-tt", "pritam-tavern", "butter-chicken", "retro-institution", "iconic-mumbai"],
        "photo": "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Modern Bar & Restaurant",
        "category": "bars",
        "neighborhood": "Dadar East",
        "address": "Near Dadar Railway Station, Khodadad Circle, Dadar East, Mumbai, Maharashtra 400014",
        "price": "₹500–1,000 for two",
        "rating": 3.8,
        "vibe": "An old, highly functional drinking hole popular among transit commuters looking for a rapid pre-travel pitstop. The tables are tightly packed, the beers are ice-cold, and the prices are deeply discounted.",
        "lat": 19.0195,
        "lng": 72.8452,
        "tags": ["dadar-east", "khodadad-circle", "station-pitstop", "discounted-beers", "fast-turnover"],
        "photo": "https://images.unsplash.com/photo-1574096079513-d8259312b785?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Lalit Bar & Restaurant",
        "category": "bars",
        "neighborhood": "Sion",
        "address": "Near Sion Circle, Sion West, Mumbai, Maharashtra 400022",
        "price": "₹500–1,100 for two",
        "rating": 4.0,
        "vibe": "A classic local joint that keeps regular patrons coming back for low-margin quarters of Old Monk and crispy Chana Garlic Fry. The service is warm, welcoming, and very familiar.",
        "lat": 19.0402,
        "lng": 72.8625,
        "tags": ["sion-circle", "old-monk", "chana-garlic-fry", "neighborhood-joint", "friendly-staff"],
        "photo": "https://images.unsplash.com/photo-1508253578933-20b529302151?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Linkway Restaurant & Bar",
        "category": "bars",
        "neighborhood": "Andheri West",
        "address": "Link Road, near DN Nagar Metro Station, Andheri West, Mumbai, Maharashtra 400053",
        "price": "₹600–1,200 for two",
        "rating": 3.9,
        "vibe": "A completely unpretentious local permit room where the retail markup on spirits is kept to an absolute minimum. It offers a dark, air-conditioned escape from the chaotic traffic of Link Road.",
        "lat": 19.1255,
        "lng": 72.8312,
        "tags": ["dn-nagar", "link-road", "metro-station", "chilled-ac", "budget-spirits"],
        "photo": "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Sanjeevani Bar",
        "category": "bars",
        "neighborhood": "Andheri East",
        "address": "Mahakali Caves Road, near Takshila, Andheri East, Mumbai, Maharashtra 400093",
        "price": "₹500–950 for two",
        "rating": 3.8,
        "vibe": "A basic, raw local joint focusing strictly on no-frills, low-budget drinking sessions for neighborhood residents. The kitchen dishes out surprisingly good, spicy Indo-Chinese starters like chilly chicken.",
        "lat": 19.1294,
        "lng": 72.8698,
        "tags": ["mahakali-caves", "andheri-east", "takshila", "chilly-chicken", "raw-dive"],
        "photo": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Sheela Bar & Restaurant",
        "category": "bars",
        "neighborhood": "Jogeshwari West",
        "address": "SV Road, near Jogeshwari Station, Jogeshwari West, Mumbai, Maharashtra 400102",
        "price": "₹450–900 for two",
        "rating": 3.7,
        "vibe": "A favorite spot for surrounding commercial and auto-garage workers seeking cheap pints and massive plates of egg fried rice. The atmosphere is loud, unrefined, and incredibly pocket-friendly.",
        "lat": 19.1362,
        "lng": 72.8485,
        "tags": ["jogeshwari", "sv-road", "auto-hub", "egg-fried-rice", "pocket-friendly"],
        "photo": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Saffron Express Bar",
        "category": "bars",
        "neighborhood": "Malad West",
        "address": "Link Road, near Mithibai College Extension, Malad West, Mumbai, Maharashtra 400064",
        "price": "₹600–1,100 for two",
        "rating": 4.0,
        "vibe": "Known among the local suburban college crowds for highly competitive prices on massive beer towers and pitchers. The crowd is young, energetic, and heavily focused on budget-friendly weekend socializing.",
        "lat": 19.1824,
        "lng": 72.8368,
        "tags": ["malad-west", "link-road", "beer-towers", "pitchers", "college-crowd"],
        "photo": "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Guruprasad Bar & Restaurant (Santacruz)",
        "category": "bars",
        "neighborhood": "Santacruz East",
        "address": "Near Santacruz Railway Station, Station Road, Santacruz East, Mumbai, Maharashtra 400055",
        "price": "₹500–1,000 for two",
        "rating": 3.9,
        "vibe": "Located right near the eastern exit of the station, this spot caters to weary commuters seeking cheap local spirits. It is highly regarded for its quick service and complimentary roasted papad baskets.",
        "lat": 19.0818,
        "lng": 72.8435,
        "tags": ["santacruz-east", "station-exit", "commuter-bar", "roasted-papad", "quick-pegs"],
        "photo": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Harish Bar & Restaurant",
        "category": "bars",
        "neighborhood": "Kurla West",
        "address": "LBS Marg, near Kurla Bus Depot, Kurla West, Mumbai, Maharashtra 400070",
        "price": "₹550–1,100 for two",
        "rating": 3.8,
        "vibe": "A functional local joint providing low-cost drinks for local business owners and office crowds well away from the premium mall lounges nearby. Try their heavily spiced tandoori items.",
        "lat": 19.0682,
        "lng": 72.8795,
        "tags": ["kurla-west", "lbs-marg", "tandoori", "budget-drinks", "local-joint"],
        "photo": "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Durga Prasad Bar",
        "category": "bars",
        "neighborhood": "Mulund West",
        "address": "NS Road, near Mulund Station, Mulund West, Mumbai, Maharashtra 400080",
        "price": "₹500–1,000 for two",
        "rating": 4.0,
        "vibe": "A standard local dive offering extremely economical beer options and deep discounts on domestic hard liquor. The service is incredibly attentive, and it features a very relaxed, neighborhood-only crowd.",
        "lat": 19.1728,
        "lng": 72.9554,
        "tags": ["mulund-west", "ns-road", "station-side", "neighborhood-dive", "attentive-service"],
        "photo": "https://images.unsplash.com/photo-1508253578933-20b529302151?w=1000&auto=format&fit=crop&q=80"
    }
]

def make_slug(name, neighborhood):
    clean = f"{name} {neighborhood}".lower()
    for ch in ["&", "(", ")", ",", "/", ".", "'"]:
        clean = clean.replace(ch, " ")
    return "-".join(clean.split())

def make_id(name, neighborhood):
    clean = f"mumbai-{name}-{neighborhood}".lower()
    for ch in ["&", "(", ")", ",", "/", ".", "'"]:
        clean = clean.replace(ch, " ")
    return "-".join(clean.split())

added_count = 0
skipped_count = 0

for item in raw_items:
    norm_name = item["name"].strip().lower()
    # Check if exact or near-identical name already in catalog
    if norm_name in existing_names or any(norm_name == p["name"].strip().lower() for p in master_places):
        print(f"Skipped existing: {item['name']}")
        skipped_count += 1
        continue
    
    # Also check if base name matches (e.g. Choice Restaurant & Bar)
    base_name = norm_name.split("(")[0].strip()
    if base_name in existing_names and "santacruz" not in norm_name and "lower parel" not in norm_name:
        print(f"Skipped duplicate base: {item['name']}")
        skipped_count += 1
        continue

    place_id = make_id(item["name"], item["neighborhood"])
    if place_id in existing_ids:
        place_id += f"-{len(existing_ids)}"
    
    slug = make_slug(item["name"], item["neighborhood"])
    
    canonical_place = {
        "id": place_id,
        "slug": slug,
        "name": item["name"],
        "short_name": item["name"].split("&")[0].split("(")[0].strip(),
        "category": "bars",
        "subcategory": "Budget Neighborhood Bar & Permit Room",
        "spot_tier": "underrated",
        "city": "Mumbai",
        "neighborhood": item["neighborhood"],
        "latitude": item["lat"],
        "longitude": item["lng"],
        "access_type": "commercial",
        "safety_level": "high",
        "safety_notes": f"Standard commercial street frontage along {item['address'].split(',')[0]}.",
        "hiddenness_score": 0.68,
        "vibe_score": round(item["rating"] / 5.0 * 0.95, 2),
        "safety_score": 0.91,
        "accessibility_score": 0.94,
        "crowd_level": 3,
        "best_time_to_visit": "Evenings post 6:30 PM for lively neighborhood crowd",
        "description": item["vibe"],
        "vibe_tags": item["tags"],
        "photo_url": item["photo"],
        "source": "curated_budget_bars"
    }
    
    master_places.append(canonical_place)
    existing_ids.add(place_id)
    existing_names.add(norm_name)
    added_count += 1
    print(f"Added: {item['name']} ({place_id})")

print(f"\nAdded: {added_count}, Skipped: {skipped_count}")
print(f"New total catalog size: {len(master_places)}")

# Save updated master
with open(MASTER_FILE, "w", encoding="utf-8") as f:
    json.dump(master_places, f, indent=2, ensure_ascii=False)

# Sync modular category files
MODULAR_DIR = "data/places_mumbai"
categories = [
    'cafes', 'bars', 'forts', 'walks', 'treks', 'gardens',
    'viewpoints', 'waterfront', 'heritage', 'books', 'culture',
    'spiritual', 'bazaars'
]

cat_counts = {}
for cat in categories:
    cat_places = [p for p in master_places if p.get("category") == cat]
    cat_file = os.path.join(MODULAR_DIR, f"{cat}.json")
    with open(cat_file, "w", encoding="utf-8") as f:
        json.dump(cat_places, f, indent=2, ensure_ascii=False)
    cat_counts[cat] = len(cat_places)

print("Modular sync completed:")
for cat, count in cat_counts.items():
    print(f"  {cat}: {count} places")

