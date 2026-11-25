import json
import math
import re

with open('data/places_mumbai.json', 'r', encoding='utf-8') as f:
    places = json.load(f)

with open('lib/transit.ts', 'r', encoding='utf-8') as f:
    text = f.read()

station_matches = re.findall(r'\{\s*id:\s*[\'"]([^\'"]+)[\'"],\s*name:\s*[\'"]([^\'"]+)[\'"].*?lines:\s*\[(.*?)\]\s*,\s*latitude:\s*([0-9.]+)\s*,\s*longitude:\s*([0-9.]+)', text, re.DOTALL)

def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi, delta_lambda = math.radians(lat2 - lat1), math.radians(lon2 - lon1)
    a = math.sin(delta_phi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

rail_stations = []
for sid, name, lines_raw, lat, lng in station_matches:
    lines = [l.strip().strip("'\"") for l in lines_raw.split(',') if l.strip().strip("'\"")]
    if any(l in ['western', 'central', 'harbour'] for l in lines):
        rail_stations.append({'name': name, 'lat': float(lat), 'lng': float(lng)})

print(f"Total rail stations now: {len(rail_stations)}")

far = []
for p in places:
    plat = p['latitude']
    plng = p['longitude']
    best_dist = float('inf')
    best_stn = None
    for s in rail_stations:
        d = calculate_distance(plat, plng, s['lat'], s['lng'])
        if d < best_dist:
            best_dist = d
            best_stn = s['name']
    if best_dist > 5000:
        far.append((p['name'], p.get('neighborhood', ''), round(best_dist), best_stn))

print(f"Places > 5km from rail now: {len(far)} (reduced from 83!)")
for item in far[:15]:
    print(f"  {item[0]} ({item[1]}): {item[3]} - {item[2]}m")
