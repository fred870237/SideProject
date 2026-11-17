"""用 Qwen3-TTS 生成旅行模式「當地語言」的語音（日、韓、法、德、義、西、葡、俄），不會部署。

跟英文同一個旁白聲音（ref.wav），只是換成那一國的語言唸；Qwen3-TTS 只支援這幾種語言，
冰島語、泰語、印地語、阿拉伯語、蒙古語…這些不支援，還是用系統語音（沒有就跳過不唸）。

usage:
  python local.py clone   # lines-local.json 每一句生 TAKES 個版本到 out/takes-local/<語言>/（生過的會跳過）
  python local.py pick    # 每句挑長度最接近中位數的版本，轉成 mp3 存到 animal-map/audio/voice/<語言>/，並更新 voices.js

lines-local.json：{語言: [句子…]}，在瀏覽器裡用 regions/*.js 組出來（lang3 'ja' 的日文，和 lang3 'local' 的當地話）；
法文那一組也包含馬達加斯加語和大溪地語（那兩個地區的 lang 設成 fr-FR，用法文的唸法唸，只是近似）
檔名跟 voice-clips.js 的 key() 一樣：去掉標點和空白，只留文字和數字，轉小寫
環境、注意事項跟 voice.py 一樣（先關掉 ComfyUI）
"""
import json, re, sys, unicodedata
import numpy as np
import voice

LANGS = {"ja": "Japanese", "ko": "Korean", "fr": "French", "de": "German", "it": "Italian",
         "es": "Spanish", "pt": "Portuguese", "ru": "Russian"}
TAKES = voice.TAKES
SRC = voice.OUT / "takes-local"
# 一句最多生成幾個 token（12 個 ≈ 1 秒）；預設 2048 遇到停不下來的句子會卡好幾個小時，這裡的句子都很短
MAX_TOKENS = 240


def key(text):
    return "".join(ch for ch in text if unicodedata.category(ch)[0] in "LN").lower()


def say(text):
    """送進模型的文字：資料裡的「¡Hola!!」是問候語本來就有驚嘆號、程式又加了一個，唸的時候只留一個"""
    return re.sub(r"!+", "!", text)


def lines():
    return json.loads((voice.HERE / "lines-local.json").read_text("utf-8"))


def clone():
    import soundfile as sf
    m = voice.load()
    prompt = m.create_voice_clone_prompt(ref_audio=str(voice.HERE / "ref.wav"), ref_text=voice.REF_TEXT)
    for lang, todo in lines().items():
        dst = SRC / lang
        dst.mkdir(parents=True, exist_ok=True)
        for t in range(TAKES):
            left = [l for l in todo if not (dst / f"{key(l)}_{t}.wav").exists()]
            for i in range(0, len(left), voice.BATCH):
                chunk = left[i:i + voice.BATCH]
                wavs, sr = m.generate_voice_clone(text=[say(l) for l in chunk], language=[LANGS[lang]] * len(chunk), voice_clone_prompt=prompt,
                                                  max_new_tokens=MAX_TOKENS)
                for line, w in zip(chunk, wavs):
                    sf.write(dst / f"{key(line)}_{t}.wav", voice.trim(np.asarray(w, dtype=np.float32), sr), sr)
                print(f"{lang} take {t}: {min(i + voice.BATCH, len(left))}/{len(left)}", flush=True)


def pick():
    import soundfile as sf
    n = 0
    for lang, todo in lines().items():
        dst = voice.APP / "audio" / "voice" / lang
        dst.mkdir(parents=True, exist_ok=True)
        for line in todo:
            files = sorted((SRC / lang).glob(f"{key(line)}_*.wav"))
            if not files:
                continue
            lens = [sf.info(f).duration for f in files]
            med = float(np.median(lens))
            best = files[int(np.argmin([abs(l - med) for l in lens]))]
            (dst / f"{key(line)}.mp3").write_bytes(voice.to_mp3(best))
            n += 1
    voice.write_manifest()
    print(n, "clips")


if __name__ == "__main__":
    {"clone": clone, "pick": pick}[sys.argv[1]]()
