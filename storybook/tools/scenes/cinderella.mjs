// 灰姑娘的插畫。用法：node tools/scenes/cinderella.mjs --sheet
import { BX, BW, H, INK, line, L, at, svg, sky, sun, cloud, hills, ground, tree, sparkle, night, moon, castle, room,
  person, hand, hearts, sweat, cottage, writeBook } from './lib.mjs';
import { slipper, wand, pumpkin, mouse, horse, coach, clock, broom, fireplace, chandelier, palaceRoom, carpet, flowers, txt } from './eu-common.mjs';

// ---------- 角色 ----------
const HAIR = '#e8b84a';
const ash = `<circle cx="-14" cy="-60" r="5" fill="#8a8a8a" opacity=".5"/><circle cx="12" cy="-40" r="6" fill="#8a8a8a" opacity=".5"/><circle cx="-20" cy="-24" r="4" fill="#8a8a8a" opacity=".5"/>`;
// 穿舊衣服的灰姑娘
const cindyRags = (o = {}) => person({ hair: 'long', hairColor: HAIR, hat: 'scarf', hatColor: '#a08a70', outfit: 'dress', top: '#9a8a78', apron: '#d8cbb6', shoes: '#6b5a4a', ...o, item: ash + (o.item || '') });
const tiara = `<path d="M-18 -26 L-12 -42 L-4 -32 L0 -46 L4 -32 L12 -42 L18 -26z" fill="#ffd25e" ${L}/><circle cx="0" cy="-34" r="4" fill="#7fd0ff"/>`;
const veil = `<path d="M-30 -24 Q0 -46 30 -24 Q50 10 44 60 L36 64 Q38 10 28 -10 Q0 -30 -28 -10 Q-38 10 -36 64 L-44 60 Q-50 10 -30 -24z" fill="#fff" opacity=".9" ${line(2)}/>` + tiara;
// 穿禮服的灰姑娘（藍色禮服、玻璃鞋）
const gownSkirt = (c) => `<path d="M-22 -60 Q-60 -20 -62 -6 Q0 8 62 -6 Q60 -20 22 -60z" fill="${c}" ${L}/><path d="M-40 -14 q8 -20 0 -40 M0 -8 v-46 M40 -14 q-8 -20 0 -40" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>`;
const cindyGown = (o = {}) => gownSkirt(o.gown || '#8fd0f5') + person({ hair: 'bun', hairColor: HAIR, hat: o.hat || tiara, outfit: 'dress', top: o.gown || '#8fd0f5', shoes: '#c9eeff', ...o });
const stepmother = (o = {}) => person({ hair: 'bun', hairColor: '#5a3a5a', outfit: 'dress', top: '#7a3fa0', mood: 'angry', ...o });
const sister1 = (o = {}) => person({ hair: 'curly', hairColor: '#c8553d', outfit: 'dress', top: '#ff8fb1', ...o });
const sister2 = (o = {}) => person({ hair: 'pigtails', hairColor: '#3a2a22', outfit: 'dress', top: '#9fd38a', ...o });
const sister1Gown = (o = {}) => gownSkirt('#ff8fb1') + sister1({ hat: `<path d="M8 -30 q10 -18 24 -10 q-8 14 -24 10z" fill="#ffd25e" ${line(2)}/>`, ...o });
const sister2Gown = (o = {}) => gownSkirt('#9fd38a') + sister2({ hat: `<path d="M-8 -30 q-10 -18 -24 -10 q8 14 24 10z" fill="#ffd25e" ${line(2)}/>`, ...o });
const fairyWings = `<path d="M-10 -100 Q-90 -170 -80 -90 Q-70 -60 -10 -80z M10 -100 Q90 -170 80 -90 Q70 -60 10 -80z" fill="#e6f4ff" opacity=".9" ${line(2.5)}/>`;
const fairy = (o = {}) => {
  const [hx, hy] = hand(o.pose || 'raise');
  return fairyWings + person({ hair: 'bun', hairColor: '#e8e8e8', hat: 'hood', hatColor: '#9ad0ff', outfit: 'dress', top: '#b9a8f0', pose: 'raise', ...o,
    item: wand(hx, hy, hx + 16, hy - 50) });
};
const prince = (o = {}) => `<path d="M-30 -100 L-46 -10 H46 L30 -100z" fill="#c8303a" ${L}/>` +
  person({ outfit: 'shirt', top: '#3d5a99', bottom: '#f2efe6', hat: 'crown', hairColor: '#8a5a32', shoes: '#3a2a22', ...o });
const notes = (x, y) => at(x, y, 1, false, `<path d="M0 0 V-34 L20 -40 V-6" fill="none" ${line(3)}/><ellipse cx="-5" cy="0" rx="7" ry="5" fill="${INK}"/><ellipse cx="15" cy="-6" rx="7" ry="5" fill="${INK}"/>`);

// ---------- 背景 ----------
const house = () => room({ wall: '#e8dcc8', stripe: '#dfd1ba', floor: '#b8946a', window: false }) +
  `<rect x="560" y="190" width="130" height="120" fill="#bfe4ff" ${L}/><path d="M625 190 v120 M560 250 h130" ${line(3)}/>`;
const nightGarden = () => night() + moon(640, 110, 40) + hills(400, '#3f6a5a', '#35594c') + ground(450, '#3f6a4c');
const stairs = (x, y) => Array.from({ length: 6 }, (_, i) => `<rect x="${x + i * 60}" y="${y - i * 30}" width="${BX + BW - x - i * 60}" height="${30 + i * 30}" fill="${i % 2 ? '#e2dcef' : '#d4cde4'}" ${line(2.5)}/>`).join('');

// ---------- 每一頁 ----------
const pages = {
  // 封面：灰姑娘、王子、城堡和玻璃鞋
  cover: svg(night('#2b3270', '#6a6fb8') + moon(130, 110, 40) + hills(420, '#4b5f8a', '#3e5078') + castle(400, 430, 0.75, { wall: '#e8e2f6' }) +
    ground(470, '#4f6a8a') + clock(400, 260, 34) +
    at(300, 575, 1.2, false, cindyGown({ pose: 'reach' })) + at(510, 575, 1.2, true, prince({ pose: 'reach' })) +
    slipper(670, 560, 1.4) + sparkle(200, 300) + sparkle(600, 280, 0.8) + sparkle(160, 450, 0.6, '#fff') + sparkle(680, 420, 0.6, '#fff')),

  // 1. 每天打掃、煮飯、洗衣服
  '01': svg(house() +
    at(560, 570, 1.1, true, stepmother({ pose: 'point' })) + at(670, 560, 0.95, true, sister1({ mood: 'happy' })) +
    at(270, 575, 1.2, false, cindyRags({ mood: 'normal', pose: 'hold', item: broom(14, -100, -40, -20) })) +
    at(130, 560, 0.9, false, `<path d="M-40 0 H40 L32 -50 H-32z" fill="#7cc4f2" ${L}/><ellipse cx="0" cy="-50" rx="34" ry="8" fill="#d6efff" ${L}/>`) +
    sparkle(380, 540, 0.5, '#fff')),

  // 2. 坐在火爐旁，身上沾滿灰
  '02': svg(house() + fireplace(230, 400, 1.1) +
    `<circle cx="180" cy="300" r="12" fill="#bbb" opacity=".6"/><circle cx="210" cy="270" r="16" fill="#ccc" opacity=".5"/>` +
    at(380, 575, 1.2, false, cindyRags({ mood: 'cry' })) +
    at(570, 570, 1.05, true, sister1({ mood: 'happy', pose: 'point' })) + at(690, 570, 1, true, sister2({ mood: 'happy' })) +
    txt(620, 300, '灰姑娘！', 34, '#7a6fa0')),

  // 3. 王子要舉辦盛大的舞會
  '03': svg(sky('#bfe4ff', '#f2f8ff') + sun(680, 90) + cloud(160, 110) + hills(400) + castle(560, 440, 0.7) +
    ground(460, '#8dc775') +
    at(360, 575, 1.15, false, person({ outfit: 'tunic', top: '#e2483d', bottom: '#f2c14e', hat: 'cap', hatColor: '#3d5a99', mood: 'happy', pose: 'reach',
      item: `<rect x="34" y="-90" width="60" height="78" rx="6" fill="#fff8e6" ${L}/><circle cx="64" cy="-24" r="8" fill="#e2483d" ${line(2)}/><text x="64" y="-50" font-size="18" font-weight="700" text-anchor="middle" fill="${INK}" font-family="sans-serif">舞會</text>` })) +
    at(150, 575, 1, false, sister1({ pose: 'up' })) + at(250, 580, 0.95, false, sister2({ pose: 'up' })) +
    sparkle(560, 240) + sparkle(470, 280, 0.6) + sparkle(660, 270, 0.7) + hearts(180, 360)),

  // 4. 姊姊們穿禮服去舞會，灰姑娘傷心地哭了
  '04': svg(house() + fireplace(150, 400, 0.9) +
    `<rect x="590" y="210" width="2" height="2" fill="none"/>` +
    at(300, 575, 1.15, false, cindyRags({ mood: 'cry' })) +
    at(520, 575, 1.05, false, sister1Gown({ mood: 'happy' })) + at(650, 575, 1.05, false, sister2Gown({ mood: 'happy' })) +
    txt(590, 300, '哼～', 36, '#7a3fa0')),

  // 5. 仙女出現了
  '05': svg(nightGarden() + tree(110, 470, 1) + cottage(660, 470, 0.7) +
    at(470, 570, 1.2, false, fairy({ mood: 'happy' })) + at(260, 575, 1.15, false, cindyRags({ mood: 'scared' })) +
    sparkle(410, 260, 1.2) + sparkle(560, 300, 0.8) + sparkle(380, 400, 0.6) + sparkle(600, 420, 0.7, '#fff') + sparkle(330, 330, 0.5, '#fff')),

  // 6. 南瓜變馬車，老鼠變白馬，舊衣服變禮服
  '06': svg(nightGarden() + `<path d="M250 500 L420 520" ${line(5)}/>` + horse(250, 560, 0.95, true) + coach(500, 560, 1.0) +
    pumpkin(100, 590, 0.6) + mouse(160, 595, 0.8) +
    at(705, 580, 1, true, cindyGown({ mood: 'happy' })) +
    sparkle(160, 470) + sparkle(380, 300, 0.9) + sparkle(640, 340, 0.8) + sparkle(720, 470, 0.6, '#fff') + sparkle(300, 380, 0.6, '#fff') +
    `<path d="M120 520 Q170 460 220 470" fill="none" stroke="#ffd25e" stroke-width="4" stroke-dasharray="6 8" stroke-linecap="round"/>`),

  // 7. 魔法到半夜十二點就會消失
  '07': svg(nightGarden() + coach(680, 560, 0.7) +
    at(220, 575, 1.15, false, fairy({ mood: 'normal', pose: 'point' })) +
    clock(400, 330, 70, { h: 12, m: 0 }) +
    at(560, 575, 1.15, true, cindyGown({ mood: 'normal' })) + sparkle(300, 260, 0.7) + txt(400, 455, '12 點！', 36, '#e2483d')),

  // 8. 在舞會上和王子跳舞
  '08': svg(palaceRoom() + chandelier(400, 180, 1.1) + carpet(400) +
    at(330, 575, 1.25, false, cindyGown({ pose: 'reach', mood: 'happy' })) + at(480, 575, 1.25, true, prince({ pose: 'reach', mood: 'happy' })) +
    notes(200, 360) + notes(620, 330) + hearts(390, 330) + sparkle(160, 450, 0.7) + sparkle(660, 460, 0.7)),

  // 9. 十二點的鐘響了，在樓梯上掉了一隻玻璃鞋
  '09': svg(night('#232a5e', '#4b4f8e') + moon(120, 100, 36) + castle(650, 400, 0.8, { wall: '#e8e2f6' }) + clock(650, 210, 32) +
    ground(420, '#3e4f78') + stairs(160, 600) +
    at(250, 570, 1.15, true, cindyGown({ mood: 'scared', pose: 'up' })) +
    slipper(500, 510, 1.3) + txt(450, 300, '噹——噹——', 40, '#ffd25e') + sweat(200, 380)),

  // 10. 王子拿著玻璃鞋找人，姊姊們的腳塞不進去
  '10': svg(house() +
    at(230, 575, 1.15, false, prince({ pose: 'point', mood: 'normal' })) +
    `<rect x="340" y="540" width="110" height="34" rx="12" fill="#c8303a" ${L}/>` + slipper(395, 540, 1.3) +
    at(560, 575, 1.1, true, sister1({ mood: 'cry', pose: 'reach' })) + at(680, 575, 1, true, sister2({ mood: 'scared' })) +
    `<ellipse cx="470" cy="520" rx="34" ry="16" fill="#f8d5b5" ${L}/>` + sweat(500, 470) + sweat(630, 380) +
    txt(420, 320, '塞不進去！', 34, '#c94f4f')),

  // 11. 灰姑娘一試，剛剛好！還拿出另一隻
  '11': svg(house() +
    at(170, 575, 1.1, false, prince({ pose: 'up', mood: 'happy' })) +
    at(400, 575, 1.2, false, cindyRags({ mood: 'happy', pose: 'reach', shoes: '#c9eeff', item: slipper(...hand('reach', 'adult'), 1) })) +
    at(620, 575, 1, true, sister1({ mood: 'scared' })) + at(720, 575, 0.95, true, stepmother({ mood: 'scared' })) +
    sparkle(400, 520, 0.9, '#fff') + sparkle(330, 300) + sparkle(520, 280, 0.7) + txt(560, 330, '剛剛好！', 34, '#3d8ad0')),

  // 12. 結婚了，從此過著幸福快樂的日子
  '12': svg(sky('#ffd9e6', '#fff4f8') + sun(400, 110, 46) + cloud(150, 100) + cloud(650, 110, 0.8) + hills(400, '#b3e09a', '#9fd38a') +
    castle(400, 440, 0.65) + ground(460, '#9fd38a') +
    at(320, 575, 1.2, false, cindyGown({ gown: '#ffffff', hat: veil, pose: 'hold', item: `<circle cx="14" cy="-60" r="14" fill="#ff8fb1" ${line(2)}/><circle cx="2" cy="-54" r="10" fill="#ffd25e" ${line(2)}/>` })) +
    at(450, 575, 1.2, true, prince({ pose: 'down' })) +
    at(130, 575, 0.9, false, sister1({ pose: 'up' })) + at(640, 575, 0.9, true, sister2({ pose: 'up' })) + at(730, 575, 0.9, true, stepmother({ mood: 'happy' })) +
    hearts(380, 320) + sparkle(220, 300) + sparkle(560, 290, 0.8) + flowers(595, [60, 230, 560, 770])),
};

writeBook('cinderella', pages);
