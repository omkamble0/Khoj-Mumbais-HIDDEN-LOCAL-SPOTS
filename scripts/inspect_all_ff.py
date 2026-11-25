import json

with open('data/places_mumbai.json', 'r', encoding='utf-8') as f:
    places = json.load(f)

ff_places = [p for p in places if p['id'].startswith('ff-')]
print(f"Total places with id starting with ff-: {len(ff_places)}")
for p in ff_places[:30]:
    print(f"{p['id']}: {p['name']} | coords: {p['latitude']}, {p['longitude']} | {p.get('neighborhood')}")

# Also check how many total fast food chain outlets exist across all sources
brands = ['mcdonald', 'burger king', 'kfc', 'subway', 'domino', 'pizza hut', 'tibbs', 'jumbo king', 'jumboking', 'starbucks', 'chai point', 'chaayos']
all_chains = [p for p in places if any(b in p['name'].lower() for b in brands)]
print(f"\nTotal chain places: {len(all_chains)}")
by_brand = {}
for p in all_chains:
    for b in brands:
        if b in p['name'].lower():
            by_brand[b] = by_brand.get(b, 0) + 1
            break
print("Chain count by brand:", by_brand)
