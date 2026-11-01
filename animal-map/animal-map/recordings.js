// 家長錄音：和地圖用同一個 IndexedDB（animal-map / rec），key 的寫法：
//   lion_tw   台語名字（地圖的卡片會用）
//   zy_ㄅ     注音符號的音（注音探險、描字會用）
//   abc_A     英文字母的發音 /æ/（字母探險、描字會用）
//   lion_sound 爸爸媽媽學的叫聲（地圖卡片的 🔊 叫聲會優先用）
// 錄音有兩個來源：這台 iPad 上錄的（優先），和放在網站 audio/ 資料夾、列在 audio/recordings.json 的
const Recs = {
  db: null,
  urls: new Map(),   // key -> 可以播放的網址
  local: new Set(),  // 這台 iPad 上錄的
  server: {},        // audio/recordings.json：key -> 網站上的檔案
  open() {
    if (this.db) return Promise.resolve(this.db);
    return new Promise((resolve) => {
      if (!('indexedDB' in window)) return resolve(null);
      const req = indexedDB.open('animal-map', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('rec');
      req.onsuccess = () => { this.db = req.result; resolve(this.db); };
      req.onerror = () => resolve(null);
    });
  },
  // 讀出全部錄音（可以只讀某些開頭或結尾的 key）
  async load(prefixes = null) {
    const want = (key) => !prefixes || prefixes.some((p) => key.startsWith(p) || key.endsWith(p));
    const db = await this.open();
    if (db) {
      await new Promise((resolve) => {
        const cur = db.transaction('rec', 'readonly').objectStore('rec').openCursor();
        cur.onsuccess = () => {
          const c = cur.result;
          if (!c) return resolve();
          const key = String(c.key);
          if (want(key)) {
            this.setUrl(key, new Blob([c.value.buf], { type: c.value.type }));
            this.local.add(key);
          }
          c.continue();
        };
        cur.onerror = () => resolve();
      });
    }
    try {
      const r = await fetch('audio/recordings.json', { cache: 'no-cache' });
      if (r.ok) this.server = await r.json();
    } catch { /* 沒有網路或還沒匯出過 */ }
    Object.entries(this.server).forEach(([key, url]) => { if (want(key) && !this.urls.has(key)) this.urls.set(key, url); });
    return this.urls;
  },
  setUrl(key, blob) {
    const old = this.urls.get(key);
    if (old && old.startsWith('blob:')) URL.revokeObjectURL(old);
    this.urls.set(key, URL.createObjectURL(blob));
  },
  async save(key, blob) {
    const db = await this.open();
    if (!db) throw new Error('no db');
    const buf = await blob.arrayBuffer();
    await new Promise((resolve, reject) => {
      const r = db.transaction('rec', 'readwrite').objectStore('rec').put({ buf, type: blob.type }, key);
      r.onsuccess = resolve;
      r.onerror = () => reject(r.error);
    });
    this.setUrl(key, blob);
    this.local.add(key);
  },
  // 刪掉這台 iPad 上的錄音；網站上有的話就改回用網站上的
  async del(key) {
    const db = await this.open();
    if (db) {
      await new Promise((resolve) => {
        const r = db.transaction('rec', 'readwrite').objectStore('rec').delete(key);
        r.onsuccess = r.onerror = resolve;
      });
    }
    const old = this.urls.get(key);
    if (old && old.startsWith('blob:')) URL.revokeObjectURL(old);
    this.urls.delete(key);
    this.local.delete(key);
    if (this.server[key]) this.urls.set(key, this.server[key]);
  },
  has(key) { return this.urls.has(key); },
  isLocal(key) { return this.local.has(key); },
  url(key) { return this.urls.get(key); },

  // 這台 iPad 錄的全部讀出來：[{ key, blob }]
  async localBlobs() {
    const db = await this.open();
    if (!db) return [];
    return new Promise((resolve) => {
      const out = [];
      const cur = db.transaction('rec', 'readonly').objectStore('rec').openCursor();
      cur.onsuccess = () => {
        const c = cur.result;
        if (!c) return resolve(out);
        out.push({ key: String(c.key), blob: new Blob([c.value.buf], { type: c.value.type }) });
        c.continue();
      };
      cur.onerror = () => resolve(out);
    });
  },
};

// 錄音 key → 網站上的檔名（注音用編號，網址裡就不會有特殊字）
function recPath(key, type) {
  const ext = /mp4|m4a|aac/.test(type) ? 'm4a' : /webm/.test(type) ? 'webm' : /ogg/.test(type) ? 'ogg' : /wav/.test(type) ? 'wav' : 'mp3';
  let m;
  if ((m = /^zy_(.)$/u.exec(key))) return `audio/zy/${m[1].codePointAt(0).toString(16)}.${ext}`;
  if ((m = /^abc_([A-Z])$/.exec(key))) return `audio/abc/${m[1]}.${ext}`;
  if ((m = /^(.+)_sound$/.exec(key))) return `audio/sound/${m[1]}-parent.${ext}`;
  if ((m = /^(.+)_(tw|en|zh)$/.exec(key))) return `audio/${m[2]}/${m[1]}.${ext}`;
  return `audio/other/${encodeURIComponent(key)}.${ext}`;
}

// 簡單的 zip（不壓縮，錄音檔本來就是壓縮過的）
async function makeZip(files) {
  const crcTable = new Uint32Array(256).map((_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc32 = (u8) => {
    let c = 0xffffffff;
    for (let i = 0; i < u8.length; i++) c = crcTable[(c ^ u8[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const enc = new TextEncoder();
  const parts = [], central = [];
  let offset = 0;
  for (const f of files) {
    const name = enc.encode(f.name);
    const data = new Uint8Array(await f.blob.arrayBuffer());
    const crc = crc32(data);
    const head = new DataView(new ArrayBuffer(30));
    head.setUint32(0, 0x04034b50, true);
    head.setUint16(4, 20, true);
    head.setUint16(6, 0x0800, true); // 檔名用 UTF-8
    head.setUint32(14, crc, true);
    head.setUint32(18, data.length, true);
    head.setUint32(22, data.length, true);
    head.setUint16(26, name.length, true);
    parts.push(head, name, data);
    const cd = new DataView(new ArrayBuffer(46));
    cd.setUint32(0, 0x02014b50, true);
    cd.setUint16(4, 20, true);
    cd.setUint16(6, 20, true);
    cd.setUint16(8, 0x0800, true);
    cd.setUint32(16, crc, true);
    cd.setUint32(20, data.length, true);
    cd.setUint32(24, data.length, true);
    cd.setUint16(28, name.length, true);
    cd.setUint32(42, offset, true);
    central.push(cd, name);
    offset += 30 + name.length + data.length;
  }
  const cdSize = central.reduce((n, p) => n + p.byteLength, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, files.length, true);
  end.setUint16(10, files.length, true);
  end.setUint32(12, cdSize, true);
  end.setUint32(16, offset, true);
  return new Blob([...parts, ...central, end], { type: 'application/zip' });
}

// 播一段錄音，播完才 resolve
const recPlayer = new Audio();
function playRec(url) {
  return new Promise((resolve) => {
    const done = () => { recPlayer.onended = recPlayer.onerror = null; resolve(); };
    recPlayer.onended = done;
    recPlayer.onerror = done;
    recPlayer.src = url;
    recPlayer.play().catch(done);
  });
}

// 英文字母的自然發音（給家長錄音時參考）：[字母, 音標, 例字]
const PHONICS = [
  ['A', '/æ/', 'apple'], ['B', '/b/', 'ball'], ['C', '/k/', 'cat'], ['D', '/d/', 'dog'], ['E', '/ɛ/', 'egg'],
  ['F', '/f/', 'fish'], ['G', '/g/', 'goat'], ['H', '/h/', 'hat'], ['I', '/ɪ/', 'igloo'], ['J', '/dʒ/', 'jam'],
  ['K', '/k/', 'kite'], ['L', '/l/', 'lion'], ['M', '/m/', 'moon'], ['N', '/n/', 'nest'], ['O', '/ɒ/', 'octopus'],
  ['P', '/p/', 'pig'], ['Q', '/kw/', 'queen'], ['R', '/r/', 'rabbit'], ['S', '/s/', 'sun'], ['T', '/t/', 'top'],
  ['U', '/ʌ/', 'umbrella'], ['V', '/v/', 'van'], ['W', '/w/', 'web'], ['X', '/ks/', 'box'], ['Y', '/j/', 'yak'], ['Z', '/z/', 'zebra'],
];
