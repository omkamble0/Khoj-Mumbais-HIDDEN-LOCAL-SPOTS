import json

with open('data/places_mumbai.json', 'r', encoding='utf-8') as f:
    places = json.load(f)

print(f"Total places: {len(places)}")

fast_food_brands = ['kfc', 'mcd', 'mcdonald', 'subway', 'tibbs', 'burger king', 'domino', 'pizza hut', 'jumbo king', 'jumboking', 'starbucks']

fast_food_places = [p for p in places if any(b in p['name'].lower() for b in fast_food_brands)]
print(f"Total fast food chain places found: {len(fast_food_places)}")
for p in fast_food_places[:30]:
    print(f"  {p['id']}: {p['name']} ({p.get('neighborhood')}) -> {p['latitude']}, {p['longitude']}")

# Also check source or tags
sources = {}
for p in fast_food_places:
    s = p.get('source', 'unknown')
    sources[s] = sources.get(s, 0) + 1
print("Sources of fast food places:", sources)
