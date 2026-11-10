"""把一台車拆成會動的圖層（輪子、零件），用 SAM 自動切、用 FLUX 局部重繪補好零件後面，不會部署。

usage: python rig.py <去背的 png> <輸出資料夾> <名字> <設定.json>
設定：{"wheels": {"w1": "box:cx,cy,r", ...},     # 輪子大概的圓心和半徑（或輪子上的一點 "x,y"）；SAM 會切出整個輪子，擋在前面的手臂不會被切進去
       "parts": {"bucket": "x,y[-x,y]", ...},    # 其他會動的零件（+/- 點的寫法同 sam_parts.py）
       "fill": "零件拿走以後，後面要補的東西（英文提示詞）"}
輸出（都是跟原圖一樣大的透明圖，在 art 裡全部疊在同一個位置）：
  <名字>-body.webp    車身：零件的地方用 FLUX 局部重繪補好（零件動的時候後面不會有洞）
  <名字>-<輪子>.webp  正圓的輪胎（AI 畫的輪子常常不圓，轉起來會晃：這裡把它拉成正圓，被擋住的部分用另一邊補上）
                      只有最外圈的胎紋會轉；輪框（亮的、有顏色的像素）和輪胎內側都放到 front 裡固定不動
  <名字>-front.webp   擋在輪子前面的東西（手臂、擋泥板）和輪框，蓋在輪胎上面不動
  <名字>-<零件>.webp  零件
  <名字>-rig.json     每個輪子的圓心和半徑（給 art 裡的 data-cx、data-cy）
FLUX 局部重繪要開著 ComfyUI；用 ComfyUI 的 venv 跑
"""
import json, sys, pathlib, re, shutil, time, urllib.request
import numpy as np
import torch
from PIL import Image
from scipy import ndimage
from transformers import Sam2Model, Sam2Processor

src, dst, name, cfg = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2]), sys.argv[3], json.load(open(sys.argv[4], encoding="utf-8"))
dst.mkdir(parents=True, exist_ok=True)
rgba = Image.open(src).convert("RGBA")
A = np.asarray(rgba).astype(np.float32)
alpha = A[..., 3] > 0
H, W = alpha.shape

# ---------- 1. SAM 切零件 ----------
img = Image.new("RGB", rgba.size, (225, 225, 225))
img.paste(rgba, mask=rgba.getchannel("A"))
dev = "cuda" if torch.cuda.is_available() else "cpu"
model = Sam2Model.from_pretrained("facebook/sam2.1-hiera-large").to(dev)
proc = Sam2Processor.from_pretrained("facebook/sam2.1-hiera-large")


def sam(spec):
    # 輪子可以寫 "box:cx,cy,r"（大概的圓心和半徑）：用一個框把輪子框起來給 SAM，比只點一下準（只點一下有時會把車身也切進去）
    if spec.startswith("box:"):
        cx, cy, r = map(int, spec[4:].split(","))
        m = int(r * 0.15) + 6
        box = [max(0, cx - r - m), max(0, cy - r - m), min(W, cx + r + m), min(H, cy + r + m)]
        inputs = proc(images=img, input_boxes=[[box]], return_tensors="pt").to(dev)
        with torch.no_grad():
            out = model(**inputs, multimask_output=True)
        masks = proc.post_process_masks(out.pred_masks.cpu(), inputs["original_sizes"])[0][0]
        res = masks[int(out.iou_scores[0, 0].argmax())].numpy().astype(bool) & alpha
        keep = np.zeros_like(res); keep[box[1]:box[3], box[0]:box[2]] = True
        return res & keep
    pts, labels = [], []
    for sign, xy in re.findall(r"([+-]?)(\d+,\d+)", spec):
        pts.append(list(map(int, xy.split(",")))); labels.append(0 if sign == "-" else 1)
    inputs = proc(images=img, input_points=[[pts]], input_labels=[[labels]], return_tensors="pt").to(dev)
    with torch.no_grad():
        out = model(**inputs, multimask_output=True)
    masks = proc.post_process_masks(out.pred_masks.cpu(), inputs["original_sizes"])[0][0]
    return masks[int(out.iou_scores[0, 0].argmax())].numpy().astype(bool) & alpha


wheel_masks = {k: sam(v) for k, v in cfg.get("wheels", {}).items()}
part_masks = {k: sam(v) for k, v in cfg.get("parts", {}).items()}
del model
torch.cuda.empty_cache()


def save(arr, mask, fname):
    out = arr.copy()
    out[..., 3] = np.where(mask, out[..., 3], 0)
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(dst / fname, quality=90, method=6)


# ---------- 2. 正圓的輪子 ----------
rig = {}
yy, xx = np.mgrid[0:H, 0:W]
front = np.zeros((H, W), bool)
for k, m in wheel_masks.items():
    ys, xs = np.nonzero(m)
    # 輪子的外框（被擋住的那一邊用另一邊對稱回來，比只看外框準）
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    a, b = (x1 - x0) / 2, (y1 - y0) / 2
    R = max(a, b)
    # 目標：半徑 R 的正圓；每一點 (r, θ) 從原圖的橢圓上同一個 (r, θ) 取顏色
    d = np.hypot(xx - cx, yy - cy)
    th = np.arctan2(yy - cy, xx - cx)
    inside = d <= R
    sx = np.clip(np.round(cx + d / R * a * np.cos(th)).astype(int), 0, W - 1)
    sy = np.clip(np.round(cy + d / R * b * np.sin(th)).astype(int), 0, H - 1)
    ok = m[sy, sx]
    # 被擋住（沒取到輪子顏色）的地方：用轉 180 度那一點的顏色補
    sx2 = np.clip(np.round(cx - d / R * a * np.cos(th)).astype(int), 0, W - 1)
    sy2 = np.clip(np.round(cy - d / R * b * np.sin(th)).astype(int), 0, H - 1)
    ok2 = m[sy2, sx2]
    wheel = np.zeros_like(A)
    pick = np.where(ok[..., None], A[sy, sx], A[sy2, sx2])
    have = inside & (ok | ok2)
    # 還是補不到的（兩邊都被擋）：用同一個半徑上的平均顏色
    wheel[have] = pick[have]
    wheel[..., 3] = np.where(have, 255, 0)
    miss = inside & ~have
    if miss.any():
        rb = np.round(d).astype(int)
        for r in np.unique(rb[miss]):
            ring = have & (rb == r)
            if ring.any():
                wheel[miss & (rb == r)] = wheel[ring].mean(axis=0)
        wheel[..., 3] = np.where(inside, 255, 0)
    # 輪框：輪子裡所有亮的、有顏色的像素（黃色輪框、螺絲），留在原地不轉，只有黑色輪胎轉
    # （AI 畫的輪框常常不在輪胎正中間，用半徑切會切到輪框，所以用顏色分）
    lit = (np.maximum(wheel[..., 0], np.maximum(wheel[..., 1], wheel[..., 2])) > 140) | (wheel[..., 0] - wheel[..., 2] > 50)
    lit = ndimage.binary_dilation(ndimage.binary_opening(lit & inside), iterations=2) & inside
    hub_r = int(np.hypot(*(np.nonzero(lit)[::-1] - np.array([[cx], [cy]]))).max()) if lit.any() else 0
    # 輪胎內側（輪框外面那圈深色的胎壁）通常也不在正中間，轉起來會像有第二個輪胎在滑：
    # 所以只有最外圈的胎紋（外半徑的 72% 以外）會轉，裡面全部固定
    hub = lit | (inside & (d < R * 0.72))
    save(wheel, inside & ~hub, f"{name}-{k}.webp")
    hubs = locals().get("hubs", np.zeros_like(A))
    hubs[hub] = wheel[hub]
    rig[k] = [round(cx, 1), round(cy, 1), round(R, 1), hub_r]
    # 圓裡面、不是輪子、也不是其他零件的東西（手臂、擋泥板）＝擋在輪子前面
    front |= inside & alpha & ~m
for m in list(wheel_masks.values()) + list(part_masks.values()):
    front &= ~m
front_img = A.copy()
front_img[..., 3] = np.where(front, A[..., 3], 0)
if "hubs" in locals():  # 輪框疊在擋在前面的東西下面
    hm = hubs[..., 3] > 0
    front_img[hm & ~front] = hubs[hm & ~front]
Image.fromarray(np.clip(front_img, 0, 255).astype(np.uint8)).save(dst / f"{name}-front.webp", quality=90, method=6)

# ---------- 3. 零件 ----------
hole = np.zeros((H, W), bool)
for k, m in part_masks.items():
    save(A, m, f"{name}-{k}.webp")
    hole |= m

# ---------- 4. 車身：零件的地方用 FLUX 局部重繪補起來 ----------
body = A.copy()
if hole.any():
    grow = ndimage.binary_dilation(hole, iterations=6)
    comfy = pathlib.Path(r"D:\AI\ComfyUI")
    # 綠幕上的車身，要補的地方 alpha = 0（ComfyUI 的 LoadImage 會把透明的地方當成遮罩）
    canvas = np.zeros_like(A)
    canvas[..., 1] = 255
    canvas[alpha] = A[alpha]
    canvas[..., 3] = np.where(grow, 0, 255)
    Image.fromarray(canvas.astype(np.uint8)).save(comfy / "input" / f"rig-{name}.png")
    prompt = ("Flat 2D side view illustration from a children's picture book, no black outlines, flat colour fills with darker flat shading. "
              f"{cfg.get('fill', 'the vehicle body')}, on a solid pure chroma-key green (#00FF00) background. No text.")
    wf = {
        "1": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": "flux1-schnell-fp8.safetensors"}},
        "2": {"class_type": "CLIPTextEncode", "inputs": {"text": prompt, "clip": ["1", 1]}},
        "3": {"class_type": "CLIPTextEncode", "inputs": {"text": "", "clip": ["1", 1]}},
        "4": {"class_type": "LoadImage", "inputs": {"image": f"rig-{name}.png"}},
        "5": {"class_type": "VAEEncodeForInpaint", "inputs": {"pixels": ["4", 0], "vae": ["1", 2], "mask": ["4", 1], "grow_mask_by": 8}},
        "6": {"class_type": "KSampler", "inputs": {"model": ["1", 0], "positive": ["2", 0], "negative": ["3", 0], "latent_image": ["5", 0],
                                                   "seed": 7, "steps": 4, "cfg": 1.0, "sampler_name": "euler", "scheduler": "simple", "denoise": 1.0}},
        "7": {"class_type": "VAEDecode", "inputs": {"samples": ["6", 0], "vae": ["1", 2]}},
        "8": {"class_type": "SaveImage", "inputs": {"images": ["7", 0], "filename_prefix": f"rig/{name}"}},
    }
    req = urllib.request.Request("http://127.0.0.1:8188/prompt", json.dumps({"prompt": wf}).encode(), {"Content-Type": "application/json"})
    pid = json.load(urllib.request.urlopen(req))["prompt_id"]
    while True:
        time.sleep(2)
        h = json.load(urllib.request.urlopen(f"http://127.0.0.1:8188/history/{pid}"))
        if pid in h:
            f = h[pid]["outputs"]["8"]["images"][0]
            break
    fill = np.asarray(Image.open(comfy / "output" / f["subfolder"] / f["filename"]).convert("RGB").resize((W, H))).astype(np.float32)
    shutil.copy(comfy / "output" / f["subfolder"] / f["filename"], dst / f"{name}-fill.png")
    # 補出來的部分去綠幕（綠色比紅、藍都多 = 背景）
    green = fill[..., 1] - np.maximum(fill[..., 0], fill[..., 2]) > 30
    body[grow, :3] = fill[grow]
    body[..., 3] = np.where(grow, np.where(green, 0, 255), A[..., 3])
save(body, body[..., 3] > 0, f"{name}-body.webp")
json.dump(rig, open(dst / f"{name}-rig.json", "w"), indent=1)
print(name, "wheels:", rig, "parts:", list(part_masks))
