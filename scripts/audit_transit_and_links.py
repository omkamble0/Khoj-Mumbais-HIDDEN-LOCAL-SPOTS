import re

with open('lib/transit.ts', 'r', encoding='utf-8') as f:
    text = f.read()

station_blocks = re.findall(r'\{\s*id:\s*[\'"]([^\'"]+)[\'"],\s*name:\s*[\'"]([^\'"]+)[\'"].*?lines:\s*\[(.*?)\]', text, re.DOTALL)

by_line = {}
for sid, name, lines_raw in station_blocks:
    lines = [l.strip().strip("'\"") for l in lines_raw.split(',') if l.strip().strip("'\"")]
    for l in lines:
        if l not in by_line:
            by_line[l] = []
        by_line[l].append((sid, name))

for line, stns in sorted(by_line.items()):
    print(f"=== {line.upper()} ({len(stns)} stations) ===")
    names = [s[1] for s in stns]
    print(", ".join(names))
    print()
