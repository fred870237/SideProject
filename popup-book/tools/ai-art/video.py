"""試做：用 LTX-Video（Lightricks，以圖生影片）讓一台車動起來，跟 rig.py 的做法比較，不會部署。

usage: python video.py <綠幕上的車子.png> <名字> "<動作描述（英文）>" [seed ...]
輸出：ComfyUI/output/video/<名字>_<seed>_*.webp（會動的 webp）
模型：ComfyUI/models/checkpoints/ltxv-2b-0.9.8-distilled-fp8.safetensors、text_encoders/t5xxl_fp8_e4m3fn.safetensors
"""
import json, shutil, sys, time, urllib.request, pathlib

URL = "http://127.0.0.1:8188"
COMFY = pathlib.Path(r"D:\AI\ComfyUI")
src, name, action = pathlib.Path(sys.argv[1]), sys.argv[2], sys.argv[3]
seeds = [int(s) for s in sys.argv[4:]] or [1, 2, 3, 4]
shutil.copy(src, COMFY / "input" / f"video-{name}.png")

prompt = (f"{action} Flat 2D children's picture book illustration, side view, no black outlines, flat colours. "
          "Static camera, the camera does not move. Plain solid green background.")
negative = "camera movement, zoom, morphing, melting, distorted wheels, extra parts, blurry, text, watermark"


def wf(seed):
    return {
        "1": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": "ltxv-2b-0.9.8-distilled-fp8.safetensors"}},
        "2": {"class_type": "CLIPLoader", "inputs": {"clip_name": "t5xxl_fp8_e4m3fn.safetensors", "type": "ltxv"}},
        "3": {"class_type": "CLIPTextEncode", "inputs": {"text": prompt, "clip": ["2", 0]}},
        "4": {"class_type": "CLIPTextEncode", "inputs": {"text": negative, "clip": ["2", 0]}},
        "5": {"class_type": "LoadImage", "inputs": {"image": f"video-{name}.png"}},
        "6": {"class_type": "LTXVImgToVideo", "inputs": {"positive": ["3", 0], "negative": ["4", 0], "vae": ["1", 2], "image": ["5", 0],
                                                         "width": 768, "height": 512, "length": 73, "batch_size": 1, "strength": 1.0}},
        "7": {"class_type": "LTXVConditioning", "inputs": {"positive": ["6", 0], "negative": ["6", 1], "frame_rate": 24}},
        "8": {"class_type": "KSampler", "inputs": {"model": ["1", 0], "positive": ["7", 0], "negative": ["7", 1], "latent_image": ["6", 2],
                                                   "seed": seed, "steps": 8, "cfg": 1.0, "sampler_name": "euler", "scheduler": "simple", "denoise": 1.0}},
        "9": {"class_type": "VAEDecode", "inputs": {"samples": ["8", 0], "vae": ["1", 2]}},
        "10": {"class_type": "SaveAnimatedWEBP", "inputs": {"images": ["9", 0], "filename_prefix": f"video/{name}_{seed}", "fps": 24,
                                                           "lossless": False, "quality": 85, "method": "default"}},
    }


ids = []
for s in seeds:
    req = urllib.request.Request(URL + "/prompt", json.dumps({"prompt": wf(s)}).encode(), {"Content-Type": "application/json"})
    ids.append(json.load(urllib.request.urlopen(req))["prompt_id"])
t0 = time.time()
while ids:
    time.sleep(5)
    ids = [i for i in ids if i not in json.load(urllib.request.urlopen(f"{URL}/history/{i}"))]
print(f"done in {time.time() - t0:.0f}s ->", COMFY / "output" / "video")
