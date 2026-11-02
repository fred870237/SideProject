"""Export cutouts to WebP for the app and write grid previews.
usage: python export.py <cutdir> <bg.png> <appimgdir> <griddir>
"""
import sys, pathlib
from PIL import Image, ImageDraw

cut, bgp, dst, grid = map(pathlib.Path, sys.argv[1:5])
dst.mkdir(parents=True, exist_ok=True); grid.mkdir(parents=True, exist_ok=True)
for f in sorted(cut.glob("*.png")):
    im = Image.open(f)
    im.save(dst / f"{f.stem}.webp", quality=85, method=6)
    g = Image.new("RGB", im.size, "#dde6f0")
    g.paste(im, (0, 0), im)
    d = ImageDraw.Draw(g)
    for x in range(0, im.width, 50):
        d.line([(x, 0), (x, im.height)], fill="#ff00ff" if x % 100 == 0 else "#ffb0ff", width=1)
        if x % 100 == 0: d.text((x + 2, 2), str(x), fill="#a000a0")
    for y in range(0, im.height, 50):
        d.line([(0, y), (im.width, y)], fill="#00a0ff" if y % 100 == 0 else "#b0e0ff", width=1)
        if y % 100 == 0: d.text((2, y + 2), str(y), fill="#0060a0")
    g.save(grid / f"{f.stem}.jpg", quality=88)
    print(f.stem, im.size, (dst / f"{f.stem}.webp").stat().st_size // 1024, "KB")
bg = Image.open(bgp).convert("RGB").resize((1600, 1000), Image.LANCZOS)
bg.save(dst / "bg.webp", quality=82, method=6)
print("bg", (dst / "bg.webp").stat().st_size // 1024, "KB")
