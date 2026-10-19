"""Verify all referenced assets exist and JS/HTML element IDs match.

Run after adding images or editing script.js/index.html.
"""
import re
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent

# 1. Every local src referenced by any HTML must exist on disk
missing = []
refs = set()
for html in ROOT.glob("*.html"):
    text = html.read_text(encoding="utf-8")
    for m in re.finditer(r'src="([^"]+)"', text):
        src = m.group(1)
        if src.startswith("http") or src.startswith("//"):
            continue
        refs.add(src)

for ref in sorted(refs):
    if not (ROOT / urllib.parse.unquote(ref)).exists():
        missing.append(ref)

print(f"checked {len(refs)} local src references")
if missing:
    print(f"BROKEN ({len(missing)}):")
    for m in missing:
        print(f"  {m}")
else:
    print("all references resolve OK")

webp_refs = [r for r in refs if r.endswith(".webp")]
print(f"webp references: {len(webp_refs)}")
total = sum((ROOT / urllib.parse.unquote(r)).stat().st_size
            for r in refs if (ROOT / urllib.parse.unquote(r)).exists())
print(f"total referenced local image payload: {total / 1024 / 1024:.1f} MB")

# 2. Every getElementById target must exist in index.html
js = (ROOT / "script.js").read_text(encoding="utf-8")
index = (ROOT / "index.html").read_text(encoding="utf-8")
ids = sorted(set(re.findall(r"getElementById\('([^']+)'\)", js)))
missing_ids = [i for i in ids if f'id="{i}"' not in index]
print(f"checked {len(ids)} JS element IDs")
print("all IDs match OK" if not missing_ids else f"MISSING IDs: {missing_ids}")

# 3. div balance in index.html
opens = len(re.findall(r"<div\b", index))
closes = len(re.findall(r"</div>", index))
print(f"index.html div balance: {opens} open / {closes} close "
      f"({'balanced' if opens == closes else 'MISMATCH'})")