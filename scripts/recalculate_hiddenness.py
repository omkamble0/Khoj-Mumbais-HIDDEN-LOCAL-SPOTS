import json
import hashlib
import os
from collections import Counter

MASTER_FILE = "data/places_mumbai.json"
MODULAR_DIR = "data/places_mumbai"

with open(MASTER_FILE, "r", encoding="utf-8") as f:
    places = json.load(f)

def compute_realistic_hiddenness(p):
    tier = p.get('spot_tier', 'underrated')
    crowd = p.get('crowd_level', 3)
    desc = (p.get('description', '') + ' ' + p.get('subcategory', '') + ' ' + ' '.join(p.get('vibe_tags', []))).lower()
    access = p.get('access_type', 'public')
    cat = p.get('category', 'walks')
    
    # Deterministic hash jitter (-0.05 to +0.05)
    h = int(hashlib.md5(p['id'].encode('utf-8')).hexdigest()[:6], 16)
    jitter = ((h % 101) - 50) / 1000.0  # -0.050 to +0.050
    
    # 1. Base by Tier with smooth natural range
    if tier == 'iconic':
        base = 0.36 + jitter * 0.8
        crowd_mod = {1: 0.05, 2: 0.02, 3: 0.00, 4: -0.05, 5: -0.09}.get(crowd, 0.00)
    elif tier == 'hidden_gem':
        base = 0.84 + jitter * 0.9
        crowd_mod = {1: 0.06, 2: 0.03, 3: 0.00, 4: -0.04, 5: -0.07}.get(crowd, 0.00)
    else:  # underrated
        base = 0.62 + jitter * 0.9
        crowd_mod = {1: 0.06, 2: 0.03, 3: 0.00, 4: -0.04, 5: -0.07}.get(crowd, 0.00)
        
    # 2. Access difficulty
    access_mod = 0.04 if access in ['trail_required', 'permissive'] else 0.00
    
    # 3. Contextual Keyword analysis
    kw_mod = 0.00
    hidden_kws = ['hidden', 'tucked', 'secret', 'passcode', 'underground', 'unmarked', 'secluded', 'alley', 'quiet corner', 'mangrove', 'cliff', 'ruins', 'abandoned']
    prominent_kws = ['station', 'terminus', 'highway', 'mall', 'flyover', 'main road', 'junction', 'commercial complex', 'high-turnover', 'landmark', 'iconic']
    
    for kw in hidden_kws:
        if kw in desc:
            kw_mod += 0.03
            break
            
    for kw in prominent_kws:
        if kw in desc:
            kw_mod -= 0.04
            break
            
    score = base + crowd_mod + access_mod + kw_mod
    score = max(0.20, min(0.97, score))
    return round(score, 2)

# Update all places
changes = []
for p in places:
    old_score = p.get('hiddenness_score', 0)
    new_score = compute_realistic_hiddenness(p)
    p['hiddenness_score'] = new_score
    changes.append((p['name'], p.get('spot_tier'), old_score, new_score))

# Analyze distribution
new_scores = [round(p['hiddenness_score'] * 100) for p in places]
c = Counter(new_scores)

print(f"Total places updated: {len(places)}")
print(f"Spread check: Lowest = {min(new_scores)}%, Highest = {max(new_scores)}%, Unique score values = {len(c)}")
print(f"Max places sharing any single score: {max(c.values())} places at {c.most_common(1)[0][0]}%")

print("\nNew Score Distribution (Top 12 frequencies):")
for score, count in sorted(c.items(), key=lambda x: -x[1])[:12]:
    print(f"  {score}%: {count} places")

# Save to master
with open(MASTER_FILE, "w", encoding="utf-8") as f:
    json.dump(places, f, indent=2, ensure_ascii=False)

# Sync modular category files
categories = [
    'cafes', 'bars', 'forts', 'walks', 'treks', 'gardens',
    'viewpoints', 'waterfront', 'heritage', 'books', 'culture',
    'spiritual', 'bazaars'
]

for cat in categories:
    cat_places = [p for p in places if p.get("category") == cat]
    cat_file = os.path.join(MODULAR_DIR, f"{cat}.json")
    with open(cat_file, "w", encoding="utf-8") as f:
        json.dump(cat_places, f, indent=2, ensure_ascii=False)

print("\nSuccessfully updated master dataset and all 13 modular category JSON files!")
