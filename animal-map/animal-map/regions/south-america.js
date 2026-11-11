// 🌎 南美洲之旅的資料（region.html?r=south-america 會讀這個檔），格式見 regions/europe.js、africa.js
//
// 在南美洲換好幾種交通工具：
//   亞馬遜河坐船（瑪瑙斯↔伊基多斯）
//   安地斯山坐真的觀光火車：庫斯科→馬丘比丘（PeruRail）、庫斯科→的的喀喀湖（安地斯探險號）
//   的的喀喀湖→烏尤尼鹽沼坐吉普車、伊瓜蘇→布宜諾斯艾利斯坐巴士
//   太遠或沒有路的地方坐飛機（伊基多斯、加拉巴哥群島、巴塔哥尼亞、里約）
// 加拉巴哥群島太小，世界地圖的海岸線資料裡沒有，所以用 islands 自己畫（顏色跟厄瓜多一樣）
window.REGIONS = window.REGIONS || {};

REGIONS['south-america'] = {
  id: 'south-america',
  title: { zh: '南美洲之旅', en: 'South America Trip' },
  sea: '#5fb4e8',
  landFar: '#d8eac2',
  land: '#f7e08a',
  vehicle: 'train',
  roadVehicle: 'jeep',
  lang3: 'local',
  loop: false,
  bounds: [-93, -56, -33, 7],
  hint: '👆 點一個地方，坐船、坐火車去探險！',
  doneSay: '南美洲之旅完成！你好厲害！',
  countries: [
    { id: 'brazil', zh: '巴西', en: 'Brazil', color: '#a6dd8f', lang: 'pt-BR', hello: 'Olá', flag: ['br'],
      polys: [[[-73.9, -7.4], [-72.9, -9.0], [-70.6, -9.5], [-69.6, -11.0], [-65.4, -9.8], [-64.4, -12.5], [-60.4, -13.5], [-60.0, -16.3], [-58.3, -16.3], [-58.0, -20.0], [-57.8, -22.1], [-55.4, -24.0], [-54.6, -25.6], [-53.7, -26.9], [-55.8, -28.0], [-57.6, -30.2], [-56.0, -30.9], [-53.4, -33.7], [-50, -33], [-48, -29], [-44, -24.5], [-39, -23], [-37.5, -13], [-34.0, -8], [-33.5, -5], [-38, -2.5], [-44, -1.5], [-50, 1.5], [-51.5, 4.5], [-54.0, 2.3], [-56.0, 1.9], [-58.0, 1.5], [-60.7, 5.2], [-62.0, 4.1], [-64.0, 4.0], [-64.5, 2.0], [-66.9, 1.2], [-69.8, 1.1], [-69.4, -1.0], [-70.0, -4.2], [-72.8, -5.1]]] },
    { id: 'peru', zh: '秘魯', en: 'Peru', color: '#f6a8a8', lang: 'es-ES', hello: 'Hola', flag: ['v', '#D91023', '#ffffff', '#D91023'],
      polys: [[[-80.3, -3.4], [-79.5, -4.5], [-78.4, -3.5], [-75.5, -1.5], [-73.6, -1.3], [-70.0, -4.2], [-72.8, -5.1], [-73.9, -7.4], [-72.9, -9.0], [-70.6, -9.5], [-69.6, -11.0], [-68.7, -12.5], [-68.9, -15.2], [-69.4, -15.6], [-69.5, -17.5], [-70.4, -18.4], [-71.5, -18.5], [-77, -14], [-80, -9], [-82, -5]]] },
    { id: 'bolivia', zh: '玻利維亞', en: 'Bolivia', color: '#f7d98b', lang: 'es-ES', hello: 'Hola', flag: ['h', '#D52B1E', '#F9E300', '#007934'],
      polys: [[[-69.6, -11.0], [-65.4, -9.8], [-64.4, -12.5], [-60.4, -13.5], [-60.0, -16.3], [-58.3, -16.3], [-58.0, -20.0], [-62.3, -22.0], [-64.3, -22.8], [-66.2, -21.8], [-67.9, -22.9], [-68.6, -20.0], [-68.4, -19.4], [-69.5, -17.5], [-69.4, -15.6], [-68.9, -15.2], [-68.7, -12.5]]] },
    { id: 'ecuador', zh: '厄瓜多', en: 'Ecuador', color: '#f7e08a', lang: 'es-ES', hello: 'Hola', flag: ['h', '#FFD100', '#FFD100', '#0072CE', '#EF3340'],
      polys: [[[-80.3, -3.4], [-79.5, -4.5], [-78.4, -3.5], [-75.5, -1.5], [-75.2, -0.1], [-76.9, 0.4], [-78.8, 1.4], [-80.5, 1.5], [-81.5, -1], [-81, -3]]] },
    { id: 'argentina', zh: '阿根廷', en: 'Argentina', color: '#a9d4ef', lang: 'es-ES', hello: 'Hola', flag: ['ar'],
      polys: [[[-67.9, -22.9], [-66.2, -21.8], [-64.3, -22.8], [-62.3, -22.0], [-60.0, -23.0], [-57.6, -25.3], [-54.6, -25.6], [-53.7, -26.9], [-55.8, -28.0], [-57.6, -30.2], [-58.4, -33.0], [-58.4, -34.0], [-56.5, -35], [-56, -38], [-61, -41], [-63, -43], [-65, -47], [-67, -50], [-67, -53], [-64.5, -55], [-68.6, -55.5], [-68.6, -52.6], [-71.5, -52.0], [-72.3, -51.0], [-73.5, -49.5], [-72.0, -46.5], [-71.7, -43.0], [-71.9, -40.0], [-71.0, -36.0], [-70.3, -32.0], [-69.5, -28.0], [-68.4, -24.5]]] },
    { id: 'chile', zh: '智利', en: 'Chile', color: '#c7b3e6', lang: 'es-ES', hello: 'Hola', flag: ['cl'],
      polys: [[[-70.4, -18.4], [-69.5, -17.5], [-68.4, -19.4], [-68.6, -20.0], [-67.9, -22.9], [-68.4, -24.5], [-69.5, -28.0], [-70.3, -32.0], [-71.0, -36.0], [-71.9, -40.0], [-71.7, -43.0], [-72.0, -46.5], [-73.5, -49.5], [-72.3, -51.0], [-71.5, -52.0], [-68.6, -52.6], [-68.6, -55.5], [-67, -56.3], [-76, -56], [-76.5, -46], [-74.5, -38], [-72.5, -30], [-71.5, -18.5]]] },
  ],
  // 加拉巴哥群島：幾個主要的島（伊莎貝拉、聖克魯斯、聖克里斯托巴、費爾南迪納）
  islands: [
    [[-91.6, 0.15], [-90.9, -0.3], [-90.8, -0.95], [-91.3, -1.05], [-91.45, -0.55]],
    [[-90.55, -0.5], [-90.2, -0.55], [-90.25, -0.8], [-90.55, -0.75]],
    [[-89.65, -0.75], [-89.3, -0.85], [-89.4, -0.95], [-89.6, -0.95]],
    [[-91.75, -0.3], [-91.45, -0.3], [-91.45, -0.55], [-91.7, -0.5]],
  ],
  junctions: {
    iquitos: [-73.25, -3.75],
    cusco: [-71.97, -13.53],
    lima: [-77.04, -12.05],
  },
  lines: [
    { name: '亞馬遜河的船（瑪瑙斯↔伊基多斯）', mode: 'boat', path: ['amazon', [-62.0, -3.6], [-65.5, -3.3], [-68.5, -3.4], [-70.5, -4.1], 'iquitos'] },
    { name: '飛機（伊基多斯→庫斯科）', mode: 'air', path: ['iquitos', 'cusco'] },
    { name: 'PeruRail（庫斯科→馬丘比丘）', path: ['cusco', [-72.26, -13.26], 'machupicchu'] },
    { name: '安地斯探險號（庫斯科→的的喀喀湖）', path: ['cusco', [-70.9, -14.3], [-70.15, -15.5], 'titicaca'] },
    { name: '吉普車（的的喀喀湖→烏尤尼鹽沼）', mode: 'road', path: ['titicaca', [-68.15, -16.5], [-67.1, -17.97], 'uyuni'] },
    { name: '飛機（庫斯科→利馬）', mode: 'air', path: ['cusco', 'lima'] },
    { name: '飛機（利馬→加拉巴哥群島）', mode: 'air', path: ['lima', 'galapagos'] },
    { name: '飛機（瑪瑙斯→里約）', mode: 'air', path: ['amazon', 'rio'] },
    { name: '飛機（里約→伊瓜蘇）', mode: 'air', path: ['rio', 'iguazu'] },
    { name: '巴士（伊瓜蘇→布宜諾斯艾利斯）', mode: 'road', vehicle: 'bus', path: ['iguazu', [-55.9, -27.4], [-58.8, -29.2], [-58.9, -32.0], 'buenosaires'] },
    { name: '飛機（布宜諾斯艾利斯→巴塔哥尼亞）', mode: 'air', path: ['buenosaires', 'patagonia'] },
    { name: '飛機（烏尤尼→布宜諾斯艾利斯）', mode: 'air', path: ['uyuni', 'buenosaires'] },
  ],
  stops: [
    {
      id: 'amazon', country: 'brazil', zh: '亞馬遜雨林', en: 'Amazon Rainforest', local: 'Amazônia', at: [-60.02, -3.12], vehicle: 'ship',
      items: [
        { id: 'sa-toucan', art: 'toucan', zh: '巨嘴鳥', en: 'Toucan', local: 'tucano', fact: '巨嘴鳥的嘴巴又大又彩色，但其實很輕，裡面是空空的！' },
        { id: 'sa-sloth', art: 'sloth', zh: '樹懶', en: 'Sloth', local: 'preguiça', fact: '樹懶動作好慢好慢，一天要睡十幾個小時，倒掛在樹上也能睡！' },
        { id: 'sa-anaconda', art: 'anaconda', zh: '森蚺', en: 'Anaconda', local: 'sucuri', fact: '森蚺是世界上最重的蛇，很會在亞馬遜河裡游泳！' },
        { id: 'sa-jaguar', art: 'jaguar', zh: '美洲豹', en: 'Jaguar', local: 'onça', fact: '美洲豹身上有一朵一朵的梅花斑點，牠不怕水，還會游泳抓魚！' },
      ],
    },
    {
      id: 'machupicchu', country: 'peru', zh: '馬丘比丘', en: 'Machu Picchu', local: 'Machu Picchu', at: [-72.55, -13.16], marker: [-76.6, -14.6],
      items: [
        { id: 'sa-machu', art: 'machu-picchu', zh: '馬丘比丘', en: 'Machu Picchu', local: 'Machu Picchu', fact: '馬丘比丘是印加人蓋在高山上的石頭城，常常被雲霧包住，像天空之城！' },
        { id: 'sa-llama', art: 'llama', zh: '駱馬', en: 'Llama', local: 'llama', fact: '駱馬會幫忙在山上背東西，不高興的時候會吐口水喔！' },
      ],
    },
    {
      id: 'titicaca', country: 'peru', zh: '的的喀喀湖', en: 'Lake Titicaca', local: 'Lago Titicaca', at: [-69.4, -15.8], marker: [-63.6, -11.6],
      items: [
        { id: 'sa-reed', emoji: '🛶', zh: '蘆葦船', en: 'Reed Boat', local: 'balsa de totora', fact: '的的喀喀湖上的人用蘆葦做小船，連住的小島都是用蘆葦一層一層疊起來的！' },
        { id: 'sa-lake', emoji: '🏔️', zh: '高山上的湖', en: 'Highest Lake', local: 'lago', fact: '的的喀喀湖在好高好高的山上，是可以坐大船航行的湖裡面最高的！' },
      ],
    },
    {
      id: 'uyuni', country: 'bolivia', zh: '烏尤尼鹽沼', en: 'Uyuni Salt Flat', local: 'Salar de Uyuni', at: [-67.5, -20.1], vehicle: 'jeep', marker: [-61.0, -21.6],
      items: [
        { id: 'sa-salt', emoji: '🧂', zh: '鹽巴', en: 'Salt', local: 'sal', fact: '烏尤尼鹽沼是一大片白白的鹽巴地，下雨以後像一面大鏡子，叫做「天空之鏡」！' },
        { id: 'sa-flamingo', art: 'flamingo', zh: '紅鶴', en: 'Flamingo', local: 'flamenco', fact: '鹽沼旁邊的湖裡住著好多粉紅色的紅鶴！' },
      ],
    },
    {
      id: 'galapagos', country: 'ecuador', zh: '加拉巴哥群島', en: 'Galápagos Islands', local: 'Galápagos', at: [-90.6, -0.5], vehicle: 'airplane', marker: [-90.2, -4.2],
      items: [
        { id: 'sa-tortoise', art: 'tortoise', zh: '象龜', en: 'Giant Tortoise', local: 'tortuga gigante', fact: '加拉巴哥象龜是世界上最大的陸龜，可以活超過一百歲！' },
        { id: 'sa-iguana', art: 'iguana', zh: '海鬣蜥', en: 'Marine Iguana', local: 'iguana marina', fact: '加拉巴哥的海鬣蜥會潛到海裡吃海藻，是唯一會游泳的蜥蜴！' },
        { id: 'sa-penguin', art: 'penguin', zh: '加拉巴哥企鵝', en: 'Galápagos Penguin', local: 'pingüino', fact: '加拉巴哥企鵝住在赤道上，是住得最北邊的企鵝！' },
      ],
    },
    {
      id: 'patagonia', country: 'argentina', zh: '巴塔哥尼亞', en: 'Patagonia', local: 'Patagonia', at: [-73.05, -50.5], vehicle: 'airplane', marker: [-77.0, -48.5],
      items: [
        { id: 'sa-glacier', emoji: '🧊', zh: '冰河', en: 'Glacier', local: 'glaciar', fact: '巴塔哥尼亞的冰河好大好藍，大冰塊掉進湖裡的時候會發出轟隆巨響！' },
        { id: 'sa-guanaco', art: 'llama', zh: '原駝', en: 'Guanaco', local: 'guanaco', fact: '原駝是駱馬的野生親戚，在巴塔哥尼亞的草原上跑來跑去！' },
        { id: 'sa-magellanic', art: 'penguin', zh: '麥哲倫企鵝', en: 'Magellanic Penguin', local: 'pingüino', fact: '巴塔哥尼亞的海邊住著好幾萬隻麥哲倫企鵝！' },
      ],
    },
    {
      id: 'buenosaires', country: 'argentina', zh: '布宜諾斯艾利斯', en: 'Buenos Aires', local: 'Buenos Aires', at: [-58.38, -34.6], marker: [-54.5, -36.4],
      items: [
        { id: 'sa-tango', emoji: '💃', zh: '探戈', en: 'Tango', local: 'tango', fact: '探戈是布宜諾斯艾利斯的舞蹈，兩個人抱在一起，跳得又快又帥氣！' },
        { id: 'sa-football', emoji: '⚽', zh: '足球', en: 'Football', local: 'fútbol', fact: '阿根廷人超愛足球，小朋友在街上就踢起來了！' },
      ],
    },
    {
      id: 'iguazu', country: 'argentina', zh: '伊瓜蘇瀑布', en: 'Iguazú Falls', local: 'Cataratas del Iguazú', at: [-54.44, -25.69], marker: [-50.8, -26.6],
      items: [
        { id: 'sa-falls', art: 'waterfall', zh: '伊瓜蘇瀑布', en: 'Iguazú Falls', local: 'cataratas', fact: '伊瓜蘇瀑布有兩百多條瀑布，水聲轟隆隆，常常會出現彩虹！' },
        { id: 'sa-coati', art: 'raccoon', zh: '長鼻浣熊', en: 'Coati', local: 'coatí', fact: '瀑布旁邊有長鼻浣熊，鼻子長長的，尾巴一圈一圈，很愛偷吃遊客的零食！' },
      ],
    },
    {
      id: 'rio', country: 'brazil', zh: '里約熱內盧', en: 'Rio de Janeiro', local: 'Rio de Janeiro', at: [-43.2, -22.9], vehicle: 'airplane', marker: [-39.5, -24.6],
      items: [
        { id: 'sa-carnival', emoji: '🥁', zh: '嘉年華', en: 'Carnival', local: 'carnaval', fact: '里約的嘉年華大家穿著亮晶晶的衣服，跟著森巴鼓聲在街上跳舞！' },
        { id: 'sa-beach', emoji: '🏖️', zh: '海灘', en: 'Beach', local: 'praia', fact: '里約有好長好漂亮的海灘，大家在沙灘上踢足球、打排球！' },
        { id: 'sa-ball', emoji: '⚽', zh: '足球', en: 'Football', local: 'futebol', fact: '巴西是足球王國，拿過最多次世界盃冠軍！' },
      ],
    },
  ],
};
