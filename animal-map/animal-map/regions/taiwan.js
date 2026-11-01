// 🚂 台灣環島的資料（region.html?r=taiwan 會讀這個檔）
//
// 想加新的國家或地區：複製這個檔案改成 regions/<id>.js，在 region.js 的 REGION_FILES 加上 id，
// 再把檔名加進 sw.js 的 CORE（離線也能用）就好，程式不用改。
//
// 格式說明：
//   outline   島（陸地）的外框，[經度, 緯度] 依順序排一圈
//   mountains 山脈的位置（畫小山當裝飾）
//   stops     火車停靠的站，照環島的順序；at = 真正的位置；marker = 圖示要畫在哪裡（太擠時移到海上，會畫虛線連回去）
//   icon      （可省略）地圖上車站的圖示，{ art: 'ART 的名字' } 或 { emoji: '…' }；沒寫就用 items 第一樣
//   items     這一站可以認識的東西：art 用 ART 裡的插圖、沒有插圖就用 emoji；tw / twRom 是台語和台羅（初稿，建議對照教育部辭典）
window.REGIONS = window.REGIONS || {}; // 每個地區檔案都加進同一個 REGIONS

REGIONS.taiwan = {
  id: 'taiwan',
  title: { zh: '台灣環島', en: 'Around Taiwan' },
  sea: '#5fb4e8',
  land: '#9bd770',
  outline: [
    [121.53, 25.30], [121.75, 25.17], [121.93, 25.02], [121.87, 24.86], [121.83, 24.60], [121.78, 24.32], [121.63, 24.00],
    [121.50, 23.62], [121.42, 23.26], [121.25, 22.92], [121.08, 22.70], [120.95, 22.45], [120.88, 22.10], [120.86, 21.90],
    [120.74, 21.93], [120.70, 22.10], [120.60, 22.36], [120.40, 22.54], [120.27, 22.63], [120.15, 22.95], [120.06, 23.12],
    [120.10, 23.42], [120.16, 23.72], [120.30, 24.00], [120.48, 24.26], [120.63, 24.55], [120.80, 24.76], [120.98, 24.95],
    [121.15, 25.08], [121.32, 25.15], [121.44, 25.24],
  ],
  mountains: [[121.28, 24.55], [121.18, 24.25], [121.05, 23.95], [120.95, 23.47], [120.88, 23.15], [120.82, 22.80], [121.40, 24.75]],
  stops: [
    {
      id: 'taipei', zh: '臺北', en: 'Taipei', tw: '臺北', twRom: 'Tâi-pak', at: [121.52, 25.05],
      items: [
        { id: 'tw-panda', art: 'panda', zh: '貓熊', en: 'Panda', tw: '貓熊', twRom: 'niau-hîm', fact: '臺北市立動物園有貓熊團團和圓圓，還有牠們的寶寶圓仔！' },
        { id: 'tw-101', emoji: '🏙️', zh: '臺北101', en: 'Taipei 101', tw: '臺北101', twRom: 'Tâi-pak it-khòng-it', fact: '臺北101是一棟很高很高的大樓，跨年的時候會放煙火！' },
      ],
    },
    {
      id: 'taoyuan', zh: '桃園', en: 'Taoyuan', tw: '桃園', twRom: 'Thô-hn̂g', at: [121.30, 24.99], marker: [120.98, 25.30],
      items: [
        { id: 'tw-airport', art: 'airplane', zh: '機場', en: 'Airport', tw: '飛行機場', twRom: 'hue-lîng-ki-tiûnn', fact: '桃園有台灣最大的機場，飛機從這裡飛到世界各地。' },
      ],
    },
    {
      id: 'hsinchu', zh: '新竹', en: 'Hsinchu', tw: '新竹', twRom: 'Sin-tik', at: [120.97, 24.80], marker: [120.58, 24.98],
      items: [
        { id: 'tw-wind', emoji: '🌬️', zh: '風', en: 'Wind', tw: '風', twRom: 'hong', fact: '新竹的風很大，所以叫做「風城」。' },
        { id: 'tw-ricenoodle', emoji: '🍜', zh: '米粉', en: 'Rice Noodles', tw: '米粉', twRom: 'bí-hún', fact: '新竹的風很適合把米粉吹乾，所以新竹米粉很有名。' },
      ],
    },
    {
      id: 'miaoli', zh: '苗栗', en: 'Miaoli', tw: '苗栗', twRom: 'Biâu-li̍k', at: [120.82, 24.56], marker: [120.33, 24.62],
      items: [
        { id: 'tw-leopard-cat', art: 'leopard-cat', zh: '石虎', en: 'Leopard Cat', tw: '石虎', twRom: 'tsio̍h-hóo', fact: '石虎是台灣的野生貓，苗栗的山上住著很多石虎，開車要慢慢的喔！' },
        { id: 'tw-strawberry', emoji: '🍓', zh: '草莓', en: 'Strawberry', tw: '草莓', twRom: 'tsháu-m̂', fact: '冬天可以到苗栗大湖採草莓！' },
      ],
    },
    {
      id: 'taichung', zh: '臺中', en: 'Taichung', tw: '臺中', twRom: 'Tâi-tiong', at: [120.68, 24.15],
      items: [
        { id: 'tw-suncake', emoji: '☀️', zh: '太陽餅', en: 'Sun Cake', tw: '太陽餅', twRom: 'thài-iông-piánn', fact: '太陽餅是臺中有名的點心，圓圓的像太陽，裡面甜甜的。' },
        { id: 'tw-bubbletea', emoji: '🧋', zh: '珍珠奶茶', en: 'Bubble Tea', tw: '珍珠奶茶', twRom: 'tsin-tsu-ling-tê', fact: '珍珠奶茶是台灣發明的飲料，現在全世界都喝得到！' },
      ],
    },
    {
      id: 'changhua', zh: '彰化', en: 'Changhua', tw: '彰化', twRom: 'Tsiong-huà', at: [120.54, 24.08], marker: [120.22, 24.16],
      items: [
        { id: 'tw-bawan', emoji: '🥟', zh: '肉圓', en: 'Bawan', tw: '肉圓', twRom: 'bah-uân', fact: '彰化肉圓大大一顆，Q Q 的，是有名的小吃。' },
      ],
    },
    {
      id: 'nantou', zh: '南投', en: 'Nantou', tw: '南投', twRom: 'Lâm-tâu', at: [120.91, 23.86],
      items: [
        { id: 'tw-black-bear', art: 'formosan-bear', zh: '台灣黑熊', en: 'Formosan Black Bear', tw: '台灣烏熊', twRom: 'Tâi-uân oo-hîm', fact: '台灣黑熊胸前有白色的 V 字，住在高高的山上。' },
        { id: 'tw-sunmoonlake', emoji: '🏞️', zh: '日月潭', en: 'Sun Moon Lake', tw: '日月潭', twRom: 'Ji̍t-gua̍t-thâm', fact: '日月潭是台灣最大的湖，一邊像太陽、一邊像月亮。' },
      ],
    },
    {
      id: 'yunlin', zh: '雲林', en: 'Yunlin', tw: '雲林', twRom: 'Hûn-lîm', at: [120.43, 23.70], marker: [120.05, 23.66],
      items: [
        { id: 'tw-peanut', emoji: '🥜', zh: '花生', en: 'Peanut', tw: '土豆', twRom: 'thôo-tāu', fact: '雲林種了很多花生，台語叫做「土豆」。' },
        { id: 'tw-puppet', emoji: '🎎', zh: '布袋戲', en: 'Glove Puppetry', tw: '布袋戲', twRom: 'pò-tē-hì', fact: '布袋戲是把手伸進布偶裡面表演，雲林是布袋戲的故鄉。' },
      ],
    },
    {
      id: 'chiayi', zh: '嘉義', en: 'Chiayi', tw: '嘉義', twRom: 'Ka-gī', at: [120.45, 23.48],
      items: [
        { id: 'tw-alishan', art: 'steam-train', zh: '阿里山小火車', en: 'Alishan Railway', tw: '阿里山火車', twRom: 'A-lí-san hué-tshia', fact: '阿里山小火車會繞著山一圈一圈往上爬，到山上看日出！' },
        { id: 'tw-chickenrice', emoji: '🍗', zh: '雞肉飯', en: 'Chicken Rice', tw: '雞肉飯', twRom: 'ke-bah-pn̄g', fact: '嘉義雞肉飯香香的，是嘉義人最愛的早餐和午餐。' },
      ],
    },
    {
      id: 'tainan', zh: '臺南', en: 'Tainan', tw: '臺南', twRom: 'Tâi-lâm', at: [120.20, 23.00], marker: [119.95, 23.08],
      items: [
        { id: 'tw-spoonbill', art: 'spoonbill', zh: '黑面琵鷺', en: 'Black-faced Spoonbill', tw: '烏面抐桮', twRom: 'oo-bīn-lā-pue', fact: '黑面琵鷺冬天會飛到臺南七股過冬，嘴巴像一支湯匙！' },
        { id: 'tw-danzai', emoji: '🍜', zh: '擔仔麵', en: 'Danzai Noodles', tw: '擔仔麵', twRom: 'tànn-á-mī', fact: '以前的人挑著擔子賣麵，所以叫做擔仔麵。' },
      ],
    },
    {
      id: 'kaohsiung', zh: '高雄', en: 'Kaohsiung', tw: '高雄', twRom: 'Ko-hiông', at: [120.31, 22.63], marker: [120.02, 22.62],
      items: [
        { id: 'tw-macaque', art: 'macaque', zh: '台灣獼猴', en: 'Formosan Macaque', tw: '猴山仔', twRom: 'kâu-san-á', fact: '高雄壽山住著很多台灣獼猴，不可以餵牠們吃東西喔！' },
        { id: 'tw-harbor', art: 'ship', zh: '港口', en: 'Harbor', tw: '港口', twRom: 'káng-kháu', fact: '高雄港很大，每天有好多大船開進開出。' },
      ],
    },
    {
      id: 'pingtung', zh: '屏東', en: 'Pingtung', tw: '屏東', twRom: 'Pîn-tong', at: [120.55, 22.50],
      items: [
        { id: 'tw-sea-turtle', art: 'sea-turtle', zh: '海龜', en: 'Sea Turtle', tw: '海龜', twRom: 'hái-ku', fact: '屏東小琉球的海裡常常可以看到綠蠵龜在游泳！' },
        { id: 'tw-beach', emoji: '🏖️', zh: '墾丁', en: 'Kenting', tw: '墾丁', twRom: 'Khún-ting', fact: '墾丁在台灣最南邊，有漂亮的沙灘和大海。' },
      ],
    },
    {
      id: 'taitung', zh: '臺東', en: 'Taitung', tw: '臺東', twRom: 'Tâi-tang', at: [121.14, 22.76],
      items: [
        { id: 'tw-balloon', art: 'hot-air-balloon', zh: '熱氣球', en: 'Hot Air Balloon', tw: '熱氣球', twRom: 'jia̍t-khì-kiû', fact: '夏天臺東鹿野有熱氣球節，好多熱氣球一起飛上天！' },
        { id: 'tw-sugarapple', emoji: '🍏', zh: '釋迦', en: 'Sugar Apple', tw: '釋迦', twRom: 'sik-khia', fact: '釋迦的樣子一顆一顆的，臺東種的釋迦很甜。' },
      ],
    },
    {
      id: 'hualien', zh: '花蓮', en: 'Hualien', tw: '花蓮', twRom: 'Hue-liân', at: [121.60, 23.98],
      items: [
        { id: 'tw-whale', art: 'whale', zh: '鯨魚', en: 'Whale', tw: '海翁', twRom: 'hái-ang', fact: '在花蓮搭船出海，有機會看到鯨魚和海豚！' },
        { id: 'tw-taroko', emoji: '⛰️', zh: '太魯閣', en: 'Taroko Gorge', tw: '太魯閣', twRom: 'Thài-lóo-koh', fact: '太魯閣有很高很高的大理石山壁，河水從中間流過。' },
      ],
    },
    {
      id: 'yilan', zh: '宜蘭', en: 'Yilan', tw: '宜蘭', twRom: 'Gî-lân', at: [121.75, 24.75], marker: [122.08, 24.70],
      items: [
        { id: 'tw-scallion', emoji: '🌿', zh: '三星蔥', en: 'Sanxing Scallion', tw: '三星蔥', twRom: 'Sam-tshenn tshang', fact: '宜蘭三星的蔥又長又香，可以做蔥油餅！' },
        { id: 'tw-turtle-island', emoji: '🐢', zh: '龜山島', en: 'Turtle Island', tw: '龜山島', twRom: 'Ku-suann-tó', fact: '宜蘭外海有一座島，看起來像一隻海龜在游泳！' },
      ],
    },
    {
      id: 'keelung', zh: '基隆', en: 'Keelung', tw: '基隆', twRom: 'Ke-lâng', at: [121.74, 25.13], marker: [122.02, 25.38], icon: { art: 'fishing-boat' },
      items: [
        { id: 'tw-nightmarket', emoji: '🏮', zh: '廟口夜市', en: 'Night Market', tw: '廟口夜市', twRom: 'biō-kháu iā-tshī', fact: '基隆廟口夜市有好多好吃的，一盞一盞黃色燈籠好漂亮。' },
        { id: 'tw-fishingboat', art: 'fishing-boat', zh: '漁船', en: 'Fishing Boat', tw: '討海船', twRom: 'thó-hái-tsûn', fact: '基隆有很多漁船，每天出海捕魚。' },
      ],
    },
    {
      id: 'newtaipei', zh: '新北', en: 'New Taipei', tw: '新北', twRom: 'Sin-pak', at: [121.73, 25.03], marker: [121.42, 25.48],
      items: [
        { id: 'tw-skylantern', emoji: '🏮', zh: '天燈', en: 'Sky Lantern', tw: '天燈', twRom: 'thian-ting', fact: '新北平溪會放天燈，把願望寫在天燈上，讓它飛上天！' },
        { id: 'tw-blue-magpie', art: 'blue-magpie', zh: '台灣藍鵲', en: 'Taiwan Blue Magpie', tw: '長尾山娘', twRom: 'tn̂g-bué-suann-niû', fact: '台灣藍鵲有長長的藍色尾巴，常常一家人一起飛。' },
      ],
    },
  ],
};

// 黑面琵鷺（台灣環島才用到的插圖）：白色身體、黑色的臉、像湯匙的嘴巴
if (typeof ART !== 'undefined' && typeof K !== 'undefined') {
  Object.assign(ART, {
    spoonbill: () => {
      const { ell, path, line, eyes, blush } = K;
      const w = '#fbfbf7', k = '#2c2a2e';
      return line('M4 22 V44 M14 22 V44', '#3a3a44', 2.6) + line('M-1 44 h9 M10 44 h9', '#3a3a44', 2.2) +
        ell(10, 10, 20, 15, w) + path('M18 2 Q34 0 36 14 Q28 10 22 14z', '#f3f0e6') +
        path('M-8 4 Q-14 -12 -10 -22 L-2 -20 Q-4 -8 2 2z', w) +
        ell(-10, -26, 11, 10, w) + path('M-20 -30 Q-12 -36 -2 -30 Q-6 -20 -16 -20 Q-21 -24 -20 -30z', k) +
        path('M-20 -26 L-40 -20 Q-48 -18 -46 -12 Q-43 -8 -38 -12 L-20 -20z', k) +
        eyes(-12, -27, 3, 2.4, '#fff') + blush(-10, -20, 7, 2.4);
    },
  });
}
