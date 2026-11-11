// ✈️ 環遊世界：主世界地圖（index.html 的旅行模式，travel-map.js）和環遊地圖（region.html）共用的東西
// - 可以去的地方 TRIPS、出發的家 HOME
// - 跟主地圖一樣的 Miller 投影：同一個經緯度，在兩張地圖上算出來的位置一樣，飛機才能從主地圖「鑽進」環遊地圖
// - 換頁時的雲朵轉場：飛機飛進雲裡 → 換頁 → 雲散開，看到另一張地圖
// 想加一個國家：在 TRIPS 加一筆，ready 設成 true，再照 regions/taiwan.js 新增 regions/<id>.js（region.js 的 REGION_FILES 也要加）
const Travel = (() => {
  // 跟 app.js / map-shapes.js 一樣的 Miller 投影（主地圖寬 1000）
  const W = 1000;
  const K = W / (2 * Math.PI);
  const miller = (lat) => 1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * (lat * Math.PI) / 180));
  const TOP = miller(84);
  const project = (lon, lat) => [((lon + 180) / 360) * W, (TOP - miller(lat)) * K];

  // 出發的家：台北
  const HOME = [121.5, 25.03];

  // at = 地圖上插旗子的地方；box = [西經, 南緯, 東經, 北緯]，飛到這裡時畫面要放大到看得到這一塊
  const TRIPS = [
    { id: 'taiwan', icon: '🚂', zh: '台灣環島', en: 'Around Taiwan', at: [121, 23.7], box: [119.9, 21.8, 122.1, 25.4], ready: true,
      go: '坐飛機出發，去台灣環島！', welcome: '台灣環島，出發囉！' },
    { id: 'japan', icon: '🗻', zh: '日本', en: 'Japan', at: [138.5, 36.5], box: [127, 26, 146, 45.6], ready: true },
    { id: 'china', icon: '🐼', zh: '中國', en: 'China', at: [104, 34], box: [73, 18, 135, 54], ready: true },
    { id: 'africa', icon: '🦁', zh: '非洲', en: 'Africa', at: [24, 2], box: [-18, -36, 52, 33], ready: true },
    { id: 'australia', icon: '🦘', zh: '澳洲', en: 'Australia', at: [134, -25], box: [111, -45.5, 156.5, -9.5], ready: true },
    { id: 'usa', icon: '🗽', zh: '美國', en: 'USA', at: [-98, 39], box: [-126, 22.5, -65, 50], ready: true },
    { id: 'south-america', icon: '🦜', zh: '南美洲', en: 'South America', at: [-60, -14], box: [-93, -56, -33, 7], ready: true },
    { id: 'arctic', icon: '🧊', zh: '北極', en: 'Arctic', at: [-40, 74], box: [-100, 55, 36, 84], ready: true },
    { id: 'antarctica', icon: '🐧', zh: '南極', en: 'Antarctica', at: [-62, -60], box: [-80, -70, -40, -54], ready: true },
    { id: 'india', icon: '🐯', zh: '印度', en: 'India', at: [79, 21], box: [66.5, 6.5, 98, 35.5], ready: true },
    { id: 'korea', icon: '🥢', zh: '韓國', en: 'Korea', at: [127.8, 36.4], box: [124.3, 32.8, 130.6, 38.9], ready: true },
    { id: 'canada', icon: '🍁', zh: '加拿大', en: 'Canada', at: [-112, 60], box: [-127, 41.8, -66, 60], ready: true },
    { id: 'thailand', icon: '🐘', zh: '泰國', en: 'Thailand', at: [101, 15], box: [96.5, 6.2, 106, 20.6], ready: true },
    { id: 'new-zealand', icon: '🥝', zh: '紐西蘭', en: 'New Zealand', at: [172.5, -41], box: [165.8, -47.5, 179, -34.2], ready: true },
    { id: 'russia', icon: '🐻', zh: '俄羅斯', en: 'Russia', at: [95, 61], box: [27, 41, 162, 72], ready: true },
    { id: 'silk-road', icon: '🐫', zh: '絲路中亞', en: 'Silk Road', at: [66, 43], box: [52, 37.5, 82, 53], ready: true },
    { id: 'southeast-asia', icon: '🦧', zh: '東南亞', en: 'Southeast Asia', at: [114, 1], box: [96, -11, 127, 23.5], ready: true },
    { id: 'central-america', icon: '🌵', zh: '墨西哥中美洲', en: 'Mexico & Central America', at: [-96, 19], box: [-110, 7, -77, 31], ready: true },
    { id: 'europe', icon: '🏰', zh: '歐洲', en: 'Europe', at: [10, 48.5], box: [-10.5, 36, 31.5, 70.5], ready: true },
  ];
  const trip = (id) => TRIPS.find((t) => t.id === id);

  /* ---------- 說話：出發「坐飛機去日本！」、降落「歡迎來到日本！」、回來「回家囉！」 ---------- */
  // 用按鈕唸名字的同一套聲音（voice-ui.js：有預先生成的語音就播，沒有就用系統的中文語音）
  const goText = (t) => t.go || `坐飛機去${t.zh}！`;
  const welcomeText = (t) => t.welcome || `歡迎來到${t.zh}！`;
  function say(text) {
    if (typeof VoiceUI !== 'undefined') { VoiceUI.speak(text); return; }
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-TW';
    speechSynthesis.speak(u);
  }
  // 等話說完（換頁前用）；沒有 voice-ui 的頁面就不等
  const sayDone = () => (typeof VoiceUI !== 'undefined' ? VoiceUI.waitDone(4000) : Promise.resolve());

  // 這個地方在主地圖上的範圍（地圖座標 [x0, y0, x1, y1]）
  function frame(t) {
    const [x0, y1] = project(t.box[0], t.box[1]);
    const [x1, y0] = project(t.box[2], t.box[3]);
    return [x0, y0, x1, y1];
  }

  // 去過幾站（region.js 存在 localStorage 的 region-<id>）
  function progress(id) {
    try {
      const p = JSON.parse(localStorage.getItem(`region-${id}`)) || {};
      return { done: (p.visited || []).length, total: p.total || 0 };
    } catch { return { done: 0, total: 0 }; }
  }

  // 飛機（機頭朝右，大約 -50～50 的大小）：白色機身、藍色尾翼
  const PLANE = `
    <path d="M-6 -2 L-26 -34 H-15 L14 -2Z" fill="#d9dee5"/>
    <path d="M-38 -4 L-48 -26 H-40 L-28 -4Z" fill="#3d8bf2"/>
    <path d="M-46 -2 Q-46 -10 -36 -10 H30 Q48 -10 50 0 Q48 10 30 10 H-36 Q-46 10 -46 2Z" fill="#fff" stroke="#bcc6d3" stroke-width="2"/>
    <path d="M34 -7 Q44 -6 47 -1 H36Z" fill="#7cc4ff"/>
    ${[-24, -14, -4, 6, 16].map((x) => `<circle cx="${x}" cy="-2" r="2.6" fill="#7cc4ff"/>`).join('')}
    <path d="M-34 4 H30" stroke="#3d8bf2" stroke-width="3"/>
    <path d="M-6 4 L-24 38 H-13 L14 4Z" fill="#e8ecf1" stroke="#bcc6d3" stroke-width="1.5"/>`;

  // 一路上的小白雲（飛機尾巴冒出來，慢慢變大變淡）
  const puff = (x, y, r) => `<circle class="puff" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}"/>`;

  /* ---------- 雲朵轉場 ---------- */
  let cloudsEl = null;
  function clouds() {
    if (cloudsEl) return cloudsEl;
    cloudsEl = document.createElement('div');
    cloudsEl.className = 'travel-clouds';
    // 滿滿的大白雲，從畫面四周和中間長出來
    const spots = [[10, 15], [35, 8], [62, 12], [90, 10], [20, 45], [50, 40], [80, 45], [5, 80], [35, 75], [65, 82], [95, 78], [50, 100], [50, 0]];
    cloudsEl.innerHTML = spots.map(([x, y], i) => `<i style="left:${x}%;top:${y}%;transition-delay:${(i % 4) * 0.05}s"></i>`).join('');
    document.body.append(cloudsEl);
    return cloudsEl;
  }
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  // 雲把畫面蓋起來
  async function cloudsIn() { const c = clouds(); void c.offsetWidth; c.classList.add('in'); await wait(650); }
  // 雲散開（一開始就蓋著的話，先蓋著再散開）
  async function cloudsOut() { const c = clouds(); c.classList.add('in'); void c.offsetWidth; await wait(60); c.classList.remove('in'); await wait(650); }

  /* ---------- 換頁時記住「正在飛」 ---------- */
  // dir: 'in' = 從主地圖飛進環遊地圖、'out' = 從環遊地圖飛回主地圖
  function setFlight(id, dir) { try { sessionStorage.setItem('travel', JSON.stringify({ id, dir, t: Date.now() })); } catch { /* */ } }
  function takeFlight(dir) {
    try {
      const f = JSON.parse(sessionStorage.getItem('travel'));
      sessionStorage.removeItem('travel');
      // 太久以前的不算（例如重新整理）
      return f && f.dir === dir && Date.now() - f.t < 15000 ? f : null;
    } catch { return null; }
  }

  return { project, HOME, TRIPS, trip, frame, progress, PLANE, puff, cloudsIn, cloudsOut, setFlight, takeFlight, wait, say, sayDone, goText, welcomeText };
})();
