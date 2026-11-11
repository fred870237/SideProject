// 🐼 中國之旅的資料（region.html?r=china 會讀這個檔），格式見 regions/taiwan.js 和 regions/japan.js
//
// 主世界地圖的資料只有海岸線、沒有國界，所以中國的外框是照地圖手畫的大概形狀（給小朋友看的，不是精確的國界）
// 坐高鐵；第三種語言 'none'：只有中文和英文
// lines 是真的鐵路路線，照「八縱八橫」高鐵網畫主要的幾條（敦煌、西藏是一般鐵路），火車照著路線開，兩站之間走最短的那條：
//   縱：京哈、京滬、京港澳（京廣）、沿海通道、京昆（西成＋成昆）、蘭廣（蘭渝＋渝貴＋貴廣）
//   橫：陸橋（徐蘭＋蘭新）、沿江、滬昆、廈渝、廣昆、青銀（膠濟）
// junctions 是沒有停站、但路線在那裡交會的大城市（鄭州、蘭州、濟南…）
window.REGIONS = window.REGIONS || {};

REGIONS.china = {
  id: 'china',
  title: { zh: '中國之旅', en: 'China Trip' },
  sea: '#5fb4e8',
  land: '#f4d27a',
  vehicle: 'high-speed-train',
  lang3: 'none',
  loop: false,
  hint: '👆 點一個車站，搭高鐵出發！',
  doneSay: '中國之旅完成！你好厲害！',
  islands: [
    // 中國大陸（從遼東半島順時針往南沿著海岸，再沿著西南、西邊、北邊的國界繞回來）
    [
      [124.3, 39.9], [122.2, 40.5], [121.2, 39.0], [121.0, 40.8], [119.6, 39.9], [118.0, 39.2], [117.7, 38.6],
      [118.9, 37.4], [120.7, 37.8], [122.5, 37.3], [120.3, 36.0], [119.2, 34.8], [120.8, 33.0], [121.9, 31.7],
      [121.9, 30.8], [121.9, 29.9], [121.4, 28.3], [120.6, 27.3], [119.6, 26.0], [118.6, 24.6], [117.6, 23.7],
      [116.4, 22.9], [114.3, 22.4], [113.5, 22.2], [111.9, 21.6], [110.4, 21.2], [110.2, 20.4], [109.7, 21.4],
      [108.5, 21.6], [107.0, 22.5], [105.4, 23.3], [103.9, 22.6], [102.3, 22.4], [101.6, 21.2], [100.2, 21.5],
      [99.3, 22.1], [98.7, 24.1], [97.6, 23.9], [97.7, 25.3], [98.7, 27.5], [97.5, 28.3], [96.0, 29.4],
      [94.0, 29.0], [92.0, 27.8], [89.0, 27.9], [86.0, 27.9], [84.0, 28.6], [82.0, 30.0], [80.3, 30.7],
      [79.0, 32.5], [78.5, 34.5], [77.8, 35.5], [75.5, 36.5], [74.0, 38.5], [73.6, 39.5], [74.9, 40.5],
      [76.6, 40.6], [78.0, 41.1], [80.2, 42.2], [80.8, 45.0], [82.5, 45.4], [83.0, 47.2], [85.5, 47.1],
      [86.9, 48.9], [87.8, 49.2], [89.0, 48.0], [90.7, 46.0], [93.0, 45.0], [96.4, 42.8], [100.0, 42.6],
      [105.0, 41.6], [107.5, 42.4], [110.4, 42.8], [111.9, 43.7], [111.4, 44.4], [113.6, 44.8], [116.0, 45.7],
      [118.5, 46.8], [119.7, 47.2], [117.4, 47.7], [116.5, 49.8], [119.0, 50.3], [120.0, 51.6], [121.0, 53.3],
      [123.0, 53.5], [125.5, 52.7], [126.5, 51.8], [127.5, 49.8], [130.0, 48.9], [131.0, 47.7], [133.0, 48.1],
      [134.7, 48.3], [133.1, 45.1], [131.0, 44.8], [131.3, 43.0], [130.6, 42.4], [129.6, 42.4], [128.1, 41.6],
      [126.5, 41.0], [125.0, 40.3],
    ],
    // 海南島
    [[108.6, 19.2], [109.2, 18.3], [110.1, 18.2], [111.0, 19.6], [110.6, 20.1], [109.6, 20.0], [108.7, 19.6]],
  ],
  junctions: {
    zhengzhou: [113.65, 34.75], changsha: [112.94, 28.23], lanzhou: [103.83, 36.06], guiyang: [106.63, 26.65],
    jinan: [117.00, 36.65], shenzhen: [114.06, 22.54], liuyuan: [95.40, 41.00],
  },
  lines: [
    { name: '京哈高鐵', path: ['beijing', [117.94, 40.95], [120.45, 41.57], [123.43, 41.80], [125.32, 43.82], 'harbin'] },
    { name: '京張高鐵・張呼高鐵', path: ['beijing', [115.90, 40.45], [114.88, 40.77], [113.13, 41.00], 'mongolia'] },
    { name: '京滬高鐵', path: ['beijing', [117.20, 39.13], 'jinan', [117.20, 34.26], [118.80, 32.06], 'shanghai'] },
    { name: '京廣高鐵', path: ['beijing', [114.50, 38.04], 'zhengzhou', 'wuhan', 'changsha', 'guangzhou'] },
    { name: '徐蘭高鐵', path: ['zhengzhou', [112.45, 34.62], 'xian', [107.14, 34.36], [105.72, 34.58], 'lanzhou'] },
    { name: '蘭新高鐵（蘭州→烏魯木齊）', path: ['lanzhou', [102.64, 37.93], [100.45, 38.93], [98.29, 39.77], 'liuyuan', [93.50, 42.80], [89.20, 42.95], 'urumqi'] },
    { name: '敦煌鐵路（柳園→敦煌）', path: ['liuyuan', 'dunhuang'] },
    { name: '青藏鐵路', path: ['lanzhou', [101.78, 36.62], [97.37, 37.37], [94.90, 36.40], [92.40, 34.20], [92.05, 31.48], 'tibet'] },
    { name: '西成高鐵', path: ['xian', [107.03, 33.07], [105.84, 32.44], 'chengdu'] },
    { name: '成貴高鐵', path: ['chengdu', [104.60, 28.77], 'guiyang'] },
    { name: '貴廣高鐵', path: ['guiyang', [108.30, 25.95], 'guilin', [111.30, 24.40], 'guangzhou'] },
    { name: '滬昆高鐵', path: ['shanghai', 'hangzhou', [115.90, 28.68], 'changsha', 'guiyang', 'kunming'] },
    { name: '沿海通道（青島→上海→廈門→深圳）', path: ['qingdao', [119.20, 34.60], [120.10, 33.00], 'shanghai', [121.55, 29.87], [120.70, 28.00], [119.30, 26.08], 'xiamen', [116.70, 23.40], 'shenzhen'] },
    { name: '廣深港高鐵（廣州→深圳）', path: ['guangzhou', 'shenzhen'] },
    { name: '膠濟高鐵（青島→濟南）', path: ['qingdao', [118.05, 36.80], 'jinan'] },
    { name: '沿江高鐵（上海→南京→合肥→武漢→重慶→成都）', path: ['shanghai', [118.80, 32.06], [117.27, 31.86], 'wuhan', [111.30, 30.70], 'chongqing', [105.10, 30.10], 'chengdu'] },
    { name: '廈渝高鐵（廈門→長沙→張家界→重慶）', path: ['xiamen', [117.00, 25.10], [114.93, 25.83], 'changsha', [111.70, 29.00], 'zhangjiajie', [108.77, 29.53], 'chongqing'] },
    { name: '蘭渝鐵路＋渝貴鐵路（蘭州→重慶→貴陽）', path: ['lanzhou', [104.60, 34.00], [105.84, 32.44], [106.10, 30.80], 'chongqing', [106.70, 28.20], 'guiyang'] },
    { name: '成昆鐵路（成都→昆明）', path: ['chengdu', [102.27, 27.90], 'kunming'] },
    { name: '廣昆通道（廣州→南寧→昆明）', path: ['guangzhou', [110.30, 23.10], [108.37, 22.82], [105.20, 23.70], 'kunming'] },
    { name: '中老鐵路', path: ['kunming', [102.54, 24.35], [100.97, 22.79], 'yunnan'] },
  ],
  mountains: [[86.9, 28.6], [90.5, 31.5], [84.0, 34.5], [94.0, 32.0], [99.5, 27.5], [82.0, 42.5], [88.0, 43.2], [103.0, 33.5]],
  stops: [
    {
      id: 'harbin', zh: '哈爾濱', en: 'Harbin', at: [126.6, 45.8],
      items: [
        { id: 'cn-ice', emoji: '🧊', zh: '冰雕', en: 'Ice Sculpture', fact: '哈爾濱冬天好冷好冷，大家用冰塊蓋出會發光的冰城堡！' },
        { id: 'cn-tiger', art: 'tiger', zh: '東北虎', en: 'Siberian Tiger', fact: '東北虎是世界上最大的老虎，毛又長又厚，不怕冷！' },
      ],
    },
    {
      id: 'beijing', zh: '北京', en: 'Beijing', at: [116.4, 39.9],
      items: [
        { id: 'cn-wall', art: 'great-wall', zh: '長城', en: 'Great Wall', fact: '長城是一道好長好長的城牆，在山上彎來彎去，像一條長龍！' },
        { id: 'cn-duck', emoji: '🦆', zh: '烤鴨', en: 'Roast Duck', fact: '北京烤鴨的皮脆脆的，用薄薄的餅包起來吃！' },
      ],
    },
    {
      id: 'mongolia', zh: '內蒙古', en: 'Inner Mongolia', at: [111.7, 40.8], marker: [110.5, 43.6],
      items: [
        { id: 'cn-horse', art: 'horse', zh: '馬', en: 'Horse', fact: '內蒙古有一大片草原，很多人騎著馬在草原上奔跑！' },
        { id: 'cn-yurt', emoji: '⛺', zh: '蒙古包', en: 'Yurt', fact: '蒙古包是圓圓的帳篷，可以拆下來搬到別的草原去住！' },
        { id: 'cn-sheep', art: 'sheep', zh: '綿羊', en: 'Sheep', fact: '草原上的綿羊一群一群的，像白白的雲朵在地上走！' },
      ],
    },
    {
      id: 'xian', zh: '西安', en: "Xi'an", at: [108.9, 34.3],
      items: [
        { id: 'cn-terracotta', art: 'terracotta-warrior', zh: '兵馬俑', en: 'Terracotta Army', fact: '西安的兵馬俑是兩千多年前用泥土做的士兵和馬，排成好長的隊伍！' },
        { id: 'cn-noodles', emoji: '🍜', zh: '麵條', en: 'Noodles', fact: '西安的麵條又寬又長，有的一條就可以裝滿一整碗！' },
      ],
    },
    {
      id: 'dunhuang', zh: '敦煌', en: 'Dunhuang', at: [94.7, 40.1],
      items: [
        { id: 'cn-camel', art: 'camel', zh: '駱駝', en: 'Camel', fact: '敦煌在沙漠旁邊，駱駝背上有兩個駝峰，可以走好久都不用喝水！' },
        { id: 'cn-desert', emoji: '🏜️', zh: '沙漠', en: 'Desert', fact: '敦煌的鳴沙山，從沙丘上滑下來的時候，沙子會發出嗡嗡的聲音！' },
      ],
    },
    {
      id: 'tibet', zh: '西藏', en: 'Tibet', at: [91.1, 29.65],
      items: [
        { id: 'cn-yak', art: 'yak', zh: '犛牛', en: 'Yak', fact: '犛牛住在很高很冷的山上，身上的長毛像穿了一件大毛毯！' },
        { id: 'cn-snow-leopard', art: 'snow-leopard', zh: '雪豹', en: 'Snow Leopard', fact: '雪豹住在雪山上，尾巴又長又蓬，睡覺時可以圍住鼻子保暖！' },
        { id: 'cn-everest', emoji: '🏔️', zh: '聖母峰', en: 'Mount Everest', fact: '聖母峰是全世界最高的山，山頂一直都有雪！' },
      ],
    },
    {
      id: 'chengdu', zh: '成都', en: 'Chengdu', at: [104.07, 30.67], marker: [101.6, 31.2],
      items: [
        { id: 'cn-panda', art: 'panda', zh: '貓熊', en: 'Giant Panda', fact: '成都有貓熊基地，貓熊寶寶們每天吃竹子、爬樹、睡覺！' },
        { id: 'cn-red-panda', art: 'red-panda', zh: '小貓熊', en: 'Red Panda', fact: '小貓熊紅紅的，尾巴有一圈一圈的條紋，很會爬樹！' },
        { id: 'cn-hotpot', emoji: '🍲', zh: '火鍋', en: 'Hot Pot', fact: '成都的火鍋紅紅的，非常辣喔！' },
      ],
    },
    {
      id: 'yunnan', zh: '雲南', en: 'Yunnan', at: [100.8, 22.0], marker: [102.3, 20.6],
      items: [
        { id: 'cn-elephant', art: 'elephant', zh: '亞洲象', en: 'Asian Elephant', fact: '雲南的西雙版納有野生的大象，有一群大象還曾經一起去旅行好遠！' },
        { id: 'cn-peacock', art: 'peacock', zh: '孔雀', en: 'Peacock', fact: '雲南有很多孔雀，公孔雀開屏的時候尾巴像一把漂亮的扇子！' },
      ],
    },
    {
      id: 'guilin', zh: '桂林', en: 'Guilin', at: [110.29, 25.27],
      items: [
        { id: 'cn-hills', emoji: '⛰️', zh: '山水', en: 'Karst Hills', fact: '桂林的山一座一座像竹筍一樣站在河邊，倒影在水裡好漂亮！' },
        { id: 'cn-raft', emoji: '🛶', zh: '竹筏', en: 'Bamboo Raft', fact: '在桂林可以坐竹筏，慢慢地在河上漂！' },
      ],
    },
    {
      id: 'shanghai', zh: '上海', en: 'Shanghai', at: [121.47, 31.23], marker: [124.0, 32.2],
      items: [
        { id: 'cn-tower', emoji: '🗼', zh: '東方明珠塔', en: 'Oriental Pearl Tower', fact: '上海的東方明珠塔上面有好幾顆大圓球，晚上會亮起彩色的燈！' },
        { id: 'cn-dumpling', emoji: '🥟', zh: '小籠包', en: 'Soup Dumpling', fact: '小籠包裡面有熱熱的湯，要先咬一個小洞再慢慢喝喔！' },
      ],
    },
    {
      id: 'qingdao', zh: '青島', en: 'Qingdao', at: [120.38, 36.07], marker: [122.6, 35.4],
      items: [
        { id: 'cn-sail', art: 'sailboat', zh: '帆船', en: 'Sailboat', fact: '青島是「帆船之都」，奧運的帆船比賽就是在這裡的海上舉行的！' },
        { id: 'cn-beach', emoji: '🏖️', zh: '海水浴場', en: 'Beach', fact: '夏天的青島海邊擠滿了來玩水、撿貝殼的人！' },
      ],
    },
    {
      id: 'hangzhou', zh: '杭州', en: 'Hangzhou', at: [120.15, 30.27], marker: [123.4, 28.6],
      items: [
        { id: 'cn-westlake', emoji: '🛶', zh: '西湖', en: 'West Lake', fact: '杭州的西湖好漂亮，可以坐小船在湖上看荷花和柳樹！' },
        { id: 'cn-tea', emoji: '🍵', zh: '龍井茶', en: 'Longjing Tea', fact: '杭州的山上種了好多茶，龍井茶泡出來是綠綠的、香香的！' },
      ],
    },
    {
      id: 'xiamen', zh: '廈門', en: 'Xiamen', at: [118.09, 24.48], marker: [120.6, 23.4],
      items: [
        { id: 'cn-gulangyu', emoji: '🏝️', zh: '鼓浪嶼', en: 'Gulangyu Island', fact: '廈門旁邊的鼓浪嶼是一座沒有汽車的小島，到處都聽得到鋼琴聲！' },
        { id: 'cn-whitedolphin', art: 'dolphin', zh: '中華白海豚', en: 'Chinese White Dolphin', fact: '廈門的海裡住著粉紅色的中華白海豚，長大以後會從灰色慢慢變成粉紅色！' },
      ],
    },
    {
      id: 'guangzhou', zh: '廣州', en: 'Guangzhou', at: [113.26, 23.13], marker: [113.6, 20.9],
      items: [
        { id: 'cn-cantontower', emoji: '🗼', zh: '廣州塔', en: 'Canton Tower', fact: '廣州塔的腰細細的，晚上會亮起彩色的燈，大家都叫它「小蠻腰」！' },
        { id: 'cn-dimsum', emoji: '🍤', zh: '蝦餃', en: 'Dim Sum', fact: '廣州人很愛喝早茶，蒸籠裡有蝦餃、燒賣，一籠一籠好好吃！' },
      ],
    },
    {
      id: 'kunming', zh: '昆明', en: 'Kunming', at: [102.83, 24.88], marker: [104.6, 24.2],
      items: [
        { id: 'cn-stoneforest', emoji: '⛰️', zh: '石林', en: 'Stone Forest', fact: '昆明的石林有好多高高的石頭柱子，像一片用石頭做的森林！' },
        { id: 'cn-flowers', emoji: '💐', zh: '鮮花', en: 'Flowers', fact: '昆明一年四季都像春天一樣，被叫做「春城」，到處都是花！' },
      ],
    },
    {
      id: 'chongqing', zh: '重慶', en: 'Chongqing', at: [106.55, 29.56], marker: [107.0, 30.4],
      items: [
        { id: 'cn-monorail', emoji: '🚝', zh: '穿過大樓的輕軌', en: 'Monorail Through a Building', fact: '重慶是山城，房子蓋在山坡上，輕軌列車竟然從大樓中間穿過去！' },
        { id: 'cn-yangtze', emoji: '🚢', zh: '長江遊輪', en: 'Yangtze River Cruise', fact: '從重慶可以坐船沿著長江往下游，看到高高的三峽！' },
      ],
    },
    {
      id: 'zhangjiajie', zh: '張家界', en: 'Zhangjiajie', at: [110.48, 29.12], marker: [112.6, 29.6],
      items: [
        { id: 'cn-pillars', emoji: '⛰️', zh: '石柱山', en: 'Stone Pillar Mountains', fact: '張家界的山像一根一根的大柱子，雲霧飄過去的時候好像浮在天空中！' },
        { id: 'cn-glassbridge', emoji: '🌉', zh: '玻璃橋', en: 'Glass Bridge', fact: '張家界有一座玻璃做的橋，走在上面可以直接看到下面好深的山谷！' },
        { id: 'cn-monkey', art: 'macaque', zh: '獼猴', en: 'Macaque', fact: '張家界的山上有好多獼猴，會跑到步道旁邊看遊客！' },
      ],
    },
    {
      id: 'wuhan', zh: '武漢', en: 'Wuhan', at: [114.30, 30.60], marker: [115.6, 32.4],
      items: [
        { id: 'cn-noodle', emoji: '🍜', zh: '熱乾麵', en: 'Hot Dry Noodles', fact: '武漢人早餐最愛吃熱乾麵，拌上香香的芝麻醬！' },
        { id: 'cn-tower', emoji: '🏯', zh: '黃鶴樓', en: 'Yellow Crane Tower', fact: '武漢的黃鶴樓站在長江邊，好多古時候的詩人都寫過它！' },
      ],
    },
    {
      id: 'urumqi', zh: '烏魯木齊', en: 'Ürümqi', at: [87.62, 43.83],
      items: [
        { id: 'cn-grapes', emoji: '🍇', zh: '葡萄', en: 'Grapes', fact: '新疆的吐魯番好熱好乾，種出來的葡萄特別甜，還會曬成葡萄乾！' },
        { id: 'cn-tianshan', emoji: '🏔️', zh: '天山', en: 'Tianshan Mountains', fact: '烏魯木齊旁邊的天山，山頂一年四季都有雪，山上還有一個藍藍的天池！' },
      ],
    },
  ],
};
