// 曹沖稱象的插畫。用法：node tools/scenes/cao-chong.mjs --sheet

import * as S from './lib.mjs';
import { figure, twinBuns, guan, officialHat, cnWall, paving, willow, rock, thought, karst } from './cn-common.mjs';

const { BX, BW, H, INK, L, line, at, svg, face, sky, sun, cloud, hills, sparkle, sweat, hearts, grass, cnHouse, writeBook } = S;

// ---------- 大象 ----------
function elephant({ mood = 'happy', trunkUp = false } = {}) {
  const C = '#a9b4c4', D = '#8e9aae';
  const trunk = trunkUp ? 'M40 14 Q90 10 96 -40 q2 -16 -12 -14' : 'M36 16 Q76 40 70 96 q-2 14 12 12';
  return `<path d="M-116 -120 q-24 20 -16 50" fill="none" ${line(5)}/><path d="M-132 -70 l-6 10 l12 -2z" fill="${INK}"/>` +
    [-84, -44, 24, 64].map((x) => `<rect x="${x}" y="-70" width="36" height="70" rx="10" fill="${x < 0 ? D : C}" ${L}/>` +
      `<path d="M${x + 6} -6 h24" stroke="#f2f2f2" stroke-width="5" stroke-linecap="round"/>`).join('') +
    `<ellipse cx="-10" cy="-112" rx="112" ry="72" fill="${C}" ${L}/>` +
    at(96, -142, 1, false,
      `<ellipse cx="-40" cy="0" rx="46" ry="58" fill="${D}" ${L}/><ellipse cx="-40" cy="2" rx="30" ry="40" fill="#f2b8c0" opacity=".6"/>` +
      `<path d="${trunk}" fill="none" stroke="${INK}" stroke-width="32" stroke-linecap="round"/>` +
      `<path d="${trunk}" fill="none" stroke="${C}" stroke-width="25" stroke-linecap="round"/>` +
      `<circle r="54" fill="${C}" ${L}/>` +
      `<path d="M22 28 q14 14 30 10" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M22 28 q14 14 30 10" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>` +
      at(6, -6, 1, false, face(42, mood, { cheek: '#f5a3b3' })));
}

// ---------- 人物 ----------
const caoChong = (o = {}, arms) => figure({ age: 'child', hair: 'short', hairColor: '#2f2a2a', hat: twinBuns(), top: '#5bb0d8', bottom: '#2f6f9f', ...o }, arms);
const caoCao = (o = {}, arms) => figure({ hair: 'topknot', hat: guan('#e2b23a'), beard: '#2f2a2a', top: '#a83a3a', bottom: '#f2c14e', ...o }, arms);
const MC = [['#4f6fa8', '#2f4a7a'], ['#5f9f6a', '#3f6f4a'], ['#8a6fb0', '#5a3f80']];
const minister = (i = 0, o = {}, arms) => figure({ hair: 'short', hat: officialHat(), beard: i === 1 ? '#7a7a7a' : '', top: MC[i % 3][0], bottom: MC[i % 3][1], ...o }, arms);
const worker = (i = 0, o = {}, arms) => figure({ hair: 'short', hat: 'scarf', hatColor: i % 2 ? '#e8a23b' : '#d9605a', outfit: 'tunic', top: i % 2 ? '#c99a5a' : '#7a9a5a', bottom: '#5a4632', ...o }, arms);
const chinArms = [[-26, -88, -36, -45], [26, -88, 16, -104]];
const chinArmsKid = [[-26, -72, -36, -29], [26, -72, 16, -88]];
const brush = `<path d="M70 -60 L96 -96" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M70 -60 L96 -96" stroke="#c99a5a" stroke-width="4" stroke-linecap="round"/><path d="M94 -94 l8 -12" stroke="#e2483d" stroke-width="7" stroke-linecap="round"/>`;
const stoneHeld = (x, y) => rock(x, y, 0.9, '#9a9ca6');

// ---------- 道具 ----------
// 秤（桿秤）：原點在提繩的手把，左邊掛東西，右邊掛秤砣
const steelyard = (x, y, s = 1, load = '') => at(x, y, s, false,
  `<path d="M0 0 V24" ${line(3)}/>` +
  `<path d="M-110 30 L130 18" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M-110 30 L130 18" stroke="#c99a5a" stroke-width="5" stroke-linecap="round"/>` +
  [-60, -20, 20, 60, 100].map((d) => `<circle cx="${d}" cy="${26 - d * 0.05}" r="2" fill="${INK}"/>`).join('') +
  `<path d="M-100 30 V70" ${line(3)}/>` + load +
  `<path d="M90 21 V48" ${line(3)}/><path d="M80 48 h20 l6 26 h-32z" fill="#5a5f6a" ${L}/>`);

// 一堆石頭
const stones = (x, y, s = 1) => at(x, y, s, false,
  [[-60, 0], [-20, 0], [20, 0], [60, 0], [-40, -30], [0, -30], [40, -30], [-20, -58], [20, -58]]
    .map(([dx, dy], i) => rock(dx, dy, 0.75, ['#9a9ca6', '#a8aab2', '#8e9098'][i % 3])).join(''));

// 船：原點在船身中間；mark = 在船身畫紅線的位置（船身座標，船底約 +40、甲板 -60）
const BOAT_MARK = -18;
const ship = (x, y, s = 1, { mark = false } = {}) => at(x, y, s, false,
  `<path d="M-230 -60 H230 Q216 20 160 44 H-160 Q-216 20 -230 -60z" fill="#b5804e" ${L}/>` +
  `<path d="M-226 -40 H226 M-218 -6 H218 M-200 24 H200" stroke="#9a6a3c" stroke-width="3"/>` +
  `<rect x="-236" y="-70" width="472" height="12" rx="4" fill="#8a5a32" ${L}/>` +
  (mark ? `<path d="M-224 ${BOAT_MARK} H224" stroke="#e2483d" stroke-width="6" stroke-linecap="round"/>` : ''));

// 河邊場景：遠山、河水在後面，船，前面再蓋一層水，船身下半就會「沉在水裡」
const WATER_Y = 470;
const river = (content) =>
  sky() + cloud(160, 100) + cloud(560, 80, 0.8) + karst(620, 340, 280, 160, '#9fc8b0') + karst(760, 340, 200, 120, '#8fbfa8') +
  `<rect x="${BX}" y="330" width="${BW}" height="${H - 330}" fill="#7cc4f2"/>` + content.back +
  `<rect x="${BX}" y="${WATER_Y}" width="${BW}" height="${H - WATER_Y}" fill="#5fb0e6"/>` +
  [[300, 500], [520, 540], [700, 510], [420, 580]].map(([x, yy]) => `<path d="M${x} ${yy} q15 -10 30 0 q15 10 30 0" fill="none" stroke="#d6efff" stroke-width="4" stroke-linecap="round"/>`).join('') +
  `<path d="M${BX} 430 H180 Q240 440 250 ${H} H${BX}z" fill="#c9b07a" ${L}/>` +
  `<rect x="${BX}" y="430" width="${180 - BX}" height="${H - 430}" fill="#c9b07a"/>` +
  content.front;

// 載重時船的位置：紅線剛好在水面
const boatLoaded = (x) => ship(x, WATER_Y - BOAT_MARK - 4, 1, { mark: true });
const boatEmpty = (x, mark = true) => ship(x, WATER_Y - 30, 1, { mark });
const DECK_LOADED = WATER_Y - BOAT_MARK - 4 - 60;
const DECK_EMPTY = WATER_Y - 30 - 60;

// 宮殿院子
const palace = () => sky() + cloud(160, 90) + cloud(620, 70, 0.8) +
  cnWall(400, 120, { wall: '#c8553d', tile: '#e8b44a' }) + paving(400, '#e8dcc0');
const palaceHall = () => sky() + cloud(600, 90) + hills(380, '#a9d98f', '#8dc775') +
  cnHouse(400, 440, 1.3, { wall: '#f5e6c8', roof: '#d9a03a', door: '#a8432f' }) + paving(440, '#e8dcc0');

// ---------- 每一頁 ----------
const pages = {
  // 封面：大象在船上、船身畫了紅線，曹沖在岸邊
  cover: svg(river({
    back: at(520, DECK_LOADED, 0.78, false, elephant({ mood: 'happy', trunkUp: true })) + boatLoaded(520),
    front: at(130, 570, 1.15, false, caoChong({ pose: 'point' })) + stones(40, 470, 0.6) + sparkle(740, 480, 0.8) + sparkle(300, 380, 0.7),
  })),

  // 1. 三國時代的曹沖，爸爸是曹操
  '01': svg(palaceHall() + willow(80, 450, 0.9) + willow(730, 450, 0.85) +
    at(330, 570, 1.15, false, caoCao({ pose: 'hips' })) +
    at(470, 570, 1.1, false, caoChong({ pose: 'raise' })) + sparkle(520, 360, 0.7)),

  // 2. 南方送來一頭大象，大家跑來看熱鬧
  '02': svg(palace() + willow(60, 400, 0.8) +
    at(520, 570, 1.2, false, elephant({ mood: 'happy', trunkUp: true })) +
    at(330, 570, 1, false, worker(0, { pose: 'point' })) +
    at(140, 575, 1, false, minister(0, { mood: 'scared', pose: 'up' })) + at(230, 585, 0.85, false, caoChong({ mood: 'scared', pose: 'up' })) +
    sparkle(700, 330, 0.8) + sweat(180, 400)),

  // 3. 曹操問：大象有多重？
  '03': svg(palace() +
    at(610, 570, 1.1, true, elephant({ mood: 'normal' })) +
    at(200, 570, 1.15, false, caoCao({ mood: 'normal' }, chinArms)) +
    at(330, 575, 0.95, false, minister(1, { mood: 'scared' })) + sweat(370, 420) +
    thought(400, 280, 220, 120, steelyard(10, -40, 0.6, '') + at(-50, 30, 0.22, false, elephant({ mood: 'normal' })), -120, 80)),

  // 4. 大臣說：做一把超大的秤！可是哪來這麼大的秤？
  '04': svg(palace() +
    thought(430, 285, 380, 150, steelyard(0, -50, 1.25, `<path d="M-120 70 h40 l-6 14 h-28z" fill="#c9a25a" ${line(2.5)}/>`) +
      at(0, 0, 1, false, ''), -160, 80) +
    at(200, 575, 1.1, false, minister(0, { pose: 'raise' })) +
    at(570, 575, 1.05, true, minister(1, { mood: 'scared' }, chinArms)) + sweat(610, 420) +
    at(745, 580, 0.55, true, elephant({ mood: 'normal' }))),

  // 5. 有人說切成一塊一塊秤？不行不行！
  '05': svg(palace() +
    at(580, 570, 1.15, true, elephant({ mood: 'scared' })) + sweat(470, 360) + sweat(520, 330) + sweat(720, 370) +
    at(150, 575, 1.05, false, minister(2, { mood: 'normal', pose: 'point' })) +
    at(290, 580, 0.95, false, caoChong({ mood: 'scared', pose: 'up' })) +
    at(380, 580, 1, false, minister(0, { mood: 'scared', pose: 'up' }))),

  // 6. 六歲的曹沖：我有辦法！
  '06': svg(palace() +
    at(400, 575, 1.25, false, caoChong({ mood: 'happy', pose: 'raise' })) +
    sparkle(470, 280, 1.1) + sparkle(330, 300, 0.8) + sparkle(520, 360, 0.6) +
    at(170, 575, 1.05, false, caoCao({ mood: 'normal' })) +
    at(600, 575, 1, true, minister(0, { mood: 'scared' })) + at(710, 575, 1, true, minister(1, { mood: 'normal' }))),

  // 7. 大象上船，船往下沉，在水面的地方畫一條線
  '07': svg(river({
    back: at(540, DECK_LOADED, 0.78, false, elephant({ mood: 'normal' })) + boatLoaded(540),
    front: at(130, 570, 1.1, false, caoChong({ item: brush }, [[-26, -72, -36, -29], [26, -72, 72, -62]])) +
      sparkle(330, 470, 0.8) + sparkle(760, 460, 0.6),
  })),

  // 8. 大象下船，把石頭一塊一塊搬上船
  '08': svg(river({
    back: stones(520, DECK_EMPTY, 0.5) + boatEmpty(540),
    front: at(80, 560, 0.55, true, elephant({ mood: 'happy', trunkUp: true })) +
      at(400, DECK_EMPTY + 4, 0.9, false, worker(0, { pose: 'hold', item: stoneHeld(14, -36) })) +
      at(620, DECK_EMPTY, 0.85, true, worker(1, { pose: 'hold', item: stoneHeld(14, -36) })) +
      at(205, 585, 0.95, false, caoChong({ pose: 'point' })),
  })),

  // 9. 石頭越放越多，水面又碰到那條線
  '09': svg(river({
    back: stones(450, DECK_LOADED, 0.75) + stones(620, DECK_LOADED, 0.75) + stones(535, DECK_LOADED - 52, 0.6) + boatLoaded(540),
    front: at(140, 570, 1.1, false, caoChong({ pose: 'point' })) +
      sparkle(300, 470, 0.9) + sparkle(780, 470, 0.7) + hearts(240, 380),
  })),

  // 10. 把石頭拿去秤，加起來就是大象的重量
  '10': svg(sky() + cloud(600, 90) + hills(380, '#a9d98f', '#8dc775') + paving(430, '#e6d6b2') +
    `<path d="M300 560 L380 260 L460 560" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M300 560 L380 260 L460 560" fill="none" stroke="#a0703f" stroke-width="10" stroke-linecap="round"/>` +
    steelyard(380, 262, 1.1, `<path d="M-130 70 h60 l-8 26 h-44z" fill="#c9a25a" ${L}/>` + rock(-114, 72, 0.5) + rock(-88, 72, 0.5)) +
    stones(150, 570, 0.75) + stones(640, 570, 0.6) +
    at(580, 575, 1, true, worker(1, { pose: 'reach' })) +
    at(720, 575, 0.95, true, caoChong({ pose: 'up' })) +
    at(80, 575, 0.95, false, minister(0, { mood: 'happy', pose: 'hold' }))),

  // 11. 曹操和大臣都拍手叫好
  '11': svg(palaceHall() +
    at(640, 570, 0.95, true, elephant({ mood: 'happy', trunkUp: true })) +
    at(380, 575, 1.2, false, caoChong({ pose: 'up' })) +
    at(240, 575, 1.1, false, caoCao({ pose: 'hold' })) +
    at(110, 575, 1, false, minister(1, { pose: 'hold' })) +
    sparkle(380, 300, 1) + sparkle(470, 340, 0.7) + hearts(300, 350)),
};

writeBook('cao-chong', pages);
