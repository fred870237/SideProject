'use strict';

// 預先生成的語音（audio/voice/<語言>/<名稱>.mp3，清單在 voices.js 的 VOICE_CLIPS）
// 英文用開源的 Qwen3-TTS 生成（跟機關書是同一個旁白聲音），中文用 BreezyVoice；工具在 tools/voice/（不會部署）
// 每一頁原本用系統語音唸的地方，先問這裡有沒有音檔：有就播音檔，沒有就照舊用系統語音
const VoiceClips = (() => {
  // 先關掉的語言：中文的 AI 語音有一些開頭有雜音或拖太長，重新生成之前先全部改用系統語音（音檔和清單都留著）
  // 重新生成好以後，把 'zh' 拿掉就會恢復（sw.js 也有一份一樣的清單）
  const OFF = new Set(['zh']);
  const have = {};
  if (typeof VOICE_CLIPS !== 'undefined') {
    for (const [lang, list] of Object.entries(VOICE_CLIPS)) if (!OFF.has(lang)) have[lang] = new Set(list);
  }
  // 檔名規則：英文跟 tools/voice/voice.py 的 slug() 一樣（小寫、非英數字換成 -）；
  // 中文跟 breezy.py 的 key() 一樣（去掉標點和空白，只留文字和數字）
  const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const key = (t) => t.replace(/[^\p{L}\p{N}]+/gu, '').toLowerCase();
  // text：要唸的句子；lang：'en'、'en-US'、'zh-TW' 這類語言代碼
  function url(text, lang) {
    if (typeof text !== 'string' || !lang) return null;
    const l = lang.slice(0, 2).toLowerCase();
    const s = l === 'en' ? slug(text) : key(text);
    return have[l] && have[l].has(s) ? `audio/voice/${l}/${encodeURIComponent(s)}.mp3` : null;
  }
  // 給按鈕名字（voice-ui.js）、貼紙小鎮這類「唸了就好、不用等唸完」的地方：有音檔就播，回傳 true
  const el = new Audio();
  function play(text, lang) {
    const u = url(text, lang);
    if (!u) return false;
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    el.src = u;
    el.play().catch(() => {});
    return true;
  }
  // 按鈕名字的音檔還在播嗎（換頁前要等它唸完）
  const busy = () => !!el.src && !el.paused && !el.ended;
  return { url, play, busy };
})();
