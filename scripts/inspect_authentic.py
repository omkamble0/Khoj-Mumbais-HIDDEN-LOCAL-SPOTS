import json
from collections import Counter

with open('data/places_mumbai.json', 'r', encoding='utf-8') as f:
    places = json.load(f)

brands = ['mcdonald', 'burger king', 'kfc', 'subway', 'domino', 'pizza hut', 'tibbs', 'jumbo king', 'jumboking', 'taco bell', 'starbucks flagship', 'chai point', 'chaayos']

def is_generic_chain(p):
    if p.get('source') == 'curated_fastfood_network':
        return True
    name_low = p['name'].lower()
    return any(b in name_low for b in brands)

curated_authentic = [p for p in places if not is_generic_chain(p)]
print(f"Total authentic curated places: {len(curated_authentic)}")

cats = Counter(p.get('category', 'unknown') for p in curated_authentic)
print("\nCategories of authentic places:")
for c, cnt in cats.items():
    print(f"  {c}: {cnt}")

sources = Counter(p.get('source', 'unknown') for p in curated_authentic)
print("\nSources of authentic places:")
for s, cnt in sources.items():
    print(f"  {s}: {cnt}")
