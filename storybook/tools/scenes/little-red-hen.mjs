// 小紅母雞的插畫。用法：node tools/scenes/little-red-hen.mjs --sheet
import * as S from './lib.mjs';
import { hen, cat, puppy, duck, chick, wheat, wheatBundle, bread, flourSack, say, steam, glow } from './uk-common.mjs';

const { BX, BW, BY, H, INK, line, L, at, svg, face, sky, sun, cloud, hills, path, tree, grass, sparkle, sweat, hearts, cottage, room, fence, bird, writeBook } = S;

// ---------- 道具 ----------
const barn = (x, y, s = 1) => at(x, y, s, false,
  `<rect x="-120" y="-150" width="240" height="150" fill="#c8553d" ${L}/>` +
  `<path d="M-140 -140 L-90 -220 H90 L140 -140z" fill="#8a3a2a" ${L}/><path d="M-140 -140 H140" ${line(3)}/>` +
  `<rect x="-50" y="-110" width="100" height="110" fill="#fff" ${L}/><path d="M-50 -110 L50 0 M50 -110 L-50 0" stroke="#fff" stroke-width="0"/>` +
  `<rect x="-42" y="-102" width="84" height="94" fill="#c8553d" ${line(2)}/><path d="M-42 -102 L42 -8 M42 -102 L-42 -8" stroke="#fff" stroke-width="8"/>` +
  `<rect x="-20" y="-200" width="40" height="34" fill="#fff" ${L}/><rect x="-14" y="-194" width="28" height="22" fill="#3a2a22"/>`);
const windmill = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-60 0 L-36 -220 H36 L60 0z" fill="#f3e3c3" ${L}/>` +
  `<path d="M-44 -220 L0 -270 L44 -220z" fill="#a0522d" ${L}/>` +
  `<path d="M-18 0 V-50 Q0 -70 18 -50 V0z" fill="#8c5a3a" ${L}/><rect x="-14" y="-160" width="28" height="28" fill="#bfe4ff" ${L}/>` +
  at(0, -220, 1, false, [20, 110, 200, 290].map((a) => `<g transform="rotate(${a})"><rect x="6" y="-12" width="120" height="24" fill="#fff8e6" ${L}/><path d="M36 -12 v24 M66 -12 v24 M96 -12 v24" ${line(2)}/></g>`).join('') +
    `<circle r="10" fill="#8c5a3a" ${L}/>`));
const sprouts = (x, y, n = 6, gap = 60, big = false) => Array.from({ length: n }, (_, i) =>
  big ? wheat(x + i * gap, y, 0.6, false)
    : at(x + i * gap, y, 1, false, `<ellipse cx="0" cy="2" rx="18" ry="5" fill="#8a6a4a"/><path d="M0 0 V-24" stroke="#4f9a5f" stroke-width="4" stroke-linecap="round"/><path d="M0 -16 q-16 -10 -18 -22 q14 0 18 14z M0 -20 q14 -12 20 -20 q2 14 -20 22z" fill="#6cbd62" ${line(2)}/>`)).join('');
const wateringCan = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-24 0 V-40 H24 V0z" fill="#5b8fd0" ${L}/><path d="M24 -14 L60 -44 L64 -38 L28 -6z" fill="#5b8fd0" ${L}/>` +
  `<path d="M-24 -30 q-20 6 -10 28" fill="none" ${line(5)}/>` +
  [0, 1, 2].map((i) => `<path d="M${70 + i * 6} ${-30 + i * 6} l${10 + i * 2} 24" stroke="#7cc4f2" stroke-width="4" stroke-linecap="round"/>`).join(''));
const sickle = (x, y) => `<path d="M${x} ${y + 20} V${y - 14}" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M${x} ${y + 20} V${y - 14}" stroke="#b5884a" stroke-width="5" stroke-linecap="round"/>` +
  `<path d="M${x} ${y - 14} Q${x + 46} ${y - 30} ${x + 40} ${y - 70} Q${x + 28} ${y - 36} ${x} ${y - 24}z" fill="#c8d0da" ${L}/>`;
const oven = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-110 0 V-150 Q0 -230 110 -150 V0z" fill="#d9654b" ${L}/>` +
  [-1, 0, 1].map((r) => `<path d="M-110 ${-40 - r * 40 - 40} H110" stroke="#b5452f" stroke-width="2.5"/>`).join('') +
  `<path d="M-60 0 V-70 Q0 -120 60 -70 V0z" fill="#3a2a22" ${L}/>` +
  `<path d="M-40 0 q-6 -30 14 -40 q0 20 14 24 q6 -30 20 -34 q8 24 20 30 q6 -10 6 -20 q20 26 6 40z" fill="#ff9a3c"/>` +
  `<path d="M-14 0 q0 -18 12 -24 q4 12 10 16 q6 -12 12 -14 q6 18 -4 22z" fill="#ffd25e"/>` +
  `<rect x="-20" y="-250" width="40" height="70" fill="#b5452f" ${L}/>`);
const pond = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="120" ry="34" fill="#7cc4f2" ${L}/><path d="M${x - 60} ${y} q20 -10 40 0 M${x + 10} ${y + 10} q20 -10 40 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`;
const grains = (x, y) => [[-8, 0], [6, -4], [0, 8], [12, 6]].map(([dx, dy]) => `<ellipse cx="${x + dx}" cy="${y + dy}" rx="5" ry="7" fill="#f2c14e" ${line(1.5)} transform="rotate(30 ${x + dx} ${y + dy})"/>`).join('');
const smell = (x, y) => [0, 1, 2].map((i) => `<path d="M${x + i * 26} ${y} q-14 -24 0 -46 q14 -22 0 -46" fill="none" stroke="#e8b86a" stroke-width="5" stroke-linecap="round" opacity=".8"/>`).join('');
const lie = (x, y, s, body) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(-90) translate(36 0)">${body}</g>`;
const zz = (x, y) => [0, 1].map((i) => `<text x="${x + i * 18}" y="${y - i * 20}" font-size="${22 + i * 6}" font-weight="900" fill="#5b8fd0" font-family="sans-serif">z</text>`).join('');
const notMe = (x, y) => say(x, y, '不是我！', 26, INK);
const thinkBubble = (x, y, body) => `<circle cx="${x - 130}" cy="${y + 96}" r="8" fill="#fff" ${L}/><circle cx="${x - 104}" cy="${y + 70}" r="13" fill="#fff" ${L}/>` +
  `<ellipse cx="${x}" cy="${y}" rx="130" ry="72" fill="#fff" ${L}/>` + body;
const table = (x, y, w) => `<rect x="${x - w / 2}" y="${y}" width="${w}" height="20" rx="4" fill="#b5884a" ${L}/>` +
  [x - w / 2 + 20, x + w / 2 - 40].map((lx) => `<rect x="${lx}" y="${y + 20}" width="20" height="${590 - y - 20}" fill="#9a6a3a" ${L}/>`).join('');

const farm = (c1 = '#a9d98f', c2 = '#8dc775') => sky() + sun(690, 90) + cloud(160, 100) + cloud(480, 70, 0.7) + hills(380, c1, c2);

const pages = {
  // 封面：小紅母雞捧著麵包，朋友們和小雞
  cover: svg(farm() + barn(620, 450, 0.85) + fence(BX + 900, 480, 360) +
    at(380, 570, 1.15, false, hen({ pose: 'hold', item: bread(14, -66, 0.55) })) + glow(395, 470, 4, 60) +
    at(170, 580, 0.95, false, cat({ pose: 'up' })) + at(560, 585, 0.95, true, puppy({ pose: 'up' })) + at(690, 590, 0.95, true, duck({ pose: 'up' })) +
    chick(270, 590, 0.9) + chick(470, 595, 0.8, true) + grass(80, 580)),

  // 1. 農場裡的小紅母雞和朋友們
  '01': svg(farm() + barn(180, 450, 0.9) + fence(330, 470, 440) +
    at(330, 575, 1.05, false, hen({ pose: 'down' })) + at(450, 580, 0.95, true, cat({ pose: 'raise' })) +
    at(560, 585, 0.95, true, puppy({ pose: 'hips' })) + at(670, 590, 0.95, true, duck({ pose: 'raise' })) +
    hearts(380, 380) + grass(760, 580)),

  // 2. 撿到幾顆麥子：誰要幫我種麥子？
  '02': svg(farm() + barn(640, 450, 0.85) + tree(110, 470, 1.1) +
    at(300, 580, 1.15, false, hen({ pose: 'reach' })) + grains(392, 466) + glow(392, 460, 4, 40) +
    at(560, 590, 0.9, true, cat({ mood: 'normal' })) + at(680, 595, 0.9, true, puppy({ mood: 'normal' })) +
    grass(200, 590)),

  // 3. 不是我！不是我！不是我！
  '03': svg(farm() + tree(560, 450, 1) + pond(680, 565) +
    at(130, 580, 1, false, hen({ mood: 'normal', pose: 'hips' })) +
    lie(380, 585, 0.9, cat({ mood: 'sleep', pose: 'hips' })) + notMe(300, 400) +
    lie(560, 585, 0.9, puppy({ mood: 'sleep', pose: 'hips' })) + notMe(490, 400) +
    at(690, 570, 0.95, true, duck({ mood: 'normal', pose: 'hips' })) + notMe(690, 360)),

  // 4. 那我自己種：每天澆水，麥子慢慢長高
  '04': svg(farm() + `<rect x="${BX}" y="500" width="${BW}" height="60" fill="#a8865a"/>` + sprouts(330, 540, 8, 60) +
    at(220, 580, 1.1, false, hen({ pose: 'reach', item: wateringCan(70, -40, 0.9) })) + sun(690, 90) + sparkle(640, 400, 0.6)),

  // 5. 麥子成熟了，小紅母雞自己割
  '05': svg(farm('#c9d98f', '#b5cf7a') + tree(700, 430, 1) +
    Array.from({ length: 14 }, (_, i) => wheat(300 + (i % 7) * 45 + (i > 6 ? 22 : 0), 520 + (i > 6 ? 50 : 0), 1)).join('') +
    lie(775, 590, 0.75, puppy({ mood: 'sleep' })) + zz(680, 470) +
    at(200, 585, 1.1, false, hen({ pose: 'raise', item: sickle(40, -144) })) + wheatBundle(110, 590, 0.9)),

  // 6. 自己把麥子拿去磨成麵粉
  '06': svg(farm() + path('#e9d3a3') + windmill(560, 440, 1) +
    at(300, 585, 1.1, false, hen({ pose: 'hold', item: wheatBundle(14, -30, 0.7) })) + flourSack(700, 560, 0.9) +
    at(110, 560, 0.75, false, cat({ mood: 'normal', pose: 'hips' })) + notMe(110, 380) + sweat(370, 400)),

  // 7. 自己揉麵、烤麵包
  '07': svg(room({ wall: '#f6e3c8', stripe: '#efd5b2', window: false }) + oven(600, 470, 1) +
    at(270, 545, 1.15, false, hen({ pose: 'hold' })) + table(280, 470, 320) +
    `<ellipse cx="290" cy="462" rx="60" ry="20" fill="#fff2d6" ${L}/>` + flourSack(170, 470, 0.6) + `<circle cx="250" cy="420" r="4" fill="#fff"/><circle cx="350" cy="430" r="3" fill="#fff"/>`),

  // 8. 麵包烤好了，整個農場都聞到香味
  '08': svg(farm() + cottage(250, 460, 1, { wall: '#f3e3c3', roof: '#c8553d' }) +
    `<rect x="190" y="370" width="40" height="40" fill="#fff" opacity="0"/>` +
    smell(330, 410) + `<path d="M380 350 Q480 330 560 360" fill="none" stroke="#e8b86a" stroke-width="5" stroke-dasharray="4 14" stroke-linecap="round"/>` +
    bread(182, 400, 0.32) +
    at(500, 585, 0.95, true, cat({ mood: 'happy', pose: 'down' })) + at(610, 590, 0.95, true, puppy({ mood: 'happy' })) + at(715, 595, 0.95, true, duck({ mood: 'happy' })) +
    hearts(560, 380) + sparkle(180, 260, 0.7)),

  // 9. 誰要幫我吃麵包？我要！我要！我要！
  '09': svg(farm() + barn(130, 440, 0.7) +
    at(270, 580, 1.15, false, hen({ mood: 'normal', pose: 'hold', item: bread(14, -66, 0.55) })) +
    at(480, 585, 0.95, true, cat({ mood: 'happy', pose: 'up' })) + at(600, 590, 0.95, true, puppy({ mood: 'happy', pose: 'up' })) + at(715, 595, 0.95, true, duck({ mood: 'happy', pose: 'up' })) +
    say(480, 360, '我要！', 28, '#e2483d') + say(600, 370, '我要！', 28, '#e2483d') + say(715, 380, '我要！', 28, '#e2483d') +
    `<path d="M780 530 h-30 M790 500 h-24" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`),

  // 10. 我要和小雞們一起吃
  '10': svg(room({ wall: '#f6e3c8', stripe: '#efd5b2' }) +
    `<ellipse cx="440" cy="530" rx="230" ry="50" fill="#e2483d" ${L}/><ellipse cx="440" cy="530" rx="190" ry="38" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="14 10"/>` +
    `<ellipse cx="440" cy="526" rx="90" ry="20" fill="#fff" ${L}/>` + bread(440, 528, 0.85) +
    at(180, 590, 1.15, false, hen({ mood: 'happy', pose: 'reach' })) +
    chick(330, 520, 0.9) + chick(560, 520, 0.9, true) + chick(360, 580, 1.05) + chick(480, 590, 1.05, true) + chick(620, 580, 1, true) +
    hearts(420, 400) + sparkle(300, 400, 0.6) + sparkle(600, 390, 0.7)),

  // 11. 朋友們明白了：一起幫忙，才能一起分享
  '11': svg(sky('#ffd9c9', '#fff2e6') + sun(110, 120, 46) + hills(400, '#a9d98f', '#8dc775') + fence(BX + 900, 480, 500) +
    at(270, 580, 1, false, cat({ mood: 'cry', pose: 'hold' })) + at(400, 585, 1, false, puppy({ mood: 'cry', pose: 'hold' })) + at(530, 590, 1, false, duck({ mood: 'cry', pose: 'hold' })) +
    thinkBubble(630, 290, wheatBundle(580, 330, 0.7) + bread(680, 320, 0.5) + hearts(620, 270))),
};

writeBook('little-red-hen', pages);
