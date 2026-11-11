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
    opts = rest[1] if len(rest) > 1 else {}
    # 綠色的動物（例如綠鬣蜥）改用洋紅色背景生圖：{"key": "magenta"}
    magenta = opts.get("key") == "magenta"
    im = np.asarray(Image.open(path).convert("RGB")).astype(np.int16).copy()
    # 手動擦掉的範圍 [x0, y0, x1, y1]：塗成背景色
    for x0, y0, x1, y1 in (rest[0] if rest else []):
        im[y0:y1, x0:x1] = (255, 0, 255) if magenta else (0, 255, 0)
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    if magenta:
        greenness = np.minimum(r, b) - g      # 背景洋紅：r、b 都明顯大於 g（變數名稱沿用 greenness）
    else:
        greenness = g - np.maximum(r, b)      # 背景綠：g 明顯大於 r、b
    bgish = greenness > 18
    lab, _ = ndimage.label(bgish)
    edge = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    bg = np.isin(lab, edge[edge > 0])
    bg = ndimage.binary_fill_holes(bg) & bgish | bg   # 車窗之間圍起來的綠也去掉
    holes = bgish & ~bg
    hl, n = ndimage.label(holes)
    if n:
        sizes = ndimage.sum(holes, hl, range(1, n + 1))
        # 大塊綠色（例如手臂中間的空隙）；桁架很細的圖（Bagger）格子裡的小空隙也要去掉：{"hole": 20}
        bg |= np.isin(hl, 1 + np.flatnonzero(sizes > opts.get("hole", 400)))
    if opts.get("noline"):  # AI 有時會畫出地面或馬路的線：橫跨整張圖（95% 以上寬）的那幾列當成背景
        rows = (~bg).mean(axis=1) > 0.95
        rows = ndimage.binary_dilation(rows, iterations=3)
        bg[rows] = True
        # 線拿掉以後，原本連在線上的小碎點也一起去掉（只留最大的那一塊車子）
        lab2, n2 = ndimage.label(~bg)
        if n2 > 1:
            sizes2 = ndimage.sum(~bg, lab2, range(1, n2 + 1))
            bg |= ~np.isin(lab2, 1 + np.flatnonzero(sizes2 >= sizes2.max() * 0.02))
    alpha = Image.fromarray(np.where(bg, 0, 255).astype(np.uint8))
    if opts.get("erode", True):   # 細線條（塔吊的桁架）不要侵蝕，不然會斷掉
        alpha = alpha.filter(ImageFilter.MinFilter(3))
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.8))
    # 去綠邊：邊緣附近的背景色壓回去
    near = ndimage.binary_dilation(bg, iterations=4)
    spill = near & (greenness > 0)
    if magenta:
        im[..., 0] = np.where(spill, r - greenness, r)
        im[..., 2] = np.where(spill, b - greenness, b)
    else:
        im[..., 1] = np.where(spill, np.maximum(r, b), g)
    im = im + rng.normal(0, 6, im.shape[:2])[..., None]   # 紙張顆粒
    img = Image.fromarray(np.clip(im, 0, 255).astype(np.uint8)).convert("RGBA")
    img.putalpha(alpha)
    img = img.crop(img.getbbox())
    if flip:
        img = img.transpose(Image.FLIP_LEFT_RIGHT)
    img.save(out / f"{name}.png")
    print(name, img.size)
