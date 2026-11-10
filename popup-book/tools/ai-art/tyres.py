"""從去背好的車子圖，算出「只有黑色輪胎」和「擋在輪胎前面的零件」兩張圖，讓輪胎可以自己轉、前面的零件不動。

usage: python tyres.py <去背的 png> <輸出資料夾> <名字> cx,cy,外半徑,內半徑 [cx,cy,外半徑,內半徑 ...]
輸出：<名字>-tyres.webp（輪胎圓環裡的黑色像素，給 art 裡 class="wheel" 的零件轉）
      <名字>-front.webp（輪胎圓環裡不是黑色的像素：手臂、輪圈邊緣這些，蓋在最上面不動）
例：巨型礦場的裝載機
  python tyres.py cut/loader.png ../../public/art/img/giant-mine loader 200,495,101,62 410,492,108,66 690,497,98,60
用 ComfyUI 的 venv 跑（需要 numpy、scipy、Pillow）
"""
import sys, pathlib
import numpy as np
from PIL import Image
from scipy import ndimage

src, dst, name = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2]), sys.argv[3]
wheels = [[int(v) for v in a.split(",")] for a in sys.argv[4:]]
im = np.asarray(Image.open(src).convert("RGBA")).astype(np.int16)
h, w = im.shape[:2]
yy, xx = np.mgrid[0:h, 0:w]
ring = np.zeros((h, w), bool)
for cx, cy, r, ri in wheels:
    d = np.hypot(xx - cx, yy - cy)
    ring |= (d <= r + 1) & (d >= ri - 1)
r, g, b, a = im[..., 0], im[..., 1], im[..., 2], im[..., 3]
# 輪胎是深灰黑色（r ≈ b）；黃色、橘色的零件 r 比 b 大很多，或是很亮
front = ring & (a > 0) & ((r - b > 50) | (np.maximum(r, np.maximum(g, b)) > 175))
front = ndimage.binary_dilation(ndimage.binary_opening(front), iterations=1)
tyre = ring & ~front & (a > 0)
for suffix, m in (("front", front), ("tyres", tyre)):
    out = im.copy()
    out[..., 3] = np.where(m, a, 0)
    Image.fromarray(out.astype(np.uint8)).save(dst / f"{name}-{suffix}.webp", quality=88, method=6)
    print(name, suffix, int(m.sum()), "px")
