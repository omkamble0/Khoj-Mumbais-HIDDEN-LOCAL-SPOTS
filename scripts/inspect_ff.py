import json

with open('data/places_mumbai.json', 'r', encoding='utf-8') as f:
    places = json.load(f)

ff = [p for p in places if p.get('source') == 'curated_fastfood_network']
print(f"Total curated_fastfood_network: {len(ff)}")
for p in ff[:15]:
    print(f"{p['id']}: {p['name']} | {p['latitude']}, {p['longitude']} | {p.get('neighborhood')}")

yh = [p for p in places if p.get('source') == 'curated_youth_hubs']
print(f"\nTotal curated_youth_hubs: {len(yh)}")
for p in yh[:15]:
    print(f"{p['id']}: {p['name']} | {p['latitude']}, {p['longitude']} | {p.get('neighborhood')}")
