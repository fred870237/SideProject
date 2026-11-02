"""python grid.py <in.png> <out.jpg> [step]"""
import sys
from PIL import Image, ImageDraw

im = Image.open(sys.argv[1]).convert("RGBA")
step = int(sys.argv[3]) if len(sys.argv) > 3 else 50
g = Image.new("RGB", im.size, "#dde6f0")
g.paste(im, (0, 0), im)
d = ImageDraw.Draw(g)
for x in range(0, im.width, step):
    d.line([(x, 0), (x, im.height)], fill="#ff00ff" if x % (2 * step) == 0 else "#ffb0ff")
    if x % (2 * step) == 0: d.text((x + 2, 2), str(x), fill="#a000a0")
for y in range(0, im.height, step):
    d.line([(0, y), (im.width, y)], fill="#0080ff" if y % (2 * step) == 0 else "#b0e0ff")
    if y % (2 * step) == 0: d.text((2, y + 2), str(y), fill="#0060a0")
g.save(sys.argv[2], quality=88)
