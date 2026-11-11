// 🐘 泰國之旅的資料（region.html?r=thailand 會讀這個檔），格式見 regions/europe.js
//
// 坐泰國的火車走真的路線：
//   北部線 曼谷→大城→華富里→彭世洛→南邦→清邁
//   南部線 曼谷→佛統→華欣→春蓬→素叻他尼；北碧線 曼谷→佛統→北碧（桂河大橋）
// 素叻他尼坐渡輪到蘇美島、坐巴士到普吉島；曼谷到水上市場坐嘟嘟車（tuk-tuk，泰國的三輪車）
// 泰國的國界是手畫的大概形狀，靠海的那邊畫到海上，再用主地圖的陸地裁出海岸線
// 當地語言是泰語，字是泰文；裝置沒有泰語的語音就不唸，只顯示
window.REGIONS = window.REGIONS || {};

REGIONS.thailand = {
  id: 'thailand',
  title: { zh: '泰國之旅', en: 'Thailand Trip' },
  sea: '#5fb4e8',
  landFar: '#dfeccd',
  vehicle: 'train',
  roadVehicle: 'tuk-tuk',
  lang3: 'local',
  loop: false,
  bounds: [96.5, 6.2, 106, 20.6],
  hint: '👆 點一個地方，坐火車、嘟嘟車出發！',
  doneSay: '泰國之旅完成！你好厲害！',
  countries: [
    { id: 'thailand', zh: '泰國', en: 'Thailand', color: '#f7c98b', lang: 'th-TH', hello: 'สวัสดี', flag: ['h', '#A51931', '#F4F5F8', '#2D2A4A', '#2D2A4A', '#F4F5F8', '#A51931'],
      polys: [[
        [97.4, 18.5], [97.8, 20.0], [99.0, 20.1], [99.9, 20.45], [100.6, 20.2], [101.3, 19.6], [101.0, 17.8], [102.0, 17.9], [103.0, 18.4],
        [104.0, 17.4], [104.7, 16.4], [105.6, 15.4], [105.2, 14.3], [103.0, 14.4], [102.4, 13.6], [102.8, 12.2], [102.6, 11.6], [103.5, 10.5],
        [102.5, 6.5], [102.1, 6.2], [101.1, 6.25], [100.7, 6.5], [100.1, 6.45], [99.8, 6.6], [98.5, 7.0], [97.6, 8.0], [98.2, 9.8],
        [98.6, 10.0], [99.1, 11.0], [99.6, 11.8], [99.2, 12.6], [99.1, 13.4], [98.6, 14.3], [98.3, 15.2], [98.6, 16.1], [97.7, 17.0],
      ]] },
  ],
  junctions: {
    nakhonpathom: [100.06, 13.82],
    suratthani: [99.33, 9.13],
  },
  lines: [
    { name: '北部線（曼谷→大城→清邁）', path: ['bangkok', 'ayutthaya', [100.62, 14.8], [100.26, 16.82], [99.5, 18.29], 'chiangmai'] },
    { name: '南部線（曼谷→佛統→華欣→素叻他尼）', path: ['bangkok', 'nakhonpathom', 'huahin', [99.6, 11.8], [99.18, 10.5], 'suratthani'] },
    { name: '北碧線（佛統→北碧，桂河大橋）', path: ['nakhonpathom', [99.8, 13.95], 'kanchanaburi'] },
    { name: '嘟嘟車（曼谷→水上市場）', mode: 'road', path: ['bangkok', [100.2, 13.6], 'floatingmarket'] },
    { name: '渡輪（素叻他尼→蘇美島）', mode: 'boat', path: ['suratthani', [99.75, 9.35], 'kohsamui'] },
    { name: '巴士（素叻他尼→普吉島）', mode: 'road', vehicle: 'bus', path: ['suratthani', [98.9, 8.6], 'phuket'] },
  ],
  stops: [
    {
      id: 'bangkok', country: 'thailand', zh: '曼谷', en: 'Bangkok', local: 'กรุงเทพ', at: [100.5, 13.75], marker: [101.6, 13.4],
      items: [
        { id: 'th-temple', emoji: '🛕', zh: '鄭王廟', en: 'Wat Arun', local: 'วัดอรุณ', fact: '曼谷河邊的鄭王廟，塔上貼滿了彩色的瓷片，太陽照到會閃閃發亮！' },
        { id: 'th-tuktuk', art: 'tuk-tuk', zh: '嘟嘟車', en: 'Tuk-tuk', local: 'ตุ๊กตุ๊ก', fact: '嘟嘟車是泰國的三輪計程車，開起來會發出「嘟嘟嘟」的聲音！' },
        { id: 'th-mango', emoji: '🥭', zh: '芒果糯米飯', en: 'Mango Sticky Rice', local: 'ข้าวเหนียวมะม่วง', fact: '芒果糯米飯是泰國的甜點，香甜的芒果配上淋了椰奶的糯米！' },
      ],
    },
    {
      id: 'floatingmarket', country: 'thailand', zh: '水上市場', en: 'Floating Market', local: 'ตลาดน้ำ', at: [99.96, 13.52], vehicle: 'tuk-tuk', marker: [98.6, 12.6],
      items: [
        { id: 'th-boatmarket', emoji: '🛶', zh: '小船上的市場', en: 'Boat Market', local: 'เรือ', fact: '水上市場的阿姨划著小船賣水果和麵，大家在船上買東西！' },
        { id: 'th-coconut', emoji: '🥥', zh: '椰子', en: 'Coconut', local: 'มะพร้าว', fact: '泰國的椰子水好甜，插一根吸管就可以直接喝！' },
      ],
    },
    {
      id: 'ayutthaya', country: 'thailand', zh: '大城', en: 'Ayutthaya', local: 'อยุธยา', at: [100.57, 14.35], marker: [101.8, 14.9],
      items: [
        { id: 'th-tree', emoji: '🌳', zh: '樹根裡的佛頭', en: 'Buddha Head in Tree Roots', local: 'เศียรพระ', fact: '大城有一顆古老的佛頭被大樹的樹根包住了，好像從樹裡長出來一樣！' },
        { id: 'th-elephant', art: 'elephant', zh: '大象', en: 'Elephant', local: 'ช้าง', fact: '大象是泰國的國家動物，以前會幫忙搬木頭、載國王！' },
      ],
    },
    {
      id: 'chiangmai', country: 'thailand', zh: '清邁', en: 'Chiang Mai', local: 'เชียงใหม่', at: [98.98, 18.79], marker: [97.7, 19.8],
      items: [
        { id: 'th-lantern', emoji: '🏮', zh: '天燈', en: 'Sky Lanterns', local: 'โคมลอย', fact: '清邁的天燈節，好幾千個天燈一起飛上夜空，像滿天的星星！' },
        { id: 'th-sanctuary', art: 'elephant', zh: '大象保護區', en: 'Elephant Sanctuary', local: 'ช้าง', fact: '清邁的大象保護區可以幫大象洗澡、餵牠們吃香蕉！' },
      ],
    },
    {
      id: 'kanchanaburi', country: 'thailand', zh: '北碧', en: 'Kanchanaburi', local: 'กาญจนบุรี', at: [99.53, 14.0], marker: [98.4, 14.9],
      items: [
        { id: 'th-bridge', emoji: '🌉', zh: '桂河大橋', en: 'River Kwai Bridge', local: 'สะพาน', fact: '北碧的桂河大橋是一座有名的鐵橋，火車會從橋上慢慢開過去！' },
        { id: 'th-erawan', art: 'waterfall', zh: '愛侶灣瀑布', en: 'Erawan Falls', local: 'น้ำตก', fact: '愛侶灣瀑布的水是漂亮的藍綠色，一層一層往下流，還有小魚會咬你的腳！' },
      ],
    },
    {
      id: 'huahin', country: 'thailand', zh: '華欣', en: 'Hua Hin', local: 'หัวหิน', at: [99.96, 12.57], marker: [101.0, 12.1],
      items: [
        { id: 'th-station', emoji: '🚉', zh: '漂亮的火車站', en: 'Royal Train Station', local: 'สถานีรถไฟ', fact: '華欣的火車站是紅白色的木頭房子，是泰國最漂亮的火車站！' },
        { id: 'th-monkey', art: 'macaque', zh: '猴子', en: 'Monkey', local: 'ลิง', fact: '華欣海邊的山上住著好多猴子，會跳到遊客旁邊討東西吃！' },
      ],
    },
    {
      id: 'kohsamui', country: 'thailand', zh: '蘇美島', en: 'Koh Samui', local: 'เกาะสมุย', at: [100.0, 9.5], vehicle: 'ship', marker: [101.2, 9.9],
      items: [
        { id: 'th-beach', emoji: '🏝️', zh: '熱帶小島', en: 'Tropical Island', local: 'เกาะ', fact: '蘇美島有白白的沙灘和椰子樹，海水好清澈！' },
        { id: 'th-turtle', art: 'sea-turtle', zh: '海龜', en: 'Sea Turtle', local: 'เต่าทะเล', fact: '蘇美島附近的海裡常常有海龜游過！' },
      ],
    },
    {
      id: 'phuket', country: 'thailand', zh: '普吉島', en: 'Phuket', local: 'ภูเก็ต', at: [98.39, 7.88], vehicle: 'bus', marker: [97.4, 8.6],
      items: [
        { id: 'th-longtail', emoji: '🛶', zh: '長尾船', en: 'Long-tail Boat', local: 'เรือหางยาว', fact: '長尾船的引擎後面有一根長長的螺旋槳，開起來噗噗噗好大聲！' },
        { id: 'th-clownfish', art: 'clownfish', zh: '小丑魚', en: 'Clownfish', local: 'ปลาการ์ตูน', fact: '普吉島旁邊的海裡可以浮潛，看到住在海葵裡的小丑魚！' },
      ],
    },
  ],
};
