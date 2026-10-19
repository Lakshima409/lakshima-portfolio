"""Optimize portfolio images: convert heavy referenced PNG/JPG to WebP,
relocate URL-encoded screenshot folders to clean paths, generate branded
OG card and monogram favicon. Updates HTML references in place."""
import os
import re
import urllib.parse
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
HTML_FILES = list(ROOT.glob("*.html"))
THRESHOLD = 150 * 1024  # only touch files over 150 KB
MAX_WIDTH = 1600
WEBP_QUALITY = 82

# Folders with spaces/URL-encoded paths -> clean destinations
RELOCATIONS = {
    "Pantry pal Interface ss/": "images/pantrypal/",
    "WEB SS/": "images/webss/",
}


def to_webp(src: Path):
    """Create a compressed .webp next to src. Returns webp path or None on failure."""
    dst = src.with_suffix(".webp")
    if dst.exists() and dst.stat().st_size > 0:
        return dst
    try:
        im = Image.open(src)
        if im.mode == "P":
            im = im.convert("RGBA")
        if im.mode == "RGBA":
            background = Image.new("RGB", im.size, (15, 23, 42))
            background.paste(im, mask=im.split()[3])
            im = background
        elif im.mode != "RGB":
            im = im.convert("RGB")
        if im.width > MAX_WIDTH:
            ratio = MAX_WIDTH / im.width
            im = im.resize((MAX_WIDTH, int(im.height * ratio)), Image.LANCZOS)
        im.save(dst, "WEBP", quality=WEBP_QUALITY, method=6)
        return dst
    except Exception as exc:  # noqa: BLE001
        print(f"  ! failed {src.name}: {exc}")
        return None


def relocate(src_rel: str):
    """Map an URL-encoded/awkward source path to a clean destination path."""
    decoded = urllib.parse.unquote(src_rel)
    for prefix, dest in RELOCATIONS.items():
        if decoded.startswith(prefix):
            name = Path(decoded).name
            name = re.sub(r"[^A-Za-z0-9._-]+", "-", name).strip("-").lower()
            return dest + name
    return None


def main() -> None:
    # 1. Collect referenced images from HTML
    src_pattern = re.compile(r'src="([^"]+\.(?:png|jpg|jpeg|PNG|JPG|JPEG))"')
    refs = set()
    for html in HTML_FILES:
        text = html.read_text(encoding="utf-8")
        refs.update(src_pattern.findall(text))

    # 2. Relocate awkward paths (copy file to clean path if missing)
    relocation_map = {}
    for ref in sorted(refs):
        new_rel = relocate(ref)
        if not new_rel:
            continue
        src_path = ROOT / urllib.parse.unquote(ref)
        dst_path = ROOT / new_rel
        if src_path.exists() and not dst_path.exists():
            dst_path.parent.mkdir(parents=True, exist_ok=True)
            dst_path.write_bytes(src_path.read_bytes())
            print(f"relocated: {ref} -> {new_rel}")
        if dst_path.exists():
            relocation_map[ref] = new_rel

    # 3. Convert heavy referenced images to WebP (in place, clean paths)
    webp_map = {}
    all_paths = {**{r: relocation_map[r] for r in relocation_map},
                 **{r: r for r in refs if r not in relocation_map}}
    for original, current_rel in sorted(all_paths.items()):
        path = ROOT / urllib.parse.unquote(current_rel)
        if not path.exists() or path.suffix.lower() == ".webp":
            continue
        if path.stat().st_size <= THRESHOLD:
            continue
        webp = to_webp(path)
        if webp:
            new_rel = current_rel.rsplit(".", 1)[0] + ".webp"
            webp_map[original] = new_rel
            saved = 100 - (webp.stat().st_size / path.stat().st_size * 100)
            print(f"webp: {path.name} {path.stat().st_size//1024} KB -> "
                  f"{webp.stat().st_size//1024} KB ({saved:.0f}% smaller)")

    # 4. Rewrite HTML references
    total = 0
    for html in HTML_FILES:
        text = html.read_text(encoding="utf-8")
        original_text = text
        for old, new in {**relocation_map, **webp_map}.items():
            text = text.replace(f'src="{old}"', f'src="{new}"')
        if text != original_text:
            html.write_text(text, encoding="utf-8")
            total += 1
    print(f"updated references in {total} html files")

    # 5. Branded OG card 1200x630
    og_path = ROOT / "images" / "og-card.png"
    W, H = 1200, 630
    card = Image.new("RGB", (W, H), (15, 23, 42))
    draw = ImageDraw.Draw(card)
    for y in range(H):
        t = y / H
        r = int(15 + (30 - 15) * t)
        g = int(23 + (41 - 23) * t)
        b = int(42 + (82 - 42) * t)
        draw.line([(0, y), (W, y)], fill=(r, g, b))
    draw.rectangle([0, H - 8, W, H], fill=(59, 130, 246))
    try:
        font_lg = ImageFont.truetype(r"C:\Windows\Fonts\segoeuib.ttf", 72)
        font_md = ImageFont.truetype(r"C:\Windows\Fonts\segoeui.ttf", 36)
        font_sm = ImageFont.truetype(r"C:\Windows\Fonts\segoeui.ttf", 28)
    except OSError:
        font_lg = font_md = font_sm = ImageFont.load_default()
    draw.text((80, 200), "Lakshima Madurangi", font=font_lg, fill=(248, 250, 252))
    draw.text((80, 300), "Software Engineer  |  C# .NET  |  React  |  SQL",
              font=font_md, fill=(148, 163, 184))
    draw.text((80, 370), "Colombo, Sri Lanka  |  Open to intern / junior roles",
              font=font_sm, fill=(148, 163, 184))
    card.save(og_path, "PNG", optimize=True)
    print(f"og-card: {og_path.stat().st_size//1024} KB")

    # 6. Monogram favicon 64x64
    fav = Image.new("RGB", (64, 64), (15, 23, 42))
    fdraw = ImageDraw.Draw(fav)
    fdraw.rounded_rectangle([2, 2, 62, 62], radius=14, fill=(59, 130, 246))
    try:
        font_fav = ImageFont.truetype(r"C:\Windows\Fonts\segoeuib.ttf", 40)
    except OSError:
        font_fav = ImageFont.load_default()
    bbox = fdraw.textbbox((0, 0), "L", font=font_fav)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    fdraw.text(((64 - tw) / 2 - bbox[0], (64 - th) / 2 - bbox[1]), "L",
               font=font_fav, fill=(255, 255, 255))
    fav_path = ROOT / "images" / "favicon.png"
    fav.save(fav_path, "PNG", optimize=True)
    print(f"favicon: {fav_path.stat().st_size} bytes")


if __name__ == "__main__":
    main()