import json
import math

with open('data/places_mumbai.json', 'r', encoding='utf-8') as f:
    places = json.load(f)

brands = ['mcdonald', 'burger king', 'kfc', 'subway', 'domino', 'pizza hut', 'tibbs', 'jumbo king', 'jumboking', 'taco bell', 'starbucks flagship', 'chai point', 'chaayos']

def is_generic_chain(p):
    if p.get('source') == 'curated_fastfood_network':
        return True
    name_low = p['name'].lower()
    return any(b in name_low for b in brands)

curated_authentic = [p for p in places if not is_generic_chain(p)]

# Let's inspect places in Andheri specifically to see what is around Andheri
andheri_places = [p for p in curated_authentic if 'andheri' in p.get('neighborhood', '').lower() or 'andheri' in p['name'].lower() or (19.110 <= p['latitude'] <= 19.145 and 72.825 <= p['longitude'] <= 72.855)]
print(f"Authentic places around Andheri: {len(andheri_places)}")
for p in andheri_places:
    print(f"  {p['id']}: {p['name']} ({p.get('neighborhood')}) -> {p['latitude']}, {p['longitude']} | {p.get('category')}")
