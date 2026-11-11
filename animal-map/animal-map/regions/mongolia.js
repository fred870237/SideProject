// 🐎 蒙古之旅的資料（region.html?r=mongolia 會讀這個檔），格式見 regions/europe.js
//
// 大草原、蒙古包、戈壁沙漠、阿爾泰山
// 坐真的路線：
//   烏蘭巴托→達爾汗→額爾登特 坐真的火車（烏蘭巴托－額爾登特線，縱貫蒙古鐵路的支線）
//   額爾登特坐吉普車經過木倫到庫蘇古爾湖
//   烏蘭巴托坐吉普車到胡斯台國家公園、哈拉和林；往南經過曼達勒戈壁、達蘭扎達嘎德進戈壁沙漠
//   到特勒吉騎馬，最後一段到沙丘騎駱駝
//   烏蘭巴托坐飛機到西邊阿爾泰山的烏列蓋（住著哈薩克族的老鷹獵人，所以那一站用哈薩克語打招呼）
// 蒙古太寬，地圖又寬又扁（region.js 會自動把車站和火車放大）；國界是手畫的大概形狀，周圍的俄羅斯和中國是淡色的陸地
window.REGIONS = window.REGIONS || {};

REGIONS.mongolia = {
  id: 'mongolia',
  title: { zh: '蒙古之旅', en: 'Mongolia Trip' },
  sea: '#5fb4e8',
  landFar: '#ece6d2',
  vehicle: 'train',
  roadVehicle: 'jeep',
  lang3: 'local',
  loop: false,
  bounds: [87, 41, 120, 52.5],
  hint: '👆 點一個地方，出發去蒙古大草原！',
  doneSay: '蒙古之旅完成！你好厲害！',
  countries: [
    { id: 'mongolia', zh: '蒙古', en: 'Mongolia', color: '#b9dc9a', lang: 'mn-MN', hello: 'Сайн байна уу', flag: ['mn'],
      polys: [[
        [87.8, 49.17], [88.2, 49.5], [90.0, 50.0], [91.0, 50.4], [92.3, 50.8], [94.3, 50.55], [95.0, 49.95], [97.3, 49.75],
        [98.2, 50.4], [97.8, 51.0], [98.9, 52.1], [100.0, 51.73], [102.1, 51.45], [102.3, 50.5], [103.7, 50.1], [106.7, 50.33],
        [107.9, 49.95], [110.7, 49.15], [112.0, 49.5], [114.4, 50.25], [115.4, 49.85], [116.7, 49.85], [115.5, 48.1],
        [117.3, 47.65], [118.5, 47.98], [119.7, 47.2], [119.9, 46.7], [118.0, 46.6], [117.4, 46.6], [116.6, 46.3],
        [115.7, 45.5], [114.5, 45.4], [113.6, 44.75], [112.0, 45.1], [111.9, 43.7], [110.4, 42.8], [109.0, 42.5],
        [107.4, 42.45], [105.0, 41.6], [104.5, 41.9], [103.3, 41.9], [101.8, 42.5], [100.0, 42.65], [97.0, 42.75],
        [96.4, 42.7], [95.3, 44.0], [93.5, 45.0], [91.0, 45.2], [90.7, 45.7], [91.0, 46.6], [90.3, 47.7], [89.0, 48.0],
        [88.0, 48.6],
      ]] },
  ],
  junctions: {
    darkhan: [105.95, 49.47], erdenet: [104.06, 49.03], dalanzadgad: [104.42, 43.57],
  },
  lines: [
    { name: '火車（烏蘭巴托→達爾汗→額爾登特）', path: ['ulaanbaatar', [106.45, 48.86], 'darkhan', [104.9, 49.25], 'erdenet'] },
    { name: '吉普車（額爾登特→木倫→庫蘇古爾湖）', mode: 'road', path: ['erdenet', [103.54, 48.81], [101.6, 49.2], [100.16, 49.64], 'khovsgol'] },
    { name: '騎馬（烏蘭巴托→特勒吉）', mode: 'road', vehicle: 'horse', path: ['ulaanbaatar', 'terelj'] },
    { name: '吉普車（烏蘭巴托→胡斯台→哈拉和林）', mode: 'road', path: ['ulaanbaatar', [106.3, 47.75], 'hustai', [104.0, 47.4], 'kharkhorin'] },
    { name: '吉普車（烏蘭巴托→曼達勒戈壁→火焰崖）', mode: 'road', path: ['ulaanbaatar', [106.27, 45.76], 'dalanzadgad', 'flamingcliffs'] },
    { name: '騎駱駝（達蘭扎達嘎德→會唱歌的沙丘）', mode: 'road', vehicle: 'camel', path: ['dalanzadgad', [103.2, 43.6], 'gobi'] },
    { name: '飛機（烏蘭巴托→烏列蓋）', mode: 'air', path: ['ulaanbaatar', 'altai'] },
  ],
  stops: [
    {
      id: 'ulaanbaatar', country: 'mongolia', zh: '烏蘭巴托', en: 'Ulaanbaatar', local: 'Улаанбаатар', at: [106.92, 47.92],
      items: [
        { id: 'mn-wrestling', emoji: '🤼', zh: '那達慕摔角', en: 'Naadam Wrestling', local: 'бөх', fact: '每年夏天的那達慕大會，有摔角、賽馬和射箭三種比賽，摔角選手贏了會跳老鷹舞！' },
        { id: 'mn-archery', emoji: '🏹', zh: '射箭', en: 'Archery', local: 'сур харваа', fact: '蒙古的射箭比賽，大人小孩都可以參加，還會唱歌幫射中的人加油！' },
        { id: 'mn-buuz', emoji: '🥟', zh: '蒙古包子', en: 'Buuz Dumplings', local: 'бууз', fact: '蒙古包子裡面包著羊肉，過年的時候一家人會一起包好幾百個！' },
      ],
    },
    {
      id: 'terelj', country: 'mongolia', zh: '特勒吉', en: 'Terelj', local: 'Тэрэлж', at: [107.45, 47.98], vehicle: 'horse', marker: [109.2, 48.6],
      items: [
        { id: 'mn-ger', art: 'ger', zh: '蒙古包', en: 'Ger', local: 'гэр', fact: '蒙古包是圓圓的白色帳篷，牧人搬家的時候可以拆下來，用駱駝載著走！' },
        { id: 'mn-ride', art: 'horse', zh: '騎馬', en: 'Horse Riding', local: 'морь унах', fact: '蒙古的小朋友三四歲就會騎馬，人家說蒙古人是在馬背上長大的！' },
      ],
    },
    {
      id: 'hustai', country: 'mongolia', zh: '胡斯台國家公園', en: 'Hustai National Park', local: 'Хустай', at: [105.9, 47.62], marker: [104.7, 48.6],
      items: [
        { id: 'mn-takhi', art: 'horse', zh: '普氏野馬', en: "Przewalski's Horse", local: 'тахь', fact: '普氏野馬是世界上最後一種真正的野馬，曾經差點消失，後來又送回蒙古的草原！' },
        { id: 'mn-wolf', art: 'wolf', zh: '狼', en: 'Wolf', local: 'чоно', fact: '蒙古草原上也住著狼，牠們會在月亮下面一起嚎叫！' },
      ],
    },
    {
      id: 'kharkhorin', country: 'mongolia', zh: '哈拉和林', en: 'Kharkhorin', local: 'Хархорин', at: [102.83, 47.2],
      items: [
        { id: 'mn-monastery', emoji: '🏯', zh: '額爾德尼召', en: 'Erdene Zuu Monastery', local: 'Эрдэнэ Зуу', fact: '哈拉和林以前是成吉思汗帝國的首都，現在有一座被一百零八座白塔圍起來的寺廟！' },
        { id: 'mn-stoneturtle', emoji: '🐢', zh: '石頭烏龜', en: 'Stone Turtle', local: 'чулуун яст мэлхий', fact: '古城旁邊有好幾百年前刻的石頭大烏龜，傳說是在保護這座城市！' },
      ],
    },
    {
      id: 'khovsgol', country: 'mongolia', zh: '庫蘇古爾湖', en: 'Lake Khövsgöl', local: 'Хөвсгөл нуур', at: [100.4, 50.75],
      items: [
        { id: 'mn-reindeer', art: 'reindeer', zh: '馴鹿', en: 'Reindeer', local: 'цаа буга', fact: '湖北邊的森林裡住著騎馴鹿的查坦人，他們跟著馴鹿一起搬家！' },
        { id: 'mn-lake', emoji: '💧', zh: '藍色的大湖', en: 'Blue Lake', local: 'нуур', fact: '庫蘇古爾湖的水好清好藍，冬天結冰以後，車子可以直接開在湖面上！' },
      ],
    },
    {
      id: 'altai', country: 'mongolia', zh: '阿爾泰山', en: 'Altai Mountains', local: 'Алтай', at: [89.97, 48.97], vehicle: 'airplane',
      lang: 'kk-KZ', hello: 'Сәлем',
      items: [
        { id: 'mn-eagle', art: 'eagle', zh: '老鷹獵人', en: 'Eagle Hunters', local: 'бүркітші', fact: '阿爾泰山的哈薩克族會養金鵰，每年秋天還有老鷹節，比誰的老鷹飛得最準！' },
        { id: 'mn-snowleopard', art: 'snow-leopard', zh: '雪豹', en: 'Snow Leopard', local: 'ілбіс', fact: '高高的阿爾泰山上住著雪豹，牠的毛好厚，冬天也不怕冷！' },
        { id: 'mn-mountain', emoji: '🏔️', zh: '雪山', en: 'Snowy Peaks', local: 'тау', fact: '阿爾泰山是蒙古最高的山，山頂上一整年都有白白的冰河！' },
      ],
    },
    {
      id: 'flamingcliffs', country: 'mongolia', zh: '火焰崖', en: 'Flaming Cliffs', local: 'Баянзаг', at: [103.73, 44.14], marker: [105.0, 44.8],
      items: [
        { id: 'mn-dinoegg', emoji: '🦕', zh: '恐龍蛋化石', en: 'Dinosaur Eggs', local: 'үлэг гүрвэлийн өндөг', fact: '一百年前，科學家第一次在這裡找到恐龍蛋的化石，原來恐龍也是生蛋的！' },
        { id: 'mn-redcliff', emoji: '🌄', zh: '紅色的懸崖', en: 'Red Cliffs', local: 'улаан хад', fact: '太陽下山的時候，懸崖被照得紅紅的，看起來好像著火了一樣！' },
      ],
    },
    {
      id: 'gobi', country: 'mongolia', zh: '戈壁沙漠', en: 'Gobi Desert', local: 'Говь', at: [102.3, 43.77], vehicle: 'camel', marker: [100.9, 43.2],
      items: [
        { id: 'mn-camel', art: 'camel', zh: '雙峰駱駝', en: 'Bactrian Camel', local: 'тэмээ', fact: '戈壁的駱駝有兩個駝峰，冬天會長出長長的毛，夏天毛又一塊一塊掉下來！' },
        { id: 'mn-dunes', emoji: '🏜️', zh: '會唱歌的沙丘', en: 'Singing Dunes', local: 'Хонгорын Элс', fact: '洪戈爾沙丘好高好長，風吹過去的時候，沙子會發出「嗡嗡」像唱歌的聲音！' },
      ],
    },
  ],
};
