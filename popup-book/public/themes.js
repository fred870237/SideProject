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
      { id: 'rescue', icon: '🚒', en: 'Rescue', zh: '消防救援' },
      { id: 'farm', icon: '🚜', en: 'Farm', zh: '農場' },
      { id: 'trucks', icon: '🚛', en: 'Trucks', zh: '貨運卡車' },
      { id: 'sea', icon: '🚢', en: 'Sea', zh: '海上' },
      { id: 'sky', icon: '✈️', en: 'Sky', zh: '天空' },
      { id: 'space', icon: '🚀', en: 'Space', zh: '太空' },
    ],
  },
  { id: 'animals', icon: '🦁', en: 'Animals', zh: '動物', color: '#9be27b', pages: [] },
  { id: 'dinosaurs', icon: '🦕', en: 'Dinosaurs', zh: '恐龍', color: '#8fd3ff', pages: [] },
  { id: 'body', icon: '🦷', en: 'My Body', zh: '我的身體', color: '#ffb3c7', pages: [] },
];
