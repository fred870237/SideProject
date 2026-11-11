// 🏔️ 喜馬拉雅山之旅的資料（region.html?r=himalaya 會讀這個檔），格式見 regions/europe.js
//
// 尼泊爾和不丹：世界最高的山、犛牛、犀牛、小熊貓、懸崖上的虎穴寺
// 坐真的路線（這兩個國家幾乎沒有火車，大家都坐巴士和小飛機）：
//   加德滿都坐觀光巴士走普里特維公路，到穆格林分開：往西到博卡拉，往南經過納拉揚加爾到奇特旺
//   納拉揚加爾再坐巴士往西，經過布特瓦爾到藍毗尼
//   加德滿都坐小飛機到盧卡拉（跑道好短的山上機場），再跟著犛牛走山路，經過南崎巴札到聖母峰基地營
//   加德滿都坐不丹皇家航空飛到帕羅，再坐車到廷布，翻過都楚拉山口到普那卡
// 地圖又寬又扁；國界是手畫的大概形狀，周圍的印度和中國是淡色的陸地
// 不丹宗卡語的系統語音和字型不一定有，所以不丹的字用羅馬拼音
window.REGIONS = window.REGIONS || {};

REGIONS.himalaya = {
  id: 'himalaya',
  title: { zh: '喜馬拉雅山之旅', en: 'Himalaya Trip' },
  sea: '#5fb4e8',
  landFar: '#ece6d2',
  vehicle: 'bus',
  roadVehicle: 'bus',
  lang3: 'local',
  loop: false,
  bounds: [79.6, 25.4, 92.6, 30.8],
  hint: '👆 點一個地方，出發去世界最高的山！',
  doneSay: '喜馬拉雅山之旅完成！你好厲害！',
  countries: [
    { id: 'nepal', zh: '尼泊爾', en: 'Nepal', color: '#b9dc9a', lang: 'ne-NP', hello: 'नमस्ते', flag: ['np'],
      polys: [[
        [80.06, 28.84], [80.25, 29.5], [80.6, 30.0], [81.1, 30.4], [81.6, 30.4], [82.2, 30.1], [82.8, 29.7], [83.4, 29.3],
        [84.1, 29.3], [84.5, 28.8], [85.2, 28.6], [85.8, 28.2], [86.1, 27.95], [86.6, 28.1], [86.93, 28.05], [87.2, 27.85],
        [88.1, 27.9], [88.2, 27.3], [88.0, 26.7], [88.0, 26.4], [87.3, 26.35], [86.6, 26.45], [86.0, 26.6], [85.3, 26.8],
        [84.8, 27.0], [84.1, 27.45], [83.4, 27.35], [82.7, 27.5], [81.9, 27.85], [81.0, 28.4], [80.5, 28.6],
      ]] },
    { id: 'bhutan', zh: '不丹', en: 'Bhutan', color: '#f6d58a', lang: 'dz-BT', hello: 'Kuzuzangpo la', flag: ['bt'],
      polys: [[
        [88.75, 26.95], [88.8, 27.3], [89.0, 27.5], [89.2, 27.75], [89.5, 28.1], [89.6, 28.2], [90.3, 28.2], [90.8, 28.05],
        [91.4, 27.95], [91.65, 27.75], [92.1, 27.5], [92.1, 26.85], [91.5, 26.8], [90.4, 26.8], [89.8, 26.72], [89.1, 26.85],
      ]] },
  ],
  junctions: {
    mugling: [84.56, 27.86], narayanghat: [84.43, 27.7], lukla: [86.73, 27.69],
  },
  lines: [
    { name: '觀光巴士（加德滿都→穆格林→博卡拉）', mode: 'road', path: ['kathmandu', [85.0, 27.85], 'mugling', [84.25, 28.0], 'pokhara'] },
    { name: '巴士（穆格林→納拉揚加爾→奇特旺）', mode: 'road', path: ['mugling', 'narayanghat', 'chitwan'] },
    { name: '巴士（納拉揚加爾→布特瓦爾→藍毗尼）', mode: 'road', path: ['narayanghat', [83.9, 27.62], [83.45, 27.7], 'lumbini'] },
    { name: '小飛機（加德滿都→盧卡拉）', mode: 'air', path: ['kathmandu', 'lukla'] },
    { name: '跟著犛牛走山路（盧卡拉→南崎巴札→聖母峰基地營）', mode: 'road', vehicle: 'yak', path: ['lukla', [86.71, 27.8], [86.8, 27.9], 'everest'] },
    { name: '飛機（加德滿都→帕羅）', mode: 'air', path: ['kathmandu', 'paro'] },
    { name: '坐車（帕羅→廷布→都楚拉山口→普那卡）', mode: 'road', vehicle: 'car', path: ['paro', [89.55, 27.4], 'thimphu', [89.75, 27.49], [89.82, 27.55], 'punakha'] },
  ],
  stops: [
    {
      id: 'kathmandu', country: 'nepal', zh: '加德滿都', en: 'Kathmandu', local: 'काठमाडौं', at: [85.32, 27.71],
      items: [
        { id: 'np-stupa', art: 'stupa', zh: '博達佛塔', en: 'Boudhanath Stupa', local: 'बौद्धनाथ', fact: '白白的大佛塔上畫著一雙大眼睛，好像在看著四面八方，大家會繞著佛塔走一圈！' },
        { id: 'np-monkey', art: 'macaque', zh: '猴子廟', en: 'Monkey Temple', local: 'स्वयम्भू', fact: '小山丘上的斯瓦揚布寺住著好多猴子，所以大家都叫它猴子廟！' },
        { id: 'np-momo', emoji: '🥟', zh: '饃饃', en: 'Momo', local: 'मःमः', fact: '尼泊爾的饃饃很像小籠包，沾著辣辣的番茄醬一起吃！' },
      ],
    },
    {
      id: 'pokhara', country: 'nepal', zh: '博卡拉', en: 'Pokhara', local: 'पोखरा', at: [83.98, 28.21],
      items: [
        { id: 'np-fishtail', emoji: '🏔️', zh: '魚尾峰', en: 'Machapuchare', local: 'माछापुच्छ्रे', fact: '魚尾峰的山頂分成兩個尖尖，好像魚的尾巴！它是神聖的山，大家都不爬上去。' },
        { id: 'np-paraglide', emoji: '🪂', zh: '飛行傘', en: 'Paragliding', local: 'प्याराग्लाइडिङ', fact: '博卡拉的天空飛著好多飛行傘，從上面可以看到藍藍的湖和白白的雪山！' },
        { id: 'np-lake', emoji: '🛶', zh: '費瓦湖划船', en: 'Phewa Lake', local: 'फेवा ताल', fact: '坐上彩色的小木船划到湖中間，還可以去小島上的寺廟拜拜！' },
      ],
    },
    {
      id: 'chitwan', country: 'nepal', zh: '奇特旺國家公園', en: 'Chitwan National Park', local: 'चितवन', at: [84.45, 27.55], vehicle: 'jeep',
      items: [
        { id: 'np-rhino', art: 'rhino', zh: '獨角犀牛', en: 'One-horned Rhino', local: 'गैंडा', fact: '奇特旺的犀牛只有一支角，牠們最喜歡在泥巴裡泡澡！' },
        { id: 'np-tiger', art: 'tiger', zh: '孟加拉虎', en: 'Bengal Tiger', local: 'बाघ', fact: '老虎躲在高高的草叢裡，身上的條紋讓牠很難被看到！' },
        { id: 'np-elephant', art: 'elephant', zh: '大象', en: 'Elephant', local: 'हात्ती', fact: '這裡的大象會幫忙巡邏森林，保護犀牛不被壞人抓走！' },
        { id: 'np-gharial', art: 'crocodile', zh: '長吻鱷', en: 'Gharial', local: 'घडियाल', fact: '長吻鱷的嘴巴又細又長，專門用來抓河裡的魚！' },
      ],
    },
    {
      id: 'lumbini', country: 'nepal', zh: '藍毗尼', en: 'Lumbini', local: 'लुम्बिनी', at: [83.28, 27.48],
      items: [
        { id: 'np-buddha', emoji: '🌳', zh: '佛陀出生的地方', en: 'Birthplace of Buddha', local: 'मायादेवी मन्दिर', fact: '兩千五百多年前，佛陀的媽媽在一棵大樹下生下了他，就是在這裡！' },
        { id: 'np-peacock', art: 'peacock', zh: '孔雀', en: 'Peacock', local: 'मयूर', fact: '藍毗尼的花園裡常常看到孔雀，開屏的時候尾巴好漂亮！' },
      ],
    },
    {
      id: 'everest', country: 'nepal', zh: '聖母峰', en: 'Mount Everest', local: 'सगरमाथा', at: [86.86, 27.99], vehicle: 'yak',
      items: [
        { id: 'np-everest', emoji: '🏔️', zh: '世界最高的山', en: 'Highest Mountain', local: 'सगरमाथा', fact: '聖母峰有八千八百多公尺高，比十七棟台北101疊起來還要高！' },
        { id: 'np-yak', art: 'yak', zh: '犛牛', en: 'Yak', local: 'याक', fact: '犛牛的毛又長又厚，不怕冷，還會幫登山的人背好重的行李！' },
        { id: 'np-lukla', emoji: '✈️', zh: '盧卡拉小機場', en: 'Lukla Airport', local: 'लुक्ला', fact: '去聖母峰要先坐小飛機，降落在山坡上一條好短好短的跑道！' },
      ],
    },
    {
      id: 'paro', country: 'bhutan', zh: '帕羅', en: 'Paro', local: 'Paro', at: [89.42, 27.43], vehicle: 'airplane', marker: [88.95, 26.75],
      items: [
        { id: 'bt-tigersnest', art: 'tigers-nest', zh: '虎穴寺', en: "Tiger's Nest", local: 'Taktsang', fact: '虎穴寺蓋在好高好高的懸崖上，傳說有一位大師騎著老虎飛到這裡！' },
        { id: 'bt-archery', emoji: '🏹', zh: '射箭', en: 'Archery', local: 'Datse', fact: '射箭是不丹的國家運動，靶子放得好遠，射中了大家會一起唱歌跳舞！' },
        { id: 'bt-chili', emoji: '🌶️', zh: '辣椒起司', en: 'Ema Datshi', local: 'Ema Datshi', fact: '不丹人把辣椒當成蔬菜吃，最有名的菜就是辣椒煮起司！' },
      ],
    },
    {
      id: 'thimphu', country: 'bhutan', zh: '廷布', en: 'Thimphu', local: 'Thimphu', at: [89.64, 27.47],
      items: [
        { id: 'bt-takin', art: 'takin', zh: '羚牛', en: 'Takin', local: 'Dong Gyem Tsey', fact: '羚牛是不丹的國寶動物，長得好像牛和山羊混在一起，傳說是一位大師變出來的！' },
        { id: 'bt-traffic', emoji: '👮', zh: '沒有紅綠燈', en: 'No Traffic Lights', local: 'Thimphu', fact: '廷布是沒有紅綠燈的首都，路口站著警察，用手勢指揮車子！' },
        { id: 'bt-buddha', emoji: '🛕', zh: '大金佛', en: 'Buddha Dordenma', local: 'Buddha Dordenma', fact: '廷布的山上有一尊好大的金色佛像，有十七層樓那麼高！' },
      ],
    },
    {
      id: 'punakha', country: 'bhutan', zh: '普那卡', en: 'Punakha', local: 'Punakha', at: [89.86, 27.58], vehicle: 'car', marker: [90.35, 27.95],
      items: [
        { id: 'bt-dzong', emoji: '🏯', zh: '普那卡宗', en: 'Punakha Dzong', local: 'Punakha Dzong', fact: '普那卡宗蓋在兩條河會合的地方，春天開滿紫色的花，好像一座城堡！' },
        { id: 'bt-redpanda', art: 'red-panda', zh: '小熊貓', en: 'Red Panda', local: 'Aamchu Donkha', fact: '翻過都楚拉山口，森林裡住著小熊貓，牠的尾巴毛茸茸，有一圈一圈的條紋！' },
      ],
    },
  ],
};
