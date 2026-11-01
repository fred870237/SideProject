// 亞瑟王與石中劍的插畫。用法：node tools/scenes/king-arthur.mjs --sheet
import * as S from './lib.mjs';
import { horse, say, glow } from './uk-common.mjs';

const { BX, BW, BY, H, INK, line, L, SKIN, at, svg, face, person, hand, sky, sun, cloud, hills, path, tree, pine, grass, sparkle, sweat, hearts, castle, room, fence, bird, writeBook } = S;

// ---------- 道具 ----------
// 劍：從 (0,0) 握把往上（blade = 劍身長度）
const sword = (x, y, s = 1, rot = 0, blade = 120) => at(x, y, s, false, `<g transform="rotate(${rot})">` +
  `<path d="M-7 -14 L-7 ${-14 - blade} L0 ${-28 - blade} L7 ${-14 - blade} L7 -14z" fill="#e6ecf2" ${line(2.5)}/>` +
  `<path d="M0 -18 V${-14 - blade}" stroke="#b8c2cc" stroke-width="2"/>` +
  `<rect x="-24" y="-18" width="48" height="10" rx="4" fill="#f2c14e" ${line(2.5)}/>` +
  `<rect x="-5" y="-8" width="10" height="26" fill="#8a5a32" ${line(2)}/><circle cx="0" cy="22" r="7" fill="#f2c14e" ${line(2)}/></g>`);
// 石中劍：石頭底部在 (0,0)，劍柄大約在 y = -150
const stoneSword = (x, y, s = 1, { drawn = false, writing = false } = {}) => at(x, y, s, false,
  `<path d="M-110 0 Q-120 -60 -70 -76 Q-20 -96 30 -86 Q100 -80 110 -30 Q116 0 110 0z" fill="#9a9aa6" ${L}/>` +
  `<path d="M-80 -50 q20 -10 40 0 M40 -60 q20 -6 34 6" fill="none" stroke="#7d7d8a" stroke-width="4" stroke-linecap="round"/>` +
  (writing ? `<rect x="-62" y="-52" width="124" height="44" rx="6" fill="#c9c9d2" ${line(2)}/>` +
    [0, 1, 2].map((i) => `<path d="M-50 ${-42 + i * 12} q8 -5 16 0 t16 0 t16 0 t16 0 t16 0 t16 0" fill="none" stroke="#5a5f6a" stroke-width="2.5"/>`).join('') : '') +
  (drawn ? `<path d="M-4 -88 h8" ${line(4)}/>` : sword(0, -150, 1, 0, 50)) +
  `<path d="M-30 -82 Q0 -92 30 -84" fill="none" stroke="#7d7d8a" stroke-width="4"/>`);

const church = (x, y, s = 1) => at(x, y, s, false,
  `<rect x="60" y="-300" width="80" height="300" fill="#e6dccb" ${L}/><path d="M50 -296 L100 -380 L150 -296z" fill="#6f7480" ${L}/>` +
  `<path d="M100 -380 V-410 M88 -398 H112" ${line(4)}/><path d="M86 -250 V-210 Q100 -230 114 -210 V-250 Q100 -270 86 -250z" fill="#5a5f8a" ${L}/>` +
  `<rect x="-140" y="-190" width="200" height="190" fill="#e6dccb" ${L}/><path d="M-160 -186 L-40 -280 L80 -186z" fill="#8a8f9a" ${L}/>` +
  `<path d="M-74 0 V-90 Q-40 -140 -6 -90 V0z" fill="#8c5a3a" ${L}/><path d="M-40 -110 V0" ${line(2)}/>` +
  `<circle cx="-40" cy="-160" r="22" fill="#9ad0ff" ${L}/><path d="M-40 -182 V-138 M-62 -160 H-18" ${line(2)}/>`);

const tent = (x, y, s = 1, c = '#e2483d') => at(x, y, s, false,
  `<path d="M-70 0 L-60 -90 H60 L70 0z" fill="#fff" ${L}/>` +
  [-40, 0, 40].map((d) => `<path d="M${d - 12} 0 L${d * 0.86 - 8} -90 H${d * 0.86 + 8} L${d + 12} 0z" fill="${c}"/>`).join('') +
  `<path d="M-70 0 L-60 -90 H60 L70 0z" fill="none" ${L}/>` +
  `<path d="M-72 -88 L0 -150 L72 -88z" fill="${c}" ${L}/><path d="M0 -150 V-180" ${line(3)}/><path d="M0 -180 l26 7 l-26 7z" fill="#f2c14e" ${line(2)}/>` +
  `<path d="M-16 0 L0 -60 L16 0z" fill="#3a2a22"/>`);
const banners = (y) => `<path d="M${BX} ${y} Q${BX + 500} ${y + 30} 0 ${y} Q200 ${y + 30} 400 ${y} Q600 ${y + 30} 800 ${y} Q1300 ${y + 30} ${BX + BW} ${y}" fill="none" ${line(2)}/>` +
  Array.from({ length: 24 }, (_, i) => { const fx = -400 + i * 70; const c = ['#e2483d', '#f2c14e', '#5b8fd0', '#6cbd62'][i % 4]; return `<path d="M${fx} ${y + 14} l14 28 l14 -28z" fill="${c}" ${line(1.5)}/>`; }).join('');
const crown = (x, y, s = 1) => at(x, y, s, false, `<path d="M-24 0 L-24 -26 L-12 -14 L0 -32 L12 -14 L24 -26 L24 0z" fill="#f6d36b" ${L}/><circle cx="0" cy="-10" r="4" fill="#e2483d"/>`);
const shield = (x, y, s = 1, c = '#5b8fd0') => at(x, y, s, false,
  `<path d="M-30 -40 H30 V0 Q30 30 0 44 Q-30 30 -30 0z" fill="${c}" ${L}/><path d="M0 -36 V36 M-26 -6 H26" stroke="#f2c14e" stroke-width="6"/>`);
const scabbard = `<path d="M-20 -50 L-50 -10" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M-20 -50 L-50 -10" stroke="#6b4a2f" stroke-width="7" stroke-linecap="round"/>`;

// ---------- 角色 ----------
const arthur = ({ king = false, ...o } = {}) => person({
  age: 'child', hair: 'short', hairColor: '#c98a2a', outfit: 'tunic', top: king ? '#7a4ab0' : '#5b8fd0', bottom: '#6b4a2f', shoes: '#5a3a24',
  hat: king ? 'crown' : '', ...o,
  item: (king ? `<path d="M-30 -86 Q-50 -40 -46 -4 H-30z" fill="#c94f4f" ${line(2.5)}/>` : '') + (o.item || ''),
});
const kay = (o = {}) => person({ hair: 'short', hairColor: '#6b4a2f', outfit: 'tunic', top: '#c94f4f', bottom: '#5a5f6a', shoes: '#3a2a22', ...o, item: scabbard + (o.item || '') });
const merlin = (o = {}) => person({
  hair: 'long', hairColor: '#e8e8e8', beard: '#f2f2f2', outfit: 'robe', top: '#4a5aa8', bottom: '#f2c14e', hat: 'pointy', hatColor: '#4a5aa8', shoes: '#3a2a22', ...o,
  item: `<path d="M-40 10 L-46 -150" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M-40 10 L-46 -150" stroke="#9a6440" stroke-width="5" stroke-linecap="round"/><circle cx="-46" cy="-156" r="10" fill="#9ad0ff" ${L}/>` +
    `<path d="M-14 -40 l3 6 l6 1 l-5 4 l1 6 l-5 -3 l-5 3 l1 -6 l-5 -4 l6 -1z" fill="#f6d36b"/>` + (o.item || ''),
});
// 騎士：盔甲（灰）、頭盔、胸前顏色
const knight = (c = '#5b8fd0', o = {}) => person({ hair: 'short', hairColor: '#6b4a2f', hat: 'helmet', outfit: 'tunic', top: c, bottom: '#8a929e', shoes: '#5a5f6a', beard: o.beard || '', ...o,
  item: `<path d="M-14 -86 H14 L10 -56 H-10z" fill="#f2c14e" ${line(2)}/>` + (o.item || '') });
const villager = (top, o = {}) => person({ hair: o.hair || 'short', hairColor: o.hairColor || '#3a2a22', outfit: o.outfit || 'tunic', top, bottom: '#6b5a4a', ...o });

const green = () => sky() + sun(690, 90) + cloud(160, 100) + cloud(480, 70, 0.7) + hills(380);

const pages = {
  // 封面：亞瑟從石頭裡拔出寶劍
  cover: svg(sky('#ffd9c9', '#fff2e6') + sun(400, 160, 70) + cloud(150, 100) + cloud(660, 110, 0.8) + hills(400, '#a9d98f', '#8dc775') +
    castle(640, 430, 0.6) + stoneSword(400, 600, 1.1, { drawn: true }) +
    at(400, 520, 1.15, false, arthur({ mood: 'happy', pose: 'raise', item: sword(40, -144, 1, 0, 80) })) + glow(446, 290, 6, 70) +
    at(170, 580, 1, false, merlin({ pose: 'point' }))),

  // 1. 國王過世，騎士們吵個不停
  '01': svg(sky('#b9c6dc', '#e6ecf5') + cloud(150, 100) + hills(380, '#9fc08a', '#86ad72') + castle(400, 420, 0.7, { flag: '#7a7a8a' }) +
    `<rect x="365" y="470" width="70" height="80" fill="#a8764a" ${L}/><ellipse cx="400" cy="470" rx="46" ry="12" fill="#c94f4f" ${L}/>` + crown(400, 466, 1) +
    at(160, 590, 1.05, false, knight('#5b8fd0', { mood: 'angry', pose: 'point' })) + at(280, 595, 0.95, false, knight('#6cbd62', { mood: 'angry', pose: 'hips' })) +
    at(560, 590, 1.05, true, knight('#c94f4f', { mood: 'angry', pose: 'point' })) + at(680, 595, 0.95, true, knight('#f2a03d', { mood: 'angry', pose: 'raise' })) +
    say(220, 330, '我才是國王！', 28, '#5a5f6a') + say(600, 330, '不，是我！', 28, '#5a5f6a')),

  // 2. 魔法師梅林在教堂前放了一塊插著寶劍的大石頭
  '02': svg(green() + church(200, 450, 0.95) +
    stoneSword(470, 570, 1.05) + glow(470, 430, 5, 70) +
    at(660, 580, 1.1, true, merlin({ pose: 'raise' })) + sparkle(560, 330, 0.9) + sparkle(600, 280, 0.6)),

  // 3. 誰能拔出這把劍，誰就是英國真正的國王
  '03': svg(green() + church(140, 440, 0.8) +
    stoneSword(400, 580, 1.5, { writing: true }) + glow(400, 360, 6, 90) +
    at(640, 590, 1, true, villager('#e2a03d', { mood: 'scared', pose: 'point' })) + at(730, 595, 0.9, true, villager('#8e6bb0', { hair: 'bun', outfit: 'dress', mood: 'happy' }))),

  // 4. 力氣最大的騎士們拉呀拉，寶劍動也不動
  '04': svg(green() + church(140, 430, 0.75) +
    stoneSword(430, 590, 1.05) +
    at(400, 600, 1.08, false, knight('#c94f4f', { mood: 'angry', pose: 'raise', beard: '#6b4a2f' })) +
    sweat(380, 400) + sweat(450, 390) + say(560, 320, '嘿咻——！', 36, '#9a6440') +
    at(650, 590, 0.95, true, knight('#5b8fd0', { mood: 'scared', pose: 'hips' })) + at(740, 595, 0.9, true, knight('#6cbd62', { mood: 'normal', pose: 'down' }))),

  // 5. 亞瑟跟著哥哥凱伊去參加比武大會
  '05': svg(green() + tent(560, 420, 0.8, '#5b8fd0') + tent(700, 430, 0.7, '#e2483d') + banners(330) + path() +
    horse(300, 580, 0.95, false) + at(300, 470, 1, false, kay({ mood: 'happy', pose: 'point' })) +
    at(510, 590, 1, false, arthur({ mood: 'happy', pose: 'hold', item: shield(14, -50, 0.7) + `<rect x="-36" y="-60" width="24" height="40" rx="6" fill="#c9a25a" ${line(2)}/>` }))),

  // 6. 哥哥忘了帶劍，亞瑟說：我馬上去找一把！
  '06': svg(green() + tent(150, 450, 0.9, '#5b8fd0') + tent(640, 440, 0.85, '#e2483d') + banners(320) +
    at(300, 590, 1.1, false, kay({ mood: 'scared', pose: 'hips' })) + say(260, 350, '劍呢？', 30, '#5a5f6a') +
    at(500, 590, 1.05, false, arthur({ mood: 'happy', pose: 'raise' })) + say(560, 330, '我去找！', 30, '#2f6f9f')),

  // 7. 亞瑟跑過教堂，看到石頭上的寶劍
  '07': svg(green() + church(560, 450, 0.95) + stoneSword(360, 570, 1) + glow(360, 430, 4, 60) +
    at(170, 580, 1.05, false, arthur({ mood: 'happy', pose: 'point' })) +
    `<path d="M80 530 h-50 M90 500 h-40" stroke="#fff" stroke-width="6" stroke-linecap="round"/>`),

  // 8. 輕輕一拔——寶劍滑了出來
  '08': svg(sky('#ffe9b8', '#fff8e6') + sun(400, 120, 50) + hills(380, '#a9d98f', '#8dc775') + church(620, 440, 0.8) +
    stoneSword(360, 600, 1.1, { drawn: true }) +
    at(330, 520, 1.15, false, arthur({ mood: 'happy', pose: 'raise', item: sword(40, -144, 1, 0, 80) })) + glow(376, 290, 7, 80) +
    say(190, 320, '咻！', 48, '#f2a03d')),

  // 9. 梅林：這位善良的少年，就是我們的新國王！
  '09': svg(green() + church(120, 430, 0.7) + stoneSword(330, 590, 0.9, { drawn: true }) +
    at(330, 525, 1, false, arthur({ mood: 'happy', pose: 'raise', item: sword(40, -144, 1, 0, 80) })) + glow(370, 320, 5, 60) +
    at(520, 590, 1.05, true, merlin({ pose: 'point' })) +
    at(620, 595, 0.95, true, knight('#c94f4f', { mood: 'scared', pose: 'up' })) + at(720, 595, 0.95, true, kay({ mood: 'scared', pose: 'up' })) +
    at(160, 595, 0.95, false, villager('#e2a03d', { mood: 'scared', pose: 'up' }))),

  // 10. 亞瑟當上國王，做事公平，保護弱小
  '10': svg(sky('#ffd9c9', '#fff2e6') + sun(680, 110, 46) + cloud(160, 100) + hills(400, '#a9d98f', '#8dc775') + castle(400, 440, 0.75) + banners(440) +
    at(400, 590, 1.2, false, arthur({ king: true, mood: 'happy', pose: 'reach' })) +
    at(560, 590, 0.9, true, villager('#8e6bb0', { hair: 'bun', hairColor: '#d9d9d9', outfit: 'dress', mood: 'happy', pose: 'reach' })) +
    at(660, 590, 0.75, true, villager('#6cbd62', { age: 'child', mood: 'happy', pose: 'up' })) +
    at(200, 590, 1, false, knight('#5b8fd0', { mood: 'happy', pose: 'up' })) + hearts(470, 380) + sparkle(300, 300, 0.7)),

  // 11. 圓桌：大家都一樣重要
  '11': svg(room({ wall: '#d9d0c0', stripe: '#cfc5b3', floor: '#9a7a5a', window: false }) +
    shield(130, 290, 1, '#c94f4f') + shield(670, 290, 1, '#5b8fd0') + shield(300, 260, 0.8, '#6cbd62') + shield(500, 260, 0.8, '#f2a03d') +
    at(160, 520, 0.95, false, knight('#c94f4f', { mood: 'happy', pose: 'up' })) + at(280, 505, 0.95, false, knight('#6cbd62', { mood: 'happy' })) +
    at(400, 500, 1, false, arthur({ king: true, mood: 'happy', pose: 'up' })) +
    at(520, 505, 0.95, true, knight('#f2a03d', { mood: 'happy' })) + at(640, 520, 0.95, true, kay({ mood: 'happy', pose: 'up' })) +
    `<ellipse cx="400" cy="500" rx="330" ry="60" fill="#a8764a" ${L}/><ellipse cx="400" cy="494" rx="300" ry="46" fill="#c08a58"/>` +
    `<path d="M70 500 V530 Q400 610 730 530 V500" fill="#8a5a32" ${L}/>` +
    `<ellipse cx="400" cy="494" rx="300" ry="46" fill="none" stroke="#f2c14e" stroke-width="4"/>` + sparkle(400, 494, 0.8)),
};

writeBook('king-arthur', pages);
