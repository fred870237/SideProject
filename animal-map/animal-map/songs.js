// 英文兒歌：都是傳統兒歌（公有領域），旋律由 app 內建的音樂盒音色演奏，歌詞會跟著亮起來
// 每一行：t = 歌詞（用空白或 - 分音節），n = 音符（音名+八度，:數字 = 拍數，預設 1 拍）
// 音節數和音符數要一樣多
// 伴奏用：key = 調（0 = C 大調，7 = G 大調），meter = 每小節幾拍（預設 2），p = 這一行開頭的弱起拍數

const oldMacDonaldVerse = (animal, s) => [
  { t: 'Old Mac-Don-ald had a farm', n: 'G4 G4 G4 D4 E4 E4 D4:2' },
  { t: 'E-I-E-I-O', n: 'B4 B4 A4 A4 G4:3' },
  { p: 1, t: `And on his farm he had a ${animal}`, n: 'D4 G4 G4 G4 D4 E4 E4 D4:2' },
  { t: 'E-I-E-I-O', n: 'B4 B4 A4 A4 G4:3' },
  { p: 1, t: `With a ${s} ${s} here and a ${s} ${s} there`, n: 'D4:.5 D4:.5 G4 G4 G4:2 D4:.5 D4:.5 G4 G4 G4:2' },
  { t: `Here a ${s}, there a ${s}, ev-ery-where a ${s} ${s}`, n: 'G4:.5 G4:.5 G4 G4:.5 G4:.5 G4 G4:.5 G4:.5 G4:.5 G4:.5 G4 G4' },
  { t: 'Old Mac-Don-ald had a farm', n: 'G4 G4 G4 D4 E4 E4 D4:2' },
  { t: 'E-I-E-I-O', n: 'B4 B4 A4 A4 G4:4' },
];

const SONGS = [
  {
    id: 'abc', icon: '🔤', title: 'The ABC Song', zh: 'ABC 字母歌', bpm: 100,
    lines: [
      { t: 'A B C D E F G', n: 'C4 C4 G4 G4 A4 A4 G4:2' },
      { t: 'H I J K L M N O P', n: 'F4 F4 E4 E4 D4:.5 D4:.5 D4:.5 D4:.5 C4:2' },
      { t: 'Q R S, T U V', n: 'G4 G4 F4:2 E4 E4 D4:2' },
      { t: 'Dou-ble-u, X, Y and Z', n: 'G4 G4 F4 F4 E4 E4 D4:2' },
      { t: 'Now I know my A B Cs', n: 'C4 C4 G4 G4 A4 A4 G4:2' },
      { t: "Next time won't you sing with me", n: 'F4 F4 E4 E4 D4 D4 C4:3' },
    ],
  },
  {
    id: 'twinkle', icon: '⭐', title: 'Twinkle Twinkle Little Star', zh: '小星星', bpm: 92,
    lines: [
      { t: 'Twin-kle, twin-kle, lit-tle star', n: 'C4 C4 G4 G4 A4 A4 G4:2' },
      { t: 'How I won-der what you are', n: 'F4 F4 E4 E4 D4 D4 C4:2' },
      { t: 'Up a-bove the world so high', n: 'G4 G4 F4 F4 E4 E4 D4:2' },
      { t: 'Like a dia-mond in the sky', n: 'G4 G4 F4 F4 E4 E4 D4:2' },
      { t: 'Twin-kle, twin-kle, lit-tle star', n: 'C4 C4 G4 G4 A4 A4 G4:2' },
      { t: 'How I won-der what you are', n: 'F4 F4 E4 E4 D4 D4 C4:3' },
    ],
  },
  {
    id: 'old-macdonald', icon: '🐮', title: 'Old MacDonald Had a Farm', zh: '王老先生有塊地', bpm: 132, key: 7,
    lines: [...oldMacDonaldVerse('cow', 'moo'), ...oldMacDonaldVerse('duck', 'quack'), ...oldMacDonaldVerse('pig', 'oink')],
  },
  {
    id: 'mary', icon: '🐑', title: 'Mary Had a Little Lamb', zh: '瑪莉有隻小綿羊', bpm: 112,
    lines: [
      { t: 'Ma-ry had a lit-tle lamb', n: 'E4 D4 C4 D4 E4 E4 E4:2' },
      { t: 'lit-tle lamb, lit-tle lamb', n: 'D4 D4 D4:2 E4 G4 G4:2' },
      { t: 'Ma-ry had a lit-tle lamb, its', n: 'E4 D4 C4 D4 E4 E4 E4 E4' },
      { t: 'fleece was white as snow', n: 'D4 D4 E4 D4 C4:4' },
    ],
  },
  {
    id: 'row', icon: '🚣', title: 'Row, Row, Row Your Boat', zh: '划船歌', bpm: 150, meter: 3,
    lines: [
      { t: 'Row, row, row your boat', n: 'C4:1.5 C4:1.5 C4 D4:.5 E4:1.5' },
      { t: 'Gent-ly down the stream', n: 'E4 D4:.5 E4 F4:.5 G4:3' },
      { t: 'Mer-ri-ly, mer-ri-ly, mer-ri-ly, mer-ri-ly', n: 'C5:.5 C5:.5 C5:.5 G4:.5 G4:.5 G4:.5 E4:.5 E4:.5 E4:.5 C4:.5 C4:.5 C4:.5' },
      { t: 'Life is but a dream', n: 'G4 F4:.5 E4 D4:.5 C4:3' },
    ],
  },
  {
    id: 'baa-baa', icon: '🐏', title: 'Baa, Baa, Black Sheep', zh: '咩咩黑羊', bpm: 100,
    lines: [
      { t: 'Baa, baa, black sheep, have you an-y wool?', n: 'C4 C4 G4 G4 A4:.5 A4:.5 A4:.5 A4:.5 G4:2' },
      { t: 'Yes sir, yes sir, three bags full', n: 'F4 F4 E4 E4 D4 D4 C4:2' },
      { t: 'One for the mas-ter, and one for the dame', n: 'G4 G4:.5 G4:.5 F4 F4 E4:.5 E4:.5 E4:.5 E4:.5 D4:2' },
      { t: 'And one for the lit-tle boy who lives down the lane', n: 'G4:.5 G4:.5 G4:.5 G4:.5 F4:.5 F4:.5 F4 E4:.5 E4:.5 E4:.5 E4:.5 D4:2' },
      { t: 'Baa, baa, black sheep, have you an-y wool?', n: 'C4 C4 G4 G4 A4:.5 A4:.5 A4:.5 A4:.5 G4:2' },
      { t: 'Yes sir, yes sir, three bags full', n: 'F4 F4 E4 E4 D4 D4 C4:3' },
    ],
  },
  {
    id: 'itsy-bitsy', icon: '🕷️', title: 'The Itsy Bitsy Spider', zh: '小蜘蛛', bpm: 132, meter: 3,
    lines: [
      { p: .5, t: 'The it-sy bit-sy spi-der went up the wa-ter spout', n: 'G4:.5 C5 C5:.5 C5 D5:.5 E5:1.5 E5 E5:.5 D5 C5:.5 D5 E5:.5 C5:1.5' },
      { t: 'Down came the rain and washed the spi-der out', n: 'E5:1.5 E5 F5:.5 G5:1.5 G5 F5:.5 E5 F5:.5 G5 E5:2' },
      { t: 'Out came the sun and dried up all the rain', n: 'C5:1.5 C5 D5:.5 E5:1.5 E5 D5:.5 C5 D5:.5 E5 C5:2' },
      { p: 1, t: 'And the it-sy bit-sy spi-der went up the spout a-gain', n: 'G4:.5 G4:.5 C5 C5:.5 C5 D5:.5 E5:1.5 E5 E5:.5 D5 C5:.5 D5 E5:.5 C5:3' },
    ],
  },
  {
    id: 'london-bridge', icon: '🌉', title: 'London Bridge Is Falling Down', zh: '倫敦鐵橋垮下來', bpm: 112,
    lines: [
      { t: 'Lon-don Bridge is fall-ing down', n: 'G4:1.5 A4:.5 G4 F4 E4 F4 G4:2' },
      { t: 'fall-ing down, fall-ing down', n: 'D4 E4 F4:2 E4 F4 G4:2' },
      { t: 'Lon-don Bridge is fall-ing down', n: 'G4:1.5 A4:.5 G4 F4 E4 F4 G4:2' },
      { t: 'my fair la-dy', n: 'D4:2 G4:2 E4 C4:4' },
    ],
  },
];
