// 書架：每個主題是一本機關書，每本書有好幾頁（場景）
// 新增一頁：在 pages 加一筆，再新增 art/<頁面 id>.js，用 SCENES['<頁面 id>'] = { ... } 畫出場景（index.html 和 sw.js 也要加檔名）
// 還沒有 SCENES 的頁面、還沒有任何頁面的主題，畫面上會顯示「敬請期待」
// 圖示請用 Emoji 12（2019 年）以前的 emoji，Windows 10 才不會變方框
const SCENES = {};

const THEMES = [
  {
    id: 'vehicles', icon: '🚚', en: 'Vehicles', zh: '交通工具', color: '#ffcf3f',
    pages: [
      { id: 'construction', icon: '🏗️', en: 'Construction Site', zh: '工地' },
      { id: 'building', icon: '🏢', en: 'Building Site', zh: '蓋大樓' },
      { id: 'rescue', icon: '🚒', en: 'Rescue', zh: '消防救援' },
      { id: 'farm', icon: '🚜', en: 'Farm', zh: '農場' },
      { id: 'trucks', icon: '🚛', en: 'Trucks', zh: '貨運卡車' },
      { id: 'sea', icon: '🚢', en: 'Sea', zh: '海上' },
      { id: 'sky', icon: '✈️', en: 'Sky', zh: '天空' },
      { id: 'space', icon: '🚀', en: 'Space', zh: '太空' },
    ],
  },
  {
    id: 'animals', icon: '🦁', en: 'Animals', zh: '動物', color: '#9be27b',
    pages: [
      { id: 'savanna', icon: '🦁', en: 'Savanna', zh: '草原' },
      { id: 'jungle', icon: '🐒', en: 'Jungle', zh: '叢林' },
      { id: 'farm-animals', icon: '🐮', en: 'Farm Animals', zh: '農場動物' },
      { id: 'ocean', icon: '🐳', en: 'Ocean', zh: '海洋' },
      { id: 'polar', icon: '🐧', en: 'Polar', zh: '極地' },
      { id: 'forest', icon: '🦉', en: 'Forest', zh: '森林' },
      { id: 'pets', icon: '🐶', en: 'Pets', zh: '寵物' },
    ],
  },
  {
    id: 'dinosaurs', icon: '🦕', en: 'Dinosaurs', zh: '恐龍', color: '#8fd3ff',
    pages: [
      { id: 'dino-valley', icon: '🦖', en: 'Dino Valley', zh: '恐龍山谷' },
      { id: 'dino-sky', icon: '🦅', en: 'Prehistoric Sky', zh: '遠古天空' },
      { id: 'dino-sea', icon: '🌊', en: 'Prehistoric Sea', zh: '遠古海洋' },
      { id: 'dino-nest', icon: '🥚', en: 'Dino Nest', zh: '恐龍蛋巢' },
      { id: 'volcano', icon: '🌋', en: 'Volcano', zh: '火山' },
      { id: 'fossil-museum', icon: '🦴', en: 'Fossil Museum', zh: '化石博物館' },
    ],
  },
  {
    id: 'prehistoric', icon: '🐘', en: 'Prehistoric Animals', zh: '史前動物', color: '#c7e8f5',
    pages: [
      { id: 'ice-age', icon: '❄️', en: 'Ice Age', zh: '冰河時期' },
      { id: 'sa-plains', icon: '🌵', en: 'South American Plains', zh: '南美洲草原' },
      { id: 'ancient-australia', icon: '🦘', en: 'Ancient Australia', zh: '遠古澳洲' },
      { id: 'megalodon-sea', icon: '🦈', en: 'Megalodon Sea', zh: '巨齒鯊海洋' },
      { id: 'giant-beasts', icon: '🦏', en: 'Giant Beasts', zh: '遠古巨獸' },
      { id: 'lost-animals', icon: '🐦', en: 'Lost Animals', zh: '消失的動物' },
    ],
  },
  { id: 'body', icon: '🦷', en: 'My Body', zh: '我的身體', color: '#ffb3c7', pages: [] },
];
