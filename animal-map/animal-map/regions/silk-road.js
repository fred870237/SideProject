// 🐫 絲路中亞之旅的資料（region.html?r=silk-road 會讀這個檔），格式見 regions/europe.js
//
// 古代的「絲綢之路」經過中亞：哈薩克的大草原、烏茲別克的藍色圓頂古城、吉爾吉斯的天山
// 坐真的火車：
//   烏茲別克的 Afrosiyob 高鐵 塔什干→撒馬爾罕→布哈拉→（烏爾根奇）→希瓦
//   塔什干→希姆肯特→塔拉茲→阿拉木圖；阿拉木圖→舒→莫因特→卡拉干達→阿斯塔納
//   塔什干→突厥斯坦→克孜勒奧爾達→拜科努爾（太空發射場就在鐵路旁邊）
// 阿拉木圖→比斯凱克→伊塞克湖 坐吉普車翻過山
// 國界是手畫的大概形狀（給小朋友看的，不是精確的國界），海岸線用主地圖的陸地裁出來
// 每個國家用自己的語言打招呼：哈薩克語、烏茲別克語、吉爾吉斯語
window.REGIONS = window.REGIONS || {};

REGIONS['silk-road'] = {
  id: 'silk-road',
  title: { zh: '絲路中亞之旅', en: 'Silk Road Trip' },
  sea: '#5fb4e8',
  landFar: '#e8e6cf',
  vehicle: 'train',
  roadVehicle: 'jeep',
  lang3: 'local',
  loop: false,
  bounds: [52, 37.5, 82, 53],
  hint: '👆 點一個地方，沿著絲路出發！',
  doneSay: '絲路之旅完成！你好厲害！',
  countries: [
    { id: 'kazakhstan', zh: '哈薩克', en: 'Kazakhstan', color: '#f3d48b', lang: 'kk-KZ', hello: 'Сәлем', flag: ['kz'],
      polys: [[
        [47.0, 49.2], [47.5, 50.5], [51.0, 51.7], [55.0, 50.9], [58.5, 51.0], [61.0, 52.9], [61.5, 54.0], [65.0, 54.6], [69.0, 55.4],
        [73.5, 54.0], [76.5, 54.1], [77.9, 53.3], [80.0, 51.0], [82.0, 50.8], [85.5, 49.5], [87.3, 49.1], [85.5, 47.1], [83.0, 47.2],
        [82.5, 45.4], [80.8, 45.0], [80.2, 42.2], [79.0, 42.7], [77.0, 42.9], [74.6, 43.0], [73.5, 42.6], [71.0, 42.3], [70.9, 42.0],
        [69.1, 41.6], [68.2, 41.0], [66.6, 41.2], [66.0, 42.9], [63.0, 43.6], [60.0, 44.5], [58.6, 45.6], [56.0, 45.0], [55.9, 41.3],
        [53.0, 42.1], [50.5, 43.5], [49.0, 45.5], [48.0, 46.5],
      ]] },
    { id: 'uzbekistan', zh: '烏茲別克', en: 'Uzbekistan', color: '#b9dc9a', lang: 'uz-UZ', hello: 'Salom', flag: ['h', '#0099B5', '#ffffff', '#1EB53A'],
      polys: [[
        [55.9, 41.3], [56.0, 45.0], [58.6, 45.6], [60.0, 44.5], [63.0, 43.6], [66.0, 42.9], [66.6, 41.2], [68.2, 41.0], [69.1, 41.6],
        [70.9, 42.0], [71.0, 41.3], [73.0, 40.9], [71.5, 40.1], [70.6, 40.2], [69.3, 39.9], [68.5, 39.5], [67.4, 39.0], [68.4, 38.2],
        [67.8, 37.2], [66.5, 37.4], [66.0, 38.0], [64.3, 38.9], [62.0, 40.4], [61.3, 41.2], [60.0, 42.0], [58.5, 42.6], [56.9, 41.3],
      ]] },
    { id: 'kyrgyzstan', zh: '吉爾吉斯', en: 'Kyrgyzstan', color: '#f2a07b', lang: 'ky-KG', hello: 'Салам', flag: ['kg'],
      polys: [[
        [69.3, 39.5], [73.6, 39.4], [75.5, 40.3], [78.0, 41.1], [80.2, 42.2], [79.0, 42.7], [77.0, 42.9], [74.6, 43.0], [73.5, 42.6],
        [71.0, 42.3], [70.9, 42.0], [71.0, 41.3], [73.0, 40.9], [71.5, 40.1], [70.6, 40.2],
      ]] },
  ],
  lines: [
    { name: 'Afrosiyob 高鐵（塔什干→撒馬爾罕→布哈拉）', path: ['tashkent', [68.8, 40.5], 'samarkand', [65.3, 39.95], 'bukhara'] },
    { name: '布哈拉→烏爾根奇→希瓦', path: ['bukhara', [62.5, 40.6], [60.6, 41.55], 'khiva'] },
    { name: '塔什干→希姆肯特→塔拉茲→阿拉木圖', path: ['tashkent', [69.6, 42.3], [71.4, 42.9], [73.8, 43.4], 'almaty'] },
    { name: '阿拉木圖→卡拉干達→阿斯塔納', path: ['almaty', [73.8, 43.6], [73.4, 46.8], [73.1, 49.8], 'astana'] },
    { name: '塔什干→克孜勒奧爾達→拜科努爾', path: ['tashkent', [68.27, 43.3], [65.5, 44.85], 'baikonur'] },
    { name: '吉普車（阿拉木圖→比斯凱克→伊塞克湖）', mode: 'road', path: ['almaty', [74.6, 42.87], [76.2, 42.5], 'issykkul'] },
  ],
  stops: [
    {
      id: 'astana', country: 'kazakhstan', zh: '阿斯塔納', en: 'Astana', local: 'Астана', at: [71.43, 51.13],
      items: [
        { id: 'sr-eagle', art: 'eagle', zh: '老鷹獵人', en: 'Eagle Hunter', local: 'бүркітші', fact: '哈薩克的老鷹獵人會訓練金鵰，讓牠停在手臂上，一起在草原上打獵！' },
        { id: 'sr-horse', art: 'horse', zh: '草原上的馬', en: 'Horse', local: 'жылқы', fact: '哈薩克的大草原好大好大，大家很會騎馬，小朋友從小就學騎馬！' },
      ],
    },
    {
      id: 'almaty', country: 'kazakhstan', zh: '阿拉木圖', en: 'Almaty', local: 'Алматы', at: [76.95, 43.24], marker: [78.3, 44.8],
      items: [
        { id: 'sr-apple', emoji: '🍎', zh: '蘋果', en: 'Apple', local: 'алма', fact: '阿拉木圖的意思是「蘋果之父」，聽說全世界的蘋果，祖先都住在這附近的山上！' },
        { id: 'sr-skating', emoji: '⛸️', zh: '高山溜冰場', en: 'Mountain Ice Rink', local: 'Медеу', fact: '阿拉木圖的山上有一個好大的戶外溜冰場，可以一邊溜冰一邊看雪山！' },
      ],
    },
    {
      id: 'issykkul', country: 'kyrgyzstan', zh: '伊塞克湖', en: 'Issyk-Kul Lake', local: 'Ысык-Көл', at: [77.5, 42.4], vehicle: 'jeep', marker: [79.6, 41.4],
      items: [
        { id: 'sr-yurt', emoji: '⛺', zh: '蒙古包', en: 'Yurt', local: 'боз үй', fact: '吉爾吉斯的牧人住在圓圓的氈房裡，夏天會搬到山上的草原放牧！' },
        { id: 'sr-snowleopard', art: 'snow-leopard', zh: '雪豹', en: 'Snow Leopard', local: 'илбирс', fact: '天山上住著害羞的雪豹，尾巴又長又粗，冬天可以圍著保暖！' },
        { id: 'sr-lake', emoji: '🏔️', zh: '不結冰的湖', en: 'Lake That Never Freezes', local: 'көл', fact: '伊塞克湖在好高的山上，冬天卻不會結冰，所以叫做「熱湖」！' },
      ],
    },
    {
      id: 'baikonur', country: 'kazakhstan', zh: '拜科努爾', en: 'Baikonur', local: 'Байқоңыр', at: [63.3, 45.6],
      items: [
        { id: 'sr-rocket', art: 'rocket', zh: '火箭發射場', en: 'Cosmodrome', local: 'ғарыш айлағы', fact: '世界上第一個上太空的人，就是從拜科努爾坐火箭出發的！' },
        { id: 'sr-camel', art: 'camel', zh: '雙峰駱駝', en: 'Bactrian Camel', local: 'түйе', fact: '中亞的駱駝有兩個駝峰，冬天毛長長的，不怕沙漠的冷！' },
      ],
    },
    {
      id: 'tashkent', country: 'uzbekistan', zh: '塔什干', en: 'Tashkent', local: 'Toshkent', at: [69.24, 41.3], marker: [69.9, 39.2],
      items: [
        { id: 'sr-plov', emoji: '🍚', zh: '手抓飯', en: 'Plov', local: 'palov', fact: '烏茲別克的手抓飯用一個大鍋煮，裡面有紅蘿蔔和羊肉，香香的！' },
        { id: 'sr-bread', emoji: '🥯', zh: '圓麵包', en: 'Non Bread', local: 'non', fact: '烏茲別克的圓麵包上面有漂亮的花紋，每一餐都會吃！' },
      ],
    },
    {
      id: 'samarkand', country: 'uzbekistan', zh: '撒馬爾罕', en: 'Samarkand', local: 'Samarqand', at: [66.96, 39.65], marker: [67.2, 37.9],
      items: [
        { id: 'sr-registan', art: 'registan', zh: '雷吉斯坦廣場', en: 'Registan', local: 'Registon', fact: '撒馬爾罕的雷吉斯坦廣場有三座古老的學校，牆上貼滿了藍色的磁磚，好漂亮！' },
        { id: 'sr-silk', emoji: '🧣', zh: '絲綢', en: 'Silk', local: 'ipak', fact: '以前的商人帶著中國的絲綢，騎著駱駝走過這裡，所以叫做「絲路」！' },
      ],
    },
    {
      id: 'bukhara', country: 'uzbekistan', zh: '布哈拉', en: 'Bukhara', local: 'Buxoro', at: [64.42, 39.77], marker: [63.6, 38.3],
      items: [
        { id: 'sr-caravan', art: 'camel', zh: '駱駝商隊', en: 'Camel Caravan', local: 'karvon', fact: '以前的商隊會在布哈拉停下來休息，駱駝背上載滿了香料和布！' },
        { id: 'sr-melon', emoji: '🍈', zh: '甜瓜', en: 'Melon', local: 'qovun', fact: '烏茲別克的甜瓜又大又甜，聞起來香香的！' },
      ],
    },
    {
      id: 'khiva', country: 'uzbekistan', zh: '希瓦', en: 'Khiva', local: 'Xiva', at: [60.36, 41.38], marker: [58.8, 40.2],
      items: [
        { id: 'sr-walls', emoji: '🏰', zh: '土黃色的古城', en: 'Ancient Walled City', local: "Ichan Qal'a", fact: '希瓦被一圈土黃色的城牆圍起來，走進去好像回到了好久好久以前！' },
        { id: 'sr-tower', emoji: '🗼', zh: '藍綠色的高塔', en: 'Kalta Minor Minaret', local: 'minora', fact: '希瓦有一座矮矮胖胖、貼滿藍綠色磁磚的塔，因為還沒蓋完就停工了！' },
      ],
    },
  ],
};
