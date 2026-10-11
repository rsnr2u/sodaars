import os
import re

SRC_DIR = r"c:\xampp\htdocs\DIGITALKSIND\sodaars\provider\src"

pattern = re.compile(r'<(?:Link|NavLink|a)\s+[^>]*?(?:to|href)=\{([^}]+)\}', re.DOTALL)

matches = []
for root, _, files in os.walk(SRC_DIR):
    for f in files:
        if f.endswith(('.tsx', '.ts')):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
                txt = fp.read()
            for m in pattern.finditer(txt):
                expr = m.group(1).strip()
                matches.append((os.path.relpath(path, SRC_DIR).replace('\\', '/'), expr))

print(f"Total dynamic JSX expressions in to/href: {len(matches)}")
unique_exprs = set(matches)
for path, expr in sorted(unique_exprs):
    print(f"  {path}: {expr}")
