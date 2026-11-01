// 傑克與魔豆的插畫。用法：node tools/scenes/jack-beanstalk.mjs --sheet
import * as S from './lib.mjs';
import { cow, henBird, goldEgg, say, axe, sleepEyes, glow } from './uk-common.mjs';

const { BX, BW, BY, H, INK, line, L, SKIN, at, svg, face, person, hand, sky, sun, cloud, hills, path, tree, grass, sparkle, sweat, hearts, cottage, room, castle, fence, bird, writeBook } = S;

// ---------- 角色 ----------
const jack = (o = {}) => person({ age: 'child', hair: 'short', hairColor: '#8a5a32', outfit: 'shirt', top: '#6cbd62', bottom: '#8a6a4a', shoes: '#5a3a24', ...o,
  item: `<rect x="-14" y="-62" width="12" height="10" fill="#f2c14e" ${line(2)}/>` + (o.item || '') });
const mom = (o = {}) => person({ hair: 'bun', hairColor: '#6b4a2f', outfit: 'dress', top: '#8e6bb0', apron: '#fff8e6', ...o });
const oldMan = (o = {}) => person({ hair: 'bald', hairColor: '#e8e8e8', beard: '#f2f2f2', outfit: 'robe', top: '#6b8f6a', bottom: '#4a6a4a', hat: 'pointy', hatColor: '#4a6a8a', ...o });
// 巨人：大大的鼻子、捲捲的紅鬍子、補丁衣服，看起來有點笨笨的
const giantFace = (sleep) => (sleep ? sleepEyes('#f3c49b') : '') +
  `<path d="M-22 -16 q8 -8 16 -2 M6 -18 q8 -6 16 2" fill="none" stroke="#c9782a" stroke-width="5" stroke-linecap="round"/>` +
  `<circle cx="-30" cy="4" r="7" fill="#f3c49b" ${line(2)}/><circle cx="30" cy="4" r="7" fill="#f3c49b" ${line(2)}/>` +
  `<ellipse cx="0" cy="9" rx="9" ry="8" fill="#f0a080" ${line(2.5)}/>` +
  `<circle cx="0" cy="-30" r="6" fill="#c9782a"/><path d="M-3 -34 q3 -10 8 -6" fill="none" stroke="#c9782a" stroke-width="3"/>`;
const giant = ({ sleep = false, ...o } = {}) => person({
  skin: '#f3c49b', hair: 'bald', hairColor: '#c9782a', beard: '#c9782a', outfit: 'tunic', top: '#7a6aa8', bottom: '#6b4a2f', shoes: '#5a3a24',
  mood: 'angry', ...o, hat: giantFace(sleep),
  item: `<rect x="-20" y="-70" width="16" height="14" fill="#e8b84a" ${line(2)}/><path d="M-20 -63 h16 M-12 -70 v14" stroke="${INK}" stroke-width="1.5"/>` + (o.item || ''),
});
// 坐著睡覺的巨人（上半身 + 彎起來的腳）
const giantSeated = (id) =>
  `<defs><clipPath id="${id}"><rect x="-200" y="-400" width="400" height="352"/></clipPath></defs>` +
  `<rect x="-40" y="-58" width="120" height="38" rx="10" fill="#6b4a2f" ${L}/>` +
  `<rect x="54" y="-30" width="26" height="30" fill="#6b4a2f" ${L}/><ellipse cx="72" cy="-4" rx="22" ry="8" fill="#5a3a24"/>` +
  `<g clip-path="url(#${id})">${giant({ sleep: true, mood: 'normal', pose: 'hold' })}</g>`;

// 魔豆、會唱歌的豎琴
const beans = (x, y, s = 1) => at(x, y, s, false,
  [[-14, 0], [0, -4], [14, 0], [-7, -14], [7, -14]].map(([bx, by]) => `<ellipse cx="${bx}" cy="${by}" rx="7" ry="5" fill="#8a5ab0" ${line(2)}/>`).join(''));
const harp = (x, y, s = 1, mood = 'happy', flip = false) => at(x, y, s, flip,
  `<path d="M-30 0 V-120 Q-30 -150 0 -140 Q30 -128 50 -150 Q60 -120 40 -100 L10 0z" fill="none" stroke="${INK}" stroke-width="16" stroke-linejoin="round"/>` +
  `<path d="M-30 0 V-120 Q-30 -150 0 -140 Q30 -128 50 -150 Q60 -120 40 -100 L10 0z" fill="none" stroke="#f2c14e" stroke-width="10" stroke-linejoin="round"/>` +
  [-18, -6, 6, 18, 30].map((sx, i) => `<path d="M${sx} ${-130 + i * 4} L${sx} ${-4 - (sx + 30) * 0.4 + (sx > 0 ? sx * 0.6 : 0)}" stroke="#fff6c8" stroke-width="2"/>`).join('') +
  `<rect x="-42" y="-6" width="64" height="10" rx="4" fill="#d9a63a" ${line(2.5)}/>` +
  at(-30, -150, 1, false, `<circle r="20" fill="#f6d36b" ${L}/>` + `<g transform="scale(.66)">${face(30, mood)}</g>` +
    `<path d="M-20 -6 Q-22 -26 0 -24 Q22 -26 20 -6 Q12 -16 0 -16 Q-12 -16 -20 -6z" fill="#e8b84a" ${line(2)}/>`));
const notes = (x, y) => [0, 1, 2].map((i) => at(x + i * 34, y - (i % 2) * 26, 1, false,
  `<path d="M0 0 V-30 l14 6" fill="none" ${line(3)}/><ellipse cx="-5" cy="0" rx="7" ry="5" fill="${INK}"/>`)).join('');

// 豆莖：從 (x, 620) 一直長到畫面上方（上方只有葉子）
function beanstalk(x, { top = BY, amp = 26, w = 30 } = {}) {
  const pts = [];
  for (let y = 640; y >= top; y -= 30) pts.push([x + Math.sin(y / 70) * amp, y]);
  const d = 'M' + pts.map((p) => p.join(' ')).join(' L');
  let leaves = '';
  pts.forEach(([px, py], i) => {
    if (i % 3) return;
    const side = (i / 3) % 2 ? 1 : -1;
    leaves += `<path d="M${px} ${py} q${side * 40} -40 ${side * 80} -10 q${-side * 40} 30 ${-side * 80} 10z" fill="#6cbd62" ${line(2.5)}/>` +
      `<path d="M${px} ${py} q${side * 30} -14 ${side * 60} -8" fill="none" stroke="#4f9a5f" stroke-width="2"/>`;
  });
  return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 6}" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="none" stroke="#5fae5a" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="none" stroke="#86c46f" stroke-width="${w / 4}" stroke-linecap="round" stroke-linejoin="round" transform="translate(-6 0)"/>` + leaves;
}

// 雲上的地面
const cloudLand = (y) => `<rect x="${BX}" y="${y}" width="${BW}" height="${H - y}" fill="#fbfdff"/>` +
  Array.from({ length: 30 }, (_, i) => `<circle cx="${-1000 + i * 100}" cy="${y + 4}" r="${46 + (i % 3) * 10}" fill="#fbfdff"/>`).join('') +
  Array.from({ length: 10 }, (_, i) => `<path d="M${-60 + i * 110} ${y + 70 + (i % 3) * 40} q20 -16 40 0" fill="none" stroke="#d6e6f5" stroke-width="5" stroke-linecap="round"/>`).join('');
// 巨人城堡裡：石牆、大窗戶、地板
const hall = () => `<rect x="${BX}" y="${BY}" width="${BW}" height="${H - BY}" fill="#c9c0b4"/>` +
  Array.from({ length: 50 }, (_, r) => `<path d="M${BX} ${BY + r * 40} H${BX + BW}" stroke="#b3a99b" stroke-width="3"/>`).join('') +
  Array.from({ length: 30 * 20 }, (_, i) => { const r = i % 50, c = Math.floor(i / 50); return r * 40 + BY > 420 ? '' : `<path d="M${-1000 + c * 120 + (r % 2) * 60} ${BY + r * 40} v40" stroke="#b3a99b" stroke-width="3"/>`; }).join('') +
  `<path d="M560 420 V230 Q640 150 720 230 V420z" fill="#bfe4ff" ${L}/><path d="M640 175 V420 M560 300 H720" ${line(4)}/>` +
  `<rect x="${BX}" y="420" width="${BW}" height="${H - 420}" fill="#9a7a5a"/>` +
  [0, 1, 2].map((i) => `<path d="M${BX} ${460 + i * 50} H${BX + BW}" stroke="#86684a" stroke-width="3"/>`).join('') + `<path d="M${BX} 420 H${BX + BW}" ${line(4)}/>`;

const poorCottage = (x, y, s = 1) => cottage(x, y, s, { wall: '#e8dcc0', roof: '#a8865a', door: '#8c6a4a' }) +
  at(x, y, s, false, `<rect x="-70" y="-180" width="30" height="20" fill="#c9a25a" ${line(2)} transform="rotate(-12 -55 -170)"/><rect x="20" y="-160" width="26" height="18" fill="#8a6a4a" ${line(2)} transform="rotate(10 33 -151)"/>`);
const rope = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.max(y1, y2) + 30} ${x2} ${y2}" fill="none" stroke="#a67f3f" stroke-width="4"/>`;

const day = () => sky() + sun(690, 90) + cloud(160, 100) + cloud(480, 70, 0.7);

const pages = {
  // 封面：傑克爬豆莖，雲上有城堡
  cover: svg(sky('#a9d4f5', '#eaf6ff') + sun(120, 90, 44) + hills(450) +
    at(570, 390, 0.5, false, castle(0, 0, 1, { wall: '#e6e0f0' })) + cloud(600, 450, 1.8) + cloud(460, 430, 1.1) + cloud(740, 440, 1.2) +
    poorCottage(690, 580, 0.5) +
    beanstalk(300) +
    at(300, 470, 1.05, false, jack({ pose: 'up', mood: 'happy' })) + sparkle(420, 400, 0.8) + sparkle(200, 300, 0.6)),

  // 1. 傑克和媽媽很窮，只剩一頭老母牛
  '01': svg(day() + hills(380, '#b5cf8f', '#9cbf7a') + poorCottage(220, 460, 0.95) + fence(380, 470, 360) +
    at(370, 570, 1, false, mom({ mood: 'cry', pose: 'down' })) + at(470, 575, 1, false, jack({ mood: 'normal' })) +
    cow(610, 575, 0.85, true) + grass(80, 570)),

  // 2. 媽媽要傑克牽母牛去市場
  '02': svg(day() + hills(380) + poorCottage(120, 450, 0.75) + path() +
    at(270, 570, 1, false, mom({ mood: 'normal', pose: 'point' })) +
    at(450, 570, 1, false, jack({ mood: 'normal', pose: 'reach' })) + rope(524, 470, 600, 470) + cow(630, 570, 0.8, false) +
    tree(740, 440, 0.8)),

  // 3. 奇怪的老爺爺用五顆魔豆換母牛
  '03': svg(day() + hills(370, '#a9d98f', '#8dc775') + path() + tree(90, 460, 1) +
    cow(170, 575, 0.75, false) + rope(260, 440, 340, 480) +
    at(340, 575, 1, false, jack({ mood: 'happy', pose: 'reach' })) +
    at(560, 575, 1.05, true, oldMan({ mood: 'happy', pose: 'reach' })) + beans(476, 460, 1.1) + glow(476, 452, 5, 46)),

  // 4. 媽媽氣得把豆子丟出窗外
  '04': svg(room({ wall: '#efe0c4', stripe: '#e6d2b0', floor: '#b5875a' }) +
    `<rect x="580" y="220" width="20" height="10" fill="#8a5ab0"/>` +
    at(500, 580, 1.1, false, mom({ mood: 'angry', pose: 'raise' })) +
    [[590, 230], [612, 250], [636, 228], [660, 262], [602, 280]].map(([bx, by]) => `<ellipse cx="${bx}" cy="${by}" rx="7" ry="5" fill="#8a5ab0" ${line(2)}/>`).join('') +
    `<path d="M560 260 q30 -40 70 -30" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-dasharray="10 10"/>` +
    at(240, 580, 1, false, jack({ mood: 'cry', pose: 'down' })) +
    `<rect x="40" y="440" width="120" height="40" fill="#c98a4a" ${L}/><rect x="50" y="480" width="10" height="70" fill="#9a6440"/><rect x="140" y="480" width="10" height="70" fill="#9a6440"/>` +
    `<ellipse cx="100" cy="440" rx="30" ry="7" fill="#fff" ${line(2)}/>`),

  // 5. 隔天早上，豆莖長到雲上面
  '05': svg(sky('#ffd9c9', '#fff2e6') + sun(140, 140, 50) + cloud(560, 120, 1.6) + cloud(420, 60, 1) + hills(420, '#a9d98f', '#8dc775') +
    poorCottage(230, 500, 0.8) + beanstalk(470, { w: 36 }) +
    at(600, 580, 1, true, jack({ mood: 'scared', pose: 'up' })) + at(710, 580, 1, true, mom({ mood: 'scared', pose: 'up' })) +
    sparkle(560, 300, 0.8) + sparkle(380, 260, 0.6)),

  // 6. 爬到雲上，看到好大的城堡
  '06': svg(sky('#9fd0f5', '#e6f5ff') + cloud(150, 90) + at(540, 470, 1, false, castle(0, 0, 0.95, { wall: '#e6e0f0', roof: '#7a6aa8' })) +
    cloudLand(470) + beanstalk(180, { top: 480 }) +
    at(250, 520, 1, false, jack({ mood: 'scared', pose: 'point' })) + sparkle(400, 260, 0.8) + sparkle(700, 240, 0.6)),

  // 7. 巨人：咚咚咚！我聞到小孩子的味道！
  '07': svg(hall() + at(470, 595, 2.15, false, giant({ mood: 'normal', pose: 'hips' })) +
    `<path d="M520 275 q14 -6 22 4 M526 292 q16 -4 24 8" fill="none" ${line(3)}/>` +
    say(150, 300, '咚！', 44, '#9a6440') + say(240, 250, '咚！', 44, '#9a6440') + say(700, 470, '咚！', 44, '#9a6440') +
    `<rect x="40" y="430" width="110" height="140" rx="10" fill="#b5884a" ${L}/><path d="M40 470 h110 M40 520 h110" stroke="#8a5a32" stroke-width="5"/>` +
    at(170, 590, 0.75, false, jack({ mood: 'scared', pose: 'hold' }))),

  // 8. 躲起來，看到金蛋母雞和金豎琴
  '08': svg(hall() +
    `<rect x="360" y="400" width="460" height="28" fill="#a8764a" ${L}/><rect x="400" y="428" width="28" height="180" fill="#8a5a32" ${L}/><rect x="740" y="428" width="28" height="180" fill="#8a5a32" ${L}/>` +
    henBird(480, 400, 1) + goldEgg(560, 400, 1) + goldEgg(585, 400, 0.85) + harp(700, 400, 1, 'happy') + glow(555, 380, 4, 40) +
    at(375, 590, 1, false, jack({ mood: 'scared', pose: 'down' })) +
    `<path d="M110 600 Q100 470 150 460 H260 Q300 470 290 600z" fill="#7a8a9a" ${L}/><path d="M290 490 q50 10 30 60 q-10 10 -30 6" fill="none" ${line(10)}/><path d="M290 490 q50 10 30 60 q-10 10 -30 6" fill="none" stroke="#7a8a9a" stroke-width="5"/>`),

  // 9. 巨人吃飽睡著，傑克抱著母雞和豎琴偷偷跑
  '09': svg(hall() +
    `<rect x="470" y="250" width="240" height="250" rx="30" fill="#b5452f" ${L}/><rect x="440" y="470" width="300" height="50" rx="14" fill="#c8553d" ${L}/>` +
    `<rect x="455" y="520" width="24" height="70" fill="#8a5a32" ${L}/><rect x="700" y="520" width="24" height="70" fill="#8a5a32" ${L}/>` +
    at(560, 570, 1.75, false, giantSeated('gs9')) +
    say(700, 240, '呼嚕～', 40, '#5b8fd0') +
    at(210, 580, 0.95, true, jack({ mood: 'scared', pose: 'hold', item: henBird(10, -40, 0.42) })) +
    harp(150, 560, 0.55, 'happy', true) + sweat(260, 430)),

  // 10. 豎琴大叫，巨人醒了追出來
  '10': svg(hall() + at(560, 595, 2, true, giant({ mood: 'angry', pose: 'point' })) +
    at(190, 585, 0.95, true, jack({ mood: 'scared', pose: 'hold', item: henBird(10, -40, 0.42) })) +
    harp(320, 560, 0.6, 'scared') + say(330, 300, '主人！主人！', 36, '#e2483d') +
    say(720, 300, '哇！', 44, '#e2483d') + sweat(130, 430) + sweat(250, 420)),

  // 11. 傑克飛快爬下豆莖：媽媽，快拿斧頭來！
  '11': svg(sky('#a9d4f5', '#eaf6ff') + cloud(330, 250, 2.4) + cloud(170, 240, 1.2) + hills(470) + poorCottage(680, 540, 0.55) +
    beanstalk(320) + at(318, 420, 0.62, false, giant({ mood: 'angry', pose: 'up' })) +
    at(330, 590, 0.95, false, jack({ mood: 'scared', pose: 'up' })) +
    at(580, 590, 1, true, mom({ mood: 'scared', pose: 'raise', item: axe(40, -170, 0.9, -20) })) +
    say(560, 300, '快拿斧頭來！', 34, '#e2483d')),

  // 12. 砍呀砍，喀啦——豆莖倒下來
  '12': svg(sky('#a9d4f5', '#eaf6ff') + cloud(620, 300, 2) + at(640, 335, 0.62, false, giant({ mood: 'cry', pose: 'up' })) + cloud(650, 385, 1.3) + cloud(570, 380, 0.9) +
    hills(470) +
    `<g transform="rotate(-24 300 580)">${beanstalk(300, { top: -200 })}</g>` +
    `<path d="M300 560 l-10 -14 l14 -8 l-8 -16" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>` +
    at(430, 590, 1, true, jack({ mood: 'angry', pose: 'raise', item: axe(40, -150, 0.9, 30) })) +
    at(580, 590, 0.95, true, mom({ mood: 'happy', pose: 'up' })) +
    say(340, 280, '喀啦——', 44, '#9a6440') + `<path d="M120 400 q-30 -60 10 -120 M170 420 q-20 -50 10 -100" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>`),

  // 13. 母雞生金蛋、豎琴唱歌，再也不用餓肚子
  '13': svg(sky('#ffd9c9', '#fff2e6') + sun(400, 120, 56) + cloud(150, 100) + cloud(650, 110, 0.8) + hills(400, '#a9d98f', '#8dc775') +
    cottage(160, 470, 0.85, { wall: '#f3e3c3', roof: '#c8553d' }) +
    at(330, 580, 1, false, mom({ mood: 'happy', pose: 'up' })) + at(440, 580, 1, false, jack({ mood: 'happy', pose: 'up' })) +
    henBird(580, 570, 0.9, true) + [500, 530, 515].map((x, i) => goldEgg(x, 580 - (i === 2 ? 22 : 0), 0.9)).join('') +
    harp(700, 560, 0.8, 'happy', true) + notes(640, 330) + hearts(390, 380) + sparkle(520, 480, 0.6) + sparkle(250, 260, 0.7)),
};

writeBook('jack-beanstalk', pages);
