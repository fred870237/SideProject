// 司馬光砸缸的插畫。用法：node tools/scenes/sima-guang.mjs --sheet

import * as S from './lib.mjs';
import { figure, twinBuns, guan, cnWall, paving, cnInterior, blossomTree, willow, bamboo, rock, table, thought, bang } from './cn-common.mjs';

const { BX, BW, H, INK, L, line, at, svg, face, sky, sun, cloud, sparkle, sweat, hearts, grass, writeBook } = S;

// ---------- 人物 ----------
const smg = (o = {}, arms) => figure({ age: 'child', hair: 'topknot', hairColor: '#2f2a2a', top: '#3f9aa0', bottom: '#2a6064', ...o }, arms);
// 掉進缸裡的小朋友
const buddy = (o = {}, arms) => figure({ age: 'child', hair: 'short', hairColor: '#3a2a22', top: '#f29b4b', bottom: '#b5651d', ...o }, arms);
const girl = (o = {}, arms) => figure({ age: 'child', hair: 'pigtails', hairColor: '#2f2a2a', top: '#d97a9a', bottom: '#a84a6a', ...o }, arms);
const boy = (o = {}, arms) => figure({ age: 'child', hair: 'short', hat: twinBuns(), top: '#6cae6a', bottom: '#3f6f4a', ...o }, arms);
const father = (o = {}, arms) => figure({ hair: 'topknot', hat: guan(), beard: '#3a2a22', top: '#4f6fa8', bottom: '#2f4a7a', ...o }, arms);
const mother = (o = {}, arms) => figure({ hair: 'bun', top: '#c98ab8', bottom: '#8a4a7a', ...o }, arms);

const coverEyes = [[-26, -72, -14, -112], [26, -72, 14, -112]];
const chinKid = [[-26, -72, -36, -29], [26, -72, 16, -88]];
const book = `<path d="M-10 -66 L14 -50 L38 -66 V-30 L14 -16 L-10 -30z" fill="#fff8e6" ${L}/><path d="M14 -50 V-16" ${line(2)}/>` +
  `<path d="M-4 -54 l12 8 M-4 -44 l12 8 M20 -46 l12 -8 M20 -36 l12 -8" stroke="#9a8a6a" stroke-width="2"/>`;
const bigStone = rock(0, -150, 1.7, '#9a9ca6');
const drops = (x, y) => sweat(x, y) + sweat(x + 26, y + 14);

// ---------- 大水缸 ----------
// 原點在缸底中心，大約 190 高。inside = 缸裡的東西（小朋友），hole = 破洞噴水，broken = 水流光、破一個大洞
const VAT = '#8a5a3a', VAT2 = '#a8744a', RIM = -176;
function vat({ inside = '', water = true, hole = false, broken = false, splash = false } = {}) {
  const body = `<path d="M-96 ${RIM} Q0 ${RIM + 16} 96 ${RIM} Q112 -80 78 0 H-78 Q-112 -80 -96 ${RIM}z" fill="${VAT}" ${L}/>` +
    `<path d="M-104 -120 Q0 -100 104 -120" fill="none" stroke="${VAT2}" stroke-width="10"/>` +
    `<path d="M-90 -40 Q0 -24 90 -40" fill="none" stroke="${VAT2}" stroke-width="8"/>` +
    `<path d="M-60 -150 q-12 50 -4 100" fill="none" stroke="#b88a5e" stroke-width="8" stroke-linecap="round" opacity=".6"/>`;
  const rimBack = `<ellipse cx="0" cy="${RIM}" rx="104" ry="18" fill="#6b4a2f" ${L}/>` +
    (water ? `<ellipse cx="0" cy="${RIM + 2}" rx="90" ry="11" fill="#5fb0e6"/>` : `<ellipse cx="0" cy="${RIM + 2}" rx="90" ry="11" fill="#3a2a22"/>`);
  const waterTop = water && inside ? `<ellipse cx="0" cy="${RIM + 2}" rx="90" ry="11" fill="#5fb0e6" opacity=".88"/>` +
    `<path d="M-50 ${RIM + 2} q12 -6 24 0 M26 ${RIM + 2} q12 -6 24 0" fill="none" stroke="#d6efff" stroke-width="3" stroke-linecap="round"/>` : '';
  const lip = `<path d="M-104 ${RIM} Q0 ${RIM + 36} 104 ${RIM}" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>` +
    `<path d="M-104 ${RIM} Q0 ${RIM + 36} 104 ${RIM}" fill="none" stroke="#6b4a2f" stroke-width="5" stroke-linecap="round"/>`;
  const holeSvg = hole ? `<path d="M-6 -86 l12 -8 l10 12 l14 -2 l-2 16 l10 10 l-14 8 l-4 14 l-14 -8 l-14 6 l-2 -14 l-12 -8 l12 -10z" fill="#3a2a22" ${line(2.5)}/>` : '';
  const brokenSvg = broken ? `<path d="M-50 0 L-56 -60 L-30 -50 L-20 -96 L4 -70 L24 -104 L36 -60 L58 -66 L52 0z" fill="#3a2a22" ${line(2.5)}/>` +
    `<path d="M-40 0 Q0 -14 40 0" fill="#5fb0e6" opacity=".7"/>` : '';
  const splashSvg = splash ? [[-90, -230, -20], [-50, -260, -10], [0, -280, 0], [50, -260, 10], [90, -230, 20]]
    .map(([x, y, r]) => `<path d="M${x} ${y} q-10 14 0 22 q10 -8 0 -22z" fill="#7cc4f2" ${line(2)} transform="rotate(${r} ${x} ${y})"/>`).join('') : '';
  return rimBack + inside + waterTop + body + lip + holeSvg + brokenSvg + splashSvg;
}
// 缸裡的小朋友：只露出頭和手（身體在缸裡，被缸擋住）
const inVat = (mood = 'scared', pose = 'up') => at(0, RIM + 74, 1, false, buddy({ mood, pose }));

// 水從破洞噴出來，流到地上（缸的座標）
const gush = `<path d="M10 -76 Q90 -110 150 -20 Q160 0 190 0 L120 0 Q100 -50 10 -60z" fill="#7cc4f2" ${L}/>` +
  `<path d="M40 -82 q40 -10 70 30 M50 -66 q40 -4 60 30" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`;
const puddle = (x, y, w = 260) => `<ellipse cx="${x}" cy="${y}" rx="${w / 2}" ry="${w / 10}" fill="#7cc4f2" opacity=".85"/>` +
  `<path d="M${x - w / 4} ${y} q14 -6 28 0 M${x + w / 8} ${y + 6} q14 -6 28 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`;

// ---------- 背景 ----------
const yard = () => sky() + cloud(160, 90) + cloud(620, 70, 0.8) + cnWall(400, 120) + paving(400, '#e1d3b5');

// ---------- 每一頁 ----------
const pages = {
  // 封面：司馬光舉起大石頭，缸裡的小朋友揮手
  cover: svg(yard() + willow(80, 400, 0.9) + bamboo(760, 400, 0.85) +
    at(520, 560, 1.05, false, vat({ inside: inVat('scared') })) +
    at(270, 575, 1.15, false, smg({ mood: 'angry', pose: 'up', item: bigStone })) +
    at(120, 580, 0.9, false, girl({ mood: 'scared' })) + sparkle(380, 300, 0.8) + sparkle(680, 300, 0.6)),

  // 1. 宋朝的司馬光，很愛讀書
  '01': svg(cnInterior() + table(560, 520, 1) +
    `<rect x="480" y="414" width="60" height="16" fill="#e2c27a" ${line(2.5)}/><rect x="486" y="400" width="56" height="14" fill="#9ad0ff" ${line(2.5)}/><rect x="482" y="388" width="52" height="12" fill="#f29b4b" ${line(2.5)}/>` +
    `<path d="M600 430 h60 v-14 h-60z" fill="#fff8e6" ${line(2.5)}/>` +
    at(350, 575, 1.25, false, smg({ mood: 'happy', pose: 'hold', item: book })) +
    sparkle(440, 340, 0.7) + sparkle(260, 360, 0.5)),

  // 2. 在院子裡玩捉迷藏
  '02': svg(yard() + blossomTree(150, 410, 1.05) +
    at(600, 500, 1, false, rock(0, 0, 2.6, '#a8aab2') + rock(70, 0, 1.6, '#9a9ca6')) +
    at(250, 575, 1.05, true, smg({ mood: 'happy' }, coverEyes)) +
    at(450, 575, 1, false, girl({ pose: 'up' })) +
    at(640, 470, 0.85, false, boy({ mood: 'happy' })) +
    at(720, 580, 1, true, buddy({ pose: 'reach' }))),

  // 3. 院子裡有一個比小朋友還高的大水缸
  '03': svg(yard() + willow(90, 400, 0.9) +
    at(450, 560, 1.2, false, vat()) +
    at(270, 575, 1, false, buddy({ pose: 'point' })) +
    at(640, 575, 1, true, girl({ mood: 'scared' })) + at(730, 575, 1, true, boy()) +
    sparkle(450, 320, 0.6)),

  // 4. 一個小朋友爬上水缸的邊邊
  '04': svg(yard() + bamboo(60, 400, 0.85) +
    at(430, 560, 1.15, false, vat()) +
    at(560, 560, 1, false, `<rect x="-40" y="-50" width="80" height="14" fill="#a0703f" ${L}/><path d="M-30 -36 V0 M30 -36 V0" ${line(6)}/>`) +
    at(470, 560 + RIM * 1.15 + 6, 0.95, false, buddy({ mood: 'happy', pose: 'up' })) +
    at(200, 575, 1, false, smg({ mood: 'scared', pose: 'point' })) +
    at(680, 575, 1, true, girl({ mood: 'scared', pose: 'up' }))),

  // 5. 撲通！掉進水缸裡
  '05': svg(yard() + bamboo(60, 400, 0.85) +
    at(420, 560, 1.15, false, vat({ inside: inVat('scared'), splash: true })) +
    at(600, 575, 1, true, girl({ mood: 'scared', pose: 'up' })) +
    at(700, 575, 1, true, boy({ mood: 'scared', pose: 'up' })) +
    `<text x="640" y="300" font-size="54" font-weight="700" fill="#2f6f9f" text-anchor="middle">撲通！</text>`),

  // 6. 有的哭了，有的跑去找大人
  '06': svg(yard() + willow(720, 400, 0.85) +
    at(330, 560, 1.1, false, vat({ inside: inVat('scared') })) +
    at(560, 575, 1, true, girl({ mood: 'cry' })) +
    at(120, 575, 1, true, boy({ mood: 'scared', pose: 'point' })) +
    `<path d="M170 520 h40 M180 545 h50 M170 495 h30" ${line(3)}/>` + sweat(90, 420)),

  // 7. 司馬光想：怎麼辦呢？
  '07': svg(yard() + bamboo(760, 400, 0.85) +
    at(560, 560, 1.1, false, vat({ inside: inVat('scared') })) +
    at(240, 575, 1.15, false, smg({ mood: 'normal' }, chinKid)) +
    thought(330, 300, 170, 100, rock(-30, 30, 1.3) + at(40, 36, 0.28, false, vat()), -60, 70) +
    rock(120, 580, 1.6)),

  // 8. 搬起大石頭，用力往水缸砸過去
  '08': svg(yard() + willow(80, 400, 0.85) +
    at(540, 560, 1.1, false, vat({ inside: inVat('scared') })) +
    at(300, 575, 1.2, false, smg({ mood: 'angry', pose: 'up', item: bigStone })) +
    `<path d="M380 360 q30 -10 50 10 M390 390 q30 -6 50 14" fill="none" ${line(4)}/>` + sweat(220, 400)),

  // 9. 砰！破了一個大洞，水嘩啦嘩啦流出來
  '09': svg(yard() + willow(720, 400, 0.85) +
    at(380, 560, 1.1, false, vat({ inside: inVat('happy'), hole: true }) + gush) + puddle(600, 570, 280) +
    bang(380, 470, 0.8, '#fff3c0', '#fff') +
    at(170, 575, 1.05, false, smg({ mood: 'happy', pose: 'raise' })) +
    rock(620, 560, 1.2) +
    `<text x="240" y="300" font-size="54" font-weight="700" fill="#c0563a" text-anchor="middle">砰！</text>` +
    `<text x="640" y="470" font-size="36" font-weight="700" fill="#2f6f9f" text-anchor="middle">嘩啦嘩啦</text>`),

  // 10. 水流光了，小朋友得救了
  '10': svg(yard() + blossomTree(720, 400, 0.9) +
    puddle(300, 575, 380) +
    at(240, 560, 1, false, vat({ water: false, broken: true })) +
    at(430, 580, 1.05, false, buddy({ mood: 'happy', pose: 'up' })) + drops(400, 400) + drops(470, 410) +
    at(540, 580, 1.05, true, smg({ mood: 'happy', pose: 'up' })) +
    at(650, 580, 1, true, girl({ pose: 'up' })) +
    hearts(480, 360) + sparkle(560, 330, 0.7)),

  // 11. 大人們誇獎司馬光
  '11': svg(yard() + willow(70, 400, 0.85) + bamboo(770, 400, 0.85) +
    at(250, 575, 1.1, false, father({ mood: 'happy' }, [[-26, -88, -36, -45], [26, -88, 84, -140]])) +
    at(360, 575, 1.05, false, smg({ mood: 'happy', pose: 'hips' })) +
    at(500, 575, 1, true, mother({ pose: 'up' })) +
    at(610, 575, 0.95, true, buddy({ pose: 'up' })) + at(700, 575, 0.95, true, girl({ pose: 'up' })) +
    sparkle(360, 330, 0.9) + hearts(430, 340)),
};

writeBook('sima-guang', pages);
