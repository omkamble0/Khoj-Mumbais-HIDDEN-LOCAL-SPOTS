import json

with open('data/places_mumbai.json', 'r', encoding='utf-8') as f:
    places = json.load(f)

pairs = [
    (19.2244, 72.9495),
    (19.0682, 72.8315),
    (18.9412, 72.8348),
    (19.1865, 72.8488),
    (19.1415, 72.8318),
]

for p in places:
    coord = (round(p['latitude'], 4), round(p['longitude'], 4))
    if coord in pairs:
        print(f"{p['id']}: {p['name']} | {p['latitude']}, {p['longitude']} | {p.get('neighborhood')}")
