// 🇰🇷 韓國之旅的資料（region.html?r=korea 會讀這個檔），格式見 regions/europe.js
//
// 坐 KTX 高鐵走真的路線：
//   京釜線 首爾→大田→大邱→新慶州→釜山
//   江陵線 首爾→原州→平昌→江陵（2018 平昌冬季奧運蓋的）
//   全羅線 大田→益山→全州→南原→智異山（求禮口）；湖南線 益山→光州→木浦
// 木浦到濟州島坐渡輪（mode: 'boat'）
// 濟州島太小，世界地圖的海岸線資料裡沒有，所以用 islands 自己畫（顏色跟韓國一樣）
// 當地語言是韓語，字是韓文；裝置沒有韓語的語音就不唸，只顯示
window.REGIONS = window.REGIONS || {};

REGIONS.korea = {
  id: 'korea',
  title: { zh: '韓國之旅', en: 'Korea Trip' },
  sea: '#5fb4e8',
  landFar: '#dde9cf',
  land: '#a9d4ef',
  vehicle: 'high-speed-train',
  lang3: 'local',
  loop: false,
  bounds: [124.3, 32.8, 130.6, 38.9],
  hint: '👆 點一個車站，坐 KTX 出發！',
  doneSay: '韓國之旅完成！你好厲害！',
  countries: [
    { id: 'korea', zh: '韓國', en: 'Korea', color: '#a9d4ef', lang: 'ko-KR', hello: '안녕하세요', flag: ['kr'],
      polys: [[[124.3, 37.7], [126.1, 37.75], [126.7, 37.95], [127.1, 38.3], [128.0, 38.3], [128.35, 38.62], [129.0, 38.62], [130.4, 38.0], [130.4, 35.0], [129.6, 34.4], [127.5, 33.9], [125.0, 34.0], [124.3, 35.5]]] },
  ],
  // 濟州島
  islands: [[[126.16, 33.3], [126.4, 33.2], [126.8, 33.28], [126.95, 33.45], [126.75, 33.56], [126.4, 33.5], [126.2, 33.42]]],
  junctions: {
    daejeon: [127.43, 36.33],
    iksan: [126.96, 35.94],
    mokpo: [126.39, 34.81],
  },
  lines: [
    { name: 'KTX 京釜線（首爾→大田→大邱→釜山）', path: ['seoul', [127.15, 36.8], 'daejeon', [128.6, 35.88], 'gyeongju', 'busan'] },
    { name: 'KTX 江陵線（首爾→江陵）', path: ['seoul', [127.68, 37.48], [127.95, 37.35], [128.4, 37.37], 'gangneung'] },
    { name: 'KTX 全羅線（大田→益山→全州→智異山）', path: ['daejeon', 'iksan', 'jeonju', [127.39, 35.41], 'jirisan'] },
    { name: 'KTX 湖南線（益山→光州→木浦）', path: ['iksan', [126.85, 35.16], 'mokpo'] },
    { name: '渡輪（木浦→濟州島）', mode: 'boat', path: ['mokpo', [126.45, 34.2], 'jeju'] },
  ],
  stops: [
    {
      id: 'seoul', country: 'korea', zh: '首爾', en: 'Seoul', local: '서울', at: [126.98, 37.57], marker: [125.7, 37.3],
      items: [
        { id: 'kr-palace', emoji: '🏯', zh: '景福宮', en: 'Gyeongbokgung Palace', local: '경복궁', fact: '景福宮是以前國王住的宮殿，穿著韓服去參觀還可以免費進去喔！' },
        { id: 'kr-kimchi', emoji: '🥬', zh: '泡菜', en: 'Kimchi', local: '김치', fact: '韓國人每一餐幾乎都有泡菜，紅紅的、辣辣的、酸酸的！' },
        { id: 'kr-kpop', emoji: '🎤', zh: '韓國流行音樂', en: 'K-pop', local: '케이팝', fact: '韓國的流行音樂全世界都在聽，大家會跟著學跳舞！' },
      ],
    },
    {
      id: 'gangneung', country: 'korea', zh: '江陵', en: 'Gangneung', local: '강릉', at: [128.9, 37.75],
      items: [
        { id: 'kr-ski', emoji: '⛷️', zh: '滑雪', en: 'Skiing', local: '스키', fact: '江陵旁邊的平昌辦過冬季奧運，冬天可以去滑雪！' },
        { id: 'kr-sea', emoji: '🌅', zh: '海邊日出', en: 'Sunrise', local: '일출', fact: '江陵在韓國的東邊海岸，新年的時候大家會到海邊看日出！' },
      ],
    },
    {
      id: 'gyeongju', country: 'korea', zh: '慶州', en: 'Gyeongju', local: '경주', at: [129.21, 35.84], marker: [129.9, 36.4],
      items: [
        { id: 'kr-observatory', emoji: '🔭', zh: '瞻星台', en: 'Cheomseongdae', local: '첨성대', fact: '慶州的瞻星台是一千多年前用石頭疊起來看星星的地方，是亞洲最古老的天文台！' },
        { id: 'kr-blossom', emoji: '🌸', zh: '櫻花', en: 'Cherry Blossoms', local: '벚꽃', fact: '春天的時候，慶州開滿了粉紅色的櫻花！' },
      ],
    },
    {
      id: 'busan', country: 'korea', zh: '釜山', en: 'Busan', local: '부산', at: [129.04, 35.18], marker: [129.6, 34.6],
      items: [
        { id: 'kr-beach', emoji: '🏖️', zh: '海雲台海灘', en: 'Haeundae Beach', local: '해운대', fact: '釜山的海雲台海灘夏天擠滿了來玩水的人！' },
        { id: 'kr-octopus', art: 'octopus', zh: '章魚', en: 'Octopus', local: '문어', fact: '釜山的魚市場有好多海鮮，章魚的腳會在水盆裡扭來扭去！' },
        { id: 'kr-fish', emoji: '🐟', zh: '魚市場', en: 'Fish Market', local: '생선', fact: '釜山的札嘎其市場是韓國最大的魚市場！' },
      ],
    },
    {
      id: 'jeonju', country: 'korea', zh: '全州', en: 'Jeonju', local: '전주', at: [127.15, 35.82], marker: [127.6, 36.45],
      items: [
        { id: 'kr-bibimbap', emoji: '🍲', zh: '石鍋拌飯', en: 'Bibimbap', local: '비빔밥', fact: '全州是拌飯的故鄉，把飯和好多種蔬菜、蛋拌在一起吃！' },
        { id: 'kr-hanok', emoji: '🏠', zh: '韓屋', en: 'Hanok House', local: '한옥', fact: '全州有好多傳統的韓屋，屋頂是彎彎的黑瓦片！' },
      ],
    },
    {
      id: 'jirisan', country: 'korea', zh: '智異山', en: 'Jirisan', local: '지리산', at: [127.6, 35.3], marker: [128.3, 35.55],
      items: [
        { id: 'kr-bear', art: 'formosan-bear', zh: '亞洲黑熊', en: 'Asiatic Black Bear', local: '반달가슴곰', fact: '智異山住著亞洲黑熊，胸前有一塊白白的月亮形狀，跟台灣黑熊是親戚！' },
        { id: 'kr-maple', emoji: '🍁', zh: '楓葉', en: 'Autumn Leaves', local: '단풍', fact: '秋天的智異山滿山都是紅紅黃黃的楓葉！' },
      ],
    },
    {
      id: 'jeju', country: 'korea', zh: '濟州島', en: 'Jeju Island', local: '제주도', at: [126.53, 33.38], vehicle: 'ship', marker: [125.6, 33.5],
      items: [
        { id: 'kr-orange', emoji: '🍊', zh: '柑橘', en: 'Tangerine', local: '귤', fact: '濟州島種好多甜甜的柑橘，島上到處都是橘子樹！' },
        { id: 'kr-haenyeo', emoji: '🤿', zh: '海女', en: 'Haenyeo Divers', local: '해녀', fact: '濟州島的海女阿嬤不用氧氣瓶，就能潛到海裡抓海螺和鮑魚！' },
        { id: 'kr-dolphin', art: 'dolphin', zh: '海豚', en: 'Dolphin', local: '돌고래', fact: '濟州島的海邊常常可以看到一群海豚游過去！' },
        { id: 'kr-hallasan', emoji: '🌋', zh: '漢拏山', en: 'Hallasan', local: '한라산', fact: '漢拏山是濟州島中間的一座火山，也是韓國最高的山！' },
      ],
    },
  ],
};
