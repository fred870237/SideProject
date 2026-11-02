# 機關書 📖

給小朋友點點看的機關書網頁（純 HTML/CSS/JS，不需要安裝或編譯）。

- **書架**：每個主題是一本書。目前有 🚚 交通工具，🦁 動物、🦕 恐龍、🦷 我的身體 先預留（顯示「敬請期待」）
- **目錄**：一本書有好幾頁，做好的頁面可以點進去，還沒做的顯示「敬請期待」
- **場景**：點車子會先唸英文名字、跳出英文＋中文名牌，然後像機關書一樣動起來。還沒點過的車子上有一顆會閃的紅點
- **加到主畫面（PWA）**：iPad 用 Safari「分享 → 加入主畫面」，開過一次以後沒有網路也能用

車子和背景是用本機的開源 AI（ComfyUI＋FLUX.1 schnell）以文字提示詞生成的扁平插畫。會動的零件用 SVG clipPath 從圖上裁出來單獨轉動，塔吊的鋼索、吊鉤和鋼樑則是用程式畫的。玩法參考機關書，但沒有照描、也沒有拿任何書的圖去給 AI 當參考。生成和去背的工具在 `tools/ai-art/`。

## 目前的頁面

### 🏗️ 工地（Construction Site）

| 車子 | 點了會怎樣 |
|---|---|
| Tower Crane 塔式起重機 | 把地上的鋼樑吊起來，搬到另一邊放下；再點一次搬回來 |
| Cement Mixer 水泥攪拌車 | 滾筒搖搖晃晃轉起來，後面倒出水泥 |
| Bulldozer 推土機 | 鏟子放下，把土堆往前推 |
| Portable Toilet 流動廁所 | 門打開，裡面的工人揮手說 Hello |
| Excavator 挖土機 | 伸到土堆挖一口，舉起來倒掉 |
| Dump Truck 砂石車 | 車斗舉起來，把土倒在後面 |
| Forklift 堆高機 | 把一疊磚頭舉高再放下 |
| Road Roller 壓路機 | 倒車壓一段路再開回來 |

### 🚒 消防救援（Rescue）

| 車子 | 點了會怎樣 |
|---|---|
| Fire Engine 消防車 | 雲梯升起、伸長，噴水把公寓窗戶的火澆熄；再點一次火會先燒起來 |
| Rescue Helicopter 救援直升機 | 螺旋槳轉起來，放下救援吊籃再收回來 |
| Ambulance 救護車 | 警示燈閃，開出去再倒回來 |
| Tow Truck 拖吊車 | 吊臂舉起來，吊鉤晃一晃 |
| Police Car 警車 | 紅藍燈閃，喔咿喔咿（Wee-woo） |
| Police Motorcycle 警用機車 | 翹孤輪往前衝，再倒回來 |
| Fire Hydrant 消防栓 | 搖一搖，兩邊噴出水來 |

### 🚜 農場（Farm）

| 車子 | 點了會怎樣 |
|---|---|
| Tractor 拖拉機 | 排氣管噗噗冒煙，往前開再倒回來 |
| Combine Harvester 聯合收割機 | 前面的撥禾輪轉起來，後面的管子噴出穀子 |
| Hay Baler 牧草打捆機 | 後門往上打開，滾出一捆圓圓的牧草 |
| Pickup Truck 小貨車 | 叭叭兩聲，車上的牧草跳一跳，開出去再倒回來 |
| Quad Bike 四輪越野車 | 前輪抬起來跳一下，往前衝再倒回來 |
| Crop Duster 農藥噴灑機 | 一路噴霧從右邊飛出去，再從左邊飛回來 |
| Windmill 風車 | 風扇轉三圈 |

## 檔案結構

```
popup-book/
├─ netlify.toml
├─ tools/ai-art/          # AI 生成＋去背的腳本和提示詞（不會部署）
└─ public/
   ├─ index.html
   ├─ style.css
   ├─ app.js              # 換頁、唸英文、名牌、動畫小工具
   ├─ themes.js           # 書架：主題和頁面清單
   ├─ art/
   │  ├─ kit.js           # 共用畫圖工具（外框、輪子、車窗、工人…）
   │  ├─ construction.js  # 🏗️ 工地這一頁
   │  ├─ rescue.js        # 🚒 消防救援這一頁
   │  ├─ farm.js          # 🚜 農場這一頁
   │  └─ img/<頁面 id>/    # 每一頁的 AI 插畫（WebP，去背）
   ├─ sw.js               # 離線快取（網路優先）
   ├─ manifest.webmanifest
   ├─ icon.svg
   └─ icons/
```

## 新增一頁

1. 在 `themes.js` 對應主題的 `pages` 加一筆（例如 `{ id: 'trucks', icon: '🚛', en: 'Trucks', zh: '貨運卡車' }`，交通工具這本已經預留好了）
2. 新增 `art/<頁面 id>.js`，照 `construction.js` 或 `rescue.js` 的寫法用 `SCENES['<頁面 id>'] = { ... }` 畫場景、寫每台車的動作
3. 在 `index.html` 加上 `<script src="art/<頁面 id>.js"></script>`，在 `sw.js` 的 `CORE` 加上檔名（包含 `art/img/<頁面 id>/` 的圖片），並把 `CACHE` 版本號 +1
4. 插畫照 `tools/ai-art/README.md` 的流程生成

## 本機預覽

```bash
python -m http.server 8768 -d public
```

再打開 http://localhost:8768
