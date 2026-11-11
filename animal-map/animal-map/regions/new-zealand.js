// 🥝 紐西蘭之旅的資料（region.html?r=new-zealand 會讀這個檔），格式見 regions/europe.js
//
// 紐西蘭有三條有名的觀光火車，加上渡輪和露營車：
//   北方探險家號 奧克蘭→漢米爾頓→國家公園站→北帕默斯頓→威靈頓
//   庫克海峽渡輪（Interislander）威靈頓→皮克頓（從北島坐船到南島）
//   太平洋海岸號 皮克頓→布倫海姆→凱庫拉→基督城
//   高山號（TranzAlpine）基督城→亞瑟隘口→格雷茅斯，穿過南阿爾卑斯山
//   露營車：漢米爾頓→羅托魯瓦、基督城→蒂卡波湖→皇后鎮→蒂阿瑙→米佛峽灣
// 紐西蘭附近沒有別的國家，countries 的外框直接畫一個大方塊，再用主地圖的陸地裁出兩個島
// 打招呼用毛利語 Kia ora，東西下面也是毛利語（裝置沒有毛利語的語音，就用紐西蘭英文的聲音唸）
window.REGIONS = window.REGIONS || {};

REGIONS['new-zealand'] = {
  id: 'new-zealand',
  title: { zh: '紐西蘭之旅', en: 'New Zealand Trip' },
  sea: '#5fb4e8',
  landFar: '#d9eccb',
  vehicle: 'train',
  roadVehicle: 'camper-van',
  lang3: 'local',
  loop: false,
  bounds: [165.8, -47.5, 179, -34.2],
  hint: '👆 點一個地方，坐火車、渡輪、露營車出發！',
  doneSay: '紐西蘭之旅完成！你好厲害！',
  countries: [
    { id: 'new-zealand', zh: '紐西蘭', en: 'New Zealand', color: '#a6dd8f', lang: 'en-NZ', hello: 'Kia ora', flag: ['nz'],
      polys: [[[165, -34], [179.5, -34], [179.5, -48], [165, -48]]] },
  ],
  junctions: {
    hamilton: [175.28, -37.79],
    picton: [174.0, -41.29],
    greymouth: [171.21, -42.45],
  },
  lines: [
    { name: '北方探險家號（奧克蘭→威靈頓）', path: ['auckland', 'hamilton', [175.4, -38.6], [175.4, -39.18], [175.6, -40.35], 'wellington'] },
    { name: '露營車（漢米爾頓→羅托魯瓦）', mode: 'road', path: ['hamilton', [175.8, -37.95], 'rotorua'] },
    { name: '庫克海峽渡輪（威靈頓→皮克頓）', mode: 'boat', path: ['wellington', [174.45, -41.15], 'picton'] },
    { name: '太平洋海岸號（皮克頓→凱庫拉→基督城）', path: ['picton', [173.95, -41.51], 'kaikoura', [172.9, -43.0], 'christchurch'] },
    { name: '高山號（基督城→亞瑟隘口→格雷茅斯）', path: ['christchurch', [172.1, -43.4], 'arthurspass', 'greymouth'] },
    { name: '露營車（基督城→蒂卡波湖→皇后鎮）', mode: 'road', path: ['christchurch', [171.3, -44.0], [170.48, -44.0], [169.8, -44.7], 'queenstown'] },
    { name: '露營車（皇后鎮→蒂阿瑙→米佛峽灣）', mode: 'road', path: ['queenstown', [168.1, -45.4], [167.9, -45.0], 'milford'] },
  ],
  stops: [
    {
      id: 'auckland', country: 'new-zealand', zh: '奧克蘭', en: 'Auckland', local: 'Tāmaki Makaurau', at: [174.76, -36.85], marker: [176.4, -35.6],
      items: [
        { id: 'nz-skytower', emoji: '🗼', zh: '天空塔', en: 'Sky Tower', local: 'Sky Tower', fact: '奧克蘭的天空塔是南半球最高的塔，晚上會變換不同顏色的燈！' },
        { id: 'nz-sailboat', art: 'sailboat', zh: '帆船', en: 'Sailboat', local: 'waka', fact: '奧克蘭被叫做「帆船之都」，港口裡停滿了白色的帆船！' },
      ],
    },
    {
      id: 'rotorua', country: 'new-zealand', zh: '羅托魯瓦', en: 'Rotorua', local: 'Rotorua', at: [176.25, -38.14], vehicle: 'camper-van', marker: [177.6, -37.3],
      items: [
        { id: 'nz-kiwi', art: 'kiwi', zh: '奇異鳥', en: 'Kiwi', local: 'kiwi', fact: '奇異鳥是紐西蘭的國鳥，不會飛，晚上才出來用長長的嘴找蟲吃！' },
        { id: 'nz-geyser', emoji: '♨️', zh: '間歇泉', en: 'Geyser', local: 'puia', fact: '羅托魯瓦的地底下好熱，間歇泉會噴出好高的熱水，空氣裡有硫磺的味道！' },
      ],
    },
    {
      id: 'wellington', country: 'new-zealand', zh: '威靈頓', en: 'Wellington', local: 'Te Whanganui-a-Tara', at: [174.78, -41.29], marker: [176.6, -41.0],
      items: [
        { id: 'nz-cablecar', emoji: '🚋', zh: '紅色纜車', en: 'Cable Car', local: 'cable car', fact: '威靈頓的紅色纜車會爬上山坡，從上面可以看到整個港口！' },
        { id: 'nz-wind', emoji: '🌬️', zh: '大風', en: 'Windy City', local: 'hau', fact: '威靈頓是「風城」，風大到雨傘常常被吹翻！' },
      ],
    },
    {
      id: 'kaikoura', country: 'new-zealand', zh: '凱庫拉', en: 'Kaikōura', local: 'Kaikōura', at: [173.68, -42.4], marker: [175.4, -42.9],
      items: [
        { id: 'nz-spermwhale', art: 'whale', zh: '抹香鯨', en: 'Sperm Whale', local: 'parāoa', fact: '凱庫拉的海很深，抹香鯨會游到岸邊附近，坐船就看得到牠噴水！' },
        { id: 'nz-furseal', art: 'seal', zh: '海狗', en: 'Fur Seal', local: 'kekeno', fact: '凱庫拉的海邊岩石上躺著好多海狗在曬太陽！' },
      ],
    },
    {
      id: 'christchurch', country: 'new-zealand', zh: '基督城', en: 'Christchurch', local: 'Ōtautahi', at: [172.64, -43.53], marker: [174.4, -44.4],
      items: [
        { id: 'nz-garden', emoji: '🌷', zh: '花園城市', en: 'Garden City', local: 'māra', fact: '基督城被叫做「花園城市」，到處都是漂亮的公園和花！' },
        { id: 'nz-punt', emoji: '🛶', zh: '撐篙船', en: 'Punting', local: 'waka', fact: '在基督城的雅芳河上，可以坐平底船慢慢欣賞河邊的風景！' },
      ],
    },
    {
      id: 'arthurspass', country: 'new-zealand', zh: '亞瑟隘口', en: "Arthur's Pass", local: "Arthur's Pass", at: [171.56, -42.94], marker: [169.9, -42.5],
      items: [
        { id: 'nz-kea', art: 'parrot', zh: '啄羊鸚鵡', en: 'Kea', local: 'kea', fact: '啄羊鸚鵡是住在雪山上的鸚鵡，好奇又調皮，會偷咬汽車的雨刷！' },
        { id: 'nz-alps', emoji: '🏔️', zh: '南阿爾卑斯山', en: 'Southern Alps', local: 'maunga', fact: '高山號火車穿過南阿爾卑斯山，窗外都是雪山和峽谷！' },
      ],
    },
    {
      id: 'queenstown', country: 'new-zealand', zh: '皇后鎮', en: 'Queenstown', local: 'Tāhuna', at: [168.66, -45.03], vehicle: 'camper-van', marker: [170.6, -45.5],
      items: [
        { id: 'nz-sheep', art: 'sheep', zh: '綿羊', en: 'Sheep', local: 'hipi', fact: '紐西蘭的綿羊比人還多，草地上到處都是白白的羊！' },
        { id: 'nz-paraglide', emoji: '🪂', zh: '飛行傘', en: 'Paragliding', local: 'paragliding', fact: '在皇后鎮可以坐飛行傘從山上飛下來，看湖和雪山！' },
      ],
    },
    {
      id: 'milford', country: 'new-zealand', zh: '米佛峽灣', en: 'Milford Sound', local: 'Piopiotahi', at: [167.93, -44.67], vehicle: 'camper-van', marker: [166.6, -44.0],
      items: [
        { id: 'nz-fiord', emoji: '⛰️', zh: '峽灣', en: 'Fiord', local: 'maunga', fact: '米佛峽灣兩邊是好高的山壁，下雨的時候到處都是瀑布！' },
        { id: 'nz-penguin', art: 'penguin', zh: '峽灣企鵝', en: 'Fiordland Penguin', local: 'tawaki', fact: '峽灣企鵝的眼睛上面有黃色的眉毛，像戴了一頂帽子！' },
        { id: 'nz-dolphin', art: 'dolphin', zh: '海豚', en: 'Dolphin', local: 'aihe', fact: '坐船遊峽灣的時候，海豚常常會在船旁邊跳來跳去！' },
      ],
    },
  ],
};
