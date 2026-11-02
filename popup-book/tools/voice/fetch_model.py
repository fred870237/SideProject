"""多連線分段下載 Hugging Face 模型（單一連線太慢的時候用），不會部署。

usage: python fetch_model.py <repo> <目標資料夾> [連線數]
例如：python fetch_model.py Qwen/Qwen3-TTS-12Hz-1.7B-Base D:\\AI\\qwen-tts\\models\\Base 16
已經下載完、大小正確的檔案會跳過，可以中斷後重跑。
"""
import os, sys, pathlib, threading, urllib.request
from concurrent.futures import ThreadPoolExecutor
from huggingface_hub import HfApi

repo, dst = sys.argv[1], pathlib.Path(sys.argv[2])
conns = int(sys.argv[3]) if len(sys.argv) > 3 else 16
CHUNK = 32 * 1024 * 1024
info = HfApi().model_info(repo, files_metadata=True)
lock = threading.Lock()


def get_range(url, path, a, b):
    for _ in range(8):
        try:
            req = urllib.request.Request(url, headers={"Range": f"bytes={a}-{b}"})
            with urllib.request.urlopen(req, timeout=60) as r:
                data = r.read()
            if len(data) != b - a + 1:
                raise IOError("short read")
            with lock, open(path, "r+b") as f:
                f.seek(a); f.write(data)
            return len(data)
        except Exception as e:
            err = e
    raise err


for s in info.siblings:
    path = dst / s.rfilename
    size = s.size or 0
    if path.exists() and path.stat().st_size == size:
        continue
    path.parent.mkdir(parents=True, exist_ok=True)
    url = f"https://huggingface.co/{repo}/resolve/main/{s.rfilename}"
    if size < CHUNK:
        urllib.request.urlretrieve(url, path)
        continue
    tmp = path.with_suffix(path.suffix + ".part")
    with open(tmp, "wb") as f:
        f.truncate(size)
    ranges = [(a, min(a + CHUNK, size) - 1) for a in range(0, size, CHUNK)]
    done = 0
    with ThreadPoolExecutor(conns) as ex:
        for n in ex.map(lambda r: get_range(url, tmp, *r), ranges):
            done += n
            print(f"{s.rfilename}: {done / size:5.1%}", flush=True)
    os.replace(tmp, path)
print("done", repo)
