import json

with open('data/places_mumbai.json', 'r', encoding='utf-8') as f:
    places = json.load(f)

yh = [p for p in places if p.get('source') == 'curated_youth_hubs']
print(f"Total curated_youth_hubs: {len(yh)}")

chains_in_yh = []
real_malls_in_yh = []

brands = ['mcdonald', 'burger king', 'kfc', 'subway', 'domino', 'pizza hut', 'tibbs', 'jumbo king', 'jumboking', 'starbucks', 'taco bell']

for p in yh:
    is_chain = any(b in p['name'].lower() for b in brands)
    if is_chain:
        chains_in_yh.append(p)
    else:
        real_malls_in_yh.append(p)

print(f"Chains in curated_youth_hubs: {len(chains_in_yh)}")
print(f"Real malls/hubs in curated_youth_hubs: {len(real_malls_in_yh)}")

print("\nChains in curated_youth_hubs:")
for p in chains_in_yh:
    print(f"  {p['id']}: {p['name']} ({p.get('neighborhood')}) -> {p['latitude']}, {p['longitude']}")

print("\nReal hubs (first 10):")
for p in real_malls_in_yh[:10]:
    print(f"  {p['id']}: {p['name']}")
