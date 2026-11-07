import json

with open("data/places_mumbai.json", "r", encoding="utf-8") as f:
    places = json.load(f)

budget_bars = [p for p in places if p.get("source") == "curated_budget_bars"]

print(f"Total budget bars to audit: {len(budget_bars)}")
for i, b in enumerate(budget_bars, 1):
    print(f"#{i:02d} ID: {b['id']}")
    print(f"    Name: {b['name']}")
    print(f"    Neighborhood in KHOJ: {b.get('neighborhood')}")
    print(f"    Coordinates in KHOJ: {b['latitude']}, {b['longitude']}")
    print(f"    Safety Notes / Address info: {b.get('safety_notes', '')}")
    print()

