// 🌵 墨西哥中美洲之旅的資料（region.html?r=central-america 會讀這個檔），格式見 regions/europe.js
//
// 墨西哥、貝里斯、瓜地馬拉、哥斯大黎加、巴拿馬
// 坐真的路線：
//   銅峽谷火車 Chepe：吉娃娃→夸烏特莫克→克雷爾→迪維薩德羅（銅峽谷）
//   馬雅列車 Tren Maya（2023 年通車）：帕倫克→埃斯卡塞加→坎佩切→梅里達→奇琴伊察→坎昆，
//     南邊那條：埃斯卡塞加→切圖馬爾→巴卡拉爾→圖盧姆→坎昆
//   切圖馬爾坐水上計程車到貝里斯的聖佩德羅島，再坐船到貝里斯市，坐巴士過邊界到提卡爾
//   巴拿馬運河鐵路：巴拿馬市→加通船閘（運河邊）
//   其他：墨西哥市坐巴士到帝王斑蝶保護區、瓜達拉哈拉；坐飛機去吉娃娃、帕倫克、哥斯大黎加、巴拿馬
// 國界是手畫的大概形狀（給小朋友看的，不是精確的國界），海岸線用主地圖的陸地裁出來
// 每個國家用自己的語言打招呼：西班牙語（貝里斯說英語）
window.REGIONS = window.REGIONS || {};

REGIONS['central-america'] = {
  id: 'central-america',
  title: { zh: '墨西哥中美洲之旅', en: 'Mexico & Central America Trip' },
  sea: '#4fb8e0',
  landFar: '#ece6d4',
  vehicle: 'train',
  roadVehicle: 'bus',
  lang3: 'local',
  loop: false,
  bounds: [-110, 7, -77, 31],
  hint: '👆 點一個地方，出發去墨西哥和中美洲！',
  doneSay: '墨西哥中美洲之旅完成！你好厲害！',
  countries: [
    { id: 'mexico', zh: '墨西哥', en: 'Mexico', color: '#f4c98a', lang: 'es-MX', hello: '¡Hola!', flag: ['mx'],
      polys: [[
        [-118.0, 32.6], [-117.1, 32.53], [-114.7, 32.72], [-111.1, 31.33], [-108.2, 31.33], [-108.2, 31.78], [-106.5, 31.78],
        [-104.9, 30.6], [-104.0, 29.3], [-103.1, 29.0], [-102.4, 29.8], [-101.4, 29.77], [-100.3, 28.3], [-99.5, 27.5], [-97.15, 25.95],
        [-96.0, 26.0], [-96.5, 22.0], [-95.5, 19.0], [-94.0, 18.6], [-91.0, 19.2], [-90.6, 21.6], [-87.0, 22.2], [-86.4, 21.6],
        [-86.9, 20.0], [-87.4, 18.6], [-87.85, 18.2], [-88.3, 18.48], [-89.15, 17.95], [-89.15, 17.82], [-90.98, 17.82],
        [-90.98, 17.25], [-91.44, 17.25], [-90.45, 16.07], [-91.73, 16.07], [-92.21, 15.26], [-92.23, 14.53], [-93.0, 14.3],
        [-100.0, 15.3], [-106.0, 19.8], [-110.0, 22.3], [-112.0, 24.0], [-116.0, 28.0],
      ]] },
    { id: 'belize', zh: '貝里斯', en: 'Belize', color: '#a8d8b0', lang: 'en-BZ', hello: 'Hello', flag: ['bz'],
      polys: [[[-88.3, 18.48], [-87.85, 18.2], [-87.2, 17.0], [-88.2, 15.85], [-89.22, 15.9], [-89.15, 17.82], [-89.15, 17.95]]] },
    { id: 'guatemala', zh: '瓜地馬拉', en: 'Guatemala', color: '#cdb8e8', lang: 'es-GT', hello: '¡Hola!', flag: ['v', '#4997D0', '#ffffff', '#4997D0'],
      polys: [[
        [-89.15, 17.82], [-89.22, 15.9], [-88.6, 15.95], [-88.2, 15.72], [-89.15, 15.07], [-89.35, 14.42], [-89.58, 14.2],
        [-90.1, 13.75], [-90.1, 13.4], [-92.3, 14.3], [-92.23, 14.53], [-92.21, 15.26], [-91.73, 16.07], [-90.45, 16.07],
        [-91.44, 17.25], [-90.98, 17.25], [-90.98, 17.82],
      ]] },
    { id: 'costarica', zh: '哥斯大黎加', en: 'Costa Rica', color: '#f2a07b', lang: 'es-CR', hello: '¡Pura vida!', flag: ['h', '#002B7F', '#ffffff', '#CE1126', '#CE1126', '#ffffff', '#002B7F'],
      polys: [[
        [-86.2, 11.1], [-85.69, 11.07], [-84.9, 10.95], [-84.2, 10.79], [-83.65, 10.93], [-83.0, 11.0], [-82.4, 9.8], [-82.56, 9.57],
        [-82.93, 9.47], [-82.9, 8.03], [-83.5, 7.8], [-86.2, 9.5],
      ]] },
    { id: 'panama', zh: '巴拿馬', en: 'Panama', color: '#f3e08a', lang: 'es-PA', hello: '¡Hola!', flag: ['pa'],
      polys: [[
        [-82.56, 9.57], [-82.2, 9.7], [-80.0, 9.9], [-77.4, 8.8], [-77.37, 8.67], [-77.2, 7.9], [-77.9, 7.2], [-78.2, 6.8],
        [-80.5, 6.8], [-82.9, 7.8], [-82.93, 9.47],
      ]] },
  ],
  junctions: {
    chihuahua: [-106.08, 28.63], escarcega: [-90.74, 18.61], merida: [-89.62, 20.97], chetumal: [-88.3, 18.5],
    tulum: [-87.46, 20.21], belizecity: [-88.19, 17.5],
  },
  lines: [
    { name: '巴士（墨西哥市→帝王斑蝶保護區→瓜達拉哈拉）', mode: 'road', path: ['mexicocity', [-99.66, 19.29], 'monarca', [-101.19, 19.7], [-102.5, 20.3], 'guadalajara'] },
    { name: '飛機（墨西哥市→吉娃娃）', mode: 'air', path: ['mexicocity', 'chihuahua'] },
    { name: '銅峽谷火車 Chepe（吉娃娃→銅峽谷）', path: ['chihuahua', [-106.87, 28.41], [-107.63, 27.75], 'coppercanyon'] },
    { name: '飛機（墨西哥市→帕倫克）', mode: 'air', path: ['mexicocity', 'palenque'] },
    { name: '馬雅列車（帕倫克→梅里達→奇琴伊察→坎昆）', path: ['palenque', [-91.3, 18.1], 'escarcega', [-90.53, 19.85], 'merida', [-89.02, 20.93], 'chichen', [-88.2, 20.69], 'cancun'] },
    { name: '馬雅列車（埃斯卡塞加→切圖馬爾→圖盧姆→坎昆）', path: ['escarcega', [-89.5, 18.5], 'chetumal', [-88.4, 18.68], [-87.75, 19.6], 'tulum', [-87.07, 20.63], 'cancun'] },
    { name: '水上計程車（切圖馬爾→聖佩德羅島）', mode: 'boat', vehicle: 'speedboat', path: ['chetumal', [-88.05, 18.3], 'belize'] },
    { name: '船（聖佩德羅島→貝里斯市）', mode: 'boat', vehicle: 'speedboat', path: ['belize', [-88.05, 17.7], 'belizecity'] },
    { name: '巴士（貝里斯市→弗洛雷斯→提卡爾）', mode: 'road', path: ['belizecity', [-88.77, 17.25], [-89.07, 17.16], [-89.89, 16.93], 'tikal'] },
    { name: '飛機（提卡爾→哥斯大黎加）', mode: 'air', path: ['tikal', 'costarica'] },
    { name: '飛機（哥斯大黎加→巴拿馬）', mode: 'air', path: ['costarica', 'panama'] },
    { name: '巴拿馬運河鐵路（巴拿馬市→加通船閘）', path: ['panama', [-79.65, 9.12], [-79.8, 9.2], 'canal'] },
  ],
  stops: [
    {
      id: 'mexicocity', country: 'mexico', zh: '墨西哥市', en: 'Mexico City', local: 'Ciudad de México', at: [-99.13, 19.43],
      items: [
        { id: 'ca-axolotl', art: 'axolotl', zh: '墨西哥鈍口螈', en: 'Axolotl', local: 'ajolote', fact: '墨西哥鈍口螈（六角恐龍）是粉紅色的，頭上有毛毛的鰓，臉上好像一直在笑！' },
        { id: 'ca-tacos', emoji: '🌮', zh: '塔可', en: 'Tacos', local: 'tacos', fact: '墨西哥人用軟軟的玉米餅包肉、洋蔥和香菜，捲起來就是塔可！' },
        { id: 'ca-trajinera', emoji: '🛶', zh: '彩色的船', en: 'Trajinera Boats', local: 'trajinera', fact: '墨西哥市的霍奇米爾科有好多彩色的平底船，大家坐在船上聽音樂、吃東西！' },
      ],
    },
    {
      id: 'monarca', country: 'mexico', zh: '帝王斑蝶保護區', en: 'Monarch Butterfly Reserve', local: 'Santuario de la Mariposa Monarca', at: [-100.27, 19.6], vehicle: 'bus', marker: [-101.0, 18.0],
      items: [
        { id: 'ca-monarch', emoji: '🦋', zh: '帝王斑蝶', en: 'Monarch Butterfly', local: 'mariposa monarca', fact: '每年冬天，好幾億隻帝王斑蝶從加拿大飛四千公里來這裡過冬，樹上掛滿了橘色的蝴蝶！' },
        { id: 'ca-fir', emoji: '🌲', zh: '冷杉森林', en: 'Fir Forest', local: 'bosque de oyamel', fact: '蝴蝶們會一串一串地掛在冷杉樹上，擠在一起取暖！' },
      ],
    },
    {
      id: 'guadalajara', country: 'mexico', zh: '瓜達拉哈拉', en: 'Guadalajara', local: 'Guadalajara', at: [-103.35, 20.67], vehicle: 'bus',
      items: [
        { id: 'ca-mariachi', emoji: '🎺', zh: '街頭樂隊', en: 'Mariachi', local: 'mariachi', fact: '瓜達拉哈拉是街頭樂隊的故鄉，大家戴著大帽子，一起吹小號、彈吉他、唱歌！' },
        { id: 'ca-charro', art: 'horse', zh: '墨西哥牛仔', en: 'Charro', local: 'charro', fact: '墨西哥牛仔穿著漂亮的衣服，騎著馬表演甩繩子！' },
      ],
    },
    {
      id: 'coppercanyon', country: 'mexico', zh: '銅峽谷', en: 'Copper Canyon', local: 'Barrancas del Cobre', at: [-107.76, 27.53],
      items: [
        { id: 'ca-canyon', emoji: '🏜️', zh: '大峽谷', en: 'Canyons', local: 'barrancas', fact: '銅峽谷是好幾個峽谷連在一起，比美國的大峽谷還要大、還要深！' },
        { id: 'ca-chepe', art: 'train', zh: '峽谷火車', en: 'Chepe Train', local: 'El Chepe', fact: '銅峽谷火車要穿過八十幾條隧道、過三十幾座橋，沿路都是懸崖！' },
        { id: 'ca-runner', emoji: '🏃', zh: '會跑步的人', en: 'Rarámuri Runners', local: 'rarámuri', fact: '住在峽谷裡的塔拉烏馬拉人很會跑步，穿著涼鞋可以跑一整天！' },
      ],
    },
    {
      id: 'palenque', country: 'mexico', zh: '帕倫克', en: 'Palenque', local: 'Palenque', at: [-91.98, 17.51], vehicle: 'airplane',
      items: [
        { id: 'ca-jungleruins', emoji: '🏛️', zh: '森林裡的古城', en: 'Jungle Ruins', local: 'zona arqueológica', fact: '帕倫克是馬雅人的古城，藏在熱帶雨林裡，旁邊還有小瀑布！' },
        { id: 'ca-toucan', art: 'toucan', zh: '巨嘴鳥', en: 'Toucan', local: 'tucán', fact: '巨嘴鳥的嘴巴又大又彩色，可是很輕，裡面像海綿一樣！' },
      ],
    },
    {
      id: 'chichen', country: 'mexico', zh: '奇琴伊察', en: 'Chichén Itzá', local: 'Chichén Itzá', at: [-88.57, 20.68], marker: [-88.9, 22.0],
      items: [
        { id: 'ca-castillo', art: 'maya-pyramid', zh: '馬雅金字塔', en: 'El Castillo Pyramid', local: 'El Castillo', fact: '春分和秋分的下午，太陽照在金字塔的樓梯上，影子看起來像一條大蛇爬下來！' },
        { id: 'ca-cenote', emoji: '🏊', zh: '天然井', en: 'Cenote', local: 'cenote', fact: '猶加敦半島的地底下有好多藍藍的天然水井，可以下去游泳！' },
      ],
    },
    {
      id: 'cancun', country: 'mexico', zh: '坎昆', en: 'Cancún', local: 'Cancún', at: [-86.85, 21.16], marker: [-86.0, 22.4],
      items: [
        { id: 'ca-turtle', art: 'sea-turtle', zh: '海龜', en: 'Sea Turtle', local: 'tortuga marina', fact: '坎昆附近的海灘，晚上海龜媽媽會爬上來生蛋，小海龜孵出來會自己爬回海裡！' },
        { id: 'ca-beach', emoji: '🏖️', zh: '白色沙灘', en: 'White Beach', local: 'playa', fact: '坎昆的沙子白白細細的，海水是漂亮的藍綠色！' },
      ],
    },
    {
      id: 'belize', country: 'belize', zh: '貝里斯堡礁', en: 'Belize Barrier Reef', local: 'San Pedro', at: [-87.96, 17.92], vehicle: 'speedboat', marker: [-86.6, 17.3],
      items: [
        { id: 'ca-bluehole', emoji: '🌊', zh: '大藍洞', en: 'Great Blue Hole', local: 'Great Blue Hole', fact: '貝里斯的海上有一個圓圓的深藍色大洞，從天上看像一顆藍眼睛！' },
        { id: 'ca-shark', art: 'shark', zh: '護士鯊', en: 'Nurse Shark', local: 'nurse shark', fact: '貝里斯的珊瑚礁有好多溫和的護士鯊，會在海底慢慢游、睡午覺！' },
      ],
    },
    {
      id: 'tikal', country: 'guatemala', zh: '提卡爾', en: 'Tikal', local: 'Tikal', at: [-89.62, 17.22], vehicle: 'bus', marker: [-90.4, 15.9],
      items: [
        { id: 'ca-jaguar', art: 'jaguar', zh: '美洲豹', en: 'Jaguar', local: 'jaguar', fact: '提卡爾最高的神廟叫做「大美洲豹神廟」，森林裡真的住著美洲豹！' },
        { id: 'ca-macaw', art: 'parrot', zh: '金剛鸚鵡', en: 'Macaw', local: 'guacamaya', fact: '金剛鸚鵡的羽毛紅、黃、藍好鮮豔，會一對一對地飛過森林！' },
        { id: 'ca-cacao', emoji: '🍫', zh: '可可', en: 'Cacao', local: 'cacao', fact: '很久很久以前，馬雅人就會把可可豆做成熱熱的巧克力飲料！' },
      ],
    },
    {
      id: 'costarica', country: 'costarica', zh: '哥斯大黎加', en: 'Costa Rica', local: 'Costa Rica', at: [-84.7, 10.46], vehicle: 'airplane',
      items: [
        { id: 'ca-sloth', art: 'sloth', zh: '樹懶', en: 'Sloth', local: 'perezoso', fact: '樹懶整天倒掛在樹上睡覺，動作好慢好慢，一個禮拜才下樹一次！' },
        { id: 'ca-dartfrog', art: 'frog', zh: '箭毒蛙', en: 'Poison Dart Frog', local: 'rana dardo', fact: '箭毒蛙小小的、顏色很鮮豔，是在告訴別的動物「我有毒，不要吃我」！' },
        { id: 'ca-arenal', emoji: '🌋', zh: '阿雷納火山', en: 'Arenal Volcano', local: 'Volcán Arenal', fact: '阿雷納火山尖尖的像一個圓錐，山腳下還有熱熱的溫泉！' },
      ],
    },
    {
      id: 'panama', country: 'panama', zh: '巴拿馬市', en: 'Panama City', local: 'Ciudad de Panamá', at: [-79.52, 8.98], vehicle: 'airplane', marker: [-78.8, 8.0],
      items: [
        { id: 'ca-harpy', art: 'eagle', zh: '角鵰', en: 'Harpy Eagle', local: 'águila harpía', fact: '巴拿馬的國鳥是角鵰，爪子跟熊的爪子一樣大，可以抓樹上的樹懶！' },
        { id: 'ca-hat', emoji: '👒', zh: '巴拿馬草帽', en: 'Panama Hat', local: 'sombrero panamá', fact: '巴拿馬草帽是用草編的，以前蓋運河的工人都戴著它遮太陽！' },
      ],
    },
    {
      id: 'canal', country: 'panama', zh: '巴拿馬運河', en: 'Panama Canal', local: 'Canal de Panamá', at: [-79.92, 9.27], marker: [-80.6, 10.4],
      items: [
        { id: 'ca-ship', art: 'ship', zh: '過運河的大船', en: 'Ship in the Canal', local: 'barco', fact: '大船過巴拿馬運河，要進到船閘裡，水慢慢變高，像坐電梯一樣把船抬上山！' },
        { id: 'ca-croc', art: 'crocodile', zh: '鱷魚', en: 'Crocodile', local: 'cocodrilo', fact: '運河中間的加通湖裡住著鱷魚，常常在岸邊曬太陽！' },
      ],
    },
  ],
};
