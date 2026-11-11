// 🗽 美國之旅的資料（region.html?r=usa 會讀這個檔），格式見 regions/europe.js、africa.js
//
// 坐露營車（camper-van）走真的公路環遊美國：
//   I-80 紐約→芝加哥、I-90 芝加哥→黃石公園、66 號公路 芝加哥→洛杉磯（中途轉去大峽谷）
//   I-15／I-80 黃石→鹽湖城→舊金山、1 號公路 舊金山→洛杉磯沿著海岸
//   I-10 洛杉磯→紐奧良→佛羅里達、I-95 佛羅里達→紐約
// 洛杉磯到夏威夷坐飛機。夏威夷離太遠放不進地圖，照一般美國地圖的做法，把它搬到旁邊用虛線小框框起來（insets）：
//   夏威夷的島和那一站的座標都是「搬過的位置」（真的位置往東移 36.5 度、往北移 5 度）
// 美國只有一個國家：countries 只有一筆，國界是手畫的大概形狀，海岸線用主地圖的陸地裁出來
window.REGIONS = window.REGIONS || {};

// 夏威夷搬家：真的經緯度 → 小框框裡的位置
const HAWAII = ([lon, lat]) => [+(lon + 36.5).toFixed(2), +(lat + 5).toFixed(2)];

REGIONS.usa = {
  id: 'usa',
  title: { zh: '美國之旅', en: 'USA Trip' },
  sea: '#5fb4e8',
  landFar: '#d9ebc3',
  land: '#f6b9a4',
  vehicle: 'camper-van',
  roadVehicle: 'camper-van',
  lang3: 'local',
  loop: false,
  bounds: [-126, 22.5, -65, 50],
  hint: '👆 點一個地方，開露營車出發！',
  doneSay: '美國之旅完成！你好厲害！',
  countries: [
    { id: 'usa', zh: '美國', en: 'United States', color: '#f6b9a4', lang: 'en-US', hello: 'Hi', flag: ['us'],
      polys: [[[-125.5, 49.0], [-95.15, 49.0], [-94.8, 49.3], [-89.6, 48.0], [-84.8, 46.9], [-82.4, 45.3], [-82.5, 42.6], [-79.0, 42.8], [-79.0, 43.3], [-76.5, 44.2], [-75.0, 44.9], [-71.5, 45.0], [-70.0, 46.7], [-69.2, 47.45], [-67.8, 47.1], [-67.0, 45.0], [-65.5, 44.0], [-68.0, 40.0], [-74.0, 37.0], [-74.5, 35.0], [-77.5, 31.5], [-79.5, 27.0], [-79.5, 25.0], [-81.0, 24.0], [-83.0, 24.2], [-85.0, 28.0], [-89.0, 28.2], [-94.0, 28.0], [-97.15, 25.95], [-99.1, 26.4], [-101.4, 29.77], [-103.1, 29.0], [-104.5, 29.6], [-106.5, 31.8], [-108.2, 31.33], [-111.07, 31.33], [-114.8, 32.5], [-117.12, 32.53], [-118.5, 32.0], [-121.0, 33.0], [-123.0, 36.0], [-125.0, 40.0], [-125.5, 46.0]]] },
  ],
  // 夏威夷的四個主要島（搬過的位置）
  islands: [
    [[-155.9, 20.25], [-155.0, 19.75], [-154.8, 19.5], [-155.6, 18.9], [-156.05, 19.7]].map(HAWAII),
    [[-156.7, 21.0], [-156.0, 20.85], [-156.4, 20.58], [-156.7, 20.85]].map(HAWAII),
    [[-158.3, 21.6], [-157.7, 21.3], [-157.95, 21.25], [-158.25, 21.4]].map(HAWAII),
    [[-159.8, 22.2], [-159.3, 22.2], [-159.35, 21.9], [-159.7, 21.95]].map(HAWAII),
  ],
  insets: [{ box: [-124.4, 23.3, -117.6, 27.9], label: '夏威夷' }],
  junctions: {
    flagstaff: [-111.65, 35.2], // 66 號公路往大峽谷的路口
    saltlake: [-111.89, 40.76],
  },
  lines: [
    { name: 'I-80（紐約→芝加哥）', mode: 'road', path: ['newyork', [-75.6, 41.0], [-77.9, 41.2], [-81.7, 41.5], [-84.5, 41.6], 'chicago'] },
    { name: 'I-90（芝加哥→黃石公園）', mode: 'road', path: ['chicago', [-89.4, 43.07], [-96.73, 43.55], [-103.23, 44.08], [-108.5, 45.78], [-110.56, 45.66], 'yellowstone'] },
    { name: '66 號公路（芝加哥→洛杉磯）', mode: 'road', path: ['chicago', [-90.2, 38.63], [-95.99, 36.15], [-97.52, 35.47], [-101.83, 35.22], [-106.65, 35.08], 'flagstaff', [-114.0, 34.9], [-117.29, 34.11], 'losangeles'] },
    { name: '往大峽谷的路', mode: 'road', path: ['flagstaff', [-112.0, 35.7], 'grandcanyon'] },
    { name: 'I-15／I-80（黃石公園→鹽湖城→舊金山）', mode: 'road', path: ['yellowstone', [-112.0, 43.5], 'saltlake', [-114.5, 40.8], [-117.8, 40.9], [-119.81, 39.53], [-121.49, 38.58], 'sanfrancisco'] },
    { name: '1 號公路（舊金山→洛杉磯，沿著海岸）', mode: 'road', path: ['sanfrancisco', [-121.9, 36.6], [-120.66, 35.28], [-119.7, 34.42], 'losangeles'] },
    { name: 'I-10（洛杉磯→紐奧良）', mode: 'road', path: ['losangeles', [-112.07, 33.45], [-106.49, 31.76], [-98.49, 29.42], [-95.37, 29.76], 'neworleans'] },
    { name: 'I-10／I-95（紐奧良→佛羅里達）', mode: 'road', path: ['neworleans', [-87.2, 30.45], [-84.28, 30.44], [-81.66, 30.33], 'florida'] },
    { name: 'I-95（佛羅里達→紐約）', mode: 'road', path: ['florida', [-81.1, 32.08], [-78.9, 35.0], [-77.04, 38.9], [-75.17, 39.95], 'newyork'] },
    { name: '飛機（洛杉磯→夏威夷）', mode: 'air', path: ['losangeles', 'hawaii'] },
  ],
  stops: [
    {
      id: 'newyork', country: 'usa', zh: '紐約', en: 'New York', local: 'New York', at: [-74.0, 40.71], marker: [-70.5, 39.4],
      items: [
        { id: 'us-liberty', art: 'statue-of-liberty', zh: '自由女神', en: 'Statue of Liberty', fact: '自由女神站在紐約的海邊，右手高高舉著火炬，歡迎坐船來的人！' },
        { id: 'us-taxi', art: 'taxi', zh: '黃色計程車', en: 'Yellow Taxi', fact: '紐約的計程車是黃色的，街上滿滿都是！' },
        { id: 'us-bagel', emoji: '🥯', zh: '貝果', en: 'Bagel', fact: '貝果是圓圓的、中間有一個洞的麵包，紐約人早餐很愛吃！' },
      ],
    },
    {
      id: 'chicago', country: 'usa', zh: '芝加哥', en: 'Chicago', local: 'Chicago', at: [-87.63, 41.88], marker: [-87.0, 44.6],
      items: [
        { id: 'us-skyscraper', emoji: '🏙️', zh: '摩天大樓', en: 'Skyscrapers', fact: '芝加哥是摩天大樓的故鄉，世界上最早的摩天大樓就蓋在這裡！' },
        { id: 'us-route66', emoji: '🛣️', zh: '66 號公路', en: 'Route 66', fact: '有名的 66 號公路從芝加哥出發，一路開到西邊的洛杉磯！' },
      ],
    },
    {
      id: 'yellowstone', country: 'usa', zh: '黃石公園', en: 'Yellowstone', local: 'Yellowstone', at: [-110.59, 44.43],
      items: [
        { id: 'us-bison', art: 'bison', zh: '美洲野牛', en: 'Bison', fact: '黃石公園的野牛常常走到馬路上，車子要停下來讓牠們先過！' },
        { id: 'us-bear', art: 'brown-bear', zh: '灰熊', en: 'Grizzly Bear', fact: '灰熊會在河裡抓魚吃，冬天的時候在洞裡睡好長的覺！' },
        { id: 'us-geyser', emoji: '♨️', zh: '間歇泉', en: 'Geyser', fact: '黃石公園的老忠實泉每隔一段時間，就會從地下噴出好高的熱水柱！' },
      ],
    },
    {
      id: 'grandcanyon', country: 'usa', zh: '大峽谷', en: 'Grand Canyon', local: 'Grand Canyon', at: [-112.11, 36.06], marker: [-112.6, 38.4],
      items: [
        { id: 'us-canyon', emoji: '🏜️', zh: '大峽谷', en: 'Grand Canyon', fact: '大峽谷是河水花了好幾百萬年慢慢挖出來的，又深又長，一層一層紅紅的石頭好漂亮！' },
        { id: 'us-rattlesnake', art: 'rattlesnake', zh: '響尾蛇', en: 'Rattlesnake', fact: '響尾蛇的尾巴搖起來會沙沙響，是在說「不要靠近我」！' },
      ],
    },
    {
      id: 'sanfrancisco', country: 'usa', zh: '舊金山', en: 'San Francisco', local: 'San Francisco', at: [-122.42, 37.77], marker: [-125.0, 38.6],
      items: [
        { id: 'us-goldengate', art: 'golden-gate', zh: '金門大橋', en: 'Golden Gate Bridge', fact: '金門大橋是橘紅色的，霧很濃的時候，只看得到高高的塔尖！' },
        { id: 'us-cablecar', emoji: '🚋', zh: '叮噹車', en: 'Cable Car', fact: '舊金山的叮噹車爬上好陡的山坡，一路叮叮噹噹響！' },
        { id: 'us-sealion', art: 'seal', zh: '海獅', en: 'Sea Lion', fact: '舊金山的碼頭上躺著一大群海獅，會汪汪汪地叫！' },
      ],
    },
    {
      id: 'losangeles', country: 'usa', zh: '洛杉磯', en: 'Los Angeles', local: 'Los Angeles', at: [-118.24, 34.05], marker: [-115.4, 32.9],
      items: [
        { id: 'us-movie', emoji: '🎬', zh: '好萊塢電影', en: 'Hollywood', fact: '洛杉磯的好萊塢會拍好多電影和卡通，山上有好大的 HOLLYWOOD 字！' },
        { id: 'us-surf', emoji: '🏄', zh: '衝浪', en: 'Surfing', fact: '洛杉磯的海灘浪很大，很多人站在衝浪板上乘風破浪！' },
      ],
    },
    {
      id: 'hawaii', country: 'usa', zh: '夏威夷', en: 'Hawaii', local: 'Hawaii', at: HAWAII([-157.86, 21.31]), vehicle: 'airplane',
      items: [
        { id: 'us-turtle', art: 'sea-turtle', zh: '綠蠵龜', en: 'Sea Turtle', fact: '夏威夷的海灘上常常有海龜爬上岸曬太陽！' },
        { id: 'us-volcano', emoji: '🌋', zh: '火山', en: 'Volcano', fact: '夏威夷的島是火山噴出來的，現在還有會流出紅紅岩漿的火山！' },
        { id: 'us-hula', emoji: '🌺', zh: '扶桑花', en: 'Hibiscus', fact: '夏威夷人會戴著花圈跳草裙舞，歡迎來玩的人！' },
      ],
    },
    {
      id: 'neworleans', country: 'usa', zh: '紐奧良', en: 'New Orleans', local: 'New Orleans', at: [-90.07, 29.95], marker: [-90.4, 26.9],
      items: [
        { id: 'us-jazz', emoji: '🎷', zh: '爵士樂', en: 'Jazz', fact: '紐奧良是爵士樂的故鄉，街上到處都有人在吹薩克斯風和小喇叭！' },
        { id: 'us-alligator', art: 'crocodile', zh: '短吻鱷', en: 'Alligator', fact: '紐奧良旁邊的沼澤裡住著好多短吻鱷，坐船就看得到！' },
      ],
    },
    {
      id: 'florida', country: 'usa', zh: '佛羅里達', en: 'Florida', local: 'Florida', at: [-80.6, 28.4], marker: [-77.2, 27.6],
      items: [
        { id: 'us-rocket', art: 'rocket', zh: '火箭', en: 'Rocket', fact: '佛羅里達的太空中心會發射火箭，以前的太空人就是從這裡出發去月球的！' },
        { id: 'us-flamingo', art: 'flamingo', zh: '紅鶴', en: 'Flamingo', fact: '佛羅里達溫暖的海邊有粉紅色的紅鶴，用一隻腳站著睡覺！' },
        { id: 'us-orange', emoji: '🍊', zh: '柳橙', en: 'Orange', fact: '佛羅里達種好多柳橙，柳橙汁又酸又甜！' },
      ],
    },
  ],
};
