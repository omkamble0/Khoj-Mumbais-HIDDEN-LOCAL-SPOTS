import re

with open('lib/transit.ts', 'r', encoding='utf-8') as f:
    text = f.read()

station_matches = re.findall(r'\{\s*id:\s*[\'"]([^\'"]+)[\'"],\s*name:\s*[\'"]([^\'"]+)[\'"].*?lines:\s*\[(.*?)\]', text, re.DOTALL)

existing_ids = set()
existing_names = set()
for sid, name, lines_str in station_matches:
    existing_ids.add(sid)
    existing_names.add(name.lower().strip())

print(f"Total existing unique stations: {len(existing_ids)}")

# Check key Mumbai transit stations:
target_stations = [
    # Western Railway
    ('stn-ram-mandir', 'Ram Mandir', ['western'], 19.1534, 72.8496, 'Western Suburbs'),
    ('stn-dahisar-rail', 'Dahisar (WR)', ['western'], 19.2501, 72.8592, 'Western Suburbs'),
    ('stn-mira-road', 'Mira Road', ['western'], 19.2810, 72.8561, 'Thane / Beyond'),
    ('stn-bhayandar', 'Bhayandar', ['western'], 19.3015, 72.8524, 'Thane / Beyond'),
    ('stn-naigaon', 'Naigaon', ['western'], 19.3512, 72.8468, 'Thane / Beyond'),
    ('stn-vasai-road', 'Vasai Road', ['western'], 19.3804, 72.8322, 'Thane / Beyond'),
    ('stn-nallasopara', 'Nallasopara', ['western'], 19.4172, 72.8190, 'Thane / Beyond'),
    ('stn-virar', 'Virar', ['western'], 19.4542, 72.8118, 'Thane / Beyond'),
    ('stn-mahim', 'Mahim Junction', ['western', 'harbour'], 19.0406, 72.8431, 'Western Suburbs'),
    ('stn-matunga-road', 'Matunga Road', ['western'], 19.0278, 72.8432, 'South Mumbai'),
    ('stn-prabhadevi', 'Prabhadevi', ['western'], 19.0131, 72.8315, 'South Mumbai'),
    
    # Central Railway
    ('stn-sandhurst-road', 'Sandhurst Road', ['central', 'harbour'], 18.9614, 72.8394, 'South Mumbai'),
    ('stn-chinchpokli', 'Chinchpokli', ['central'], 18.9868, 72.8317, 'South Mumbai'),
    ('stn-currey-road', 'Currey Road', ['central'], 18.9952, 72.8325, 'South Mumbai'),
    ('stn-parel', 'Parel', ['central'], 19.0084, 72.8364, 'South Mumbai'),
    ('stn-sion', 'Sion', ['central'], 19.0396, 72.8624, 'Central Suburbs'),
    ('stn-vidyavihar', 'Vidyavihar', ['central'], 19.0798, 72.8973, 'Central Suburbs'),
    ('stn-vikhroli', 'Vikhroli', ['central'], 19.1102, 72.9288, 'Central Suburbs'),
    ('stn-kanjurmarg', 'Kanjurmarg', ['central'], 19.1303, 72.9351, 'Central Suburbs'),
    ('stn-nahur', 'Nahur', ['central'], 19.1554, 72.9463, 'Central Suburbs'),
    ('stn-dombivli', 'Dombivli', ['central'], 19.2184, 73.0867, 'Thane / Beyond'),
    
    # Harbour Line
    ('stn-dockyard-road', 'Dockyard Road', ['harbour'], 18.9664, 72.8437, 'South Mumbai'),
    ('stn-reay-road', 'Reay Road', ['harbour'], 18.9758, 72.8456, 'South Mumbai'),
    ('stn-cotton-green', 'Cotton Green', ['harbour'], 18.9861, 72.8475, 'South Mumbai'),
    ('stn-sewri', 'Sewri', ['harbour'], 18.9995, 72.8542, 'South Mumbai'),
    ('stn-gtb-nagar', 'GTB Nagar', ['harbour'], 19.0326, 72.8643, 'Central Suburbs'),
    ('stn-chunabhatti', 'Chunabhatti', ['harbour'], 19.0520, 72.8752, 'Central Suburbs'),
    ('stn-tilak-nagar', 'Tilak Nagar', ['harbour'], 19.0682, 72.8945, 'Central Suburbs'),
    ('stn-govandi', 'Govandi', ['harbour'], 19.0558, 72.9152, 'Central Suburbs'),
    ('stn-mankhurd', 'Mankhurd', ['harbour'], 19.0494, 72.9318, 'Central Suburbs'),
    ('stn-sanpada', 'Sanpada', ['harbour'], 19.0664, 73.0097, 'Navi Mumbai'),
    ('stn-juinagar', 'Juinagar', ['harbour'], 19.0583, 73.0184, 'Navi Mumbai'),
    ('stn-nerul', 'Nerul', ['harbour'], 19.0333, 73.0175, 'Navi Mumbai'),
    ('stn-seawoods', 'Seawoods-Darave', ['harbour'], 19.0195, 73.0186, 'Navi Mumbai'),
    ('stn-kharghar-rail', 'Kharghar (HR)', ['harbour'], 19.0278, 73.0673, 'Navi Mumbai'),
    ('stn-khandeshwar', 'Khandeshwar', ['harbour'], 18.9997, 73.1042, 'Navi Mumbai')
]

missing = []
for sid, name, lines, lat, lng, zone in target_stations:
    found = False
    for esid in existing_ids:
        if sid == esid or name.lower() in existing_names:
            found = True
            break
    if not found:
        missing.append((sid, name, lines, lat, lng, zone))

print(f"Missing essential stations found: {len(missing)}")
for m in missing:
    print(f"  {m[0]}: {m[1]} ({','.join(m[2])})")
