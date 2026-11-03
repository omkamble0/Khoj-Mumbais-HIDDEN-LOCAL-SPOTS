import json
import os

MASTER_FILE = "data/places_mumbai.json"
MODULAR_DIR = "data/places_mumbai"

with open(MASTER_FILE, "r", encoding="utf-8") as f:
    master_places = json.load(f)

existing_ids = {p["id"] for p in master_places}
existing_names = {p["name"].strip().lower() for p in master_places}

raw_items = [
    {
        "name": "Sunraj Restaurant & Bar",
        "category": "bars",
        "neighborhood": "Borivali West",
        "address": "LT Road, near Borivali Station, Borivali West, Mumbai, Maharashtra 400092",
        "price": "₹500–1,000 for two",
        "rating": 4.0,
        "vibe": "A reliable suburban staple offering basic seating, cold lagers, and cheap crunchy bar bites. It is popular with commuters looking for a quick drink right after stepping off the train.",
        "lat": 19.2291,
        "lng": 72.8542,
        "tags": ["borivali", "suburban-dive", "station-road", "cold-lagers", "budget-beer"],
        "photo": "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Amrapali Bar",
        "category": "bars",
        "neighborhood": "Malad West",
        "address": "Link Road, near Chincholi Bunder, Malad West, Mumbai, Maharashtra 400064",
        "price": "₹600–1,200 for two",
        "rating": 3.9,
        "vibe": "Known among the local suburban college crowds for pocket-friendly tower beers and heavily portioned Indo-Chinese starters. The atmosphere is loud, lively, and highly economical.",
        "lat": 19.1865,
        "lng": 72.8488,
        "tags": ["malad-west", "chincholi-bunder", "beer-towers", "indo-chinese", "college-crowd"],
        "photo": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Sheela Bar & Restaurant",
        "category": "bars",
        "neighborhood": "Jogeshwari West",
        "address": "SV Road, near Jogeshwari Station, Jogeshwari West, Mumbai, Maharashtra 401102",
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
        "name": "Royal Restaurant & Bar",
        "category": "bars",
        "neighborhood": "Goregaon West",
        "address": "SV Road, near Goregaon Flyover, Goregaon West, Mumbai, Maharashtra 400104",
        "price": "₹550–1,100 for two",
        "rating": 3.9,
        "vibe": "A traditional local permit room that caters heavily to the post-work crowd with very thin markups on domestic spirits. The kitchen serves excellent tandoori chicken and spicy local chakna.",
        "lat": 19.1648,
        "lng": 72.8456,
        "tags": ["goregaon-west", "sv-road", "flyover", "tandoori-chicken", "post-work-drinks"],
        "photo": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Manmeet Bar & Restaurant",
        "category": "bars",
        "neighborhood": "Goregaon East",
        "address": "Near Goregaon Station, AK Vaidya Marg, Goregaon East, Mumbai, Maharashtra 400063",
        "price": "₹500–1,000 for two",
        "rating": 3.8,
        "vibe": "A functional, zero-frills watering hole popular with commuters heading towards the eastern residential hubs. It offers fast service, ice-cold commercial beers, and highly affordable quarters of dark rum.",
        "lat": 19.1672,
        "lng": 72.8524,
        "tags": ["goregaon-east", "ak-vaidya-marg", "dark-rum", "cold-beers", "transit-dive"],
        "photo": "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Laxmi Pure Drinks Bar",
        "category": "bars",
        "neighborhood": "Jogeshwari East",
        "address": "Caves Road, near Western Express Highway, Jogeshwari East, Mumbai, Maharashtra 400060",
        "price": "₹450–950 for two",
        "rating": 3.8,
        "vibe": "A highly affordable neighborhood hideout that stays packed with regulars due to its rock-bottom pricing on domestic whiskey. The seating is tightly packed, creating a classic, bustling dive bar energy.",
        "lat": 19.1388,
        "lng": 72.8596,
        "tags": ["jogeshwari-east", "caves-road", "weh", "whiskey-quarters", "bustling-dive"],
        "photo": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Alankar Restaurant & Bar",
        "category": "bars",
        "neighborhood": "Malad East",
        "address": "Poddar Road, near Malad Station, Malad East, Mumbai, Maharashtra 400097",
        "price": "₹500–1,000 for two",
        "rating": 3.9,
        "vibe": "An old-school local establishment that keeps margins incredibly low on local beers and basic spirits. It is highly regarded by neighborhood residents for its quick, no-nonsense service.",
        "lat": 19.1872,
        "lng": 72.8535,
        "tags": ["malad-east", "poddar-road", "station-side", "quick-service", "local-permit-room"],
        "photo": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Status Restaurant & Bar",
        "category": "bars",
        "neighborhood": "Goregaon West",
        "address": "Link Road, near Bangur Nagar, Goregaon West, Mumbai, Maharashtra 400090",
        "price": "₹600–1,200 for two",
        "rating": 4.0,
        "vibe": "Tucked away from the upscale lounges on Link Road, this budget-friendly bar offers a dark, air-conditioned space to drink affordably. The kitchen dishes out surprisingly good, fiery chicken lollipop plates.",
        "lat": 19.1685,
        "lng": 72.8348,
        "tags": ["bangur-nagar", "goregaon-west", "link-road", "chicken-lollipop", "air-conditioned-dive"],
        "photo": "https://images.unsplash.com/photo-1574096079513-d8259312b785?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Vaishali Bar & Restaurant",
        "category": "bars",
        "neighborhood": "Jogeshwari West",
        "address": "Near Behram Baug Road, Jogeshwari West, Mumbai, Maharashtra 400102",
        "price": "₹500–1,000 for two",
        "rating": 3.7,
        "vibe": "A strictly local adda focused entirely on providing low-cost drinks to the surrounding neighborhood crowd. The vibe is unpretentious and casual, perfect for a budget-friendly weekend session.",
        "lat": 19.1412,
        "lng": 72.8398,
        "tags": ["behram-baug", "jogeshwari-west", "local-adda", "budget-weekend", "unpretentious"],
        "photo": "https://images.unsplash.com/photo-1508253578933-20b529302151?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Golden Crown Bar",
        "category": "bars",
        "neighborhood": "Malad West",
        "address": "Marve Road, near Mith Chowki, Malad West, Mumbai, Maharashtra 400064",
        "price": "₹550–1,150 for two",
        "rating": 3.9,
        "vibe": "A popular transit stop for those heading out towards Marve Beach who want to pre-game on a budget. It features highly competitive liquor pricing and fast-moving tables.",
        "lat": 19.1895,
        "lng": 72.8352,
        "tags": ["marve-road", "mith-chowki", "malad-west", "beach-pregame", "budget-liquor"],
        "photo": "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Samadhan Restaurant & Bar",
        "category": "bars",
        "neighborhood": "Goregaon East",
        "address": "Film City Road, near Dindoshi, Goregaon East, Mumbai, Maharashtra 400097",
        "price": "₹600–1,100 for two",
        "rating": 4.0,
        "vibe": "Heavily patronized by studio crew members and local workers winding down after long shifts near Film City. It offers deeply discounted domestic hard liquor options and heavy North Indian mains.",
        "lat": 19.1725,
        "lng": 72.8688,
        "tags": ["film-city-road", "dindoshi", "goregaon-east", "studio-crowd", "north-indian-mains"],
        "photo": "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Meghdoot Bar & Restaurant",
        "category": "bars",
        "neighborhood": "Jogeshwari East",
        "address": "Near Majas Depot, JVLR, Jogeshwari East, Mumbai, Maharashtra 400060",
        "price": "₹500–1,000 for two",
        "rating": 3.8,
        "vibe": "A raw, completely functional drinking hole located right off the busy highway intersection. It is ideal for a swift, dirt-cheap pint of beer before battling the evening traffic commute.",
        "lat": 19.1345,
        "lng": 72.8682,
        "tags": ["jvlr", "majas-depot", "jogeshwari-east", "highway-dive", "commuter-pint"],
        "photo": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Sagar Restaurant & Bar (Orlem)",
        "category": "bars",
        "neighborhood": "Malad West",
        "address": "Orlem, Zakaria Road, Malad West, Mumbai, Maharashtra 400064",
        "price": "₹600–1,200 for two",
        "rating": 4.1,
        "vibe": "A legendary local pocket-friendly den tucked away in the Orlem neighborhood. It draws a loyal crowd of regulars who swear by its affordable chilled pitchers and spicy Mangalorean fish fry dishes.",
        "lat": 19.1912,
        "lng": 72.8425,
        "tags": ["orlem", "zakaria-road", "malad-west", "mangalorean-fish-fry", "chilled-pitchers"],
        "photo": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Ashoka Bar & Restaurant",
        "category": "bars",
        "neighborhood": "Goregaon West",
        "address": "MG Road, near Jawahar Nagar, Goregaon West, Mumbai, Maharashtra 400062",
        "price": "₹500–1,050 for two",
        "rating": 3.9,
        "vibe": "A classic neighborhood joint that has maintained its low pricing structure for years despite the area's development. The vibe is old-school retro, and the roasted papad baskets are always free-flowing.",
        "lat": 19.1625,
        "lng": 72.8428,
        "tags": ["jawahar-nagar", "mg-road", "goregaon-west", "roasted-papad", "retro-neighborhood-bar"],
        "photo": "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Pushpa Bar & Restaurant",
        "category": "bars",
        "neighborhood": "Jogeshwari West",
        "address": "S.V. Road, near Oshiwara District, Jogeshwari West, Mumbai, Maharashtra 400102",
        "price": "₹550–1,100 for two",
        "rating": 3.8,
        "vibe": "A completely unpretentious local permit room where the retail markup on spirits is kept to an absolute minimum. It offers a quick escape for affordable beers and classic Indo-Chinese starters.",
        "lat": 19.1445,
        "lng": 72.8422,
        "tags": ["oshiwara-border", "sv-road", "jogeshwari-west", "indo-chinese", "low-markup-spirits"],
        "photo": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Rupali Restaurant & Bar",
        "category": "bars",
        "neighborhood": "Malad East",
        "address": "Kurar Village, near Western Express Highway, Malad East, Mumbai, Maharashtra 400097",
        "price": "₹450–900 for two",
        "rating": 3.7,
        "vibe": "A basic, raw local joint focusing strictly on low-budget drinking sessions for neighborhood residents. The tables turn over rapidly, the service is swift, and the hard liquor is exceptionally cheap.",
        "lat": 19.1832,
        "lng": 72.8615,
        "tags": ["kurar-village", "malad-east", "weh-corridor", "rapid-turnover", "cheap-hard-liquor"],
        "photo": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "City Tower Bar & Restaurant",
        "category": "bars",
        "neighborhood": "Goregaon West",
        "address": "Near Station Road, City Centre Lane, Goregaon West, Mumbai, Maharashtra 400062",
        "price": "₹500–1,000 for two",
        "rating": 3.8,
        "vibe": "A high-turnover local hub located right near the railway station marketplace. It is perfect for local business owners looking for a fast, cheap pint of beer and crunchy Chana Garlic Fry after closing shop.",
        "lat": 19.1638,
        "lng": 72.8442,
        "tags": ["goregaon-station", "station-road", "chana-garlic-fry", "market-hub", "post-shop-drink"],
        "photo": "https://images.unsplash.com/photo-1574096079513-d8259312b785?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Deepak Restaurant & Bar",
        "category": "bars",
        "neighborhood": "Jogeshwari East",
        "address": "Shankarwadi, Western Express Highway, Jogeshwari East, Mumbai, Maharashtra 400060",
        "price": "₹500–950 for two",
        "rating": 3.9,
        "vibe": "A straightforward neighborhood permit room heavily patronized by commuters looking for a rapid pre-travel pitstop. The tables are tightly packed, the beers are ice-cold, and the prices are deeply discounted.",
        "lat": 19.1315,
        "lng": 72.8582,
        "tags": ["shankarwadi", "weh", "jogeshwari-east", "tightly-packed", "discounted-beers"],
        "photo": "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1000&auto=format&fit=crop&q=80"
    },
    {
        "name": "Welcome Bar & Restaurant",
        "category": "bars",
        "neighborhood": "Malad West",
        "address": "Liberty Garden Road, Malad West, Mumbai, Maharashtra 400064",
        "price": "₹550–1,100 for two",
        "rating": 4.0,
        "vibe": "A standard local dive offering extremely economical beer options and deep discounts on domestic hard liquor. The service is incredibly attentive, and it features a very relaxed, neighborhood-only crowd.",
        "lat": 19.1852,
        "lng": 72.8462,
        "tags": ["liberty-garden", "malad-west", "relaxed-neighborhood", "attentive-service", "budget-dive"],
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
    base_name = norm_name.split("(")[0].strip()
    
    # Check if exact or base already exists
    match = any(
        norm_name == p["name"].strip().lower() or 
        (base_name == p["name"].strip().lower() and "orlem" not in norm_name)
        for p in master_places
    )
    if match:
        print(f"Skipped existing: {item['name']}")
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
        "subcategory": "Budget Suburban Permit Room & Dive Bar",
        "spot_tier": "underrated",
        "city": "Mumbai",
        "neighborhood": item["neighborhood"],
        "latitude": item["lat"],
        "longitude": item["lng"],
        "access_type": "commercial",
        "safety_level": "high",
        "safety_notes": f"Main commercial street frontage along {item['address'].split(',')[0]}.",
        "hiddenness_score": 0.69,
        "vibe_score": round(item["rating"] / 5.0 * 0.95, 2),
        "safety_score": 0.91,
        "accessibility_score": 0.94,
        "crowd_level": 3,
        "best_time_to_visit": "Post 7:00 PM for lively local vibe and chilled drinks",
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

