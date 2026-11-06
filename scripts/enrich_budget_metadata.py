import json
import os
import re

MASTER_FILE = "data/places_mumbai.json"
MODULAR_DIR = "data/places_mumbai"

with open(MASTER_FILE, "r", encoding="utf-8") as f:
    places = json.load(f)

print(f"Total places to process: {len(places)}")

# Keywords for bars and cafes to determine exact cost ranges
HIGH_END_KEYWORDS = [
    'cocktail', 'roastery', 'artisanal', 'specialty', 'craft beer', 'brewery', 
    'britannia', 'subko', 'blue tokai', 'merlin', 'glocal', 'road house', 
    'soul fry', '3 wise monkeys', 'the local', 'passcode', 'aer', 'dome', 
    'asilo', 'bastian', 'olive', 'toit', 'effingut', 'doolally', 'drifters'
]

BUDGET_CAFE_KEYWORDS = [
    'irani', 'chai', 'tea house', 'bun maska', 'merwan', 'kyani', 'yazdani',
    'sassanian', 'koolar', 'military', 'excelsior', 'street', 'bakery', 
    'tapri', 'canteen', 'stall', 'cutting'
]

CHEAP_BAR_KEYWORDS = [
    'permit room', 'dive', 'quarter', 'mrp', 'local spirit', 'chakna',
    'pocket-friendly', 'rock-bottom', 'dirt-cheap', 'cheap pints', 
    'sheela', 'laxmi', 'meghdoot', 'alankar', 'vaishali', 'ashoka'
]

for p in places:
    cat = p.get('category', '')
    sub = (p.get('subcategory', '') + ' ' + p.get('name', '') + ' ' + p.get('description', '')).lower()
    name_lower = p.get('name', '').lower()

    budget_tier = 'free'
    approx_cost = 'Free Public Access'
    price_level = 0

    if cat in ['walks', 'waterfront', 'viewpoints', 'forts', 'gardens', 'spiritual']:
        # Most outdoor / heritage spots are free
        if 'kanheri' in name_lower or 'national park' in name_lower:
            budget_tier = 'pocket_friendly'
            approx_cost = '₹85 entry'
            price_level = 1
        elif 'elephanta' in name_lower:
            budget_tier = 'pocket_friendly'
            approx_cost = '₹260 ferry + ₹40 entry'
            price_level = 1
        elif 'victoria gardens' in name_lower or 'rani bagh' in name_lower or 'zoo' in sub:
            budget_tier = 'pocket_friendly'
            approx_cost = '₹50 entry'
            price_level = 1
        else:
            budget_tier = 'free'
            approx_cost = 'Free'
            price_level = 0

    elif cat == 'heritage':
        if 'caves' in name_lower and ('kanheri' in name_lower or 'elephanta' in name_lower):
            budget_tier = 'pocket_friendly'
            approx_cost = '₹40–85 entry'
            price_level = 1
        else:
            budget_tier = 'free'
            approx_cost = 'Free Public Heritage'
            price_level = 0

    elif cat == 'culture':
        if 'bhau daji lad' in name_lower or 'museum' in name_lower:
            budget_tier = 'pocket_friendly'
            approx_cost = '₹20–100 ticket'
            price_level = 1
        elif 'planetarium' in name_lower:
            budget_tier = 'pocket_friendly'
            approx_cost = '₹120 ticket'
            price_level = 1
        elif 'jehangir' in name_lower or 'mani bhavan' in name_lower:
            budget_tier = 'free'
            approx_cost = 'Free Entry'
            price_level = 0
        else:
            budget_tier = 'pocket_friendly'
            approx_cost = '₹50–150 entry'
            price_level = 1

    elif cat == 'books':
        if 'free reading' in name_lower or 'asiatic' in name_lower:
            budget_tier = 'free'
            approx_cost = 'Free Public Access'
            price_level = 0
        elif 'david sassoon' in name_lower:
            budget_tier = 'pocket_friendly'
            approx_cost = 'Free Garden / ₹50 day-pass'
            price_level = 1
        else:
            budget_tier = 'pocket_friendly'
            approx_cost = 'Free entry (Books from ₹100)'
            price_level = 1

    elif cat == 'bazaars':
        budget_tier = 'pocket_friendly'
        approx_cost = 'Free entry / Budget shopping'
        price_level = 1

    elif cat == 'treks':
        if 'kanheri' in name_lower or 'sanjay gandhi' in name_lower:
            budget_tier = 'pocket_friendly'
            approx_cost = '₹85 park entry'
            price_level = 1
        else:
            budget_tier = 'free'
            approx_cost = 'Free Trail'
            price_level = 0

    elif cat == 'cafes':
        if any(k in name_lower or k in sub for k in HIGH_END_KEYWORDS):
            budget_tier = 'splurge'
            approx_cost = '₹800–1,500 for two'
            price_level = 3
        elif any(k in name_lower or k in sub for k in BUDGET_CAFE_KEYWORDS):
            budget_tier = 'pocket_friendly'
            approx_cost = '₹150–350 for two'
            price_level = 1
        else:
            budget_tier = 'moderate'
            approx_cost = '₹450–800 for two'
            price_level = 2

    elif cat == 'bars':
        if any(k in name_lower or k in sub for k in HIGH_END_KEYWORDS):
            budget_tier = 'splurge'
            approx_cost = '₹900–1,800 for two'
            price_level = 3
        elif any(k in name_lower or k in sub for k in CHEAP_BAR_KEYWORDS):
            budget_tier = 'pocket_friendly'
            approx_cost = '₹400–750 for two'
            price_level = 1
        else:
            budget_tier = 'moderate'
            approx_cost = '₹550–1,100 for two'
            price_level = 2

    p['budget_tier'] = budget_tier
    p['approx_cost'] = approx_cost
    p['price_level'] = price_level

# Save master file
with open(MASTER_FILE, "w", encoding="utf-8") as f:
    json.dump(places, f, indent=2, ensure_ascii=False)

# Sync modular category files
if os.path.exists(MODULAR_DIR):
    cat_buckets = {}
    for p in places:
        c = p.get('category', 'unknown')
        cat_buckets.setdefault(c, []).append(p)
    
    for c, items in cat_buckets.items():
        cat_file = os.path.join(MODULAR_DIR, f"{c}.json")
        with open(cat_file, "w", encoding="utf-8") as f:
            json.dump(items, f, indent=2, ensure_ascii=False)

# Print distribution summary
tiers = {}
for p in places:
    t = p['budget_tier']
    tiers[t] = tiers.get(t, 0) + 1

print("Budget Tier Distribution:")
for t, count in tiers.items():
    print(f"  {t}: {count} places ({count*100/len(places):.1f}%)")

