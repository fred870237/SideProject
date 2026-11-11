// 🍁 加拿大之旅的資料（region.html?r=canada 會讀這個檔），格式見 regions/europe.js
//
// 坐加拿大的火車走真的路線：
//   VIA 鐵路「加拿大人號」多倫多→薩德伯里→溫尼伯→埃德蒙頓→賈斯珀→甘露市→溫哥華（橫越整個加拿大）
//   洛磯山登山者號 甘露市→露易絲湖→班夫
//   哈德遜灣號 溫尼伯→帕斯→湯普森→邱吉爾（去看北極熊）
//   魁北克—溫莎走廊 多倫多→京士頓→蒙特婁→魁北克市；多倫多→尼加拉瀑布
// 多倫多到阿岡昆公園坐露營車（mode: 'road'）
// 加拿大說英文和法文：魁北克那一站用法文打招呼（stop.hello、stop.lang 會蓋過國家的設定）
window.REGIONS = window.REGIONS || {};

REGIONS.canada = {
  id: 'canada',
  title: { zh: '加拿大之旅', en: 'Canada Trip' },
  sea: '#5fb4e8',
  landFar: '#e3ecd6',
  vehicle: 'train',
  roadVehicle: 'camper-van',
  lang3: 'local',
  loop: false,
  bounds: [-127, 41.8, -66, 60],
  hint: '👆 點一個車站，坐火車橫越加拿大！',
  doneSay: '加拿大之旅完成！你好厲害！',
  countries: [
    { id: 'canada', zh: '加拿大', en: 'Canada', color: '#f6c1b0', lang: 'en-CA', hello: 'Hello', flag: ['ca'],
      polys: [[[-141, 60], [-141, 70], [-120, 72], [-95, 82], [-70, 84], [-64, 82], [-62, 66], [-55, 52], [-60, 47], [-67, 45], [-67.8, 47.1], [-69.2, 47.45], [-70.0, 46.7], [-71.5, 45.0], [-75.0, 44.9], [-76.5, 44.2], [-79.0, 43.3], [-79.0, 42.8], [-82.5, 42.6], [-82.4, 45.3], [-84.8, 46.9], [-89.6, 48.0], [-94.8, 49.3], [-95.15, 49.0], [-123.0, 49.0], [-123.3, 48.2], [-125.5, 48.2], [-130, 54.5], [-137, 59]]] },
  ],
  junctions: {
    winnipeg: [-97.14, 49.9],
    kamloops: [-120.33, 50.67],
    montreal: [-73.57, 45.5],
  },
  lines: [
    { name: '加拿大人號（多倫多→溫尼伯）', path: ['toronto', [-79.6, 44.4], [-81.0, 46.5], [-84.5, 47.9], [-89.2, 49.8], [-94.0, 49.8], 'winnipeg'] },
    { name: '加拿大人號（溫尼伯→賈斯珀）', path: ['winnipeg', [-101.0, 50.9], [-106.67, 52.13], [-113.49, 53.55], [-116.0, 53.3], 'jasper'] },
    { name: '加拿大人號（賈斯珀→溫哥華）', path: ['jasper', [-119.1, 52.3], 'kamloops', [-121.6, 49.4], 'vancouver'] },
    { name: '洛磯山登山者號（甘露市→班夫）', path: ['kamloops', [-118.2, 51.0], [-116.2, 51.42], 'banff'] },
    { name: '哈德遜灣號（溫尼伯→邱吉爾）', path: ['winnipeg', [-100.8, 53.83], [-97.85, 55.74], [-95.5, 57.5], 'churchill'] },
    { name: '魁北克—溫莎走廊（多倫多→蒙特婁→魁北克市）', path: ['toronto', [-76.48, 44.23], 'montreal', [-72.5, 46.2], 'quebec'] },
    { name: '多倫多→尼加拉瀑布', path: ['toronto', [-79.7, 43.3], 'niagara'] },
    { name: '露營車（多倫多→阿岡昆公園）', mode: 'road', path: ['toronto', [-79.5, 44.5], [-79.2, 45.3], 'algonquin'] },
  ],
  stops: [
    {
      id: 'vancouver', country: 'canada', zh: '溫哥華', en: 'Vancouver', local: 'Vancouver', at: [-123.12, 49.28], marker: [-125.6, 50.4],
      items: [
        { id: 'ca-orca', art: 'orca', zh: '虎鯨', en: 'Orca', local: 'orca', fact: '溫哥華外面的海裡有一群一群的虎鯨，常常一起跳出水面！' },
        { id: 'ca-otter', art: 'sea-otter', zh: '海獺', en: 'Sea Otter', local: 'sea otter', fact: '海獺睡覺的時候會手牽手，才不會被海浪沖走！' },
      ],
    },
    {
      id: 'banff', country: 'canada', zh: '班夫', en: 'Banff', local: 'Banff', at: [-115.57, 51.18], marker: [-114.2, 50.0],
      items: [
        { id: 'ca-rockies', emoji: '🏔️', zh: '洛磯山脈', en: 'Rocky Mountains', local: 'Rocky Mountains', fact: '洛磯山脈好高好壯觀，山腳下的湖水是漂亮的藍綠色！' },
        { id: 'ca-moose', art: 'moose', zh: '駝鹿', en: 'Moose', local: 'moose', fact: '駝鹿是世界上最大的鹿，頭上的角像兩把大扇子！' },
      ],
    },
    {
      id: 'jasper', country: 'canada', zh: '賈斯珀', en: 'Jasper', local: 'Jasper', at: [-118.08, 52.87], marker: [-120.6, 54.4],
      items: [
        { id: 'ca-grizzly', art: 'brown-bear', zh: '灰熊', en: 'Grizzly Bear', local: 'grizzly bear', fact: '賈斯珀國家公園的灰熊秋天會一直吃，把自己吃胖胖的準備冬眠！' },
        { id: 'ca-icefield', emoji: '🧊', zh: '哥倫比亞冰原', en: 'Columbia Icefield', local: 'icefield', fact: '賈斯珀旁邊有一大片冰原，可以坐有大輪子的雪車開上冰河！' },
      ],
    },
    {
      id: 'churchill', country: 'canada', zh: '邱吉爾', en: 'Churchill', local: 'Churchill', at: [-94.17, 58.77], marker: [-91.5, 57.4],
      items: [
        { id: 'ca-polarbear', art: 'polar-bear', zh: '北極熊', en: 'Polar Bear', local: 'polar bear', fact: '坐兩天的火車到邱吉爾，秋天可以看到北極熊在海邊等海水結冰！' },
        { id: 'ca-beluga', art: 'whale', zh: '白鯨', en: 'Beluga Whale', local: 'beluga', fact: '夏天會有好幾千隻白鯨游進邱吉爾的河口！' },
      ],
    },
    {
      id: 'algonquin', country: 'canada', zh: '阿岡昆公園', en: 'Algonquin Park', local: 'Algonquin Park', at: [-78.3, 45.55], vehicle: 'camper-van', marker: [-78.6, 47.4],
      items: [
        { id: 'ca-beaver', art: 'beaver', zh: '海狸', en: 'Beaver', local: 'beaver', fact: '海狸是加拿大的國家動物，會用牙齒咬樹枝在河上蓋水壩！' },
        { id: 'ca-canoe', emoji: '🛶', zh: '獨木舟', en: 'Canoe', local: 'canoe', fact: '在阿岡昆公園可以划獨木舟，在安靜的湖上看駝鹿喝水！' },
        { id: 'ca-maple', emoji: '🍁', zh: '紅楓葉', en: 'Maple Leaves', local: 'maple leaves', fact: '秋天整片森林的楓葉都變紅了，楓葉也畫在加拿大的國旗上！' },
      ],
    },
    {
      id: 'toronto', country: 'canada', zh: '多倫多', en: 'Toronto', local: 'Toronto', at: [-79.38, 43.65], marker: [-81.6, 44.6],
      items: [
        { id: 'ca-cntower', emoji: '🗼', zh: 'CN 塔', en: 'CN Tower', local: 'CN Tower', fact: '多倫多的 CN 塔好高好高，上面還有透明的玻璃地板可以往下看！' },
        { id: 'ca-raccoon', art: 'raccoon', zh: '浣熊', en: 'Raccoon', local: 'raccoon', fact: '多倫多的浣熊好多，晚上會偷偷打開垃圾桶找東西吃！' },
      ],
    },
    {
      id: 'niagara', country: 'canada', zh: '尼加拉瀑布', en: 'Niagara Falls', local: 'Niagara Falls', at: [-79.07, 43.08], marker: [-78.2, 41.95],
      items: [
        { id: 'ca-falls', art: 'waterfall', zh: '尼加拉瀑布', en: 'Niagara Falls', local: 'Niagara Falls', fact: '尼加拉瀑布的水好大好大，可以坐船開到瀑布下面，全身都會被噴濕！' },
        { id: 'ca-rainbow', emoji: '🌈', zh: '彩虹', en: 'Rainbow', local: 'rainbow', fact: '瀑布噴出的水霧在太陽下常常出現彩虹！' },
      ],
    },
    {
      id: 'quebec', country: 'canada', zh: '魁北克市', en: 'Québec City', local: 'Québec', hello: 'Bonjour', lang: 'fr-CA', at: [-71.21, 46.81], marker: [-69.4, 48.4],
      items: [
        { id: 'ca-castle', emoji: '🏰', zh: '城堡飯店', en: 'Château Frontenac', local: 'château', fact: '魁北克市有一座像城堡一樣的大飯店，城市裡的人說法文！' },
        { id: 'ca-syrup', emoji: '🥞', zh: '楓糖漿', en: 'Maple Syrup', local: "sirop d'érable", fact: '魁北克做的楓糖漿全世界最多，淋在鬆餅上甜甜的！' },
      ],
    },
  ],
};
