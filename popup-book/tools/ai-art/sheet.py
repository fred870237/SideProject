"""Contact sheet: python sheet.py <dir> <out.jpg> [cols]"""
import sys, pathlib
from PIL import Image, ImageDraw

src, out = pathlib.Path(sys.argv[1]), sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 3
files = sorted(src.glob("*.png"))
tw = 420
thumbs = []
for f in files:
    im = Image.open(f).convert("RGB")
    im.thumbnail((tw, tw))
    thumbs.append((f.stem.replace("_00001_", ""), im))
th = max(im.height for _, im in thumbs) + 24
rows = (len(thumbs) + cols - 1) // cols
sheet = Image.new("RGB", (cols * tw, rows * th), "#888")
d = ImageDraw.Draw(sheet)
for i, (name, im) in enumerate(thumbs):
    x, y = (i % cols) * tw, (i // cols) * th
    sheet.paste(im, (x, y + 24))
    d.text((x + 6, y + 6), name, fill="black")
sheet.save(out, quality=88)
