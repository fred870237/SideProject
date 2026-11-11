"""用 Qwen3-TTS 生成動物世界地圖的英文語音，不會部署。

跟機關書用同一個旁白聲音（ref.wav 是從 popup-book/tools/voice/out/ref_chosen.wav 複製過來的），
所以兩個 App 聽起來是同一個說故事的媽媽。

usage:
  python voice.py trial            # 先試聽：TRIAL 裡的幾句各生 3 個版本，產生 out/trial.html
  python voice.py clone            # lines-en.json 裡每一句生 TAKES 個版本到 out/takes/（生過的會跳過）
  python voice.py pick             # 每句挑一個版本，轉成 mp3 存到 animal-map/audio/voice/en/，並更新 animal-map/voices.js

lines-en.json：App 裡會用英文唸出來的所有句子（動物和車子的名字、找找看的問句、稱讚、ABC 字母探險、台灣環島）。
這份清單是在瀏覽器裡開 abc.html，用頁面上的資料（ANIMALS、VEHICLES、MODES.abc、REGIONS）組出來的；
新增動物或車子以後要重新產生清單（請 Claude 做），再跑 clone 和 pick。
其中 travel 這組是旅行模式（regions/*.js）的站名、東西名稱和英語國家的問候，用 region.html 讀全部地區組出來，只收還沒有音檔的句子。

環境：D:\\AI\\qwen-tts\\venv（Python 3.14、PyTorch cu128、pip install qwen-tts soundfile lameenc）
跑之前先關掉 ComfyUI（8GB 顯卡記憶體不夠兩個一起用）
"""
import base64, json, pathlib, re, sys
import numpy as np

HERE = pathlib.Path(__file__).parent
OUT = HERE / "out"
APP = HERE.parent.parent / "animal-map"
MODELS = pathlib.Path(r"D:\AI\qwen-tts\models")
TAKES = 3
BATCH = 8  # 一次送進模型的句子數（太多會超過 8GB 顯卡記憶體，溢出到系統記憶體會慢非常多）
# ref.wav 裡唸的句子（機關書 voice.py 的 REF_TEXT）
REF_TEXT = "Hello, little one. Let's open the book and look at all the vehicles. Here comes a big red fire engine."
TRIAL = ["Lion", "Poison Dart Frog", "Where is the snow leopard?", "Great job!", "A.", "W.",
         "Which one starts with W?", "B is for brown bear.", "Taipei 101", "Sun Moon Lake"]


def slug(text):
    """檔名：小寫、只留英數字，中間用 - 連起來（voice-clips.js 用同樣的規則找檔案）"""
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def lines():
    """lines-en.json 全部的句子，同一個檔名只留第一個（例如 Narwhal 和 Narwhal. 共用一個音檔）"""
    seen, out = set(), []
    for group in json.loads((HERE / "lines-en.json").read_text("utf-8")).values():
        for t in group:
            if slug(t) not in seen:
                seen.add(slug(t))
                out.append(t)
    return out


def load():
    import torch
    from qwen_tts import Qwen3TTSModel
    return Qwen3TTSModel.from_pretrained(str(MODELS / "Base"), device_map="cuda:0", dtype=torch.bfloat16, attn_implementation="sdpa")


def trim(w, sr, thresh=0.01, pad=0.08):
    """去掉頭尾的靜音，前後各留一點點"""
    idx = np.flatnonzero(np.abs(w) > thresh)
    if not len(idx):
        return w
    a, b = max(0, idx[0] - int(pad * sr)), min(len(w), idx[-1] + int(pad * sr))
    return w[a:b]


def generate(todo, dst):
    import soundfile as sf
    dst.mkdir(parents=True, exist_ok=True)
    m = load()
    prompt = m.create_voice_clone_prompt(ref_audio=str(HERE / "ref.wav"), ref_text=REF_TEXT)
    for t in range(TAKES):
        # 中斷過再跑的話，已經生好的版本跳過
        left = [l for l in todo if not (dst / f"{slug(l)}_{t}.wav").exists()]
        for i in range(0, len(left), BATCH):
            chunk = left[i:i + BATCH]
            wavs, sr = m.generate_voice_clone(text=chunk, language=["English"] * len(chunk), voice_clone_prompt=prompt)
            for line, w in zip(chunk, wavs):
                sf.write(dst / f"{slug(line)}_{t}.wav", trim(np.asarray(w, dtype=np.float32), sr), sr)
            print(f"take {t}: {min(i + BATCH, len(left))}/{len(left)}", flush=True)


def to_mp3(path):
    import soundfile as sf
    import lameenc
    w, sr = sf.read(path, dtype="float32")
    if w.ndim > 1:
        w = w.mean(axis=1)
    pcm = (w / (np.abs(w).max() or 1) * 0.9 * 32767).astype(np.int16)
    enc = lameenc.Encoder()
    enc.set_bit_rate(64); enc.set_in_sample_rate(sr); enc.set_channels(1); enc.set_quality(2)
    return enc.encode(pcm.tobytes()) + enc.flush()


def trial():
    dst = OUT / "trial"
    generate(TRIAL, dst)
    rows = []
    for line in TRIAL:
        cells = "".join(
            f'<td><audio controls src="data:audio/mpeg;base64,{base64.b64encode(to_mp3(f)).decode()}"></audio></td>'
            for f in sorted(dst.glob(f"{slug(line)}_*.wav")))
        rows.append(f"<tr><th>{line}</th>{cells}</tr>")
    (OUT / "trial.html").write_text(
        "<meta charset='utf-8'><title>英文語音試聽</title><style>body{font-family:sans-serif}th{text-align:left;padding-right:1em}</style>"
        f"<h1>英文語音試聽（每句 {TAKES} 個版本）</h1><table>{''.join(rows)}</table>", "utf-8")
    print("trial:", OUT / "trial.html")


def clone():
    takes = OUT / "takes"
    todo = [l for l in lines() if not (takes / f"{slug(l)}_{TAKES - 1}.wav").exists()]
    if not todo:
        print("nothing to do")
        return
    print(len(todo), "lines")
    generate(todo, takes)


def pick():
    """預設挑長度最接近中位數的版本（太長通常是多唸了東西，太短是唸不完整）；picks.json 可以手動指定 {"檔名": 第幾個}"""
    import soundfile as sf
    dst = APP / "audio" / "voice" / "en"
    dst.mkdir(parents=True, exist_ok=True)
    manual = json.loads((HERE / "picks.json").read_text("utf-8")) if (HERE / "picks.json").exists() else {}
    done = []
    for line in lines():
        s = slug(line)
        files = sorted((OUT / "takes").glob(f"{s}_*.wav"))
        if not files:
            continue
        lens = [sf.info(f).duration for f in files]
        med = float(np.median(lens))
        best = files[manual[s]] if s in manual else files[int(np.argmin([abs(l - med) for l in lens]))]
        (dst / f"{s}.mp3").write_bytes(to_mp3(best))
        done.append(s)
    write_manifest()
    print(len(done), "clips ->", dst)


def write_manifest():
    """voice-clips.js 讀這個清單：有音檔的句子播音檔，沒有的退回瀏覽器語音
    清單直接看 audio/voice/<語言>/ 裡有哪些 mp3（英文 voice.py、中文 breezy.py 都呼叫這個，不會互相蓋掉）"""
    root = APP / "audio" / "voice"
    clips = {d.name: sorted(f.stem for f in d.glob("*.mp3")) for d in sorted(root.iterdir()) if d.is_dir()}
    body = ",\n".join(f"  {lang}: {json.dumps(names, ensure_ascii=False)}" for lang, names in clips.items())
    (APP / "voices.js").write_text(
        "// 這個檔案由 tools/voice/voice.py、breezy.py 產生：有預先生成的語音（audio/voice/<語言>/<名稱>.mp3）的句子\n"
        f"const VOICE_CLIPS = {{\n{body},\n}};\n", "utf-8")


if __name__ == "__main__":
    {"trial": trial, "clone": clone, "pick": pick}[sys.argv[1]]()
