import json
import os
import sys

PLACES_PATH = 'data/places_mumbai.json'
FASTFOOD_PATH = 'data/places_mumbai/fastfood.json'
HANGOUTS_PATH = 'data/places_mumbai/youth_hangouts.json'

print("=" * 60)
print("KHOJ MUMBAI: DATASET INTEGRITY & PROVENANCE VALIDATOR")
print("=" * 60)

with open(PLACES_PATH, 'r', encoding='utf-8') as f:
    master = json.load(f)

with open(FASTFOOD_PATH, 'r', encoding='utf-8') as f:
    ff = json.load(f)

with open(HANGOUTS_PATH, 'r', encoding='utf-8') as f:
    yh = json.load(f)

errors = []

# 1. Check total counts
print(f"Master places: {len(master)}")
print(f"Fastfood places: {len(ff)}")
print(f"Youth hangouts & malls: {len(yh)}")

# 2. Check for known purged hallucinations
hallucinations = [
    'kfc-goregaon-bangur-nagar',
    'bk-malad-orlem',
    'dominos-bandra-pali-hill',
    'kfc-kandivali-mahavir-nagar'
]
for h in hallucinations:
    matches = [p for p in master if p.get('id') == h]
    if matches:
        errors.append(f"CRITICAL: Found purged hallucination still in master: {h}")

# 3. Check for duplicates in master
ids = set()
for p in master:
    pid = p.get('id')
    if pid in ids:
        errors.append(f"Duplicate place ID in master: {pid}")
    ids.add(pid)

# 4. Check coordinates within Greater MMR + Coastal/Western Ghats Getaway Bounds
# Bounds: Lat (18.20 to 20.10), Lng (72.60 to 73.40)
for p in master:
    lat = p.get('latitude')
    lng = p.get('longitude')
    if lat is None or lng is None:
        errors.append(f"Missing coordinates for {p.get('id')}")
    elif not (18.20 <= lat <= 20.10 and 72.60 <= lng <= 73.40):
        errors.append(f"Coordinates out of MMR getaway bounds for {p.get('id')}: ({lat}, {lng})")

# 5. Check mall representations
malls = [p for p in master if p.get('hub_type') == 'mall' or 'mall' in p.get('name', '').lower()]
print(f"Shopping malls & hubs verified in master: {len(malls)}")
if len(malls) < 25:
    errors.append(f"Expected at least 25 malls, found only {len(malls)}")

# 6. Check fastfood flagships
ff_master = [p for p in master if p.get('source') == 'curated_fastfood_network']
print(f"Verified fastfood flagships in master: {len(ff_master)}")
if len(ff_master) != 26:
    errors.append(f"Expected exactly 26 verified flagships, found {len(ff_master)}")

print("-" * 60)
if errors:
    print(f"❌ FAILED with {len(errors)} errors:")
    for err in errors:
        print(f"  • {err}")
    sys.exit(1)
else:
    print("✓ ALL DATASET INTEGRITY & PROVENANCE CHECKS PASSED PERFECTLY!")
    print("=" * 60)
