# 機關書 📖

給小朋友點點看的機關書網頁（純 HTML/CSS/JS，不需要安裝或編譯）。

- **書架**：每個主題是一本書。目前有 🚚 交通工具（工地、蓋大樓、消防救援、農場、貨運卡車、海上、天空），🦁 動物、🦕 恐龍、🦷 我的身體 先預留（顯示「敬請期待」）
- **目錄**：一本書有好幾頁，做好的頁面可以點進去，還沒做的顯示「敬請期待」
- **翻頁**：按右上角的 ◀ ▶，或在畫面上左右滑，會像真的書一樣把一頁翻過去
- **焦點模式**：點車子時，其他東西變暗，被點的車子轉正、放大跑到畫面中間做動作，做完再回原位
- **場景**：車子前後錯開、有的斜斜地停在土堆上，旁邊印著英文小標籤；點車子會先唸英文名字、跳出英文＋中文名牌，然後像機關書一樣動起來。還沒點過的車子上有一顆會閃的紅點
- **加到主畫面（PWA）**：iPad 用 Safari「分享 → 加入主畫面」，開過一次以後沒有網路也能用

車子和背景是用本機的開源 AI（ComfyUI＋FLUX.1 schnell）以文字提示詞生成的扁平插畫。會動的零件用 SVG clipPath 從圖上裁出來單獨轉動，塔吊的鋼索、吊鉤和鋼樑則是用程式畫的。玩法參考機關書，但沒有照描、也沒有拿任何書的圖去給 AI 當參考。生成和去背的工具在 `tools/ai-art/`。

英文語音（車名和 Honk honk 之類的音效）是用開源的 Qwen3-TTS 預先生成的 mp3（`public/audio/en/`，清單在 `public/voices.js`），沒有音檔的句子會退回瀏覽器語音。做法見 `tools/voice/README.md`。

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

### 🏢 蓋大樓（Building Site）

| 車子 | 點了會怎樣 |
|---|---|
| Concrete Pump Truck 混凝土泵浦車 | 前後左右的支撐腳伸出來踩地，四節手臂一節一節展開拱成大弧，最後一節垂直往下，把混凝土打進大樓的樓板 |
| Pile Driver 打樁機 | 重錘「咚、咚、咚」把樁打進地裡 |
| Mobile Crane 吊車 | 伸縮吊臂抬高，吊鉤晃一晃 |
| Boom Lift 高空作業車 | 手臂抬起來，把籃子裡的工人送到高處 |
| Skid Steer Loader 小山貓 | 鏟斗舉起來，往前衝一下再倒回來 |

### 🚒 消防救援（Rescue）

| 車子 | 點了會怎樣 |
|---|---|
| Fire Engine 消防車 | 雲梯升起、伸長，噴水把公寓窗戶的火澆熄；再點一次火會先燒起來 |
| Rescue Helicopter 救援直升機 | 螺旋槳轉起來，放下救援吊籃再收回來 |
| Ambulance 救護車 | 警示燈閃、鳴笛「歐咿、歐咿」，開出去再倒回來 |
| Tow Truck 拖吊車 | 吊臂舉起來，吊鉤晃一晃 |
| Police Car 警車 | 紅藍燈閃，警笛「嗚—嗚—嗚—」高低音快速交替（Web Audio 合成） |
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

### 🚛 貨運卡車（Trucks）

| 車子 | 點了會怎樣 |
|---|---|
| Semi Truck 聯結車 | 叭叭兩聲（Honk honk），排氣管冒煙，往前開一小段再倒回來 |
| Garbage Truck 垃圾車 | 台灣的黃色垃圾車，放「少女的祈禱」（公共領域旋律，程式合成），垃圾袋一包一包丟進車斗 |
| Delivery Van 送貨車 | 側門滑開，一個包裹跳出來落到地上 |
| Ice Cream Truck 冰淇淋車 | 車頂的冰淇淋跳起來搖一搖，噴出彩色糖粒 |
| Car Carrier 汽車運輸車 | 上層車架往後傾斜，紅色小車滑下去一點再開回來 |
| Monster Truck 怪獸卡車 | 蹲下去用力跳起來，落地彈兩下 |
| Street Sweeper 掃街車 | 圓刷轉起來揚起灰塵，往前掃一段再倒回來 |

### 🚢 海上（Sea）

船都浮在水上：吃水線以下只畫半透明的影子，看起來像泡在水裡。

| 船 | 點了會怎樣 |
|---|---|
| Container Ship 貨櫃輪 | 船笛「嗚——嗚——」（Web Audio 合成），煙囪冒煙，慢慢往前開再倒回來 |
| Sailboat 帆船 | 一陣風吹來，船身傾斜，乘風往前開再回來 |
| Tugboat 拖船 | 「Toot toot!」短短兩聲，煙囪噗噗冒煙，往前推一段再回來 |
| Fishing Boat 漁船 | 吊桿放下漁網沉到水裡，拉上來的時候網子裡都是魚 |
| Speedboat 快艇 | 船頭翹起來，激起浪花衝出畫面右邊，再從左邊衝回來繞一圈 |
| Submarine 潛水艇 | 「Splash!」潛到水裡，潛望鏡升起來左右看看，再浮上來 |
| Lighthouse 燈塔 | 燈亮起來，光束繞著燈塔轉三圈 |

### ✈️ 天空（Sky）

| 飛機 | 點了會怎樣 |
|---|---|
| Airplane 客機 | 「Whoosh!」在跑道上加速、抬頭起飛飛出畫面右邊，再從左邊飛回來降落 |
| Hot Air Balloon 熱氣球 | 燃燒器噴出火焰，慢慢升高、左右晃，再降下來 |
| Biplane 雙翼機 | 螺旋槳轉起來，翻一個大筋斗，後面拉出一圈白煙 |
| Airship 飛船 | 螺旋槳轉起來，一上一下地慢慢往前飄再飄回來 |
| Glider 滑翔機 | 沒有引擎，一高一低地滑過去再滑回來 |
| Jet Plane 噴射機 | 「Whoosh!」拉出紅白藍三色彩煙衝出畫面，再從左邊翻滾著飛回來 |
| Helicopter 直升機 | 主旋翼越轉越快，直直地升起來，往前歪著飛一小段，再降落，旋翼慢慢停下來 |
| Control Tower 塔台 | 屋頂的紅燈一閃一閃，說「Ready for takeoff!」 |

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
   │  ├─ building.js      # 🏢 蓋大樓這一頁
   │  ├─ rescue.js        # 🚒 消防救援這一頁
   │  ├─ farm.js          # 🚜 農場這一頁
   │  ├─ trucks.js        # 🚛 貨運卡車這一頁
   │  ├─ sea.js           # 🚢 海上這一頁
   │  ├─ sky.js           # ✈️ 天空這一頁
   │  └─ img/<頁面 id>/    # 每一頁的 AI 插畫（WebP，去背）
   ├─ sw.js               # 離線快取（網路優先）
   ├─ manifest.webmanifest
   ├─ icon.svg
   └─ icons/
```

## 新增一頁

1. 在 `themes.js` 對應主題的 `pages` 加一筆（例如 `{ id: 'sea', icon: '🚢', en: 'Sea', zh: '海上' }`，交通工具這本已經預留好了）
2. 新增 `art/<頁面 id>.js`，照 `construction.js` 或 `rescue.js` 的寫法用 `SCENES['<頁面 id>'] = { ... }` 畫場景、寫每台車的動作
3. 在 `index.html` 加上 `<script src="art/<頁面 id>.js"></script>`，在 `sw.js` 的 `CORE` 加上檔名（包含 `art/img/<頁面 id>/` 的圖片），並把 `CACHE` 版本號 +1
4. 插畫照 `tools/ai-art/README.md` 的流程生成

## 本機預覽

```bash
python -m http.server 8768 -d public
```

再打開 http://localhost:8768
