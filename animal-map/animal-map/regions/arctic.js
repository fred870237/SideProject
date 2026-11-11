// 🐻‍❄️ 北極探險的資料（region.html?r=arctic 會讀這個檔），格式見 regions/europe.js
//
// 坐破冰船（ship）在北極的海上探險：加拿大的邱吉爾 → 格陵蘭 → 冰島 → 挪威的斯瓦巴群島 → 一路開到北極點
//   路線是北極探險郵輪常走的航線：哈德遜灣、戴維斯海峽、丹麥海峽、格陵蘭海、北冰洋
// countries 的國界是手畫的大概形狀，靠海的那邊畫到海上，再用主地圖的陸地裁出海岸線
// 北極點不屬於任何國家，所以那一站沒有 country（卡片上只有中文和英文）
window.REGIONS = window.REGIONS || {};

REGIONS.arctic = {
  id: 'arctic',
  title: { zh: '北極探險', en: 'Arctic Expedition' },
  sea: '#7cc3ea',
  landFar: '#e6eef2',
  vehicle: 'ship',
  lang3: 'local',
  loop: false,
  bounds: [-100, 55, 36, 84],
  hint: '👆 點一個地方，坐破冰船去探險！',
  doneSay: '北極探險完成！你好厲害！',
  countries: [
    { id: 'canada', zh: '加拿大', en: 'Canada', color: '#f6c1b0', lang: 'en-CA', hello: 'Hello', flag: ['ca'],
      polys: [[[-141, 60], [-141, 70], [-120, 72], [-95, 82], [-70, 84], [-64, 82], [-62, 66], [-55, 52], [-60, 47], [-67, 45], [-75, 45], [-83, 42], [-95, 49], [-123, 49], [-130, 55], [-137, 59]]] },
    { id: 'greenland', zh: '格陵蘭', en: 'Greenland', color: '#f5f8fa', lang: 'da-DK', hello: 'Aluu', flag: ['gl'],
      polys: [[[-74, 78.2], [-66, 81], [-60, 84], [-15, 84], [-10, 75], [-20, 68], [-43, 59], [-50, 62], [-56, 70], [-72, 76]]] },
    { id: 'iceland', zh: '冰島', en: 'Iceland', color: '#b7dcf2', lang: 'is-IS', hello: 'Halló', flag: ['nordic', '#02529C', '#DC1E35', '#ffffff'],
      polys: [[[-25, 63], [-12, 63], [-12, 67], [-25, 67]]] },
    { id: 'norway', zh: '挪威', en: 'Norway', color: '#f9c09a', lang: 'nb-NO', hello: 'Hei', flag: ['nordic', '#BA0C2F', '#ffffff'],
      polys: [
        [[8, 75.5], [34, 75.5], [34, 81.5], [8, 81.5]],
        [[4.4, 58.0], [7.0, 57.7], [10.9, 58.9], [11.8, 59.3], [12.2, 60.2], [12.8, 61.3], [12.2, 62.5], [12.1, 63.9], [13.6, 64.6], [14.4, 65.3], [16.0, 66.6], [17.2, 67.6], [18.1, 68.2], [20.6, 69.1], [22.4, 68.7], [23.9, 68.8], [25.9, 69.7], [27.8, 70.1], [29.0, 69.8], [31.2, 70.3], [29.0, 71.4], [23.0, 71.4], [15.0, 69.3], [12.0, 66.7], [9.0, 64.0], [4.4, 61.6], [4.0, 59.5]],
      ] },
  ],
  lines: [
    { name: '哈德遜灣→戴維斯海峽（邱吉爾→格陵蘭）', mode: 'boat', path: ['churchill', [-88, 61], [-80, 62.5], [-70, 62], [-63, 64], [-57, 67.5], 'greenland'] },
    { name: '格陵蘭→冰島', mode: 'boat', path: ['greenland', [-56, 66], [-48, 59.5], [-40, 62], [-31, 65.2], 'iceland'] },
    { name: '冰島→斯瓦巴群島', mode: 'boat', path: ['iceland', [-14, 68], [-2, 72], [8, 75.5], 'svalbard'] },
    { name: '破冰船（斯瓦巴→北極點）', mode: 'boat', path: ['svalbard', [16, 80.5], [10, 82.5], 'northpole'] },
  ],
  stops: [
    {
      id: 'churchill', country: 'canada', zh: '邱吉爾', en: 'Churchill', local: 'Churchill', at: [-94.17, 58.77],
      items: [
        { id: 'ar-polarbear', art: 'polar-bear', zh: '北極熊', en: 'Polar Bear', fact: '加拿大的邱吉爾被叫做「北極熊之都」，秋天北極熊會走到海邊等海水結冰！' },
        { id: 'ar-beluga', art: 'whale', zh: '白鯨', en: 'Beluga Whale', fact: '夏天會有好幾千隻白白的白鯨游進河口，牠們會吹口哨一樣唱歌！' },
        { id: 'ar-snowyowl', art: 'snowy-owl', zh: '雪鴞', en: 'Snowy Owl', fact: '雪鴞是白白的貓頭鷹，在雪地裡幾乎看不見！' },
      ],
    },
    {
      id: 'greenland', country: 'greenland', zh: '格陵蘭', en: 'Greenland', local: 'Kalaallit Nunaat', at: [-51.1, 69.2], marker: [-62.0, 71.5],
      items: [
        { id: 'ar-iceberg', emoji: '🧊', zh: '大冰山', en: 'Iceberg', local: 'iluliaq', fact: '格陵蘭的冰河會掉下好大好大的冰山，像一座座漂在海上的白色城堡！' },
        { id: 'ar-narwhal', art: 'narwhal', zh: '獨角鯨', en: 'Narwhal', local: 'qilalugaq qernertaq', fact: '獨角鯨頭上有一根長長的角，其實是牠的一顆牙齒！' },
        { id: 'ar-sled', art: 'dog', zh: '雪橇犬', en: 'Sled Dog', local: 'qimmeq', fact: '在格陵蘭，雪橇犬會拉著雪橇在冰上跑，是大家的好幫手！' },
      ],
    },
    {
      id: 'iceland', country: 'iceland', zh: '冰島', en: 'Iceland', local: 'Ísland', at: [-21.9, 64.15], marker: [-28.5, 61.6],
      items: [
        { id: 'ar-puffin', art: 'puffin', zh: '海鸚', en: 'Puffin', local: 'lundi', fact: '海鸚的嘴巴是彩色的，嘴裡可以一次叼好多條小魚！' },
        { id: 'ar-aurora', emoji: '🌌', zh: '極光', en: 'Northern Lights', local: 'norðurljós', fact: '冰島冬天的晚上，天空會出現綠綠的極光，在天上飄來飄去！' },
        { id: 'ar-geyser', emoji: '♨️', zh: '間歇泉', en: 'Geyser', local: 'goshver', fact: '冰島的間歇泉每隔幾分鐘就會從地底噴出好高的熱水！' },
      ],
    },
    {
      id: 'svalbard', country: 'norway', zh: '斯瓦巴群島', en: 'Svalbard', local: 'Svalbard', at: [15.6, 78.2], marker: [26.0, 77.0],
      items: [
        { id: 'ar-walrus', art: 'walrus', zh: '海象', en: 'Walrus', local: 'hvalross', fact: '海象有兩根長長的白牙，會用牙齒勾住冰塊把自己拉上岸！' },
        { id: 'ar-arcticfox', art: 'arctic-fox', zh: '北極狐', en: 'Arctic Fox', local: 'fjellrev', fact: '北極狐冬天的毛是白色的，夏天會換成咖啡色！' },
        { id: 'ar-reindeer', art: 'reindeer', zh: '斯瓦巴馴鹿', en: 'Svalbard Reindeer', local: 'reinsdyr', fact: '斯瓦巴的馴鹿腿短短的、毛厚厚的，是世界上最小的馴鹿！' },
      ],
    },
    {
      id: 'northpole', zh: '北極點', en: 'North Pole', at: [0, 87.5], vehicle: 'ship',
      icon: { emoji: '🧭' },
      items: [
        { id: 'ar-pole', emoji: '🧭', zh: '北極點', en: 'North Pole', fact: '北極點是地球最北邊的地方，站在這裡往哪邊走都是往南！' },
        { id: 'ar-seaice', emoji: '🧊', zh: '海冰', en: 'Sea Ice', fact: '北極點沒有陸地，腳下是海水結成的一大片冰，破冰船要把冰撞開才能前進！' },
        { id: 'ar-seal', art: 'seal', zh: '海豹', en: 'Seal', fact: '海豹會在冰上挖一個洞，從洞裡探出頭來呼吸！' },
      ],
    },
  ],
};
