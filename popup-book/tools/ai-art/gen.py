"""Queue FLUX schnell jobs on a local ComfyUI and wait for them.

usage: python gen.py <batch.json>
batch.json: {"name": "b1", "style": "...", "seeds": [1,2], "w":1024, "h":1024,
             "items": {"excavator": "subject text", ...}}
Images land in ComfyUI/output/<name>/<item>_<seed>_00001_.png
"""
import json, sys, time, urllib.request, random

URL = "http://127.0.0.1:8188"


def post(path, data):
    req = urllib.request.Request(URL + path, json.dumps(data).encode(), {"Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req))


def get(path):
    return json.load(urllib.request.urlopen(URL + path))


def workflow(prompt, seed, w, h, prefix):
    return {
        "1": {"class_type": "CheckpointLoaderSimple", "inputs": {"ckpt_name": "flux1-schnell-fp8.safetensors"}},
        "2": {"class_type": "CLIPTextEncode", "inputs": {"text": prompt, "clip": ["1", 1]}},
        "3": {"class_type": "CLIPTextEncode", "inputs": {"text": "", "clip": ["1", 1]}},
        "4": {"class_type": "EmptySD3LatentImage", "inputs": {"width": w, "height": h, "batch_size": 1}},
        "5": {"class_type": "KSampler", "inputs": {
            "model": ["1", 0], "positive": ["2", 0], "negative": ["3", 0], "latent_image": ["4", 0],
            "seed": seed, "steps": 4, "cfg": 1.0, "sampler_name": "euler", "scheduler": "simple", "denoise": 1.0}},
        "6": {"class_type": "VAEDecode", "inputs": {"samples": ["5", 0], "vae": ["1", 2]}},
        "7": {"class_type": "SaveImage", "inputs": {"images": ["6", 0], "filename_prefix": prefix}},
    }


def main():
    b = json.load(open(sys.argv[1], encoding="utf-8"))
    seeds = b.get("seeds") or [random.randint(1, 2**31) for _ in range(b.get("count", 2))]
    ids = []
    for item, subject in b["items"].items():
        for s in seeds:
            prompt = b["style"].replace("{subject}", subject)
            r = post("/prompt", {"prompt": workflow(prompt, s, b.get("w", 1024), b.get("h", 1024), f"{b['name']}/{item}_{s}")})
            ids.append(r["prompt_id"])
    print(f"queued {len(ids)}", flush=True)
    t0 = time.time()
    while ids:
        time.sleep(3)
        ids = [i for i in ids if i not in get(f"/history/{i}")]
    print(f"done in {time.time() - t0:.0f}s")


main()
