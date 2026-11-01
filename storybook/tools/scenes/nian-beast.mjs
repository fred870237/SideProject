// 年獸的故事的插畫。用法：node tools/scenes/nian-beast.mjs --sheet

import * as S from './lib.mjs';
import { figure, karst, bamboo, lantern, firecrackers, bang, couplet, fuSquare, firework, cane, shake, willow } from './cn-common.mjs';

const { BX, BW, H, INK, L, line, at, svg, face, sky, sun, cloud, hills, night, moon, sparkle, sweat, hearts, grass, cnHouse, writeBook } = S;

// ---------- 年獸 ----------
// 大頭、金色的角、橘色的鬃毛、毛茸茸的尾巴；mood: angry / normal / scared / happy
function nian({ mood = 'angry', run = false } = {}) {
  const C = '#7f8fe0', D = '#6574c8', M = '#f2a14a', B = '#eef0ff';
  const legs = run
    ? [[-70, -36, -96, -10], [-40, -36, -50, -4], [30, -36, 50, -6], [56, -36, 86, -14]]
    : [[-58, -40, -58, -6], [-28, -40, -28, -4], [24, -40, 24, -4], [54, -40, 54, -6]];
  const fluff = (cx, cy, r, n, rr, c) => Array.from({ length: n }, (_, i) => {
    const a = (i * 2 * Math.PI) / n;
    return `<circle cx="${(cx + Math.cos(a) * r).toFixed(1)}" cy="${(cy + Math.sin(a) * r).toFixed(1)}" r="${rr}" fill="${c}" ${L}/>`;
  }).join('');
  const fangs = mood === 'angry' ? `<path d="M-12 30 l4 10 l4 -10z M4 30 l4 10 l4 -10z" fill="#fff" ${line(2)}/>` : '';
  return fluff(-92, -96, 16, 6, 14, M) + `<circle cx="-92" cy="-96" r="16" fill="${M}"/>` +
    legs.map(([a, b, c, d]) => `<path d="M${a} ${b} L${c} ${d}" stroke="${INK}" stroke-width="30" stroke-linecap="round"/><path d="M${a} ${b} L${c} ${d}" stroke="${D}" stroke-width="24" stroke-linecap="round"/>`).join('') +
    `<ellipse cx="0" cy="-74" rx="86" ry="54" fill="${C}" ${L}/>` +
    `<ellipse cx="24" cy="-60" rx="42" ry="28" fill="${B}"/>` +
    [-50, -20, 10].map((x) => `<path d="M${x} -118 q8 -10 16 0" fill="none" stroke="${D}" stroke-width="4" stroke-linecap="round"/>`).join('') +
    at(64, -150, 1, false,
      fluff(0, 0, 64, 14, 20, M) +
      `<path d="M-30 -48 Q-56 -96 -24 -112 Q-38 -80 -12 -56z" fill="#f6d36b" ${L}/>` +
      `<path d="M30 -48 Q56 -96 24 -112 Q38 -80 12 -56z" fill="#f6d36b" ${L}/>` +
      `<circle r="60" fill="${C}" ${L}/>` +
      `<ellipse cx="0" cy="24" rx="32" ry="22" fill="${B}"/>` +
      `<ellipse cx="0" cy="8" rx="9" ry="6" fill="${INK}"/>` +
      at(0, 4, 1.25, false, face(44, mood, { cheek: '#ff9ab0' })) + fangs);
}

// ---------- 人物 ----------
const longBeard = `<path d="M-24 10 Q-20 70 0 84 Q20 70 24 10 Q12 24 0 22 Q-12 24 -24 10z" fill="#f6f6f6" ${line(2.5)}/>` +
  `<path d="M-18 -14 q8 -6 14 0 M4 -14 q8 -6 14 0" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`;
const elder = (o = {}, arms) => figure({ hair: 'bald', hairColor: '#eeeeee', hat: longBeard, top: '#8b7d6b', bottom: '#5a4632', ...o }, arms);
const elderRed = (o = {}, arms) => elder({ top: '#d8443a', bottom: '#f2c14e', ...o }, arms);
const caneItem = cane(-36, -45);

const VC = [['#5b8fd0', '#3d5a99'], ['#d97a9a', '#a84a6a'], ['#6cae6a', '#3f6f4a'], ['#9a6fc0', '#5a3f80']];
const villager = (i = 0, o = {}, arms) => figure({ hair: i % 2 ? 'bun' : 'topknot', top: VC[i % 4][0], bottom: VC[i % 4][1], ...o }, arms);
const kid = (i = 0, o = {}, arms) => figure({ age: 'child', hair: i % 2 ? 'pigtails' : 'topknot', top: ['#f29b4b', '#e2483d', '#3f9aa0'][i % 3], bottom: '#8a5a32', ...o }, arms);
const bundle = (x, y, c = '#5b8fd0') => `<circle cx="${x}" cy="${y}" r="20" fill="${c}" ${L}/><path d="M${x - 6} ${y - 18} l6 -10 l6 10" fill="${c}" ${line(2.5)}/>`;

// 小雞（逃跑用）
const chicken = (x, y, s = 1, flip = false) => at(x, y, s, flip,
  `<path d="M-6 -10 v10 M6 -10 v10" ${line(3)}/>` +
  `<ellipse cx="0" cy="-26" rx="22" ry="18" fill="#fff" ${L}/><path d="M-20 -30 q-14 -10 -10 -24 q6 8 14 10" fill="#fff" ${line(2.5)}/>` +
  `<circle cx="14" cy="-46" r="12" fill="#fff" ${L}/><path d="M8 -58 q4 -10 8 -2 q4 -8 8 2z" fill="#e2483d" ${line(2)}/>` +
  `<path d="M25 -48 l9 3 l-9 4z" fill="#f2c14e" ${line(2)}/><circle cx="17" cy="-48" r="3" fill="${INK}"/>`);

// ---------- 背景 ----------
// 裝飾過的房子：春聯、斗方、燈籠；lit = 窗戶亮著
const festiveHouse = (x, y, s = 1, { lit = false, deco = true, red = true } = {}) =>
  cnHouse(x, y, s) +
  at(x, y, s, false,
    (lit ? `<rect x="-100" y="-95" width="44" height="44" fill="#ffd25e" opacity=".85"/><rect x="56" y="-95" width="44" height="44" fill="#ffd25e" opacity=".85"/>` +
      `<path d="M-78 -95 v44 M-100 -73 h44 M78 -95 v44 M56 -73 h44" ${line(2)}/>` : '') +
    (deco && red ? couplet(-46, -88, 18, 82) + couplet(46, -88, 18, 82) + fuSquare(-16, -52, 0.32) + fuSquare(16, -52, 0.32) : '') +
    (deco ? lantern(-130, -112, 0.75) + lantern(130, -112, 0.75) : ''));

const village = () => cnHouse(140, 440, 0.6) + cnHouse(660, 430, 0.55) + willow(760, 450, 0.6);

const nightGround = (y, c = '#4a5a7a') => `<rect x="${BX}" y="${y}" width="${BW}" height="${H - y}" fill="${c}"/>`;

// ---------- 每一頁 ----------
const pages = {
  // 封面：紅燈籠、春聯、鞭炮，年獸嚇一跳
  cover: svg(night('#3a2050', '#8a3a5a') + moon(660, 100, 36) + firework(160, 120, 0.9) + firework(480, 70, 0.7, '#ff8aa0') +
    nightGround(440, '#6a4a5a') + festiveHouse(250, 460, 1.05, { lit: true }) +
    `<path d="M${BX} 230 Q400 290 ${BX + BW} 230" fill="none" ${line(3)}/>` +
    [60, 180, 300, 420, 540, 660, 760].map((x) => lantern(x, 230 + 60 * (1 - ((x - 400) / 1400) ** 2) * 0 + (x > 100 && x < 700 ? 18 : 6), 0.55)).join('') +
    firecrackers(470, 300, 7, 1.1) + bang(470, 470, 0.8) + bang(420, 420, 0.5, '#ff8a6a') +
    at(250, 575, 0.95, false, elderRed({ pose: 'raise' })) +
    at(640, 575, 0.95, true, nian({ mood: 'scared' })) + shake(520, 380) + sweat(700, 360)),

  // 1. 海底住著怪獸「年」
  '01': svg(night('#1d2550', '#2b3f78') + moon(620, 90, 34) +
    `<rect x="${BX}" y="250" width="${BW}" height="${H - 250}" fill="#2f6fa8"/>` +
    `<rect x="${BX}" y="250" width="${BW}" height="12" fill="#5fa8d8"/>` +
    `<path d="M${BX} 540 Q200 520 400 545 T${BX + BW} 540 V${H} H${BX}z" fill="#d9c08f"/>` +
    [[90, 560], [160, 570], [690, 560], [740, 570]].map(([x, y]) => `<path d="M${x} ${y} q-14 -40 0 -70 q14 -30 0 -60" fill="none" stroke="#3f9a6a" stroke-width="8" stroke-linecap="round"/>`).join('') +
    at(420, 560, 1, false, nian({ mood: 'normal' })) +
    [[540, 360, 10], [560, 320, 7], [550, 290, 5], [270, 400, 8], [250, 360, 5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#bfe4ff" stroke-width="3"/>`).join('') +
    at(180, 380, 0.8, false, `<ellipse rx="24" ry="14" fill="#f2a14a" ${L}/><path d="M-22 0 l-16 -12 v24z" fill="#f2a14a" ${L}/><circle cx="10" cy="-3" r="3" fill="${INK}"/>`) +
    at(680, 420, 0.7, true, `<ellipse rx="24" ry="14" fill="#ffd25e" ${L}/><path d="M-22 0 l-16 -12 v24z" fill="#ffd25e" ${L}/><circle cx="10" cy="-3" r="3" fill="${INK}"/>`)),

  // 2. 冬天最後一晚，年獸爬上岸跑到村子
  '02': svg(night() + moon(120, 90, 34) + nightGround(400, '#5a6a8a') +
    `<rect x="${BX}" y="400" width="${200 - BX}" height="${H - 400}" fill="#2f5f98"/>` +
    cnHouse(560, 420, 0.65) +
    at(220, 580, 1, false, nian({ mood: 'angry' })) +
    chicken(520, 560, 1.1) + chicken(620, 540, 0.9) + sweat(560, 480) + sweat(650, 470) +
    at(720, 580, 0.9, false, villager(0, { mood: 'scared', pose: 'up' }))),

  // 3. 村民帶著小孩逃到深山
  '03': svg(sky('#ffb38a', '#ffe0c0') + sun(140, 140, 40) + karst(620, 440, 300, 260, '#8a9ab8') + karst(760, 440, 220, 200, '#7a8aaa') + hills(440, '#b9c98a', '#9fb46c') +
    at(250, 570, 1, false, villager(0, { pose: 'hold', item: bundle(14, -52) })) +
    at(360, 570, 0.85, false, kid(0, { mood: 'scared' })) +
    at(470, 570, 1, false, villager(1, { pose: 'point' })) +
    at(130, 570, 0.85, false, kid(1, { mood: 'cry' })) +
    at(580, 570, 0.95, false, villager(2, { pose: 'hold', item: bundle(14, -52, '#d97a9a') }))),

  // 4. 白鬍子老爺爺：讓我留下來
  '04': svg(sky() + cloud(180, 100) + cloud(600, 80, 0.8) + hills(400) + village() +
    `<rect x="${BX}" y="460" width="${BW}" height="${H - 460}" fill="#e6d6b2"/>` +
    at(300, 570, 1.15, false, elder({ mood: 'happy', item: caneItem })) +
    at(500, 570, 1, true, villager(1, { mood: 'scared', pose: 'hold', item: bundle(14, -52) })) +
    at(600, 570, 0.85, true, kid(1, { mood: 'scared' })) + sparkle(360, 330, 0.7)),

  // 5. 貼紅紙、掛紅燈籠、穿紅衣服
  '05': svg(sky('#ffd9c9', '#fff2e6') + cloud(600, 90) + hills(400, '#a9d98f', '#8dc775') +
    `<rect x="${BX}" y="460" width="${BW}" height="${H - 460}" fill="#e6d6b2"/>` +
    festiveHouse(400, 470, 1.2) +
    at(620, 580, 1.1, true, elderRed({ pose: 'reach', item: `<rect x="56" y="-80" width="24" height="64" fill="#e2483d" ${line(2.5)}/>` })) +
    lantern(150, 260, 0.9) + sparkle(250, 230, 0.7) + sparkle(560, 250, 0.6)),

  // 6. 半夜年獸來了，看到一片紅通通，停下腳步
  '06': svg(night() + moon(660, 90, 34) + nightGround(440) +
    festiveHouse(220, 470, 1.1, { lit: true }) +
    at(560, 580, 1.05, true, nian({ mood: 'scared' })) +
    `<path d="M640 560 q20 -4 40 0 M660 576 q20 -4 40 0" ${line(3)}/>` + sweat(520, 360) + sweat(600, 350)),

  // 7. 劈哩啪啦！點燃竹子，年獸嚇得發抖
  '07': svg(night('#2a2050', '#5a3a6a') + moon(120, 80, 30) + nightGround(440, '#5a4a6a') +
    at(330, 520, 1, false,
      `<path d="M-50 0 q50 -24 100 0" fill="#e2483d"/><path d="M-36 -2 q14 -50 30 -10 q10 -40 26 -4 q14 -30 20 6z" fill="#ffb347" ${line(2)}/>` +
      [-30, -6, 18].map((dx, i) => `<rect x="${dx}" y="-70" width="14" height="70" fill="#7fb85a" ${line(2)} transform="rotate(${(i - 1) * 16} ${dx + 7} 0)"/>`).join('')) +
    bang(300, 380, 0.9) + bang(380, 330, 0.7, '#ff8a6a') + bang(260, 300, 0.6, '#fff3c0', '#ffd25e') + bang(420, 420, 0.5) +
    at(150, 580, 1, false, elderRed({ mood: 'happy', pose: 'point' })) +
    at(620, 580, 1, true, nian({ mood: 'scared' })) + shake(500, 380) + shake(745, 360) + shake(520, 460, 30) +
    `<text x="360" y="260" font-size="44" font-weight="700" fill="#ffd25e" text-anchor="middle" stroke="${INK}" stroke-width="2" paint-order="stroke">劈哩啪啦！</text>`),

  // 8. 燈火通明，年獸轉身逃回海裡
  '08': svg(night('#2a2050', '#5a3a6a') + moon(700, 80, 30) + nightGround(440, '#5a4a6a') +
    `<rect x="${BX}" y="440" width="${120 - BX}" height="${H - 440}" fill="#2f5f98"/>` +
    `<defs><radialGradient id="glow"><stop offset="0" stop-color="#ffd25e" stop-opacity=".55"/><stop offset="1" stop-color="#ffd25e" stop-opacity="0"/></radialGradient></defs>` +
    `<ellipse cx="590" cy="400" rx="300" ry="220" fill="url(#glow)"/>` +
    festiveHouse(590, 470, 1.05, { lit: true }) +
    at(280, 580, 0.95, true, nian({ mood: 'scared', run: true })) +
    [[400, 560], [430, 540], [460, 565]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="#c8c0d0" opacity=".8"/>`).join('') +
    `<path d="M380 470 h50 M390 500 h60 M380 440 h40" ${line(3)}/>` + sweat(200, 360)),

  // 9. 天亮了，大家平安，恭喜恭喜
  '09': svg(sky('#ffcf9a', '#fff2e0') + sun(400, 150, 54) + hills(400, '#a9d98f', '#8dc775') +
    `<rect x="${BX}" y="460" width="${BW}" height="${H - 460}" fill="#e6d6b2"/>` +
    festiveHouse(400, 470, 0.85) +
    at(150, 580, 1, false, villager(0, { pose: 'hold' })) + at(250, 580, 0.8, false, kid(0, { pose: 'up' })) +
    at(560, 580, 1.05, true, elderRed({ mood: 'happy', item: caneItem })) +
    at(660, 580, 1, true, villager(1, { pose: 'hold' })) + at(750, 580, 0.8, true, kid(1, { pose: 'up' })) +
    hearts(300, 360) + sparkle(560, 330, 0.7)),

  // 10. 過年：貼春聯、放鞭炮、點燈守歲
  '10': svg(night('#2a2050', '#6a3a6a') + firework(150, 110) + firework(620, 90, 0.9, '#ff8aa0') + firework(400, 200, 0.7, '#9ad0ff') +
    nightGround(440, '#6a4a5a') + festiveHouse(400, 470, 0.95, { lit: true }) +
    firecrackers(140, 300, 7) + bang(140, 450, 0.6) +
    at(250, 580, 0.95, false, kid(0, { pose: 'raise', item: lantern(40, -150, 0.55) })) +
    at(560, 580, 0.95, true, kid(1, { pose: 'up' })) +
    at(680, 580, 1, true, villager(1, { pose: 'up' })) +
    at(80, 580, 0.95, false, villager(0, { pose: 'up' })) + sparkle(470, 300, 0.7) + sparkle(320, 320, 0.6)),
};

writeBook('nian-beast', pages);
