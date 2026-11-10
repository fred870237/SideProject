"""用 BreezyVoice（聯發科，台灣華語，Apache 2.0）生成動物世界地圖的中文語音，不會部署。

usage（要用 BreezyVoice 自己的 Python 3.10 環境跑，並設 PYTHONUTF8=1）：
  D:\\AI\\breezyvoice\\venv\\Scripts\\python.exe breezy.py trial   # 試聽兩種參考聲音，產生 out/zh-trial.html
  D:\\AI\\breezyvoice\\venv\\Scripts\\python.exe breezy.py clone   # lines-zh.json 每句生 TAKES 個版本到 out/takes-zh/（生過的跳過；後面加句子就只生那幾句）
  D:\\AI\\breezyvoice\\venv\\Scripts\\python.exe breezy.py pick    # 每句挑一個，轉成 mp3 存到 animal-map/audio/voice/zh/，更新 voices.js

聲音用 BreezyVoice 附的台灣女聲範例（data/example.wav），Fred 試聽後選的。
lines-zh.json：App 裡用中文唸出來的句子（名字、在哪裡？、聲音小知識、稱讚、台灣環島、按鈕名稱），
跟 lines-en.json 一樣是在瀏覽器裡用頁面上的資料組出來的。

環境：D:\\AI\\breezyvoice（git clone https://github.com/mtkresearch/BreezyVoice，uv 建的 Python 3.10 venv，torch 2.3.1 cu118，
模型下載到 models/BreezyVoice）。Windows 上要注意：
- 裝不了 WeTextProcessing（需要 pynini），venv 裡放了一個什麼都不做的 tn 替身；我們的句子不需要文字正規化
- ruamel.yaml < 0.18、setuptools < 70（hyperpyyaml 和 pkg_resources 要舊版）
- g2pw 的 DataLoader 多工會隨機掛掉，所以 num_workers=0
跑之前先關掉 ComfyUI 和英文的 voice.py（8GB 顯卡記憶體不夠一起用）
"""
import base64, json, os, pathlib, re, sys

HERE = pathlib.Path(__file__).parent
BREEZY = pathlib.Path(r"D:\AI\breezyvoice")
OUT = HERE / "out"
APP = HERE.parent.parent / "animal-map"
TAKES = 2
TRIAL = ["獅子", "長頸鹿", "貓熊", "臺灣黑熊", "狐獴在哪裡？", "答對了！好棒！", "臺北101", "日月潭", "挖土機", "垃圾車"]
# 參考聲音：BreezyVoice 附的台灣女聲範例，和機關書的英文旁白（試聽後選了台灣女聲範例）
REFS = {
    "台灣女聲範例": (BREEZY / "data" / "example.wav",
                "在密碼學中，加密是將明文資訊改變為難以讀取的密文內容，使之不可讀的方法。只有擁有解密方法的對象，經由解密過程，才能將密文還原為正常可讀的內容。"),
    "機關書旁白": (HERE / "ref.wav",
              "Hello, little one. Let's open the book and look at all the vehicles. Here comes a big red fire engine."),
}
VOICE = "台灣女聲範例"


def key(text):
    """中文檔名：去掉標點和空白，只留文字和數字（voice-clips.js 用同樣的規則找檔案）"""
    return re.sub(r"[\W_]+", "", text).lower()


def lines():
    """lines-zh.json 全部的句子，同一個檔名只留第一個"""
    seen, out = set(), []
    for group in json.loads((HERE / "lines-zh.json").read_text("utf-8")).values():
        for t in group:
            if key(t) and key(t) not in seen:
                seen.add(key(t))
                out.append(t)
    return out


def load():
    os.chdir(BREEZY)
    sys.path.insert(0, str(BREEZY))
    sys.path.insert(0, str(BREEZY / "third_party" / "Matcha-TTS"))
    import single_inference as si
    from g2pw import G2PWConverter
    return si, si.CustomCosyVoice(str(BREEZY / "models" / "BreezyVoice")), G2PWConverter(num_workers=0)


def synth(si, cv, conv, text, ref_wav, ref_text):
    prompt = si.load_wav(str(ref_wav), 16000)
    rt = si.get_bopomofo_rare(cv.frontend.text_normalize_new(ref_text, split=False), conv)
    tt = si.get_bopomofo_rare(cv.frontend.text_normalize_new(text, split=False), conv)
    return cv.inference_zero_shot_no_normalize(tt, rt, prompt)["tts_speech"]


def trial():
    import torchaudio
    si, cv, conv = load()
    dst = OUT / "zh-trial"
    dst.mkdir(parents=True, exist_ok=True)
    rows = []
    for text in TRIAL:
        cells = []
        for name, (wav, ref_text) in REFS.items():
            for t in range(2):
                f = dst / f"{text}_{name}_{t}.wav"
                if not f.exists():  # 中斷過再跑的話，生好的跳過
                    torchaudio.save(str(f), synth(si, cv, conv, text, wav, ref_text), 22050)
                cells.append(f"<td>{name} {t + 1}<br><audio controls src='data:audio/wav;base64,{base64.b64encode(f.read_bytes()).decode()}'></audio></td>")
        rows.append(f"<tr><th>{text}</th>{''.join(cells)}</tr>")
        print("done", text, flush=True)
    (OUT / "zh-trial.html").write_text(
        "<meta charset='utf-8'><title>中文語音試聽</title><style>body{font-family:sans-serif}th{text-align:left;padding-right:1em}td{font-size:12px}</style>"
        f"<h1>中文語音試聽（BreezyVoice）</h1><table>{''.join(rows)}</table>", "utf-8")
    print("trial:", OUT / "zh-trial.html")


def clone(only=None):
    """only：只生這幾句（例如 breezy.py clone 海獺 快艇，重生聽起來怪的句子）"""
    import torchaudio
    texts = lines()
    if only:
        want = {key(t) for t in only}
        texts = [t for t in texts if key(t) in want]
    dst = OUT / "takes-zh"
    dst.mkdir(parents=True, exist_ok=True)
    todo = [(t, n) for n in range(TAKES) for t in texts if not (dst / f"{key(t)}_{n}.wav").exists()]
    print(len(texts), "lines,", len(todo), "clips to do", flush=True)
    if not todo:
        return
    wav, ref_text = REFS[VOICE]
    si, cv, conv = load()
    import torch
    # 參考聲音的特徵（聲音 token、聲紋）每句都一樣，先算一次存起來；每句只換要唸的文字（原本每句都重算，慢很多）
    rt = si.get_bopomofo_rare(cv.frontend.text_normalize_new(ref_text, split=False), conv)
    base = cv.frontend.frontend_zero_shot("一", rt, si.load_wav(str(wav), 16000))
    for i, (t, n) in enumerate(todo):
        tt = si.get_bopomofo_rare(cv.frontend.text_normalize_new(t, split=False), conv)
        parts = []
        for seg in re.split(r"(?<=[？！。.?!])\s*", tt):
            if seg:
                tok, tok_len = cv.frontend._extract_text_token(seg)
                parts.append(cv.model.inference(**{**base, "text": tok, "text_len": tok_len})["tts_speech"])
        torchaudio.save(str(dst / f"{key(t)}_{n}.wav"), torch.concat(parts, dim=1), 22050)
        if i % 20 == 0:
            print(f"{i + 1}/{len(todo)}", flush=True)


def pick():
    """每句挑長度最接近「字數 × 0.3 秒」的版本（太長通常是多唸或卡住，太短是漏字）；picks-zh.json 可以手動指定 {"檔名": 第幾個}"""
    sys.path.insert(0, str(HERE))
    import voice
    import soundfile as sf
    dst = APP / "audio" / "voice" / "zh"
    dst.mkdir(parents=True, exist_ok=True)
    manual = json.loads((HERE / "picks-zh.json").read_text("utf-8")) if (HERE / "picks-zh.json").exists() else {}
    n = 0
    for t in lines():
        k = key(t)
        files = sorted((OUT / "takes-zh").glob(f"{k}_*.wav"))
        if not files:
            continue
        want = len(k) * 0.3 + 0.3
        best = files[manual[k]] if k in manual else min(files, key=lambda f: abs(sf.info(f).duration - want))
        (dst / f"{k}.mp3").write_bytes(voice.to_mp3(best))
        n += 1
    voice.write_manifest()
    print(n, "clips ->", dst)


if __name__ == "__main__":
    if sys.argv[1] == "clone":
        clone(sys.argv[2:])
    else:
        {"trial": trial, "pick": pick}[sys.argv[1]]()
