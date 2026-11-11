// 🦧 東南亞之旅的資料（region.html?r=southeast-asia 會讀這個檔），格式見 regions/europe.js
//
// 越南、馬來西亞、新加坡、印尼、菲律賓（泰國另外有自己的旅行）
// 坐真的路線：
//   越南統一鐵路 河內→峴港→胡志明市；河內→下龍灣、峴港→會安坐巴士
//   馬來西亞 KTM ETS 電聯車 吉隆坡→芙蓉→金馬士→新山→新加坡
//   印尼爪哇的 Sri Tanjung 火車 日惹→梭羅→泗水→外南夢（Ketapang 港），坐渡輪過海到峇里島的吉利馬努克，再坐巴士
//   峇里島東邊的八丹拜港坐帆船到科摩多島
//   其他坐飛機：胡志明市→吉隆坡、吉隆坡→婆羅洲山打根、新加坡→日惹、婆羅洲→薄荷島
// 國界是手畫的大概形狀（給小朋友看的，不是精確的國界），海岸線用主地圖的陸地裁出來
// 每個國家用自己的語言打招呼：越南語、馬來語、英語、印尼語、菲律賓語
window.REGIONS = window.REGIONS || {};

REGIONS['southeast-asia'] = {
  id: 'southeast-asia',
  title: { zh: '東南亞之旅', en: 'Southeast Asia Trip' },
  sea: '#4fb8e0',
  landFar: '#e6ecd6',
  vehicle: 'train',
  roadVehicle: 'bus',
  lang3: 'local',
  loop: false,
  bounds: [96, -12, 127, 23.5],
  hint: '👆 點一個地方，出發去東南亞玩！',
  doneSay: '東南亞之旅完成！你好厲害！',
  countries: [
    { id: 'indonesia', zh: '印尼', en: 'Indonesia', color: '#f4c98a', lang: 'id-ID', hello: 'Halo', flag: ['h', '#CE1126', '#ffffff'],
      polys: [[
        [94.0, 6.5], [97.5, 6.2], [99.3, 4.5], [100.4, 3.0], [101.5, 2.2], [103.0, 1.1], [103.9, 1.1], [104.4, 1.2], [105.0, 2.0],
        [107.5, 4.8], [108.8, 4.4], [109.6, 1.9], [110.5, 0.9], [111.8, 1.0], [112.5, 1.5], [113.6, 1.2], [114.6, 1.5], [114.8, 2.3],
        [115.5, 3.0], [115.6, 4.0], [116.5, 4.3], [117.6, 4.2], [118.6, 4.2], [119.5, 3.5], [122.0, 2.5], [125.0, 3.6], [127.5, 4.6],
        [128.0, -8.1], [125.0, -8.1], [124.95, -11.5], [94.0, -11.5],
      ]] },
    { id: 'malaysia', zh: '馬來西亞', en: 'Malaysia', color: '#f0a3a3', lang: 'ms-MY', hello: 'Apa khabar', flag: ['my'],
      polys: [
        [
          [99.6, 6.4], [100.1, 6.5], [100.4, 6.5], [101.1, 5.7], [101.8, 5.8], [102.1, 6.2], [103.5, 5.6], [104.6, 2.6], [104.4, 1.55],
          [103.95, 1.47], [103.6, 1.45], [103.3, 1.35], [102.6, 1.85], [101.8, 2.4], [100.9, 3.3], [100.2, 4.4], [99.9, 5.5],
        ],
        [
          [109.6, 1.9], [110.5, 0.9], [111.8, 1.0], [112.5, 1.5], [113.6, 1.2], [114.6, 1.5], [114.8, 2.3], [115.5, 3.0], [115.6, 4.0],
          [116.5, 4.3], [117.6, 4.2], [118.6, 4.2], [118.9, 4.6], [119.4, 5.3], [118.5, 6.2], [117.4, 7.2], [116.7, 7.4], [113.5, 5.5],
          [110.5, 3.8], [109.3, 2.4],
        ],
      ] },
    { id: 'singapore', zh: '新加坡', en: 'Singapore', color: '#f6d6e8', lang: 'en-SG', hello: 'Hello', flag: ['sg'],
      polys: [[[103.55, 1.2], [104.15, 1.2], [104.15, 1.46], [103.55, 1.46]]] },
    { id: 'vietnam', zh: '越南', en: 'Vietnam', color: '#f7e08a', lang: 'vi-VN', hello: 'Xin chào', flag: ['vn'],
      polys: [[
        [102.1, 22.4], [103.0, 22.8], [104.4, 22.8], [105.3, 23.3], [106.7, 22.8], [107.6, 21.6], [108.0, 21.4], [107.5, 20.0],
        [106.8, 19.0], [107.5, 17.5], [109.5, 15.0], [109.6, 11.5], [108.5, 10.0], [106.8, 8.3], [104.4, 8.3], [104.5, 10.4],
        [105.1, 10.9], [106.2, 11.0], [106.4, 11.7], [107.5, 12.3], [107.6, 14.4], [107.4, 14.9], [107.7, 15.5], [107.2, 16.0],
        [106.6, 16.5], [106.0, 17.4], [105.6, 18.0], [104.8, 18.8], [104.0, 19.3], [104.6, 19.8], [104.1, 20.0], [103.2, 20.6],
        [102.9, 21.3],
      ]] },
    { id: 'philippines', zh: '菲律賓', en: 'Philippines', color: '#a8d8b0', lang: 'fil-PH', hello: 'Kumusta', flag: ['ph'],
      polys: [[
        [116.6, 8.0], [117.6, 7.3], [118.4, 6.4], [119.5, 5.6], [119.6, 4.6], [121.0, 4.6], [126.8, 5.4], [127.5, 10.0], [125.0, 13.0],
        [124.5, 19.5], [121.5, 21.3], [119.5, 18.5], [116.5, 11.5],
      ]] },
  ],
  junctions: {
    danang: [108.2, 16.05], ketapang: [114.39, -8.14], gilimanuk: [114.44, -8.18], padangbai: [115.51, -8.53],
  },
  lines: [
    { name: '越南統一鐵路（河內→峴港）', path: ['hanoi', [105.95, 20.43], [105.68, 18.67], [106.6, 17.47], [107.58, 16.46], 'danang'] },
    { name: '越南統一鐵路（峴港→胡志明市）', path: ['danang', [108.8, 15.1], [109.22, 13.77], [109.19, 12.24], [108.1, 10.93], 'hcmc'] },
    { name: '巴士（河內→下龍灣）', mode: 'road', path: ['hanoi', [106.3, 20.95], 'halong'] },
    { name: '巴士（峴港→會安）', mode: 'road', path: ['danang', 'hoian'] },
    { name: '飛機（胡志明市→吉隆坡）', mode: 'air', path: ['hcmc', 'kl'] },
    { name: 'KTM ETS 電聯車（吉隆坡→新山→新加坡）', path: ['kl', [101.94, 2.73], [102.6, 2.58], [103.3, 1.95], [103.76, 1.46], 'singapore'] },
    { name: '飛機（吉隆坡→婆羅洲山打根）', mode: 'air', path: ['kl', 'borneo'] },
    { name: '飛機（婆羅洲→薄荷島）', mode: 'air', path: ['borneo', 'bohol'] },
    { name: '飛機（新加坡→日惹）', mode: 'air', path: ['singapore', 'yogyakarta'] },
    { name: 'Sri Tanjung 火車（日惹→泗水→外南夢）', path: ['yogyakarta', [110.82, -7.57], [111.52, -7.63], [112.75, -7.27], [113.2, -7.75], [113.7, -8.17], 'ketapang'] },
    { name: '渡輪（爪哇→峇里島）', mode: 'boat', path: ['ketapang', 'gilimanuk'] },
    { name: '巴士（吉利馬努克→烏布→八丹拜）', mode: 'road', path: ['gilimanuk', [114.62, -8.36], [114.95, -8.47], [115.15, -8.6], 'bali', 'padangbai'] },
    { name: '帆船（峇里島→科摩多島）', mode: 'boat', vehicle: 'sailboat', path: ['padangbai', [115.6, -8.3], [116.3, -8.05], [117.3, -8.0], [118.5, -8.05], [119.2, -8.35], 'komodo'] },
  ],
  stops: [
    {
      id: 'hanoi', country: 'vietnam', zh: '河內', en: 'Hanoi', local: 'Hà Nội', at: [105.85, 21.03], marker: [104.3, 22.0],
      items: [
        { id: 'sea-pho', emoji: '🍜', zh: '河粉', en: 'Pho', local: 'phở', fact: '越南人早上最愛吃一碗熱熱的河粉，裡面有牛肉和好多香草！' },
        { id: 'sea-scooter', art: 'scooter', zh: '好多好多機車', en: 'Scooters', local: 'xe máy', fact: '河內的街上機車多到像河流一樣，過馬路要慢慢走！' },
      ],
    },
    {
      id: 'halong', country: 'vietnam', zh: '下龍灣', en: 'Ha Long Bay', local: 'Vịnh Hạ Long', at: [107.08, 20.95], vehicle: 'bus', marker: [108.6, 21.6],
      items: [
        { id: 'sea-karst', emoji: '🏝️', zh: '海上的石頭山', en: 'Limestone Islands', local: 'đảo đá', fact: '下龍灣的海上有一千多座石頭小山，傳說是龍從天上飛下來變成的！' },
        { id: 'sea-junk', art: 'sailboat', zh: '帆船', en: 'Junk Boat', local: 'thuyền buồm', fact: '可以坐著紅色帆的大船，在石頭山中間慢慢地開！' },
      ],
    },
    {
      id: 'hoian', country: 'vietnam', zh: '會安', en: 'Hoi An', local: 'Hội An', at: [108.33, 15.88], vehicle: 'bus', marker: [110.0, 15.6],
      items: [
        { id: 'sea-lantern', emoji: '🏮', zh: '燈籠', en: 'Lanterns', local: 'đèn lồng', fact: '會安古城晚上掛滿了彩色的燈籠，還可以把小燈放到河裡漂！' },
        { id: 'sea-basketboat', emoji: '🛶', zh: '竹籃船', en: 'Basket Boat', local: 'thuyền thúng', fact: '會安有圓圓的竹籃船，划起來會轉圈圈！' },
      ],
    },
    {
      id: 'hcmc', country: 'vietnam', zh: '胡志明市', en: 'Ho Chi Minh City', local: 'Thành phố Hồ Chí Minh', at: [106.7, 10.78],
      items: [
        { id: 'sea-banhmi', emoji: '🥖', zh: '越南法國麵包', en: 'Banh Mi', local: 'bánh mì', fact: '越南的法國麵包脆脆的，裡面夾肉、小黃瓜和香菜，好好吃！' },
        { id: 'sea-floatingmarket', emoji: '🍉', zh: '水上市場', en: 'Floating Market', local: 'chợ nổi', fact: '湄公河上有水上市場，大家划著小船賣水果，把要賣的東西掛在竹竿上！' },
      ],
    },
    {
      id: 'kl', country: 'malaysia', zh: '吉隆坡', en: 'Kuala Lumpur', local: 'Kuala Lumpur', at: [101.69, 3.14], marker: [100.0, 3.2],
      items: [
        { id: 'sea-petronas', art: 'petronas', zh: '雙子星塔', en: 'Petronas Towers', local: 'Menara Berkembar Petronas', fact: '吉隆坡的雙子星塔是兩座一模一樣的高樓，中間有一座天橋把它們連起來！' },
        { id: 'sea-satay', emoji: '🍢', zh: '沙嗲', en: 'Satay', local: 'sate', fact: '沙嗲是一串一串的烤肉，沾著香香的花生醬吃！' },
        { id: 'sea-tiger', art: 'tiger', zh: '馬來虎', en: 'Malayan Tiger', local: 'harimau', fact: '馬來西亞的森林裡住著馬來虎，牠是馬來西亞的國家動物！' },
      ],
    },
    {
      id: 'singapore', country: 'singapore', zh: '新加坡', en: 'Singapore', local: 'Singapore', at: [103.85, 1.29], marker: [104.3, -0.2],
      items: [
        { id: 'sea-supertree', emoji: '🌳', zh: '擎天大樹', en: 'Supertrees', local: 'Supertree Grove', fact: '新加坡的濱海灣花園有好多鐵做的大樹，晚上會亮起來、跟著音樂閃閃發光！' },
        { id: 'sea-chilicrab', art: 'crab', zh: '辣椒螃蟹', en: 'Chilli Crab', local: 'chilli crab', fact: '新加坡最有名的菜是辣椒螃蟹，醬汁還可以沾小饅頭吃！' },
      ],
    },
    {
      id: 'borneo', country: 'malaysia', zh: '婆羅洲', en: 'Borneo', local: 'Borneo', at: [117.95, 5.87], vehicle: 'airplane',
      items: [
        { id: 'sea-orangutan', art: 'orangutan', zh: '紅毛猩猩', en: 'Orangutan', local: 'orang utan', fact: '紅毛猩猩的馬來語意思是「森林裡的人」，牠們每天晚上都會在樹上做一張新的床！' },
        { id: 'sea-pygmyelephant', art: 'elephant', zh: '婆羅洲侏儒象', en: 'Bornean Elephant', local: 'gajah', fact: '婆羅洲的大象是全亞洲最小的大象，耳朵大大的、臉圓圓的！' },
        { id: 'sea-turtle', art: 'sea-turtle', zh: '海龜', en: 'Sea Turtle', local: 'penyu', fact: '山打根外海的海龜島，晚上海龜媽媽會爬上沙灘生蛋！' },
      ],
    },
    {
      id: 'yogyakarta', country: 'indonesia', zh: '日惹', en: 'Yogyakarta', local: 'Yogyakarta', at: [110.36, -7.8], vehicle: 'airplane', marker: [110.3, -5.4],
      items: [
        { id: 'sea-borobudur', art: 'borobudur', zh: '婆羅浮屠', en: 'Borobudur', local: 'Candi Borobudur', fact: '婆羅浮屠是一千多年前用石頭蓋的大佛塔，上面有好多鐘形的小佛塔！' },
        { id: 'sea-volcano', emoji: '🌋', zh: '默拉皮火山', en: 'Mount Merapi', local: 'Gunung Merapi', fact: '日惹旁邊的默拉皮火山常常冒煙，是印尼最活躍的火山！' },
      ],
    },
    {
      id: 'bali', country: 'indonesia', zh: '峇里島', en: 'Bali', local: 'Bali', at: [115.26, -8.51], vehicle: 'bus', marker: [114.9, -6.4],
      items: [
        { id: 'sea-rice', emoji: '🌾', zh: '梯田', en: 'Rice Terraces', local: 'sawah', fact: '峇里島的稻田一層一層像樓梯一樣，綠油油的好漂亮！' },
        { id: 'sea-monkey', art: 'macaque', zh: '猴子森林', en: 'Monkey Forest', local: 'monyet', fact: '烏布的猴子森林住著好幾百隻猴子，要小心牠們搶你的帽子和眼鏡！' },
      ],
    },
    {
      id: 'komodo', country: 'indonesia', zh: '科摩多島', en: 'Komodo Island', local: 'Pulau Komodo', at: [119.49, -8.55], vehicle: 'sailboat', marker: [119.4, -6.6],
      items: [
        { id: 'sea-komodo', art: 'komodo-dragon', zh: '科摩多龍', en: 'Komodo Dragon', local: 'komodo', fact: '科摩多龍是世界上最大的蜥蜴，跟一張床一樣長，只住在這附近的幾個島上！' },
        { id: 'sea-pinkbeach', emoji: '🏖️', zh: '粉紅沙灘', en: 'Pink Beach', local: 'Pantai Merah', fact: '科摩多島有一片粉紅色的沙灘，因為沙子裡混了紅色的小珊瑚！' },
        { id: 'sea-clownfish', art: 'clownfish', zh: '小丑魚', en: 'Clownfish', local: 'ikan badut', fact: '科摩多的海底有漂亮的珊瑚礁，小丑魚就躲在海葵裡！' },
      ],
    },
    {
      id: 'bohol', country: 'philippines', zh: '薄荷島', en: 'Bohol', local: 'Bohol', at: [123.95, 9.8], vehicle: 'airplane',
      items: [
        { id: 'sea-tarsier', art: 'tarsier', zh: '眼鏡猴', en: 'Tarsier', local: 'mamag', fact: '眼鏡猴小到可以站在大人的手掌上，一顆眼睛就跟牠的腦袋一樣大！' },
        { id: 'sea-chocohills', emoji: '⛰️', zh: '巧克力山', en: 'Chocolate Hills', local: 'Chocolate Hills', fact: '薄荷島有一千多座圓圓的小山，夏天草變成咖啡色，看起來像一顆顆巧克力！' },
        { id: 'sea-mango', emoji: '🥭', zh: '芒果', en: 'Mango', local: 'mangga', fact: '菲律賓的芒果又香又甜，是全世界最甜的芒果之一！' },
      ],
    },
  ],
};
