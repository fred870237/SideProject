// 🐧 南極探險的資料（region.html?r=antarctica 會讀這個檔），格式見 regions/europe.js
//
// 世界地圖（Miller 投影）在南極附近會被拉得又扁又長，所以這一頁改成「從南極正上方往下看」的地圖：
//   projection: 'south-pole'（極射赤面投影），rotate: 60 把南極半島轉到上面
//   主地圖的陸地資料這時候對不起來，南極洲和南美洲的尖端都用 islands 自己畫（照地圖畫的大概形狀）
// 路線是南極探險船常走的：從阿根廷的烏斯懷亞出發，穿過德雷克海峽到南極半島，再進威德爾海看帝王企鵝；
// 南極點和羅斯海太遠，坐飛機（南極的飛機是有滑雪板的小飛機）
// 南極不屬於任何國家，卡片上只有中文和英文（lang3: 'none'）
window.REGIONS = window.REGIONS || {};

REGIONS.antarctica = {
  id: 'antarctica',
  title: { zh: '南極探險', en: 'Antarctic Expedition' },
  sea: '#6fb3e0',
  land: '#f4f9fc',
  projection: 'south-pole',
  rotate: 60,
  vehicle: 'ship',
  lang3: 'none',
  loop: false,
  hint: '👆 點一個地方，坐探險船去南極！',
  doneSay: '南極探險完成！你好厲害！',
  islands: [
    // 南極洲（沿著海岸繞一圈；南極半島往上伸到南美洲的方向）
    { pts: [
      [-180, -78], [-160, -77.5], [-145, -75.5], [-130, -74.5], [-115, -74], [-100, -73.5], [-85, -73], [-75, -72.5],
      [-70, -70.5], [-67, -68], [-64, -65.5], [-60, -63.6], [-56.8, -63.2], [-57.5, -64.4], [-60, -65.8], [-61.5, -68.5], [-61, -71.5], [-58, -74.5],
      [-50, -77.5], [-40, -78], [-30, -76.5], [-20, -73.5], [-10, -71], [0, -70], [15, -70], [30, -69.5], [45, -67.5],
      [60, -67], [75, -68.5], [90, -66.5], [105, -66], [120, -66.5], [135, -66.5], [150, -68.5], [162, -70.5], [170, -72],
      [168, -76], [175, -78],
    ] },
    // 南美洲的尖端（火地島），讓小朋友知道船是從哪裡出發的
    { pts: [[-75, -48], [-66, -48], [-65.5, -52], [-63.5, -55], [-67.5, -56], [-72, -54], [-75.5, -51]], fill: '#a9d4ef' },
  ],
  lines: [
    { name: '探險船（穿過德雷克海峽）', mode: 'boat', path: ['ushuaia', [-66, -57.5], [-63.5, -61], 'peninsula'] },
    { name: '探險船（進威德爾海）', mode: 'boat', path: ['peninsula', [-53, -66], [-48, -72], 'weddell'] },
    { name: '飛機（威德爾海→南極點）', mode: 'air', path: ['weddell', 'southpole'] },
    { name: '飛機（南極點→羅斯海）', mode: 'air', path: ['southpole', 'rosssea'] },
  ],
  stops: [
    {
      id: 'ushuaia', zh: '烏斯懷亞', en: 'Ushuaia', at: [-68.3, -54.8], marker: [-73.5, -55.5],
      items: [
        { id: 'an-ship', art: 'ship', zh: '探險船', en: 'Expedition Ship', fact: '烏斯懷亞是世界最南邊的城市，去南極的探險船都從這裡出發！' },
        { id: 'an-crab', art: 'crab', zh: '帝王蟹', en: 'King Crab', fact: '這裡的海裡有好大的帝王蟹，腳張開來比小朋友的手臂還長！' },
      ],
    },
    {
      id: 'peninsula', zh: '南極半島', en: 'Antarctic Peninsula', at: [-62.5, -64.8], marker: [-52, -62.5],
      items: [
        { id: 'an-gentoo', art: 'penguin', zh: '巴布亞企鵝', en: 'Gentoo Penguin', fact: '南極半島住著好多企鵝，牠們會撿小石頭來蓋窩！' },
        { id: 'an-humpback', art: 'whale', zh: '座頭鯨', en: 'Humpback Whale', fact: '座頭鯨夏天游到南極吃磷蝦，還會跳出水面「啪」地一聲落下！' },
        { id: 'an-iceberg', emoji: '🧊', zh: '冰山', en: 'Iceberg', fact: '南極的冰山好大好大，我們看到的只是露出水面的一小部分喔！' },
      ],
    },
    {
      id: 'weddell', zh: '威德爾海', en: 'Weddell Sea', at: [-45, -74.5],
      items: [
        { id: 'an-emperor', art: 'penguin', zh: '帝王企鵝', en: 'Emperor Penguin', fact: '帝王企鵝是最大的企鵝，爸爸會把蛋放在腳上，用肚子的毛把蛋蓋住保暖！' },
        { id: 'an-weddellseal', art: 'seal', zh: '威德爾海豹', en: 'Weddell Seal', fact: '威德爾海豹會在冰底下游泳，用牙齒把冰咬出呼吸的洞！' },
      ],
    },
    {
      id: 'southpole', zh: '南極點', en: 'South Pole', at: [0, -89.9], vehicle: 'airplane',
      icon: { emoji: '🧭' },
      items: [
        { id: 'an-pole', emoji: '🧭', zh: '南極點', en: 'South Pole', fact: '南極點是地球最南邊的地方，站在這裡往哪邊走都是往北！' },
        { id: 'an-station', emoji: '🏠', zh: '研究站', en: 'Research Station', fact: '科學家住在南極的研究站裡，研究冰、天氣和星星！' },
        { id: 'an-cold', emoji: '🥶', zh: '好冷好冷', en: 'Very Cold', fact: '南極是地球上最冷的地方，冬天比冰箱的冷凍庫還要冷好幾倍！' },
      ],
    },
    {
      id: 'rosssea', zh: '羅斯海', en: 'Ross Sea', at: [175, -77.5], vehicle: 'airplane', marker: [-178, -72.5],
      items: [
        { id: 'an-orca', art: 'orca', zh: '虎鯨', en: 'Orca', fact: '虎鯨黑白相間，一家人一起在羅斯海裡游泳抓魚！' },
        { id: 'an-adelie', art: 'penguin', zh: '阿德利企鵝', en: 'Adélie Penguin', fact: '阿德利企鵝的眼睛有一圈白白的眼圈，走路搖搖擺擺好可愛！' },
      ],
    },
  ],
};
