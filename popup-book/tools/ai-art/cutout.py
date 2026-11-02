"""Green-screen cutout: python cutout3.py <picks.json> <outdir>
picks.json: {"name": ["path.png", flip_bool], ...}
"""
import json, sys, pathlib
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

picks = json.load(open(sys.argv[1], encoding="utf-8"))
out = pathlib.Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(1)

for name, (path, flip, *rest) in picks.items():
    im = np.asarray(Image.open(path).convert("RGB")).astype(np.int16).copy()
    # 手動擦掉的範圍 [x0, y0, x1, y1]：塗成背景綠
    for x0, y0, x1, y1 in (rest[0] if rest else []):
        im[y0:y1, x0:x1] = (0, 255, 0)
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    greenness = g - np.maximum(r, b)          # 背景綠：g 明顯大於 r、b
    bgish = greenness > 18
    lab, _ = ndimage.label(bgish)
    edge = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    bg = np.isin(lab, edge[edge > 0])
    bg = ndimage.binary_fill_holes(bg) & bgish | bg   # 車窗之間圍起來的綠也去掉
    holes = bgish & ~bg
    hl, n = ndimage.label(holes)
    if n:
        sizes = ndimage.sum(holes, hl, range(1, n + 1))
        bg |= np.isin(hl, 1 + np.flatnonzero(sizes > 400))   # 大塊綠色（例如手臂中間的空隙）
    alpha = Image.fromarray(np.where(bg, 0, 255).astype(np.uint8))
    opts = rest[1] if len(rest) > 1 else {}
    if opts.get("erode", True):   # 細線條（塔吊的桁架）不要侵蝕，不然會斷掉
        alpha = alpha.filter(ImageFilter.MinFilter(3))
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.8))
    # 去綠邊：邊緣附近的綠色壓回去
    near = ndimage.binary_dilation(bg, iterations=4)
    spill = near & (greenness > 0)
    im[..., 1] = np.where(spill, np.maximum(r, b), g)
    im = im + rng.normal(0, 6, im.shape[:2])[..., None]   # 紙張顆粒
    img = Image.fromarray(np.clip(im, 0, 255).astype(np.uint8)).convert("RGBA")
    img.putalpha(alpha)
    img = img.crop(img.getbbox())
    if flip:
        img = img.transpose(Image.FLIP_LEFT_RIGHT)
    img.save(out / f"{name}.png")
    print(name, img.size)
