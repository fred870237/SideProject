// 🥥 太平洋小島之旅的資料（region.html?r=pacific 會讀這個檔），格式見 regions/europe.js
//
// 斐濟和大溪地（法屬玻里尼西亞）：珊瑚礁、獨木舟、會游泳的海龜和鯨魚
// 坐真的路線：
//   斐濟：楠迪坐巴士走國王大道（Queens Road）經過錫加托卡到首都蘇瓦
//   錫加托卡附近坐以前載甘蔗的小火車（Coral Coast Railway）到納塔多拉海灘
//   楠迪坐黃色的大船 Yasawa Flyer 去亞薩瓦群島
//   蘇瓦坐渡輪經過薩武薩武到塔韋烏尼島（換日線經過的島）
//   楠迪坐飛機到大溪地的帕皮提，再坐渡輪去茉莉亞島、坐小飛機去波拉波拉島
// 斐濟橫跨東經 180 度，所以經度用 177～180.1 一直算下去，不換成負的；
// 主地圖的海岸線太粗，這些小島都看不到，所以用 ownLand 自己畫島
// 大溪地離斐濟很遠，照美國之旅放夏威夷的做法，搬到旁邊用虛線小框框起來（insets）
window.REGIONS = window.REGIONS || {};

// 把大溪地附近的點搬進右邊的小框框
const TAHITI = ([lon, lat]) => [+(lon + 333.14).toFixed(2), lat];
// 大溪地的島用黃色，跟斐濟分開
const TAHITI_ISLE = (pts) => ({ fill: '#f6d58a', pts: pts.map(TAHITI) });

REGIONS.pacific = {
  id: 'pacific',
  title: { zh: '太平洋小島之旅', en: 'Pacific Islands Trip' },
  sea: '#4fc3e8',
  land: '#b9dc9a',
  vehicle: 'train',
  roadVehicle: 'bus',
  lang3: 'local',
  loop: false,
  ownLand: true,
  bounds: [176.6, -19.4, 184.8, -15.4],
  hint: '👆 點一個島，出發去南太平洋！',
  doneSay: '太平洋小島之旅完成！你好厲害！',
  countries: [
    { id: 'fiji', zh: '斐濟', en: 'Fiji', lang: 'en-US', hello: 'Bula', flag: ['fj'], polys: [] },
    { id: 'tahiti', zh: '法屬玻里尼西亞', en: 'French Polynesia', lang: 'fr-FR', hello: 'Ia ora na', flag: ['pf'], polys: [] },
  ],
  islands: [
    // 斐濟：維提島、瓦努阿島、塔韋烏尼島、坎達武島、奧瓦勞島、亞薩瓦群島和馬馬努卡群島
    [[177.27, -17.75], [177.42, -17.55], [177.6, -17.42], [177.9, -17.35], [178.2, -17.33], [178.45, -17.52], [178.65, -17.8], [178.7, -18.05], [178.5, -18.17], [178.2, -18.2], [177.9, -18.28], [177.6, -18.2], [177.38, -18.05]],
    [[178.5, -16.8], [178.75, -16.55], [179.0, -16.42], [179.4, -16.27], [179.8, -16.15], [180.0, -16.2], [179.95, -16.45], [179.6, -16.65], [179.3, -16.82], [178.9, -16.9], [178.65, -16.95]],
    [[179.85, -16.65], [180.05, -16.75], [180.1, -16.95], [179.98, -17.05], [179.88, -16.85]],
    [[177.95, -19.0], [178.3, -18.98], [178.5, -19.05], [178.25, -19.12], [178.0, -19.12]],
    [[178.75, -17.62], [178.83, -17.63], [178.84, -17.75], [178.76, -17.76]],
    [[177.08, -17.25], [177.16, -17.24], [177.16, -17.34], [177.09, -17.33]],
    [[177.2, -17.08], [177.28, -17.1], [177.27, -17.2], [177.2, -17.17]],
    [[177.35, -16.9], [177.42, -16.88], [177.55, -16.7], [177.52, -16.66], [177.36, -16.84]],
    [[177.12, -17.62], [177.17, -17.6], [177.17, -17.66], [177.12, -17.67]],
    [[177.25, -17.7], [177.29, -17.69], [177.29, -17.74], [177.25, -17.74]],
    // 大溪地（搬過的位置）：波拉波拉島外面先畫一圈淺藍色的潟湖
    { fill: '#a8ece6', pts: [[-151.85, -16.42], [-151.68, -16.42], [-151.65, -16.55], [-151.75, -16.6], [-151.85, -16.52]].map(TAHITI) },
    TAHITI_ISLE([[-151.78, -16.45], [-151.72, -16.47], [-151.7, -16.53], [-151.76, -16.55]]),
    TAHITI_ISLE([[-149.93, -17.48], [-149.78, -17.47], [-149.75, -17.55], [-149.82, -17.6], [-149.93, -17.57]]),
    TAHITI_ISLE([[-149.62, -17.55], [-149.5, -17.5], [-149.35, -17.52], [-149.28, -17.62], [-149.3, -17.72], [-149.15, -17.73], [-149.15, -17.85], [-149.3, -17.85], [-149.35, -17.78], [-149.5, -17.78], [-149.62, -17.68]]),
  ],
  insets: [{ box: [180.9, -18.3, 184.5, -15.95], label: '大溪地（法屬玻里尼西亞）' }],
  junctions: {
    savusavu: [179.33, -16.78],
  },
  lines: [
    { name: '巴士（國王大道：楠迪→錫加托卡→蘇瓦）', mode: 'road', path: ['nadi', [177.42, -17.95], 'sigatoka', [177.9, -18.22], [178.2, -18.2], 'suva'] },
    { name: '甘蔗小火車（錫加托卡→納塔多拉）', path: ['sigatoka', [177.42, -18.16], 'natadola'] },
    { name: '黃色大船 Yasawa Flyer（楠迪→亞薩瓦群島）', mode: 'boat', path: ['nadi', [177.3, -17.65], [177.15, -17.42], [177.3, -17.15], 'yasawa'] },
    { name: '渡輪（蘇瓦→薩武薩武→塔韋烏尼）', mode: 'boat', path: ['suva', [178.75, -18.0], [178.95, -17.4], [179.2, -17.0], 'savusavu', [179.65, -16.85], 'taveuni'] },
    { name: '飛機（楠迪→大溪地）', mode: 'air', path: ['nadi', 'papeete'] },
    { name: '渡輪（大溪地→茉莉亞島）', mode: 'boat', path: ['papeete', 'moorea'] },
    { name: '小飛機（大溪地→波拉波拉島）', mode: 'air', path: ['papeete', 'borabora'] },
  ],
  stops: [
    {
      id: 'nadi', country: 'fiji', zh: '楠迪', en: 'Nadi', local: 'Nadi', at: [177.44, -17.78],
      items: [
        { id: 'fj-bula', emoji: '👋', zh: '說 Bula！', en: 'Say Bula!', local: 'Bula!', fact: '斐濟人見面都會大聲說「Bula！」，意思是祝你健康快樂！' },
        { id: 'fj-orchid', emoji: '🌺', zh: '睡巨人花園', en: 'Garden of the Sleeping Giant', local: 'Sleeping Giant', fact: '山腳下的花園種滿好多種蘭花，後面的山看起來好像一個躺著睡覺的巨人！' },
      ],
    },
    {
      id: 'yasawa', country: 'fiji', zh: '亞薩瓦群島', en: 'Yasawa Islands', local: 'Yasawa', at: [177.38, -16.95], vehicle: 'ship', marker: [177.0, -16.6],
      items: [
        { id: 'fj-ferry', art: 'ship', zh: '黃色大船', en: 'Yasawa Flyer', local: 'Yasawa Flyer', fact: '每天早上有一艘黃色的大船，一個島一個島停下來載客人！' },
        { id: 'fj-iguana', art: 'iguana', zh: '斐濟冠鬣蜥', en: 'Fiji Crested Iguana', local: 'vokai', fact: '斐濟冠鬣蜥是綠色的，身上有白色條紋，生氣的時候會變成黑色！' },
        { id: 'fj-lagoon', emoji: '🏝️', zh: '藍色潟湖', en: 'Blue Lagoon', local: 'Blue Lagoon', fact: '海水清得可以看到底下的珊瑚和小魚，所以叫做藍色潟湖！' },
      ],
    },
    {
      id: 'sigatoka', country: 'fiji', zh: '錫加托卡', en: 'Sigatoka', local: 'Sigatoka', at: [177.5, -18.14], marker: [177.75, -18.6],
      items: [
        { id: 'fj-dunes', emoji: '🏜️', zh: '大沙丘', en: 'Sand Dunes', local: 'Sigatoka Sand Dunes', fact: '海邊有好高好大的沙丘，可以爬上去再一路滑下來！' },
        { id: 'fj-meke', emoji: '💃', zh: '梅克舞', en: 'Meke Dance', local: 'meke', fact: '斐濟人跳梅克舞的時候會一起唱歌、拍手，還會拿著扇子和木棍演故事！' },
      ],
    },
    {
      id: 'natadola', country: 'fiji', zh: '納塔多拉海灘', en: 'Natadola Beach', local: 'Natadola', at: [177.32, -18.1], marker: [176.95, -18.5],
      items: [
        { id: 'fj-canetrain', art: 'train', zh: '甘蔗小火車', en: 'Sugar Cane Train', local: 'Coral Coast Railway', fact: '這條小鐵路以前是用來載甘蔗的，現在可以坐著小火車一路開到白沙灘！' },
        { id: 'fj-horse', art: 'horse', zh: '海灘騎馬', en: 'Beach Horse Ride', local: 'ose', fact: '在長長的白沙灘上騎著小馬，海浪就在旁邊嘩啦嘩啦！' },
      ],
    },
    {
      id: 'suva', country: 'fiji', zh: '蘇瓦', en: 'Suva', local: 'Suva', at: [178.44, -18.14],
      items: [
        { id: 'fj-drua', emoji: '🛶', zh: '雙身獨木舟', en: 'Drua Canoe', local: 'drua', fact: '博物館裡有一艘好大的雙身獨木舟，以前斐濟人就是坐著它在大海上航行！' },
        { id: 'fj-market', emoji: '🍍', zh: '大市場', en: 'Suva Market', local: 'makete', fact: '蘇瓦的大市場賣好多鳳梨、木瓜和香蕉，五顏六色好熱鬧！' },
      ],
    },
    {
      id: 'taveuni', country: 'fiji', zh: '塔韋烏尼島', en: 'Taveuni', local: 'Taveuni', at: [179.97, -16.85], vehicle: 'ship',
      items: [
        { id: 'fj-dateline', emoji: '📅', zh: '換日線', en: 'Date Line', local: 'Date Line', fact: '換日線經過這個島，你可以一腳站在今天，一腳站在昨天！' },
        { id: 'fj-parrot', art: 'parrot', zh: '紅胸鸚鵡', en: 'Red Shining Parrot', local: 'kula', fact: '島上的森林住著紅紅綠綠的鸚鵡，以前牠的紅羽毛好珍貴，用來裝飾衣服！' },
        { id: 'fj-reef', art: 'clownfish', zh: '彩虹珊瑚礁', en: 'Rainbow Reef', local: 'Rainbow Reef', fact: '島旁邊的彩虹礁有好多軟軟的珊瑚，五顏六色像彩虹一樣！' },
      ],
    },
    {
      id: 'papeete', country: 'tahiti', zh: '大溪地', en: 'Tahiti', local: 'Tahiti', at: TAHITI([-149.57, -17.54]), vehicle: 'airplane', marker: [184.05, -17.15],
      items: [
        { id: 'pf-vaa', emoji: '🛶', zh: '外伸架獨木舟', en: "Outrigger Canoe", local: "va'a", fact: '大溪地人最愛划外伸架獨木舟，旁邊多綁一根木頭，船就不會翻！' },
        { id: 'pf-tiare', emoji: '🌼', zh: '提亞蕾花', en: 'Tiare Flower', local: 'tiare', fact: '大溪地人會在耳朵旁邊戴一朵白白的提亞蕾花，聞起來香香的！' },
        { id: 'pf-blacksand', emoji: '🏖️', zh: '黑沙灘', en: 'Black Sand Beach', local: 'one ʻereʻere', fact: '大溪地有黑色的沙灘，因為沙子是火山的石頭磨碎變成的！' },
      ],
    },
    {
      id: 'moorea', country: 'tahiti', zh: '茉莉亞島', en: 'Moorea', local: 'Moʻorea', at: TAHITI([-149.83, -17.53]), vehicle: 'ship', marker: [182.75, -17.85],
      items: [
        { id: 'pf-whale', art: 'whale', zh: '座頭鯨', en: 'Humpback Whale', local: 'tohorā', fact: '每年八月到十月，座頭鯨會游到茉莉亞島旁邊生寶寶！' },
        { id: 'pf-dolphin', art: 'dolphin', zh: '飛旋海豚', en: 'Spinner Dolphin', local: 'ʻōuma', fact: '好多飛旋海豚在海裡轉圈圈，一隻一隻跳出水面！' },
        { id: 'pf-pineapple', emoji: '🍍', zh: '鳳梨田', en: 'Pineapple Fields', local: 'painapo', fact: '茉莉亞島的山谷裡種滿鳳梨，甜甜的好好吃！' },
      ],
    },
    {
      id: 'borabora', country: 'tahiti', zh: '波拉波拉島', en: 'Bora Bora', local: 'Bora Bora', at: TAHITI([-151.74, -16.5]), vehicle: 'airplane',
      items: [
        { id: 'pf-shark', art: 'shark', zh: '黑鰭礁鯊', en: 'Blacktip Reef Shark', local: 'maʻo', fact: '潟湖裡住著小小的黑鰭鯊，牠們很害羞，看到人就游走了！' },
        { id: 'pf-turtle', art: 'sea-turtle', zh: '海龜', en: 'Sea Turtle', local: 'honu', fact: '島上有海龜醫院，會照顧受傷的海龜，好了再把牠們放回大海！' },
        { id: 'pf-bungalow', emoji: '🏝️', zh: '水上小屋', en: 'Overwater Bungalow', local: 'fare', fact: '小房子蓋在清清的海面上，從地板的玻璃窗就可以看到底下游來游去的魚！' },
      ],
    },
  ],
};
