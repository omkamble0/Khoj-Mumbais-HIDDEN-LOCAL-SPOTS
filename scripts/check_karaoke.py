import json

places = json.load(open('data/places_mumbai.json', encoding='utf-8'))
candidates = [
    'road house bluez',
    'the local',
    "what's your plan",
    'soul fry',
    'quarter pillar',
    "merlin",
    'glocal junction',
    '3 wise monkeys',
    'tight',
    'saffron express'
]

for c in candidates:
    matches = [p['name'] for p in places if c in p['name'].lower()]
    print(f"{c}: {matches}")

