// 國王的新衣的插畫。「沒穿衣服」的國王畫成只穿白色背心短褲和皇冠。用法：node tools/scenes/emperors-new-clothes.mjs --sheet
import { BX, BW, H, INK, line, L, SKIN, at, svg, sky, sun, cloud, hills, ground, sparkle, castle, person, hand, hearts, sweat, writeBook } from './lib.mjs';
import { palaceRoom, carpet, throne, goldBag, townRow, txt, flowers } from './eu-common.mjs';

// ---------- 角色 ----------
const cape = `<path d="M-30 -100 Q-60 -40 -56 -6 H56 Q60 -40 30 -100z" fill="#7a3fa0" ${L}/><path d="M-56 -6 H56 V-18 H-56z" fill="#fff" ${line(2)}/>` +
  [-40, -14, 14, 40].map((x) => `<circle cx="${x}" cy="-12" r="2.5" fill="${INK}"/>`).join('');
// 穿華服的國王
const king = (o = {}) => cape + person({ outfit: 'robe', top: '#c8303a', bottom: '#f2c14e', hat: 'crown', beard: '#8a5a32', hairColor: '#8a5a32', shoes: '#5a3a22', ...o });
// 只穿內衣（白背心、白短褲）和皇冠的國王
const kingUnder = (o = {}) => {
  const blush = o.blush ? `<ellipse cx="-18" cy="-120" rx="10" ry="6" fill="#ff6b6b" opacity=".75"/><ellipse cx="18" cy="-120" rx="10" ry="6" fill="#ff6b6b" opacity=".75"/>` : '';
  return person({ outfit: 'shirt', top: SKIN, bottom: SKIN, hat: 'crown', beard: '#8a5a32', hairColor: '#8a5a32', shoes: '#5a3a22', ...o }) +
    `<path d="M-28 -64 H28 L29 -34 H5 L0 -44 L-5 -34 H-29z" fill="#fff" ${L}/><path d="M-28 -56 H28" stroke="#c9d3e0" stroke-width="3"/>` +
    `<path d="M-18 -99 Q0 -86 18 -99 Q20 -86 28 -80 V-62 Q0 -56 -28 -62 V-80 Q-20 -86 -18 -99z" fill="#fff" ${L}/>` +
    `<path d="M-8 -80 q8 6 16 0" fill="none" stroke="#c9d3e0" stroke-width="2"/>` + blush;
};
const stache = `<path d="M-16 12 q8 -8 16 -2 q8 -6 16 2 q-8 6 -16 2 q-8 4 -16 -2z" fill="${INK}"/>`;
const swindler1 = (o = {}) => person({ outfit: 'tunic', top: '#6b8f5a', bottom: '#5a4632', hairColor: '#3a2a22', hat: `<path d="M-32 -14 Q-28 -46 0 -46 Q28 -46 32 -14z" fill="#8c5a3a" ${L}/>` + stache, ...o });
const swindler2 = (o = {}) => person({ outfit: 'tunic', top: '#8a6fb0', bottom: '#4a3a5a', hair: 'curly', hairColor: '#6b4a2f', hat: stache, ...o });
const minister = (o = {}) => person({ hair: 'bald', hairColor: '#e0e0e0', beard: '#e8e8e8', outfit: 'robe', top: '#3d5a99', bottom: '#c9a03a', ...o });
const boy = (o = {}) => person({ age: 'child', outfit: 'shirt', top: '#f2c14e', bottom: '#5b8fd0', hat: 'cap', hatColor: '#e2483d', ...o });
const villager = (i, o = {}) => person({
  outfit: ['dress', 'tunic', 'shirt', 'dress', 'tunic'][i % 5], top: ['#ff8fb1', '#6cbd62', '#5b8fd0', '#f2c14e', '#c8553d'][i % 5],
  bottom: '#6b4a2f', hair: ['long', 'short', 'curly', 'bun', 'short'][i % 5], hairColor: ['#8a5a32', '#3a2a22', '#c8553d', '#5a3a22', '#e8b84a'][i % 5],
  hat: i % 5 === 4 ? 'straw' : '', ...o,
});
const trumpet = (x, y) => at(x, y, 1, false, `<path d="M0 0 L50 -10" ${line(8)}/><path d="M0 0 L50 -10" stroke="#f2c14e" stroke-width="5"/><path d="M46 -8 L70 -26 L76 6z" fill="#f2c14e" ${L}/>`);
const notes = (x, y) => at(x, y, 1, false, `<path d="M0 0 V-30 L18 -36 V-6" fill="none" ${line(3)}/><ellipse cx="-5" cy="0" rx="7" ry="5" fill="${INK}"/><ellipse cx="13" cy="-6" rx="7" ry="5" fill="${INK}"/>`);
// 空空的織布機
const loom = (x, y, s = 1) => at(x, y, s, false,
  `<rect x="-120" y="-200" width="18" height="200" fill="#a0683e" ${L}/><rect x="102" y="-200" width="18" height="200" fill="#a0683e" ${L}/>` +
  `<rect x="-130" y="-210" width="260" height="20" rx="6" fill="#b87a4a" ${L}/><rect x="-130" y="-70" width="260" height="18" rx="6" fill="#b87a4a" ${L}/>` +
  Array.from({ length: 11 }, (_, i) => `<path d="M${-90 + i * 18} -190 V-70" stroke="#e8dcc8" stroke-width="2"/>`).join('') +
  `<rect x="-120" y="-30" width="240" height="14" fill="#8c5a3a" ${L}/>`);
// 衣架和衣服
const rack = (x, y, s = 1) => at(x, y, s, false,
  `<path d="M-120 0 V-200 M120 0 V-200 M-130 -200 H130" ${line(6)}/>` +
  ['#5b8fd0', '#f2c14e', '#6cbd62', '#ff8fb1', '#7a3fa0'].map((c, i) => {
    const cx = -90 + i * 45;
    return `<path d="M${cx} -200 v10" ${line(2)}/><path d="M${cx - 18} -186 H${cx + 18} L${cx + 22} -100 H${cx - 22}z" fill="${c}" ${L}/><path d="M${cx} -186 v86" stroke="#fff" stroke-width="2" opacity=".6"/>`;
  }).join(''));
const mirror = (x, y, s = 1) => at(x, y, s, false,
  `<ellipse cx="0" cy="-120" rx="56" ry="90" fill="#f2c96a" ${L}/><ellipse cx="0" cy="-120" rx="44" ry="78" fill="#d6efff" ${L}/>` +
  `<path d="M-20 -170 L10 -190 M-24 -140 L20 -170" stroke="#fff" stroke-width="6" stroke-linecap="round"/><rect x="-20" y="-32" width="40" height="32" fill="#a0683e" ${L}/>`);
const street = () => sky('#bfe4ff', '#eaf6ff') + sun(680, 90) + cloud(160, 110) + cloud(480, 80, 0.7) + townRow(420) +
  `<rect x="${BX}" y="420" width="${BW}" height="${H - 420}" fill="#d9c9a8"/>` +
  Array.from({ length: 30 }, (_, i) => `<path d="M${-1000 + i * 100} 420 V${H}" stroke="#c9b48e" stroke-width="2"/>`).join('') +
  `<path d="M${BX} 480 H${BX + BW} M${BX} 540 H${BX + BW}" stroke="#c9b48e" stroke-width="2"/>` +
  [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<path d="M${i * 90} 270 l45 22 l45 -22" fill="none" stroke="${INK}" stroke-width="2"/>` +
    `<path d="M${i * 90 + 30} 283 l10 14 l10 -10z" fill="${['#e2483d', '#ffd25e', '#5b8fd0'][((i % 3) + 3) % 3]}"/>`).join('');

// ---------- 每一頁 ----------
const pages = {
  // 封面：國王穿著「新衣服」得意地遊行
  cover: svg(street() +
    at(130, 560, 0.95, false, villager(0, { pose: 'up' })) + at(680, 560, 0.95, true, villager(2, { mood: 'scared' })) +
    at(400, 580, 1.35, false, kingUnder({ pose: 'hips' })) +
    sparkle(300, 330) + sparkle(510, 300, 0.8) + sparkle(530, 420, 0.6) + at(580, 575, 0.9, true, boy({ pose: 'point', mood: 'scared' }))),

  // 1. 最喜歡新衣服的國王
  '01': svg(palaceRoom() + rack(170, 450, 1) + mirror(640, 450, 1) +
    at(410, 570, 1.3, false, king({ pose: 'up' })) +
    sparkle(320, 290) + sparkle(520, 270, 0.8) + hearts(500, 360)),

  // 2. 兩個騙子來到皇宮
  '02': svg(palaceRoom() + carpet() + throne(170, 470, 1) +
    at(170, 520, 1.05, false, king({ mood: 'happy' })) +
    at(470, 575, 1.15, true, swindler1({ pose: 'reach', item: `<circle cx="74" cy="-82" r="14" fill="#e8dcc8" ${L}/><path d="M64 -86 h20 M64 -78 h20" stroke="#c9a03a" stroke-width="3"/>` })) +
    at(620, 575, 1.15, true, swindler2({ pose: 'up' })) + sparkle(400, 470, 0.7)),

  // 3. 不聰明的人看不見的布
  '03': svg(palaceRoom({ curtains: false }) + carpet() +
    at(280, 575, 1.2, false, swindler1({ pose: 'reach' })) + at(520, 575, 1.2, true, swindler2({ pose: 'reach' })) +
    sparkle(380, 470) + sparkle(420, 430, 0.7) + sparkle(400, 510, 0.6) + txt(400, 330, '？', 50, '#5b8fd0')),

  // 4. 國王給了騙子好多金子
  '04': svg(palaceRoom() + carpet() + throne(150, 470, 0.9) +
    at(300, 575, 1.2, false, king({ pose: 'reach', mood: 'happy' })) + goldBag(400, 520, 1.1) +
    at(540, 575, 1.15, true, swindler1({ pose: 'up', mood: 'happy' })) + at(680, 575, 1.1, true, swindler2({ pose: 'up', mood: 'happy' })) +
    sparkle(400, 410, 0.8)),

  // 5. 騙子假裝在空空的織布機上忙
  '05': svg(palaceRoom({ wall: '#8a7a9a', stripe: '#7e6e90', curtains: false }) + loom(400, 560, 1.2) +
    at(200, 575, 1.15, false, swindler1({ pose: 'reach', mood: 'happy' })) + at(610, 575, 1.15, true, swindler2({ pose: 'reach', mood: 'happy' })) +
    sparkle(360, 420, 0.6, '#fff') + sparkle(450, 380, 0.5, '#fff') + txt(400, 300, '？', 46, '#fff')),

  // 6. 老大臣什麼也沒看到
  '06': svg(palaceRoom({ curtains: false }) + loom(420, 560, 1.1) +
    at(230, 575, 1.2, false, minister({ mood: 'scared' })) + sweat(290, 360) + sweat(310, 390) +
    at(640, 575, 1.1, true, swindler1({ pose: 'point', mood: 'happy' })) + txt(250, 300, '好…好漂亮！', 30, '#3d5a99')),

  // 7. 國王自己去看，也什麼都看不到
  '07': svg(palaceRoom() + loom(450, 560, 1.1) +
    at(220, 575, 1.25, false, king({ mood: 'scared' })) + sweat(280, 350) + sweat(150, 370) +
    at(680, 575, 1.05, true, swindler2({ pose: 'point', mood: 'happy' })) + txt(240, 290, '真…真是太美了！', 28, '#c8303a')),

  // 8. 騙子假裝幫國王穿上新衣服
  '08': svg(palaceRoom() + mirror(660, 450, 0.9) +
    at(400, 580, 1.25, false, kingUnder({ pose: 'up', mood: 'happy' })) +
    at(220, 575, 1.1, false, swindler1({ pose: 'reach', mood: 'happy' })) + at(560, 575, 1.1, true, swindler2({ pose: 'reach', mood: 'happy' })) +
    sparkle(320, 400, 0.6) + sparkle(480, 360, 0.6) + txt(400, 270, '輕得像羽毛！', 32, '#7a3fa0')),

  // 9. 國王在街上遊行，大家一直稱讚
  '09': svg(street() +
    at(110, 560, 0.9, false, villager(0, { pose: 'up' })) + at(200, 555, 0.85, false, villager(1, { pose: 'up' })) +
    at(630, 555, 0.85, true, villager(3, { pose: 'up' })) + at(730, 560, 0.9, true, villager(4, { pose: 'up' })) +
    at(470, 585, 1.25, false, kingUnder({ pose: 'hips' })) +
    at(300, 590, 0.95, false, villager(2, { outfit: 'tunic', top: '#e2483d', hat: 'cap', hatColor: '#3d5a99', pose: 'raise', item: trumpet(...hand('raise')) })) +
    notes(330, 330) + notes(200, 300) + txt(620, 300, '好漂亮！', 34, '#e2483d')),

  // 10. 小男孩說：國王什麼都沒有穿呀！
  '10': svg(street() +
    at(620, 560, 0.85, true, villager(3, { mood: 'scared' })) + at(720, 565, 0.9, true, villager(4, { mood: 'scared' })) +
    at(420, 585, 1.25, false, kingUnder({ pose: 'down', mood: 'scared' })) +
    at(180, 585, 1.1, false, boy({ pose: 'point', mood: 'happy' })) +
    txt(220, 300, '國王沒穿衣服！', 32, '#e2483d') + sweat(480, 360)),

  // 11. 大家都笑了，國王紅著臉
  '11': svg(street() +
    at(100, 560, 0.85, false, villager(0, { mood: 'happy', pose: 'up' })) + at(200, 575, 0.95, false, boy({ mood: 'happy', pose: 'up' })) +
    at(620, 560, 0.85, true, villager(1, { mood: 'happy', pose: 'up' })) + at(720, 565, 0.9, true, villager(2, { mood: 'happy' })) +
    at(410, 585, 1.25, false, kingUnder({ pose: 'hold', mood: 'cry', blush: true })) + sweat(470, 360) +
    txt(160, 290, '哈哈哈', 34, '#e2483d') + txt(660, 300, '哈哈哈', 34, '#e2483d')),
};

writeBook('emperors-new-clothes', pages);
