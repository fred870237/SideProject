// 五十音資料：[羅馬拼音, 平假名, 片假名]，「・」代表空格
const KANA_ROWS = [
  [['a', 'i', 'u', 'e', 'o'], 'あいうえお', 'アイウエオ'],
  [['ka', 'ki', 'ku', 'ke', 'ko'], 'かきくけこ', 'カキクケコ'],
  [['sa', 'shi', 'su', 'se', 'so'], 'さしすせそ', 'サシスセソ'],
  [['ta', 'chi', 'tsu', 'te', 'to'], 'たちつてと', 'タチツテト'],
  [['na', 'ni', 'nu', 'ne', 'no'], 'なにぬねの', 'ナニヌネノ'],
  [['ha', 'hi', 'fu', 'he', 'ho'], 'はひふへほ', 'ハヒフヘホ'],
  [['ma', 'mi', 'mu', 'me', 'mo'], 'まみむめも', 'マミムメモ'],
  [['ya', '', 'yu', '', 'yo'], 'や・ゆ・よ', 'ヤ・ユ・ヨ'],
  [['ra', 'ri', 'ru', 're', 'ro'], 'らりるれろ', 'ラリルレロ'],
  [['wa', '', '', '', 'wo'], 'わ・・・を', 'ワ・・・ヲ'],
  [['n', '', '', '', ''], 'ん・・・・', 'ン・・・・'],
];

const DAKUTEN_ROWS = [
  [['ga', 'gi', 'gu', 'ge', 'go'], 'がぎぐげご', 'ガギグゲゴ'],
  [['za', 'ji', 'zu', 'ze', 'zo'], 'ざじずぜぞ', 'ザジズゼゾ'],
  [['da', 'ji', 'zu', 'de', 'do'], 'だぢづでど', 'ダヂヅデド'],
  [['ba', 'bi', 'bu', 'be', 'bo'], 'ばびぶべぼ', 'バビブベボ'],
  [['pa', 'pi', 'pu', 'pe', 'po'], 'ぱぴぷぺぽ', 'パピプペポ'],
];

function buildKana(rows) {
  return rows.map(([ro, hi, ka]) => {
    const h = [...hi], k = [...ka];
    return ro.map((r, i) => (r ? { r, hira: h[i], kata: k[i] } : null));
  });
}

const KANA = { basic: buildKana(KANA_ROWS), dakuten: buildKana(DAKUTEN_ROWS) };

// 單字：e=圖示, jp=日文, ro=羅馬拼音, zh=中文
const VOCAB = [
  {
    id: 'animals', name: '動物', icon: '🐶', words: [
      { e: '🐶', jp: 'いぬ', ro: 'inu', zh: '狗' },
      { e: '🐱', jp: 'ねこ', ro: 'neko', zh: '貓' },
      { e: '🐰', jp: 'うさぎ', ro: 'usagi', zh: '兔子' },
      { e: '🐻', jp: 'くま', ro: 'kuma', zh: '熊' },
      { e: '🐘', jp: 'ぞう', ro: 'zou', zh: '大象' },
      { e: '🐟', jp: 'さかな', ro: 'sakana', zh: '魚' },
      { e: '🐦', jp: 'とり', ro: 'tori', zh: '鳥' },
      { e: '🐒', jp: 'さる', ro: 'saru', zh: '猴子' },
      { e: '🐼', jp: 'パンダ', ro: 'panda', zh: '熊貓' },
      { e: '🦁', jp: 'ライオン', ro: 'raion', zh: '獅子' },
    ],
  },
  {
    id: 'food', name: '食物', icon: '🍎', words: [
      { e: '🍎', jp: 'りんご', ro: 'ringo', zh: '蘋果' },
      { e: '🍌', jp: 'バナナ', ro: 'banana', zh: '香蕉' },
      { e: '🍓', jp: 'いちご', ro: 'ichigo', zh: '草莓' },
      { e: '🍉', jp: 'すいか', ro: 'suika', zh: '西瓜' },
      { e: '🍙', jp: 'おにぎり', ro: 'onigiri', zh: '飯糰' },
      { e: '🍣', jp: 'すし', ro: 'sushi', zh: '壽司' },
      { e: '🍞', jp: 'パン', ro: 'pan', zh: '麵包' },
      { e: '🥚', jp: 'たまご', ro: 'tamago', zh: '蛋' },
      { e: '🥛', jp: 'ぎゅうにゅう', ro: 'gyuunyuu', zh: '牛奶' },
      { e: '🍰', jp: 'ケーキ', ro: 'keeki', zh: '蛋糕' },
    ],
  },
  {
    id: 'colors', name: '顏色', icon: '🎨', words: [
      { e: '🔴', jp: 'あか', ro: 'aka', zh: '紅色' },
      { e: '🔵', jp: 'あお', ro: 'ao', zh: '藍色' },
      { e: '🟡', jp: 'きいろ', ro: 'kiiro', zh: '黃色' },
      { e: '🟢', jp: 'みどり', ro: 'midori', zh: '綠色' },
      { e: '⚪', jp: 'しろ', ro: 'shiro', zh: '白色' },
      { e: '⚫', jp: 'くろ', ro: 'kuro', zh: '黑色' },
      { e: '🟣', jp: 'むらさき', ro: 'murasaki', zh: '紫色' },
      { e: '🟠', jp: 'オレンジ', ro: 'orenji', zh: '橘色' },
      { e: '💗', jp: 'ピンク', ro: 'pinku', zh: '粉紅色' },
    ],
  },
  {
    id: 'numbers', name: '數字', icon: '🔢', words: [
      { e: '1️⃣', jp: 'いち', ro: 'ichi', zh: '一' },
      { e: '2️⃣', jp: 'に', ro: 'ni', zh: '二' },
      { e: '3️⃣', jp: 'さん', ro: 'san', zh: '三' },
      { e: '4️⃣', jp: 'よん', ro: 'yon', zh: '四' },
      { e: '5️⃣', jp: 'ご', ro: 'go', zh: '五' },
      { e: '6️⃣', jp: 'ろく', ro: 'roku', zh: '六' },
      { e: '7️⃣', jp: 'なな', ro: 'nana', zh: '七' },
      { e: '8️⃣', jp: 'はち', ro: 'hachi', zh: '八' },
      { e: '9️⃣', jp: 'きゅう', ro: 'kyuu', zh: '九' },
      { e: '🔟', jp: 'じゅう', ro: 'juu', zh: '十' },
    ],
  },
  {
    id: 'family', name: '家人', icon: '👨‍👩‍👧', words: [
      { e: '👨', jp: 'おとうさん', ro: 'otousan', zh: '爸爸' },
      { e: '👩', jp: 'おかあさん', ro: 'okaasan', zh: '媽媽' },
      { e: '👦', jp: 'おにいさん', ro: 'oniisan', zh: '哥哥' },
      { e: '👧', jp: 'おねえさん', ro: 'oneesan', zh: '姊姊' },
      { e: '👴', jp: 'おじいさん', ro: 'ojiisan', zh: '爺爺' },
      { e: '👵', jp: 'おばあさん', ro: 'obaasan', zh: '奶奶' },
      { e: '👶', jp: 'あかちゃん', ro: 'akachan', zh: '小寶寶' },
      { e: '🙋', jp: 'わたし', ro: 'watashi', zh: '我' },
    ],
  },
  {
    id: 'greetings', name: '打招呼', icon: '👋', words: [
      { e: '🌅', jp: 'おはよう', ro: 'ohayou', zh: '早安' },
      { e: '☀️', jp: 'こんにちは', ro: 'konnichiwa', zh: '你好' },
      { e: '🌙', jp: 'こんばんは', ro: 'konbanwa', zh: '晚上好' },
      { e: '😴', jp: 'おやすみ', ro: 'oyasumi', zh: '晚安' },
      { e: '🙏', jp: 'ありがとう', ro: 'arigatou', zh: '謝謝' },
      { e: '🙇', jp: 'ごめんなさい', ro: 'gomennasai', zh: '對不起' },
      { e: '👋', jp: 'さようなら', ro: 'sayounara', zh: '再見' },
      { e: '🍽️', jp: 'いただきます', ro: 'itadakimasu', zh: '開動了' },
    ],
  },
];
