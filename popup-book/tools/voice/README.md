# 英文語音工具（不會部署）

機關書點車子時唸的英文（車名＋Honk honk 之類的音效）是用開源的 **Qwen3-TTS**（Apache 2.0）預先生成的 mp3，放在 `public/audio/en/`。清單在 `public/voices.js`，app.js 有音檔就播音檔，沒有的句子（例如還沒錄的新頁面）會退回瀏覽器語音。

- **環境**：`D:\AI\qwen-tts\venv`（Python 3.14、PyTorch cu128、`pip install qwen-tts soundfile lameenc`）
- **模型**：`D:\AI\qwen-tts\models\VoiceDesign`、`D:\AI\qwen-tts\models\Base`（Qwen/Qwen3-TTS-12Hz-1.7B-*）。Hugging Face 單一連線很慢，用 `fetch_model.py` 多連線下載
- 跑之前先讓 ComfyUI 釋放顯卡記憶體（8GB 不夠兩個一起用）

## 聲音

旁白的聲音是用 VoiceDesign 以文字描述設計出來的（`voice.py` 的 `INSTRUCT`：溫柔、沉穩、音調偏低的媽媽說故事聲音），不是複製真人的聲音。選定的那一個存在 `out/ref_chosen.wav`，之後所有句子都用 Base 模型複製這個聲音，每台車聽起來才會是同一個旁白。

## 新增句子（例如做了新的一頁）

1. 在 `voice.py` 的 `LINES` 加上新的車名或音效（要跟 `art/*.js` 裡的 `en`、`speak('…')` 一模一樣）
2. `python voice.py clone out/ref_chosen.wav`：每句生 3 個版本到 `out/takes/`
3. `python voice.py pick`：每句挑一個（預設挑長度最接近中位數的），轉成 mp3 並更新 `public/voices.js`
   - 哪一句唸得怪，在 `picks.json` 指定要用第幾個版本，例如 `{"car-carrier": 2}`，再跑一次 pick
4. 用 `preview.html` 試聽（用瀏覽器直接開檔案就可以）
5. `sw.js` 的 `CACHE` 版本號 +1（音檔清單會從 voices.js 自動加進離線快取）

檔名規則（app.js 的 `voiceSlug` 也一樣）：小寫、非英數字換成 `-`，例如 `Wee-woo, wee-woo!` → `wee-woo-wee-woo.mp3`。
