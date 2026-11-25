import json

with open('data/places_mumbai.json', 'r', encoding='utf-8') as f:
    places = json.load(f)

print(f"Total places: {len(places)}")
has_photo = sum(1 for p in places if p.get('photo_url'))
has_desc = sum(1 for p in places if p.get('description'))
has_lat_lng = sum(1 for p in places if p.get('latitude') and p.get('longitude'))
print(f"Places with photos: {has_photo}/{len(places)}")
print(f"Places with descriptions: {has_desc}/{len(places)}")
print(f"Places with valid lat/lng: {has_lat_lng}/{len(places)}")

# Check for any coordinates outside MMR bounds (lat: 18.5 - 19.6, lng: 72.6 - 73.4)
out_of_bounds = [p for p in places if not (18.5 <= p['latitude'] <= 19.6 and 72.6 <= p['longitude'] <= 73.4)]
print(f"Out of MMR bounds: {len(out_of_bounds)}")
for p in out_of_bounds:
    print(f"  {p['name']}: {p['latitude']}, {p['longitude']}")

# Check names and neighborhoods for any special formatting or missing values
missing_nh = [p for p in places if not p.get('neighborhood')]
print(f"Places with missing neighborhood: {len(missing_nh)}")

# Check Google search queries generated for each place
sample_queries = []
for p in places[:10]:
    clean_city = p.get('city', 'Mumbai').replace('/ MMR', '').replace('/ MMR Coast', '').strip()
    query = f"{p['name']}, {p.get('neighborhood', '')}, {clean_city}".strip(', ')
    sample_queries.append(query)

print("\nSample Generated Search Targets:")
for sq in sample_queries[:5]:
    print(f"  • {sq}")
