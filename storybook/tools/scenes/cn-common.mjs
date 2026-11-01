// 中國地區故事共用的東西：中式背景、道具、人物小工具。只有 cn 的書使用（kong-rong、hou-yi、nian-beast、cao-chong、sima-guang）。

import * as S from './lib.mjs';

const { H, BX, BW, BY, INK, line, L, SKIN, at, person, armsAt, face } = S;

// ---------- 人物 ----------
// 換掉 person() 的手臂：arms = [[肩x, 肩y, 手x, 手y], ...]（身體座標，大人肩膀約 (±26, -88)、小孩約 (±26, -72)）
export const armSeg = (sx, sy, hx, hy, c, skin = SKIN) =>
  `<path d="M${sx} ${sy} L${hx} ${hy}" stroke="${INK}" stroke-width="22" stroke-linecap="round"/>` +
  `<path d="M${sx} ${sy} L${hx} ${hy}" stroke="${c}" stroke-width="16" stroke-linecap="round"/>` +
  `<circle cx="${hx}" cy="${hy}" r="8" fill="${skin}" ${line(2.5)}/>`;
export function figure(o = {}, arms = null) {
  const out = person(o);
  if (!arms) return out;
  const sh = o.age === 'child' ? -80 : -96;
  const top = o.top ?? '#5b8fd0', skin = o.skin ?? SKIN;
  const def = armsAt(o.pose ?? 'down', top, sh, skin);
  return out.replace(def, arms.map((a) => armSeg(...a, top, skin)).join(''));
}

// 小孩的兩個小髮髻（總角）：當成 person 的 hat 傳進去
export const twinBuns = (c = '#2f2a2a') => `<circle cx="-24" cy="-26" r="11" fill="${c}" ${L}/><circle cx="24" cy="-26" r="11" fill="${c}" ${L}/>`;
// 大人頭頂的小冠（蓋住髮髻）
export const guan = (c = '#2f2a2a') => `<path d="M-13 -30 V-50 Q0 -58 13 -50 V-30z" fill="${c}" ${L}/><path d="M-20 -42 H20" ${line(3)}/>`;
// 官帽（黑色、兩邊有翅）
export const officialHat = (c = '#2f2a2a') =>
  `<path d="M-30 -10 Q-32 -46 0 -46 Q32 -46 30 -10z" fill="${c}" ${L}/><path d="M-22 -40 V-58 H22 V-40z" fill="${c}" ${L}/>` +
  `<path d="M-28 -28 H-64 M28 -28 H64" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M-28 -28 H-62 M28 -28 H62" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`;
// 頭巾（英雄、勇士）
export const headband = (c = '#e2483d') =>
  `<path d="M-32 -12 Q0 -26 32 -12 L32 -3 Q0 -17 -32 -3z" fill="${c}" ${line(2.5)}/>` +
  `<path d="M-30 -8 q-16 4 -22 18 M-30 -6 q-10 10 -10 22" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`;

// ---------- 背景 ----------
// 圓圓的山（桂林那種）
export const karst = (x, y, w, h, c = '#8fbfa8') =>
  `<path d="M${x - w / 2} ${y} Q${x - w / 2} ${y - h} ${x} ${y - h} Q${x + w / 2} ${y - h} ${x + w / 2} ${y}z" fill="${c}"/>`;

// 院子的白牆（灰瓦牆頂），從 BX 畫到 BX+BW；y 是牆腳
export const cnWall = (y = 380, h = 130, { wall = '#f5efe2', tile = '#6f7480' } = {}) =>
  `<rect x="${BX}" y="${y - h}" width="${BW}" height="${h}" fill="${wall}"/>` +
  `<path d="M${BX} ${y} H${BX + BW}" ${line(3)}/>` +
  `<rect x="${BX}" y="${y - h - 22}" width="${BW}" height="22" fill="${tile}" ${L}/>` +
  Array.from({ length: 140 }, (_, i) => `<path d="M${BX + i * 20} ${y - h - 22} v22" stroke="#575c66" stroke-width="2"/>`).join('');

// 石板地面
export const paving = (y = 380, c = '#e1d3b5') =>
  `<rect x="${BX}" y="${y}" width="${BW}" height="${H - y}" fill="${c}"/>` +
  [0, 1, 2, 3, 4].map((i) => `<path d="M${BX} ${y + 30 + i * 46} H${BX + BW}" stroke="#cbbb98" stroke-width="3"/>`).join('') +
  Array.from({ length: 60 }, (_, i) => {
    const r = i % 5, x = BX + ((i * 137) % BW);
    return `<path d="M${x} ${y + 30 + r * 46} v46" stroke="#cbbb98" stroke-width="3"/>`;
  }).join('');

// 中式室內：紅柱、木格窗、木地板
export const cnInterior = ({ wall = '#f3e3c4', floor = '#c79a68' } = {}) =>
  `<rect x="${BX}" y="${BY}" width="${BW}" height="${H - BY}" fill="${wall}"/>` +
  Array.from({ length: 8 }, (_, k) => {
    const i = k - 3, x = i * 400;
    const win = Array.from({ length: 6 }, (_, j) => `<path d="M${x + 110 + j * 30} 110 v190" stroke="#b5654a" stroke-width="3"/>`).join('') +
      Array.from({ length: 6 }, (_, j) => `<path d="M${x + 110} ${140 + j * 30} h180" stroke="#b5654a" stroke-width="3"/>`).join('');
    return `<rect x="${x + 110}" y="110" width="180" height="190" fill="#fff6dc"/>` + win +
      `<rect x="${x + 110}" y="110" width="180" height="190" fill="none" stroke="#8c3a28" stroke-width="8"/>` +
      `<rect x="${x - 20}" y="${BY}" width="40" height="${380 - BY}" fill="#b8432f" ${L}/>`;
  }).join('') +
  `<rect x="${BX}" y="40" width="${BW}" height="22" fill="#8c3a28"/>` +
  `<rect x="${BX}" y="380" width="${BW}" height="${H - 380}" fill="${floor}"/>` +
  [0, 1, 2, 3, 4].map((i) => `<path d="M${BX} ${410 + i * 45} H${BX + BW}" stroke="#b0845a" stroke-width="3"/>`).join('') +
  `<path d="M${BX} 380 H${BX + BW}" ${line(4)}/>`;

// ---------- 植物 ----------
export const bamboo = (x, y, s = 1) => at(x, y, s, false,
  [-18, 6, 26].map((dx, i) => {
    const h = 260 - i * 40;
    return `<rect x="${dx - 6}" y="${-h}" width="12" height="${h}" fill="#7fb85a" ${line(2)}/>` +
      [1, 2, 3, 4].map((k) => `<path d="M${dx - 6} ${-k * h / 5} h12" ${line(2)}/>`).join('') +
      `<path d="M${dx} ${-h * 0.6} q22 -12 40 -6 q-18 12 -40 6z M${dx} ${-h * 0.85} q-22 -14 -40 -8 q18 14 40 8z" fill="#5fa04a" ${line(1.5)}/>`;
  }).join(''));

// 開花的梅樹 / 柳樹
export const blossomTree = (x, y, s = 1, flower = '#ffb7c5') => at(x, y, s, false,
  `<path d="M-8 0 Q-12 -60 0 -100 Q-30 -130 -60 -140 M0 -100 Q30 -140 60 -150 M0 -100 Q4 -150 -6 -180" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/>` +
  `<path d="M-8 0 Q-12 -60 0 -100 Q-30 -130 -60 -140 M0 -100 Q30 -140 60 -150 M0 -100 Q4 -150 -6 -180" fill="none" stroke="#8a5a3a" stroke-width="10" stroke-linecap="round"/>` +
  [[-60, -140], [60, -150], [-6, -182], [-30, -128], [30, -132], [-80, -150], [80, -160], [10, -200], [-40, -170], [44, -178]]
    .map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="12" fill="${flower}" ${line(2)}/><circle cx="${cx}" cy="${cy}" r="3" fill="#f6d36b"/>`).join(''));

export const willow = (x, y, s = 1) => at(x, y, s, false,
  `<rect x="-10" y="-140" width="20" height="140" fill="#8a5a3a" ${L}/>` +
  `<ellipse cx="0" cy="-170" rx="90" ry="50" fill="#8cc56a" ${L}/>` +
  [-70, -45, -20, 5, 30, 55, 78].map((dx) => `<path d="M${dx} -160 q${dx > 0 ? 6 : -6} 60 0 110" fill="none" stroke="#6faa52" stroke-width="5" stroke-linecap="round"/>`).join(''));

export const rock = (x, y, s = 1, c = '#9a9ca6') => at(x, y, s, false,
  `<path d="M-30 0 Q-36 -26 -14 -34 Q6 -44 24 -30 Q38 -18 32 0z" fill="${c}" ${L}/><path d="M-12 -24 q8 -6 16 -2" fill="none" stroke="#c8cad2" stroke-width="3" stroke-linecap="round"/>`);

// ---------- 道具 ----------
// 梨子：原點在底部中心，大約 54 高
export const pear = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M0 0 C-30 0 -32 -26 -17 -36 C-12 -40 -10 -52 0 -54 C10 -52 12 -40 17 -36 C32 -26 30 0 0 0z" fill="#f2d65a" ${L}/>` +
  `<ellipse cx="-10" cy="-20" rx="5" ry="8" fill="#fff6c8" opacity=".8"/>` +
  `<path d="M0 -54 l3 -12" ${line(3)}/><path d="M3 -62 q14 -10 22 0 q-12 8 -22 0z" fill="#6cbd62" ${line(2)}/>`);

// 一籃梨子
export const basket = (x, y, s = 1, full = true) => at(x, y, s, false,
  `<path d="M-70 -60 Q0 -150 70 -60" fill="none" stroke="${INK}" stroke-width="12"/><path d="M-70 -60 Q0 -150 70 -60" fill="none" stroke="#c99a5a" stroke-width="6"/>` +
  (full ? [[-40, -50, 1], [0, -56, 1.1], [40, -50, 1], [-20, -66, 0.9], [22, -68, 0.95]].map(([px, py, ps]) => pear(px, py, ps)).join('') : '') +
  `<path d="M-80 -60 H80 L64 0 H-64z" fill="#d8a960" ${L}/>` +
  `<path d="M-76 -40 H76 M-70 -20 H70" stroke="#b5864a" stroke-width="3"/>` +
  [-50, -25, 0, 25, 50].map((dx) => `<path d="M${dx} -60 L${dx * 0.85} 0" stroke="#b5864a" stroke-width="3"/>`).join(''));

// 矮桌
export const table = (x, y, s = 1, c = '#8c4a32') => at(x, y, s, false,
  `<rect x="-120" y="-78" width="240" height="16" rx="3" fill="${c}" ${L}/>` +
  `<path d="M-104 -62 V0 M104 -62 V0" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M-104 -62 V0 M104 -62 V0" stroke="${c}" stroke-width="10" stroke-linecap="round"/>`);

// 紅燈籠：原點在吊繩頂端
export const lantern = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M0 0 V18" ${line(3)}/>` +
  `<rect x="-14" y="16" width="28" height="9" fill="#f2c14e" ${line(2.5)}/>` +
  `<ellipse cx="0" cy="50" rx="34" ry="28" fill="#e2483d" ${L}/>` +
  `<path d="M0 22 V78 M-18 26 Q-26 50 -18 74 M18 26 Q26 50 18 74" fill="none" stroke="#b8302a" stroke-width="2.5"/>` +
  `<ellipse cx="-12" cy="40" rx="6" ry="10" fill="#ff8a6a" opacity=".7"/>` +
  `<rect x="-14" y="75" width="28" height="9" fill="#f2c14e" ${line(2.5)}/>` +
  `<path d="M-6 84 v20 M0 84 v24 M6 84 v20" stroke="#f2c14e" stroke-width="3" stroke-linecap="round"/>`);

// 一串鞭炮：原點在頂端，n 節
export const firecrackers = (x, y, n = 6, s = 1) => at(x, y, s, false,
  `<path d="M0 0 V${n * 18 + 10}" ${line(3)}/>` +
  Array.from({ length: n }, (_, i) => {
    const d = i % 2 ? 1 : -1;
    return `<g transform="translate(${d * 10} ${14 + i * 18}) rotate(${d * 60})"><rect x="-6" y="-14" width="12" height="28" rx="3" fill="#e2483d" ${line(2)}/><rect x="-6" y="-6" width="12" height="5" fill="#f2c14e"/></g>`;
  }).join(''));

// 爆炸的光芒（劈哩啪啦、砰）
export const bang = (x, y, s = 1, c = '#ffd25e', c2 = '#fff6c8') => at(x, y, s, false,
  `<path d="${Array.from({ length: 24 }, (_, i) => {
    const a = (i * Math.PI) / 12, r = i % 2 ? 22 : 50;
    return `${i ? 'L' : 'M'}${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
  }).join(' ')}z" fill="${c}" ${line(2.5)}/>` + `<circle r="14" fill="${c2}"/>`);

// 春聯（紅紙，沒有字，只有金色花紋）和斗方
export const couplet = (x, y, w = 34, h = 150) =>
  `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${h}" fill="#e2483d" ${line(2.5)}/>` +
  Array.from({ length: Math.floor(h / 30) }, (_, i) => `<circle cx="${x}" cy="${y + 18 + i * 30}" r="7" fill="none" stroke="#f6d36b" stroke-width="3"/>`).join('');
export const fuSquare = (x, y, s = 1) => at(x, y, s, false,
  `<rect x="-30" y="-30" width="60" height="60" fill="#e2483d" transform="rotate(45)" ${line(2.5)}/>` +
  `<rect x="-20" y="-20" width="40" height="40" fill="none" stroke="#f6d36b" stroke-width="3" transform="rotate(45)"/>` +
  `<circle r="9" fill="#f6d36b"/>`);

// 紅色漸層的煙火
export const firework = (x, y, s = 1, c = '#ffd25e') => at(x, y, s, false,
  Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    return `<path d="M${(Math.cos(a) * 16).toFixed(1)} ${(Math.sin(a) * 16).toFixed(1)} L${(Math.cos(a) * 48).toFixed(1)} ${(Math.sin(a) * 48).toFixed(1)}" stroke="${c}" stroke-width="5" stroke-linecap="round"/>` +
      `<circle cx="${(Math.cos(a) * 58).toFixed(1)}" cy="${(Math.sin(a) * 58).toFixed(1)}" r="4" fill="${c}"/>`;
  }).join(''));

// 拐杖：給 item 用，從手 (hx, hy) 到地面
export const cane = (hx, hy) =>
  `<path d="M${hx} ${hy - 10} V0" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M${hx} ${hy - 10} V0" stroke="#a0703f" stroke-width="5" stroke-linecap="round"/>` +
  `<path d="M${hx} ${hy - 10} q0 -14 14 -12" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M${hx} ${hy - 10} q0 -14 14 -12" fill="none" stroke="#a0703f" stroke-width="5" stroke-linecap="round"/>`;

// 對話用的小泡泡（思考），裡面放 content（泡泡座標，中心 0,0）
export const thought = (x, y, w, h, content = '', tailX = -40, tailY = 80) => at(x, y, 1, false,
  `<circle cx="${tailX}" cy="${tailY}" r="8" fill="#fff" ${line(2.5)}/><circle cx="${tailX * 0.6}" cy="${tailY * 0.7}" r="12" fill="#fff" ${line(2.5)}/>` +
  `<ellipse rx="${w / 2}" ry="${h / 2}" fill="#fff" ${L}/>` + content);

// 動作線（發抖、搖晃）
export const shake = (x, y, h = 40) =>
  `<path d="M${x} ${y} q-8 ${h / 4} 0 ${h / 2} q8 ${h / 4} 0 ${h / 2}" fill="none" ${line(3)}/>`;

export { face };
