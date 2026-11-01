// 金髮女孩與三隻熊的插畫。用法：node tools/scenes/goldilocks.mjs --sheet
import * as S from './lib.mjs';
import { bear, bearHead, bowl, say, steam, sleepEyes } from './uk-common.mjs';

const { BX, BW, BY, H, INK, line, L, SKIN, at, svg, face, person, hand, sky, sun, cloud, hills, tree, pine, grass, sparkle, sweat, hearts, cottage, room, forest, fence, bird, writeBook } = S;

// ---------- 角色 ----------
const GOLD = '#f2c94c';
const goldi = (o = {}) => person({ age: 'child', hair: 'long', hairColor: GOLD, outfit: 'dress', top: '#5b8fd0', apron: '#fff8e6', shoes: '#c94f4f',
  hat: `<path d="M-26 -22 q-14 -14 -4 -22 q10 2 10 14z M-26 -22 q4 -18 14 -14 q0 10 -10 16z" fill="#e2483d" ${line(2)}/>`, ...o });
// 睡在床上的金髮女孩（只露出頭）
const goldiSleepHead = (mood = 'sleep') =>
  `<path d="M-36 -2 Q-40 -40 0 -40 Q40 -40 36 -2 L44 30 Q0 40 -44 30z" fill="${GOLD}" ${L}/>` +
  `<circle r="30" fill="${SKIN}" ${L}/>` + face(30, mood === 'sleep' ? 'normal' : mood) + (mood === 'sleep' ? sleepEyes(SKIN) + `<rect x="-10" y="8" width="20" height="12" fill="${SKIN}"/><path d="M-5 13 q5 4 10 0" fill="none" ${line(2.5)}/>` : '') +
  `<path d="M-31 2 Q-32 -32 0 -32 Q32 -32 31 2 Q20 -22 0 -20 Q-20 -22 -31 2z" fill="${GOLD}" ${line(2.5)}/>`;
const bearPeek = (x, y, s = 0.7, mood = 'scared') => at(x, y, s, false, `<circle r="30" fill="#b07a4a" ${L}/>` + face(30, mood) + bearHead(mood));

// ---------- 道具 ----------
const table = (x, y, w = 360) => `<rect x="${x - w / 2}" y="${y}" width="${w}" height="22" rx="4" fill="#b5884a" ${L}/>` +
  `<path d="M${x - w / 2 + 10} ${y + 22} h${w - 20}" stroke="#9a6a3a" stroke-width="4"/>` +
  [x - w / 2 + 24, x + w / 2 - 44].map((lx) => `<rect x="${lx}" y="${y + 22}" width="20" height="${590 - y - 22}" fill="#9a6a3a" ${L}/>`).join('');
const tablecloth = (x, y, w = 360) => `<path d="M${x - w / 2 - 10} ${y} H${x + w / 2 + 10} L${x + w / 2} ${y + 40} H${x - w / 2}z" fill="#fff" ${L}/>` +
  Array.from({ length: Math.floor(w / 30) }, (_, i) => `<rect x="${x - w / 2 + i * 30 + 4}" y="${y + 4}" width="14" height="14" fill="#f5a3a3"/>`).join('');
const chair = (x, y, s = 1, { c = '#9a6440', cushion = '', broken = false } = {}) => at(x, y, s, false,
  broken
    ? `<rect x="-44" y="-20" width="88" height="14" fill="${c}" ${L} transform="rotate(10)"/>` +
      `<rect x="-36" y="-80" width="72" height="56" rx="8" fill="${c}" ${L} transform="rotate(-24 0 -24)"/>` +
      `<rect x="30" y="-46" width="12" height="46" fill="${c}" ${L} transform="rotate(60 36 0)"/><rect x="-30" y="-40" width="12" height="40" fill="${c}" ${L} transform="rotate(-70 -24 0)"/>` +
      `<path d="M-40 -80 l-12 -12 M40 -60 l12 -14 M0 -90 v-16" ${line(3)}/>`
    : `<rect x="-40" y="-64" width="12" height="64" fill="${c}" ${L}/><rect x="28" y="-64" width="12" height="64" fill="${c}" ${L}/>` +
      `<rect x="-38" y="-156" width="76" height="86" rx="10" fill="${c}" ${L}/><rect x="-24" y="-142" width="48" height="58" rx="6" fill="#fff" opacity=".25"/>` +
      `<rect x="-46" y="-76" width="92" height="16" rx="4" fill="${c}" ${L}/>` +
      (cushion ? `<path d="M-46 -74 Q-48 -96 0 -96 Q48 -96 46 -74z" fill="${cushion}" ${L}/><rect x="-26" y="-146" width="52" height="58" rx="14" fill="${cushion}" ${L}/>` : ''));
const bed = (x, y, s = 1, { c = '#9a6440', blanket = '#5b8fd0', who = '' } = {}) => at(x, y, s, false,
  `<rect x="-90" y="-150" width="20" height="150" fill="${c}" ${L}/><path d="M-90 -150 q10 -24 20 0" fill="${c}" ${L}/>` +
  `<rect x="70" y="-100" width="20" height="100" fill="${c}" ${L}/>` +
  `<rect x="-76" y="-80" width="152" height="40" rx="8" fill="#fff" ${L}/>` +
  `<ellipse cx="-44" cy="-86" rx="28" ry="14" fill="#fff8e6" ${L}/>` + who +
  `<path d="M-30 -96 Q20 -110 80 -90 L80 -40 H-30z" fill="${blanket}" ${L}/>` +
  `<path d="M-30 -96 Q20 -110 80 -90" fill="none" stroke="#fff" stroke-width="5" opacity=".6"/>` +
  `<rect x="-80" y="-44" width="170" height="14" fill="${c}" ${L}/>`);
const spoon = (x, y) => `<path d="M${x} ${y} l14 -28" ${line(5)}/><ellipse cx="${x + 16}" cy="${y - 32}" rx="5" ry="7" fill="#c8d0da" ${line(2)}/>`;
const thinkBubble = (x, y, body) => `<circle cx="${x - 120}" cy="${y + 90}" r="8" fill="#fff" ${L}/><circle cx="${x - 96}" cy="${y + 66}" r="13" fill="#fff" ${L}/>` +
  `<ellipse cx="${x}" cy="${y}" rx="110" ry="70" fill="#fff" ${L}/>` + body;
const no = (x, y) => `<path d="M${x - 40} ${y - 40} L${x + 40} ${y + 40} M${x + 40} ${y - 40} L${x - 40} ${y + 40}" stroke="#e2483d" stroke-width="10" stroke-linecap="round" opacity=".85"/>`;

const woods = () => sky('#bfe4ff', '#eef8ff') + sun(680, 90) + cloud(150, 100) + hills(380, '#8fc77a', '#76b866') + forest(400, '#5a9e5a', '#4a8a4f');
const kitchen = () => room({ wall: '#f6e3c8', stripe: '#efd5b2' });
const upstairs = () => room({ wall: '#e6eef8', stripe: '#d8e4f2', floor: '#c99a6b' });

const pages = {
  // 封面：金髮女孩和三隻熊，在森林小木屋前
  cover: svg(woods() + cottage(400, 450, 0.95, { wall: '#d9b27c', roof: '#a0522d' }) + pine(120, 470, 1.1) + pine(700, 470, 1) +
    at(250, 570, 1.05, false, goldi({ pose: 'up' })) +
    at(500, 570, 1.05, true, bear({ size: 'papa', pose: 'raise' })) + at(610, 575, 1, true, bear({ size: 'mama', pose: 'down' })) + at(700, 580, 0.95, true, bear({ size: 'baby', pose: 'up' })) +
    sparkle(320, 260, 0.7) + hearts(380, 360) + grass(80, 580)),

  // 1. 森林裡的小木屋，住著三隻熊
  '01': svg(woods() + cottage(250, 460, 1, { wall: '#d9b27c', roof: '#a0522d' }) + pine(720, 480, 1.1) +
    at(450, 570, 1.1, false, bear({ size: 'papa', pose: 'hips' })) + at(570, 575, 1.05, true, bear({ size: 'mama', pose: 'hold' })) + at(670, 585, 1, true, bear({ size: 'baby', pose: 'up' })) +
    hearts(600, 350) + grass(100, 570)),

  // 2. 熊媽媽煮了三碗粥，太燙了，先出去散步
  '02': svg(kitchen() + table(400, 410, 400) + tablecloth(400, 410, 400) +
    bowl(300, 410, 1.2, { hot: true, c: '#5b8fd0' }) + bowl(415, 410, 1, { hot: true, c: '#e889a8' }) + bowl(510, 410, 0.75, { hot: true, c: '#f2c14e' }) +
    at(150, 590, 1.05, false, bear({ size: 'mama', pose: 'point' })) +
    at(640, 595, 1.05, true, bear({ size: 'papa', pose: 'point' })) + at(740, 600, 0.9, true, bear({ size: 'baby', pose: 'hold' }))),

  // 3. 迷路的金髮女孩走進小木屋
  '03': svg(woods() + cottage(520, 480, 1.1, { wall: '#d9b27c', roof: '#a0522d', door: '#3a2a22' }) +
    at(520, 480, 1.1, false, `<path d="M-25 0 V-80 Q-10 -96 0 -98 L-6 -76 V10z" fill="#8c5a3a" ${L}/>`) + pine(100, 480, 1.2) + pine(760, 500, 0.9) +
    at(300, 580, 1.05, false, goldi({ mood: 'normal', pose: 'point' })) + bird(200, 330, 1, '#f2a03d') + grass(380, 590)),

  // 4. 太燙、太涼、剛剛好——全吃光了
  '04': svg(kitchen() + table(400, 410, 420) + tablecloth(400, 410, 420) +
    bowl(290, 410, 1.2, { hot: true, c: '#5b8fd0' }) + bowl(410, 410, 1, { c: '#e889a8' }) +
    `<path d="M390 360 l6 -10 l6 10 M416 356 l6 -10 l6 10" fill="none" stroke="#7cc4f2" stroke-width="3"/>` +
    bowl(520, 410, 0.75, { c: '#f2c14e', empty: true }) +
    at(660, 590, 1.1, true, goldi({ mood: 'happy', pose: 'reach', item: spoon(70, -60) })) + hearts(700, 330) +
    say(290, 290, '太燙了！', 32, '#e2483d') + say(420, 320, '太涼了！', 28, '#2f6f9f')),

  // 5. 坐椅子：太硬、太軟、剛剛好——喀啦！
  '05': svg(kitchen() + chair(140, 560, 1.4) + chair(330, 560, 1.1, { c: '#c98a4a', cushion: '#e889a8' }) +
    chair(560, 570, 0.8, { c: '#f2c14e', broken: true }) +
    at(560, 560, 1, false, `<g transform="rotate(-20)">${goldi({ mood: 'scared', pose: 'up' })}</g>`) +
    say(680, 330, '喀啦！', 48, '#9a6440') + sparkle(480, 500, 0.7, '#fff') + sparkle(650, 520, 0.6, '#fff')),

  // 6. 上樓，大床太高、中床太低，小床剛剛好，睡著了
  '06': svg(upstairs() + bed(170, 570, 1.25, { c: '#7a5638', blanket: '#4f8a5a' }) + bed(400, 570, 1, { c: '#c98a4a', blanket: '#e889a8' }) +
    bed(620, 570, 0.85, { c: '#f2c14e', blanket: '#9ad0ff', who: at(-44, -96, 0.9, false, goldiSleepHead()) }) +
    `<text x="660" y="390" font-size="30" font-weight="900" fill="#5b8fd0" font-family="sans-serif">z</text><text x="690" y="360" font-size="38" font-weight="900" fill="#5b8fd0" font-family="sans-serif">z</text>`),

  // 7. 三隻熊回來：誰吃過我的粥？
  '07': svg(kitchen() + table(420, 410, 400) + tablecloth(420, 410, 400) +
    bowl(320, 410, 1.2, { c: '#5b8fd0' }) + bowl(435, 410, 1, { c: '#e889a8' }) + bowl(530, 410, 0.75, { c: '#f2c14e', empty: true }) +
    at(130, 590, 1.1, false, bear({ size: 'papa', mood: 'angry', pose: 'point' })) +
    at(700, 590, 1.05, true, bear({ size: 'mama', mood: 'scared', pose: 'hold' })) + at(610, 600, 0.95, true, bear({ size: 'baby', mood: 'cry', pose: 'point' }))),

  // 8. 誰坐過我的椅子？我的椅子壞掉了！
  '08': svg(kitchen() + chair(110, 560, 1.4) + chair(270, 560, 1.1, { c: '#c98a4a', cushion: '#e889a8' }) +
    chair(430, 580, 0.8, { c: '#f2c14e', broken: true }) +
    at(560, 590, 1.05, true, bear({ size: 'baby', mood: 'cry', pose: 'point' })) +
    at(660, 590, 1.05, true, bear({ size: 'papa', mood: 'angry', pose: 'hips' })) +
    at(750, 595, 1, true, bear({ size: 'mama', mood: 'scared', pose: 'hold' }))),

  // 9. 走上樓：有人睡在我的床上，她還在這裡！
  '09': svg(upstairs() + bed(420, 570, 0.95, { c: '#f2c14e', blanket: '#9ad0ff', who: at(-44, -96, 0.9, false, goldiSleepHead()) }) +
    at(160, 590, 1.1, false, bear({ size: 'papa', mood: 'scared', pose: 'down' })) + at(260, 595, 1.05, false, bear({ size: 'mama', mood: 'scared', pose: 'hold' })) +
    at(620, 595, 1, true, bear({ size: 'baby', mood: 'scared', pose: 'point' })) + say(640, 330, '在這裡！', 34, '#e2483d')),

  // 10. 嚇得跳下床，從窗戶跑出去
  '10': svg(woods() + cottage(520, 480, 1.15, { wall: '#d9b27c', roof: '#a0522d' }) +
    bearPeek(442, 385, 0.62, 'scared') + bearPeek(598, 385, 0.62, 'scared') + pine(760, 500, 0.9) +
    at(220, 590, 1.05, true, goldi({ mood: 'scared', pose: 'up' })) + sweat(160, 420) + sweat(290, 410) +
    `<path d="M310 560 h60 M300 530 h50 M320 500 h40" stroke="#fff" stroke-width="6" stroke-linecap="round"/>`),

  // 11. 不經過同意，不可以亂進別人家、亂用別人的東西
  '11': svg(sky('#ffd9c9', '#fff2e6') + sun(110, 120, 46) + cloud(650, 100) + hills(400, '#a9d98f', '#8dc775') +
    cottage(170, 470, 0.8, { wall: '#f3e3c3', roof: '#5b8fd0' }) + fence(300, 490, 200) +
    at(400, 580, 1.1, false, goldi({ mood: 'normal', pose: 'hold' })) +
    thinkBubble(610, 330, bowl(560, 350, 0.6, { c: '#f2c14e' }) + chair(650, 360, 0.42, { c: '#f2c14e' }) + no(605, 325)) +
    grass(700, 580)),
};

writeBook('goldilocks', pages);
