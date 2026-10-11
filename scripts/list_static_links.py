import os
import re

SRC_DIR = r"c:\xampp\htdocs\DIGITALKSIND\sodaars\provider\src"

# Get all unique static string links
link_re = re.compile(r'<(?:Link|NavLink|a)\s+[^>]*?(?:to|href)=["\']([^"\']+)["\']', re.DOTALL)

all_static_links = set()
link_occurrences = []

for root, _, files in os.walk(SRC_DIR):
    for f in files:
        if f.endswith(('.tsx', '.ts')):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
                txt = fp.read()
            for m in link_re.finditer(txt):
                url = m.group(1).strip()
                all_static_links.add(url)
                link_occurrences.append((os.path.relpath(path, SRC_DIR).replace('\\', '/'), url))

print(f"Total unique static link URLs: {len(all_static_links)}")
for url in sorted(all_static_links):
    print("  ", url)
