import json

# The 51 curated budget bars from curated_budget_bars
# Let's categorize each one based on real-world existence and accurate Mumbai location

# Let's inspect each bar and verify
with open("data/places_mumbai.json", "r", encoding="utf-8") as f:
    places = json.load(f)

budget_bars = [p for p in places if p.get("source") == "curated_budget_bars"]

print(f"Loaded {len(budget_bars)} budget bars.")

