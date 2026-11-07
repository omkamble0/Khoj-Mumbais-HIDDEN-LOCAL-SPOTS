import json

with open("data/places_mumbai.json", "r", encoding="utf-8") as f:
    places = json.load(f)

for p in places:
    if p.get("source") == "curated_underrated" and p.get("category") == "bars":
        print(f"{p['id']} | {p['name']} | {p.get('neighborhood')} | {p['latitude']}, {p['longitude']}")

