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

## 照草圖生成（以圖生圖）

AI 不認識的特殊機器（例如巨型礦場的 Bagger），只用文字生成比例會不對。做法：
1. 看著照片，用程式自己畫一張構圖草圖（`sketch_bagger.py`，綠幕背景），**不要**直接拿別人拍的照片當輸入
2. 草圖放進 `ComfyUI/input/`，batch.json 加 `"init": "草圖.png"`、`"denoise": 0.72`（太高形狀會跑掉，太低會像草圖）
3. 細格子（桁架）去背用 `{"erode": false, "hole": 12}`，格子裡的小綠點才會去掉

## 輪子和會動的零件（rig.py，取代舊的 tyres.py）

AI 畫的輪子常常不是正圓、輪框不在正中間、前面還被手臂擋住，用圓形裁出來轉就會破圖。`rig.py` 把一台車拆成圖層：
- 用 SAM 2（`sam_parts.py` 可以先試切看看）在輪子上框一下就自動切出輪子，擋在前面的東西不會被切進去
- 輪子拉成正圓（被擋住的部分用另一邊補），**只有外圈胎紋會轉**；輪框、輪胎內側和擋在前面的東西放在 `<名字>-front.webp` 固定不動
- 其他會動的零件（例如鏟斗）後面原本被擋住的地方，用 FLUX 局部重繪補好（要開著 ComfyUI）

用法見 `rig.py` 開頭；輪子的圓心在輸出的 `<名字>-rig.json`，填到 art 裡的 `data-cx`、`data-cy`。
`video.py` 是試過的另一種做法（LTX-Video 以圖生影片），車子會變形、背景有雜點、檔案大，所以沒有採用。
