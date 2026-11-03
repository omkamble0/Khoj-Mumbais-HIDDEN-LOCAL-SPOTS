import json
import os

user_curated_bars = [
    {
        "id": "mumbai-old-street-cafe-bar-bandra",
        "slug": "old-street-cafe-bar-hill-road-bandra",
        "name": "Old Street Cafe & Bar (Bandra)",
        "short_name": "Old Street Cafe",
        "category": "bars",
        "subcategory": "Vintage Grimy Rock Pub Opposite St. Andrew's with MRP Drink Promos",
        "spot_tier": "underrated",
        "city": "Mumbai",
        "neighborhood": "Bandra West / Hill Road",
        "latitude": 19.0538,
        "longitude": 72.8272,
        "access_type": "commercial",
        "safety_level": "high",
        "safety_notes": "Opposite St. Andrew's Church. Bustling student energy, safe and secure.",
        "hiddenness_score": 0.72,
        "vibe_score": 0.95,
        "safety_score": 0.98,
        "accessibility_score": 0.98,
        "crowd_level": 4,
        "best_time_to_visit": "Evening (6:00 PM - 9:30 PM) for classic rock anthems and aggressive budget drink promos",
        "description": "Perched on Hill Road opposite St. Andrew's Church in Fernande's Villa, Old Street is beloved by Bandra students for vintage grimy charm, loud classic rock, and aggressive budget promotions like MRP drinks on select nights.",
        "vibe_tags": ["mrp-drinks-promos", "st-andrews-church", "rock-music", "vintage-grimy-charm", "bandra-students"],
        "photo_url": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1000&auto=format&fit=crop&q=80",
        "source": "user_curated"
    },
    {
        "id": "mumbai-quarter-pillar-khar",
        "slug": "quarter-pillar-bar-khar-west",
        "name": "Quarter Pillar (Khar West)",
        "short_name": "Quarter Pillar Khar",
        "category": "bars",
        "subcategory": "Industrial-Grunge Dark Bar with Metal Accents & Budget Spirits",
        "spot_tier": "underrated",
        "city": "Mumbai",
        "neighborhood": "Khar West / Ram Krishna Nagar",
        "latitude": 19.0712,
        "longitude": 72.8365,
        "access_type": "commercial",
        "safety_level": "high",
        "safety_notes": "Inside Hotel Singhs International. Well-patrolled and safe.",
        "hiddenness_score": 0.70,
        "vibe_score": 0.94,
        "safety_score": 0.97,
        "accessibility_score": 0.97,
        "crowd_level": 3,
        "best_time_to_visit": "Late night (9:00 PM - midnight) when post-10 PM music kicks in",
        "description": "Tucked inside Hotel Singhs International on Road No. 3, Quarter Pillar features a moody, dark industrial-grunge aesthetic with metal accents, drawing a lively suburban crowd for economical spirits, quick bites, and energetic post-10 PM playlists.",
        "vibe_tags": ["industrial-grunge", "hotel-singhs", "budget-spirits", "post-10pm-music", "khar-nightlife"],
        "photo_url": "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=1000&auto=format&fit=crop&q=80",
        "source": "user_curated"
    },
    {
        "id": "mumbai-golden-bin-bar-juhu-koliwada",
        "slug": "golden-bin-bar-restaurant-juhu-koliwada",
        "name": "Golden Bin Bar & Restaurant",
        "short_name": "Golden Bin Juhu",
        "category": "bars",
        "subcategory": "Raw Juhu Koliwada Local Dive Bar Away from Upscale Lounges",
        "spot_tier": "hidden_gem",
        "city": "Mumbai",
        "neighborhood": "Juhu Koliwada / Santacruz West",
        "latitude": 19.0885,
        "longitude": 72.8282,
        "access_type": "commercial",
        "safety_level": "high",
        "safety_notes": "Authentic coastal village road setting. Safe, respectful neighborhood regular spot.",
        "hiddenness_score": 0.88,
        "vibe_score": 0.93,
        "safety_score": 0.96,
        "accessibility_score": 0.94,
        "crowd_level": 2,
        "best_time_to_visit": "Twilight (6:30 PM - 9:00 PM) for cold lager and spicy fish chakhna",
        "description": "A strictly local, very raw neighborhood joint tucked inside Juhu Koliwada near Gajudhar Bandh. Known exclusively to locals for basic, budget-friendly spirits, ice buckets, and honest coastal chakhna far from the pretension of upscale Juhu lounges.",
        "vibe_tags": ["juhu-koliwada", "raw-local-dive", "no-upscale-markup", "cheap-spirits", "gajudhar-bandh"],
        "photo_url": "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1000&auto=format&fit=crop&q=80",
        "source": "user_curated"
    },
    {
        "id": "mumbai-happy-lunch-home-andheri-east",
        "slug": "happy-lunch-home-beer-bar-andheri-east",
        "name": "Happy Lunch Home Beer Bar",
        "short_name": "Happy Lunch Home",
        "category": "bars",
        "subcategory": "Old-School Andheri-Kurla Road Watering Hole with Cheap Pints (₹400-600)",
        "spot_tier": "hidden_gem",
        "city": "Mumbai",
        "neighborhood": "Andheri East / Bima Nagar",
        "latitude": 19.1165,
        "longitude": 72.8612,
        "access_type": "commercial",
        "safety_level": "high",
        "safety_notes": "Main commercial connector road. Safe, disciplined service for budget drinkers.",
        "hiddenness_score": 0.82,
        "vibe_score": 0.92,
        "safety_score": 0.96,
        "accessibility_score": 0.98,
        "crowd_level": 3,
        "best_time_to_visit": "Post-shift evening (5:30 PM - 8:30 PM) for cheap pints and tandoori chicken",
        "description": "Located in Ladiwala Chawl on Andheri-Kurla Road, Happy Lunch Home is an unvarnished, old-school permit room catering specifically to working-class professionals looking for budget pints, spicy fried chicken, and no-frills service.",
        "vibe_tags": ["andheri-kurla-road", "cheap-pints-400rs", "working-class-haven", "ladiwala-chawl", "no-frills-dive"],
        "photo_url": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1000&auto=format&fit=crop&q=80",
        "source": "user_curated"
    },
    {
        "id": "mumbai-quarter-pillar-vile-parle",
        "slug": "quarter-pillar-bar-vile-parle-east",
        "name": "Quarter Pillar (Vile Parle East)",
        "short_name": "Quarter Pillar Parle",
        "category": "bars",
        "subcategory": "Frequented Local Student Hangout with Low-Priced Beer Options",
        "spot_tier": "underrated",
        "city": "Mumbai",
        "neighborhood": "Vile Parle East / Navpada",
        "latitude": 19.0988,
        "longitude": 72.8525,
        "access_type": "commercial",
        "safety_level": "high",
        "safety_notes": "Pleasant suburban street near Vile Parle station. Safe and welcoming.",
        "hiddenness_score": 0.74,
        "vibe_score": 0.94,
        "safety_score": 0.98,
        "accessibility_score": 0.98,
        "crowd_level": 3,
        "best_time_to_visit": "Afternoon or early evening (5:00 PM - 8:00 PM) for low-priced beers",
        "description": "Situated on Dayaldas Road in Navpada, this popular Vile Parle East student and neighborhood hangout offers pocket-friendly beer options, warm hospitality, and casual bar bites without the steep taxes of western suburban lounges.",
        "vibe_tags": ["vile-parle-east", "navpada", "student-hangout", "low-priced-beer", "dayaldas-road"],
        "photo_url": "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1000&auto=format&fit=crop&q=80",
        "source": "user_curated"
    },
    {
        "id": "mumbai-whats-your-plan-saki-naka",
        "slug": "whats-your-plan-bar-saki-naka",
        "name": "What's Your Plan (Saki Naka)",
        "short_name": "What's Your Plan",
        "category": "bars",
        "subcategory": "Metro-Adjacent Industrial Lounge with Competitive Liquor & Karaoke",
        "spot_tier": "underrated",
        "city": "Mumbai",
        "neighborhood": "Saki Naka / Marol",
        "latitude": 19.1082,
        "longitude": 72.8835,
        "access_type": "commercial",
        "safety_level": "high",
        "safety_notes": "Inside Times Square building near metro station. Secure corporate zone.",
        "hiddenness_score": 0.65,
        "vibe_score": 0.95,
        "safety_score": 0.99,
        "accessibility_score": 0.99,
        "crowd_level": 4,
        "best_time_to_visit": "Weekday evenings (6:30 PM - 10:00 PM) for competitive pricing and lively karaoke",
        "description": "Tucked into the commercial estates of Times Square near Saki Naka Metro, What's Your Plan is famous for highly competitive corporate liquor pricing, monster cocktail towers, and energetic weekday karaoke sessions.",
        "vibe_tags": ["times-square-saki-naka", "metro-adjacent", "competitive-liquor-pricing", "weekday-karaoke", "after-work-buzz"],
        "photo_url": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1000&auto=format&fit=crop&q=80",
        "source": "user_curated"
    },
    {
        "id": "mumbai-knotty-yard-powai",
        "slug": "knotty-yard-budget-lounge-powai",
        "name": "Knotty Yard (Powai Budget Lounge)",
        "short_name": "Knotty Yard Powai",
        "category": "bars",
        "subcategory": "Rare Pocket-Friendly Lounge in Hiranandani with Low-Priced Spirits",
        "spot_tier": "hidden_gem",
        "city": "Mumbai",
        "neighborhood": "Powai / Jalvayu Vihar",
        "latitude": 19.1195,
        "longitude": 72.9125,
        "access_type": "commercial",
        "safety_level": "high",
        "safety_notes": "Beside Hiranandani bus depot 19. Safe, well-lit suburban hub.",
        "hiddenness_score": 0.76,
        "vibe_score": 0.95,
        "safety_score": 0.98,
        "accessibility_score": 0.97,
        "crowd_level": 3,
        "best_time_to_visit": "Evening (6:00 PM - 9:30 PM) for budget-friendly beer buckets and starters",
        "description": "A rare budget-friendly oasis in the otherwise upscale Powai/Hiranandani zone. Located beside Hiranandani bus depot 19, Knotty Yard features an approachable menu with drinks starting at surprisingly low prices, attracting local residents and students.",
        "vibe_tags": ["powai-budget-oasis", "hiranandani-bus-depot", "low-priced-spirits", "jalvayu-vihar", "student-friendly"],
        "photo_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80",
        "source": "user_curated"
    },
    {
        "id": "mumbai-samudra-bar-mumbai-central",
        "slug": "samudra-bar-mumbai-central-station",
        "name": "Samudra Bar (Mumbai Central)",
        "short_name": "Samudra Bar",
        "category": "bars",
        "subcategory": "Traditional No-Frills Permit Room Opposite S.T. Depot (₹400-1400)",
        "spot_tier": "hidden_gem",
        "city": "Mumbai",
        "neighborhood": "Mumbai Central / Dalal Estate",
        "latitude": 18.9695,
        "longitude": 72.8192,
        "access_type": "commercial",
        "safety_level": "high",
        "safety_notes": "Opposite S.T. Depot in Shivlal Motilal Mansion. Safe, working-class crowd.",
        "hiddenness_score": 0.80,
        "vibe_score": 0.92,
        "safety_score": 0.96,
        "accessibility_score": 0.98,
        "crowd_level": 3,
        "best_time_to_visit": "Evening (5:30 PM - 8:30 PM) for cheap beer and live local music sessions",
        "description": "Located in Shivlal Motilal Mansion opposite the S.T. Depot, Samudra is an honest, no-frills neighborhood drinking den offering cheap beer, spiced chakna, and occasional live local music blocks away from Mumbai Central station.",
        "vibe_tags": ["mumbai-central-station", "st-depot", "traditional-permit-room", "cheap-beer", "live-local-music"],
        "photo_url": "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1000&auto=format&fit=crop&q=80",
        "source": "user_curated"
    },
    {
        "id": "mumbai-amoeba-sports-bar-kurla",
        "slug": "amoeba-sports-bar-bowling-phoenix-kurla",
        "name": "Amoeba Sports Bar & Bowling",
        "short_name": "Amoeba Kurla",
        "category": "bars",
        "subcategory": "Hybrid Bowling Alley & Sports Lounge with Budget Happy Hour Pints",
        "spot_tier": "underrated",
        "city": "Mumbai",
        "neighborhood": "Kurla West / Phoenix Marketcity",
        "latitude": 19.0862,
        "longitude": 72.8895,
        "access_type": "commercial",
        "safety_level": "high",
        "safety_notes": "Inside Phoenix Marketcity Mall. Premier mall security and family friendly.",
        "hiddenness_score": 0.60,
        "vibe_score": 0.96,
        "safety_score": 0.99,
        "accessibility_score": 0.99,
        "crowd_level": 4,
        "best_time_to_visit": "Weekday afternoons or match nights for cheap combo deals and bowling",
        "description": "Located on the upper floors of Phoenix Marketcity, Amoeba combines an active bowling alley with a spacious sports lounge, routinely offering surprisingly cheap happy hour pints, beer buckets, and gaming combos that draw huge student groups.",
        "vibe_tags": ["bowling-alley-bar", "phoenix-marketcity", "sports-lounge", "happy-hour-pints", "gaming-combos"],
        "photo_url": "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=1000&auto=format&fit=crop&q=80",
        "source": "user_curated"
    },
    {
        "id": "mumbai-simmba-restobar-kurla",
        "slug": "simmba-restobar-cst-road-kurla",
        "name": "Simmba Restobar (CST Road)",
        "short_name": "Simmba Kurla",
        "category": "bars",
        "subcategory": "Straightforward Local Kurla Bar with Inexpensive Spirits (₹200-1400)",
        "spot_tier": "hidden_gem",
        "city": "Mumbai",
        "neighborhood": "Kurla West / CST Road",
        "latitude": 19.0742,
        "longitude": 72.8712,
        "access_type": "commercial",
        "safety_level": "high",
        "safety_notes": "Located in Hirakhumbar Chawl on CST Road. Safe and prompt service.",
        "hiddenness_score": 0.85,
        "vibe_score": 0.91,
        "safety_score": 0.96,
        "accessibility_score": 0.97,
        "crowd_level": 2,
        "best_time_to_visit": "Evening (6:00 PM - 9:00 PM) for budget drinks and casual tandoori snacks",
        "description": "Occupying a streetfront spot in Hirakhumbar Chawl on CST Road, Simmba is a straightforward, budget-conscious local bar serving inexpensive spirits, chilled beers, and standard casual chakhna for neighborhood regulars.",
        "vibe_tags": ["kurla-cst-road", "inexpensive-spirits", "casual-chakhna", "hirakhumbar-chawl", "local-dive"],
        "photo_url": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1000&auto=format&fit=crop&q=80",
        "source": "user_curated"
    },
    {
        "id": "mumbai-grand-pride-bar-ghatkopar",
        "slug": "grand-pride-bar-ghatkopar-west",
        "name": "Grand Pride Bar (Unlimited Free Chakna)",
        "short_name": "Grand Pride Bar",
        "category": "bars",
        "subcategory": "Local Ghatkopar Legend with Cheap House Pours & Unlimited Free Chakna",
        "spot_tier": "hidden_gem",
        "city": "Mumbai",
        "neighborhood": "Ghatkopar West / Subhash Nagar",
        "latitude": 19.0985,
        "longitude": 72.9052,
        "access_type": "commercial",
        "safety_level": "high",
        "safety_notes": "Subhash Nagar neighborhood dive. Safe, lively, and very generous.",
        "hiddenness_score": 0.82,
        "vibe_score": 0.95,
        "safety_score": 0.97,
        "accessibility_score": 0.96,
        "crowd_level": 3,
        "best_time_to_visit": "Evening (6:00 PM - 9:00 PM) for cheap pours and never-ending complimentary snacks",
        "description": "A legendary insider favorite in Ghatkopar West, Grand Pride is celebrated for offering remarkably cheap house pours paired with unlimited complimentary chakna (fried peanuts, chana, papad) that keeps arriving as long as you're drinking.",
        "vibe_tags": ["unlimited-free-chakna", "ghatkopar-west", "cheap-house-pours", "subhash-nagar-legend", "honest-dive"],
        "photo_url": "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=1000&auto=format&fit=crop&q=80",
        "source": "user_curated"
    }
]

# 1. Update single master file data/places_mumbai.json
file_path = 'data/places_mumbai.json'
with open(file_path, 'r', encoding='utf-8') as f:
    current_places = json.load(f)

existing_ids = set(p['id'] for p in current_places)
existing_names = set(p['name'] for p in current_places)
added_count = 0

for p in user_curated_bars:
    if p['id'] not in existing_ids and p['name'] not in existing_names:
        current_places.append(p)
        added_count += 1
        existing_ids.add(p['id'])
        existing_names.add(p['name'])

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(current_places, f, indent=2, ensure_ascii=False)

print(f"Added {added_count} new user-curated bars to master JSON. Total now: {len(current_places)}")

# 2. Synchronize all modular category files in data/places_mumbai/
categories = {}
for p in current_places:
    categories.setdefault(p['category'], []).append(p)

out_dir = 'data/places_mumbai'
os.makedirs(out_dir, exist_ok=True)

for cat, cat_places in categories.items():
    cat_file = os.path.join(out_dir, f'{cat}.json')
    with open(cat_file, 'w', encoding='utf-8') as f:
        json.dump(cat_places, f, indent=2, ensure_ascii=False)

print("Synchronized all modular files in data/places_mumbai/ successfully!")

