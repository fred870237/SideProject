// 機關書的畫圖工具：粗深色外框＋平塗顏色
// 每台車在自己的座標裡畫：地面是 y = 0，往上是負的；會動的零件用 <g id="<車子id>-<零件名>"> 包起來
const LINE = '#2d2a3a';

const K = {
  st: (fill, w = 4) => `fill="${fill}" stroke="${LINE}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`,
  rect: (x, y, w, h, fill, rx = 6, sw = 4) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ${K.st(fill, sw)}/>`,
  poly: (pts, fill, sw = 4) => `<polygon points="${pts}" ${K.st(fill, sw)}/>`,
  path: (d, fill, sw = 4) => `<path d="${d}" ${K.st(fill, sw)}/>`,
  circle: (cx, cy, r, fill, sw = 4) => `<circle cx="${cx}" cy="${cy}" r="${r}" ${K.st(fill, sw)}/>`,
  line: (x1, y1, x2, y2, w = 4, color = LINE) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`,
  // 有外框的粗桿子（吊車的鐵架、手臂）
  bar: (x1, y1, x2, y2, w, color) => K.line(x1, y1, x2, y2, w + 6) + K.line(x1, y1, x2, y2, w, color),

  // 輪子：外面的 <g> 有 class="wheel"，轉軸記在 data-cx / data-cy，app.js 的 wheels() 會一起轉
  wheel(id, cx, cy, r) {
    const bolts = [0, 90, 180, 270].map((a) => {
      const rad = (a * Math.PI) / 180;
      return `<circle cx="${(cx + Math.cos(rad) * r * 0.32).toFixed(1)}" cy="${(cy + Math.sin(rad) * r * 0.32).toFixed(1)}" r="${Math.max(2.5, r * 0.09).toFixed(1)}" fill="${LINE}"/>`;
    }).join('');
    return `<g id="${id}" class="wheel" data-cx="${cx}" data-cy="${cy}">` +
      K.circle(cx, cy, r, '#3b3a48') + K.circle(cx, cy, r * 0.55, '#e3e3ea', 3) + bolts + '</g>';
  },

  // 車窗：淺藍色加一道反光
  win(x, y, w, h, rx = 8) {
    return K.rect(x, y, w, h, '#bfe6fb', rx, 3) +
      `<path d="M${x + w * 0.22},${y + h * 0.78} L${x + w * 0.55},${y + h * 0.2}" stroke="#fff" stroke-width="${Math.max(4, w * 0.09)}" stroke-linecap="round" opacity=".85"/>`;
  },

  // 戴安全帽的頭（面向右）
  head(cx, cy, r = 14, hat = '#ffcf1f', skin = '#f3c9a0') {
    return K.circle(cx, cy, r, skin, 3) +
      `<circle cx="${cx + r * 0.4}" cy="${cy}" r="${(r * 0.13).toFixed(1)}" fill="${LINE}"/>` +
      K.path(`M${cx - r * 1.15},${cy - r * 0.15} Q${cx},${cy - r * 2} ${cx + r * 1.2},${cy - r * 0.15} Z`, hat, 3);
  },

  // 站著的工人（腳底在 y）
  worker(x, y, s = 1, vest = '#ff7a1a', hat = '#ffcf1f') {
    return `<g transform="translate(${x} ${y}) scale(${s})">` +
      K.rect(-11, -40, 9, 40, '#3d5a99', 3, 3) + K.rect(2, -40, 9, 40, '#3d5a99', 3, 3) +
      K.rect(-17, -82, 34, 46, vest, 9, 3) +
      '<rect x="-17" y="-64" width="34" height="6" fill="#fff" opacity=".9"/>' +
      K.head(0, -96, 15, hat) + '</g>';
  },

  // 三角錐
  cone(x, y, s = 1) {
    return `<g transform="translate(${x} ${y}) scale(${s})">` +
      K.path('M-8,-48 L8,-48 L19,-7 L-19,-7 Z', '#ff7a1a', 3) +
      '<path d="M-13,-27 L13,-27" stroke="#fff" stroke-width="7"/>' +
      K.rect(-26, -9, 52, 9, '#ff7a1a', 3, 3) + '</g>';
  },

  // 紅白施工護欄（腳底在 y）
  barrier(x, y, w = 130) {
    const stripes = [];
    for (let i = 0; i < w; i += 26) stripes.push(`<path d="M${x + i},${y - 70} l14,0 l-14,26 Z" fill="#e8413a"/>`);
    return K.line(x + 12, y - 40, x + 12, y, 6) + K.line(x + w - 12, y - 40, x + w - 12, y, 6) +
      `<rect x="${x}" y="${y - 70}" width="${w}" height="26" rx="4" fill="#fff"/>` + stripes.join('') +
      `<rect x="${x}" y="${y - 70}" width="${w}" height="26" rx="4" fill="none" stroke="${LINE}" stroke-width="4"/>`;
  },

  // 雲
  cloud(x, y, s = 1) {
    return `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity=".95">` +
      '<circle cx="0" cy="0" r="38"/><circle cx="44" cy="-14" r="48"/><circle cx="94" cy="2" r="36"/><rect x="0" y="0" width="94" height="36"/></g>';
  },
};
