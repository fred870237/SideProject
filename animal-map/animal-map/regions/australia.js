// 🦘 澳洲之旅的資料（region.html?r=australia 會讀這個檔），格式見 regions/europe.js、africa.js
//
// 坐真的長途火車環遊澳洲：
//   印度洋—太平洋號（Indian Pacific）雪梨→阿德雷德→橫越納拉伯平原→伯斯
//   甘號（The Ghan）阿德雷德→愛麗絲泉→達爾文，穿過紅色的沙漠
//   東海岸的火車 雪梨→布里斯本→凱恩斯、雪梨→墨爾本、墨爾本→阿德雷德
// 愛麗絲泉到烏魯魯坐露營車（mode: 'road'），大堡礁和塔斯馬尼亞坐船（mode: 'boat'）
// 澳洲只有一個國家：countries 只有一筆（外框畫到海上，再用主地圖的陸地裁出海岸線），打招呼用澳洲人的 G'day
window.REGIONS = window.REGIONS || {};

REGIONS.australia = {
  id: 'australia',
  title: { zh: '澳洲之旅', en: 'Australia Trip' },
  sea: '#5fb4e8',
  landFar: '#cfe6b0',
  vehicle: 'train',
  roadVehicle: 'camper-van',
  lang3: 'local',
  loop: false,
  bounds: [111, -45.5, 156.5, -9.5],
  hint: '👆 點一個車站，坐火車橫越澳洲！',
  doneSay: '澳洲之旅完成！你好厲害！',
  countries: [
    { id: 'australia', zh: '澳洲', en: 'Australia', color: '#f3c27a', lang: 'en-AU', hello: "G'day", flag: ['au'],
      polys: [[[111, -12], [129, -10.2], [136.5, -10.8], [141.5, -10.5], [142.8, -10.5], [146, -13.5], [156.5, -24], [156.5, -45.5], [140, -45.5], [111, -36.5]]] },
  ],
  junctions: {
    porta: [137.77, -32.49], // 奧古斯塔港：印度洋—太平洋號和甘號在這裡分開
    alice: [133.88, -23.70], // 愛麗絲泉
    cairns: [145.77, -16.92],
    devonport: [146.36, -41.18],
  },
  lines: [
    { name: '印度洋—太平洋號（雪梨→阿德雷德）', path: ['sydney', [149.1, -33.3], [146.0, -32.2], [141.45, -31.95], [139.5, -33.2], 'adelaide'] },
    { name: '印度洋—太平洋號（阿德雷德→伯斯）', path: ['adelaide', 'porta', [135.5, -31.0], [131.0, -30.8], [125.5, -30.9], [121.47, -30.75], [118.0, -31.6], 'perth'] },
    { name: '甘號（阿德雷德→愛麗絲泉→達爾文）', path: ['porta', [134.9, -29.4], [134.4, -26.5], 'alice', [133.4, -19.6], [132.26, -14.47], 'darwin'] },
    { name: '露營車（愛麗絲泉→烏魯魯）', mode: 'road', path: ['alice', [132.3, -24.4], [131.6, -25.2], 'uluru'] },
    { name: 'XPT（雪梨→墨爾本）', path: ['sydney', [149.7, -34.5], [147.37, -35.12], [146.0, -36.3], 'melbourne'] },
    { name: '大陸號（墨爾本→阿德雷德）', path: ['melbourne', [143.85, -37.56], [141.6, -36.7], [140.3, -36.0], 'adelaide'] },
    { name: 'XPT（雪梨→布里斯本）', path: ['sydney', [151.75, -32.9], [152.9, -31.4], [153.0, -28.9], 'brisbane'] },
    { name: '昆士蘭之心號（布里斯本→凱恩斯）', path: ['brisbane', [152.6, -25.5], [150.5, -23.38], [149.18, -21.14], [146.82, -19.26], 'cairns'] },
    { name: '船（凱恩斯→大堡礁）', mode: 'boat', path: ['cairns', [146.6, -16.6], 'reef'] },
    { name: '塔斯馬尼亞精神號（墨爾本→德文港）', mode: 'boat', path: ['melbourne', [145.4, -39.4], 'devonport'] },
    { name: '露營車（德文港→荷巴特）', mode: 'road', path: ['devonport', [146.9, -42.0], 'tasmania'] },
  ],
  stops: [
    {
      id: 'sydney', country: 'australia', zh: '雪梨', en: 'Sydney', local: 'Sydney', at: [151.21, -33.87], marker: [154.2, -33.6],
      items: [
        { id: 'au-opera', art: 'opera-house', zh: '雪梨歌劇院', en: 'Sydney Opera House', fact: '雪梨歌劇院的屋頂像一片一片白色的貝殼，也像海上的帆船！' },
        { id: 'au-fireworks', emoji: '🎆', zh: '跨年煙火', en: 'Fireworks', fact: '雪梨的跨年煙火在海港大橋上放，是全世界最早迎接新年的煙火之一！' },
      ],
    },
    {
      id: 'brisbane', country: 'australia', zh: '布里斯本', en: 'Brisbane', local: 'Brisbane', at: [153.03, -27.47], marker: [155.4, -27.3],
      items: [
        { id: 'au-koala', art: 'koala', zh: '無尾熊', en: 'Koala', fact: '無尾熊只吃尤加利樹葉，一天要睡差不多二十個小時！' },
        { id: 'au-kookaburra', emoji: '🐦', zh: '笑翠鳥', en: 'Kookaburra', fact: '笑翠鳥的叫聲聽起來像人在哈哈大笑！' },
      ],
    },
    {
      id: 'reef', country: 'australia', zh: '大堡礁', en: 'Great Barrier Reef', local: 'Great Barrier Reef', at: [147.3, -16.9], marker: [150.2, -16.3], vehicle: 'ship',
      items: [
        { id: 'au-clownfish', art: 'clownfish', zh: '小丑魚', en: 'Clownfish', fact: '大堡礁是世界上最大的珊瑚礁，小丑魚住在海葵裡面！' },
        { id: 'au-turtle', art: 'sea-turtle', zh: '海龜', en: 'Sea Turtle', fact: '海龜媽媽會游回小時候出生的海灘生蛋！' },
        { id: 'au-coral', emoji: '🐠', zh: '珊瑚礁的魚', en: 'Reef Fish', fact: '珊瑚礁裡有好多五顏六色的魚，像一座海底花園！' },
      ],
    },
    {
      id: 'darwin', country: 'australia', zh: '達爾文', en: 'Darwin', local: 'Darwin', at: [130.84, -12.46], marker: [128.0, -11.2],
      items: [
        { id: 'au-croc', art: 'crocodile', zh: '鹹水鱷', en: 'Saltwater Crocodile', fact: '達爾文的河裡住著鹹水鱷，牠是世界上最大的爬蟲類！' },
        { id: 'au-lightning', emoji: '⛈️', zh: '大雷雨', en: 'Thunderstorm', fact: '達爾文的夏天常常下大雷雨，閃電一道一道好壯觀！' },
      ],
    },
    {
      id: 'uluru', country: 'australia', zh: '烏魯魯', en: 'Uluru', local: 'Uluru', at: [131.04, -25.34], marker: [127.6, -25.6], vehicle: 'camper-van',
      items: [
        { id: 'au-uluru', art: 'uluru', zh: '烏魯魯', en: 'Uluru', fact: '烏魯魯是沙漠中間一塊超級大的紅色石頭，太陽下山的時候會變成火紅色！' },
        { id: 'au-camel', art: 'camel', zh: '駱駝', en: 'Camel', fact: '澳洲的沙漠裡竟然有野生的駱駝，是以前的人帶來幫忙運貨的！' },
        { id: 'au-stars', emoji: '🌌', zh: '滿天星星', en: 'Starry Sky', fact: '沙漠的晚上好暗，可以看到滿天的星星和銀河！' },
      ],
    },
    {
      id: 'adelaide', country: 'australia', zh: '阿德雷德', en: 'Adelaide', local: 'Adelaide', at: [138.60, -34.93], marker: [136.6, -36.3],
      items: [
        { id: 'au-kangaroo', art: 'kangaroo', zh: '袋鼠', en: 'Kangaroo', fact: '阿德雷德旁邊有袋鼠島，袋鼠媽媽把寶寶放在肚子上的口袋裡！' },
        { id: 'au-grapes', emoji: '🍇', zh: '葡萄', en: 'Grapes', fact: '阿德雷德附近有好多葡萄園，一串一串的葡萄好甜！' },
      ],
    },
    {
      id: 'melbourne', country: 'australia', zh: '墨爾本', en: 'Melbourne', local: 'Melbourne', at: [144.96, -37.81], marker: [143.0, -39.6],
      items: [
        { id: 'au-penguin', art: 'penguin', zh: '小企鵝', en: 'Little Penguin', fact: '墨爾本附近的菲利普島，每天傍晚小企鵝會排隊從海裡走回家！' },
        { id: 'au-tram', emoji: '🚋', zh: '路面電車', en: 'Tram', fact: '墨爾本的路面電車叮叮叮地在街上跑，有的車廂好復古！' },
      ],
    },
    {
      id: 'tasmania', country: 'australia', zh: '塔斯馬尼亞', en: 'Tasmania', local: 'Tasmania', at: [147.33, -42.88], marker: [149.5, -42.6], vehicle: 'camper-van',
      items: [
        { id: 'au-platypus', art: 'platypus', zh: '鴨嘴獸', en: 'Platypus', fact: '鴨嘴獸有鴨子的嘴巴、會生蛋，卻是哺乳動物，好奇妙！' },
        { id: 'au-apple', emoji: '🍎', zh: '蘋果', en: 'Apple', fact: '塔斯馬尼亞種很多蘋果，所以又叫做「蘋果島」！' },
      ],
    },
    {
      id: 'perth', country: 'australia', zh: '伯斯', en: 'Perth', local: 'Perth', at: [115.86, -31.95], marker: [113.3, -33.2],
      items: [
        { id: 'au-swan', emoji: '🦢', zh: '黑天鵝', en: 'Black Swan', fact: '伯斯的天鵝是黑色的，嘴巴紅紅的，是西澳的代表動物！' },
        { id: 'au-dolphin', art: 'dolphin', zh: '海豚', en: 'Dolphin', fact: '西澳的海邊常常有海豚游到岸邊來跟人打招呼！' },
      ],
    },
  ],
};
