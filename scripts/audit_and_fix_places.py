import json
import os
import re
import urllib.request
import urllib.parse
import time

DATA_FILE = "data/places_mumbai.json"

with open(DATA_FILE, "r", encoding="utf-8") as f:
    places = json.load(f)

print(f"Total places loaded: {len(places)}")

# Group places by source
sources = {}
for p in places:
    src = p.get("source", "unknown")
    sources.setdefault(src, []).append(p)

for s, lst in sources.items():
    print(f"Source '{s}': {len(lst)} places")

