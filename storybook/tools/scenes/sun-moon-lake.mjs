// 日月潭的傳說（邵族故事）的插畫。用法：node tools/scenes/sun-moon-lake.mjs --sheet
import * as S from './lib.mjs';
import * as T from './tw-common.mjs';

const { BX, BW, BY, H, INK, line, L, at, svg, sky, sun, cloud, sparkle, person, hearts, sweat, moon, stars, hand, bird } = S;
const { paddy, greenMountains, dragon, word, bang, qmark, bush, flowerBed } = T;

// ---------- 服裝：紅、黑、白的色塊（用漸層做硬邊的橫條） ----------
const defs = `<defs>` +
  `<linearGradient id="thaoM" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4efe4"/><stop offset=".5" stop-color="#f4efe4"/><stop offset=".5" stop-color="#d23a2e"/><stop offset=".72" stop-color="#d23a2e"/><stop offset=".72" stop-color="#2f2a2a"/><stop offset="1" stop-color="#2f2a2a"/></linearGradient>` +
  `<linearGradient id="thaoF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d23a2e"/><stop offset=".38" stop-color="#d23a2e"/><stop offset=".38" stop-color="#f4efe4"/><stop offset=".5" stop-color="#f4efe4"/><stop offset=".5" stop-color="#2f2a2a"/><stop offset="1" stop-color="#2f2a2a"/></linearGradient>` +
  `</defs>`;
const bandM = `<path d="M-32 -16 Q0 -32 32 -16 L31 -6 Q0 -21 -31 -6z" fill="#d23a2e" ${line(2.5)}/><path d="M-24 -14 l6 -5 l6 5 l6 -5 l6 5 l6 -5 l6 5 l6 -5 l6 5" fill="none" stroke="#fff" stroke-width="2"/>`;
const bandF = `<path d="M-32 -16 Q0 -32 32 -16 L31 -6 Q0 -21 -31 -6z" fill="#d23a2e" ${line(2.5)}/>` +
  [-20, -10, 0, 10, 20].map((x) => `<circle cx="${x}" cy="${-14 - (x === 0 ? 7 : Math.abs(x) < 15 ? 6 : 3)}" r="3" fill="#fff"/>`).join('') +
  `<circle cx="28" cy="-22" r="8" fill="#d23a2e" ${line(2)}/><circle cx="28" cy="-22" r="3" fill="#ffd25e"/>`;
const dajian = (o = {}) => person({ hair: 'short', hairColor: '#2f2a2a', hat: bandM, outfit: 'tunic', top: 'url(#thaoM)', bottom: '#2f2a2a', ...o });
const shuishe = (o = {}) => person({ hair: 'long', hairColor: '#2f2a2a', hat: bandF, outfit: 'dress', top: 'url(#thaoF)', ...o });
const elder = (o = {}) => person({ hair: 'bald', hairColor: '#eee', beard: '#f4f4f4', hat: bandM, outfit: 'tunic', top: 'url(#thaoM)', bottom: '#2f2a2a', ...o });
const villagerM = (o = {}) => person({ hair: 'short', hat: bandM, outfit: 'shirt', top: 'url(#thaoM)', bottom: '#2f2a2a', ...o });
const villagerF = (o = {}) => person({ hair: 'bun', hat: bandF, outfit: 'dress', top: 'url(#thaoF)', ...o });
const kid = (o = {}) => person({ age: 'child', hair: 'short', outfit: 'shirt', top: 'url(#thaoM)', bottom: '#2f2a2a', ...o });

// ---------- 道具 ----------
const [rx, ry] = hand('raise');
// 金斧頭、金剪刀：以握把底端為原點、往上
const axeIcon = `<path d="M0 10 L6 -70" ${line(8)}/><path d="M0 10 L6 -70" stroke="#a8764a" stroke-width="4"/>` +
  `<path d="M4 -72 Q44 -84 40 -40 Q24 -54 6 -50z" fill="#f6d36b" ${L}/>`;
const scissorsIcon = `<path d="M0 0 L-6 -66 L4 -66z M0 0 L16 -62 L22 -58z" fill="#f6d36b" ${line(2.5)}/>` +
  `<circle cx="-6" cy="12" r="9" fill="none" stroke="${INK}" stroke-width="6"/><circle cx="-6" cy="12" r="9" fill="none" stroke="#f6d36b" stroke-width="3"/>` +
  `<circle cx="10" cy="12" r="9" fill="none" stroke="${INK}" stroke-width="6"/><circle cx="10" cy="12" r="9" fill="none" stroke="#f6d36b" stroke-width="3"/>`;
const goldAxe = at(rx, ry, 1, false, axeIcon);
const goldScissors = at(rx, ry, 1, false, scissorsIcon);
const torch = `<path d="M${rx} ${ry + 10} L${rx + 4} ${ry - 40}" ${line(8)}/><path d="M${rx} ${ry + 10} L${rx + 4} ${ry - 40}" stroke="#a8764a" stroke-width="4"/>` +
  `<path d="M${rx - 12} ${ry - 40} q-4 -30 16 -46 q0 20 10 22 q8 14 -10 24z" fill="#ff8a3a" ${line(2)}/><path d="M${rx - 4} ${ry - 42} q0 -16 8 -24 q4 14 4 24z" fill="#ffd25e"/>`;
const shovel = `<path d="M${rx} ${ry} L${rx + 30} ${ry + 110}" ${line(8)}/><path d="M${rx} ${ry} L${rx + 30} ${ry + 110}" stroke="#a8764a" stroke-width="4"/><path d="M${rx + 18} ${ry + 104} l28 -6 l8 34 q-16 12 -28 4z" fill="#9aa4ae" ${L}/>`;

// 獨木舟、茅草屋、湖
const canoe = (x, y, s = 1) => at(x, y, s, false, `<path d="M-110 -20 H110 Q100 14 60 14 H-70 Q-104 14 -110 -20z" fill="#8c5a3a" ${L}/><path d="M-90 -10 H90" stroke="#d23a2e" stroke-width="5"/>`);
const hut = (x, y, s = 1) => at(x, y, s, false,
  `<rect x="-80" y="-80" width="160" height="80" fill="#c9a06a" ${L}/>` + [-50, -20, 10, 40].map((d) => `<path d="M${d} -80 V0" stroke="#a67f3f" stroke-width="3"/>`).join('') +
  `<rect x="-20" y="-56" width="40" height="56" fill="#5a3a28" ${L}/>` +
  `<path d="M-110 -70 Q-60 -170 0 -176 Q60 -170 110 -70z" fill="#d9b25a" ${L}/>` +
  [-70, -35, 0, 35, 70].map((d) => `<path d="M${d} -76 L${d * 0.4} -160" stroke="#b58f3f" stroke-width="3"/>`).join(''));
const lake = (y, c = '#5fb4e0', wave = '#d6efff') => `<rect x="${BX}" y="${y}" width="${BW}" height="${H - y}" fill="${c}"/>` +
  Array.from({ length: 14 }, (_, i) => { const x = (i * 157) % 1300 - 250, yy = y + 20 + ((i * 53) % (H - y - 30)); return `<path d="M${x} ${yy} q14 -10 28 0 q14 10 28 0" fill="none" stroke="${wave}" stroke-width="4" stroke-linecap="round" opacity=".8"/>`; }).join('');
const shore = (y, c = '#9ed27a') => `<path d="M${BX} ${y} Q200 ${y - 16} 400 ${y} T${BX + BW} ${y} V${H} H${BX}z" fill="${c}"/>`;
const darkSky = () => sky('#121733', '#2e3458');
const note = (x, y, s = 1, c = '#d23a2e') => at(x, y, s, false, `<path d="M0 0 V-36 l18 6 V-24 l-18 -6" fill="none" ${line(3)}/><ellipse cx="-6" cy="0" rx="8" ry="6" fill="${c}" ${line(2)}/>`);
const palm = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${INK}" stroke-width="20" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="#a8764a" stroke-width="13" stroke-linecap="round"/>` +
  [0.2, 0.4, 0.6, 0.8].map((t) => `<path d="M${x1 + (x2 - x1) * t - 6} ${y1 + (y2 - y1) * t} h12" stroke="#7a5638" stroke-width="3"/>`).join('');
const sunGlow = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r + 20}" fill="#ffe9a6" opacity=".5"/><circle cx="${x}" cy="${y}" r="${r}" fill="#ffd25e" ${line(3)}/>`;
const moonGlow = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r + 18}" fill="#fff6c8" opacity=".35"/><circle cx="${x}" cy="${y}" r="${r}" fill="#fff1b8" ${line(3)}/><circle cx="${x - r * 0.3}" cy="${y - r * 0.2}" r="${r * 0.18}" fill="#f2e2a0"/><circle cx="${x + r * 0.25}" cy="${y + r * 0.3}" r="${r * 0.12}" fill="#f2e2a0"/>`;
// 有表情的山（大尖哥和水社姐變成的）
const faceMountain = (x, y, w, h, c, band) => at(x, y, 1, false,
  `<path d="M${-w / 2} 0 Q${-w * 0.2} ${-h * 0.9} 0 ${-h} Q${w * 0.2} ${-h * 0.9} ${w / 2} 0z" fill="${c}" ${L}/>` + band +
  at(0, -h * 0.45, 1.3, false, [-1, 1].map((d) => `<path d="M${d * 14 - 7} 0 q7 -8 14 0" fill="none" ${line(3)}/>`).join('') +
    `<path d="M-8 12 q8 8 16 0" fill="none" ${line(2.5)}/><ellipse cx="-24" cy="8" rx="7" ry="4" fill="#f5a3a3" opacity=".8"/><ellipse cx="24" cy="8" rx="7" ry="4" fill="#f5a3a3" opacity=".8"/>`));

const daySky = () => sky('#9fd4f5', '#e8f6ff') + cloud(160, 100) + cloud(560, 80, 0.7);

// ---------- 每一頁 ----------
const pages = {
  // 封面：大尖哥和水社姐拿著金斧頭、金剪刀，湖上有太陽和月亮
  cover: svg(defs + sky('#ffd2b0', '#e9f4ff') + sun(170, 120, 44) + moon(640, 120, 36) + greenMountains(370, '#7fb08a', '#6aa07a') +
    lake(370) + shore(470) + flowerBed(-40, 860, 590, 70) +
    at(300, 575, 1.25, false, dajian({ pose: 'raise', item: goldAxe })) + at(500, 575, 1.25, true, shuishe({ pose: 'raise', item: goldScissors })) +
    sparkle(400, 290) + sparkle(230, 300, 0.7) + sparkle(600, 300, 0.7)),

  // 1. 山裡的大湖，邵族人捕魚和種田
  '01': svg(defs + daySky() + sun(690, 90) + greenMountains(330) + lake(330) + shore(470) +
    canoe(420, 400, 0.9) + at(390, 390, 0.7, false, villagerM({ pose: 'reach', item: `<path d="M74 -76 L110 30" ${line(5)}/>` })) +
    hut(130, 520, 0.8) + at(640, 575, 1, true, villagerF({ pose: 'hold' })) + at(560, 575, 0.85, false, kid({ pose: 'up' }))),

  // 2. 白天有太陽，晚上有月亮
  '02': svg(defs + `<rect x="${BX}" y="${BY}" width="${1400}" height="${H - BY}" fill="#9fd4f5"/>` +
    `<rect x="400" y="${BY}" width="${BX + BW - 400}" height="${H - BY}" fill="#2a3570"/>` +
    `<g opacity=".9">${stars(30)}</g><rect x="${BX}" y="${BY}" width="${1400}" height="${H - BY}" fill="#9fd4f5"/>` +
    sun(200, 120, 46) + cloud(320, 80, 0.6) + moon(600, 120, 40) +
    greenMountains(340) + lake(340) + shore(470) +
    at(280, 575, 1.1, false, villagerM({ pose: 'up' })) + at(400, 575, 1, false, kid({ pose: 'up' })) + at(520, 575, 1.1, true, villagerF({ pose: 'up' }))),

  // 3. 湖裡跑出兩條惡龍，吞下太陽和月亮
  '03': svg(defs + sky('#7a7aa8', '#c8c0d8') + greenMountains(360, '#6a8a7a', '#5a7a6a') + lake(360, '#4a8ab8', '#a8d0f0') +
    at(180, 560, 1, false, dragon({ c: '#7ac06a', swallow: 'sun', mood: 'happy' })) + sunGlow(330, 386, 30) +
    at(620, 560, 1, true, dragon({ c: '#7aa8e0', swallow: 'moon', mood: 'happy' })) + moonGlow(470, 386, 28) +
    word(400, 290, '啊嗚！', 40, '#fff6c8', INK)),

  // 4. 天空一片漆黑，大家都好害怕
  '04': svg(defs + darkSky() + greenMountains(340, '#2f3f4a', '#28363f') + paddy(340, { gold: true, h: 130 }) +
    `<rect x="${BX}" y="338" width="${BW}" height="135" fill="#141a3a" opacity=".55"/>` +
    `<rect x="${BX}" y="470" width="${BW}" height="${H - 470}" fill="#3a4a3a"/>` +
    at(260, 575, 1.1, false, villagerF({ mood: 'cry', pose: 'hold' })) + at(370, 580, 0.95, false, kid({ mood: 'cry', pose: 'up' })) +
    at(520, 575, 1.1, true, villagerM({ mood: 'scared', pose: 'up' })) + sweat(560, 390) + qmark(400, 300, 1, '#9ad0ff')),

  // 5. 大尖哥和水社姐：我們去把太陽和月亮救回來！
  '05': svg(defs + darkSky() + greenMountains(360, '#2f3f4a', '#28363f') + lake(360, '#24304f', '#3a4a6a') + shore(480, '#3a4a3a') +
    at(300, 575, 1.25, false, dajian({ pose: 'raise', mood: 'angry', item: torch })) +
    at(500, 575, 1.25, true, shuishe({ pose: 'hips', mood: 'happy' })) +
    `<circle cx="${300 + rx * 1.25}" cy="${575 + (ry - 60) * 1.25}" r="70" fill="#ffd25e" opacity=".18"/>`),

  // 6. 老人說：阿里山底下埋著金斧頭和金剪刀
  '06': svg(defs + darkSky() + `<path d="M${BX} 400 L380 400 L560 220 L740 400 L${BX + BW} 400 V${H} H${BX}z" fill="#3a5a4a" ${L}/>` +
    sparkle(560, 380, 1.3) + sparkle(600, 360, 0.7) +
    `<rect x="${BX}" y="430" width="${BW}" height="${H - 430}" fill="#3a4a3a"/>` +
    at(380, 575, 1.1, false, elder({ pose: 'point' })) +
    at(180, 575, 1.1, false, dajian({ pose: 'raise', item: torch, mood: 'normal' })) + at(80, 575, 1.05, false, shuishe({ mood: 'normal' }))),

  // 7. 翻過好多座山，挖到了金斧頭和金剪刀
  '07': svg(defs + sky('#3a3a6a', '#6a6a9a') + greenMountains(330, '#4a6a5a', '#3f5f50') +
    `<rect x="${BX}" y="380" width="${BW}" height="${H - 380}" fill="#8a7050"/>` +
    `<ellipse cx="420" cy="520" rx="120" ry="36" fill="#4a3426"/><ellipse cx="420" cy="514" rx="100" ry="24" fill="#ffd25e" opacity=".5"/>` +
    at(380, 500, 1, false, `<g transform="rotate(-60)">${axeIcon}</g>`) + at(460, 508, 1, false, `<g transform="rotate(50)">${scissorsIcon}</g>`) +
    sparkle(360, 440) + sparkle(500, 450, 0.8) + sparkle(430, 400, 0.6) +
    at(200, 575, 1.15, false, dajian({ pose: 'raise', item: shovel, mood: 'happy' })) + sweat(160, 380) +
    at(640, 575, 1.15, true, shuishe({ pose: 'up', mood: 'happy' }))),

  // 8. 和惡龍大戰三天三夜，打敗了兩條惡龍
  '08': svg(defs + sky('#4a4a7a', '#8a8ab0') + greenMountains(360, '#4a6a5a', '#3f5f50') + lake(360, '#3a6a98', '#8ab8e0') + shore(500, '#4a6a4a') +
    at(470, 520, 0.9, true, dragon({ c: '#7ac06a', dizzy: true })) + at(720, 500, 0.75, true, dragon({ c: '#7aa8e0', dizzy: true })) +
    sparkle(560, 300, 0.8, '#fff') + sparkle(680, 330, 0.7, '#fff') +
    at(140, 585, 1.1, false, dajian({ pose: 'raise', item: goldAxe, mood: 'angry' })) +
    at(250, 590, 1.05, false, shuishe({ pose: 'raise', item: goldScissors, mood: 'angry' })) +
    word(420, 290, '碰！', 48, '#ffd25e', INK)),

  // 9. 拔起棕櫚樹，把太陽和月亮推回天上
  '09': svg(defs + sky('#2e3458', '#6a7aa8') + greenMountains(380, '#4a6a5a', '#3f5f50') + lake(380, '#3a6a98', '#8ab8e0') + shore(520, '#4a6a4a') +
    sunGlow(260, 330, 56) + moonGlow(540, 320, 50) +
    palm(205, 520, 238, 382) + palm(595, 520, 560, 366) +
    at(150, 580, 1.15, false, dajian({ pose: 'reach', mood: 'angry' })) + at(650, 580, 1.15, true, shuishe({ pose: 'reach', mood: 'angry' })) +
    sparkle(400, 260) + sweat(100, 380) + sweat(700, 380)),

  // 10. 天空又亮了，稻子長大，大家唱歌跳舞
  '10': svg(defs + daySky() + sun(400, 120, 56) + greenMountains(330) + lake(330) + paddy(410, { gold: true, h: 60 }) +
    `<rect x="${BX}" y="470" width="${BW}" height="${H - 470}" fill="#9ed27a"/>` +
    at(120, 580, 1, false, villagerF({ pose: 'up' })) + at(240, 580, 1.05, false, dajian({ pose: 'up' })) + at(360, 585, 0.9, false, kid({ pose: 'up' })) +
    at(470, 580, 1.05, true, shuishe({ pose: 'up' })) + at(590, 580, 1, true, villagerM({ pose: 'up' })) + at(700, 580, 0.95, true, elder({ pose: 'up' })) +
    note(300, 300) + note(520, 280, 0.9, '#2f2a2a') + note(660, 320, 0.8) + sparkle(180, 300, 0.8)),

  // 11. 守在湖邊，變成了兩座大山
  '11': svg(defs + daySky() + sun(690, 90) +
    faceMountain(250, 440, 360, 220, '#7fb08a', `<path d="M-120 -80 Q0 -110 120 -80" fill="none" stroke="#d23a2e" stroke-width="10"/>`) +
    faceMountain(560, 440, 340, 200, '#8fc09a', `<circle cx="100" cy="-120" r="16" fill="#d23a2e" ${line(2.5)}/><circle cx="100" cy="-120" r="6" fill="#ffd25e"/>`) +
    lake(440) + bird(420, 260, 0.9, '#fff') + canoe(420, 520, 0.6)),

  // 12. 一邊圓圓像太陽，一邊彎彎像月亮：日月潭
  '12': svg(defs + sky('#ffd9b8', '#eaf4ff') + sun(150, 110, 44) + moon(650, 120, 44, true) + greenMountains(330, '#8fbf9a', '#77ad86') +
    `<rect x="${BX}" y="330" width="${BW}" height="${H - 330}" fill="#8cc475"/>` +
    `<ellipse cx="290" cy="450" rx="190" ry="100" fill="#5fb4e0" ${L}/>` +
    `<path d="M440 380 Q700 360 720 470 Q700 560 470 530 Q620 500 610 455 Q600 400 440 380z" fill="#5fb4e0" ${L}/>` +
    `<circle cx="290" cy="450" r="36" fill="#ffe27a" opacity=".9"/>` + `<path d="M640 430 q20 30 -10 60 q30 -30 10 -60z" fill="#fff1b8" opacity=".9"/>` +
    sparkle(400, 280, 0.8) + canoe(330, 500, 0.4) + bird(460, 270, 0.8, '#fff')),
};

S.writeBook('sun-moon-lake', pages);
