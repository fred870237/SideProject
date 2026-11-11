"""自動找出車子圖上的輪子（大概的圓心、半徑），給 rig.py 的 "box:cx,cy,r" 用，不會部署。

usage: python find_wheels.py <去背的 png> [--preview 輸出.png]
做法：車子下半部的深色（輪胎）區塊，用距離轉換找出每個輪胎的中心（兩個輪胎貼在一起也分得開），半徑取那一點到邊緣的距離
印出 JSON：[[cx, cy, r], ...]（由左到右）
用 ComfyUI 的 venv 跑（numpy、scipy、Pillow）
"""
import json, sys
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

src = sys.argv[1]
im = np.asarray(Image.open(src).convert("RGBA")).astype(np.int16)
H, W = im.shape[:2]
a = im[..., 3] > 0
dark = a & (np.max(im[..., :3], axis=2) < 95)
dark[: int(H * 0.45)] = False                      # 只看下半部
dark = ndimage.binary_fill_holes(ndimage.binary_closing(dark, iterations=2))  # 輪框（亮的）填起來，整個輪子算一塊
dist = ndimage.distance_transform_edt(dark)
# 局部最大值 = 輪子中心；半徑太小（細線、陰影）不算
peak = (dist == ndimage.maximum_filter(dist, size=25)) & (dist > max(12, H * 0.05))
lab, n = ndimage.label(peak)
cands = []
for c in ndimage.center_of_mass(peak, lab, range(1, n + 1)):
    y, x = int(round(c[0])), int(round(c[1]))
    cands.append([x, y, float(dist[y, x])])
# 半徑要差不多、中心要在差不多的高度（同一條地面上）
cands.sort(key=lambda c: -c[2])
wheels = []
for x, y, r in cands:
    if any(abs(x - X) < (r + R) * 0.8 for X, Y, R in wheels):
        continue
    wheels.append([x, y, r])
if wheels:
    big = max(r for *_, r in wheels)
    ground = max(y + r for x, y, r in wheels)
    wheels = [w for w in wheels if w[2] > big * 0.55 and abs(w[1] + w[2] - ground) < big * 0.5]
wheels = sorted([[x, y, round(r)] for x, y, r in wheels])
print(json.dumps(wheels))
if "--preview" in sys.argv:
    pv = Image.new("RGBA", (W, H), (200, 220, 240, 255))
    pv.alpha_composite(Image.open(src).convert("RGBA"))
    d = ImageDraw.Draw(pv)
    for x, y, r in wheels:
        d.ellipse([x - r, y - r, x + r, y + r], outline=(255, 0, 255), width=3)
    pv.convert("RGB").save(sys.argv[sys.argv.index("--preview") + 1])
