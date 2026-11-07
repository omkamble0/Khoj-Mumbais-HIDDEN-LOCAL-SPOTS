import json

with open("data/places_mumbai.json", "r", encoding="utf-8") as f:
    places = json.load(f)

sources = [
    'curated_chaotic', 'curated_budget_friendly',
    'curated_student_friendly', 'curated_super_local', 'curated_karaoke_bars', 'user_curated'
]

for src in sources:
    plist = [p for p in places if p.get("source") == src]
    print(f"=== {src} ({len(plist)}) ===")
    for b in plist:
        print(f"  {b['id']} | {b['name']} | {b.get('neighborhood')} | Lat: {b['latitude']}, Lng: {b['longitude']}")

