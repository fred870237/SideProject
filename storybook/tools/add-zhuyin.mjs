// 幫每一頁的故事文字產生注音，寫進書的 JSON（page.zhuyin）。
// 用法：
//   node add-zhuyin.mjs            只補還沒有注音、或文字改過的頁面（保留手動修正）
//   node add-zhuyin.mjs --force    全部重新產生
//   node add-zhuyin.mjs --review   列出破音字的讀音，方便人工檢查
//
// 有 text 的地方都會加 zhuyin：故事頁、小問答的題目和選項、親子討論題。
// zhuyin 是用空白分隔的注音，順序對應 text 裡的每一個漢字（標點不算）。
// 自動判斷的讀音不一定對：可以直接改 JSON 裡的 zhuyin，或在下面的 RULES 加規則。

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pinyin } from 'pinyin-pro';
import OpenCC from 'opencc-js';

const BOOKS = join(dirname(fileURLToPath(import.meta.url)), '../public/books');
const force = process.argv.includes('--force');
const review = process.argv.includes('--review');

// 破音字與台灣讀音規則：依前一字 p、後一字 n 決定讀音（數字聲調，0 = 輕聲）。
// 回傳 undefined 就用 pinyin-pro 的判斷。開頭、結尾的前後字是空白（避免 ''.includes 永遠成立）。
const RULES = {
  長: (p, n) => '越成'.includes(p) || '得大出成高不到都'.includes(n) ? 'zhang3' : 'chang2',
  得: (p, n) => n === '意' || (n === '到' && !'看找聽買拿抓'.includes(p)) || p === '不' ? 'de2' : 'de0',
  地: (p, n) => n === '方' || '大各土草田天陸'.includes(p) ? 'di4' : 'de0',
  了: (p, n) => p === '不' || n === '不' ? 'liao3' : 'le0',
  好: (p, n) => n === '奇' ? 'hao4' : 'hao3',
  只: () => 'zhi3', // 繁體的量詞寫「隻」，「只」一定念 ㄓˇ
  教: (p, n) => '他我你妳'.includes(n) ? 'jiao1' : 'jiao4',
  背: (p, n) => '著大起'.includes(n) ? 'bei1' : 'bei4',
  倒: (p, n) => n === '影' || p === '一' ? 'dao4' : 'dao3',
  種: (p, n) => '子類'.includes(n) ? 'zhong3' : 'zhong4',
  還: (p, n) => '給回錢'.includes(n) ? 'huan2' : 'hai2',
  行: (p) => p === '排' ? 'hang2' : undefined,
  當: (p, n) => '作帽成釦眼薑橋'.includes(n) ? 'dang4' : 'dang1',
  重: (p, n) => '新複來疊'.includes(n) || '雙重'.includes(p) ? 'chong2' : 'zhong4',
  傍: (p, n) => n === '晚' ? 'bang1' : undefined,
  磨: (p, n) => '成麵粉豆坊'.includes(n) ? 'mo4' : undefined,
  為: (p) => '成以作認'.includes(p) ? 'wei2' : undefined,
  載: (p) => '記刊登轉'.includes(p) ? 'zai3' : 'zai4',
  // 詞尾的「子」念輕聲（桃子、村子）；王子、妻子、種子這類才念 ㄗˇ
  子: (p, n) => '王妻太孔君男女弟原電種'.includes(p) || '孫女'.includes(n) ? 'zi3' : 'zi0',
  頭: (p) => '斧磚石指拳木骨舌饅枕鋤罐'.includes(p) ? 'tou0' : undefined,
  姊: () => 'jie3',
  嘩: () => 'hua1',
  誰: () => 'shei2',
  和: (p, n) => n === '尚' ? undefined : 'he2',
};

const t2s = OpenCC.Converter({ from: 'tw', to: 'cn' });
const HAN = /\p{Script=Han}/u;

// ---------- 拼音 → 注音 ----------
const INITIALS = {
  b: 'ㄅ', p: 'ㄆ', m: 'ㄇ', f: 'ㄈ', d: 'ㄉ', t: 'ㄊ', n: 'ㄋ', l: 'ㄌ',
  g: 'ㄍ', k: 'ㄎ', h: 'ㄏ', j: 'ㄐ', q: 'ㄑ', x: 'ㄒ',
  zh: 'ㄓ', ch: 'ㄔ', sh: 'ㄕ', r: 'ㄖ', z: 'ㄗ', c: 'ㄘ', s: 'ㄙ',
};
const FINALS = {
  a: 'ㄚ', o: 'ㄛ', e: 'ㄜ', ê: 'ㄝ', ai: 'ㄞ', ei: 'ㄟ', ao: 'ㄠ', ou: 'ㄡ',
  an: 'ㄢ', en: 'ㄣ', ang: 'ㄤ', eng: 'ㄥ', er: 'ㄦ', ong: 'ㄨㄥ',
  i: 'ㄧ', ia: 'ㄧㄚ', io: 'ㄧㄛ', ie: 'ㄧㄝ', iai: 'ㄧㄞ', iao: 'ㄧㄠ', iou: 'ㄧㄡ',
  ian: 'ㄧㄢ', in: 'ㄧㄣ', iang: 'ㄧㄤ', ing: 'ㄧㄥ', iong: 'ㄩㄥ',
  u: 'ㄨ', ua: 'ㄨㄚ', uo: 'ㄨㄛ', uai: 'ㄨㄞ', uei: 'ㄨㄟ', uan: 'ㄨㄢ', uen: 'ㄨㄣ',
  uang: 'ㄨㄤ', ueng: 'ㄨㄥ',
  ü: 'ㄩ', üe: 'ㄩㄝ', üan: 'ㄩㄢ', ün: 'ㄩㄣ',
};
const TONES = ['˙', '', 'ˊ', 'ˇ', 'ˋ', '˙'];

function toZhuyin(py) {
  let [, syl, tone] = py.toLowerCase().replace(/v/g, 'ü').match(/^([a-zü]+)(\d)?$/) || [];
  if (!syl) return null;
  tone = Number(tone ?? 5);

  // y / w 開頭的音節還原成 i / u / ü
  if (syl.startsWith('yu')) syl = 'ü' + syl.slice(2);
  else if (/^yi/.test(syl)) syl = syl.slice(1);
  else if (syl.startsWith('y')) syl = 'i' + syl.slice(1);
  else if (syl.startsWith('wu')) syl = syl.slice(1);
  else if (syl.startsWith('w')) syl = 'u' + syl.slice(1);

  const ini = /^(zh|ch|sh|[bpmfdtnlgkhjqxrzcs])/.exec(syl)?.[1] || '';
  let fin = syl.slice(ini.length);
  if ('jqx'.includes(ini) && ini && fin.startsWith('u')) fin = 'ü' + fin.slice(1);
  if (fin === 'iu') fin = 'iou';
  if (fin === 'ui') fin = 'uei';
  if (fin === 'un') fin = 'uen';
  if (fin === 'ue' && ini) fin = 'üe'; // lüe, nüe
  if (fin === 'i' && /^(zh|ch|sh|r|z|c|s)$/.test(ini)) fin = '';

  const body = (INITIALS[ini] || '') + (fin ? FINALS[fin] ?? '?' : '');
  if (body.includes('?')) return null;
  return tone === 0 || tone === 5 ? '˙' + body : body + TONES[tone];
}

function zhuyinFor(text) {
  const simp = t2s(text);
  const chars = [...text];
  // 繁轉簡應該是一字對一字，萬一長度不同就改用原文
  const src = [...simp].length === chars.length ? simp : text;
  const pys = pinyin(src, { toneType: 'num', type: 'array', toneSandhi: false });
  const out = [];
  chars.forEach((ch, i) => {
    if (!HAN.test(ch)) return;
    const py = RULES[ch]?.(chars[i - 1] ?? ' ', chars[i + 1] ?? ' ') ?? pys[i];
    out.push(toZhuyin(py) ?? '?');
  });
  return out.join(' ');
}

const countHan = (text) => [...text].filter((c) => HAN.test(c)).length;

// 一本書裡所有要加注音的文字
const textItems = (book) => [
  ...book.pages,
  ...(book.quiz ?? []).flatMap((q) => [q, ...q.options]),
  ...(book.talk ?? []),
].filter((item) => item.text);

// ---------- 主程式 ----------
const POLY = new Set([...'長得還著了地的好教只背倒重行樂少中為乾看朝傳差調空種藏處便當數相將干分降興應']);
let changed = 0;
for (const file of readdirSync(BOOKS).filter((f) => f.endsWith('.json') && f !== 'index.json')) {
  const path = join(BOOKS, file);
  const book = JSON.parse(readFileSync(path, 'utf8'));
  let dirty = false;
  for (const page of textItems(book)) {
    const stale = !page.zhuyin || page.zhuyin.split(' ').length !== countHan(page.text);
    if (force || stale) {
      page.zhuyin = zhuyinFor(page.text);
      dirty = true;
    }
    if (review) {
      const zy = page.zhuyin.split(' ');
      [...page.text].filter((c) => HAN.test(c)).forEach((c, i, all) => {
        if (POLY.has(c)) console.log(`${file}\t${all.slice(Math.max(0, i - 2), i + 3).join('')}\t${c}=${zy[i]}`);
      });
    }
  }
  if (dirty) {
    writeFileSync(path, JSON.stringify(book, null, 2) + '\n');
    changed++;
  }
}
if (!review) console.log(`更新了 ${changed} 本書`);
