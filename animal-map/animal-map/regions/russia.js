// 🐻 俄羅斯之旅的資料（region.html?r=russia 會讀這個檔），格式見 regions/europe.js
//
// 坐世界上最長的鐵路「西伯利亞鐵路」，從莫斯科一路開到太平洋邊的海參崴（真的要坐一個星期）：
//   莫斯科→弗拉基米爾→下諾夫哥羅德→喀山→彼爾姆→葉卡捷琳堡→秋明→鄂木斯克→新西伯利亞→克拉斯諾亞爾斯克
//   →伊爾庫茨克（貝加爾湖）→烏蘭烏德→赤塔→伯力→海參崴
// 莫斯科到聖彼得堡坐「遊隼號」高鐵；海參崴到堪察加半島坐飛機
// 俄羅斯好寬，地圖又寬又扁（region.js 會自動把車站和火車放大）；國界是手畫的大概形狀，海岸線用主地圖的陸地裁出來
// 當地語言是俄語，字是西里爾字母；裝置沒有俄語的語音就不唸，只顯示
window.REGIONS = window.REGIONS || {};

REGIONS.russia = {
  id: 'russia',
  title: { zh: '俄羅斯之旅', en: 'Russia Trip' },
  sea: '#5fb4e8',
  landFar: '#e3ecd6',
  vehicle: 'train',
  lang3: 'local',
  loop: false,
  bounds: [27, 41, 162, 72],
  hint: '👆 點一個車站，坐西伯利亞鐵路出發！',
  doneSay: '俄羅斯之旅完成！你好厲害！',
  countries: [
    { id: 'russia', zh: '俄羅斯', en: 'Russia', color: '#b9d3f0', lang: 'ru-RU', hello: 'Привет', flag: ['h', '#ffffff', '#0039A6', '#D52B1E'],
      polys: [[
        [31.2, 70.3], [30.8, 69.8], [28.9, 69.0], [29.3, 68.0], [30.2, 65.6], [29.6, 64.2], [31.5, 62.9], [29.5, 61.5], [27.8, 60.4],
        [28.0, 59.4], [27.5, 58.0], [27.8, 57.3], [28.2, 56.2], [30.9, 55.6], [31.8, 53.8], [31.3, 52.1], [34.4, 51.8], [35.4, 50.6],
        [38.0, 49.9], [40.1, 49.6], [40.0, 48.0], [38.3, 47.3], [37.0, 46.0], [36.5, 45.3], [37.0, 44.5], [39.9, 43.4], [42.0, 43.2],
        [44.5, 42.7], [46.5, 41.9], [48.6, 41.8], [50.0, 45.0], [48.5, 46.6], [47.0, 49.2], [47.5, 50.5], [51.0, 51.7], [55.0, 50.9],
        [58.5, 51.0], [61.0, 52.9], [61.5, 54.0], [65.0, 54.6], [69.0, 55.4], [73.5, 54.0], [76.5, 54.1], [77.9, 53.3], [80.0, 51.0],
        [82.0, 50.8], [85.5, 49.5], [87.3, 49.1], [90.0, 50.5], [94.0, 50.0], [98.0, 50.2], [102.0, 51.2], [106.0, 50.3], [108.0, 49.5],
        [111.0, 49.5], [114.0, 50.2], [116.7, 49.9], [119.0, 50.3], [120.0, 51.6], [121.0, 53.3], [123.0, 53.5], [125.5, 52.7],
        [126.5, 51.8], [127.5, 49.8], [130.0, 48.9], [131.0, 47.7], [133.0, 48.1], [134.7, 48.3], [133.1, 45.1], [131.0, 44.8],
        [131.3, 43.0], [130.6, 42.4], [131.5, 42.0], [134, 42.5], [140, 47], [143, 50], [146, 55], [155, 58], [157, 50], [163, 55],
        [170, 60], [180, 65], [180, 72], [140, 77], [110, 80], [90, 82], [60, 82], [45, 72], [40, 70],
      ]] },
  ],
  lines: [
    { name: '遊隼號高鐵（聖彼得堡→莫斯科）', path: ['stpetersburg', [31.3, 58.5], [34.04, 57.88], [35.9, 56.86], 'moscow'] },
    { name: '西伯利亞鐵路（莫斯科→葉卡捷琳堡）', path: ['moscow', [40.4, 56.13], [44.0, 56.33], 'kazan', [56.25, 58.0], 'yekaterinburg'] },
    { name: '西伯利亞鐵路（葉卡捷琳堡→新西伯利亞）', path: ['yekaterinburg', [65.53, 57.15], [73.37, 54.98], 'novosibirsk'] },
    { name: '西伯利亞鐵路（新西伯利亞→貝加爾湖）', path: ['novosibirsk', [87.0, 55.4], [92.87, 56.01], [99.0, 55.0], 'baikal'] },
    { name: '西伯利亞鐵路（貝加爾湖→海參崴）', path: ['baikal', [107.6, 51.83], [113.5, 52.03], [120.0, 52.0], [127.5, 50.27], [135.07, 48.48], [133.5, 45.5], 'vladivostok'] },
    { name: '飛機（海參崴→堪察加）', mode: 'air', path: ['vladivostok', 'kamchatka'] },
  ],
  stops: [
    {
      id: 'stpetersburg', country: 'russia', zh: '聖彼得堡', en: 'Saint Petersburg', local: 'Санкт-Петербург', at: [30.32, 59.94],
      items: [
        { id: 'ru-palace', emoji: '🏛️', zh: '冬宮', en: 'Winter Palace', local: 'Зимний дворец', fact: '聖彼得堡的冬宮是一座好大的宮殿，裡面有好幾百萬件藝術品！' },
        { id: 'ru-whitenight', emoji: '🌇', zh: '白夜', en: 'White Nights', local: 'белые ночи', fact: '夏天的聖彼得堡到了半夜天空還是亮亮的，叫做「白夜」！' },
      ],
    },
    {
      id: 'moscow', country: 'russia', zh: '莫斯科', en: 'Moscow', local: 'Москва', at: [37.62, 55.75],
      items: [
        { id: 'ru-church', art: 'onion-church', zh: '聖瓦西里大教堂', en: "St. Basil's Cathedral", local: 'храм Василия Блаженного', fact: '莫斯科紅場上的教堂有好多彩色條紋的洋蔥頂，像一盒糖果！' },
        { id: 'ru-matryoshka', art: 'matryoshka', zh: '俄羅斯娃娃', en: 'Matryoshka Doll', local: 'матрёшка', fact: '俄羅斯娃娃打開來，裡面還有一個小一點的娃娃，一個套一個！' },
      ],
    },
    {
      id: 'kazan', country: 'russia', zh: '喀山', en: 'Kazan', local: 'Казань', at: [49.11, 55.79],
      items: [
        { id: 'ru-mosque', emoji: '🕌', zh: '白色的清真寺', en: 'Kul Sharif Mosque', local: 'мечеть', fact: '喀山的城堡裡有一座白色和藍色的清真寺，旁邊就是東正教的教堂！' },
        { id: 'ru-chakchak', emoji: '🍯', zh: '蜂蜜點心', en: 'Chak-chak', local: 'чак-чак', fact: '喀山的點心「恰克恰克」是把小麵條炸過再淋上蜂蜜，甜甜脆脆的！' },
      ],
    },
    {
      id: 'yekaterinburg', country: 'russia', zh: '葉卡捷琳堡', en: 'Yekaterinburg', local: 'Екатеринбург', at: [60.6, 56.84],
      items: [
        { id: 'ru-border', emoji: '🌏', zh: '歐亞分界碑', en: 'Europe–Asia Border', local: 'Европа — Азия', fact: '葉卡捷琳堡旁邊有一塊石碑，站上去可以一隻腳在歐洲、一隻腳在亞洲！' },
        { id: 'ru-gem', emoji: '💎', zh: '寶石', en: 'Gemstones', local: 'самоцветы', fact: '烏拉山裡有好多漂亮的石頭和寶石，綠綠的孔雀石最有名！' },
      ],
    },
    {
      id: 'novosibirsk', country: 'russia', zh: '新西伯利亞', en: 'Novosibirsk', local: 'Новосибирск', at: [82.92, 55.03],
      items: [
        { id: 'ru-squirrel', art: 'squirrel', zh: '松鼠', en: 'Squirrel', local: 'белка', fact: '西伯利亞的森林裡住著好多松鼠，冬天會換上灰灰的厚毛！' },
        { id: 'ru-wolf', art: 'wolf', zh: '狼', en: 'Wolf', local: 'волк', fact: '西伯利亞的狼一群一群地生活，晚上會「嗷嗚」地叫！' },
        { id: 'ru-birch', emoji: '🌳', zh: '白樺樹', en: 'Birch Trees', local: 'берёза', fact: '火車開過西伯利亞，窗外好幾天都是一大片白白的白樺樹林！' },
      ],
    },
    {
      id: 'baikal', country: 'russia', zh: '貝加爾湖', en: 'Lake Baikal', local: 'Байкал', at: [104.28, 52.29],
      items: [
        { id: 'ru-nerpa', art: 'seal', zh: '貝加爾海豹', en: 'Baikal Seal', local: 'нерпа', fact: '貝加爾海豹是世界上唯一只住在淡水湖裡的海豹，眼睛又大又圓！' },
        { id: 'ru-ice', emoji: '🧊', zh: '透明的冰', en: 'Clear Ice', local: 'лёд', fact: '貝加爾湖是世界上最深的湖，冬天結的冰透明得像玻璃一樣！' },
      ],
    },
    {
      id: 'vladivostok', country: 'russia', zh: '海參崴', en: 'Vladivostok', local: 'Владивосток', at: [131.9, 43.12],
      items: [
        { id: 'ru-tiger', art: 'tiger', zh: '東北虎', en: 'Amur Tiger', local: 'амурский тигр', fact: '海參崴附近的森林住著東北虎，牠是世界上最大的老虎！' },
        { id: 'ru-crane', art: 'red-crowned-crane', zh: '丹頂鶴', en: 'Red-crowned Crane', local: 'японский журавль', fact: '丹頂鶴夏天會飛到這附近的濕地生寶寶！' },
        { id: 'ru-train', art: 'train', zh: '終點站', en: 'The Last Station', local: 'вокзал', fact: '海參崴是西伯利亞鐵路的終點，月台上有一塊寫著 9288 公里的牌子！' },
      ],
    },
    {
      id: 'kamchatka', country: 'russia', zh: '堪察加半島', en: 'Kamchatka', local: 'Камчатка', at: [158.65, 53.02], vehicle: 'airplane',
      items: [
        { id: 'ru-bear', art: 'brown-bear', zh: '棕熊', en: 'Brown Bear', local: 'медведь', fact: '堪察加的棕熊會站在河裡，張大嘴巴接住跳起來的鮭魚！' },
        { id: 'ru-volcano', emoji: '🌋', zh: '火山', en: 'Volcanoes', local: 'вулкан', fact: '堪察加半島有好多會冒煙的火山，山頂戴著白白的雪帽！' },
        { id: 'ru-salmon', emoji: '🐟', zh: '鮭魚', en: 'Salmon', local: 'лосось', fact: '每年夏天，好多鮭魚會游回河裡生寶寶，熊就在河邊等著抓魚！' },
      ],
    },
  ],
};
