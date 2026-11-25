import json

with open('data/places_mumbai.json', 'r', encoding='utf-8') as f:
    places = json.load(f)

for p in places:
    name_low = p['name'].lower()
    if 'andheri' in name_low and any(b in name_low for b in ['kfc', 'mcd', 'subway', 'tibbs', 'burger', 'jumbo', 'domino']):
        print(f"{p['id']}: {p['name']} | source: {p.get('source')} | coords: {p['latitude']}, {p['longitude']}")
