import json
import os

MASTER_FILE = "data/places_mumbai.json"
MODULAR_DIR = "data/places_mumbai"

with open(MASTER_FILE, "r", encoding="utf-8") as f:
    master_places = json.load(f)

existing_ids = {p["id"] for p in master_places}
existing_names = {p["name"].strip().lower() for p in master_places}

# 1. Update existing karaoke bars to have prominent 'karaoke' tags
karaoke_existing_keywords = ['road house bluez', "what's your plan", 'soul fry', 'quarter pillar', 'saffron express']
for p in master_places:
    for kw in karaoke_existing_keywords:
        if kw in p["name"].lower():
            tags = p.get("vibe_tags", [])
            if "karaoke" not in tags:
                tags.append("karaoke")
            if "karaoke-nights" not in tags:
                tags.append("karaoke-nights")
            p["vibe_tags"] = tags

new_karaoke_bars = [
    {
        "id": "mumbai-the-local-karaoke-dive-kala-ghoda",
        "slug": "the-local-karaoke-dive-kala-ghoda-fort",
        "name": "The Local",
        "short_name": "The Local",
        "category": "bars",
        "subcategory": "Underground Karaoke Dive & Passcode Den",
        "spot_tier": "hidden_gem",
        "city": "Mumbai",
        "neighborhood": "Kala Ghoda / Fort",
        "latitude": 18.9295,
        "longitude": 72.8331,
        "access_type": "commercial",
        "safety_level": "high",
        "safety_notes": "Well-monitored underground doorway with friendly bouncers on MG Road.",
        "hiddenness_score": 0.85,
        "vibe_score": 0.92,
        "safety_score": 0.94,
        "accessibility_score": 0.95,
        "crowd_level": 4,
        "best_time_to_visit": "Thursday & weekend late nights (post 9:30 PM) for packed karaoke singalongs",
        "description": "A hidden underground dive entry on MG Road that requires a passcode on busy nights, famous for hosting some of South Mumbai’s most casual, high-energy, and inclusive karaoke sessions. Offers fantastic budget-friendly beer pitchers, shots, and a judgment-free singing crowd.",
        "vibe_tags": ["karaoke", "karaoke-nights", "kala-ghoda", "underground-dive", "passcode-entry", "singalong", "budget-pitchers"],
        "photo_url": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1000&auto=format&fit=crop&q=80",
        "source": "curated_karaoke_bars"
    },
    {
        "id": "mumbai-merlins-karaoke-bar-santacruz-east",
        "slug": "merlins-karaoke-bar-orchid-santacruz-east",
        "name": "Merlin's Karaoke Bar",
        "short_name": "Merlin's",
        "category": "bars",
        "subcategory": "Dedicated Airport Karaoke Hub & Live Microphones",
        "spot_tier": "underrated",
        "city": "Mumbai",
        "neighborhood": "Santacruz East",
        "latitude": 19.0945,
        "longitude": 72.8542,
        "access_type": "commercial",
        "safety_level": "high",
        "safety_notes": "Secure hotel premises near domestic airport with valet and tight security.",
        "hiddenness_score": 0.70,
        "vibe_score": 0.88,
        "safety_score": 0.96,
        "accessibility_score": 0.95,
        "crowd_level": 3,
        "best_time_to_visit": "Evenings post 8:30 PM when solo performers and energetic groups take the stage",
        "description": "Located inside The Orchid near the domestic airport, Merlin's dedicated karaoke nights offer an unpretentious, incredibly high-energy singing platform that frequently runs budget domestic drink combos. Features a great mix of retro solo performers, flight crews, and local vocal enthusiasts.",
        "vibe_tags": ["karaoke", "karaoke-nights", "santacruz-east", "airport-hub", "live-microphones", "retro-hits"],
        "photo_url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80",
        "source": "curated_karaoke_bars"
    },
    {
        "id": "mumbai-glocal-junction-karaoke-andheri-west",
        "slug": "glocal-junction-karaoke-andheri-west",
        "name": "Glocal Junction",
        "short_name": "Glocal Junction",
        "category": "bars",
        "subcategory": "Warehouse Karaoke Pop-Ups & Group Singalongs",
        "spot_tier": "iconic",
        "city": "Mumbai",
        "neighborhood": "Andheri West",
        "latitude": 19.1415,
        "longitude": 72.8318,
        "access_type": "commercial",
        "safety_level": "high",
        "safety_notes": "Spacious commercial complex opposite Citi Mall with bouncers and valet.",
        "hiddenness_score": 0.50,
        "vibe_score": 0.90,
        "safety_score": 0.95,
        "accessibility_score": 0.97,
        "crowd_level": 4,
        "best_time_to_visit": "Mid-week Wednesday karaoke sessions for massive discounts and group singalongs",
        "description": "A massive, rustic warehouse space on New Link Road that hosts energetic mid-week karaoke pop-ups featuring massive discounts on select domestic pours. The atmosphere is loud and festive, perfect for large groups wanting to sing along to commercial hits on a budget.",
        "vibe_tags": ["karaoke", "karaoke-nights", "andheri-west", "new-link-road", "warehouse-bar", "group-singalong"],
        "photo_url": "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1000&auto=format&fit=crop&q=80",
        "source": "curated_karaoke_bars"
    },
    {
        "id": "mumbai-3-wise-monkeys-karaoke-khar-west",
        "slug": "3-wise-monkeys-karaoke-sports-pub-khar",
        "name": "3 Wise Monkeys",
        "short_name": "3 Wise Monkeys",
        "category": "bars",
        "subcategory": "Subterranean Sports Pub & Interactive Karaoke",
        "spot_tier": "underrated",
        "city": "Mumbai",
        "neighborhood": "Khar West",
        "latitude": 19.0698,
        "longitude": 72.8365,
        "access_type": "commercial",
        "safety_level": "high",
        "safety_notes": "Busy road near Khar station with constant local activity.",
        "hiddenness_score": 0.65,
        "vibe_score": 0.89,
        "safety_score": 0.93,
        "accessibility_score": 0.98,
        "crowd_level": 4,
        "best_time_to_visit": "Karaoke evenings from 8:30 PM onward with beer buckets and bar bites",
        "description": "An underground-style sports pub near Khar railway station that consistently runs highly interactive karaoke evenings alongside very pocket-friendly craft beer pitchers and spirit buckets. The layout makes it easy to see the lyrics from any booth while munching on pizza and wings.",
        "vibe_tags": ["karaoke", "karaoke-nights", "khar-west", "sports-pub", "station-road", "beer-buckets"],
        "photo_url": "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=1000&auto=format&fit=crop&q=80",
        "source": "curated_karaoke_bars"
    },
    {
        "id": "mmr-tight-karaoke-bar-vashi",
        "slug": "tight-karaoke-bar-inorbit-vashi",
        "name": "Tight",
        "short_name": "Tight",
        "category": "bars",
        "subcategory": "High-Decibel Suburban Karaoke & Beer Towers",
        "spot_tier": "underrated",
        "city": "Mumbai / MMR",
        "neighborhood": "Vashi, Navi Mumbai",
        "latitude": 19.0652,
        "longitude": 72.9985,
        "access_type": "commercial",
        "safety_level": "high",
        "safety_notes": "Located inside Inorbit Mall complex with 24/7 security and parking.",
        "hiddenness_score": 0.68,
        "vibe_score": 0.86,
        "safety_score": 0.94,
        "accessibility_score": 0.96,
        "crowd_level": 4,
        "best_time_to_visit": "Weekend late evenings for high-energy suburban karaoke and massive beer towers",
        "description": "A classic Navi Mumbai budget staple inside Inorbit Mall that runs high-decibel karaoke tracks for a younger suburban crowd. The drink menu boasts exceptionally cheap baseline pricing on domestic spirits and massive multi-liter beer towers.",
        "vibe_tags": ["karaoke", "karaoke-nights", "vashi", "navi-mumbai", "inorbit-mall", "beer-towers", "suburban-karaoke"],
        "photo_url": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1000&auto=format&fit=crop&q=80",
        "source": "curated_karaoke_bars"
    }
]

added_count = 0
for b in new_karaoke_bars:
    if b["id"] not in existing_ids and b["name"].strip().lower() not in existing_names:
        master_places.append(b)
        existing_ids.add(b["id"])
        existing_names.add(b["name"].strip().lower())
        added_count += 1
        print(f"Added: {b['name']} ({b['id']})")
    else:
        print(f"Skipped existing: {b['name']}")

print(f"\nAdded: {added_count} new karaoke bars")
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

