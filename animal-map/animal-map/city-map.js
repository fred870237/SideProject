// 城市地圖（車子版）：草地上有工地、消防局 / 警察局 / 醫院、機場、馬路、鐵路、農場、小鎮、港口
// app.js 看到 cityScene 存在就畫這張地圖，車子的位置寫在 vehicles.js 的 x / y
function cityScene() {
  const INK = '#4a3b33';
  const s = (fill, w = 2) => `fill="${fill}" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"`;
  const rect = (x, y, w, h, fill, rx = 3, sw = 2) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ${s(fill, sw)}/>`;
  const zone = (x, y, w, h, fill, extra = '') => `<rect class="zone-bg" x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${fill}" ${extra}/>`;
  const tree = (x, y) => `<use href="#d-tree" transform="translate(${x} ${y})"/>`;
  const pine = (x, y) => `<use href="#d-pine" transform="translate(${x} ${y})"/>`;
  const cone = (x, y) => `<path d="M${x - 5} ${y} L${x} ${y - 13} L${x + 5} ${y}Z" ${s('#ff8a3d', 1.4)}/><path d="M${x - 3} ${y - 5} h6" stroke="#fff" stroke-width="2"/>`;
  const windows = (x, y, cols, rows, gap = 13) => {
    let out = '';
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) out += rect(x + c * gap, y + r * gap, 8, 8, '#bfe6ff', 1.5, 1.4);
    return out;
  };

  // ---------- 底圖 ----------
  const ground = `<rect x="-600" y="-400" width="2200" height="1360" fill="#a6dc74"/>
    <rect x="-600" y="-400" width="2200" height="1360" fill="url(#grassDots)"/>`;

  const sea = `<path d="M656 334 Q656 330 662 330 H1600 V960 H656Z" fill="#5fb4e8"/>
    <path d="M700 380 q8 -5 16 0 t16 0 M940 440 q8 -5 16 0 t16 0 M780 470 q8 -5 16 0 t16 0 M900 540 q8 -5 16 0 t16 0"
      fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>
    ${rect(652, 330, 30, 240, '#c9a27a', 2)}
    <path d="M652 350 h30 M652 372 h30 M652 394 h30 M652 416 h30 M652 438 h30 M652 460 h30 M652 482 h30 M652 504 h30 M652 526 h30" stroke="#9a6a3e" stroke-width="1.6"/>`;

  // 馬路（中間一條大馬路，上面兩條小路），鐵路在大馬路下面
  let dashes = '';
  for (let x = -600; x < 1600; x += 36) dashes += `M${x} 252 h18 `;
  const roads = `
    <rect x="330" y="-400" width="24" height="630" fill="#7b828c"/>
    <rect x="643" y="-400" width="24" height="630" fill="#7b828c"/>
    <path d="M342 -400 V226 M655 -400 V226" stroke="#fff" stroke-width="2" stroke-dasharray="8 8" opacity=".8"/>
    <rect x="-600" y="224" width="2200" height="56" fill="#6b7280"/>
    <path d="M-600 226 H1600 M-600 278 H1600" stroke="#d1d5db" stroke-width="4"/>
    <path d="${dashes}" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`;
  let ties = '';
  for (let x = -600; x < 1600; x += 12) ties += `M${x} 312 v14 `;
  const railway = `<path d="${ties}" stroke="#8a5a3a" stroke-width="5"/>
    <path d="M-600 315 H1600 M-600 323 H1600" stroke="#8f98a3" stroke-width="2.6"/>`;

  // ---------- 各個區域 ----------
  const construction = zone(14, 14, 304, 202, '#f2d38b', 'stroke="#ff8a3d" stroke-width="3" stroke-dasharray="10 7"') +
    `<path d="M24 210 q20 -26 44 0z M250 210 q16 -18 34 0z" ${s('#c9965a', 1.6)}/>` +
    cone(30, 112) + cone(304, 112) + cone(170, 204) + cone(186, 204) + cone(300, 206);

  const rescue = zone(366, 14, 276, 202, '#f3e6dc') +
    // 消防局
    rect(378, 50, 66, 56, '#e53935') + `<path d="M374 52 L411 34 L448 52Z" ${s('#b71c1c')}/>` +
    rect(390, 76, 42, 30, '#fff3c4', 2) + `<path d="M390 84 h42 M390 92 h42 M390 100 h42" stroke="${INK}" stroke-width="1.2"/>` +
    rect(400, 56, 22, 12, '#fff', 2, 1.4) + `<text x="411" y="65.5" class="sign">119</text>` +
    // 警察局
    rect(472, 46, 64, 60, '#3d8bf2') + windows(480, 54, 4, 2) +
    rect(494, 84, 20, 22, '#bfe6ff', 2) + rect(486, 40, 36, 10, '#fff', 2, 1.4) + `<text x="504" y="48" class="sign">POLICE</text>` +
    // 醫院
    rect(564, 42, 66, 64, '#ffffff') + windows(572, 64, 4, 2) +
    `<path d="M592 47 h10 v6 h6 v8 h-6 v6 h-10 v-6 h-6 v-8 h6z" fill="#e53935"/>` +
    rect(588, 90, 18, 16, '#bfe6ff', 2) +
    `<circle cx="604" cy="206" r="9" fill="#ffe066" opacity=".9"/>`;

  let runway = '';
  for (let x = 700; x < 960; x += 30) runway += `M${x} 196 h16 `;
  const airport = zone(668, 14, 318, 202, '#dde3ea') +
    rect(684, 186, 290, 20, '#555c66', 4) + `<path d="${runway}" stroke="#fff" stroke-width="3"/>` +
    // 塔台
    rect(700, 70, 14, 86, '#f5f7fa') + rect(690, 52, 34, 20, '#bfe6ff', 4) + `<path d="M688 52 h38 l-6 -8 h-26z" ${s('#3d8bf2')}/>` +
    rect(684, 150, 46, 8, '#cfd6de', 2) +
    // 直升機停機坪、火箭發射台
    `<ellipse cx="790" cy="114" rx="26" ry="8" ${s('#ffe066', 1.6)}/><text x="790" y="117.5" class="sign">H</text>` +
    rect(918, 116, 52, 9, '#9aa3ad', 2) + `<path d="M926 116 L934 60 M962 116 L954 60" stroke="${INK}" stroke-width="2.4"/>`;

  let rows = '';
  for (let y = 458; y < 540; y += 12) rows += `M108 ${y} H300 `;
  const farm = zone(14, 336, 290, 210, '#cde89a') +
    `<rect x="104" y="452" width="200" height="88" rx="10" fill="#c9965a"/><path d="${rows}" stroke="#7cb342" stroke-width="5" stroke-linecap="round"/>` +
    // 穀倉
    rect(30, 386, 56, 48, '#e53935') + `<path d="M24 390 L58 362 L92 390Z" ${s('#b71c1c')}/>` +
    rect(48, 406, 20, 28, '#fff3c4', 2) + `<path d="M48 406 L68 434 M68 406 L48 434" stroke="${INK}" stroke-width="1.6"/>` +
    rect(30, 448, 22, 46, '#d9dee5', 10) +
    tree(28, 520) + tree(60, 528);

  const house = (x, y, c, roof) => rect(x, y, 34, 28, c) + `<path d="M${x - 4} ${y + 2} L${x + 17} ${y - 16} L${x + 38} ${y + 2}Z" ${s(roof)}/>` +
    rect(x + 13, y + 12, 9, 16, '#c98b55', 1.5, 1.4) + rect(x + 4, y + 6, 7, 7, '#bfe6ff', 1.5, 1.4);
  const town = zone(316, 336, 326, 210, '#e9f3d6') +
    // 學校
    rect(330, 376, 84, 56, '#ffe9a8') + `<path d="M326 378 L372 356 L418 378Z" ${s('#e07b24')}/>` + windows(338, 386, 6, 2) +
    rect(364, 412, 16, 20, '#c98b55', 2) + `<path d="M372 356 v-14 l10 4 l-10 4" ${s('#e53935', 1.4)}/>` +
    // 郵局
    rect(560, 398, 72, 50, '#2e9e5b') + rect(572, 404, 48, 14, '#fff', 2, 1.4) + `<text x="596" y="414" class="sign">POST</text>` +
    rect(586, 426, 20, 22, '#bfe6ff', 2) +
    house(440, 384, '#ffd6e0', '#e57399') + house(486, 372, '#d6ecff', '#3d8bf2') +
    tree(560, 470) + tree(486, 474) + pine(628, 540) + tree(334, 520);

  const port = `<g class="lighthouse">${rect(966, 360, 18, 52, '#fff')}<path d="M966 376 h18 M966 392 h18" stroke="#e53935" stroke-width="6"/>
    ${rect(962, 350, 26, 12, '#ffe066', 3)}<path d="M960 350 L975 336 L990 350Z" ${s('#e53935')}/></g>`;

  // ---------- 區域名稱（中文 / 英文） ----------
  const ZONES = [
    ['工地', 'CONSTRUCTION', 166, 30], ['救援中心', 'RESCUE CENTER', 504, 24], ['機場', 'AIRPORT', 860, 30],
    ['農場', 'FARM', 150, 352], ['小鎮', 'TOWN', 478, 352], ['港口', 'HARBOR', 860, 352],
  ];
  const pill = (t, lang, x, y) => {
    const w = lang === 'zh' ? t.length * 17 + 20 : t.length * 9 + 22;
    return `<g class="zone ${lang}" transform="translate(${x} ${y})"><rect x="${-w / 2}" y="-13" width="${w}" height="26" rx="13"/><text>${t}</text></g>`;
  };
  const labels = ZONES.map(([zh, en, x, y]) => pill(zh, 'zh', x, y) + pill(en, 'en', x, y)).join('');

  const defs = `<pattern id="grassDots" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M8 12 l2 -5 M12 12 l-1 -6 M28 32 l2 -5 M32 32 l-1 -6" stroke="#7fbf4f" stroke-width="1.6" stroke-linecap="round"/>
    </pattern>`;

  const scenery = ground + sea + roads + railway +
    `<g class="decor">${construction}${rescue}${airport}${farm}${town}${port}
      ${tree(24, 300)}${pine(1000, 210)}${tree(640, 590)}</g>`;

  return { defs, scenery, labels };
}
