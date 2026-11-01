// 車子資料：新增車子只要在這裡加一筆，並在 art/vehicles.js 畫一個同 id 的插圖
// x / y 是車子在城市地圖上的位置（地圖大小 1000 × 560），place 是卡片上顯示的地點
// twRom 是台羅拼音；台語用字與拼音為初稿，建議對照教育部《臺灣台語常用詞辭典》確認
const VEHICLES = [
  // 工地
  { id: 'excavator',    x: 62,  y: 82,  place: '工地', en: 'Excavator',    zh: '挖土機',   tw: '怪手',     twRom: 'kuài-tshiú' },
  { id: 'bulldozer',    x: 138, y: 82,  place: '工地', en: 'Bulldozer',    zh: '推土機',   tw: '推土機',   twRom: 'the-thôo-ki' },
  { id: 'crane',        x: 212, y: 78,  place: '工地', en: 'Crane',        zh: '吊車',     tw: '吊車',     twRom: 'tiàu-tshia' },
  { id: 'tower-crane',  x: 284, y: 84,  place: '工地', en: 'Tower Crane',  zh: '塔式起重機', tw: '起重機', twRom: 'khí-tiōng-ki' },
  { id: 'dump-truck',   x: 62,  y: 140, place: '工地', en: 'Dump Truck',   zh: '砂石車',   tw: '砂石車',   twRom: 'sua-tsio̍h-tshia' },
  { id: 'cement-mixer', x: 138, y: 140, place: '工地', en: 'Cement Mixer', zh: '水泥攪拌車', tw: '紅毛土車', twRom: 'âng-mn̂g-thôo-tshia' },
  { id: 'road-roller',  x: 212, y: 142, place: '工地', en: 'Road Roller',  zh: '壓路機',   tw: '壓路機',   twRom: 'ah-lōo-ki' },
  { id: 'loader',       x: 284, y: 142, place: '工地', en: 'Loader',       zh: '鏟裝機',   tw: '山貓',     twRom: 'suann-niau' },
  { id: 'forklift',     x: 100, y: 192, place: '工地', en: 'Forklift',     zh: '堆高機',   tw: '堆高機',   twRom: 'tui-ko-ki' },

  // 消防局、警察局、醫院
  { id: 'fire-truck',        x: 400, y: 140, place: '消防局', en: 'Fire Truck',        zh: '消防車',   tw: '消防車',   twRom: 'siau-hông-tshia' },
  { id: 'ladder-truck',      x: 470, y: 140, place: '消防局', en: 'Ladder Truck',      zh: '雲梯車',   tw: '雲梯車',   twRom: 'hûn-thui-tshia' },
  { id: 'police-car',        x: 540, y: 142, place: '警察局', en: 'Police Car',        zh: '警車',     tw: '警察車',   twRom: 'kíng-tshat-tshia' },
  { id: 'ambulance',         x: 610, y: 140, place: '醫院',   en: 'Ambulance',         zh: '救護車',   tw: '救護車',   twRom: 'kiù-hōo-tshia' },
  { id: 'tow-truck',         x: 420, y: 194, place: '消防局', en: 'Tow Truck',         zh: '拖吊車',   tw: '拖吊車',   twRom: 'thua-tiàu-tshia' },
  { id: 'police-motorcycle', x: 510, y: 194, place: '警察局', en: 'Police Motorcycle', zh: '警用機車', tw: '警察歐兜邁', twRom: 'kíng-tshat oo-tóo-bái' },
  { id: 'rescue-helicopter', x: 604, y: 192, place: '醫院',   en: 'Rescue Helicopter', zh: '救援直升機', tw: '救難直升機', twRom: 'kiù-lān ti̍t-sing-ki' },

  // 機場
  { id: 'helicopter', x: 790, y: 92,  place: '機場',   en: 'Helicopter', zh: '直升機', tw: '直升機', twRom: 'ti̍t-sing-ki' },
  { id: 'rocket',     x: 944, y: 96,  place: '發射台', en: 'Rocket',     zh: '火箭',   tw: '火箭',   twRom: 'hué-tsìnn' },
  { id: 'airplane',   x: 850, y: 176, place: '機場',   en: 'Airplane',   zh: '飛機',   tw: '飛行機', twRom: 'hue-lîng-ki' },

  // 馬路上
  { id: 'car',            x: 60,  y: 250, place: '馬路', en: 'Car',            zh: '汽車',   tw: '汽車',   twRom: 'khì-tshia' },
  { id: 'taxi',           x: 176, y: 250, place: '馬路', en: 'Taxi',           zh: '計程車', tw: '計程車', twRom: 'kè-thîng-tshia' },
  { id: 'bus',            x: 296, y: 248, place: '馬路', en: 'Bus',            zh: '公車',   tw: '公車',   twRom: 'kong-tshia' },
  { id: 'scooter',        x: 410, y: 250, place: '馬路', en: 'Scooter',        zh: '機車',   tw: '歐兜邁', twRom: 'oo-tóo-bái' },
  { id: 'delivery-truck', x: 530, y: 248, place: '馬路', en: 'Delivery Truck', zh: '貨車',   tw: '貨車',   twRom: 'huè-tshia' },
  { id: 'camper-van',     x: 652, y: 248, place: '馬路', en: 'Camper Van',     zh: '露營車', tw: '露營車', twRom: 'lōo-iânn-tshia' },
  { id: 'street-sweeper', x: 772, y: 248, place: '馬路', en: 'Street Sweeper', zh: '掃街車', tw: '掃街車', twRom: 'sàu-ke-tshia' },
  { id: 'bicycle',        x: 890, y: 250, place: '馬路', en: 'Bicycle',        zh: '腳踏車', tw: '鐵馬',   twRom: 'thih-bé' },

  // 鐵路
  { id: 'train',            x: 110, y: 298, place: '鐵路', en: 'Train',            zh: '火車',     tw: '火車',     twRom: 'hué-tshia' },
  { id: 'high-speed-train', x: 330, y: 298, place: '鐵路', en: 'High-Speed Train', zh: '高鐵',     tw: '高鐵',     twRom: 'ko-thih' },
  { id: 'metro',            x: 550, y: 298, place: '鐵路', en: 'Metro',            zh: '捷運',     tw: '捷運',     twRom: 'tsia̍p-ūn' },
  { id: 'steam-train',      x: 770, y: 298, place: '鐵路', en: 'Steam Train',      zh: '蒸汽火車', tw: '蒸汽火車', twRom: 'tsing-khì hué-tshia' },

  // 農場
  { id: 'tractor',           x: 150, y: 430, place: '農場', en: 'Tractor',           zh: '拖拉機',   tw: '鐵牛仔',   twRom: 'thih-gû-á' },
  { id: 'combine-harvester', x: 238, y: 494, place: '農場', en: 'Combine Harvester', zh: '收割機',   tw: '割稻仔機', twRom: 'kuah-tiū-á-ki' },
  { id: 'hot-air-balloon',   x: 248, y: 400, place: '天空', en: 'Hot Air Balloon',   zh: '熱氣球',   tw: '熱氣球',   twRom: 'jia̍t-khì-kiû' },

  // 小鎮
  { id: 'school-bus',      x: 372, y: 470, place: '學校', en: 'School Bus',      zh: '校車',     tw: '校車',     twRom: 'hāu-tshia' },
  { id: 'ice-cream-truck', x: 520, y: 440, place: '公園', en: 'Ice Cream Truck', zh: '冰淇淋車', tw: '冰淇淋車', twRom: 'ai-sú-khu-lìm-tshia' },
  { id: 'garbage-truck',   x: 452, y: 512, place: '小鎮', en: 'Garbage Truck',   zh: '垃圾車',   tw: '糞埽車',   twRom: 'pùn-sò-tshia' },
  { id: 'mail-truck',      x: 598, y: 506, place: '郵局', en: 'Mail Truck',      zh: '郵車',     tw: '郵便車',   twRom: 'iû-piān-tshia' },

  // 港口
  { id: 'ship',         x: 760, y: 420, place: '港口', en: 'Ship',         zh: '輪船',   tw: '輪船',   twRom: 'lûn-tsûn' },
  { id: 'sailboat',     x: 880, y: 404, place: '港口', en: 'Sailboat',     zh: '帆船',   tw: '帆船',   twRom: 'phâng-tsûn' },
  { id: 'fishing-boat', x: 730, y: 506, place: '港口', en: 'Fishing Boat', zh: '漁船',   tw: '討海船', twRom: 'thó-hái-tsûn' },
  { id: 'submarine',    x: 850, y: 506, place: '港口', en: 'Submarine',    zh: '潛水艇', tw: '潛水艇', twRom: 'tsiâm-tsuí-thíng' },
  { id: 'speedboat',    x: 950, y: 470, place: '港口', en: 'Speedboat',    zh: '快艇',   tw: '快艇',   twRom: 'khuài-thíng' },
];
