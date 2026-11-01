// 🎙️ 家長錄音室：台語名字、注音符號、英文字母發音，一個接一個錄
const $ = (id) => document.getElementById(id);

const params = new URLSearchParams(location.search);
if (params.get('from') === 'city') $('backBtn').href = 'city.html';

const TABS = {
  tw: {
    label: '台語名字',
    tip: '用台語唸出名字，唸慢一點、清楚一點',
    items: [...ANIMALS, ...VEHICLES].filter((a) => ART[a.id]).map((a) => ({
      key: `${a.id}_tw`, art: a.id, title: a.tw, sub: `${a.twRom}　（${a.zh}）`, chip: a.zh,
    })),
  },
  zy: {
    label: '注音符號',
    tip: '唸出這個注音的音，短短的就好（像老師教的 ㄅ、ㄆ、ㄇ）',
    items: ZY_SYMBOLS.map((S) => ({ key: `zy_${S}`, symbol: S, title: S, sub: `像「${ZY_SOUND[S]}」的音`, chip: S })),
  },
  sound: {
    label: '叫聲',
    tip: '學動物叫、學車子的聲音！小朋友最愛聽爸爸媽媽學的，錄了就會取代原本的聲音',
    items: [...ANIMALS, ...VEHICLES].filter((a) => ART[a.id]).map((a) => ({
      key: `${a.id}_sound`, art: a.id, title: `${a.zh}的聲音`,
      sub: SOUND_FILES[a.id] ? '目前：🔊 真實叫聲' : Synth.has(a.id) ? '目前：🎹 電腦合成的聲音' : `目前：💡 ${SOUND_FACTS[a.id] || '沒有聲音'}`,
      chip: a.zh,
    })),
  },
  region: {
    label: '環島台語',
    tip: '用台語唸車站和名產的名字，台灣環島會播放你的錄音',
    items: Object.values(window.REGIONS || {}).flatMap((R) => R.stops.flatMap((st) => [
      { key: `${st.id}_tw`, symbol: '🚉', title: st.tw, sub: `${st.twRom}　（${st.zh}）`, chip: `🚉${st.zh}` },
      ...st.items.map((it) => ({ key: `${it.id}_tw`, art: it.art, symbol: it.emoji, title: it.tw, sub: `${it.twRom}　（${it.zh}）`, chip: it.zh })),
    ])),
  },
  abc: {
    label: '字母發音',
    tip: '只唸字母的「音」，不是字母的名字，例如 A 唸 /æ/（像 apple 的第一個音）',
    items: PHONICS.map(([L, ipa, word]) => ({
      key: `abc_${L}`, symbol: L, title: `${L}　${ipa}`, sub: `像 ${word} 的第一個音`, chip: L,
    })),
  },
};

let tabKey = params.get('tab') && TABS[params.get('tab')] ? params.get('tab') : 'tw';
let index = 0;

/* ---------- 畫面 ---------- */

function buildTabs() {
  const nav = $('tabs');
  nav.innerHTML = '';
  Object.entries(TABS).forEach(([key, tab]) => {
    const done = tab.items.filter((it) => Recs.has(it.key)).length;
    const b = document.createElement('button');
    b.className = 'tab' + (key === tabKey ? ' on' : '');
    b.innerHTML = `${tab.label}<small>${done} / ${tab.items.length}</small>`;
    b.addEventListener('click', () => { stopRecording(); tabKey = key; index = firstMissing(0); render(); });
    nav.append(b);
  });
}

function buildList() {
  const box = $('list');
  box.innerHTML = '';
  TABS[tabKey].items.forEach((it, i) => {
    const b = document.createElement('button');
    // ✅ 這台 iPad 錄的；📁 網站上已經有的（之前匯出、上傳過）
    const mark = Recs.isLocal(it.key) ? '✅ ' : Recs.has(it.key) ? '📁 ' : '';
    b.className = 'chip' + (Recs.has(it.key) ? ' done' : '') + (i === index ? ' on' : '') + (it.symbol ? ' sym' : '');
    b.innerHTML = `${mark}${it.chip}`;
    b.addEventListener('click', () => { stopRecording(); index = i; render(); });
    box.append(b);
  });
  box.querySelector('.chip.on')?.scrollIntoView({ block: 'nearest' });
}

function renderFocus() {
  const tab = TABS[tabKey], it = tab.items[index];
  $('focusArt').innerHTML = it.art
    ? `<svg viewBox="-50 -50 100 100">${ART[it.art]()}</svg>`
    : `<span class="sym">${it.symbol}</span>`;
  $('focusTitle').textContent = it.title;
  $('focusSub').textContent = it.sub;
  $('focusTip').textContent = `💡 ${tab.tip}`;
  const has = Recs.has(it.key);
  $('playBtn').disabled = !has;
  $('delBtn').disabled = !Recs.isLocal(it.key);
  $('recBtn').classList.toggle('has', has);
  $('recLabel').textContent = rec ? '錄好了，按一下停止' : has ? '🔁 重錄' : '按一下開始錄音';
}

function render() {
  buildTabs();
  buildList();
  renderFocus();
}

const firstMissing = (from) => {
  const items = TABS[tabKey].items;
  for (let k = 0; k < items.length; k++) {
    const i = (from + k) % items.length;
    if (!Recs.has(items[i].key)) return i;
  }
  return from % items.length;
};

let toastTimer;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 2600);
}

/* ---------- 錄音 ---------- */

let rec = null; // { mr, stream, timer, raf }

async function startRecording() {
  if (!navigator.mediaDevices || !window.MediaRecorder) { toast('這個瀏覽器不能錄音（網址要是 https）'); return; }
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    toast('沒有麥克風權限，請到「設定 → Safari → 麥克風」允許');
    return;
  }
  const type = ['audio/mp4', 'audio/webm', 'audio/ogg'].find((t) => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t));
  const mr = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
  const chunks = [];
  const key = TABS[tabKey].items[index].key;
  mr.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
  mr.onstop = async () => {
    stream.getTracks().forEach((t) => t.stop());
    if (!chunks.length) return;
    const blob = new Blob(chunks, { type: mr.mimeType || type || 'audio/mp4' });
    try {
      await Recs.save(key, blob);
    } catch {
      toast('儲存失敗，空間可能不足');
      return;
    }
    render();
    await playRec(Recs.url(key)); // 錄完馬上播一次給家長聽
  };
  mr.start();
  rec = { mr, stream, timer: setTimeout(stopRecording, 6000) }; // 最長 6 秒
  watchLevel(stream);
  $('recBtn').classList.add('recording');
  renderFocus();
}

function stopRecording() {
  if (!rec) return;
  clearTimeout(rec.timer);
  cancelAnimationFrame(rec.raf);
  const { mr } = rec;
  rec = null;
  $('recBtn').classList.remove('recording');
  $('meter').style.width = '0';
  if (mr.state !== 'inactive') mr.stop();
  renderFocus();
}

// 音量條：讓家長看到有收到聲音
function watchLevel(stream) {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  const ac = new AC();
  const an = ac.createAnalyser();
  an.fftSize = 512;
  ac.createMediaStreamSource(stream).connect(an);
  const data = new Uint8Array(an.fftSize);
  const tick = () => {
    if (!rec) { ac.close(); return; }
    an.getByteTimeDomainData(data);
    let peak = 0;
    for (const v of data) peak = Math.max(peak, Math.abs(v - 128));
    $('meter').style.width = `${Math.min(100, (peak / 128) * 160)}%`;
    rec.raf = requestAnimationFrame(tick);
  };
  tick();
}

$('recBtn').addEventListener('click', () => (rec ? stopRecording() : startRecording()));
$('playBtn').addEventListener('click', () => {
  const url = Recs.url(TABS[tabKey].items[index].key);
  if (url) playRec(url);
});
$('delBtn').addEventListener('click', async () => {
  await Recs.del(TABS[tabKey].items[index].key);
  toast('已刪除，會改回系統語音');
  render();
});
$('nextBtn').addEventListener('click', () => {
  stopRecording();
  const items = TABS[tabKey].items;
  if (items.every((it) => Recs.has(it.key))) { toast('🎉 這一頁全部錄好了！'); return; }
  index = firstMissing(index + 1);
  render();
});

/* ---------- 📦 匯出：打包成 zip，放回網站的 audio 資料夾，每台 iPad 都能用 ---------- */

$('exportBtn').addEventListener('click', async () => {
  stopRecording();
  const recs = await Recs.localBlobs();
  if (!recs.length) { toast('這台 iPad 還沒有錄音喔'); return; }
  const list = { ...Recs.server };
  const files = recs.map(({ key, blob }) => {
    const name = recPath(key, blob.type);
    list[key] = name;
    return { name, blob };
  });
  files.push({ name: 'audio/recordings.json', blob: new Blob([JSON.stringify(list, null, 1)], { type: 'application/json' }) });
  const zip = await makeZip(files);
  const d = new Date();
  const fileName = `動物地圖錄音-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}.zip`;
  $('exportSummary').textContent = `共 ${recs.length} 段錄音，檔名「${fileName}」。`;

  // iPad：跳出分享選單（可以存到「檔案」、AirDrop、LINE…）；電腦：直接下載
  const file = new File([zip], fileName, { type: 'application/zip' });
  let shared = false;
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file] }); shared = true; } catch (err) { if (err.name === 'AbortError') return; }
  }
  if (!shared) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(zip);
    a.download = fileName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }
  $('exportDlg').classList.remove('hidden');
});
$('exportClose').addEventListener('click', () => $('exportDlg').classList.add('hidden'));

Recs.load().then(() => { index = firstMissing(0); render(); });

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
