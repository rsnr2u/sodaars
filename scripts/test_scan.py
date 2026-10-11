import os
import re
import glob

src_dir = r"c:\xampp\htdocs\DIGITALKSIND\sodaars\provider\src"

files = []
for root, dirs, f_names in os.walk(src_dir):
    for f in f_names:
        if f.endswith(('.tsx', '.ts')):
            files.append(os.path.join(root, f))

print(f"Total source files to scan: {len(files)}")

link_patterns = [
    # <Link to="..." or <NavLink to="..."
    re.compile(r'<(?:Link|NavLink)[^>]+?to=(?:["\']([^"\']+)["\']|\{[`"\']([^`"\']+)[`"\']\})[^>]*>(.*?)</(?:Link|NavLink)>', re.DOTALL),
    # Self-closing <Link to="..." ... />
    re.compile(r'<(?:Link|NavLink)[^>]+?to=(?:["\']([^"\']+)["\']|\{[`"\']([^`"\']+)[`"\']\})[^>]*/>', re.DOTALL),
    # <a href="..."
    re.compile(r'<a[^>]+?href=(?:["\']([^"\']+)["\']|\{[`"\']([^`"\']+)[`"\']\})[^>]*>(.*?)</a>', re.DOTALL),
    # navigate('...')
    re.compile(r'navigate\((?:["\']([^"\']+)["\']|`([^`]+)`)', re.DOTALL),
]

# Let's run a test extraction
found = []
for file_path in files:
    rel_path = os.path.relpath(file_path, src_dir)
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Also find simple to="..." or href="..."
    for match in re.finditer(r'\b(?:to|href)=(?:["\']([^"\']+)["\']|\{[`"\']([^`"\']+)[`"\']\})', content):
        url = match.group(1) or match.group(2)
        found.append((rel_path, url))

print(f"Total raw link attributes found: {len(found)}")
