// 把 public/books/<id>/ 裡畫好的插畫接到書的資料：
//   cover.svg → 書的 coverImage（也寫進 index.json，書架才會顯示）
//   01.svg、02.svg… → pages[i].image
// 用法：node tools/scenes/link-images.mjs
// 插畫張數和頁數對不上的書會略過並列出來，不會只接一半。

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const BOOKS = join(dirname(fileURLToPath(import.meta.url)), '../../public/books');
const indexPath = join(BOOKS, 'index.json');
const index = JSON.parse(readFileSync(indexPath, 'utf8'));
let indexText = readFileSync(indexPath, 'utf8');
const linked = [], skipped = [];

for (const { id } of index.books) {
  const dir = join(BOOKS, id);
  if (!existsSync(join(dir, 'cover.svg'))) continue;
  const path = join(BOOKS, id + '.json');
  const book = JSON.parse(readFileSync(path, 'utf8'));
  const names = book.pages.map((_, i) => String(i + 1).padStart(2, '0') + '.svg');
  const missing = names.filter((n) => !existsSync(join(dir, n)));
  if (missing.length || existsSync(join(dir, String(book.pages.length + 1).padStart(2, '0') + '.svg'))) {
    skipped.push(`${id}（缺 ${missing.join('、') || '無'}，或插畫比頁數多）`);
    continue;
  }

  // 書的 JSON：coverImage 放在 color 後面，image 放在每頁 bg 後面，維持欄位順序好讀
  const out = {};
  for (const [k, v] of Object.entries(book)) {
    if (k === 'coverImage') continue;
    out[k] = v;
    if (k === 'color') out.coverImage = `books/${id}/cover.svg`;
  }
  out.pages = book.pages.map((p, i) => {
    const { image, ...rest } = p;
    const page = {};
    for (const [k, v] of Object.entries(rest)) {
      page[k] = v;
      if (k === 'bg') page.image = `books/${id}/${names[i]}`;
    }
    page.image ??= `books/${id}/${names[i]}`;
    return page;
  });
  writeFileSync(path, JSON.stringify(out, null, 2) + '\n');

  // index.json 每本書一行，直接改那一行，保留原本的排版
  indexText = indexText.replace(new RegExp(`(\\{ "id": "${id}",[^\\n]*?)(, "coverImage": "[^"]*")? \\}`),
    `$1, "coverImage": "books/${id}/cover.svg" }`);
  linked.push(id);
}

writeFileSync(indexPath, indexText);
JSON.parse(indexText); // 確認沒改壞
console.log(`接好了 ${linked.length} 本：${linked.join('、')}`);
if (skipped.length) console.log(`略過：\n  ${skipped.join('\n  ')}`);
