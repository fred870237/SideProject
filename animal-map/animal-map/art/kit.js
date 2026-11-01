// 可愛風格全身動物插圖的共用工具（座標範圍 -50 ~ 50，腳底大約在 y = 44）
// 每個 art/*.js 用 Object.assign(ART, { id: () => svg字串 }) 加入動物
// 畫法：Q 版比例（大頭、小身體）、臉朝前、身體側面；粗深色外框＋平塗顏色＋閃亮大眼睛＋腮紅

const LINE = '#4a3b33';
const SW = 2.4; // 外框粗細

const ART = {};

const K = (() => {
  const st = (fill, extra = '') => `fill="${fill}" stroke="${LINE}" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round" ${extra}`;
  const circle = (cx, cy, r, fill, extra = '') => `<circle cx="${cx}" cy="${cy}" r="${r}" ${st(fill, extra)}/>`;
  const ell = (cx, cy, rx, ry, fill, rot = 0, extra = '') =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${rot ? `transform="rotate(${rot} ${cx} ${cy})"` : ''} ${st(fill, extra)}/>`;
  // 沒有外框的色塊（花紋、肚子、腮紅）
  const flat = (cx, cy, rx, ry, fill, rot = 0, op = 1) =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" opacity="${op}" ${rot ? `transform="rotate(${rot} ${cx} ${cy})"` : ''}/>`;
  const path = (d, fill, extra = '') => `<path d="${d}" ${st(fill, extra)}/>`;
  const flatPath = (d, fill, op = 1) => `<path d="${d}" fill="${fill}" opacity="${op}"/>`;
  const line = (d, color = LINE, w = 2.6) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const both = (fn, cx = 0) => fn(1, cx) + fn(-1, cx); // 左右對稱
  const g = (inner, tf) => `<g transform="${tf}">${inner}</g>`;

  // 圓頭圓腳的腿：(x, 上緣 y) 到腳底 y=44
  const leg = (x, top, w, fill, bottom = 44) =>
    `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${bottom - top}" rx="${Math.min(w / 2, 5)}" ${st(fill)}/>`;
  // 後面那一排腳顏色暗一點，看起來有前後
  const backLeg = (x, top, w, fill, bottom = 43) => leg(x, top, w, shade(fill), bottom);

  // 把顏色調暗（給後腳、陰影用）
  function shade(hex, k = 0.82) {
    const n = parseInt(hex.slice(1), 16);
    const c = (v) => Math.round(v * k).toString(16).padStart(2, '0');
    return `#${c(n >> 16)}${c((n >> 8) & 255)}${c(n & 255)}`;
  }

  // 閃亮大眼睛
  const eye = (x, y, r = 4.2, ring = null) => `
    ${ring ? `<circle cx="${x}" cy="${y}" r="${r + 2}" fill="${ring}"/>` : ''}
    <circle cx="${x}" cy="${y}" r="${r}" fill="#2a2226"/>
    <circle cx="${x + r * 0.32}" cy="${y - r * 0.38}" r="${r * 0.42}" fill="#fff"/>
    <circle cx="${x - r * 0.35}" cy="${y + r * 0.38}" r="${r * 0.18}" fill="#fff"/>`;
  // 一對眼睛，cx 是臉的中心
  const eyes = (cx, y, dx = 8, r = 4.2, ring = null) => eye(cx - dx, y, r, ring) + eye(cx + dx, y, r, ring);
  const blush = (cx, y, dx = 13, rx = 4.2) => flat(cx - dx, y, rx, rx * 0.6, '#ff7d96', 0, 0.55) + flat(cx + dx, y, rx, rx * 0.6, '#ff7d96', 0, 0.55);
  const nose = (cx, y, c = '#3a2a2a', w = 3) => `<path d="M${cx - w} ${y - 1.2} q${w} -1.2 ${2 * w} 0 q0 2.8 ${-w} 3.6 q${-w} -0.8 ${-w} -3.6z" fill="${c}"/>`;
  const wmouth = (cx, y) => line(`M${cx - 4} ${y} q2 2.4 4 0 q2 2.4 4 0`, LINE, 1.8);
  const smile = (cx, y, w = 3.6) => line(`M${cx - w} ${y} q${w} ${w * 0.9} ${2 * w} 0`, LINE, 1.8);
  const beak = (cx, y, w = 5, h = 4, c = '#f7a531') => path(`M${cx - w} ${y} Q${cx} ${y - 2} ${cx + w} ${y} Q${cx} ${y + h * 2} ${cx - w} ${y}z`, c);
  const whiskers = (cx, y, dx = 11) => both((s) =>
    line(`M${cx + s * dx} ${y} l${s * 8} -2 M${cx + s * dx} ${y + 3} l${s * 8} 2`, LINE, 1.2));

  // 耳朵：圓耳、尖耳（cx 是臉中心，dx 是左右距離）
  const roundEars = (cx, y, dx, r, fill, inner) => both((s) =>
    circle(cx + s * dx, y, r, fill) + (inner ? flat(cx + s * dx, y + 0.8, r * 0.55, r * 0.55, inner) : ''));
  const pointEars = (cx, y, dx, h, w, fill, inner) => both((s) => {
    const bx = cx + s * dx;
    return path(`M${bx - s * w / 2} ${y} L${bx + s * 2} ${y - h} L${bx + s * w / 2 + s * 2} ${y + 2}z`, fill) +
      (inner ? flatPath(`M${bx - s * w / 4} ${y - 1} L${bx + s * 2} ${y - h + 5} L${bx + s * w / 4 + s * 2} ${y}z`, inner) : '');
  });

  // 脖子：從頭 (x1,y1) 連到身體 (x2,y2) 的橢圓，要在身體之前畫（頭和身體會蓋住兩端，只露出中間）
  const neck = (x1, y1, x2, y2, w, fill) => {
    const len = Math.hypot(x2 - x1, y2 - y1);
    const rot = -Math.atan2(x2 - x1, y2 - y1) * 180 / Math.PI;
    return ell((x1 + x2) / 2, (y1 + y2) / 2, w / 2, len / 2, fill, rot.toFixed(1));
  };

  // 地面上的小草（放在腳邊增加可愛感，可選）
  const tuft = (x, y = 44, c = '#5fae3b') => line(`M${x - 4} ${y} l2 -5 M${x} ${y} v-6 M${x + 4} ${y} l-2 -5`, c, 1.8);

  return { st, circle, ell, flat, path, flatPath, line, both, g, leg, backLeg, shade, eye, eyes, blush, nose, wmouth, smile, beak, whiskers, roundEars, pointEars, neck, tuft };
})();
