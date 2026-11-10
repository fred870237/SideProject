"""用 SoulX-Singer（Soul AI Lab，Apache 2.0）照 songs.js 的旋律把英文兒歌唱出來，不會部署。

usage（要用 SoulX-Singer 自己的 Python 3.10 環境跑）：
  D:\\AI\\soulx-singer\\venv\\Scripts\\python.exe soulx.py trial [歌曲id ...]   # 生成人聲，產生 out/songs-trial.html 試聽（預設 twinkle、old-macdonald）
  D:\\AI\\soulx-singer\\venv\\Scripts\\python.exe soulx.py all                   # 每首都生成，產生試聽頁
  D:\\AI\\soulx-singer\\venv\\Scripts\\python.exe soulx.py install              # 人聲 mp3 存到 animal-map/audio/songs/<id>.mp3

songs.json：從 animal-map 的 songs.js 用瀏覽器匯出的旋律和歌詞（songs.js 改了要重新匯出，請 Claude 做）。
人聲的時間軸跟 song-player.js 一樣：每個音符 = 拍數 × 60/bpm 秒，每行唱完多停 0.25 拍，
所以 App 裡伴奏照常用 Web Audio 合成，人聲 mp3 從第一個音開始一起播就會對上。

做法：歌詞以「字」為單位轉成英文音素（g2p_en），一個字唱好幾個音的話，後面的音標成延長音（note_type 3），
跟 SoulX-Singer 的英文範例一樣；每一行分開生成，放到它在整首歌裡的時間位置。
參考聲音用 SoulX-Singer 附的英文範例 example/audio/en_target（Fred 從 6 個範例裡選的「聲音 2」），不轉調（auto_shift 關掉），音高跟伴奏一樣。

環境：D:\\AI\\soulx-singer（git clone https://github.com/Soul-AILab/SoulX-Singer，uv 建的 Python 3.10 venv，
torch 2.2.0 cu118，只裝推論需要的套件；模型 model.pt 放在 pretrained_models/SoulX-Singer）。
跑之前先關掉 ComfyUI、voice.py、breezy.py（8GB 顯卡記憶體不夠一起用）
"""
import base64, json, os, pathlib, re, sys
import numpy as np

HERE = pathlib.Path(__file__).parent
OUT = HERE / "out"
APP = HERE.parent.parent / "animal-map"
SOULX = pathlib.Path(r"D:\AI\soulx-singer")
GAP = 0.25  # 行與行之間多停的拍數（song-player.js 的 t += spb * 0.25）
NOTE = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}
# 字母歌、E-I-E-I-O 的字母唸法（g2p_en 會把單獨的 A 唸成冠詞）
LETTER = {"A": "EY1", "B": "B IY1", "C": "S IY1", "D": "D IY1", "E": "IY1", "F": "EH1 F", "G": "JH IY1",
          "H": "EY1 CH", "I": "AY1", "J": "JH EY1", "K": "K EY1", "L": "EH1 L", "M": "EH1 M", "N": "EH1 N",
          "O": "OW1", "P": "P IY1", "Q": "K Y UW1", "R": "AA1 R", "S": "EH1 S", "T": "T IY1", "U": "Y UW1",
          "V": "V IY1", "W": "D AH1 B AH0 L Y UW0", "X": "EH1 K S", "Y": "W AY1", "Z": "Z IY1"}
WORD = {"doubleu": "D AH1 B AH0 L Y UW0", "cs": "S IY1 Z"}


def midi(name):
    m = re.fullmatch(r"([A-G])(#?)(\d)", name)
    return 12 * (int(m[3]) + 1) + NOTE[m[1]] + (1 if m[2] else 0)


def words(text):
    """歌詞 → [(字, 音節數)]；E-I-E-I-O 這種全是單一大寫字母的，每個字母自己算一個字"""
    out = []
    for w in text.split():
        syl = [s for s in w.split("-") if s]
        if len(syl) > 1 and all(re.fullmatch(r"[A-Z][,.?!]?", s) for s in syl):
            out += [(s, 1) for s in syl]
        else:
            out.append(("".join(syl), len(syl)))
    return out


_g2p = None


def phones(word):
    global _g2p
    w = re.sub(r"[^A-Za-z']", "", word)
    if w.lower() in WORD:
        p = WORD[w.lower()]
    elif len(w) == 1 and w.isupper() and w != "A":  # E-I-E-I-O 的字母；I 當「我」也是 AY1
        p = LETTER[w]
    elif w.lower() == "a":  # 冠詞
        p = "AH0"
    else:
        if _g2p is None:
            from g2p_en import G2p
            _g2p = G2p()
        p = " ".join(x for x in _g2p(w) if x.strip() and x not in "',.?!")
    return "en_" + "-".join(p.split())


def segments(song, abc=False):
    """一首歌 → SoulX-Singer 的 metadata（每行一段）"""
    spb = 60 / song["bpm"]
    t, segs = 0.0, []
    for i, line in enumerate(song["lines"]):
        notes = [(midi(tok.split(":")[0]), float(tok.split(":")[1]) if ":" in tok else 1.0) for tok in line["n"].split()]
        ws = words(line["t"])
        assert sum(n for _, n in ws) == len(notes), (song["id"], line["t"])
        ph, pitch, typ, dur, text = [], [], [], [], []
        k = 0
        for w, n in ws:
            # 字母歌裡單獨的大寫字母要唸字母名稱；其他歌裡的 A 是冠詞
            p = ("en_" + "-".join(LETTER[w[0]].split())) if abc and re.fullmatch(r"[A-Z][,.?!]?", w) else phones(w)
            for j in range(n):
                ph.append(p); pitch.append(notes[k][0]); typ.append(2 if j == 0 else 3)
                dur.append(notes[k][1] * spb); text.append(w); k += 1
        ph.append("<SP>"); pitch.append(0); typ.append(1); dur.append(GAP * spb); text.append("<SP>")
        end = t + sum(dur)
        segs.append({"index": f"{song['id']}_{i}", "language": "English", "time": [round(t * 1000), round(end * 1000)],
                     "duration": " ".join(f"{d:.3f}" for d in dur), "text": " ".join(text), "phoneme": " ".join(ph),
                     "note_pitch": " ".join(map(str, pitch)), "note_type": " ".join(map(str, typ))})
        t = end
    return segs


def load(voice_name="en_target"):
    os.chdir(SOULX)
    sys.path.insert(0, str(SOULX))
    from cli.inference import build_model
    from soulxsinger.utils.file_utils import load_config
    from soulxsinger.utils.data_processor import DataProcessor
    cfg = load_config("soulxsinger/config/soulxsinger.yaml")
    model = build_model("pretrained_models/SoulX-Singer/model.pt", cfg, "cuda", use_fp16=True)
    dp = DataProcessor(hop_size=cfg.audio.hop_size, sample_rate=cfg.audio.sample_rate,
                       phoneset_path="soulxsinger/utils/phoneme/phone_set.json", device="cuda")
    return model, dp, cfg, prompt_of(dp, voice_name)


def prompt_of(dp, name):
    """參考聲音：SoulX-Singer 附的範例歌聲（example/audio/<name>.mp3 和它的 .json 標註），
    或 "ref"＝Fred 提供的小星星錄音（去伴奏後切前兩句、照旋律標註，放在 out/ref/prompt.wav、prompt.json）"""
    if name == "ref":
        meta = json.loads((OUT / "ref" / "prompt.json").read_text("utf-8"))[0]
        return dp.process(meta, str(OUT / "ref" / "prompt.wav"))
    meta = json.loads((SOULX / f"example/audio/{name}.json").read_text("utf-8"))[0]
    return dp.process(meta, str(SOULX / f"example/audio/{name}.mp3"))


# 試聽候選聲音：SoulX-Singer 附的六段範例歌聲
VOICES = ["en_prompt", "en_target", "zh_prompt", "zh_target", "yue_target", "music"]


def voices():
    """每個候選聲音都唱小星星前兩句，產生 out/songs-voices.html"""
    sys.path.insert(0, str(HERE))
    import voice
    song = next(s for s in json.loads((HERE / "songs.json").read_text("utf-8")) if s["id"] == "twinkle")
    song = {**song, "lines": song["lines"][:2]}
    dst = OUT / "songs-voices"
    dst.mkdir(parents=True, exist_ok=True)
    model, dp, cfg, _ = load()
    rows = []
    for name in VOICES:
        print(name, flush=True)
        y, sr = sing(song, model, dp, cfg, prompt_of(dp, name))
        save(dst / f"{name}.wav", y, sr)
        m = melody(song, sr)
        mix = np.zeros(max(len(m), len(y)), dtype=np.float32)
        mix[:len(y)] += y / (np.abs(y).max() or 1) * 0.6
        mix[:len(m)] += m
        save(dst / f"{name}_mix.wav", mix, sr)
        cells = "".join(f"<td>{label}<br><audio controls src='data:audio/mpeg;base64,{base64.b64encode(voice.to_mp3(dst / f)).decode()}'></audio></td>"
                        for label, f in (("人聲＋旋律", f"{name}_mix.wav"), ("只有人聲", f"{name}.wav")))
        ref = base64.b64encode((SOULX / f"example/audio/{name}.mp3").read_bytes()).decode()
        rows.append(f"<tr><th>聲音 {VOICES.index(name) + 1}</th><td>原本的參考歌聲<br><audio controls src='data:audio/mpeg;base64,{ref}'></audio></td>{cells}</tr>")
    (OUT / "songs-voices.html").write_text(
        "<meta charset='utf-8'><title>兒歌聲音比較</title><style>body{font-family:sans-serif}th{text-align:left;padding-right:1em}td{font-size:12px}</style>"
        f"<h1>兒歌聲音比較（小星星前兩句）</h1><table>{''.join(rows)}</table>", "utf-8")
    print("voices:", OUT / "songs-voices.html")


def sing(song, model, dp, cfg, prompt):
    import torch
    segs = segments(song, abc=song["id"] == "abc")
    sr = cfg.audio.sample_rate
    out = np.zeros(int(segs[-1]["time"][1] / 1000 * sr) + sr, dtype=np.float32)
    for seg in segs:
        target = dp.process(dict(seg), None)
        with torch.no_grad():
            a = model.infer({"prompt": prompt, "target": target}, auto_shift=False, pitch_shift=0,
                            n_steps=cfg.infer.n_steps, cfg=cfg.infer.cfg, control="score", use_fp16=True)
        a = a.squeeze().float().cpu().numpy()
        s = int(seg["time"][0] / 1000 * sr)
        n = min(len(a), len(out) - s)
        out[s:s + n] += a[:n]
        print("  ", seg["text"].replace("<SP>", "").strip(), flush=True)
    return out, sr


def melody(song, sr):
    """試聽用的簡單鋼琴旋律（App 裡的伴奏是 song-player.js 即時合成的，這裡只是方便對拍）"""
    spb = 60 / song["bpm"]
    t, parts = 0.0, []
    for line in song["lines"]:
        for tok in line["n"].split():
            n, b = (tok.split(":") + ["1"])[:2]
            parts.append((t, 440 * 2 ** ((midi(n) - 69) / 12), float(b) * spb))
            t += float(b) * spb
        t += GAP * spb
    y = np.zeros(int((t + 1) * sr), dtype=np.float32)
    for s, f, d in parts:
        tt = np.arange(int(min(d * 1.5, 2) * sr)) / sr
        w = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(4 * np.pi * f * tt)) * np.exp(-tt * 3) * 0.12
        i = int(s * sr)
        y[i:i + len(w)] += w[:len(y) - i]
    return y


def save(path, y, sr):
    import soundfile as sf
    sf.write(path, y / (np.abs(y).max() or 1) * 0.9, sr)


def run(ids):
    sys.path.insert(0, str(HERE))
    import voice
    songs = {s["id"]: s for s in json.loads((HERE / "songs.json").read_text("utf-8"))}
    dst = OUT / "songs"
    dst.mkdir(parents=True, exist_ok=True)
    model, dp, cfg, prompt = load()
    for i in ids:
        print(songs[i]["title"], flush=True)
        y, sr = sing(songs[i], model, dp, cfg, prompt)
        save(dst / f"{i}.wav", y, sr)
        m = melody(songs[i], sr)
        n = max(len(m), len(y))
        mix = np.zeros(n, dtype=np.float32)
        mix[:len(y)] += y / (np.abs(y).max() or 1) * 0.6
        mix[:len(m)] += m
        save(dst / f"{i}_mix.wav", mix, sr)
    return songs, voice


def trial(ids):
    songs, voice = run(ids or ["twinkle", "old-macdonald"])
    rows = []
    for i in ids or ["twinkle", "old-macdonald"]:
        cells = "".join(
            f"<td>{label}<br><audio controls src='data:audio/mpeg;base64,{base64.b64encode(voice.to_mp3(OUT / 'songs' / f)).decode()}'></audio></td>"
            for label, f in (("人聲＋旋律", f"{i}_mix.wav"), ("只有人聲", f"{i}.wav"))[:1 if len(ids) > 2 else 2])  # 歌多時只放一欄，頁面才不會太大
        rows.append(f"<tr><th>{songs[i]['title']}</th>{cells}</tr>")
    (OUT / "songs-trial.html").write_text(
        "<meta charset='utf-8'><title>兒歌試聽</title><style>body{font-family:sans-serif}th{text-align:left;padding-right:1em}td{font-size:12px}</style>"
        f"<h1>英文兒歌試聽（SoulX-Singer）</h1><table>{''.join(rows)}</table>", "utf-8")
    print("trial:", OUT / "songs-trial.html")


def install():
    """把生成好的人聲（out/songs/<id>.wav）轉成 mp3 放進 App：animal-map/audio/songs/<id>.mp3"""
    sys.path.insert(0, str(HERE))
    import voice
    songs = [s["id"] for s in json.loads((HERE / "songs.json").read_text("utf-8"))]
    dst = APP / "audio" / "songs"
    dst.mkdir(parents=True, exist_ok=True)
    for i in songs:
        (dst / f"{i}.mp3").write_bytes(voice.to_mp3(OUT / "songs" / f"{i}.wav"))
    print(len(songs), "songs ->", dst)


if __name__ == "__main__":
    if sys.argv[1] == "trial":
        trial(sys.argv[2:])
    elif sys.argv[1] == "voices":
        voices()
    elif sys.argv[1] == "all":  # 每首都生成，產生試聽頁（還不放進 App）
        trial([s["id"] for s in json.loads((HERE / "songs.json").read_text("utf-8"))])
    elif sys.argv[1] == "install":
        install()
    elif sys.argv[1] == "meta":  # 只印出某首歌的 metadata，檢查音素和時間
        print(json.dumps(segments(next(s for s in json.loads((HERE / "songs.json").read_text("utf-8")) if s["id"] == sys.argv[2]), abc=sys.argv[2] == "abc"), ensure_ascii=False, indent=1))
