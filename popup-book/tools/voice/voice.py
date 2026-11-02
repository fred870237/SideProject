"""用 Qwen3-TTS 生成機關書的英文語音（車名＋動作音效），不會部署。

usage:
  python voice.py design            # 1. 用 VoiceDesign 設計旁白的聲音，存成參考音檔 out/ref_<n>.wav（多生幾個挑一個）
  python voice.py clone <ref.wav>   # 2. 用 Base 模型複製參考聲音，每句生 TAKES 個版本到 out/takes/
  python voice.py pick              # 3. 每句挑一個版本，轉成 mp3 存到 public/audio/en/，並更新 public/voices.js

環境：D:\\AI\\qwen-tts\\venv（Python 3.14、PyTorch cu128、pip install qwen-tts soundfile lameenc）
"""
import json, pathlib, re, sys
import numpy as np

HERE = pathlib.Path(__file__).parent
OUT = HERE / "out"
PUBLIC = HERE.parent.parent / "public"
TAKES = 3
# 模型用 fetch_model.py 下載到這裡（Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign、-Base）
MODELS = pathlib.Path(r"D:\AI\qwen-tts\models")

# 旁白的聲音描述與參考句
# 第一版太快、太興奮、太尖：改成沉穩、溫柔、音調偏低一點的媽媽說故事聲音
INSTRUCT = ("A calm, gentle adult female voice, like a mother softly reading a bedtime picture book to a toddler. "
            "Clear standard American English, warm and mellow, slightly low and soft pitch, never shrill. "
            "Relaxed and unhurried, speaking slowly with small pauses, friendly and smiling but not excited.")
REF_TEXT = "Hello, little one. Let's open the book and look at all the vehicles. Here comes a big red fire engine."

# 要唸的句子：每頁的車名（跟 art/*.js 裡的 en 一樣）＋動作裡的音效
LINES = [
    # 🏗️ 工地
    "Tower Crane", "Cement Mixer", "Bulldozer", "Portable Toilet", "Excavator", "Dump Truck", "Forklift", "Road Roller",
    # 🚒 消防救援
    "Rescue Helicopter", "Ambulance", "Tow Truck", "Police Motorcycle", "Police Car", "Fire Engine", "Fire Hydrant",
    # 🚜 農場
    "Crop Duster", "Windmill", "Pickup Truck", "Hay Baler", "Tractor", "Combine Harvester", "Quad Bike",
    # 🚛 貨運卡車
    "Semi Truck", "Garbage Truck", "Delivery Van", "Ice Cream Truck", "Car Carrier", "Monster Truck", "Street Sweeper",
    # 🏢 蓋大樓
    "Concrete Pump Truck", "Pile Driver", "Mobile Crane", "Boom Lift", "Skid Steer Loader",
    # 動作音效
    "Hello!", "Beep beep!", "Honk honk!", "Ice cream!",
]


def slug(text):
    """檔名：小寫、只留英數字，中間用 - 連起來（app.js 用同樣的規則找檔案）"""
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def load(name):
    import torch
    from qwen_tts import Qwen3TTSModel
    return Qwen3TTSModel.from_pretrained(str(name), device_map="cuda:0", dtype=torch.bfloat16, attn_implementation="sdpa")


def trim(w, sr, thresh=0.01, pad=0.08):
    """去掉頭尾的靜音，前後各留一點點"""
    idx = np.flatnonzero(np.abs(w) > thresh)
    if not len(idx):
        return w
    a, b = max(0, idx[0] - int(pad * sr)), min(len(w), idx[-1] + int(pad * sr))
    return w[a:b]


def design():
    import soundfile as sf
    OUT.mkdir(exist_ok=True)
    m = load(MODELS / "VoiceDesign")
    for n in range(4):
        wavs, sr = m.generate_voice_design(text=REF_TEXT, language="English", instruct=INSTRUCT)
        sf.write(OUT / f"ref_{n}.wav", wavs[0], sr)
        print("ref", n, f"{len(wavs[0]) / sr:.1f}s")


def clone(ref):
    import soundfile as sf
    takes = OUT / "takes"
    takes.mkdir(parents=True, exist_ok=True)
    # 已經生成過的句子跳過（新增一頁時只會生新的車名）
    todo = [l for l in LINES if not (takes / f"{slug(l)}_{TAKES - 1}.wav").exists()]
    if not todo:
        print("nothing to do")
        return
    m = load(MODELS / "Base")
    prompt = m.create_voice_clone_prompt(ref_audio=str(ref), ref_text=REF_TEXT)
    for t in range(TAKES):
        wavs, sr = m.generate_voice_clone(text=todo, language=["English"] * len(todo), voice_clone_prompt=prompt)
        for line, w in zip(todo, wavs):
            w = trim(np.asarray(w, dtype=np.float32), sr)
            sf.write(takes / f"{slug(line)}_{t}.wav", w, sr)
        print("take", t, "done")


def pick():
    """預設挑長度最接近中位數的版本（太長通常是多唸了東西，太短是唸不完整）；picks.json 可以手動指定"""
    import soundfile as sf
    import lameenc
    dst = PUBLIC / "audio" / "en"
    dst.mkdir(parents=True, exist_ok=True)
    manual = json.loads((HERE / "picks.json").read_text("utf-8")) if (HERE / "picks.json").exists() else {}
    done = []
    for line in LINES:
        s = slug(line)
        files = sorted((OUT / "takes").glob(f"{s}_*.wav"))
        if not files:
            continue
        lens = [sf.info(f).duration for f in files]
        med = float(np.median(lens))
        best = files[manual[s]] if s in manual else files[int(np.argmin([abs(l - med) for l in lens]))]
        w, sr = sf.read(best, dtype="float32")
        if w.ndim > 1:
            w = w.mean(axis=1)
        peak = np.abs(w).max() or 1
        pcm = (w / peak * 0.9 * 32767).astype(np.int16)
        enc = lameenc.Encoder()
        enc.set_bit_rate(64); enc.set_in_sample_rate(sr); enc.set_channels(1); enc.set_quality(2)
        (dst / f"{s}.mp3").write_bytes(enc.encode(pcm.tobytes()) + enc.flush())
        done.append(s)
        print(f"{s:22s} {best.name:28s} {len(w) / sr:.2f}s")
    write_preview(dst, done)
    # app.js 和 sw.js 都讀這個清單：有音檔的句子播音檔，沒有的退回瀏覽器語音
    (PUBLIC / "voices.js").write_text(
        "// 這個檔案由 tools/voice/voice.py 產生：有預先錄好的英文語音（audio/en/<名稱>.mp3）的句子\n"
        f"self.VOICES = {json.dumps(done)};\n", "utf-8")


def write_preview(dst, slugs):
    """試聽頁：把 mp3 直接嵌進 HTML（data URI），用任何方式打開都聽得到"""
    import base64
    tpl = (HERE / "preview.html").read_text("utf-8")
    clips = {s: "data:audio/mpeg;base64," + base64.b64encode((dst / f"{s}.mp3").read_bytes()).decode() for s in slugs}
    (OUT / "preview.html").write_text(tpl.replace("/*CLIPS*/{}", json.dumps(clips)), "utf-8")
    print("preview:", OUT / "preview.html")


if __name__ == "__main__":
    {"design": design, "clone": lambda: clone(sys.argv[2]), "pick": pick}[sys.argv[1]]()
