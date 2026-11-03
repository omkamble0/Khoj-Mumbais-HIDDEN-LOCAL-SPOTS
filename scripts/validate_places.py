import json

places = json.load(open('data/places_mumbai.json', encoding='utf-8'))
ids = set()
names = set()
errors = []

for i, p in enumerate(places):
    pid = p.get('id')
    if not pid:
        errors.append(f"Place at index {i} has no id")
    elif pid in ids:
        errors.append(f"Duplicate ID: {pid}")
    ids.add(pid)
    
    n = p.get('name', '').strip().lower()
    if not n:
        errors.append(f"Place {pid} has no name")
    elif n in names:
        errors.append(f"Duplicate name: {p.get('name')}")
    names.add(n)
    
    lat = p.get('latitude', 0)
    lng = p.get('longitude', 0)
    if not (18.2 <= lat <= 20.2 and 72.5 <= lng <= 73.5):
        errors.append(f"Invalid coords for {pid}: {lat}, {lng}")
        
    img = p.get('photo_url', '')
    if not (img.startswith('http://') or img.startswith('https://')):
        errors.append(f"Invalid photo_url for {pid}: {img}")

if errors:
    print(f"Validation failed with {len(errors)} errors:")
    for e in errors[:10]:
        print(" -", e)
else:
    print(f"Validation successful! All {len(places)} places are 100% valid with 0 errors.")
