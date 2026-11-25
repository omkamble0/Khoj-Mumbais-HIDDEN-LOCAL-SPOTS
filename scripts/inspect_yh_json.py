import json

with open('data/places_mumbai/youth_hangouts.json', 'r', encoding='utf-8') as f:
    yh = json.load(f)

brands = ['mcdonald', 'burger king', 'kfc', 'subway', 'domino', 'pizza hut', 'tibbs', 'jumbo king', 'jumboking', 'taco bell']

yh_chains = [p for p in yh if any(b in p['name'].lower() for b in brands)]
print(f"Total in youth_hangouts: {len(yh)}")
print(f"Chains in youth_hangouts: {len(yh_chains)}")
for p in yh_chains:
    print(f"  {p['id']}: {p['name']} ({p.get('neighborhood')}) -> {p['latitude']}, {p['longitude']}")
