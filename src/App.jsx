import React, { useState, useMemo } from "react";

// ==========================================================================
// FIFA WORLD CUP 2026 — ROAD SIMULATOR v4
// Tabs: 試合SIM (GL+KO combined) | カレンダー (visual grid)
// ==========================================================================

// ---------- Team data ----------
const TEAMS = {
  MEX: { name: "Mexico",        ja: "メキシコ",         flag: "🇲🇽" },
  RSA: { name: "South Africa",  ja: "南アフリカ",       flag: "🇿🇦" },
  KOR: { name: "South Korea",   ja: "韓国",             flag: "🇰🇷" },
  CZE: { name: "Czechia",       ja: "チェコ",           flag: "🇨🇿" },
  CAN: { name: "Canada",        ja: "カナダ",           flag: "🇨🇦" },
  BIH: { name: "Bosnia & H.",   ja: "ボスニア",         flag: "🇧🇦" },
  QAT: { name: "Qatar",         ja: "カタール",         flag: "🇶🇦" },
  SUI: { name: "Switzerland",   ja: "スイス",           flag: "🇨🇭" },
  BRA: { name: "Brazil",        ja: "ブラジル",         flag: "🇧🇷" },
  MAR: { name: "Morocco",       ja: "モロッコ",         flag: "🇲🇦" },
  HAI: { name: "Haiti",         ja: "ハイチ",           flag: "🇭🇹" },
  SCO: { name: "Scotland",      ja: "スコットランド",   flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  USA: { name: "United States", ja: "アメリカ",         flag: "🇺🇸" },
  PAR: { name: "Paraguay",      ja: "パラグアイ",       flag: "🇵🇾" },
  AUS: { name: "Australia",     ja: "オーストラリア",   flag: "🇦🇺" },
  TUR: { name: "Türkiye",       ja: "トルコ",           flag: "🇹🇷" },
  GER: { name: "Germany",       ja: "ドイツ",           flag: "🇩🇪" },
  CUW: { name: "Curaçao",       ja: "キュラソー",       flag: "🇨🇼" },
  CIV: { name: "Côte d'Ivoire", ja: "コートジボワール", flag: "🇨🇮" },
  ECU: { name: "Ecuador",       ja: "エクアドル",       flag: "🇪🇨" },
  NED: { name: "Netherlands",   ja: "オランダ",         flag: "🇳🇱" },
  JPN: { name: "Japan",         ja: "日本",             flag: "🇯🇵" },
  SWE: { name: "Sweden",        ja: "スウェーデン",     flag: "🇸🇪" },
  TUN: { name: "Tunisia",       ja: "チュニジア",       flag: "🇹🇳" },
  BEL: { name: "Belgium",       ja: "ベルギー",         flag: "🇧🇪" },
  EGY: { name: "Egypt",         ja: "エジプト",         flag: "🇪🇬" },
  IRN: { name: "IR Iran",       ja: "イラン",           flag: "🇮🇷" },
  NZL: { name: "New Zealand",   ja: "ニュージーランド", flag: "🇳🇿" },
  ESP: { name: "Spain",         ja: "スペイン",         flag: "🇪🇸" },
  CPV: { name: "Cabo Verde",    ja: "カーボベルデ",     flag: "🇨🇻" },
  KSA: { name: "Saudi Arabia",  ja: "サウジアラビア",   flag: "🇸🇦" },
  URU: { name: "Uruguay",       ja: "ウルグアイ",       flag: "🇺🇾" },
  FRA: { name: "France",        ja: "フランス",         flag: "🇫🇷" },
  SEN: { name: "Senegal",       ja: "セネガル",         flag: "🇸🇳" },
  IRQ: { name: "Iraq",          ja: "イラク",           flag: "🇮🇶" },
  NOR: { name: "Norway",        ja: "ノルウェー",       flag: "🇳🇴" },
  ARG: { name: "Argentina",     ja: "アルゼンチン",     flag: "🇦🇷" },
  ALG: { name: "Algeria",       ja: "アルジェリア",     flag: "🇩🇿" },
  AUT: { name: "Austria",       ja: "オーストリア",     flag: "🇦🇹" },
  JOR: { name: "Jordan",        ja: "ヨルダン",         flag: "🇯🇴" },
  POR: { name: "Portugal",      ja: "ポルトガル",       flag: "🇵🇹" },
  COD: { name: "DR Congo",      ja: "コンゴ民主共和国", flag: "🇨🇩" },
  UZB: { name: "Uzbekistan",    ja: "ウズベキスタン",   flag: "🇺🇿" },
  COL: { name: "Colombia",      ja: "コロンビア",       flag: "🇨🇴" },
  ENG: { name: "England",       ja: "イングランド",     flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  CRO: { name: "Croatia",       ja: "クロアチア",       flag: "🇭🇷" },
  GHA: { name: "Ghana",         ja: "ガーナ",           flag: "🇬🇭" },
  PAN: { name: "Panama",        ja: "パナマ",           flag: "🇵🇦" },
};

const FIFA_RANK = {
  FRA: 1,  ESP: 2,  ARG: 3,  ENG: 4,  POR: 5,  BRA: 6,  NED: 7,  MAR: 8,
  BEL: 9,  GER: 10, CRO: 11, SEN: 12, COL: 13, USA: 14, MEX: 15, URU: 16,
  SUI: 17, JPN: 18, IRN: 19, KOR: 20, ECU: 21, AUT: 22, TUR: 23, AUS: 24,
  CAN: 25, NOR: 26, PAN: 27, CIV: 28, SCO: 29, PAR: 30, TUN: 31, ALG: 32,
  EGY: 33, SWE: 34, CZE: 35, IRQ: 36, JOR: 37, QAT: 38, RSA: 39,
  KSA: 40, CPV: 41, GHA: 42, COD: 43, UZB: 44, BIH: 45, CUW: 46, HAI: 47, NZL: 48,
};

const GROUPS = {
  A: ["MEX", "RSA", "KOR", "CZE"],
  B: ["CAN", "BIH", "QAT", "SUI"],
  C: ["BRA", "MAR", "HAI", "SCO"],
  D: ["USA", "PAR", "AUS", "TUR"],
  E: ["GER", "CUW", "CIV", "ECU"],
  F: ["NED", "JPN", "SWE", "TUN"],
  G: ["BEL", "EGY", "IRN", "NZL"],
  H: ["ESP", "CPV", "KSA", "URU"],
  I: ["FRA", "SEN", "IRQ", "NOR"],
  J: ["ARG", "ALG", "AUT", "JOR"],
  K: ["POR", "COD", "UZB", "COL"],
  L: ["ENG", "CRO", "GHA", "PAN"],
};
const GROUP_KEYS = ["A","B","C","D","E","F","G","H","I","J","K","L"];

const VENUES = {
  "BC Place":                   { city:"Vancouver",              tz:"PT"  },
  "Lumen Field":                { city:"Seattle",                 tz:"PT"  },
  "Levi's Stadium":             { city:"San Francisco Bay Area", tz:"PT"  },
  "SoFi Stadium":               { city:"Los Angeles",             tz:"PT"  },
  "Estadio Akron":              { city:"Guadalajara",             tz:"CST" },
  "Estadio Azteca":             { city:"Mexico City",             tz:"CST" },
  "Estadio BBVA":               { city:"Monterrey",               tz:"CST" },
  "NRG Stadium":                { city:"Houston",                 tz:"CT"  },
  "AT&T Stadium":               { city:"Dallas",                  tz:"CT"  },
  "Arrowhead Stadium":          { city:"Kansas City",             tz:"CT"  },
  "Mercedes-Benz Stadium":      { city:"Atlanta",                 tz:"ET"  },
  "Hard Rock Stadium":          { city:"Miami",                   tz:"ET"  },
  "BMO Field":                  { city:"Toronto",                 tz:"ET"  },
  "Gillette Stadium":           { city:"Boston",                  tz:"ET"  },
  "Lincoln Financial Field":    { city:"Philadelphia",            tz:"ET"  },
  "MetLife Stadium":            { city:"New York / New Jersey",   tz:"ET"  },
};

const TZ_OFFSET_FROM_ET = { PT: -3, CT: -1, ET: 0, CST: -2 };
const ALL_CITIES = [...new Set(Object.values(VENUES).map(v => v.city))].sort();

const M = (n,d,t,a,b,venue,g) => ({ num:n, date:d, timeET:t, team1:a, team2:b, venue, city: VENUES[venue].city, group:g });
const ALL_MATCHES = [
  M(1,"2026-06-11","15:00","MEX","RSA","Estadio Azteca","A"),
  M(2,"2026-06-11","22:00","KOR","CZE","Estadio Akron","A"),
  M(3,"2026-06-12","15:00","CAN","BIH","BMO Field","B"),
  M(4,"2026-06-12","21:00","USA","PAR","SoFi Stadium","D"),
  M(5,"2026-06-13","21:00","HAI","SCO","Gillette Stadium","C"),
  M(6,"2026-06-13","00:00","AUS","TUR","BC Place","D"),
  M(7,"2026-06-13","18:00","BRA","MAR","MetLife Stadium","C"),
  M(8,"2026-06-13","15:00","QAT","SUI","Levi's Stadium","B"),
  M(9,"2026-06-14","19:00","CIV","ECU","Lincoln Financial Field","E"),
  M(10,"2026-06-14","13:00","GER","CUW","NRG Stadium","E"),
  M(11,"2026-06-14","16:00","NED","JPN","AT&T Stadium","F"),
  M(12,"2026-06-14","22:00","SWE","TUN","Estadio BBVA","F"),
  M(13,"2026-06-15","18:00","KSA","URU","Hard Rock Stadium","H"),
  M(14,"2026-06-15","12:00","ESP","CPV","Mercedes-Benz Stadium","H"),
  M(15,"2026-06-15","21:00","IRN","NZL","SoFi Stadium","G"),
  M(16,"2026-06-15","15:00","BEL","EGY","Lumen Field","G"),
  M(17,"2026-06-16","15:00","FRA","SEN","MetLife Stadium","I"),
  M(18,"2026-06-16","18:00","IRQ","NOR","Gillette Stadium","I"),
  M(19,"2026-06-16","21:00","ARG","ALG","Arrowhead Stadium","J"),
  M(20,"2026-06-16","00:00","AUT","JOR","Levi's Stadium","J"),
  M(21,"2026-06-17","19:00","GHA","PAN","BMO Field","L"),
  M(22,"2026-06-17","16:00","ENG","CRO","AT&T Stadium","L"),
  M(23,"2026-06-17","13:00","POR","COD","NRG Stadium","K"),
  M(24,"2026-06-17","22:00","UZB","COL","Estadio Azteca","K"),
  M(25,"2026-06-18","12:00","CZE","RSA","Mercedes-Benz Stadium","A"),
  M(26,"2026-06-18","15:00","SUI","BIH","SoFi Stadium","B"),
  M(27,"2026-06-18","18:00","CAN","QAT","BC Place","B"),
  M(28,"2026-06-18","21:00","MEX","KOR","Estadio Akron","A"),
  M(29,"2026-06-19","20:30","BRA","HAI","Lincoln Financial Field","C"),
  M(30,"2026-06-19","18:00","SCO","MAR","Gillette Stadium","C"),
  M(31,"2026-06-19","23:00","TUR","PAR","Levi's Stadium","D"),
  M(32,"2026-06-19","15:00","USA","AUS","Lumen Field","D"),
  M(33,"2026-06-20","16:00","GER","CIV","BMO Field","E"),
  M(34,"2026-06-20","20:00","ECU","CUW","Arrowhead Stadium","E"),
  M(35,"2026-06-20","13:00","NED","SWE","NRG Stadium","F"),
  M(36,"2026-06-20","00:00","TUN","JPN","Estadio BBVA","F"),
  M(37,"2026-06-21","18:00","URU","CPV","Hard Rock Stadium","H"),
  M(38,"2026-06-21","12:00","ESP","KSA","Mercedes-Benz Stadium","H"),
  M(39,"2026-06-21","15:00","BEL","IRN","SoFi Stadium","G"),
  M(40,"2026-06-21","21:00","NZL","EGY","BC Place","G"),
  M(41,"2026-06-22","20:00","NOR","SEN","MetLife Stadium","I"),
  M(42,"2026-06-22","17:00","FRA","IRQ","Lincoln Financial Field","I"),
  M(43,"2026-06-22","13:00","ARG","AUT","AT&T Stadium","J"),
  M(44,"2026-06-22","23:00","JOR","ALG","Levi's Stadium","J"),
  M(45,"2026-06-23","16:00","ENG","GHA","Gillette Stadium","L"),
  M(46,"2026-06-23","19:00","PAN","CRO","BMO Field","L"),
  M(47,"2026-06-23","13:00","POR","UZB","NRG Stadium","K"),
  M(48,"2026-06-23","22:00","COL","COD","Estadio Akron","K"),
  M(49,"2026-06-24","18:00","SCO","BRA","Hard Rock Stadium","C"),
  M(50,"2026-06-24","18:00","MAR","HAI","Mercedes-Benz Stadium","C"),
  M(51,"2026-06-24","15:00","SUI","CAN","BC Place","B"),
  M(52,"2026-06-24","15:00","BIH","QAT","Lumen Field","B"),
  M(53,"2026-06-24","21:00","CZE","MEX","Estadio Azteca","A"),
  M(54,"2026-06-24","21:00","RSA","KOR","Estadio BBVA","A"),
  M(55,"2026-06-25","16:00","CUW","CIV","Lincoln Financial Field","E"),
  M(56,"2026-06-25","16:00","ECU","GER","MetLife Stadium","E"),
  M(57,"2026-06-25","19:00","JPN","SWE","AT&T Stadium","F"),
  M(58,"2026-06-25","19:00","TUN","NED","Arrowhead Stadium","F"),
  M(59,"2026-06-25","22:00","TUR","USA","SoFi Stadium","D"),
  M(60,"2026-06-25","22:00","PAR","AUS","Levi's Stadium","D"),
  M(61,"2026-06-26","15:00","NOR","FRA","Gillette Stadium","I"),
  M(62,"2026-06-26","15:00","SEN","IRQ","BMO Field","I"),
  M(63,"2026-06-26","23:00","EGY","IRN","Lumen Field","G"),
  M(64,"2026-06-26","23:00","NZL","BEL","BC Place","G"),
  M(65,"2026-06-26","20:00","CPV","KSA","NRG Stadium","H"),
  M(66,"2026-06-26","20:00","URU","ESP","Estadio Akron","H"),
  M(67,"2026-06-27","17:00","PAN","ENG","MetLife Stadium","L"),
  M(68,"2026-06-27","17:00","CRO","GHA","Lincoln Financial Field","L"),
  M(69,"2026-06-27","22:00","ALG","AUT","Arrowhead Stadium","J"),
  M(70,"2026-06-27","22:00","JOR","ARG","AT&T Stadium","J"),
  M(71,"2026-06-27","19:30","COL","POR","Hard Rock Stadium","K"),
  M(72,"2026-06-27","19:30","COD","UZB","Mercedes-Benz Stadium","K"),
  M(73,"2026-06-28","15:00",{r:"2A"},{r:"2B"},"SoFi Stadium","R32"),
  M(74,"2026-06-29","16:30",{r:"1E"},{r:"3",from:["A","B","C","D","F"]},"Gillette Stadium","R32"),
  M(75,"2026-06-29","21:00",{r:"1F"},{r:"2C"},"Estadio BBVA","R32"),
  M(76,"2026-06-29","13:00",{r:"1C"},{r:"2F"},"NRG Stadium","R32"),
  M(77,"2026-06-30","17:00",{r:"1I"},{r:"3",from:["C","D","F","G","H"]},"MetLife Stadium","R32"),
  M(78,"2026-06-30","13:00",{r:"2E"},{r:"2I"},"AT&T Stadium","R32"),
  M(79,"2026-06-30","21:00",{r:"1A"},{r:"3",from:["C","E","F","H","I"]},"Estadio Azteca","R32"),
  M(80,"2026-07-01","12:00",{r:"1L"},{r:"3",from:["E","H","I","J","K"]},"Mercedes-Benz Stadium","R32"),
  M(81,"2026-07-01","20:00",{r:"1D"},{r:"3",from:["B","E","F","I","J"]},"Levi's Stadium","R32"),
  M(82,"2026-07-01","16:00",{r:"1G"},{r:"3",from:["A","E","H","I","J"]},"Lumen Field","R32"),
  M(83,"2026-07-02","19:00",{r:"2K"},{r:"2L"},"BMO Field","R32"),
  M(84,"2026-07-02","15:00",{r:"1H"},{r:"2J"},"SoFi Stadium","R32"),
  M(85,"2026-07-02","23:00",{r:"1B"},{r:"3",from:["E","F","G","I","J"]},"BC Place","R32"),
  M(86,"2026-07-03","18:00",{r:"1J"},{r:"2H"},"Hard Rock Stadium","R32"),
  M(87,"2026-07-03","21:30",{r:"1K"},{r:"3",from:["D","E","I","J","L"]},"Arrowhead Stadium","R32"),
  M(88,"2026-07-03","14:00",{r:"2D"},{r:"2G"},"AT&T Stadium","R32"),
  M(89,"2026-07-04","17:00",{w:74},{w:77},"Lincoln Financial Field","R16"),
  M(90,"2026-07-04","13:00",{w:73},{w:75},"NRG Stadium","R16"),
  M(91,"2026-07-05","16:00",{w:76},{w:78},"MetLife Stadium","R16"),
  M(92,"2026-07-05","20:00",{w:79},{w:80},"Estadio Azteca","R16"),
  M(93,"2026-07-06","15:00",{w:83},{w:84},"AT&T Stadium","R16"),
  M(94,"2026-07-06","20:00",{w:81},{w:82},"Lumen Field","R16"),
  M(95,"2026-07-07","12:00",{w:86},{w:88},"Mercedes-Benz Stadium","R16"),
  M(96,"2026-07-07","16:00",{w:85},{w:87},"BC Place","R16"),
  M(97,"2026-07-09","16:00",{w:89},{w:90},"Gillette Stadium","QF"),
  M(98,"2026-07-10","15:00",{w:93},{w:94},"SoFi Stadium","QF"),
  M(99,"2026-07-11","17:00",{w:91},{w:92},"Hard Rock Stadium","QF"),
  M(100,"2026-07-11","21:00",{w:95},{w:96},"Arrowhead Stadium","QF"),
  M(101,"2026-07-14","15:00",{w:97},{w:98},"AT&T Stadium","SF"),
  M(102,"2026-07-15","15:00",{w:99},{w:100},"Mercedes-Benz Stadium","SF"),
  M(103,"2026-07-18","17:00",{l:101},{l:102},"Hard Rock Stadium","3RD"),
  M(104,"2026-07-19","15:00",{w:101},{w:102},"MetLife Stadium","FINAL"),
];

// ==================== Utilities ====================
function addHours(dateStr, timeStr, hours) {
  const [y,m,d] = dateStr.split("-").map(Number);
  const [hh,mm] = timeStr.split(":").map(Number);
  const dt = new Date(Date.UTC(y, m-1, d, hh, mm));
  dt.setUTCHours(dt.getUTCHours() + hours);
  const pad = x => String(x).padStart(2, "0");
  return {
    date: `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth()+1)}-${pad(dt.getUTCDate())}`,
    time: `${pad(dt.getUTCHours())}:${pad(dt.getUTCMinutes())}`,
  };
}
function getLocalOffset(venueName) {
  return TZ_OFFSET_FROM_ET[VENUES[venueName].tz];
}
function etToLocal(m) { return addHours(m.date, m.timeET, getLocalOffset(m.venue)); }
function etToJST(m)   { return addHours(m.date, m.timeET, 13); }
function weekdayJa(dateStr) {
  const [y,mn,d] = dateStr.split("-").map(Number);
  return ["日","月","火","水","木","金","土"][new Date(Date.UTC(y,mn-1,d)).getUTCDay()];
}
function fmtShort(s) {
  const [,m,d] = s.split("-");
  return `${Number(m)}/${Number(d)}(${weekdayJa(s)})`;
}
function offsetLabel(n) { return n === 0 ? "±0" : n > 0 ? `+${n}` : `${n}`; }

function seedStandings() {
  const s = {};
  GROUP_KEYS.forEach(g => {
    s[g] = [...GROUPS[g]].sort((a,b) => FIFA_RANK[a] - FIFA_RANK[b]);
  });
  return s;
}
function standingsWithMyRank(myTeam, myRank) {
  const seed = seedStandings();
  const g = GROUP_KEYS.find(k => GROUPS[k].includes(myTeam));
  const arr = seed[g].filter(t => t !== myTeam);
  arr.splice(myRank, 0, myTeam);
  seed[g] = arr;
  return { standings: seed, myGroup: g };
}

const R32_THIRD_SLOTS = [
  { num:74, from:["A","B","C","D","F"] },
  { num:77, from:["C","D","F","G","H"] },
  { num:79, from:["C","E","F","H","I"] },
  { num:80, from:["E","H","I","J","K"] },
  { num:81, from:["B","E","F","I","J"] },
  { num:82, from:["A","E","H","I","J"] },
  { num:85, from:["E","F","G","I","J"] },
  { num:87, from:["D","E","I","J","L"] },
];
function assignThirds(standings) {
  const used = new Set(); const map = {};
  for (const slot of R32_THIRD_SLOTS) {
    const pick = slot.from.find(g => !used.has(g));
    if (pick) { map[slot.num] = pick; used.add(pick); }
  }
  return map;
}
function resolveSlot(side, standings, thirdMap, r32MatchNum) {
  if (!side.r) return null;
  if (side.r[0] === "1") return standings[side.r[1]][0];
  if (side.r[0] === "2") return standings[side.r[1]][1];
  if (side.r === "3") { const g = thirdMap[r32MatchNum]; return g ? standings[g][2] : null; }
  return null;
}
function findR32ForRanked(team, rank, standings, thirdMap) {
  for (const m of ALL_MATCHES.filter(m => m.group === "R32")) {
    const t1 = resolveSlot(m.team1, standings, thirdMap, m.num);
    const t2 = resolveSlot(m.team2, standings, thirdMap, m.num);
    if (t1 === team || t2 === team) return { match: m, opponent: t1 === team ? t2 : t1 };
  }
  return null;
}
function findR32For3rd(team, standings) {
  const g = GROUP_KEYS.find(k => GROUPS[k].includes(team));
  return R32_THIRD_SLOTS.filter(s => s.from.includes(g)).map(slot => {
    const m = ALL_MATCHES.find(mm => mm.num === slot.num);
    const otherSide = m.team1.r && m.team1.r[0] === "1" ? m.team1 : m.team2;
    return { match: m, opponent: standings[otherSide.r[1]][0] };
  });
}
function traceWinsFrom(r32MatchNum, team, standings, thirdMap) {
  const winners = {};
  const r32Resolved = {};
  ALL_MATCHES.filter(m => m.group === "R32").forEach(m => {
    r32Resolved[m.num] = {
      t1: resolveSlot(m.team1, standings, thirdMap, m.num),
      t2: resolveSlot(m.team2, standings, thirdMap, m.num),
    };
  });
  winners[r32MatchNum] = team;
  ALL_MATCHES.filter(m => m.group === "R32").forEach(m => {
    if (m.num === r32MatchNum) return;
    const { t1, t2 } = r32Resolved[m.num];
    if (t1 && t2) winners[m.num] = FIFA_RANK[t1] < FIFA_RANK[t2] ? t1 : t2;
  });
  const resolveKOSide = (side) => {
    if (side.w !== undefined) return winners[side.w] || null;
    if (side.l !== undefined) {
      const m = ALL_MATCHES.find(mm => mm.num === side.l);
      if (!m) return null;
      const w = winners[side.l];
      if (!w) return null;
      const t1 = resolveKOSide(m.team1), t2 = resolveKOSide(m.team2);
      return t1 === w ? t2 : t1;
    }
    return null;
  };
  const path = [];
  const r32Match = ALL_MATCHES.find(m => m.num === r32MatchNum);
  const r32 = r32Resolved[r32MatchNum];
  path.push({ stage:"R32", match:r32Match, opponent: r32.t1===team ? r32.t2 : r32.t1 });
  for (const stage of ["R16","QF","SF","FINAL"]) {
    let found = null;
    for (const m of ALL_MATCHES.filter(m => m.group === stage)) {
      const t1 = resolveKOSide(m.team1), t2 = resolveKOSide(m.team2);
      if (!t1 || !t2) continue;
      if (t1 === team || t2 === team) {
        found = { stage, match: m, opponent: t1===team ? t2 : t1 };
        winners[m.num] = team;
      } else {
        winners[m.num] = FIFA_RANK[t1] < FIFA_RANK[t2] ? t1 : t2;
      }
    }
    if (found) path.push(found); else break;
  }
  return path;
}

function gcalLink(match, t1Code, t2Code) {
  const [y,mo,d] = match.date.split("-").map(Number);
  const [h,mi] = match.timeET.split(":").map(Number);
  const startUTC = new Date(Date.UTC(y, mo-1, d, h+4, mi));
  const endUTC = new Date(startUTC.getTime() + 2*3600*1000);
  const fmt = dt => dt.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"");
  const t1 = t1Code && TEAMS[t1Code] ? TEAMS[t1Code].ja : (t1Code || "TBD");
  const t2 = t2Code && TEAMS[t2Code] ? TEAMS[t2Code].ja : (t2Code || "TBD");
  const u = new URL("https://calendar.google.com/calendar/render");
  u.searchParams.set("action","TEMPLATE");
  u.searchParams.set("text", `${t1} vs ${t2} — W杯2026 ${stageJa(match.group)}`);
  u.searchParams.set("dates", `${fmt(startUTC)}/${fmt(endUTC)}`);
  u.searchParams.set("details", `FIFA World Cup 2026 Match #${match.num}\n会場: ${match.venue} (${match.city})\nET: ${match.date} ${match.timeET}`);
  u.searchParams.set("location", `${match.venue}, ${match.city}`);
  return u.toString();
}
function stageJa(g) {
  return { R32:"R32", R16:"R16", QF:"準々決勝", SF:"準決勝", FINAL:"決勝", "3RD":"3位決定戦",
    A:"GL", B:"GL", C:"GL", D:"GL", E:"GL", F:"GL", G:"GL", H:"GL", I:"GL", J:"GL", K:"GL", L:"GL"
  }[g] || g;
}
function gmapsLink(venue) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue + ", " + VENUES[venue].city)}`;
}

// ==================== Shared UI Components ====================
function FlagTeam({ code, size="base" }) {
  if (!code) return <span className="text-zinc-600 italic text-xs">未定</span>;
  const t = TEAMS[code];
  if (!t) return <span className="font-mono text-zinc-400 text-xs">{code}</span>;
  const cls = size === "lg" ? "text-2xl" : size === "md" ? "text-lg" : "text-base";
  return (
    <span className="inline-flex items-center gap-1.5 min-w-0">
      <span className={cls}>{t.flag}</span>
      <span className={`font-semibold truncate ${size==="lg"?"text-base":"text-sm"}`}>{t.ja}</span>
    </span>
  );
}
function TimeRow({ match }) {
  const local = etToLocal(match), jst = etToJST(match);
  const off = getLocalOffset(match.venue);
  return (
    <div className="grid grid-cols-3 gap-1.5 text-center mt-2">
      <div className="border border-emerald-500/30 rounded-lg py-1.5 bg-emerald-500/5">
        <div className="text-[9px] font-mono text-emerald-300 tracking-widest">ET</div>
        <div className="font-mono text-[11px] text-zinc-300">{fmtShort(match.date)}</div>
        <div className="font-mono text-base font-bold text-emerald-400">{match.timeET}</div>
      </div>
      <div className="border border-amber-500/30 rounded-lg py-1.5 bg-amber-500/5">
        <div className="text-[9px] font-mono text-amber-200 tracking-widest">現地 ({offsetLabel(off)}h)</div>
        <div className="font-mono text-[11px] text-zinc-300">{fmtShort(local.date)}</div>
        <div className="font-mono text-base font-bold text-amber-300">{local.time}</div>
      </div>
      <div className="border border-rose-500/30 rounded-lg py-1.5 bg-rose-500/5">
        <div className="text-[9px] font-mono text-rose-200 tracking-widest">JST</div>
        <div className="font-mono text-[11px] text-zinc-300">{fmtShort(jst.date)}</div>
        <div className="font-mono text-base font-bold text-rose-300">{jst.time}</div>
      </div>
    </div>
  );
}
function VenueRow({ match }) {
  return (
    <div className="mt-2 flex items-center justify-between text-xs">
      <div className="flex items-center gap-1.5 min-w-0">
        <span>📍</span>
        <span className="text-zinc-200 truncate">{match.venue}</span>
        <span className="text-zinc-500 truncate">· {match.city}</span>
      </div>
      <a href={gmapsLink(match.venue)} target="_blank" rel="noopener noreferrer"
         className="text-[10px] font-mono px-1.5 py-0.5 border border-zinc-700 rounded hover:border-sky-400 hover:text-sky-400 text-zinc-400 shrink-0 ml-2">
        地図↗
      </a>
    </div>
  );
}

// MatchCard: used in SimTab
function MatchCard({ match, myTeam, opponent, stageLabel, tone="base" }) {
  let shownT1 = typeof match.team1 === "string" ? match.team1 : myTeam;
  let shownT2 = typeof match.team2 === "string" ? match.team2 : opponent;
  if (myTeam && shownT2 === myTeam) [shownT1, shownT2] = [shownT2, shownT1];
  return (
    <div className={`rounded-2xl overflow-hidden border
      ${tone==="sim" ? "border-amber-500/30 bg-gradient-to-br from-amber-950/20 to-zinc-950"
                     : "border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 to-zinc-950"}`}>
      <div className="flex items-center justify-between px-3 py-1.5 bg-black/60 border-b border-zinc-800">
        <div className="flex items-baseline gap-2">
          <span className={`font-display text-lg tracking-widest ${tone==="sim" ? "text-amber-400" : "text-emerald-400"}`}>
            {stageLabel}
          </span>
          <span className="font-mono text-[9px] text-zinc-500">#{String(match.num).padStart(3,"0")}</span>
        </div>
        <span className={`font-mono text-[9px] tracking-widest uppercase px-1.5 py-0.5 rounded
          ${tone==="sim" ? "text-amber-300 bg-amber-500/10" : "text-emerald-300 bg-emerald-500/10"}`}>
          {tone==="sim" ? "TBD" : "CONFIRMED"}
        </span>
      </div>
      <div className="px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0"><FlagTeam code={shownT1} size="lg" /></div>
          <span className="font-display text-xl text-zinc-600 tracking-widest shrink-0">VS</span>
          <div className="flex-1 min-w-0 text-right">
            <div className="inline-flex items-center justify-end gap-1.5">
              <span className="font-semibold truncate text-sm">{shownT2 && TEAMS[shownT2] ? TEAMS[shownT2].ja : "未定"}</span>
              <span className="text-2xl">{shownT2 && TEAMS[shownT2] ? TEAMS[shownT2].flag : "❓"}</span>
            </div>
          </div>
        </div>
        <TimeRow match={match} />
        <VenueRow match={match} />
        <div className="mt-3">
          <a href={gcalLink(match, shownT1, shownT2)} target="_blank" rel="noopener noreferrer"
             className="block text-center text-[11px] font-mono py-1.5 border border-zinc-700 rounded hover:border-emerald-400 hover:text-emerald-400 text-zinc-300">
            📅 Google カレンダーに追加
          </a>
        </div>
      </div>
    </div>
  );
}

// ==================== Calendar Components ====================
function CalendarMatchCard({ item, tzMode, expanded, onToggle }) {
  const { match, t1, t2, isSim, isCandidate, candidateIndex } = item;
  const displayTime = tzMode === "jst" ? etToJST(match) : etToLocal(match);
  const stageLbl = stageJa(match.group) + (isCandidate ? ` 候補${candidateIndex}` : "");
  const hasTeams = !!(t1 && t2);
  return (
    <div className={`rounded-xl border overflow-hidden
      ${isSim ? "border-amber-500/40 bg-gradient-to-r from-amber-950/20 to-zinc-950"
               : "border-zinc-800 bg-zinc-950"}`}>
      <button className="w-full px-3 py-2.5 flex items-center gap-2.5 text-left" onClick={onToggle}>
        <div className="w-[52px] shrink-0 text-center">
          <div className={`font-mono text-sm font-bold leading-tight ${isSim ? "text-amber-300" : "text-emerald-400"}`}>
            {displayTime.time}
          </div>
          <div className="font-mono text-[9px] text-zinc-600 leading-none mt-0.5">
            {tzMode === "jst" ? "JST" : "現地"}
          </div>
        </div>
        <div className={`shrink-0 text-[9px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap
          ${isSim ? "bg-amber-500/20 text-amber-300" : "bg-zinc-800 text-zinc-400"}`}>
          {stageLbl}
        </div>
        <div className="flex-1 min-w-0">
          {hasTeams ? (
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-base leading-none">{TEAMS[t1]?.flag || "❓"}</span>
              <span className="font-semibold text-xs text-zinc-200 truncate">{TEAMS[t1]?.ja || t1}</span>
              <span className="text-zinc-600 text-[10px] shrink-0">vs</span>
              <span className="text-base leading-none">{TEAMS[t2]?.flag || "❓"}</span>
              <span className="font-semibold text-xs text-zinc-200 truncate">{TEAMS[t2]?.ja || t2}</span>
            </div>
          ) : (
            <div className="text-zinc-500 text-xs font-mono">組合せ未定</div>
          )}
          <div className="text-[10px] text-zinc-600 font-mono truncate mt-0.5">{match.city}</div>
        </div>
        <div className={`shrink-0 text-zinc-500 text-xs transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>▾</div>
      </button>
      {expanded && (
        <div className="border-t border-zinc-800 px-3 py-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-zinc-500">MATCH #{String(match.num).padStart(3,"0")} · {stageJa(match.group)}</span>
            <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded
              ${isSim ? "bg-amber-500/20 text-amber-300" : "bg-emerald-500/10 text-emerald-400"}`}>
              {isSim ? "TBD" : "CONFIRMED"}
            </span>
          </div>
          {hasTeams ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0"><FlagTeam code={t1} size="lg" /></div>
              <span className="font-display text-xl text-zinc-600 tracking-widest shrink-0">VS</span>
              <div className="flex-1 min-w-0 text-right">
                <div className="inline-flex items-center justify-end gap-1.5">
                  <span className="font-semibold text-sm truncate">{TEAMS[t2]?.ja || "未定"}</span>
                  <span className="text-2xl">{TEAMS[t2]?.flag || "❓"}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-zinc-500 text-sm py-1">対戦チーム未定</div>
          )}
          <TimeRow match={match} />
          <VenueRow match={match} />
          {hasTeams && (
            <a href={gcalLink(match, t1, t2)} target="_blank" rel="noopener noreferrer"
               className="block text-center text-[11px] font-mono py-1.5 border border-zinc-700 rounded-lg hover:border-emerald-400 hover:text-emerald-400 text-zinc-300 transition-colors">
              📅 Google カレンダーに追加
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function CalendarTab({ myTeam }) {
  const [tzMode, setTzMode] = useState("jst");
  const [cityFilter, setCityFilter] = useState("all");
  const [simMode, setSimMode] = useState("all");
  const [viewMonth, setViewMonth] = useState(6);
  const [selectedDate, setSelectedDate] = useState(null);
  const [expandedKey, setExpandedKey] = useState(null);

  const teamInfo = TEAMS[myTeam];

  const simData = useMemo(() => {
    if (simMode === "all") return null;
    const rank = parseInt(simMode);
    if (rank === 3) {
      const { standings } = standingsWithMyRank(myTeam, 2);
      assignThirds(standings);
      const r32Opts = findR32For3rd(myTeam, standings);
      return { kind:"3rd", r32Opts };
    }
    const rankIdx = rank - 1;
    const { standings } = standingsWithMyRank(myTeam, rankIdx);
    const thirdMap = assignThirds(standings);
    const r32Info = findR32ForRanked(myTeam, rankIdx, standings, thirdMap);
    if (!r32Info) return { kind:"none" };
    const path = traceWinsFrom(r32Info.match.num, myTeam, standings, thirdMap);
    return { kind:"rank", path };
  }, [myTeam, simMode]);

  const matchList = useMemo(() => {
    let items = [];
    if (simMode === "all") {
      items = ALL_MATCHES.map(m => ({
        match: m,
        t1: typeof m.team1 === "string" ? m.team1 : null,
        t2: typeof m.team2 === "string" ? m.team2 : null,
        isSim: false, isCandidate: false, candidateIndex: null,
      }));
    } else {
      const gsItems = ALL_MATCHES
        .filter(m => typeof m.team1 === "string" && (m.team1 === myTeam || m.team2 === myTeam))
        .map(m => ({ match:m, t1:m.team1, t2:m.team2, isSim:false, isCandidate:false, candidateIndex:null }));
      let koItems = [];
      if (simData?.kind === "3rd") {
        koItems = simData.r32Opts.map((opt, i) => ({
          match:opt.match, t1:myTeam, t2:opt.opponent, isSim:true, isCandidate:true, candidateIndex:i+1,
        }));
      } else if (simData?.kind === "rank") {
        koItems = simData.path.map(p => ({
          match:p.match, t1:myTeam, t2:p.opponent, isSim:true, isCandidate:false, candidateIndex:null,
        }));
      }
      items = [...gsItems, ...koItems];
    }
    if (cityFilter !== "all") {
      items = items.filter(item => VENUES[item.match.venue]?.city === cityFilter);
    }
    return items.sort((a,b) => a.match.num - b.match.num);
  }, [myTeam, simMode, simData, cityFilter]);

  // Group by display date
  const matchesByDate = useMemo(() => {
    const map = new Map();
    matchList.forEach(item => {
      const key = tzMode === "jst" ? etToJST(item.match).date : etToLocal(item.match).date;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    });
    return map;
  }, [matchList, tzMode]);

  // Calendar grid cells for viewMonth
  const calendarDays = useMemo(() => {
    const year = 2026;
    const firstDow = new Date(Date.UTC(year, viewMonth-1, 1)).getUTCDay();
    const daysInMonth = new Date(Date.UTC(year, viewMonth, 0)).getUTCDate();
    const cells = Array(firstDow).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const pad = x => String(x).padStart(2,"0");
      cells.push(`${year}-${pad(viewMonth)}-${pad(d)}`);
    }
    return cells;
  }, [viewMonth]);

  const selectedMatches = useMemo(() =>
    selectedDate ? (matchesByDate.get(selectedDate) || []) : [],
    [selectedDate, matchesByDate]
  );

  // Count of days with matches in this month
  const daysWithMatchesInMonth = useMemo(() =>
    [...matchesByDate.keys()].filter(d => {
      const mo = parseInt(d.split("-")[1]);
      return mo === viewMonth;
    }).length,
    [matchesByDate, viewMonth]
  );

  return (
    <div className="pb-24">
      {/* ── Filter bar ── */}
      <div className="px-4 pt-3 pb-2.5 space-y-2 border-b border-zinc-900">
        <div className="flex gap-2 items-center">
          <div className="flex rounded-lg overflow-hidden border border-zinc-800 shrink-0">
            {[{k:"local",l:"現地"},{k:"jst",l:"JST"}].map(o => (
              <button key={o.k} onClick={() => { setTzMode(o.k); setSelectedDate(null); }}
                className={`px-3 py-1.5 text-[11px] font-mono transition-colors
                  ${tzMode===o.k ? "bg-emerald-500 text-black font-bold" : "text-zinc-400"}`}>
                {o.l}
              </button>
            ))}
          </div>
          <select value={cityFilter} onChange={e => { setCityFilter(e.target.value); setSelectedDate(null); }}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-300">
            <option value="all">🌎 全都市</option>
            {ALL_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex gap-1">
          {[
            {k:"all", label:"全試合"},
            {k:"1",   label:`${teamInfo.flag} 1位`},
            {k:"2",   label:`${teamInfo.flag} 2位`},
            {k:"3",   label:`${teamInfo.flag} 3位`},
          ].map(s => (
            <button key={s.k} onClick={() => { setSimMode(s.k); setSelectedDate(null); setExpandedKey(null); }}
              className={`flex-1 py-1.5 rounded-lg text-[11px] font-mono border transition whitespace-nowrap
                ${simMode===s.k ? "bg-emerald-500 text-black border-emerald-400 font-bold"
                                 : "bg-zinc-950 text-zinc-400 border-zinc-800"}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Month navigation ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-900">
        <button onClick={() => { setViewMonth(6); setSelectedDate(null); }} disabled={viewMonth===6}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors
            ${viewMonth===6 ? "text-zinc-700" : "text-zinc-300 hover:bg-zinc-900"}`}>
          ‹
        </button>
        <div className="text-center">
          <div className="font-display text-base tracking-widest text-zinc-200">
            {viewMonth === 6 ? "JUNE" : "JULY"} 2026
          </div>
          <div className="font-mono text-[10px] text-zinc-600">
            {daysWithMatchesInMonth > 0 ? `${daysWithMatchesInMonth}日間 試合あり` : "この月に試合なし"}
          </div>
        </div>
        <button onClick={() => { setViewMonth(7); setSelectedDate(null); }} disabled={viewMonth===7}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors
            ${viewMonth===7 ? "text-zinc-700" : "text-zinc-300 hover:bg-zinc-900"}`}>
          ›
        </button>
      </div>

      {/* ── Calendar grid ── */}
      <div className="px-3 pt-2 pb-1">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-1">
          {["日","月","火","水","木","金","土"].map((d, i) => (
            <div key={d} className={`text-center text-[10px] font-mono py-1
              ${i===0 ? "text-rose-500" : i===6 ? "text-sky-500" : "text-zinc-600"}`}>{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dateStr, i) => {
            if (!dateStr) return <div key={`e-${i}`} className="aspect-square" />;
            const dayMatches = matchesByDate.get(dateStr) || [];
            const hasMatch = dayMatches.length > 0;
            const isSelected = selectedDate === dateStr;
            const dow = new Date(Date.UTC(2026, parseInt(dateStr.split("-")[1])-1, parseInt(dateStr.split("-")[2]))).getUTCDay();
            const dayNum = parseInt(dateStr.split("-")[2]);
            return (
              <button key={dateStr}
                onClick={() => hasMatch && setSelectedDate(prev => prev === dateStr ? null : dateStr)}
                disabled={!hasMatch}
                className={`rounded-xl py-1 flex flex-col items-center transition-colors min-h-[48px] justify-center
                  ${isSelected ? "bg-emerald-500"
                    : hasMatch ? "bg-zinc-900 active:bg-zinc-800"
                    : ""}`}>
                <span className={`text-xs font-mono leading-none font-semibold
                  ${isSelected ? "text-black"
                    : hasMatch
                      ? dow===0 ? "text-rose-400" : dow===6 ? "text-sky-400" : "text-zinc-200"
                      : dow===0 ? "text-rose-900" : dow===6 ? "text-sky-900" : "text-zinc-700"}`}>
                  {dayNum}
                </span>
                {hasMatch && (
                  <div className="flex gap-0.5 mt-1 flex-wrap justify-center px-1">
                    {dayMatches.slice(0, 5).map((item, j) => (
                      <div key={j} className={`w-1 h-1 rounded-full
                        ${isSelected ? "bg-black/40"
                          : item.isSim ? "bg-amber-400" : "bg-emerald-400"}`} />
                    ))}
                  </div>
                )}
                {hasMatch && isSelected && (
                  <span className="text-[8px] text-black/70 font-mono leading-none mt-0.5">
                    {dayMatches.length}試合
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="flex items-center gap-3 px-4 py-1.5">
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400"/><span className="text-[10px] font-mono text-zinc-600">確定試合</span></div>
        {simMode !== "all" && <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400"/><span className="text-[10px] font-mono text-zinc-600">シム(TBD)</span></div>}
        <div className="ml-auto font-mono text-[10px] text-zinc-700">タップで試合確認</div>
      </div>

      {/* ── Selected date matches ── */}
      {selectedDate && (
        <div className="px-4 mt-1">
          <div className="flex items-center gap-2 mb-2 pt-2 border-t border-zinc-800">
            <div className="font-display text-sm tracking-widest text-emerald-400">
              {fmtShort(selectedDate)}
            </div>
            <div className="flex-1 h-px bg-zinc-800" />
            <button onClick={() => setSelectedDate(null)}
              className="text-zinc-500 text-xs font-mono hover:text-zinc-300 transition-colors">
              ✕ 閉じる
            </button>
          </div>
          {selectedMatches.length === 0 ? (
            <p className="text-zinc-500 text-sm font-mono text-center py-4">該当する試合なし</p>
          ) : (
            <div className="space-y-1.5">
              {selectedMatches.map(item => {
                const key = `${item.match.num}-${item.candidateIndex ?? 0}`;
                return (
                  <CalendarMatchCard key={key} item={item} tzMode={tzMode}
                    expanded={expandedKey === key}
                    onToggle={() => setExpandedKey(prev => prev === key ? null : key)} />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==================== Simulation Tab (GL + KO combined) ====================
function SimTab({ myTeam, setMyTeam }) {
  const [scenario, setScenario] = useState(1);

  const myGroup = useMemo(
    () => GROUP_KEYS.find(g => GROUPS[g].includes(myTeam)),
    [myTeam]
  );

  const sim = useMemo(() => {
    if (scenario === 3) {
      const { standings } = standingsWithMyRank(myTeam, 2);
      const thirdMap = assignThirds(standings);
      const r32Opts = findR32For3rd(myTeam, standings);
      return { kind:"3rd", standings, thirdMap, r32Opts };
    }
    const rankIdx = scenario - 1;
    const { standings } = standingsWithMyRank(myTeam, rankIdx);
    const thirdMap = assignThirds(standings);
    const r32Info = findR32ForRanked(myTeam, rankIdx, standings, thirdMap);
    if (!r32Info) return { kind:"none" };
    const path = traceWinsFrom(r32Info.match.num, myTeam, standings, thirdMap);
    return { kind:"rank", path };
  }, [myTeam, scenario]);

  const myGSMatches = useMemo(() =>
    ALL_MATCHES
      .filter(m => typeof m.team1 === "string" && (m.team1 === myTeam || m.team2 === myTeam))
      .sort((a,b) => a.num - b.num),
    [myTeam]
  );

  return (
    <div className="p-4 space-y-3 pb-24">
      {/* Team selector */}
      <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950">
        <div className="text-[10px] font-mono text-zinc-500 mb-1.5 tracking-widest">TEAM SELECT</div>
        <select value={myTeam} onChange={e => setMyTeam(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 font-semibold">
          {Object.entries(TEAMS).sort((a,b) => a[1].ja.localeCompare(b[1].ja,"ja")).map(([c,t]) => (
            <option key={c} value={c}>{t.flag} {t.ja}</option>
          ))}
        </select>
        <div className="mt-1.5 flex items-center gap-2 font-mono text-[10px] text-zinc-500">
          <span>Group {myGroup}</span>
          <span>·</span>
          <span>FIFA #{FIFA_RANK[myTeam]}</span>
          <span>·</span>
          <span>{TEAMS[myTeam].flag} {TEAMS[myTeam].ja}</span>
        </div>
      </div>

      {/* Scenario selector */}
      <div className="flex gap-1.5">
        {[1,2,3].map(s => (
          <button key={s} onClick={() => setScenario(s)}
            className={`flex-1 py-2.5 rounded-lg font-display tracking-widest text-base border transition
              ${scenario===s ? "bg-emerald-500 text-black border-emerald-400"
                             : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600"}`}>
            {s}位通過
          </button>
        ))}
      </div>

      {/* GL section header */}
      <div className="flex items-center justify-between pt-1">
        <div className="font-display text-xl tracking-widest text-zinc-200">グループリーグ</div>
        <span className="font-mono text-[10px] text-zinc-500">Group {myGroup} · {myGSMatches.length}試合</span>
      </div>

      {myGSMatches.map(m => (
        <MatchCard key={m.num} match={m} myTeam={myTeam}
          opponent={m.team1===myTeam ? m.team2 : m.team1}
          stageLabel="グループリーグ" tone="base" />
      ))}

      {/* Group info */}
      <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950">
        <div className="text-[11px] font-mono text-zinc-400 mb-1.5">GROUP {myGroup} — 同組チーム</div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {GROUPS[myGroup].filter(t => t !== myTeam).map(t => (
            <div key={t} className="flex items-center gap-1.5">
              <span className="font-mono text-zinc-600 w-6">#{FIFA_RANK[t]}</span>
              <FlagTeam code={t} />
            </div>
          ))}
        </div>
      </div>

      {/* KO divider */}
      <div className="flex items-center gap-2 pt-1">
        <div className="flex-1 h-px bg-zinc-800" />
        <div className="font-display text-sm tracking-widest text-zinc-500">決勝トーナメント</div>
        <div className="flex-1 h-px bg-zinc-800" />
      </div>

      <div className="text-[11px] font-mono text-zinc-500 leading-relaxed">
        ※ 他11グループはFIFAランキング順にシミュレート。自チームは常勝想定。
      </div>

      {/* KO path */}
      {scenario === 3 ? (
        <>
          <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5">
            <div className="font-display text-lg tracking-widest text-amber-300 mb-1">3位通過時のR32候補</div>
            <div className="text-[11px] text-amber-100/80">
              グループ{myGroup}の3位はFIFA公式ルールにより以下のいずれかの試合に振り分けられます。
            </div>
          </div>
          {sim.r32Opts && sim.r32Opts.map((opt, i) => (
            <MatchCard key={i} match={opt.match} myTeam={myTeam} opponent={opt.opponent}
              stageLabel={`R32 候補${i+1}`} tone="sim" />
          ))}
          <div className="text-center text-[11px] font-mono text-zinc-500">
            R32を勝ち抜いた後のルートは振り分け先によって異なります。
          </div>
        </>
      ) : sim.kind === "rank" ? (
        <>
          <div className="text-center font-display text-lg tracking-widest text-emerald-400">
            {scenario}位通過 · 全勝パス
          </div>
          {sim.path.map((p, i) => (
            <MatchCard key={i} match={p.match} myTeam={myTeam} opponent={p.opponent}
              stageLabel={stageJa(p.stage)} tone="sim" />
          ))}
          <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-950">
            <div className="font-display text-sm tracking-widest text-zinc-300 mb-1.5">🛫 旅程サマリ</div>
            <div className="space-y-1 text-xs">
              {myGSMatches.map(m => (
                <div key={`gs-${m.num}`} className="flex gap-2 font-mono">
                  <span className="text-emerald-400 w-9">GL</span>
                  <span className="text-zinc-500 w-14">{fmtShort(m.date)}</span>
                  <span className="text-zinc-200">{m.city}</span>
                </div>
              ))}
              {sim.path.map((p, i) => (
                <div key={`ko-${i}`} className="flex gap-2 font-mono">
                  <span className="text-amber-400 w-9">{p.stage}</span>
                  <span className="text-zinc-500 w-14">{fmtShort(p.match.date)}</span>
                  <span className="text-zinc-200">{p.match.city}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

// ==================== Main App ====================
export default function App() {
  const [myTeam, setMyTeam] = useState("JPN");
  const [tab, setTab] = useState("sim");

  return (
    <div className="min-h-screen bg-black text-zinc-100" style={{
      fontFamily: "'Noto Sans JP', sans-serif",
      backgroundImage: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16,185,129,0.12) 0%, transparent 60%), radial-gradient(ellipse 80% 50% at 50% 100%, rgba(244,63,94,0.08) 0%, transparent 60%)",
      paddingTop: "env(safe-area-inset-top)",
      paddingBottom: "env(safe-area-inset-bottom)",
    }}>
      <div className="mx-auto" style={{ maxWidth: 440 }}>
        {/* ---- Header ---- */}
        <header className="px-5 pt-5 pb-4 border-b border-zinc-900">
          <div className="font-display text-4xl leading-none tracking-widest">
            ROAD TO<br/><span className="text-emerald-400">2026</span>
          </div>
          <div className="text-[10px] font-mono text-zinc-500 tracking-[0.2em] mt-1">
            FIFA WORLD CUP · SIMULATOR
          </div>
        </header>

        {/* ---- Tabs ---- */}
        <div className="grid grid-cols-2 border-b border-zinc-900 sticky bg-black/95 backdrop-blur z-10"
             style={{ top: "env(safe-area-inset-top)" }}>
          {[
            { k:"sim", label:"試合SIM" },
            { k:"cal", label:"カレンダー" },
          ].map(t => (
            <button key={t.k} onClick={() => setTab(t.k)}
              className={`py-3 font-display text-base tracking-widest transition-colors
                ${tab===t.k ? "text-emerald-400 border-b-2 border-emerald-400" : "text-zinc-500"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ---- Tab content ---- */}
        {tab === "sim" && <SimTab myTeam={myTeam} setMyTeam={setMyTeam} />}
        {tab === "cal" && <CalendarTab myTeam={myTeam} />}

        <footer className="text-center py-6 text-[10px] font-mono text-zinc-700 tracking-widest">
          ALL TIMES ET · DATA: FIFA v17 (10 APR 2026) · FIFA RANK APR 2026
        </footer>
      </div>
    </div>
  );
}
