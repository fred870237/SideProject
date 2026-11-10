"""用 SAM 2（Meta 的 Segment Anything，Apache 2.0）自動切出會動的零件，不用再用眼睛量多邊形，不會部署。

usage: python sam_parts.py <去背的 png> <輸出資料夾> 零件名=x,y[+x,y...][-x,y...] ...
  x,y 是零件上的一點（圖片像素座標）；+ 再加一點，- 是「不要包含這裡」的點
  輸出 <輸出資料夾>/<零件名>.png（白色＝零件）和 _preview.png（零件塗上顏色的預覽）
例：python sam_parts.py cut/loader.png out/sam-loader tyre1=150,480 bucket=150,150-330,330
用 ComfyUI 的 venv 跑（transformers、torch）；第一次會從 Hugging Face 下載 facebook/sam2.1-hiera-large
"""
import sys, pathlib, re
import numpy as np
import torch
from PIL import Image
from transformers import Sam2Model, Sam2Processor

src, dst = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
dst.mkdir(parents=True, exist_ok=True)
rgba = Image.open(src).convert("RGBA")
# 透明的地方鋪成淺灰色，SAM 才不會把背景當成零件的一部分
img = Image.new("RGB", rgba.size, (225, 225, 225))
img.paste(rgba, mask=rgba.getchannel("A"))

dev = "cuda" if torch.cuda.is_available() else "cpu"
model = Sam2Model.from_pretrained("facebook/sam2.1-hiera-large").to(dev)
proc = Sam2Processor.from_pretrained("facebook/sam2.1-hiera-large")

colors = [(255, 60, 60), (60, 160, 255), (60, 200, 90), (255, 190, 40), (190, 80, 255), (0, 200, 200)]
prev = np.asarray(img).astype(np.float32).copy()
for i, arg in enumerate(sys.argv[3:]):
    name, spec = arg.split("=")
    pts, labels = [], []
    for sign, xy in re.findall(r"([+-]?)(\d+,\d+)", spec):
        x, y = map(int, xy.split(","))
        pts.append([x, y]); labels.append(0 if sign == "-" else 1)
    inputs = proc(images=img, input_points=[[pts]], input_labels=[[labels]], return_tensors="pt").to(dev)
    with torch.no_grad():
        out = model(**inputs, multimask_output=True)
    masks = proc.post_process_masks(out.pred_masks.cpu(), inputs["original_sizes"])[0][0]  # (3, H, W)
    best = int(out.iou_scores[0, 0].argmax())
    m = masks[best].numpy().astype(bool) & (np.asarray(rgba.getchannel("A")) > 0)
    Image.fromarray((m * 255).astype(np.uint8)).save(dst / f"{name}.png")
    prev[m] = prev[m] * 0.45 + np.array(colors[i % len(colors)]) * 0.55
    print(name, int(m.sum()), "px, score", round(float(out.iou_scores[0, 0, best]), 3))
Image.fromarray(prev.astype(np.uint8)).save(dst / "_preview.png")
