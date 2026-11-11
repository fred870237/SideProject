// 🎈 中東土耳其之旅的資料（region.html?r=middle-east 會讀這個檔），格式見 regions/europe.js
//
// 土耳其、約旦、阿拉伯聯合大公國、阿曼（埃及在非洲之旅裡）
// 坐真的路線：
//   土耳其 YHT 高鐵 伊斯坦堡→埃斯基謝希爾→波拉特勒→孔亞，孔亞坐巴士到卡帕多奇亞
//   「棉花堡快車」埃斯基謝希爾→阿菲永→代尼茲利（棉花堡）
//   約旦：從安曼坐巴士到死海，沿著國王公路到佩特拉，坐吉普車進瓦地倫沙漠，再到亞喀巴
//   杜拜→馬斯喀特 坐跨國巴士
//   其他坐飛機：卡帕多奇亞→安曼、亞喀巴→杜拜
// 國界是手畫的大概形狀（給小朋友看的，不是精確的國界），海岸線用主地圖的陸地裁出來
// 每個國家用自己的語言打招呼：土耳其語、阿拉伯語（字是阿拉伯字母；裝置沒有阿拉伯語語音就不唸，只顯示）
window.REGIONS = window.REGIONS || {};

REGIONS['middle-east'] = {
  id: 'middle-east',
  title: { zh: '中東土耳其之旅', en: 'Middle East & Turkey Trip' },
  sea: '#4fb8e0',
  landFar: '#efe4cc',
  vehicle: 'high-speed-train',
  roadVehicle: 'bus',
  lang3: 'local',
  loop: false,
  bounds: [25, 20, 60, 43],
  hint: '👆 點一個地方，出發去中東和土耳其！',
  doneSay: '中東土耳其之旅完成！你好厲害！',
  countries: [
    { id: 'turkey', zh: '土耳其', en: 'Turkey', color: '#f2a5a0', lang: 'tr-TR', hello: 'Merhaba', flag: ['tr'],
      polys: [[
        [26.04, 40.73], [26.6, 41.3], [26.35, 41.7], [27.0, 42.1], [28.0, 42.0], [28.5, 43.0], [35.0, 42.6], [41.5, 41.6],
        [42.8, 41.6], [43.5, 41.1], [43.7, 40.1], [44.8, 39.7], [44.3, 38.4], [44.8, 37.2], [44.2, 37.3], [42.4, 37.1],
        [40.0, 36.8], [38.0, 36.85], [36.6, 36.8], [36.2, 36.0], [35.8, 35.6], [35.0, 35.9], [32.0, 35.8], [29.0, 36.0],
        [28.3, 36.65], [27.35, 37.0], [27.2, 37.4], [27.15, 37.85], [26.25, 38.15], [26.27, 38.65], [26.75, 38.95],
        [26.68, 39.45], [26.1, 39.5], [25.8, 40.0], [25.6, 40.3],
      ]] },
    { id: 'jordan', zh: '約旦', en: 'Jordan', color: '#f6d58c', lang: 'ar-JO', hello: 'مرحبا', flag: ['jo'],
      polys: [[
        [35.6, 32.7], [35.75, 32.75], [36.4, 32.4], [38.8, 33.37], [39.3, 32.2], [37.0, 31.5], [38.0, 30.5], [37.6, 30.3],
        [36.7, 29.9], [36.5, 29.5], [34.95, 29.35], [34.95, 29.55], [35.15, 30.1], [35.4, 30.9], [35.55, 31.4], [35.55, 32.4],
      ]] },
    { id: 'uae', zh: '阿拉伯聯合大公國', en: 'United Arab Emirates', color: '#a8d8b0', lang: 'ar-AE', hello: 'مرحبا', flag: ['ae'],
      polys: [[
        [51.5, 24.3], [52.6, 22.95], [55.2, 22.7], [55.65, 24.0], [55.95, 24.2], [56.05, 24.9], [56.4, 24.9], [56.4, 25.6],
        [56.1, 25.65], [56.0, 26.0], [55.0, 26.2], [52.0, 24.8],
      ]] },
    { id: 'oman', zh: '阿曼', en: 'Oman', color: '#cdb8e8', lang: 'ar-OM', hello: 'مرحبا', flag: ['om'],
      polys: [
        [
          [55.65, 24.0], [55.2, 22.7], [55.0, 20.0], [52.0, 19.0], [53.1, 16.6], [56.0, 17.0], [60.0, 21.0], [60.0, 23.5],
          [57.0, 25.0], [56.4, 24.9], [56.05, 24.9], [55.95, 24.2],
        ],
        [[56.1, 25.65], [56.5, 25.6], [56.6, 26.5], [56.1, 26.5]],
      ] },
  ],
  junctions: {
    eskisehir: [30.52, 39.78], polatli: [32.15, 39.58], konya: [32.49, 37.87], amman: [35.93, 31.95],
  },
  lines: [
    { name: 'YHT 高鐵（伊斯坦堡→埃斯基謝希爾→孔亞）', path: ['istanbul', [29.94, 40.77], [30.4, 40.5], 'eskisehir', [31.4, 39.65], 'polatli', [32.3, 38.7], 'konya'] },
    { name: '棉花堡快車（埃斯基謝希爾→代尼茲利）', vehicle: 'train', path: ['eskisehir', [30.54, 38.76], [29.9, 38.1], [29.09, 37.78], 'pamukkale'] },
    { name: '巴士（孔亞→卡帕多奇亞）', mode: 'road', path: ['konya', [34.03, 38.37], 'cappadocia'] },
    { name: '飛機（卡帕多奇亞→安曼）', mode: 'air', path: ['cappadocia', 'amman'] },
    { name: '巴士（安曼→死海→國王公路→佩特拉）', mode: 'road', path: ['amman', 'deadsea', [35.7, 31.2], [35.6, 30.84], 'petra'] },
    { name: '吉普車（佩特拉→瓦地倫）', mode: 'road', vehicle: 'jeep', path: ['petra', [35.45, 29.95], 'wadirum'] },
    { name: '巴士（瓦地倫→亞喀巴）', mode: 'road', path: ['wadirum', [35.15, 29.6], 'aqaba'] },
    { name: '飛機（亞喀巴→杜拜）', mode: 'air', path: ['aqaba', 'dubai'] },
    { name: '跨國巴士（杜拜→馬斯喀特）', mode: 'road', path: ['dubai', [56.0, 24.7], [56.7, 24.35], [57.6, 23.7], 'muscat'] },
  ],
  stops: [
    {
      id: 'istanbul', country: 'turkey', zh: '伊斯坦堡', en: 'Istanbul', local: 'İstanbul', at: [28.98, 41.01],
      items: [
        { id: 'me-mosque', emoji: '🕌', zh: '藍色清真寺', en: 'Blue Mosque', local: 'Sultanahmet Camii', fact: '伊斯坦堡的藍色清真寺有六根尖尖的高塔，裡面貼滿了藍色的磁磚！' },
        { id: 'me-cat', art: 'cat', zh: '街上的貓咪', en: 'Street Cats', local: 'kedi', fact: '伊斯坦堡的街上到處都是貓咪，大家會幫牠們準備食物和小房子！' },
        { id: 'me-simit', emoji: '🥯', zh: '芝麻圈圈麵包', en: 'Simit', local: 'simit', fact: '土耳其人早餐最愛吃沾滿芝麻的圈圈麵包，配一杯紅茶！' },
      ],
    },
    {
      id: 'pamukkale', country: 'turkey', zh: '棉花堡', en: 'Pamukkale', local: 'Pamukkale', at: [29.12, 37.92], vehicle: 'train',
      items: [
        { id: 'me-terraces', emoji: '♨️', zh: '白色的溫泉梯田', en: 'White Terraces', local: 'travertenler', fact: '棉花堡的山坡白白的像棉花，其實是溫泉裡的石灰變成的，可以光腳踩水！' },
        { id: 'me-pool', emoji: '🏛️', zh: '古代的溫泉池', en: 'Ancient Pool', local: 'antik havuz', fact: '山上有一個兩千年前的溫泉池，可以在倒下來的古代柱子旁邊游泳！' },
      ],
    },
    {
      id: 'cappadocia', country: 'turkey', zh: '卡帕多奇亞', en: 'Cappadocia', local: 'Kapadokya', at: [34.83, 38.64], vehicle: 'bus',
      items: [
        { id: 'me-balloon', art: 'hot-air-balloon', zh: '熱氣球', en: 'Hot Air Balloons', local: 'sıcak hava balonu', fact: '卡帕多奇亞的早上，好幾百顆熱氣球一起飛上天空，好壯觀！' },
        { id: 'me-chimney', emoji: '🍄', zh: '精靈煙囪', en: 'Fairy Chimneys', local: 'peri bacaları', fact: '這裡的石頭被風吹成一根一根像香菇的形狀，叫做「精靈煙囪」！' },
        { id: 'me-cave', emoji: '🏠', zh: '洞穴房子', en: 'Cave Houses', local: 'mağara ev', fact: '以前的人把石頭挖空當房子住，現在還可以住在洞穴旅館裡！' },
      ],
    },
    {
      id: 'deadsea', country: 'jordan', zh: '死海', en: 'Dead Sea', local: 'البحر الميت', at: [35.58, 31.72], vehicle: 'bus', marker: [37.6, 32.6],
      items: [
        { id: 'me-float', emoji: '🏊', zh: '浮在水上', en: 'Floating', local: 'طفو', fact: '死海的水好鹹好鹹，人躺在上面不會沉下去，還可以一邊漂一邊看書！' },
        { id: 'me-salt', emoji: '🧂', zh: '鹽巴', en: 'Salt', local: 'ملح', fact: '死海是地球上最低的地方，岸邊的石頭都結了一層白白的鹽巴！' },
      ],
    },
    {
      id: 'petra', country: 'jordan', zh: '佩特拉', en: 'Petra', local: 'البتراء', at: [35.44, 30.33], vehicle: 'bus', marker: [37.8, 30.6],
      items: [
        { id: 'me-petra', art: 'petra', zh: '玫瑰色古城', en: 'Petra', local: 'البتراء', fact: '佩特拉的房子和神殿是直接刻在粉紅色的山壁上的，要先走過一條窄窄的峽谷才看得到！' },
        { id: 'me-camel', art: 'camel', zh: '駱駝', en: 'Camel', local: 'جمل', fact: '在佩特拉可以騎駱駝，也可以騎小驢子爬好多階樓梯上山！' },
      ],
    },
    {
      id: 'wadirum', country: 'jordan', zh: '瓦地倫沙漠', en: 'Wadi Rum', local: 'وادي رم', at: [35.42, 29.58], vehicle: 'jeep', marker: [37.2, 28.6],
      items: [
        { id: 'me-reddesert', emoji: '🏜️', zh: '紅色的沙漠', en: 'Red Desert', local: 'صحراء', fact: '瓦地倫的沙子是紅色的，大石頭山站在沙漠裡，好像在火星上！' },
        { id: 'me-jeep', art: 'jeep', zh: '沙漠吉普車', en: 'Desert Jeep', local: 'جيب', fact: '坐吉普車在沙漠裡跑，可以爬上大沙丘、看石頭拱橋！' },
        { id: 'me-stars', emoji: '✨', zh: '滿天星星', en: 'Starry Sky', local: 'نجوم', fact: '晚上住在沙漠帳篷裡，抬頭可以看到滿滿的星星和銀河！' },
      ],
    },
    {
      id: 'aqaba', country: 'jordan', zh: '亞喀巴', en: 'Aqaba', local: 'العقبة', at: [35.0, 29.53], vehicle: 'bus', marker: [33.6, 28.4],
      items: [
        { id: 'me-clownfish', art: 'clownfish', zh: '紅海小丑魚', en: 'Red Sea Clownfish', local: 'سمكة المهرج', fact: '亞喀巴的海是紅海，海底有好多珊瑚和小丑魚，浮潛就看得到！' },
        { id: 'me-turtle', art: 'sea-turtle', zh: '海龜', en: 'Sea Turtle', local: 'سلحفاة', fact: '紅海的珊瑚礁旁邊，常常可以看到海龜慢慢地游過去！' },
      ],
    },
    {
      id: 'dubai', country: 'uae', zh: '杜拜', en: 'Dubai', local: 'دبي', at: [55.27, 25.2], vehicle: 'airplane',
      items: [
        { id: 'me-burj', art: 'burj-khalifa', zh: '哈里發塔', en: 'Burj Khalifa', local: 'برج خليفة', fact: '哈里發塔是世界上最高的大樓，有一百六十幾層，比台北 101 還要高好多！' },
        { id: 'me-falcon', art: 'eagle', zh: '獵鷹', en: 'Falcon', local: 'صقر', fact: '阿聯的人很喜歡養獵鷹，獵鷹還可以有自己的護照、坐飛機！' },
        { id: 'me-metro', art: 'metro', zh: '沒有司機的捷運', en: 'Driverless Metro', local: 'مترو دبي', fact: '杜拜的捷運沒有司機，坐在最前面可以看著軌道一直往前開！' },
      ],
    },
    {
      id: 'muscat', country: 'oman', zh: '馬斯喀特', en: 'Muscat', local: 'مسقط', at: [58.41, 23.59], vehicle: 'bus',
      items: [
        { id: 'me-dhow', art: 'sailboat', zh: '阿拉伯木帆船', en: 'Dhow', local: 'داو', fact: '阿曼的木帆船叫做「單桅帆船」，以前的水手開著它到很遠的地方做生意！' },
        { id: 'me-greenturtle', art: 'sea-turtle', zh: '綠蠵龜', en: 'Green Turtle', local: 'سلحفاة خضراء', fact: '阿曼的海灘每天晚上都有綠蠵龜媽媽爬上來挖洞生蛋！' },
        { id: 'me-fort', emoji: '🏰', zh: '古老的城堡', en: 'Old Fort', local: 'قلعة', fact: '馬斯喀特的港口兩邊各有一座古老的城堡，守護著海灣！' },
      ],
    },
  ],
};
