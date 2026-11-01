# 機關書 📖

給小朋友點點看的機關書網頁（純 HTML/CSS/JS，不需要安裝或編譯）。

- **書架**：每個主題是一本書。目前有 🚚 交通工具，🦁 動物、🦕 恐龍、🦷 我的身體 先預留（顯示「敬請期待」）
- **目錄**：一本書有好幾頁，做好的頁面可以點進去，還沒做的顯示「敬請期待」
- **場景**：點車子會先唸英文名字、跳出英文＋中文名牌，然後像機關書一樣動起來。還沒點過的車子上有一顆會閃的紅點
- **加到主畫面（PWA）**：iPad 用 Safari「分享 → 加入主畫面」，開過一次以後沒有網路也能用

插畫全部是用程式畫的 SVG，參考機關書的玩法，但沒有照描任何書的圖。

## 目前的頁面

### 🏗️ 工地（Construction Site）

| 車子 | 點了會怎樣 |
|---|---|
| Tower Crane 塔式起重機 | 把地上的鋼樑吊到大樓頂；再點一次吊回地面 |
| Cement Mixer 水泥攪拌車 | 滾筒轉起來，滑槽倒出水泥 |
| Bulldozer 推土機 | 鏟子放下，把土堆往前推 |
| Portable Toilet 流動廁所 | 門打開，裡面的工人揮手說 Hello |
| Excavator 挖土機 | 伸到土堆挖一口，舉起來倒掉 |
| Dump Truck 砂石車 | 車斗舉起來，把土倒在後面 |
| Forklift 堆高機 | 把一疊磚頭舉高再放下 |
| Road Roller 壓路機 | 往前壓一段路再倒回來 |

## 檔案結構

```
popup-book/
├─ netlify.toml
└─ public/
   ├─ index.html
   ├─ style.css
   ├─ app.js              # 換頁、唸英文、名牌、動畫小工具
   ├─ themes.js           # 書架：主題和頁面清單
   ├─ art/
   │  ├─ kit.js           # 共用畫圖工具（外框、輪子、車窗、工人…）
   │  └─ construction.js  # 🏗️ 工地這一頁
   ├─ sw.js               # 離線快取（網路優先）
   ├─ manifest.webmanifest
   ├─ icon.svg
   └─ icons/
```

## 新增一頁

1. 在 `themes.js` 對應主題的 `pages` 加一筆（例如 `{ id: 'rescue', icon: '🚒', en: 'Rescue', zh: '消防救援' }`，現在已經預留好了）
2. 新增 `art/<頁面 id>.js`，照 `construction.js` 的寫法用 `SCENES['<頁面 id>'] = { ... }` 畫場景、寫每台車的動作
3. 在 `index.html` 加上 `<script src="art/<頁面 id>.js"></script>`，在 `sw.js` 的 `CORE` 加上檔名

## 本機預覽

```bash
python -m http.server 8768 -d public
```

再打開 http://localhost:8768
