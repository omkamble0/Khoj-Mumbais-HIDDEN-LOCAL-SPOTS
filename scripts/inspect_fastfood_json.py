import json

with open('data/places_mumbai/fastfood.json', 'r', encoding='utf-8') as f:
    ff = json.load(f)

print(f"Total entries in fastfood.json: {len(ff)}")
for p in ff[:10]:
    print(f"  {p['id']}: {p['name']} ({p.get('neighborhood')}) -> {p['latitude']}, {p['longitude']}")
