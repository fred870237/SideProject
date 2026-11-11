// 🦎 馬達加斯加之旅的資料（region.html?r=madagascar 會讀這個檔），格式見 regions/europe.js
//
// 狐猴、變色龍、猴麵包樹大道、座頭鯨
// 坐真的路線：
//   安塔那那利佛坐「計程巴士」（taxi-brousse）走 7 號國道往南：安齊拉貝→菲亞納蘭楚阿→伊薩魯→圖利亞拉
//   菲亞納蘭楚阿坐真的 FCE 叢林小火車到海邊的馬納卡拉（穿過好多山洞，最後還開過機場跑道）
//   菲亞納蘭楚阿往東北走 25 號國道到拉努馬法納的雨林
//   安齊拉貝往西走 34、35 號國道到穆隆達瓦的猴麵包樹大道
//   安塔那那利佛走 2 號國道到安達西貝、塔馬塔夫，再沿海岸到索阿尼拉納伊沃古，坐船到聖瑪麗島
//   安塔那那利佛坐飛機到北邊的諾西貝
// 馬達加斯加語沒有系統語音，用法語的聲音唸（跟非洲之旅一樣）
window.REGIONS = window.REGIONS || {};

REGIONS.madagascar = {
  id: 'madagascar',
  title: { zh: '馬達加斯加之旅', en: 'Madagascar Trip' },
  sea: '#5fb4e8',
  landFar: '#ece6d2',
  vehicle: 'train',
  roadVehicle: 'bus',
  lang3: 'local',
  loop: false,
  bounds: [41.5, -26.2, 52, -11.4],
  hint: '👆 點一個地方，出發去狐猴的島！',
  doneSay: '馬達加斯加之旅完成！你好厲害！',
  countries: [
    // 島的海岸線用 MAP_LAND 剪，所以這裡畫一個大框框就好；西北邊斜切一刀，不要把葛摩和馬約特島也塗上顏色
    { id: 'madagascar', zh: '馬達加斯加', en: 'Madagascar', color: '#b9dc9a', lang: 'fr-FR', hello: 'Salama', flag: ['mg'],
      polys: [[[42.6, -26.5], [51.5, -26.5], [51.5, -15], [50, -11.4], [48, -11.6], [47, -13], [42.6, -17]]] },
  ],
  // 主地圖的海岸線沒有諾西貝和聖瑪麗島這兩個小島，自己補畫
  islands: [
    { fill: '#b9dc9a', pts: [[48.05, -13.25], [48.2, -13.13], [48.36, -13.2], [48.4, -13.36], [48.28, -13.47], [48.1, -13.42]] },
    { fill: '#b9dc9a', pts: [[49.8, -16.66], [49.9, -16.74], [50.0, -16.95], [49.95, -17.14], [49.86, -17.1], [49.79, -16.88]] },
  ],
  junctions: {
    toamasina: [49.4, -18.15], soanierana: [49.58, -16.92],
  },
  lines: [
    { name: '計程巴士（7 號國道：安塔那那利佛→安齊拉貝→菲亞納蘭楚阿→伊薩魯→圖利亞拉）', mode: 'road',
      path: ['antananarivo', [47.35, -19.35], 'antsirabe', [47.15, -20.5], [47.08, -21.0], 'fianarantsoa', [46.94, -21.83], [46.12, -22.4], 'isalo', [44.7, -22.95], 'toliara'] },
    { name: '叢林小火車 FCE（菲亞納蘭楚阿→馬納卡拉）', path: ['fianarantsoa', [47.35, -21.6], [47.7, -21.95], 'manakara'] },
    { name: '計程巴士（菲亞納蘭楚阿→拉努馬法納）', mode: 'road', path: ['fianarantsoa', [47.3, -21.3], 'ranomafana'] },
    { name: '計程巴士（安齊拉貝→穆隆達瓦）', mode: 'road', path: ['antsirabe', [46.4, -19.7], [45.47, -19.52], 'morondava'] },
    { name: '計程巴士（安塔那那利佛→安達西貝→塔馬塔夫→索阿尼拉納伊沃古）', mode: 'road', path: ['antananarivo', [47.95, -18.85], 'andasibe', [48.9, -18.5], 'toamasina', [49.45, -17.6], 'soanierana'] },
    { name: '坐船（索阿尼拉納伊沃古→聖瑪麗島）', mode: 'boat', path: ['soanierana', [49.75, -16.95], 'saintemarie'] },
    { name: '飛機（安塔那那利佛→諾西貝）', mode: 'air', path: ['antananarivo', 'nosybe'] },
  ],
  stops: [
    {
      id: 'antananarivo', country: 'madagascar', zh: '安塔那那利佛', en: 'Antananarivo', local: 'Antananarivo', at: [47.52, -18.91], marker: [47.45, -18.2],
      items: [
        { id: 'mg-zebu', art: 'cow', zh: '瘤牛', en: 'Zebu', local: 'omby', fact: '馬達加斯加的牛背上有一個大大的肉峰，叫做瘤牛，會幫忙拉車和犁田！' },
        { id: 'mg-rice', emoji: '🌾', zh: '稻田', en: 'Rice Fields', local: 'vary', fact: '馬達加斯加人超愛吃米飯，一天三餐都吃，高原上到處都是一層一層的稻田！' },
        { id: 'mg-market', emoji: '⛱️', zh: '白傘市場', en: 'Umbrella Market', local: 'tsena', fact: '市場上撐著好多白色的大傘，下面賣水果、香草和手編的籃子！' },
      ],
    },
    {
      id: 'andasibe', country: 'madagascar', zh: '安達西貝', en: 'Andasibe', local: 'Andasibe', at: [48.42, -18.94], marker: [49.35, -19.0],
      items: [
        { id: 'mg-chameleon', art: 'chameleon', zh: '變色龍', en: 'Chameleon', local: 'tana', fact: '世界上一半的變色龍都住在馬達加斯加，牠們的眼睛可以分開來看兩個方向！' },
        { id: 'mg-indri', emoji: '🎶', zh: '會唱歌的大狐猴', en: 'Singing Indri', local: 'babakoto', fact: '大狐猴是最大的狐猴，每天早上大聲唱歌，聲音可以傳到好幾公里遠！' },
        { id: 'mg-frog', art: 'frog', zh: '樹蛙', en: 'Tree Frog', local: 'sahona', fact: '雨林裡住著好多五顏六色的小青蛙，晚上會一起呱呱叫！' },
      ],
    },
    {
      id: 'antsirabe', country: 'madagascar', zh: '安齊拉貝', en: 'Antsirabe', local: 'Antsirabe', at: [47.03, -19.87], marker: [46.55, -19.55],
      items: [
        { id: 'mg-pousse', emoji: '🛺', zh: '推推車', en: 'Pousse-pousse', local: 'posy', fact: '安齊拉貝的街上跑著好多彩色的人力車，叫做「推推車」，因為以前要有人在後面推！' },
        { id: 'mg-gem', emoji: '💎', zh: '寶石', en: 'Gemstones', local: 'vatosoa', fact: '這附近的地底下挖得到好多亮晶晶的寶石，顏色像彩虹一樣漂亮！' },
      ],
    },
    {
      id: 'ranomafana', country: 'madagascar', zh: '拉努馬法納', en: 'Ranomafana', local: 'Ranomafana', at: [47.46, -21.25], marker: [48.95, -20.9],
      items: [
        { id: 'mg-bamboolemur', emoji: '🎋', zh: '金竹狐猴', en: 'Golden Bamboo Lemur', local: 'varika', fact: '金竹狐猴只吃竹子，連會讓別的動物肚子痛的竹子嫩芽，牠都可以吃！' },
        { id: 'mg-waterfall', art: 'waterfall', zh: '雨林瀑布', en: 'Rainforest Waterfall', local: 'riana', fact: '拉努馬法納的意思是「熱熱的水」，因為這裡除了瀑布，還有冒煙的溫泉！' },
      ],
    },
    {
      id: 'fianarantsoa', country: 'madagascar', zh: '菲亞納蘭楚阿', en: 'Fianarantsoa', local: 'Fianarantsoa', at: [47.09, -21.45], marker: [46.55, -21.25],
      items: [
        { id: 'mg-train', art: 'train', zh: '叢林小火車', en: 'Jungle Train', local: 'lamasinina', fact: '從這裡坐小火車到海邊，要穿過四十幾個山洞和好多座橋，每一站都有人跑來賣香蕉！' },
        { id: 'mg-tea', emoji: '🍵', zh: '茶園', en: 'Tea Garden', local: 'dite', fact: '附近的山坡上種滿綠綠的茶樹，大家會一片一片把茶葉摘下來！' },
      ],
    },
    {
      id: 'manakara', country: 'madagascar', zh: '馬納卡拉', en: 'Manakara', local: 'Manakara', at: [48.02, -22.15], marker: [48.8, -22.4],
      items: [
        { id: 'mg-runway', emoji: '🛤️', zh: '火車過跑道', en: 'Train on the Runway', local: 'lamasinina', fact: '小火車快到站的時候，會直接開過飛機場的跑道，飛機要等火車先過！' },
        { id: 'mg-canoe', emoji: '🛶', zh: '運河獨木舟', en: 'Canal Canoe', local: 'lakana', fact: '海邊有一條好長好長的運河，大家坐著獨木舟運送水果和貨物！' },
      ],
    },
    {
      id: 'isalo', country: 'madagascar', zh: '伊薩魯國家公園', en: 'Isalo National Park', local: 'Isalo', at: [45.37, -22.55], marker: [45.1, -22.95],
      items: [
        { id: 'mg-ringtail', art: 'lemur', zh: '環尾狐猴', en: 'Ring-tailed Lemur', local: 'maky', fact: '環尾狐猴早上會張開手坐著曬太陽，好像在做體操！' },
        { id: 'mg-canyon', emoji: '🏜️', zh: '砂岩峽谷', en: 'Sandstone Canyons', local: 'vato', fact: '風把大石頭吹出好多奇怪的形狀，有一塊中間破了一個洞，好像窗戶一樣！' },
        { id: 'mg-pool', emoji: '🏊', zh: '天然游泳池', en: 'Natural Pool', local: 'rano', fact: '峽谷裡藏著一個清清的水池，走累了可以跳下去游泳！' },
      ],
    },
    {
      id: 'toliara', country: 'madagascar', zh: '圖利亞拉', en: 'Toliara', local: 'Toliara', at: [43.67, -23.35], vehicle: 'bus',
      items: [
        { id: 'mg-tortoise', art: 'tortoise', zh: '輻射陸龜', en: 'Radiated Tortoise', local: 'sokatra', fact: '輻射陸龜的殼上有黃色的星星花紋，可以活到一百多歲！' },
        { id: 'mg-vezo', art: 'sailboat', zh: '帆船獨木舟', en: 'Vezo Pirogue', local: 'lakana', fact: '海邊的維佐族是「大海的人」，坐著有帆的獨木舟出海抓魚！' },
        { id: 'mg-reef', art: 'clownfish', zh: '小丑魚', en: 'Clownfish', local: 'trondro', fact: '外海有一大片珊瑚礁，住著小丑魚和好多彩色的魚！' },
      ],
    },
    {
      id: 'morondava', country: 'madagascar', zh: '穆隆達瓦', en: 'Morondava', local: 'Morondava', at: [44.28, -20.28],
      items: [
        { id: 'mg-baobab', art: 'baobab', zh: '猴麵包樹大道', en: 'Avenue of the Baobabs', local: 'renala', fact: '紅土路兩旁站著好多巨大的猴麵包樹，太陽下山的時候最漂亮！' },
        { id: 'mg-lovebaobab', emoji: '🌳', zh: '抱抱猴麵包樹', en: 'Baobabs in Love', local: 'renala', fact: '這裡有兩棵猴麵包樹纏在一起長大，好像在抱抱，大家叫它「愛情猴麵包樹」！' },
      ],
    },
    {
      id: 'nosybe', country: 'madagascar', zh: '諾西貝', en: 'Nosy Be', local: 'Nosy Be', at: [48.27, -13.32], vehicle: 'airplane',
      items: [
        { id: 'mg-whaleshark', art: 'shark', zh: '鯨鯊', en: 'Whale Shark', local: 'antsantsa', fact: '鯨鯊是世界上最大的魚，可是牠只吃小小的浮游生物，不會咬人！' },
        { id: 'mg-seaturtle', art: 'sea-turtle', zh: '海龜', en: 'Sea Turtle', local: 'fano', fact: '諾西貝的海裡常常看到海龜，在海草上慢慢吃東西！' },
        { id: 'mg-ylang', emoji: '🌼', zh: '依蘭花', en: 'Ylang-ylang', local: 'ilang-ilang', fact: '諾西貝又叫「香水島」，島上種滿香香的依蘭花，可以拿來做香水！' },
      ],
    },
    {
      id: 'saintemarie', country: 'madagascar', zh: '聖瑪麗島', en: 'Île Sainte-Marie', local: 'Nosy Boraha', at: [49.85, -17.0], vehicle: 'ship',
      items: [
        { id: 'mg-whale', art: 'whale', zh: '座頭鯨', en: 'Humpback Whale', local: 'trozona', fact: '每年七月到九月，座頭鯨會游到這裡生寶寶，還會跳出海面翻跟斗！' },
        { id: 'mg-pirate', emoji: '⚓', zh: '海盜島', en: 'Pirate Island', local: 'piraty', fact: '很久很久以前，這座島是海盜住的地方，現在還找得到海盜的墓園！' },
      ],
    },
  ],
};
