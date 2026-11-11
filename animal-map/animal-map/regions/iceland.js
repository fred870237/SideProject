// 🌋 冰島環島之旅的資料（region.html?r=iceland 會讀這個檔），格式見 regions/europe.js
//
// 冰島沒有火車！大家開露營車沿著一號公路（環島公路 Hringvegur）繞一圈：
//   雷克雅維克→塞爾福斯→維克→冰河湖→埃伊爾斯塔濟→米湖→阿克雷里→博加內斯→回到雷克雅維克
// 岔出去的路：黃金圈（辛格韋德利→蓋錫爾間歇泉→塞爾福斯）、米湖→胡薩維克、博加內斯→斯奈山半島
// 西人島坐 Herjólfur 渡輪，從南岸的蘭德埃亞港出發
// 北極之旅也有一站冰島，這一趟是把整座島繞一圈
window.REGIONS = window.REGIONS || {};

REGIONS.iceland = {
  id: 'iceland',
  title: { zh: '冰島環島之旅', en: 'Around Iceland' },
  sea: '#4aa3d8',
  vehicle: 'camper-van',
  roadVehicle: 'camper-van',
  lang3: 'local',
  loop: false,
  bounds: [-24.6, 63.0, -13.0, 66.8],
  hint: '👆 點一個地方，開露營車環島出發！',
  doneSay: '冰島環島完成！你好厲害！',
  // 主地圖的冰島海岸線太粗（沒有西峽灣、西人島黏在陸地上），所以 ownLand：不畫主地圖的陸地，改用 islands 自己畫的輪廓
  ownLand: true,
  land: '#cfe6c2',
  islands: [
    [
      [-21.95, 64.15], [-22.56, 64.02], [-22.72, 63.82], [-22.43, 63.84], [-21.38, 63.86], [-21.15, 63.84], [-20.6, 63.72],
      [-20.2, 63.56], [-19.85, 63.5], [-19.13, 63.4], [-18.4, 63.47], [-17.9, 63.55], [-16.64, 63.8], [-16.2, 64.02],
      [-15.6, 64.2], [-15.2, 64.24], [-14.84, 64.25], [-14.5, 64.4], [-14.28, 64.66], [-13.9, 64.8], [-13.5, 65.05],
      [-13.5, 65.27], [-13.6, 65.5], [-14.3, 65.65], [-14.83, 65.75], [-14.8, 66.05], [-14.53, 66.38], [-15.1, 66.22],
      [-15.33, 66.2], [-16.0, 66.53], [-16.5, 66.3], [-16.6, 66.1], [-17.1, 66.2], [-17.34, 66.06], [-17.6, 66.02],
      [-17.75, 66.15], [-18.2, 66.17], [-18.05, 65.85], [-18.09, 65.68], [-18.3, 65.85], [-18.45, 66.05], [-18.9, 66.18],
      [-19.4, 66.1], [-19.6, 65.78], [-19.85, 65.95], [-20.1, 66.12], [-20.4, 65.68], [-20.9, 65.6], [-21.1, 65.18],
      [-21.4, 65.6], [-21.6, 65.95], [-22.4, 66.45], [-23.0, 66.42], [-23.15, 66.1], [-23.8, 66.2], [-24.0, 65.9],
      [-24.53, 65.5], [-23.5, 65.42], [-22.5, 65.5], [-22.0, 65.3], [-22.7, 65.05], [-23.3, 64.96], [-23.8, 64.9],
      [-24.05, 64.86], [-23.6, 64.75], [-22.6, 64.78], [-22.0, 64.6], [-21.92, 64.52], [-22.08, 64.32], [-21.95, 64.26],
    ],
    [[-20.38, 63.37], [-20.16, 63.38], [-20.17, 63.47], [-20.37, 63.47]],
  ],
  // 國家只用來打招呼和顯示國旗，不畫國界
  countries: [
    { id: 'iceland', zh: '冰島', en: 'Iceland', color: '#cfe6c2', lang: 'is-IS', hello: 'Halló', flag: ['nordic', '#02529C', '#DC1E35', '#ffffff'], polys: [] },
  ],
  junctions: {
    selfoss: [-20.99, 63.93], hvolsvollur: [-20.22, 63.75], landeyjahofn: [-20.2, 63.57], borgarnes: [-21.92, 64.54],
  },
  lines: [
    { name: '一號公路（雷克雅維克→維克→冰河湖）', mode: 'road', path: ['reykjavik', [-21.2, 63.98], 'selfoss', 'hvolsvollur', [-19.5, 63.53], 'vik', [-18.0, 63.78], [-17.0, 63.93], 'jokulsarlon'] },
    { name: '一號公路（冰河湖→東部峽灣→埃伊爾斯塔濟）', mode: 'road', path: ['jokulsarlon', [-15.2, 64.3], [-14.6, 64.5], [-14.3, 64.8], [-14.1, 65.0], 'egilsstadir'] },
    { name: '一號公路（埃伊爾斯塔濟→米湖→阿克雷里）', mode: 'road', path: ['egilsstadir', [-15.5, 65.4], [-16.4, 65.55], 'myvatn', [-17.55, 65.68], 'akureyri'] },
    { name: '一號公路（阿克雷里→博加內斯→雷克雅維克）', mode: 'road', path: ['akureyri', [-18.6, 65.5], [-19.45, 65.55], [-20.3, 65.55], [-21.0, 65.2], 'borgarnes', [-21.8, 64.35], 'reykjavik'] },
    { name: '黃金圈（雷克雅維克→辛格韋德利→蓋錫爾→塞爾福斯）', mode: 'road', path: ['reykjavik', [-21.13, 64.26], 'geysir', [-20.5, 64.05], 'selfoss'] },
    { name: '到蘭德埃亞港', mode: 'road', path: ['hvolsvollur', 'landeyjahofn'] },
    { name: 'Herjólfur 渡輪（蘭德埃亞港→西人島）', mode: 'boat', path: ['landeyjahofn', 'westman'] },
    { name: '米湖→胡薩維克', mode: 'road', path: ['myvatn', [-17.25, 65.85], 'husavik'] },
    { name: '博加內斯→斯奈山半島', mode: 'road', path: ['borgarnes', [-22.6, 64.8], [-23.0, 64.95], 'snaefellsnes'] },
  ],
  stops: [
    {
      id: 'reykjavik', country: 'iceland', zh: '雷克雅維克', en: 'Reykjavík', local: 'Reykjavík', at: [-21.94, 64.15],
      items: [
        { id: 'is-church', art: 'hallgrimskirkja', zh: '哈爾格林姆教堂', en: 'Hallgrímskirkja', local: 'Hallgrímskirkja', fact: '雷克雅維克最高的教堂，兩邊一階一階的，看起來像火山噴發後留下的石頭柱子！' },
        { id: 'is-pool', emoji: '🏊', zh: '溫泉游泳池', en: 'Hot Pools', local: 'sundlaug', fact: '冰島到處都是溫泉，下雪天大家也在戶外熱熱的游泳池裡泡澡！' },
        { id: 'is-hotdog', emoji: '🌭', zh: '熱狗', en: 'Hot Dog', local: 'pylsa', fact: '冰島人最愛吃熱狗，上面加甜甜的番茄醬和脆脆的炸洋蔥！' },
      ],
    },
    {
      id: 'geysir', country: 'iceland', zh: '蓋錫爾間歇泉', en: 'Geysir', local: 'Geysir', at: [-20.3, 64.31],
      items: [
        { id: 'is-strokkur', emoji: '♨️', zh: '噴水的間歇泉', en: 'Strokkur Geyser', local: 'Strokkur', fact: '史托克間歇泉每隔幾分鐘就會「噗」地一聲，把熱水噴得比房子還高！' },
        { id: 'is-gullfoss', art: 'waterfall', zh: '黃金瀑布', en: 'Gullfoss', local: 'Gullfoss', fact: '黃金瀑布分成兩層嘩啦啦地衝下去，出太陽的時候會出現彩虹！' },
      ],
    },
    {
      id: 'westman', country: 'iceland', zh: '西人島', en: 'Westman Islands', local: 'Vestmannaeyjar', at: [-20.27, 63.42], vehicle: 'ship',
      items: [
        { id: 'is-puffin', art: 'puffin', zh: '海鸚', en: 'Puffin', local: 'lundi', fact: '每年八月，迷路的小海鸚會飛到鎮上，小朋友會把牠們撿起來送回海邊放飛！' },
        { id: 'is-eldfell', emoji: '🌋', zh: '新長出來的火山', en: 'Eldfell Volcano', local: 'Eldfell', fact: '五十多年前，西人島的田裡突然噴發，長出了一座新的火山！' },
      ],
    },
    {
      id: 'vik', country: 'iceland', zh: '維克', en: 'Vík', local: 'Vík', at: [-19.0, 63.42],
      items: [
        { id: 'is-blackbeach', emoji: '⚫', zh: '黑沙灘', en: 'Black Sand Beach', local: 'svört sandfjara', fact: '維克的沙灘是黑色的，因為沙子是火山的岩石被海浪磨碎變成的！' },
        { id: 'is-stacks', emoji: '⛰️', zh: '海上的石柱', en: 'Reynisdrangar Sea Stacks', local: 'Reynisdrangar', fact: '傳說海上的石柱是兩個巨魔在拉船，太陽出來以後就變成了石頭！' },
      ],
    },
    {
      id: 'jokulsarlon', country: 'iceland', zh: '冰河湖', en: 'Glacier Lagoon', local: 'Jökulsárlón', at: [-16.23, 64.05],
      items: [
        { id: 'is-iceberg', emoji: '🧊', zh: '藍色的冰山', en: 'Icebergs', local: 'ísjaki', fact: '冰河湖裡飄著從冰河掉下來的冰山，有些是藍色的，像大塊的寶石！' },
        { id: 'is-seal', art: 'seal', zh: '海豹', en: 'Seal', local: 'selur', fact: '海豹會在冰山中間游來游去，有時候還會躺在冰塊上睡午覺！' },
        { id: 'is-diamond', emoji: '💎', zh: '鑽石沙灘', en: 'Diamond Beach', local: 'Demantsströnd', fact: '冰塊被沖到黑沙灘上，亮晶晶的，好像撒了一地的鑽石！' },
      ],
    },
    {
      id: 'egilsstadir', country: 'iceland', zh: '東部峽灣', en: 'East Fjords', local: 'Egilsstaðir', at: [-14.4, 65.27],
      items: [
        { id: 'is-reindeer', art: 'reindeer', zh: '馴鹿', en: 'Reindeer', local: 'hreindýr', fact: '冰島只有東部才看得到野生的馴鹿，冬天牠們會走到山下找東西吃！' },
        { id: 'is-fox', art: 'arctic-fox', zh: '北極狐', en: 'Arctic Fox', local: 'refur', fact: '北極狐是冰島本來就有的唯一一種陸地哺乳動物，冬天毛會變成白色！' },
      ],
    },
    {
      id: 'myvatn', country: 'iceland', zh: '米湖', en: 'Lake Mývatn', local: 'Mývatn', at: [-17.0, 65.6], marker: [-16.4, 65.25],
      items: [
        { id: 'is-crater', emoji: '🌋', zh: '火山口', en: 'Craters', local: 'gígur', fact: '米湖旁邊有好多圓圓的火山口，可以走到上面往下看！' },
        { id: 'is-bread', emoji: '🍞', zh: '地熱烤麵包', en: 'Geothermal Bread', local: 'hverabrauð', fact: '米湖的人把麵包埋在熱熱的地底下，烤一整天，挖出來就是甜甜的黑麵包！' },
      ],
    },
    {
      id: 'husavik', country: 'iceland', zh: '胡薩維克', en: 'Húsavík', local: 'Húsavík', at: [-17.34, 66.05],
      items: [
        { id: 'is-whale', art: 'whale', zh: '座頭鯨', en: 'Humpback Whale', local: 'hnúfubakur', fact: '胡薩維克是冰島的賞鯨小鎮，坐船出海常常看到座頭鯨甩尾巴！' },
        { id: 'is-boat', art: 'fishing-boat', zh: '賞鯨船', en: 'Whale-watching Boat', local: 'hvalaskoðun', fact: '賞鯨船是用以前的木頭漁船改的，出海要穿上厚厚的連身雨衣！' },
      ],
    },
    {
      id: 'akureyri', country: 'iceland', zh: '阿克雷里', en: 'Akureyri', local: 'Akureyri', at: [-18.09, 65.68], marker: [-18.8, 65.2],
      items: [
        { id: 'is-heartlight', emoji: '❤️', zh: '愛心紅綠燈', en: 'Heart Traffic Lights', local: 'umferðarljós', fact: '阿克雷里的紅燈是愛心形狀的，提醒大家停下來的時候要微笑！' },
        { id: 'is-aurora', emoji: '🌌', zh: '極光', en: 'Northern Lights', local: 'norðurljós', fact: '冬天的晚上，北冰島的天空會跳起綠色的極光舞！' },
      ],
    },
    {
      id: 'snaefellsnes', country: 'iceland', zh: '斯奈山半島', en: 'Snæfellsnes', local: 'Snæfellsnes', at: [-23.3, 64.9],
      items: [
        { id: 'is-kirkjufell', emoji: '⛰️', zh: '教堂山', en: 'Kirkjufell', local: 'Kirkjufell', fact: '教堂山尖尖的像一頂帽子，旁邊還有一座小瀑布，是冰島最有名的山！' },
        { id: 'is-horse', art: 'horse', zh: '冰島馬', en: 'Icelandic Horse', local: 'íslenski hesturinn', fact: '冰島馬矮矮的、毛很長，還會一種特別的小碎步跑法，騎起來不會晃！' },
      ],
    },
  ],
};
