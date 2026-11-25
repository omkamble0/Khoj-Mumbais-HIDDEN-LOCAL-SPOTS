import json

with open('data/places_mumbai.json', 'r', encoding='utf-8') as f:
    places = json.load(f)

brands = ['mcdonald', 'burger king', 'kfc', 'subway', 'domino', 'pizza hut', 'tibbs', 'jumbo king', 'jumboking', 'taco bell', 'chai point', 'chaayos']

def is_generic_chain(p):
    if p.get('source') == 'curated_fastfood_network':
        return True
    name_low = p['name'].lower()
    return any(b in name_low for b in brands)

authentic = [p for p in places if not is_generic_chain(p)]

print(f"Total authentic places: {len(authentic)}")

# Check for duplicate coordinates or duplicate names
seen_names = set()
seen_coords = set()
duplicates = []

for p in authentic:
    name_key = p['name'].strip().lower()
    coord_key = (round(p['latitude'], 4), round(p['longitude'], 4))
    if name_key in seen_names:
        duplicates.append(('name', p['name'], p['id']))
    if coord_key in seen_coords:
        duplicates.append(('coord', p['name'], coord_key, p['id']))
    seen_names.add(name_key)
    seen_coords.add(coord_key)

print(f"Duplicates found: {len(duplicates)}")
for d in duplicates[:10]:
    print(" ", d)

# Check bounds
outside = [p for p in authentic if not (18.5 <= p['latitude'] <= 19.6 and 72.6 <= p['longitude'] <= 73.4)]
print(f"Places outside standard MMR bounds: {len(outside)}")
for p in outside:
    print(f"  {p['name']} ({p.get('neighborhood')}): {p['latitude']}, {p['longitude']}")

# Check any places with suspect names or descriptions
for p in authentic:
    if 'test' in p['name'].lower() or 'sample' in p['name'].lower() or 'dummy' in p['name'].lower():
        print("Suspect place:", p['name'])
