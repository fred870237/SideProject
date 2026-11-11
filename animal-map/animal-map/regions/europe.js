// 🏰 歐洲之旅的資料（region.html?r=europe 會讀這個檔），格式見 regions/taiwan.js、japan.js、china.js
//
// 歐洲是一趟跨國旅行：坐高鐵穿過國界，從英國一路到芬蘭的拉普蘭、義大利、西班牙
//   countries 每個國家一個顏色、國旗（不能用 emoji 國旗，Windows 10 會變方框，國旗是程式畫的）、當地的語言和「你好」
//             polys 是手畫的大概國界（給小朋友看的，不是精確的國界）；靠海的那一邊故意畫到海上，再用主地圖的陸地裁掉，海岸線才會準
//             flag: ['v', 顏色…] 直條、['h', 顏色…] 橫條、['swiss', 底色]、['nordic', 底色, 十字的顏色]、['uk']
//   lang3 'local' 到站卡片的第三種語言是那一國的語言：用當地的話打招呼、唸站名和東西（stop.local、item.local），用系統語音唸
//   bounds  要看的範圍 [西經, 南緯, 東經, 北緯]
//   lines   真的鐵路路線：歐洲之星（海底隧道）、Thalys、ICE、TGV、義大利的紅箭、瑞士的哥達隧道、北歐的火車
window.REGIONS = window.REGIONS || {};

REGIONS.europe = {
  id: 'europe',
  title: { zh: '歐洲之旅', en: 'Europe Trip' },
  sea: '#5fb4e8',
  landFar: '#cfe6b0',
  vehicle: 'high-speed-train',
  lang3: 'local',
  loop: false,
  bounds: [-10.5, 36, 31.5, 70.5],
  hint: '👆 點一個車站，坐火車穿過國界！',
  doneSay: '歐洲之旅完成！你好厲害！',
  countries: [
    { id: 'uk', zh: '英國', en: 'United Kingdom', color: '#f6a8a8', lang: 'en-GB', hello: 'Hello', flag: ['uk'],
      polys: [[[-6.0, 49.8], [1.9, 50.8], [2.0, 53.0], [0.5, 54.6], [-1.4, 56.2], [-1.3, 58.8], [-3.2, 59.4], [-5.6, 58.9], [-7.9, 57.8], [-6.6, 55.8], [-5.3, 54.7], [-5.0, 53.6], [-5.6, 52.0], [-6.0, 50.8]]] },
    { id: 'france', zh: '法國', en: 'France', color: '#9ec5f4', lang: 'fr-FR', hello: 'Bonjour', flag: ['v', '#0055A4', '#ffffff', '#EF4135'],
      polys: [
        [[-5.6, 48.4], [-4.5, 49.0], [-1.8, 49.8], [1.6, 50.3], [2.55, 51.1], [3.2, 50.7], [4.2, 50.0], [4.9, 49.8], [5.9, 49.5], [6.4, 49.45], [7.6, 49.0], [8.2, 48.95], [7.6, 47.6], [6.9, 47.4], [6.0, 46.4], [7.0, 45.9], [7.0, 44.2], [7.6, 43.8], [7.6, 43.0], [4.5, 42.9], [3.2, 42.4], [1.7, 42.5], [-0.3, 42.8], [-1.8, 43.4], [-2.6, 44.0], [-2.6, 46.5], [-3.5, 47.3], [-5.6, 47.9]],
        [[8.5, 41.3], [9.6, 41.3], [9.6, 43.1], [8.5, 42.8]],
      ] },
    { id: 'belgium', zh: '比利時', en: 'Belgium', color: '#f7dc8a', lang: 'fr-FR', hello: 'Bonjour', flag: ['v', '#000000', '#FDDA24', '#EF3340'],
      polys: [[[2.55, 51.1], [3.0, 51.5], [4.3, 51.37], [5.0, 51.48], [5.85, 51.15], [5.7, 50.75], [6.4, 50.3], [6.1, 49.9], [5.9, 49.5], [4.9, 49.8], [4.2, 50.0], [3.2, 50.7]]] },
    { id: 'netherlands', zh: '荷蘭', en: 'Netherlands', color: '#ffbf80', lang: 'nl-NL', hello: 'Hallo', flag: ['h', '#AE1C28', '#ffffff', '#21468B'],
      polys: [[[3.3, 51.4], [4.3, 51.37], [5.0, 51.48], [5.85, 51.15], [6.2, 51.4], [5.9, 51.8], [6.8, 51.9], [7.1, 52.4], [6.7, 52.6], [7.2, 53.25], [6.8, 53.8], [4.5, 53.4], [3.5, 52.0]]] },
    { id: 'germany', zh: '德國', en: 'Germany', color: '#c9b3ea', lang: 'de-DE', hello: 'Hallo', flag: ['h', '#000000', '#DD0000', '#FFCE00'],
      polys: [[[6.8, 53.8], [7.2, 53.25], [6.7, 52.6], [7.1, 52.4], [6.8, 51.9], [5.9, 51.8], [6.2, 51.4], [5.85, 51.15], [5.7, 50.75], [6.4, 50.3], [6.1, 49.9], [6.4, 49.45], [7.6, 49.0], [8.2, 48.95], [7.6, 47.6], [9.0, 47.65], [9.6, 47.5], [10.5, 47.5], [13.0, 47.5], [12.9, 47.7], [13.8, 48.6], [12.5, 49.3], [12.1, 50.3], [14.8, 50.9], [15.0, 51.1], [14.6, 52.5], [14.3, 53.3], [14.4, 54.3], [13.5, 54.8], [11.0, 54.6], [9.6, 54.9], [8.6, 54.9], [8.0, 54.5]]] },
    { id: 'denmark', zh: '丹麥', en: 'Denmark', color: '#f4b6c8', lang: 'da-DK', hello: 'Hej', flag: ['nordic', '#C8102E', '#ffffff'],
      polys: [[[8.0, 54.9], [9.6, 54.9], [10.5, 54.6], [12.6, 54.8], [12.8, 55.6], [12.6, 56.2], [10.9, 56.5], [10.6, 57.8], [8.0, 57.2], [7.9, 55.5]]] },
    { id: 'switzerland', zh: '瑞士', en: 'Switzerland', color: '#f28b8b', lang: 'de-DE', hello: 'Grüezi', flag: ['swiss', '#DA291C'],
      polys: [[[6.0, 46.4], [6.9, 47.4], [7.6, 47.6], [9.0, 47.65], [9.6, 47.5], [10.5, 46.9], [10.1, 46.2], [9.0, 45.9], [8.4, 46.3], [7.0, 45.9]]] },
    { id: 'austria', zh: '奧地利', en: 'Austria', color: '#b5e3c8', lang: 'de-DE', hello: 'Servus', flag: ['h', '#C8102E', '#ffffff', '#C8102E'],
      polys: [[[9.6, 47.5], [10.5, 47.5], [13.0, 47.5], [12.9, 47.7], [13.8, 48.6], [15.0, 49.0], [16.9, 48.7], [17.1, 48.0], [16.5, 47.0], [16.1, 46.7], [13.7, 46.5], [12.4, 46.7], [10.5, 46.9]]] },
    { id: 'italy', zh: '義大利', en: 'Italy', color: '#a6dd8f', lang: 'it-IT', hello: 'Ciao', flag: ['v', '#009246', '#ffffff', '#CE2B37'],
      polys: [
        [[7.0, 45.9], [8.4, 46.3], [9.0, 45.9], [10.1, 46.2], [10.5, 46.9], [12.4, 46.7], [13.7, 46.5], [13.7, 45.6], [12.8, 44.5], [14.5, 42.5], [16.5, 41.6], [18.8, 40.2], [18.0, 39.6], [16.7, 37.8], [15.4, 37.9], [15.8, 39.0], [13.0, 41.0], [11.5, 42.2], [10.0, 43.8], [8.5, 44.1], [7.6, 43.8], [7.0, 44.2]],
        [[12.2, 37.5], [15.8, 36.5], [15.8, 38.4], [12.3, 38.3]],
        [[8.0, 38.8], [9.9, 38.8], [9.9, 41.4], [8.0, 41.2]],
      ] },
    { id: 'spain', zh: '西班牙', en: 'Spain', color: '#ffd76b', lang: 'es-ES', hello: 'Hola', flag: ['h', '#AA151B', '#F1BF00', '#F1BF00', '#AA151B'],
      polys: [[[-9.6, 43.9], [-1.8, 43.4], [-0.3, 42.8], [1.7, 42.5], [3.4, 42.4], [3.6, 41.5], [0.9, 40.5], [0.3, 38.6], [-0.7, 37.5], [-2.2, 36.5], [-5.4, 35.8], [-6.5, 36.6], [-7.4, 37.2], [-7.0, 38.2], [-7.3, 39.5], [-6.9, 40.3], [-6.8, 41.0], [-6.2, 41.6], [-8.2, 42.0], [-8.9, 41.8], [-9.6, 42.9]]] },
    { id: 'sweden', zh: '瑞典', en: 'Sweden', color: '#9fd3ee', lang: 'sv-SE', hello: 'Hej', flag: ['nordic', '#006AA7', '#FECC00'],
      polys: [[[10.9, 56.3], [12.8, 55.3], [14.4, 55.3], [16.6, 56.2], [17.0, 57.7], [19.2, 59.5], [18.5, 60.8], [17.3, 62.5], [19.5, 63.5], [21.6, 65.0], [24.1, 65.7], [23.7, 66.8], [24.0, 67.9], [23.4, 68.0], [20.6, 69.1], [18.1, 68.2], [17.2, 67.6], [16.0, 66.6], [14.4, 65.3], [13.6, 64.6], [12.1, 63.9], [12.2, 62.5], [12.8, 61.3], [12.2, 60.2], [11.8, 59.3], [11.0, 58.9]]] },
    { id: 'norway', zh: '挪威', en: 'Norway', color: '#f9c09a', lang: 'nb-NO', hello: 'Hei', flag: ['nordic', '#BA0C2F', '#ffffff'],
      polys: [[[4.4, 58.0], [7.0, 57.7], [10.9, 58.9], [11.8, 59.3], [12.2, 60.2], [12.8, 61.3], [12.2, 62.5], [12.1, 63.9], [13.6, 64.6], [14.4, 65.3], [16.0, 66.6], [17.2, 67.6], [18.1, 68.2], [20.6, 69.1], [22.4, 68.7], [23.9, 68.8], [25.9, 69.7], [27.8, 70.1], [29.0, 69.8], [31.2, 70.3], [29.0, 71.4], [23.0, 71.4], [15.0, 69.3], [12.0, 66.7], [9.0, 64.0], [4.4, 61.6], [4.0, 59.5]]] },
    { id: 'finland', zh: '芬蘭', en: 'Finland', color: '#c4ddf7', lang: 'fi-FI', hello: 'Moi', flag: ['nordic', '#ffffff', '#002F6C'],
      polys: [[[20.8, 60.0], [24.0, 59.7], [27.8, 60.4], [29.5, 61.5], [31.5, 62.9], [29.6, 64.2], [30.2, 65.6], [29.1, 66.9], [29.3, 68.0], [28.4, 68.6], [28.9, 69.0], [27.8, 70.1], [25.9, 69.7], [23.9, 68.8], [22.4, 68.7], [20.6, 69.1], [23.4, 68.0], [24.0, 67.9], [23.7, 66.8], [24.1, 65.7], [25.0, 65.0], [21.3, 63.2]]] },
  ],
  junctions: {
    lille: [3.07, 50.63], brussels: [4.35, 50.85], cologne: [6.96, 50.94], frankfurt: [8.68, 50.11], hamburg: [9.99, 53.55],
    munich: [11.56, 48.14], basel: [7.59, 47.56], zurich: [8.54, 47.38], milan: [9.19, 45.46], copenhagen: [12.57, 55.68], stockholm: [18.07, 59.33],
  },
  lines: [
    { name: '歐洲之星（英法海底隧道）', path: ['london', [1.1, 51.1], [1.85, 50.95], 'lille', 'paris'] },
    { name: '歐洲之星（布魯塞爾、阿姆斯特丹）', path: ['lille', 'brussels', [4.48, 51.92], 'amsterdam'] },
    { name: 'ICE（阿姆斯特丹→科隆→法蘭克福）', path: ['amsterdam', [5.9, 52.0], 'cologne', 'frankfurt'] },
    { name: 'ICE（法蘭克福→柏林）', path: ['frankfurt', [9.68, 50.55], [9.5, 51.32], [9.73, 52.37], [10.79, 52.43], 'berlin'] },
    { name: 'ICE（柏林→漢堡）', path: ['berlin', [12.0, 53.0], 'hamburg'] },
    { name: 'ICE（法蘭克福→巴塞爾）', path: ['frankfurt', [8.4, 49.0], 'basel'] },
    { name: '瑞士的火車（巴塞爾→伯恩→少女峰）', path: ['basel', [7.44, 46.95], 'swiss'] },
    { name: '哥達隧道（蘇黎世→米蘭）', path: ['basel', 'zurich', [8.6, 46.6], [8.95, 46.0], 'milan'] },
    { name: '紅箭（米蘭→威尼斯）', path: ['milan', [10.22, 45.54], [10.99, 45.44], 'venice'] },
    { name: '紅箭（米蘭→羅馬）', path: ['milan', [11.34, 44.49], [11.25, 43.77], 'rome'] },
    { name: 'ICE＋Railjet（法蘭克福→慕尼黑→維也納）', path: ['frankfurt', [9.93, 49.79], [11.08, 49.45], 'munich', [13.04, 47.81], [14.29, 48.31], 'vienna'] },
    { name: 'TGV（巴黎→巴塞隆納）', path: ['paris', [4.83, 45.76], [4.36, 43.84], [3.88, 43.61], [2.9, 42.7], 'barcelona'] },
    { name: '北歐的火車（漢堡→哥本哈根→斯德哥爾摩）', path: ['hamburg', [9.4, 55.5], [10.4, 55.4], 'copenhagen', [13.0, 55.6], [13.77, 56.16], [15.62, 58.41], 'stockholm'] },
    { name: '夜車（斯德哥爾摩→拉普蘭）', path: ['stockholm', [17.3, 62.4], [20.26, 63.83], [22.15, 65.58], [24.15, 65.85], 'lapland'] },
  ],
  stops: [
    {
      id: 'london', country: 'uk', zh: '倫敦', en: 'London', local: 'London', at: [-0.13, 51.51], marker: [-2.6, 51.2],
      items: [
        { id: 'eu-bigben', art: 'big-ben', zh: '大笨鐘', en: 'Big Ben', local: 'Big Ben', fact: '大笨鐘是倫敦一座好高的鐘塔，整點會噹噹噹地響！' },
        { id: 'eu-bus', art: 'bus', zh: '雙層巴士', en: 'Double-decker Bus', local: 'double-decker bus', fact: '倫敦的巴士是紅色的雙層巴士，坐在上面那層可以看得好遠！' },
        { id: 'eu-guard', emoji: '💂', zh: '皇家衛兵', en: 'Royal Guard', local: 'Royal Guard', fact: '倫敦的皇家衛兵戴著毛茸茸的黑色高帽子，站得直直的一動也不動！' },
      ],
    },
    {
      id: 'paris', country: 'france', zh: '巴黎', en: 'Paris', local: 'Paris', at: [2.35, 48.86], marker: [0.2, 47.8],
      items: [
        { id: 'eu-eiffel', emoji: '🗼', zh: '艾菲爾鐵塔', en: 'Eiffel Tower', local: 'la tour Eiffel', fact: '艾菲爾鐵塔是用鐵做的高塔，晚上會一閃一閃地發光！' },
        { id: 'eu-croissant', emoji: '🥐', zh: '可頌', en: 'Croissant', local: 'croissant', fact: '可頌是彎彎的麵包，一層一層的，咬下去酥酥的！' },
        { id: 'eu-baguette', emoji: '🥖', zh: '法國麵包', en: 'Baguette', local: 'baguette', fact: '法國麵包長長的，像一根棒子，法國人每天都會去買！' },
      ],
    },
    {
      id: 'amsterdam', country: 'netherlands', zh: '阿姆斯特丹', en: 'Amsterdam', local: 'Amsterdam', at: [4.90, 52.37], marker: [5.6, 54.6],
      items: [
        { id: 'eu-tulip', emoji: '🌷', zh: '鬱金香', en: 'Tulip', local: 'tulp', fact: '荷蘭的春天有好大一片鬱金香花田，紅的黃的紫的像彩虹一樣！' },
        { id: 'eu-bike', art: 'bicycle', zh: '腳踏車', en: 'Bicycle', local: 'fiets', fact: '荷蘭的腳踏車比人還多，大家都騎腳踏車上學、上班！' },
        { id: 'eu-windmill', art: 'windmill', zh: '風車', en: 'Windmill', local: 'windmolen', fact: '荷蘭有很多大風車，風一吹就轉呀轉，以前用來抽水和磨麵粉！' },
      ],
    },
    {
      id: 'berlin', country: 'germany', zh: '柏林', en: 'Berlin', local: 'Berlin', at: [13.40, 52.52], marker: [15.6, 53.6],
      items: [
        { id: 'eu-pretzel', emoji: '🥨', zh: '椒鹽捲餅', en: 'Pretzel', local: 'Brezel', fact: '德國的椒鹽捲餅扭成一個結，上面撒了鹽，鹹鹹的好好吃！' },
        { id: 'eu-sausage', emoji: '🌭', zh: '香腸', en: 'Sausage', local: 'Wurst', fact: '德國有好幾百種香腸，夾在麵包裡一起吃！' },
      ],
    },
    {
      id: 'lapland', country: 'finland', zh: '拉普蘭', en: 'Lapland', local: 'Lappi', at: [25.73, 66.50],
      items: [
        { id: 'eu-reindeer', art: 'reindeer', zh: '馴鹿', en: 'Reindeer', local: 'poro', fact: '拉普蘭有好多馴鹿，冬天會拉雪橇在雪地上跑！' },
        { id: 'eu-santa', emoji: '🎅', zh: '聖誕老公公', en: 'Santa Claus', local: 'Joulupukki', fact: '聽說聖誕老公公就住在芬蘭的拉普蘭，那裡有一座聖誕老人村！' },
        { id: 'eu-aurora', emoji: '🌌', zh: '極光', en: 'Northern Lights', local: 'revontulet', fact: '冬天的晚上，天空會出現綠綠的極光，像彩帶在跳舞！' },
      ],
    },
    {
      id: 'vienna', country: 'austria', zh: '維也納', en: 'Vienna', local: 'Wien', at: [16.37, 48.21], marker: [17.6, 49.6],
      items: [
        { id: 'eu-violin', emoji: '🎻', zh: '音樂', en: 'Music', local: 'Musik', fact: '維也納是音樂之都，莫札特以前就住在這裡寫曲子！' },
        { id: 'eu-cake', emoji: '🍰', zh: '蛋糕', en: 'Cake', local: 'Torte', fact: '維也納有一種巧克力蛋糕叫沙河蛋糕，甜甜的好好吃！' },
      ],
    },
    {
      id: 'swiss', country: 'switzerland', zh: '瑞士', en: 'Switzerland', local: 'Schweiz', at: [7.86, 46.69], marker: [6.2, 45.3],
      items: [
        { id: 'eu-alps', emoji: '🏔️', zh: '阿爾卑斯山', en: 'The Alps', local: 'Alpen', fact: '瑞士的阿爾卑斯山好高，山頂一年四季都有雪，還可以坐小火車上山！' },
        { id: 'eu-cow', art: 'cow', zh: '乳牛', en: 'Cow', local: 'Kuh', fact: '瑞士的乳牛脖子上掛著大鈴鐺，走路的時候叮噹叮噹響！' },
        { id: 'eu-cheese', emoji: '🧀', zh: '起司', en: 'Cheese', local: 'Käse', fact: '瑞士的起司有好多小洞洞，還可以融化成起司鍋沾麵包吃！' },
        { id: 'eu-chocolate', emoji: '🍫', zh: '巧克力', en: 'Chocolate', local: 'Schokolade', fact: '瑞士的巧克力很有名，滑滑的、甜甜的！' },
      ],
    },
    {
      id: 'venice', country: 'italy', zh: '威尼斯', en: 'Venice', local: 'Venezia', at: [12.32, 45.44], marker: [13.8, 44.4],
      items: [
        { id: 'eu-gondola', emoji: '🛶', zh: '貢多拉', en: 'Gondola', local: 'gondola', fact: '威尼斯的路是一條一條的河，大家坐著小船「貢多拉」出門！' },
        { id: 'eu-mask', emoji: '🎭', zh: '面具', en: 'Mask', local: 'maschera', fact: '威尼斯嘉年華的時候，大家會戴上漂亮的面具上街！' },
      ],
    },
    {
      id: 'rome', country: 'italy', zh: '羅馬', en: 'Rome', local: 'Roma', at: [12.50, 41.90], marker: [11.0, 40.6],
      items: [
        { id: 'eu-colosseum', emoji: '🏟️', zh: '競技場', en: 'Colosseum', local: 'Colosseo', fact: '羅馬競技場是兩千年前蓋的，圓圓的好大，可以坐好幾萬個人！' },
        { id: 'eu-pizza', emoji: '🍕', zh: '披薩', en: 'Pizza', local: 'pizza', fact: '披薩是義大利發明的，圓圓的餅上面有番茄和起司！' },
        { id: 'eu-gelato', emoji: '🍨', zh: '義式冰淇淋', en: 'Gelato', local: 'gelato', fact: '義大利的冰淇淋叫 gelato，綿綿密密的，有好多口味！' },
      ],
    },
    {
      id: 'barcelona', country: 'spain', zh: '巴塞隆納', en: 'Barcelona', local: 'Barcelona', at: [2.17, 41.39], marker: [2.3, 39.9],
      items: [
        { id: 'eu-sagrada', emoji: '⛪', zh: '聖家堂', en: 'Sagrada Família', local: 'Sagrada Família', fact: '聖家堂的尖塔像好多根沙堡，已經蓋了一百多年還在蓋！' },
        { id: 'eu-paella', emoji: '🥘', zh: '海鮮飯', en: 'Paella', local: 'paella', fact: '西班牙海鮮飯用一個大大的平底鍋煮，黃黃的飯上面有蝦子和貝殼！' },
        { id: 'eu-flamenco', emoji: '💃', zh: '佛朗明哥舞', en: 'Flamenco', local: 'flamenco', fact: '佛朗明哥舞跳的時候會用力踏腳、拍手，裙子轉呀轉！' },
      ],
    },
  ],
};
