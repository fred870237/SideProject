// 🐯 印度之旅的資料（region.html?r=india 會讀這個檔），格式見 regions/europe.js
//
// 坐印度的火車走真的路線：
//   德里→阿格拉（Gatimaan 快車）、德里→齋浦爾→倫騰波爾、德里→孟買（Rajdhani 快車，經過科塔）
//   阿格拉→坎普爾→瓦拉納西→巴特那→新賈爾派古里，再換大吉嶺的蒸汽小火車（世界遺產，用 steam-train）
//   孟買→果亞→芒格洛爾→喀拉拉（康坎鐵路，沿著海邊）
// countries 只有印度一筆，國界是手畫的大概形狀（給小朋友看的，不是精確的國界），海岸線用主地圖的陸地裁出來
// 當地語言用印地語（Hindi），字是天城文；裝置沒有印地語的語音就不唸，只顯示
window.REGIONS = window.REGIONS || {};

REGIONS.india = {
  id: 'india',
  title: { zh: '印度之旅', en: 'India Trip' },
  sea: '#5fb4e8',
  landFar: '#e3ecd0',
  vehicle: 'train',
  roadVehicle: 'jeep',
  lang3: 'local',
  loop: false,
  bounds: [66.5, 6.5, 98, 35.5],
  hint: '👆 點一個車站，坐印度的火車出發！',
  doneSay: '印度之旅完成！你好厲害！',
  countries: [
    { id: 'india', zh: '印度', en: 'India', color: '#ffc98a', lang: 'hi-IN', hello: 'नमस्ते', flag: ['in'],
      polys: [[
        [68.3, 23.6], [69.6, 24.3], [71.0, 24.5], [70.6, 25.7], [69.6, 27.0], [70.4, 28.0], [72.0, 29.9], [73.4, 29.9], [74.6, 31.1], [74.6, 32.5],
        [74.0, 34.0], [74.3, 35.0], [77.0, 35.6], [78.3, 35.4], [79.5, 34.0], [78.8, 32.5], [79.3, 31.0], [80.2, 30.5], [81.0, 30.2],
        [80.1, 28.8], [81.2, 28.4], [83.3, 27.4], [84.6, 27.2], [85.6, 26.8], [87.0, 26.4], [88.1, 26.6], [88.2, 27.3], [88.8, 28.1],
        [88.9, 27.3], [89.8, 26.7], [92.0, 26.9], [92.1, 27.8], [94.0, 29.2], [96.0, 29.4], [97.3, 28.2], [96.6, 27.3], [95.2, 26.6],
        [94.6, 25.2], [94.2, 23.8], [93.3, 23.0], [92.6, 22.4], [92.0, 23.5], [91.6, 24.1], [92.4, 25.0], [90.0, 25.2], [89.8, 25.9],
        [88.5, 26.4], [88.1, 25.8], [88.4, 24.3], [88.7, 23.3], [89.0, 22.0], [88, 20.5], [84.5, 18.0], [82.5, 16.0], [80.5, 15.0],
        [80.6, 13.0], [80.4, 11.0], [79.9, 10.2], [79.5, 9.0], [78.5, 8.0], [77.4, 7.6], [76.3, 8.6], [74.5, 12.5], [73.3, 16.0],
        [72.5, 18.5], [72.4, 20.5], [70.5, 20.5], [68.6, 22.0], [68.0, 23.4],
      ]] },
  ],
  junctions: {
    kota: [75.83, 25.18], // Rajdhani 快車經過的科塔
    njp: [88.43, 26.71], // 新賈爾派古里：換大吉嶺小火車的地方
  },
  lines: [
    { name: 'Gatimaan 快車（德里→阿格拉）', path: ['delhi', [77.67, 27.49], 'agra'] },
    { name: '德里→齋浦爾', path: ['delhi', [76.62, 28.2], [76.6, 27.55], 'jaipur'] },
    { name: '齋浦爾→倫騰波爾', path: ['jaipur', [76.0, 26.4], 'ranthambore'] },
    { name: 'Rajdhani 快車（德里→科塔→孟買）', path: ['delhi', [77.0, 27.6], [76.4, 26.4], 'kota', [75.04, 23.33], [73.18, 22.31], [72.83, 21.17], 'mumbai'] },
    { name: '倫騰波爾→科塔', path: ['ranthambore', 'kota'] },
    { name: '阿格拉→坎普爾→瓦拉納西', path: ['agra', [79.0, 26.9], [80.33, 26.45], [81.85, 25.43], 'varanasi'] },
    { name: '瓦拉納西→巴特那→新賈爾派古里', path: ['varanasi', [85.1, 25.6], [87.0, 25.25], 'njp'] },
    { name: '大吉嶺喜馬拉雅鐵路（蒸汽小火車）', vehicle: 'steam-train', path: ['njp', [88.3, 26.9], 'darjeeling'] },
    { name: '康坎鐵路（孟買→果亞→喀拉拉）', path: ['mumbai', [73.3, 17.0], [73.95, 15.27], [74.86, 12.87], [75.78, 11.25], [76.27, 9.98], 'kerala'] },
  ],
  stops: [
    {
      id: 'delhi', country: 'india', zh: '德里', en: 'Delhi', local: 'दिल्ली', at: [77.21, 28.61], marker: [75.3, 30.4],
      items: [
        { id: 'in-curry', emoji: '🍛', zh: '咖哩', en: 'Curry', local: 'करी', fact: '印度的咖哩有好多種，用好多香料煮，香香的！' },
        { id: 'in-kite', emoji: '🪁', zh: '風箏', en: 'Kite', local: 'पतंग', fact: '印度人很愛放風箏，節日的時候天空滿滿都是彩色的風箏！' },
      ],
    },
    {
      id: 'agra', country: 'india', zh: '阿格拉', en: 'Agra', local: 'आगरा', at: [78.04, 27.18], marker: [80.0, 28.6],
      items: [
        { id: 'in-taj', art: 'taj-mahal', zh: '泰姬瑪哈陵', en: 'Taj Mahal', local: 'ताज महल', fact: '泰姬瑪哈陵是一位國王為了想念他的皇后蓋的，白白的大理石會隨著陽光變顏色！' },
        { id: 'in-kulfi', emoji: '🍨', zh: '庫爾菲冰淇淋', en: 'Kulfi', local: 'कुल्फ़ी', fact: '印度的冰淇淋叫庫爾菲，插在小棍子上，有開心果和番紅花的味道！' },
      ],
    },
    {
      id: 'jaipur', country: 'india', zh: '齋浦爾', en: 'Jaipur', local: 'जयपुर', at: [75.79, 26.91], marker: [72.4, 27.6],
      items: [
        { id: 'in-elephant', art: 'elephant', zh: '大象', en: 'Elephant', local: 'हाथी', fact: '齋浦爾的大象身上會畫上彩色的花紋，參加節慶遊行！' },
        { id: 'in-peacock', art: 'peacock', zh: '孔雀', en: 'Peacock', local: 'मोर', fact: '孔雀是印度的國鳥，下雨前公孔雀會開屏跳舞！' },
      ],
    },
    {
      id: 'ranthambore', country: 'india', zh: '倫騰波爾', en: 'Ranthambore', local: 'रणथंभौर', at: [76.45, 26.02], marker: [73.6, 24.6],
      items: [
        { id: 'in-tiger', art: 'tiger', zh: '孟加拉虎', en: 'Bengal Tiger', local: 'बाघ', fact: '倫騰波爾國家公園有野生的老虎，坐吉普車就有機會看到牠們在古堡旁邊散步！' },
        { id: 'in-monkey', art: 'macaque', zh: '猴子', en: 'Monkey', local: 'बंदर', fact: '印度到處都有猴子，會跳上屋頂和樹上找東西吃！' },
      ],
    },
    {
      id: 'varanasi', country: 'india', zh: '瓦拉納西', en: 'Varanasi', local: 'वाराणसी', at: [83.0, 25.32], marker: [82.6, 23.4],
      items: [
        { id: 'in-diya', emoji: '🪔', zh: '油燈', en: 'Oil Lamp', local: 'दीया', fact: '晚上大家會把小小的油燈放在恆河上，一盞一盞的燈火在河上漂好漂亮！' },
        { id: 'in-boat', emoji: '🛶', zh: '恆河的小船', en: 'River Boat', local: 'नाव', fact: '恆河是印度最重要的河，清晨坐小船看日出好美！' },
      ],
    },
    {
      id: 'darjeeling', country: 'india', zh: '大吉嶺', en: 'Darjeeling', local: 'दार्जिलिंग', at: [88.26, 27.04], marker: [87.8, 29.0], vehicle: 'steam-train',
      items: [
        { id: 'in-toytrain', art: 'steam-train', zh: '蒸汽小火車', en: 'Toy Train', local: 'टॉय ट्रेन', fact: '大吉嶺的小火車是一百多年前蓋的，噗噗噗地沿著山路繞圈圈往上爬！' },
        { id: 'in-tea', emoji: '🍵', zh: '紅茶', en: 'Tea', local: 'चाय', fact: '大吉嶺的山坡上種滿了茶樹，大吉嶺紅茶全世界都有名！' },
        { id: 'in-redpanda', art: 'red-panda', zh: '小貓熊', en: 'Red Panda', local: 'लाल पांडा', fact: '大吉嶺附近的森林裡住著小貓熊，喜歡在樹上睡覺！' },
      ],
    },
    {
      id: 'mumbai', country: 'india', zh: '孟買', en: 'Mumbai', local: 'मुंबई', at: [72.88, 19.08], marker: [70.4, 18.6],
      items: [
        { id: 'in-movie', emoji: '🎬', zh: '寶萊塢電影', en: 'Bollywood', local: 'बॉलीवुड', fact: '孟買的寶萊塢拍好多電影，電影裡的人常常一起唱歌跳舞！' },
        { id: 'in-train', art: 'train', zh: '通勤火車', en: 'Local Train', local: 'लोकल ट्रेन', fact: '孟買的火車好擠好擠，每天載好幾百萬人上班上學！' },
      ],
    },
    {
      id: 'kerala', country: 'india', zh: '喀拉拉', en: 'Kerala', local: 'केरल', at: [76.33, 9.5], marker: [74.3, 8.4],
      items: [
        { id: 'in-houseboat', emoji: '🛶', zh: '船屋', en: 'Houseboat', local: 'हाउसबोट', fact: '喀拉拉有好多彎彎曲曲的水道，可以住在船屋上慢慢漂！' },
        { id: 'in-coconut', emoji: '🥥', zh: '椰子', en: 'Coconut', local: 'नारियल', fact: '喀拉拉種滿了椰子樹，「喀拉拉」的意思就是椰子之地！' },
        { id: 'in-cobra', art: 'king-cobra', zh: '眼鏡王蛇', en: 'King Cobra', local: 'नागराज', fact: '喀拉拉的森林裡住著眼鏡王蛇，牠是世界上最長的毒蛇！' },
      ],
    },
  ],
};
