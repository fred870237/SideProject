// 🏝️ 加勒比海跳島之旅的資料（region.html?r=caribbean 會讀這個檔），格式見 regions/europe.js
//
// 古巴、牙買加、巴哈馬、多明尼加、波多黎各
// 坐真的路線：
//   哈瓦那坐火車往東，經過聖克拉拉、卡馬圭到聖地牙哥（古巴的中央鐵路）
//   哈瓦那坐老爺車計程車到比尼亞萊斯
//   島和島之間大多坐飛機：哈瓦那→金斯敦、哈瓦那→拿索、金斯敦→聖多明哥
//   牙買加坐 Knutsford Express 巴士從金斯敦到奧丘里奧斯
//   拿索坐快艇去埃克蘇馬看游泳的小豬
//   多明尼加坐巴士到薩馬納看鯨魚；聖多明哥坐過夜的渡輪到波多黎各的聖胡安
// 國界是手畫的大框框，被 MAP_LAND 的海岸線剪掉；海地沒有去，留淡色
window.REGIONS = window.REGIONS || {};

REGIONS.caribbean = {
  id: 'caribbean',
  title: { zh: '加勒比海跳島之旅', en: 'Caribbean Island Hopping' },
  sea: '#4fc3e8',
  landFar: '#ece6d2',
  vehicle: 'train',
  roadVehicle: 'bus',
  lang3: 'local',
  loop: false,
  bounds: [-85.5, 16.8, -64.5, 27],
  hint: '👆 點一個島，出發去加勒比海！',
  doneSay: '加勒比海跳島之旅完成！你好厲害！',
  countries: [
    { id: 'cuba', zh: '古巴', en: 'Cuba', color: '#b9dc9a', lang: 'es-ES', hello: 'Hola', flag: ['cu'],
      polys: [[[-85.2, 22.0], [-84.5, 23.3], [-82, 23.4], [-80, 23.4], [-77.5, 22.4], [-75.5, 21.5], [-74, 20.4], [-74, 19.8], [-77.7, 19.7], [-78.5, 21.3], [-81, 21.5], [-82.5, 21.3], [-84.5, 21.5]]] },
    { id: 'jamaica', zh: '牙買加', en: 'Jamaica', color: '#f6d58a', lang: 'en-GB', hello: 'Wah gwaan', flag: ['jm'],
      polys: [[[-78.6, 17.5], [-78.6, 18.8], [-76, 18.8], [-76, 17.5]]] },
    { id: 'bahamas', zh: '巴哈馬', en: 'Bahamas', color: '#9fe0d8', lang: 'en-US', hello: 'Hello', flag: ['bs'],
      polys: [[[-79.6, 27.5], [-72.7, 27.5], [-72.7, 20.7], [-74, 20.9], [-75.5, 21.9], [-77.5, 22.6], [-79.6, 23.6]]] },
    { id: 'dominican', zh: '多明尼加', en: 'Dominican Republic', color: '#f6b9a4', lang: 'es-ES', hello: 'Hola', flag: ['do'],
      polys: [[[-71.75, 20.2], [-68, 20.2], [-68, 17.4], [-71.8, 17.4], [-71.75, 18.04], [-71.7, 18.6], [-71.8, 18.95], [-71.6, 19.15], [-71.7, 19.7]]] },
    { id: 'puertorico', zh: '波多黎各', en: 'Puerto Rico', color: '#cdb8e8', lang: 'es-ES', hello: 'Hola', flag: ['pr'],
      polys: [[[-67.5, 18.7], [-65.2, 18.7], [-65.2, 17.8], [-67.5, 17.8]]] },
  ],
  // 主地圖的海岸線沒有巴哈馬群島，自己補畫主要的島（安德羅斯、新普羅維登斯、大巴哈馬、阿巴科、伊柳塞拉、埃克蘇馬、卡特島、長島、伊納瓜）
  islands: [
    [[-78.3, 25.2], [-77.85, 25.1], [-77.7, 24.6], [-77.75, 24.2], [-77.95, 23.9], [-78.3, 24.3], [-78.45, 24.7]],
    [[-77.55, 25.1], [-77.25, 25.1], [-77.25, 24.97], [-77.55, 24.98]],
    [[-79.0, 26.7], [-78.6, 26.78], [-78.0, 26.72], [-77.95, 26.6], [-78.6, 26.5], [-79.0, 26.55]],
    [[-77.4, 26.9], [-77.0, 26.6], [-77.1, 26.2], [-77.25, 25.85], [-77.42, 26.2], [-77.55, 26.85]],
    [[-76.75, 25.58], [-76.4, 25.35], [-76.15, 25.0], [-76.1, 24.62], [-76.3, 24.7], [-76.4, 25.05], [-76.65, 25.32]],
    [[-76.82, 24.72], [-76.55, 24.42], [-76.05, 23.72], [-75.82, 23.42], [-75.72, 23.48], [-75.92, 23.82], [-76.42, 24.45], [-76.72, 24.76]],
    [[-75.8, 24.68], [-75.52, 24.2], [-75.42, 24.25], [-75.72, 24.72]],
    [[-75.3, 23.68], [-75.05, 23.3], [-74.85, 22.85], [-74.92, 22.78], [-75.2, 23.2]],
    [[-73.75, 21.22], [-73.15, 21.22], [-73.02, 21.0], [-73.6, 20.93]],
  ].map((pts) => ({ fill: '#9fe0d8', pts })),
  junctions: {
    santaclara: [-79.96, 22.4], camaguey: [-77.92, 21.38],
  },
  lines: [
    { name: '火車（哈瓦那→聖克拉拉→卡馬圭→聖地牙哥）', path: ['havana', [-81.6, 22.85], 'santaclara', [-78.8, 21.9], 'camaguey', [-76.95, 20.96], [-76.2, 20.45], 'santiago'] },
    { name: '老爺車（哈瓦那→比尼亞萊斯）', mode: 'road', vehicle: 'car', path: ['havana', [-83.0, 22.85], 'vinales'] },
    { name: '飛機（哈瓦那→金斯敦）', mode: 'air', path: ['havana', 'kingston'] },
    { name: '飛機（哈瓦那→拿索）', mode: 'air', path: ['havana', 'nassau'] },
    { name: '飛機（金斯敦→聖多明哥）', mode: 'air', path: ['kingston', 'santodomingo'] },
    { name: '巴士（金斯敦→奧丘里奧斯）', mode: 'road', path: ['kingston', [-76.95, 18.2], 'ochorios'] },
    { name: '快艇（拿索→埃克蘇馬）', mode: 'boat', vehicle: 'speedboat', path: ['nassau', [-76.8, 24.7], 'exuma'] },
    { name: '巴士（聖多明哥→薩馬納）', mode: 'road', path: ['santodomingo', [-69.6, 18.75], [-69.6, 19.05], 'samana'] },
    { name: '渡輪（聖多明哥→聖胡安）', mode: 'boat', path: ['santodomingo', [-68.5, 18.15], [-67.8, 18.6], [-67.1, 18.7], [-66.4, 18.62], 'sanjuan'] },
  ],
  stops: [
    {
      id: 'havana', country: 'cuba', zh: '哈瓦那', en: 'Havana', local: 'La Habana', at: [-82.37, 23.12],
      items: [
        { id: 'cb-oldcar', art: 'car', zh: '彩色老爺車', en: 'Classic Cars', local: 'carros clásicos', fact: '哈瓦那的街上跑著好多七十年前的彩色老爺車，還可以坐上去兜風！' },
        { id: 'cb-malecon', emoji: '🌊', zh: '海堤', en: 'The Malecón', local: 'el Malecón', fact: '大家晚上坐在長長的海堤上吹海風，大浪打過來會濺得好高！' },
        { id: 'cb-beebird', emoji: '🐦', zh: '吸蜜蜂鳥', en: 'Bee Hummingbird', local: 'zunzuncito', fact: '古巴住著世界上最小的鳥，吸蜜蜂鳥跟一隻蜜蜂差不多大！' },
      ],
    },
    {
      id: 'vinales', country: 'cuba', zh: '比尼亞萊斯', en: 'Viñales', local: 'Viñales', at: [-83.71, 22.62], vehicle: 'car',
      items: [
        { id: 'cb-mogotes', emoji: '🏞️', zh: '饅頭石山', en: 'Mogotes', local: 'mogotes', fact: '山谷裡有好多圓圓胖胖的石頭山，好像一顆顆綠色的大饅頭！' },
        { id: 'cb-oxen', art: 'cow', zh: '牛耕田', en: 'Oxen Plowing', local: 'bueyes', fact: '這裡的農夫還是用牛來犁田，紅紅的土地好漂亮！' },
        { id: 'cb-cave', emoji: '🦇', zh: '坐船進山洞', en: 'Cave Boat Ride', local: 'Cueva del Indio', fact: '可以坐小船划進山洞裡面，洞裡有一條地下河，還住著蝙蝠！' },
      ],
    },
    {
      id: 'santiago', country: 'cuba', zh: '聖地牙哥', en: 'Santiago de Cuba', local: 'Santiago de Cuba', at: [-75.82, 20.02],
      items: [
        { id: 'cb-music', emoji: '🥁', zh: '古巴音樂', en: 'Cuban Music', local: 'son cubano', fact: '古巴的音樂好熱鬧，大家打著鼓、搖著沙鈴，一起跳舞！' },
        { id: 'cb-carnival', emoji: '🎭', zh: '嘉年華', en: 'Carnival', local: 'carnaval', fact: '每年七月有好熱鬧的嘉年華，大家戴著面具、穿著亮晶晶的衣服在街上跳舞！' },
      ],
    },
    {
      id: 'kingston', country: 'jamaica', zh: '金斯敦', en: 'Kingston', local: 'Kingston', at: [-76.79, 17.99], vehicle: 'airplane',
      items: [
        { id: 'jm-reggae', emoji: '🎸', zh: '雷鬼音樂', en: 'Reggae', fact: '雷鬼音樂是從牙買加來的，節奏慢慢的，聽了會想跟著搖頭擺手！' },
        { id: 'jm-doctorbird', emoji: '🐦', zh: '長尾蜂鳥', en: 'Doctor Bird', fact: '牙買加的國鳥是蜂鳥，尾巴有兩根長長的羽毛，飛的時候會飄起來！' },
      ],
    },
    {
      id: 'ochorios', country: 'jamaica', zh: '奧丘里奧斯', en: 'Ocho Rios', local: 'Ocho Rios', at: [-77.1, 18.41], marker: [-77.4, 19.2],
      items: [
        { id: 'jm-falls', art: 'waterfall', zh: '鄧斯河瀑布', en: "Dunn's River Falls", fact: '大家手牽手排成一條長龍，從瀑布下面一階一階爬上去！' },
        { id: 'jm-dolphin', art: 'dolphin', zh: '海豚', en: 'Dolphin', fact: '海灣裡住著海豚，會跳出水面跟大家打招呼！' },
      ],
    },
    {
      id: 'nassau', country: 'bahamas', zh: '拿索', en: 'Nassau', local: 'Nassau', at: [-77.35, 25.06], vehicle: 'airplane',
      items: [
        { id: 'bs-flamingo', art: 'flamingo', zh: '紅鶴', en: 'Flamingo', fact: '巴哈馬的國鳥是紅鶴，動物園裡的紅鶴還會排隊踏步表演！' },
        { id: 'bs-conch', emoji: '🐚', zh: '大海螺', en: 'Conch', fact: '粉紅色的大海螺殼拿起來放在耳朵旁邊，好像聽得到海浪的聲音！' },
      ],
    },
    {
      id: 'exuma', country: 'bahamas', zh: '埃克蘇馬', en: 'Exuma', local: 'Exuma', at: [-76.38, 24.18], vehicle: 'speedboat',
      items: [
        { id: 'bs-pig', art: 'pig', zh: '會游泳的小豬', en: 'Swimming Pigs', fact: '這個小島住著會游泳的小豬，看到船來了，就噗通噗通游過去！' },
        { id: 'bs-iguana', art: 'iguana', zh: '岩鬣蜥', en: 'Rock Iguana', fact: '附近的小島上住著岩鬣蜥，最喜歡趴在白白的沙灘上曬太陽！' },
        { id: 'bs-shark', art: 'shark', zh: '護士鯊', en: 'Nurse Shark', fact: '這裡的護士鯊很溫和，會慢慢游到碼頭邊，一點都不兇！' },
      ],
    },
    {
      id: 'santodomingo', country: 'dominican', zh: '聖多明哥', en: 'Santo Domingo', local: 'Santo Domingo', at: [-69.9, 18.47],
      items: [
        { id: 'do-larimar', emoji: '💎', zh: '藍色寶石', en: 'Larimar', local: 'larimar', fact: '多明尼加有一種藍色的寶石叫拉利瑪，全世界只有這裡挖得到，顏色像大海一樣！' },
        { id: 'do-baseball', emoji: '⚾', zh: '棒球', en: 'Baseball', local: 'béisbol', fact: '多明尼加的小朋友最愛打棒球，好多大聯盟的明星都是從這裡來的！' },
      ],
    },
    {
      id: 'samana', country: 'dominican', zh: '薩馬納', en: 'Samaná', local: 'Samaná', at: [-69.33, 19.2],
      items: [
        { id: 'do-whale', art: 'whale', zh: '座頭鯨', en: 'Humpback Whale', local: 'ballena jorobada', fact: '每年冬天，好幾千隻座頭鯨游到薩馬納灣生寶寶，還會在海裡唱歌！' },
        { id: 'do-horse', art: 'horse', zh: '騎馬去瀑布', en: 'Horse Ride to the Falls', local: 'caballo', fact: '騎著小馬穿過森林，就可以到萊蒙瀑布下面游泳！' },
        { id: 'do-coconut', emoji: '🥥', zh: '椰子樹', en: 'Coconut Palms', local: 'coco', fact: '海邊長滿高高的椰子樹，椰子掉下來的時候要小心喔！' },
      ],
    },
    {
      id: 'sanjuan', country: 'puertorico', zh: '聖胡安', en: 'San Juan', local: 'San Juan', at: [-66.1, 18.47], vehicle: 'ship',
      items: [
        { id: 'pr-coqui', art: 'frog', zh: '小樹蛙', en: 'Coquí Frog', local: 'coquí', fact: '波多黎各的小樹蛙晚上會一直叫「Co-quí、Co-quí」，就是牠自己的名字！' },
        { id: 'pr-kite', emoji: '🪁', zh: '城堡前放風箏', en: 'Kites at El Morro', local: 'chiringas', fact: '海邊的老城堡前面有一大片草地，大家都在那裡放風箏！' },
        { id: 'pr-glowbay', emoji: '✨', zh: '會發光的海灣', en: 'Glowing Bay', local: 'bahía bioluminiscente', fact: '晚上划船的時候用手撥水，海水會發出藍藍的光，好像星星掉進海裡！' },
      ],
    },
  ],
};
