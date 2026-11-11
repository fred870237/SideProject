// 🦁 非洲之旅的資料（region.html?r=africa 會讀這個檔），格式見 regions/europe.js
//
// 在非洲主要是坐吉普車（jeep）在草原上看動物，尼羅河坐小帆船，距離很遠的地方坐飛機：
//   lines 的 mode：'road' 公路（吉普車）、'boat' 坐船（vehicle 指定坐帆船）、'air' 坐飛機（自動畫成弧線）
//   公路照真的路走（奈洛比→馬賽馬拉→塞倫蓋提、奈洛比→阿魯沙→吉力馬札羅、奈洛比→坎帕拉→布恩迪），尼羅河照河道
// countries 的國界是手畫的大概形狀，靠海的那邊畫到海上，再用主地圖的陸地裁掉
// 東非的幾站靠得很近，圖示（marker）往外移，用虛線連回真正的位置
window.REGIONS = window.REGIONS || {};

REGIONS.africa = {
  id: 'africa',
  title: { zh: '非洲之旅', en: 'Africa Trip' },
  sea: '#5fb4e8',
  landFar: '#e9dcae',
  vehicle: 'jeep',
  roadVehicle: 'jeep',
  lang3: 'local',
  loop: false,
  bounds: [-18, -42, 52, 35],
  hint: '👆 點一個地方，坐吉普車去看動物！',
  doneSay: '非洲之旅完成！你好厲害！',
  countries: [
    { id: 'egypt', zh: '埃及', en: 'Egypt', color: '#f4c66b', lang: 'ar-EG', hello: 'مرحبا', flag: ['h', '#CE1126', '#ffffff', '#000000'],
      polys: [[[24.9, 32.4], [29.0, 31.6], [31.5, 32.2], [34.3, 31.8], [34.9, 29.5], [36.5, 27.5], [37.5, 22.0], [31.4, 22.0], [25.0, 22.0], [24.9, 29.2]]] },
    { id: 'kenya', zh: '肯亞', en: 'Kenya', color: '#b5dd86', lang: 'sw-KE', hello: 'Jambo', flag: ['ke'],
      polys: [[[34.0, -1.0], [34.0, 0.2], [34.6, 1.2], [34.4, 3.9], [35.9, 4.6], [36.9, 4.4], [38.1, 3.6], [39.6, 3.5], [41.0, 4.0], [41.9, 4.0], [41.0, 2.8], [41.0, -1.7], [42.5, -2.0], [41.0, -4.2], [39.2, -4.7], [37.7, -3.6]]] },
    { id: 'tanzania', zh: '坦尚尼亞', en: 'Tanzania', color: '#f7d98b', lang: 'sw-TZ', hello: 'Jambo', flag: ['diag', '#1EB53A', '#00A3DD'],
      polys: [[[34.0, -1.0], [37.7, -3.6], [39.2, -4.7], [41.0, -4.2], [41.0, -10.5], [39.5, -10.9], [38.0, -11.3], [35.0, -11.5], [34.6, -9.5], [33.0, -9.4], [31.0, -8.5], [29.5, -6.0], [29.4, -4.5], [30.7, -3.3], [30.5, -1.0]]] },
    { id: 'uganda', zh: '烏干達', en: 'Uganda', color: '#f2a07b', lang: 'sw-KE', hello: 'Jambo', flag: ['h', '#000000', '#FCDC04', '#D90000', '#000000', '#FCDC04', '#D90000'],
      polys: [[[29.6, -1.4], [30.5, -1.05], [34.0, -1.0], [34.0, 0.2], [34.6, 1.2], [34.4, 3.9], [33.9, 3.8], [32.0, 3.6], [30.9, 3.5], [30.8, 2.4], [30.0, 1.0], [29.6, -0.6]]] },
    { id: 'botswana', zh: '波札那', en: 'Botswana', color: '#a9d4ef', lang: 'en-ZA', hello: 'Dumela', flag: ['h', '#6DA9D2', '#6DA9D2', '#ffffff', '#000000', '#ffffff', '#6DA9D2', '#6DA9D2'],
      polys: [[[20.0, -18.0], [21.0, -18.3], [23.3, -17.6], [25.3, -17.8], [26.2, -19.6], [27.3, -20.5], [29.0, -22.2], [27.0, -23.6], [26.0, -24.6], [25.0, -25.8], [23.0, -25.3], [20.0, -24.8], [20.0, -22.0]]] },
    { id: 'south-africa', zh: '南非', en: 'South Africa', color: '#c7b3e6', lang: 'zu-ZA', hello: 'Sawubona', flag: ['za'],
      polys: [[[16.2, -28.6], [20.0, -28.4], [20.0, -24.8], [23.0, -25.3], [25.0, -25.8], [26.0, -24.6], [27.0, -23.6], [29.0, -22.2], [31.3, -22.4], [32.0, -24.5], [32.0, -26.8], [33.5, -27.0], [33.5, -28.5], [31.0, -31.8], [28.0, -34.3], [24.0, -35.2], [19.5, -35.6], [17.3, -34.6], [17.4, -31.0]]] },
    { id: 'madagascar', zh: '馬達加斯加', en: 'Madagascar', color: '#9fd9b4', lang: 'fr-FR', hello: 'Salama', flag: ['mg'],
      polys: [[[43.0, -26.2], [47.8, -26.2], [51.2, -15.0], [50.2, -11.3], [48.3, -12.5], [43.3, -17.5]]] },
  ],
  junctions: { arusha: [36.68, -3.37] },
  lines: [
    { name: '尼羅河（開羅→路克索）', mode: 'boat', vehicle: 'sailboat', path: ['cairo', [31.1, 29.07], [30.75, 28.1], [31.18, 27.18], [31.7, 26.56], [32.72, 26.16], 'luxor'] },
    { name: '飛機（埃及→肯亞）', mode: 'air', path: ['luxor', 'nairobi'] },
    { name: '公路（奈洛比→馬賽馬拉→塞倫蓋提）', mode: 'road', path: ['nairobi', [36.0, -1.1], [35.2, -1.5], 'serengeti'] },
    { name: '公路（奈洛比→阿魯沙）', mode: 'road', path: ['nairobi', [36.79, -2.55], 'arusha'] },
    { name: '公路（塞倫蓋提→恩戈羅恩戈羅→阿魯沙）', mode: 'road', path: ['serengeti', [35.6, -3.2], 'arusha'] },
    { name: '公路（阿魯沙→吉力馬札羅山）', mode: 'road', path: ['arusha', [37.34, -3.35], 'kilimanjaro'] },
    { name: '公路（奈洛比→坎帕拉→布恩迪）', mode: 'road', path: ['nairobi', [35.27, 0.52], [33.2, 0.44], [32.58, 0.35], [30.65, -0.61], 'uganda'] },
    { name: '飛機（吉力馬札羅→奧卡萬戈）', mode: 'air', path: ['kilimanjaro', 'okavango'] },
    { name: '飛機（奧卡萬戈→開普敦）', mode: 'air', path: ['okavango', 'capetown'] },
    { name: '飛機（開普敦→馬達加斯加）', mode: 'air', path: ['capetown', 'madagascar'] },
  ],
  stops: [
    {
      id: 'cairo', country: 'egypt', zh: '開羅', en: 'Cairo', local: 'القاهرة', at: [31.24, 30.04], marker: [27.5, 31.5],
      items: [
        { id: 'af-pyramid', art: 'pyramid', zh: '金字塔', en: 'Pyramids', local: 'هرم', fact: '埃及的金字塔是好幾千年前用大石頭一塊一塊疊起來的，是古代國王的墳墓！' },
        { id: 'af-camel', art: 'camel', zh: '駱駝', en: 'Camel', local: 'جمل', fact: '在金字塔旁邊可以騎駱駝，駱駝很會在沙漠裡走路！' },
      ],
    },
    {
      id: 'luxor', country: 'egypt', zh: '路克索', en: 'Luxor', local: 'الأقصر', at: [32.64, 25.69], marker: [35.5, 24.5],
      items: [
        { id: 'af-felucca', art: 'sailboat', zh: '尼羅河帆船', en: 'Felucca', local: 'فلوكة', fact: '尼羅河是世界上最長的河之一，大家坐著白色帆船在河上慢慢漂！' },
        { id: 'af-crocodile', art: 'crocodile', zh: '尼羅鱷', en: 'Nile Crocodile', local: 'تمساح', fact: '尼羅鱷住在河邊，嘴巴好大好長，會在岸上曬太陽！' },
      ],
    },
    {
      id: 'nairobi', country: 'kenya', zh: '奈洛比', en: 'Nairobi', local: 'Nairobi', at: [36.82, -1.29], marker: [40.8, 1.8],
      items: [
        { id: 'af-giraffe', art: 'giraffe', zh: '長頸鹿', en: 'Giraffe', local: 'twiga', fact: '奈洛比有長頸鹿中心，長頸鹿會把長長的脖子伸過來吃你手上的飼料！' },
        { id: 'af-flamingo', art: 'flamingo', zh: '紅鶴', en: 'Flamingo', local: 'heroe', fact: '肯亞的湖邊有好幾萬隻粉紅色的紅鶴，把整個湖都染成粉紅色！' },
        { id: 'af-rhino', art: 'rhino', zh: '犀牛', en: 'Rhino', local: 'kifaru', fact: '犀牛的鼻子上有一個大大的角，皮好厚像穿了盔甲！' },
      ],
    },
    {
      id: 'serengeti', country: 'tanzania', zh: '塞倫蓋提', en: 'Serengeti', local: 'Serengeti', at: [34.83, -2.33], marker: [30.5, -6.8],
      items: [
        { id: 'af-lion', art: 'lion', zh: '獅子', en: 'Lion', local: 'simba', fact: '塞倫蓋提的獅子一家人一起生活，公獅子有一圈大大的鬃毛！' },
        { id: 'af-zebra', art: 'zebra', zh: '斑馬', en: 'Zebra', local: 'pundamilia', fact: '每年有好幾十萬隻斑馬和角馬一起在草原上大遷徙，找新鮮的草吃！' },
        { id: 'af-ostrich', art: 'ostrich', zh: '鴕鳥', en: 'Ostrich', local: 'mbuni', fact: '鴕鳥是世界上最大的鳥，不會飛，但是跑得比汽車還快！' },
      ],
    },
    {
      id: 'kilimanjaro', country: 'tanzania', zh: '吉力馬札羅山', en: 'Mount Kilimanjaro', local: 'Kilimanjaro', at: [37.35, -3.07], marker: [42.6, -5.6],
      icon: { emoji: '🏔️' },
      items: [
        { id: 'af-kili', emoji: '🏔️', zh: '吉力馬札羅山', en: 'Mount Kilimanjaro', local: 'Kilimanjaro', fact: '吉力馬札羅山是非洲最高的山，雖然在赤道旁邊，山頂還是有雪！' },
        { id: 'af-elephant', art: 'elephant', zh: '大象', en: 'Elephant', local: 'tembo', fact: '大象一家人在山腳下的草原散步，最大的象媽媽會帶路！' },
      ],
    },
    {
      id: 'uganda', country: 'uganda', zh: '布恩迪森林', en: 'Bwindi Forest', local: 'Bwindi', at: [29.66, -1.05], marker: [25.2, 1.6],
      items: [
        { id: 'af-gorilla', art: 'gorilla', zh: '山地大猩猩', en: 'Mountain Gorilla', local: 'gorila', fact: '烏干達的森林裡住著山地大猩猩，牠們一家人很溫柔，會一起吃樹葉！' },
        { id: 'af-chimp', art: 'chimpanzee', zh: '黑猩猩', en: 'Chimpanzee', local: 'sokwe', fact: '黑猩猩很聰明，會用樹枝釣白蟻來吃！' },
      ],
    },
    {
      id: 'okavango', country: 'botswana', zh: '奧卡萬戈三角洲', en: 'Okavango Delta', local: 'Okavango', at: [22.9, -19.3],
      items: [
        { id: 'af-hippo', art: 'hippo', zh: '河馬', en: 'Hippo', local: 'kubu', fact: '河馬白天泡在水裡，只露出眼睛、耳朵和鼻孔！' },
        { id: 'af-cheetah', art: 'cheetah', zh: '獵豹', en: 'Cheetah', fact: '獵豹是跑最快的動物，跑起來比高速公路上的汽車還快！' },
        { id: 'af-meerkat', art: 'meerkat', zh: '狐獴', en: 'Meerkat', fact: '狐獴會用後腳站得直直的，幫家人看看有沒有危險！' },
      ],
    },
    {
      id: 'capetown', country: 'south-africa', zh: '開普敦', en: 'Cape Town', local: 'eKapa', at: [18.42, -33.92],
      items: [
        { id: 'af-penguin', art: 'penguin', zh: '非洲企鵝', en: 'African Penguin', fact: '開普敦的海灘上住著企鵝，在溫暖的非洲也有企鵝喔！' },
        { id: 'af-whale', art: 'whale', zh: '鯨魚', en: 'Whale', fact: '冬天的時候，鯨魚會游到南非的海邊，在岸上就看得到牠們噴水！' },
        { id: 'af-table', emoji: '⛰️', zh: '桌山', en: 'Table Mountain', fact: '開普敦的桌山頂是平平的，像一張大桌子，雲飄過來就像鋪了桌巾！' },
      ],
    },
    {
      id: 'madagascar', country: 'madagascar', zh: '馬達加斯加', en: 'Madagascar', local: 'Madagasikara', at: [45.5, -19.8], marker: [48.5, -23.5],
      items: [
        { id: 'af-lemur', art: 'lemur', zh: '狐猴', en: 'Lemur', local: 'varika', fact: '狐猴只住在馬達加斯加，尾巴有一圈一圈的黑白條紋！' },
        { id: 'af-baobab', art: 'baobab', zh: '猴麵包樹', en: 'Baobab Tree', local: 'renala', fact: '猴麵包樹的樹幹又粗又高，可以把好多水存在樹幹裡！' },
        { id: 'af-chameleon', emoji: '🦎', zh: '變色龍', en: 'Chameleon', local: 'tanalahy', fact: '變色龍會變換身上的顏色，舌頭伸出來比身體還長！' },
      ],
    },
  ],
};
