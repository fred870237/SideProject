// 孔融讓梨的插畫。用法：node tools/scenes/kong-rong.mjs --sheet

import * as S from './lib.mjs';
import { thought, figure, twinBuns, guan, cnWall, paving, cnInterior, blossomTree, bamboo, pear, basket, table } from './cn-common.mjs';

const { BX, BW, L, line, at, svg, sky, sun, cloud, hills, sparkle, hearts, cnHouse, grass, writeBook } = S;

// ---------- 角色 ----------
// 孔融：兩個小髮髻、橘色漢服
const KR = { age: 'child', hair: 'short', hairColor: '#2f2a2a', hat: twinBuns(), top: '#f29b4b', bottom: '#b5651d' };
const kongRong = (o = {}, arms) => figure({ ...KR, ...o }, arms);

// 哥哥們：頭頂一個髮髻，衣服顏色不一樣
const BRO = [['#5b8fd0', '#2f4a7a'], ['#6cae6a', '#3f6f4a'], ['#9a6fc0', '#5a3f80'], ['#d9605a', '#8a3a32'], ['#3f9aa0', '#2a6064']];
const brother = (i, o = {}, arms) => figure({ age: 'child', hair: 'topknot', hairColor: '#2f2a2a', top: BRO[i][0], bottom: BRO[i][1], ...o }, arms);

// 弟弟：小小的，頭頂一撮毛
const tuft = `<path d="M-2 -30 q-8 -16 6 -20 q-4 8 2 18" fill="#2f2a2a" ${line(2)}/>`;
const babyBro = (o = {}, arms) => figure({ age: 'child', hair: 'none', hat: tuft, top: '#9ad0ff', bottom: '#5b8fd0', ...o }, arms);

// 爸爸、媽媽、送梨子的朋友
const dad = (o = {}, arms) => figure({ hair: 'topknot', hairColor: '#2f2a2a', hat: guan(), beard: '#3a2a22', top: '#4f6fa8', bottom: '#2f4a7a', ...o }, arms);
const mom = (o = {}, arms) => figure({ hair: 'bun', hairColor: '#2f2a2a', top: '#d97a9a', bottom: '#a84a6a', ...o }, arms);
const friend = (o = {}, arms) => figure({ hair: 'topknot', hairColor: '#7a7a7a', hat: guan('#6b4a2f'), beard: '#d9d9d9', top: '#5f9f6a', bottom: '#3f6f4a', ...o }, arms);

// 拿著梨子的手勢（小孩）
const holdPear = (s = 0.8) => ({ pose: 'hold', item: pear(14, -34, s) });
const raisePear = (s = 0.5) => [[[-26, -72, -36, -29], [26, -72, 46, -122]], pear(46, -116, s)];

// 背景
const courtyard = (top = '#bfe4ff', bottom = '#eaf6ff') =>
  sky(top, bottom) + cloud(160, 90) + cloud(620, 70, 0.8) + cnWall(400, 120) + paving(400);

// ---------- 每一頁 ----------
const [rpArms, rpItem] = raisePear(0.55);
const pages = {
  // 封面：孔融舉起小梨子，哥哥們拿大梨子，旁邊一籃梨子
  cover: svg(courtyard('#ffd9c9', '#fff2e6') + sun(660, 100, 46) + blossomTree(110, 400, 1) + blossomTree(700, 400, 0.9) +
    basket(170, 560, 0.95) +
    at(300, 560, 1.05, false, brother(0, holdPear())) +
    at(400, 560, 1.15, false, kongRong({ item: rpItem }, rpArms)) +
    at(510, 560, 1.05, true, brother(1, holdPear())) +
    at(620, 560, 0.8, true, babyBro({ pose: 'up' })) +
    sparkle(470, 380, 0.9) + sparkle(330, 250, 0.7) + hearts(520, 330)),

  // 1. 漢朝的小男孩孔融
  '01': svg(sky() + sun(680, 90) + cloud(170, 100) + hills(380) + cnHouse(260, 450, 1.1) + paving(450, '#e6d6b2') +
    blossomTree(60, 450, 0.9) +
    at(500, 560, 1.15, false, kongRong({ pose: 'raise' })) +
    at(620, 560, 1, true, dad()) + at(720, 560, 1, true, mom()) +
    sparkle(450, 330, 0.7)),

  // 2. 五個哥哥、孔融排第六、還有一個弟弟
  '02': svg(courtyard() + bamboo(40, 400, 0.9) + bamboo(770, 400, 0.9) +
    [[90, 1.22, 0], [195, 1.16, 1], [300, 1.1, 2], [405, 1.04, 3], [505, 0.98, 4]]
      .map(([x, s, i]) => at(x, 570, s, false, brother(i, { pose: i % 2 ? 'hips' : 'down' }))).join('') +
    at(605, 570, 0.98, false, kongRong({ pose: 'raise' })) +
    at(705, 570, 0.72, false, babyBro({ pose: 'up' })) +
    sparkle(640, 400, 0.8) + sparkle(570, 380, 0.5)),

  // 3. 爸爸的朋友送來一大籃梨子
  '03': svg(sky() + cloud(500, 90) + hills(380, '#a9d98f', '#8dc775') + cnHouse(170, 440, 0.9) + paving(440, '#e6d6b2') +
    at(400, 570, 1.05, false, friend({ pose: 'hold', item: basket(16, -8, 0.6) })) +
    at(560, 570, 1.05, true, dad({ pose: 'raise' })) +
    at(680, 570, 0.95, true, kongRong({ mood: 'happy' })) +
    at(750, 570, 0.95, true, brother(2)) +
    sparkle(410, 380, 0.6) + sparkle(470, 360, 0.5)),

  // 4. 爸爸說來吃梨子，讓孔融先挑
  '04': svg(cnInterior() +
    at(320, 460, 0.85, false, brother(0)) + at(470, 460, 0.85, false, brother(1)) +
    table(400, 540, 1.1) + basket(400, 455, 1.05) +
    at(140, 570, 1.05, false, dad({ pose: 'point' })) +
    at(620, 575, 1.1, true, kongRong({ mood: 'happy' })) +
    at(720, 575, 0.75, true, babyBro())),

  // 5. 孔融拿起最小的梨子
  '05': svg(cnInterior() + table(330, 540, 1.2) + basket(320, 452, 1.2) +
    pear(190, 448, 1.1) + pear(450, 448, 1.15) +
    at(560, 575, 1.25, true, kongRong({ item: rpItem }, rpArms)) +
    at(700, 575, 0.95, true, brother(3, { mood: 'scared' })) +
    sparkle(600, 320, 0.8)),

  // 6. 爸爸好奇：為什麼拿最小的？
  '06': svg(cnInterior() + table(620, 520, 0.9) + basket(620, 450, 0.85) +
    at(270, 570, 1.15, false, dad({ mood: 'normal' }, [[-26, -88, -36, -45], [26, -88, 16, -104]])) +
    at(450, 570, 1.1, true, kongRong(holdPear(0.55))) +
    thought(460, 290, 170, 100, pear(-36, 30, 1.1) + pear(40, 26, 0.55), -110, 70)),

  // 7. 哥哥比我大，吃大的
  '07': svg(courtyard() + blossomTree(110, 400, 0.85) +
    at(320, 570, 1.1, false, kongRong({ item: pear(-30, -34, 0.55) }, [[-26, -72, -30, -36], [26, -72, 70, -94]])) +
    [[480, 1.05, 0], [590, 1.12, 1], [700, 1.18, 2]].map(([x, s, i]) => at(x, 570, s, true, brother(i, holdPear(0.95)))).join('') +
    hearts(560, 340)),

  // 8. 弟弟比我小，要讓給弟弟
  '08': svg(courtyard() + bamboo(60, 400, 0.9) +
    at(170, 570, 1.05, false, dad({ mood: 'normal', pose: 'point' })) +
    at(390, 570, 1.1, false, kongRong({ item: pear(70, -52, 0.6) }, [[-26, -72, 40, -50], [26, -72, 70, -60]])) +
    at(540, 570, 0.8, true, babyBro({ pose: 'reach' })) +
    at(680, 570, 1.05, true, brother(4)) +
    hearts(470, 380)),

  // 9. 爸爸摸摸孔融的頭：真是懂事的好孩子
  '09': svg(cnInterior() +
    at(290, 570, 1.12, false, dad({ mood: 'happy' }, [[-26, -88, -36, -45], [26, -88, 88, -140]])) +
    at(400, 570, 1.05, false, kongRong({ mood: 'happy', ...holdPear(0.55) })) +
    at(600, 570, 1.05, true, mom({ pose: 'up' })) + at(700, 570, 0.75, true, babyBro({ pose: 'up' })) +
    sparkle(470, 380, 0.9) + sparkle(220, 300, 0.7) + hearts(490, 330)),

  // 10. 大家一起吃梨子：懂得禮讓很棒
  '10': svg(courtyard('#ffd9c9', '#fff2e6') + sun(400, 120, 56) + blossomTree(60, 400, 0.85) + blossomTree(750, 400, 0.85) +
    [[150, 1.12, 0], [250, 1.08, 1], [550, 1.08, 2], [650, 1.12, 3]].map(([x, s, i]) => at(x, 570, s, x > 400, brother(i, holdPear(0.95)))).join('') +
    at(360, 570, 1.08, false, kongRong(holdPear(0.6))) +
    at(450, 570, 0.78, true, babyBro(holdPear(0.6))) +
    hearts(380, 360) + sparkle(250, 280, 0.8) + sparkle(560, 260, 0.7) + grass(80, 590) + grass(720, 590)),
};

writeBook('kong-rong', pages);
