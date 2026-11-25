import json

# Load master places
with open('data/places_mumbai.json', 'r', encoding='utf-8') as f:
    places = json.load(f)

brands = [
    'mcdonald', 'burger king', 'kfc', 'subway', 'domino',
    'pizza hut', 'tibbs', 'jumbo king', 'jumboking', 'taco bell',
    'chai point', 'chaayos'
]

def is_generic_chain(p):
    if p.get('source') == 'curated_fastfood_network':
        return True
    name_low = p['name'].lower()
    return any(b in name_low for b in brands)

# Filter out generic chains
authentic_places = [p for p in places if not is_generic_chain(p)]

# Fix the 5 coordinate offsets for genuine spots
coord_fixes = {
    'mumbai-yeoor-bamboo-sanctuary': (19.2275, 72.9460),
    'mumbai-sunraj-restaurant-bar-khar-west': (19.0712, 72.8365),
    'mumbai-capitol-family-restaurant-bar-fort': (18.9405, 72.8342),
    'mumbai-harish-bar-restaurant-malad-west': (19.1882, 72.8435),
    'mumbai-glocal-junction-karaoke-andheri-west': (19.1388, 72.8324),
}

for p in authentic_places:
    if p['id'] in coord_fixes:
        new_lat, new_lng = coord_fixes[p['id']]
        p['latitude'] = new_lat
        p['longitude'] = new_lng

print(f"Master places before: {len(places)}")
print(f"Master places after: {len(authentic_places)}")

# Save cleaned master places
with open('data/places_mumbai.json', 'w', encoding='utf-8') as f:
    json.dump(authentic_places, f, indent=2, ensure_ascii=False)

# Update data/places_mumbai/fastfood.json to empty list
with open('data/places_mumbai/fastfood.json', 'w', encoding='utf-8') as f:
    json.dump([], f, indent=2)

# Clean data/places_mumbai/youth_hangouts.json to keep only genuine malls & hubs
with open('data/places_mumbai/youth_hangouts.json', 'r', encoding='utf-8') as f:
    yh = json.load(f)

clean_yh = [p for p in yh if not any(b in p['name'].lower() for b in brands)]
for p in clean_yh:
    if p['id'] in coord_fixes:
        new_lat, new_lng = coord_fixes[p['id']]
        p['latitude'] = new_lat
        p['longitude'] = new_lng

print(f"Youth hangouts before: {len(yh)}, after: {len(clean_yh)}")
with open('data/places_mumbai/youth_hangouts.json', 'w', encoding='utf-8') as f:
    json.dump(clean_yh, f, indent=2, ensure_ascii=False)

print("✓ Successfully cleaned dataset!")
