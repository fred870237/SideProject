# AI 插畫工具（不會部署）

機關書的車子和背景是用本機的開源 AI 生成的，這裡是生成和去背的腳本。

- **ComfyUI**：裝在 `D:\AI\ComfyUI`（原始碼版＋venv，Python 3.14、PyTorch cu128）
- **模型**：FLUX.1 [schnell] fp8（Apache 2.0，可商用），放在 `ComfyUI/models/checkpoints/flux1-schnell-fp8.safetensors`
- 只用文字提示詞生成，**沒有**拿參考書的照片當輸入（以圖生圖、風格參考、訓練都沒有）

## 啟動 ComfyUI

```bash
D:\AI\ComfyUI\venv\Scripts\python.exe D:\AI\ComfyUI\main.py --listen 127.0.0.1 --port 8188
```

網頁介面：http://127.0.0.1:8188

## 流程

1. **生成**：`python gen.py prompts/<名字>.json`
   - 提示詞裡的 `{subject}` 會換成每一個 item 的描述
   - 每個 seed 生一張，存到 `D:\AI\ComfyUI\output\<name>\`
2. **挑圖**：`python sheet.py <輸出資料夾> <sheet.jpg> [欄數]` 產生縮圖總表
3. **去背**：在 `prompts/<頁面>-picks.json` 寫好每台車挑哪一張、要不要左右翻轉，然後：
   - 指令：`python cutout.py prompts/<頁面>-picks.json <cut 資料夾>`
   - 車子要生成在**綠幕背景**上（`#00FF00`）。去背用的是「綠色比紅、藍都多」，白色車身才不會被當成背景去掉
   - 去背後會加上紙張顆粒
   - picks 的第 3 個值是要手動擦掉的範圍，例如塔吊的鋼索和吊鉤；第 4 個值是選項，`{"erode": false}` 給細線條用；綠色的動物（綠鬣蜥）改在洋紅色背景（`#FF00FF`）生圖，選項加 `{"key": "magenta"}`
4. **輸出**：`python export.py <cut 資料夾> <背景.png> ../../public/art/img/<頁面> <格線預覽資料夾>`
   - 轉成 WebP，並產生畫好座標格線的預覽圖
   - 照預覽圖上的像素座標，在 `art/<頁面>.js` 裡用 clipPath 切出會動的零件

`cutout.py`、`export.py`、`sheet.py`、`grid.py` 要用 ComfyUI 的 venv 跑（需要 numpy、scipy、Pillow）：`D:\AI\ComfyUI\venv\Scripts\python.exe`

## 提示詞重點

- 能讓風格接近參考書的寫法：側面、無外框、扁平色塊加一層較深的色塊當陰影、鮮豔、零件細節多
- 要寫 `no logos, no text`，不然偶爾會出現廠牌標誌
- 不是車子的東西要特別寫 `No wheels, not a vehicle`，例如流動廁所、塔吊
