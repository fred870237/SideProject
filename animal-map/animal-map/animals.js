// 動物資料：新增動物只要在這裡加一筆，並在 art/*.js 畫一個同 id 的插圖
// lon / lat 是動物在地圖上的經緯度；pin 代表要畫一條虛線連到真正的產地（台灣的動物用）
// twRom 是台羅拼音；台語用字與拼音為初稿，建議對照教育部《臺灣台語常用詞辭典》確認
const ANIMALS = [
  // 北極
  { id: 'polar-bear', lon: -42,  lat: 74,  place: '北極',   en: 'Polar Bear',  zh: '北極熊', tw: '北極熊', twRom: 'pak-ki̍k-hîm' },
  { id: 'narwhal',    lon: -66,  lat: 75,  place: '北極海', en: 'Narwhal',     zh: '獨角鯨', tw: '獨角鯨', twRom: 'to̍k-kak-kîng' },
  { id: 'walrus',     lon: -4,   lat: 76,  place: '北極海', en: 'Walrus',      zh: '海象',   tw: '海象',   twRom: 'hái-tshiūnn' },
  { id: 'snowy-owl',  lon: -100, lat: 68,  place: '北極',   en: 'Snowy Owl',   zh: '雪鴞',   tw: '雪鴞',   twRom: 'seh-hiâu' },
  { id: 'puffin',     lon: -18,  lat: 64,  place: '冰島',   en: 'Puffin',      zh: '海鸚',   tw: '海鸚',   twRom: 'hái-ing' },

  // 北美洲
  { id: 'eagle',      lon: -150, lat: 64,  place: '北美洲', en: 'Eagle',       zh: '老鷹',   tw: '鷹',     twRom: 'ing' },
  { id: 'moose',      lon: -120, lat: 58,  place: '北美洲', en: 'Moose',       zh: '駝鹿',   tw: '駝鹿',   twRom: 'tô-lo̍k' },
  { id: 'beaver',     lon: -80,  lat: 54,  place: '北美洲', en: 'Beaver',      zh: '河狸',   tw: '海狸',   twRom: 'hái-lî' },
  { id: 'bison',      lon: -105, lat: 45,  place: '北美洲', en: 'Bison',       zh: '野牛',   tw: '野牛',   twRom: 'iá-gû' },
  { id: 'rattlesnake', lon: -112, lat: 33, place: '北美洲', en: 'Rattlesnake', zh: '響尾蛇', tw: '響尾蛇', twRom: 'hiáng-bué-tsuâ' },
  { id: 'raccoon',    lon: -85,  lat: 38,  place: '北美洲', en: 'Raccoon',     zh: '浣熊',   tw: '浣熊',   twRom: 'uán-hîm' },

  // 南美洲
  { id: 'iguana',     lon: -88,  lat: 15,  place: '中美洲', en: 'Green Iguana', zh: '綠鬣蜥', tw: '綠鬣蜥', twRom: 'li̍k-lia̍p-sik' },
  { id: 'toucan',     lon: -72,  lat: 6,   place: '南美洲', en: 'Toucan',      zh: '巨嘴鳥', tw: '大喙鳥', twRom: 'tuā-tshuì-tsiáu' },
  { id: 'parrot',     lon: -51,  lat: 6,   place: '南美洲', en: 'Parrot',      zh: '鸚鵡',   tw: '鸚哥',   twRom: 'ing-ko' },
  { id: 'frog',       lon: -76,  lat: -9,  place: '南美洲', en: 'Poison Dart Frog', zh: '箭毒蛙', tw: '箭毒蛙', twRom: 'tsìnn-to̍k-ue' },
  { id: 'sloth',      lon: -60,  lat: -8,  place: '南美洲', en: 'Sloth',       zh: '樹懶',   tw: '樹懶',   twRom: 'tshiū-lán' },
  { id: 'jaguar',     lon: -40,  lat: -8,  place: '南美洲', en: 'Jaguar',      zh: '美洲豹', tw: '美洲豹', twRom: 'Bí-tsiu-pà' },
  { id: 'anaconda',   lon: -44,  lat: -22, place: '南美洲', en: 'Anaconda',    zh: '森蚺',   tw: '大蟒蛇', twRom: 'tuā-bóng-tsuâ' },
  { id: 'llama',      lon: -68,  lat: -24, place: '南美洲', en: 'Llama',       zh: '羊駝',   tw: '羊駝',   twRom: 'iûnn-tô' },
  { id: 'capybara',   lon: -56,  lat: -33, place: '南美洲', en: 'Capybara',    zh: '水豚',   tw: '水豚',   twRom: 'tsuí-tûn' },
  { id: 'flamingo',   lon: -70,  lat: -46, place: '南美洲', en: 'Flamingo',    zh: '紅鶴',   tw: '紅鶴',   twRom: 'âng-ho̍h' },

  // 歐洲
  { id: 'reindeer',   lon: 25,   lat: 67,  place: '歐洲',   en: 'Reindeer',    zh: '馴鹿',   tw: '馴鹿',   twRom: 'sûn-lo̍k' },
  { id: 'fox',        lon: 0,    lat: 52,  place: '歐洲',   en: 'Fox',         zh: '狐狸',   tw: '狐狸',   twRom: 'hôo-lî' },
  { id: 'hedgehog',   lon: 25,   lat: 50,  place: '歐洲',   en: 'Hedgehog',    zh: '刺蝟',   tw: '刺猬',   twRom: 'tshì-uī' },
  { id: 'rabbit',     lon: -5,   lat: 39,  place: '歐洲',   en: 'Rabbit',      zh: '兔子',   tw: '兔仔',   twRom: 'thòo-á' },

  // 非洲
  { id: 'camel',      lon: 5,    lat: 25,  place: '非洲',   en: 'Camel',       zh: '駱駝',   tw: '駱駝',   twRom: 'lo̍k-tô' },
  { id: 'crocodile',  lon: 32,   lat: 27,  place: '非洲',   en: 'Crocodile',   zh: '鱷魚',   tw: '鱷魚',   twRom: 'kho̍k-hî' },
  { id: 'lion',       lon: -5,   lat: 14,  place: '非洲',   en: 'Lion',        zh: '獅子',   tw: '獅仔',   twRom: 'sai-á' },
  { id: 'cheetah',    lon: 14,   lat: 14,  place: '非洲',   en: 'Cheetah',     zh: '獵豹',   tw: '獵豹',   twRom: 'la̍h-pà' },
  { id: 'giraffe',    lon: 34,   lat: 12,  place: '非洲',   en: 'Giraffe',     zh: '長頸鹿', tw: '長頷鹿', twRom: 'tn̂g-ām-lo̍k' },
  { id: 'gorilla',    lon: 8,    lat: 0,   place: '非洲',   en: 'Gorilla',     zh: '大猩猩', tw: '大猩猩', twRom: 'tuā-sing-sing' },
  { id: 'hippo',      lon: 24,   lat: 0,   place: '非洲',   en: 'Hippo',       zh: '河馬',   tw: '河馬',   twRom: 'hô-bé' },
  { id: 'elephant',   lon: 41,   lat: -4,  place: '非洲',   en: 'Elephant',    zh: '大象',   tw: '象',     twRom: 'tshiūnn' },
  { id: 'rhino',      lon: 30,   lat: -15, place: '非洲',   en: 'Rhino',       zh: '犀牛',   tw: '犀牛',   twRom: 'sai-gû' },
  { id: 'zebra',      lon: 14,   lat: -21, place: '非洲',   en: 'Zebra',       zh: '斑馬',   tw: '斑馬',   twRom: 'pan-bé' },
  { id: 'meerkat',    lon: 26,   lat: -31, place: '非洲',   en: 'Meerkat',     zh: '狐獴',   tw: '狐獴',   twRom: 'hôo-bóng' },
  { id: 'lemur',      lon: 48,   lat: -20, place: '馬達加斯加', en: 'Lemur',   zh: '狐猴',   tw: '狐猴',   twRom: 'hôo-kâu' },

  // 亞洲
  { id: 'squirrel',   lon: 88,   lat: 58,  place: '亞洲',   en: 'Squirrel',    zh: '松鼠',   tw: '膨鼠',   twRom: 'phòng-tshí' },
  { id: 'wolf',       lon: 108,  lat: 64,  place: '亞洲',   en: 'Wolf',        zh: '狼',     tw: '狼',     twRom: 'lông' },
  { id: 'arctic-fox', lon: 135,  lat: 70,  place: '亞洲',   en: 'Arctic Fox',  zh: '北極狐', tw: '北極狐', twRom: 'pak-ki̍k-hôo' },
  { id: 'brown-bear', lon: 160,  lat: 60,  place: '亞洲',   en: 'Brown Bear',  zh: '棕熊',   tw: '棕熊',   twRom: 'tsang-hîm' },
  { id: 'red-crowned-crane', lon: 128, lat: 50, place: '亞洲', en: 'Red-crowned Crane', zh: '丹頂鶴', tw: '丹頂鶴', twRom: 'tan-tíng-ho̍h' },
  { id: 'yak',        lon: 100,  lat: 47,  place: '亞洲',   en: 'Yak',         zh: '犛牛',   tw: '犛牛',   twRom: 'lî-gû' },
  { id: 'snow-leopard', lon: 75, lat: 36,  place: '亞洲',   en: 'Snow Leopard', zh: '雪豹',  tw: '雪豹',   twRom: 'seh-pà' },
  { id: 'panda',      lon: 104,  lat: 32,  place: '亞洲',   en: 'Panda',       zh: '貓熊',   tw: '貓熊',   twRom: 'niau-hîm' },
  { id: 'red-panda',  lon: 90,   lat: 28,  place: '亞洲',   en: 'Red Panda',   zh: '小貓熊', tw: '小貓熊', twRom: 'sió-niau-hîm' },
  { id: 'tiger',      lon: 78,   lat: 16,  place: '亞洲',   en: 'Tiger',       zh: '老虎',   tw: '虎',     twRom: 'hóo' },
  { id: 'peacock',    lon: 100,  lat: 15,  place: '亞洲',   en: 'Peacock',     zh: '孔雀',   tw: '孔雀',   twRom: 'khóng-tshiok' },
  { id: 'orangutan',  lon: 101,  lat: 0,   place: '亞洲',   en: 'Orangutan',   zh: '紅毛猩猩', tw: '紅毛猩猩', twRom: 'âng-mn̂g-sing-sing' },
  { id: 'king-cobra', lon: 117,  lat: -1,  place: '亞洲',   en: 'King Cobra',  zh: '眼鏡王蛇', tw: '飯匙倩', twRom: 'pn̄g-sî-tshìng' },
  { id: 'macaque',    lon: 142,  lat: 43,  place: '日本',   en: 'Snow Monkey', zh: '日本獼猴', tw: '猴山仔', twRom: 'kâu-san-á' },

  // 台灣（放在台灣旁邊的海上，用虛線連到台灣）
  { id: 'formosan-bear', lon: 146, lat: 28, pin: [121, 23.7], place: '台灣', en: 'Formosan Black Bear', zh: '台灣黑熊', tw: '台灣烏熊', twRom: 'Tâi-uân oo-hîm' },
  { id: 'leopard-cat',   lon: 156, lat: 16, pin: [121, 23.7], place: '台灣', en: 'Leopard Cat',          zh: '石虎',     tw: '石虎',     twRom: 'tsio̍h-hóo' },
  { id: 'blue-magpie',   lon: 147, lat: 4,  pin: [121, 23.7], place: '台灣', en: 'Taiwan Blue Magpie',   zh: '台灣藍鵲', tw: '長尾山娘', twRom: 'tn̂g-bué-suann-niû' },

  // 大洋洲
  { id: 'kangaroo',   lon: 134,  lat: -25, place: '澳洲',   en: 'Kangaroo',    zh: '袋鼠',   tw: '袋鼠',   twRom: 'tē-tshí' },
  { id: 'koala',      lon: 151,  lat: -27, place: '澳洲',   en: 'Koala',       zh: '無尾熊', tw: '無尾熊', twRom: 'bô-bué-hîm' },
  { id: 'platypus',   lon: 146,  lat: -41, place: '澳洲',   en: 'Platypus',    zh: '鴨嘴獸', tw: '鴨嘴獸', twRom: 'ah-tshuì-siù' },
  { id: 'sea-turtle', lon: 160,  lat: -12, place: '大洋洲', en: 'Sea Turtle',  zh: '海龜',   tw: '海龜',   twRom: 'hái-ku' },
  { id: 'kiwi',       lon: 172,  lat: -42, place: '紐西蘭', en: 'Kiwi',        zh: '奇異鳥', tw: '奇異鳥', twRom: 'kî-ī-tsiáu' },

  // 海洋 / 南極
  { id: 'whale',      lon: -140, lat: 0,   place: '太平洋', en: 'Whale',       zh: '鯨魚',   tw: '海翁',   twRom: 'hái-ang' },
  { id: 'dolphin',    lon: -45,  lat: 22,  place: '大西洋', en: 'Dolphin',     zh: '海豚',   tw: '海豬',   twRom: 'hái-ti' },
  { id: 'shark',      lon: -25,  lat: -20, place: '大西洋', en: 'Shark',       zh: '鯊魚',   tw: '鯊魚',   twRom: 'sua-hî' },
  { id: 'octopus',    lon: 70,   lat: -32, place: '印度洋', en: 'Octopus',     zh: '章魚',   tw: '章魚',   twRom: 'tsiunn-hî' },
  { id: 'penguin',    lon: -10,  lat: -65, place: '南極',   en: 'Penguin',     zh: '企鵝',   tw: '企鵝',   twRom: 'khì-gô' },
  { id: 'seal',       lon: 60,   lat: -65, place: '南極',   en: 'Seal',        zh: '海豹',   tw: '海豹',   twRom: 'hái-pà' },

  // 後來加的：農場、寵物，還有幾種很有名的動物
  // 地圖上太擠的就放旁邊一點，pin 會畫虛線連到真正的地方
  { id: 'crab',       lon: 108,  lat: -13, place: '聖誕島',     en: 'Crab',        zh: '螃蟹',   tw: '蟳仔',   twRom: 'tsîm-á' },
  { id: 'dog',        lon: 65,   lat: 66,  place: '西伯利亞',   en: 'Dog',         zh: '狗',     tw: '狗',     twRom: 'káu' },
  { id: 'cat',        lon: 18,   lat: 31,  pin: [31, 30],  place: '埃及', en: 'Cat',  zh: '貓',     tw: '貓',     twRom: 'niau' },
  { id: 'cow',        lon: 12,   lat: 45,  place: '瑞士',       en: 'Cow',         zh: '牛',     tw: '牛',     twRom: 'gû' },
  { id: 'pig',        lon: 118,  lat: 30,  place: '中國',       en: 'Pig',         zh: '豬',     tw: '豬',     twRom: 'ti' },
  { id: 'sheep',      lon: 165,  lat: -31, pin: [174, -40], place: '紐西蘭', en: 'Sheep', zh: '綿羊', tw: '綿羊', twRom: 'mî-iûnn' },
  { id: 'horse',      lon: 115,  lat: 45,  pin: [103, 47], place: '蒙古', en: 'Horse', zh: '馬',     tw: '馬',     twRom: 'bé' },
  { id: 'chicken',    lon: 115,  lat: 16,  pin: [102, 17], place: '東南亞', en: 'Chicken', zh: '雞', tw: '雞',     twRom: 'ke' },
  { id: 'ostrich',    lon: 49,   lat: 11,  place: '非洲',       en: 'Ostrich',     zh: '鴕鳥',   tw: '駝鳥',   twRom: 'tô-tsiáu' },
  { id: 'chimpanzee', lon: -13,  lat: 2,   place: '非洲',       en: 'Chimpanzee',  zh: '黑猩猩', tw: '烏猩猩', twRom: 'oo-sing-sing' },
  { id: 'komodo-dragon', lon: 125, lat: -13, place: '印尼',     en: 'Komodo Dragon', zh: '科摩多龍', tw: '科摩多龍', twRom: 'Kho-môo-to-lîng' },
  { id: 'tortoise',   lon: -91,  lat: -1,  place: '加拉巴哥群島', en: 'Tortoise',  zh: '象龜',   tw: '象龜',   twRom: 'tshiūnn-ku' },
  { id: 'sea-otter',  lon: -135, lat: 48,  place: '北太平洋',   en: 'Sea Otter',   zh: '海獺',   tw: '海獺',   twRom: 'hái-thuah' },
  { id: 'clownfish',  lon: 145,  lat: -14, place: '大堡礁',     en: 'Clownfish',   zh: '小丑魚', tw: '小丑魚', twRom: 'siáu-thiú-hî' },
  { id: 'orca',       lon: -160, lat: 48,  place: '北太平洋',   en: 'Orca',        zh: '虎鯨',   tw: '虎鯨',   twRom: 'hóo-kîng' },
];
