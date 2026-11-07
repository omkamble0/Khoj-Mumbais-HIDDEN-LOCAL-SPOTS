import json

with open("data/places_mumbai.json", "r", encoding="utf-8") as f:
    places = json.load(f)

budget_bars = [p for p in places if p.get("source") == "curated_budget_bars"]

print(f"--- CURATED BUDGET BARS ({len(budget_bars)}) ---")
for i, b in enumerate(budget_bars, 1):
    print(f"{i}. {b['id']} | {b['name']} | {b.get('neighborhood')} | Lat: {b['latitude']}, Lng: {b['longitude']}")

