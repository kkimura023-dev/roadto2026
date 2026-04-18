import React, { useState, useMemo } from "react";

// ==========================================================================
// FIFA WORLD CUP 2026 — ROAD SIMULATOR v2
// - Team pick → GS list + R32~Final branching by 1st/2nd/3rd place
// - 3rd place shows ALL possible R32 opponents (up to 4)
// - Other 11 groups: seed by FIFA ranking (Apr 2026)
// - Times: ET (primary) + (local offset) + JST
// - Venue: Google Maps link + in-app map pin
// - Google Calendar 1-click add
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

// ---------- FIFA Ranking (April 2026) lower number = higher rank ----------
const FIFA_RANK = {
  FRA: 1,  ESP: 2,  ARG: 3,  ENG: 4,  POR: 5,  BRA: 6,  NED: 7,  MAR: 8,
  BEL: 9,  GER: 10, CRO: 11, SEN: 12, COL: 13, USA: 14, MEX: 15, URU: 16,
  SUI: 17, JPN: 18, IRN: 19, KOR: 20, ECU: 21, AUT: 22, TUR: 23, AUS: 24,
  CAN: 25, NOR: 26, PAN: 27, CIV: 28, SCO: 29, PAR: 30, TUN: 31, ALG: 32,
  EGY: 33, SWE: 34, CZE: 35, IRQ: 36, JOR: 37, QAT: 38, RSA: 39,
  KSA: 40, CPV: 41, GHA: 42, COD: 43, UZB: 44, BIH: 45, CUW: 46, HAI: 47, NZL: 48,
};

// ---------- Groups ----------
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

// ---------- Venue metadata ----------
const VENUES = {
  "BC Place":                   { city:"Vancouver",              tz:"PT",  lat:49.2766, lng:-123.1118 },
  "Lumen Field":                { city:"Seattle",                 tz:"PT",  lat:47.5952, lng:-122.3316 },
  "Levi's Stadium":             { city:"San Francisco Bay Area", tz:"PT",  lat:37.4032, lng:-121.9697 },
  "SoFi Stadium":               { city:"Los Angeles",             tz:"PT",  lat:33.9534, lng:-118.3387 },
  "Estadio Akron":              { city:"Guadalajara",             tz:"CST", lat:20.6819, lng:-103.4624 },
  "Estadio Azteca":             { city:"Mexico City",             tz:"CST", lat:19.3029, lng:-99.1505 },
  "Estadio BBVA":               { city:"Monterrey",               tz:"CST", lat:25.6692, lng:-100.2445 },
  "NRG Stadium":                { city:"Houston",                 tz:"CT",  lat:29.6847, lng:-95.4107 },
  "AT&T Stadium":               { city:"Dallas",                  tz:"CT",  lat:32.7473, lng:-97.0945 },
  "Arrowhead Stadium":          { city:"Kansas City",             tz:"CT",  lat:39.0489, lng:-94.4839 },
  "Mercedes-Benz Stadium":      { city:"Atlanta",                 tz:"ET",  lat:33.7554, lng:-84.4008 },
  "Hard Rock Stadium":          { city:"Miami",                   tz:"ET",  lat:25.9580, lng:-80.2389 },
  "BMO Field":                  { city:"Toronto",                 tz:"ET",  lat:43.6332, lng:-79.4185 },
  "Gillette Stadium":           { city:"Boston",                  tz:"ET",  lat:42.0909, lng:-71.2643 },
  "Lincoln Financial Field":    { city:"Philadelphia",            tz:"ET",  lat:39.9008, lng:-75.1675 },
  "MetLife Stadium":            { city:"New York / New Jersey",   tz:"ET",  lat:40.8136, lng:-74.0745 },
};

// Offset from ET (EDT = UTC-4 in June/July). PT=-3, CT=-1, Mexico CST=-2, ET=0
const TZ_OFFSET_FROM_ET = { PT: -3, CT: -1, ET: 0, CST: -2 };

// ---------- All 104 matches (parsed from official PDF v17) ----------
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
  // Round of 32 — sides are abstract slot refs {r: "1A"|"2B"|"3", from:[groups]}
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
  // Round of 16
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
  const pad = (x) => String(x).padStart(2, "0");
  return {
    date: `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth()+1)}-${pad(dt.getUTCDate())}`,
    time: `${pad(dt.getUTCHours())}:${pad(dt.getUTCMinutes())}`,
  };
}
function getLocalOffset(venueName) {
  const v = VENUES[venueName];
  return TZ_OFFSET_FROM_ET[v.tz];
}
function etToLocal(m)  { return addHours(m.date, m.timeET, getLocalOffset(m.venue)); }
function etToJST(m)    { return addHours(m.date, m.timeET, 13); }  // ET(EDT) + 13h = JST
function weekdayJa(dateStr) {
  const [y,mn,d] = dateStr.split("-").map(Number);
  return ["日","月","火","水","木","金","土"][new Date(Date.UTC(y,mn-1,d)).getUTCDay()];
}
function fmtShort(s) { const [,m,d] = s.split("-"); return `${Number(m)}/${Number(d)}(${weekdayJa(s)})`; }
function offsetLabel(n) { return n === 0 ? "±0" : (n > 0 ? `+${n}` : `${n}`); }

// Rank-based GS standings: for each group, order teams by FIFA rank (best → worst)
function seedStandings() {
  const s = {};
  GROUP_KEYS.forEach(g => {
    s[g] = [...GROUPS[g]].sort((a,b) => FIFA_RANK[a] - FIFA_RANK[b]);
  });
  return s;
}

// Override only myTeam's rank within its group; others keep rank order
function standingsWithMyRank(myTeam, myRank /* 0..3 */) {
  const seed = seedStandings();
  const g = GROUP_KEYS.find(k => GROUPS[k].includes(myTeam));
  const arr = seed[g].filter(t => t !== myTeam);   // 3 teams in original rank order
  arr.splice(myRank, 0, myTeam);                   // insert myTeam at chosen position
  seed[g] = arr;
  return { standings: seed, myGroup: g };
}

// Assign 3rd-place teams to R32 slots (greedy, allowed-group order)
// Returns: { [r32MatchNum]: group-letter }
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
function assignThirds(standings /* all 12 groups 3rd-place teams */) {
  const used = new Set();
  const map = {};
  for (const slot of R32_THIRD_SLOTS) {
    const pick = slot.from.find(g => !used.has(g));
    if (pick) { map[slot.num] = pick; used.add(pick); }
  }
  return map;
}

// Resolve a R32 slot object to an actual team code (given standings + thirdMap)
function resolveSlot(side, standings, thirdMap, r32MatchNum) {
  if (side.r) {
    if (side.r[0] === "1") return standings[side.r[1]][0];
    if (side.r[0] === "2") return standings[side.r[1]][1];
    if (side.r === "3") {
      const g = thirdMap[r32MatchNum];
      return g ? standings[g][2] : null;
    }
  }
  return null;
}

// Given a team + rank (0=1st, 1=2nd), find which R32 match they play in (and opponent)
function findR32ForRanked(team, rank, standings, thirdMap) {
  const r32Matches = ALL_MATCHES.filter(m => m.group === "R32");
  for (const m of r32Matches) {
    const t1 = resolveSlot(m.team1, standings, thirdMap, m.num);
    const t2 = resolveSlot(m.team2, standings, thirdMap, m.num);
    if (t1 === team || t2 === team) {
      return { match: m, opponent: t1 === team ? t2 : t1 };
    }
  }
  return null;
}

// For 3rd-place: the team MIGHT go to any R32 slot whose allowed groups contain its group.
// Return the full list of possibilities with opponents assuming the R32 uses that slot.
function findR32For3rd(team, standings) {
  const g = GROUP_KEYS.find(k => GROUPS[k].includes(team));
  const possibleSlots = R32_THIRD_SLOTS.filter(s => s.from.includes(g));
  return possibleSlots.map(slot => {
    const m = ALL_MATCHES.find(mm => mm.num === slot.num);
    // Opponent is the "1X" side → use X's 1st-place team in standings
    const otherSide = m.team1.r && m.team1.r[0] === "1" ? m.team1 : m.team2;
    const opponent = standings[otherSide.r[1]][0];
    return { match: m, opponent };
  });
}

// Resolve later rounds assuming our team wins every match
function traceWinsFrom(r32MatchNum, team, standings, thirdMap) {
  // Build win table: each match's winner
  const winners = {};
  // First, pre-resolve all R32 matchups (t1, t2) so we can pick both sides
  const r32Resolved = {};
  ALL_MATCHES.filter(m => m.group === "R32").forEach(m => {
    r32Resolved[m.num] = {
      t1: resolveSlot(m.team1, standings, thirdMap, m.num),
      t2: resolveSlot(m.team2, standings, thirdMap, m.num),
    };
  });

  // Mark our team winning its R32
  winners[r32MatchNum] = team;
  // For every other R32, pick the higher-FIFA-ranked team as winner
  ALL_MATCHES.filter(m => m.group === "R32").forEach(m => {
    if (m.num === r32MatchNum) return;
    const { t1, t2 } = r32Resolved[m.num];
    if (!t1 || !t2) return;
    winners[m.num] = FIFA_RANK[t1] < FIFA_RANK[t2] ? t1 : t2;
  });

  // Now resolve R16/QF/SF/F/3rd progressively, our team always wins
  const resolveKOSide = (side) => {
    if (side.w !== undefined) return winners[side.w] || null;
    if (side.l !== undefined) {
      const m = ALL_MATCHES.find(mm => mm.num === side.l);
      if (!m) return null;
      const w = winners[side.l];
      if (!w) return null;
      // get loser
      const sides = [m.team1, m.team2];
      const resolved = sides.map(s => {
        if (s.w !== undefined) return winners[s.w];
        if (s.r) return null;  // shouldn't happen here
        return null;
      });
      // for 3rd-place it's from SF matches, those have .w sides
      const t1 = resolveKOSide(m.team1);
      const t2 = resolveKOSide(m.team2);
      return t1 === w ? t2 : t1;
    }
    return null;
  };

  const stages = ["R16", "QF", "SF", "FINAL"];
  const path = [];
  // Add R32 entry
  const r32Match = ALL_MATCHES.find(m => m.num === r32MatchNum);
  const r32 = r32Resolved[r32MatchNum];
  path.push({
    stage: "R32",
    match: r32Match,
    opponent: r32.t1 === team ? r32.t2 : r32.t1,
  });

  for (const stage of stages) {
    const matches = ALL_MATCHES.filter(m => m.group === stage);
    let foundInStage = null;
    for (const m of matches) {
      const t1 = resolveKOSide(m.team1);
      const t2 = resolveKOSide(m.team2);
      if (!t1 || !t2) continue;
      if (t1 === team || t2 === team) {
        foundInStage = { match: m, opponent: t1 === team ? t2 : t1 };
        winners[m.num] = team; // our team keeps winning
      } else {
        // pick higher-ranked
        winners[m.num] = FIFA_RANK[t1] < FIFA_RANK[t2] ? t1 : t2;
      }
    }
    if (foundInStage) {
      path.push({ stage, match: foundInStage.match, opponent: foundInStage.opponent });
    } else {
      break;
    }
  }
  return path;
}

// ==================== Google Calendar link ====================
function gcalLink(match, team1Code, team2Code) {
  // Build start/end in UTC; ET=EDT=UTC-4 in June/July
  const [y,mo,d] = match.date.split("-").map(Number);
  const [h,mi] = match.timeET.split(":").map(Number);
  const startUTC = new Date(Date.UTC(y, mo-1, d, h+4, mi));  // ET→UTC
  const endUTC = new Date(startUTC.getTime() + 2*60*60*1000); // 2h duration
  const fmt = (dt) => dt.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"");
  const t1 = team1Code && TEAMS[team1Code] ? TEAMS[team1Code].ja : (team1Code || "TBD");
  const t2 = team2Code && TEAMS[team2Code] ? TEAMS[team2Code].ja : (team2Code || "TBD");
  const title = `${t1} vs ${t2} — W杯2026 ${stageJa(match.group)}`;
  const details = `FIFA World Cup 2026 Match #${match.num}\n会場: ${match.venue} (${match.city})\nET: ${match.date} ${match.timeET}`;
  const loc = `${match.venue}, ${match.city}`;
  const u = new URL("https://calendar.google.com/calendar/render");
  u.searchParams.set("action","TEMPLATE");
  u.searchParams.set("text", title);
  u.searchParams.set("dates", `${fmt(startUTC)}/${fmt(endUTC)}`);
  u.searchParams.set("details", details);
  u.searchParams.set("location", loc);
  return u.toString();
}

function stageJa(g) {
  return { R32:"R32", R16:"R16", QF:"準々決勝", SF:"準決勝", FINAL:"決勝", "3RD":"3位決定戦",
    A:"GL", B:"GL", C:"GL", D:"GL", E:"GL", F:"GL", G:"GL", H:"GL", I:"GL", J:"GL", K:"GL", L:"GL"
  }[g] || g;
}

function gmapsLink(venue) {
  const v = VENUES[venue];
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue + ", " + v.city)}`;
}

// ==================== UI Components ====================
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
  const local = etToLocal(match);
  const jst = etToJST(match);
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
         className="text-[10px] font-mono px-1.5 py-0.5 border border-zinc-700 rounded hover:border-sky-400 hover:text-sky-400 text-zinc-400">
        地図↗
      </a>
    </div>
  );
}

function MatchCard({ match, myTeam, opponent, stageLabel, tone="base", actionLabel }) {
  // tone: "base" (group stage / confirmed), "sim" (simulated KO)
  const t1 = match.team1;
  const t2 = match.team2;
  // For group stage the match data has team codes directly
  let shownT1 = typeof t1 === "string" ? t1 : null;
  let shownT2 = typeof t2 === "string" ? t2 : null;
  // If KO (objects), we show myTeam vs opponent
  if (!shownT1) { shownT1 = myTeam; shownT2 = opponent; }
  // Ensure myTeam is on the left
  if (myTeam && shownT2 === myTeam) { [shownT1, shownT2] = [shownT2, shownT1]; }

  return (
    <div className={`relative rounded-2xl overflow-hidden border
      ${tone === "sim"
        ? "border-amber-500/30 bg-gradient-to-br from-amber-950/20 to-zinc-950"
        : "border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 to-zinc-950"}`}>
      {/* LED-board header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-black/60 border-b border-zinc-800">
        <div className="flex items-baseline gap-2">
          <span className={`font-display text-lg tracking-widest
            ${tone==="sim" ? "text-amber-400" : "text-emerald-400"}`}>
            {stageLabel}
          </span>
          <span className="font-mono text-[9px] text-zinc-500">#{String(match.num).padStart(3,"0")}</span>
        </div>
        <span className={`font-mono text-[9px] tracking-widest uppercase px-1.5 py-0.5 rounded
          ${tone==="sim" ? "text-amber-300 bg-amber-500/10" : "text-emerald-300 bg-emerald-500/10"}`}>
          {tone === "sim" ? "SIM" : "CONFIRMED"}
        </span>
      </div>

      <div className="px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0"><FlagTeam code={shownT1} size="lg" /></div>
          <span className="font-display text-xl text-zinc-600 tracking-widest shrink-0">VS</span>
          <div className="flex-1 min-w-0 text-right">
            <div className="inline-flex items-center justify-end gap-1.5 min-w-0">
              <span className={`font-semibold truncate text-sm`}>
                {shownT2 && TEAMS[shownT2] ? TEAMS[shownT2].ja : "未定"}
              </span>
              <span className="text-2xl">{shownT2 && TEAMS[shownT2] ? TEAMS[shownT2].flag : "❓"}</span>
            </div>
          </div>
        </div>

        <TimeRow match={match} />
        <VenueRow match={match} />

        <div className="mt-3 flex gap-2">
          <a
            href={gcalLink(match, shownT1, shownT2)}
            target="_blank" rel="noopener noreferrer"
            className="flex-1 text-center text-[11px] font-mono py-1.5 border border-zinc-700 rounded hover:border-emerald-400 hover:text-emerald-400 text-zinc-300"
          >
            📅 Google カレンダーに追加
          </a>
        </div>
      </div>
    </div>
  );
}

// Simple SVG map of North America with venue pins
function VenueMap({ highlightVenues = [] }) {
  // Simple lat/lng projection (Mercator-lite) over a fixed bounding box
  const MIN_LNG = -125, MAX_LNG = -70;
  const MIN_LAT = 18,   MAX_LAT = 50;
  const W = 340, H = 220;
  const proj = (lat, lng) => ({
    x: ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * W,
    y: H - ((lat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * H,
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto rounded-xl border border-zinc-800 bg-zinc-950" preserveAspectRatio="xMidYMid meet">
      {/* Very approximate coast silhouette */}
      <path
        d="M 15 40 L 55 28 L 95 30 L 135 25 L 175 30 L 215 25 L 260 35 L 295 50
           L 310 80 L 320 110 L 325 150 L 300 180 L 260 195 L 215 205 L 170 200
           L 130 210 L 95 205 L 60 185 L 35 155 L 20 110 Z"
        fill="#0f172a" stroke="#1e293b" strokeWidth="1"
      />
      {/* Venue pins */}
      {Object.entries(VENUES).map(([name, v]) => {
        const p = proj(v.lat, v.lng);
        const isHighlighted = highlightVenues.includes(name);
        return (
          <g key={name}>
            <circle cx={p.x} cy={p.y} r={isHighlighted ? 6 : 2.5}
                    fill={isHighlighted ? "#10b981" : "#475569"}
                    stroke={isHighlighted ? "#6ee7b7" : "none"}
                    strokeWidth={isHighlighted ? 1.5 : 0}
                    className={isHighlighted ? "animate-pulse" : ""} />
            {isHighlighted && (
              <text x={p.x} y={p.y - 9} fontSize="8" textAnchor="middle"
                    fill="#6ee7b7" className="font-mono" style={{ fontFamily: "IBM Plex Mono" }}>
                {v.city}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ==================== Main App ====================
export default function App() {
  const [myTeam, setMyTeam] = useState("JPN");
  const [scenario, setScenario] = useState(1);  // 1, 2, 3 (1st, 2nd, 3rd)
  const [tab, setTab] = useState("gs");         // "gs" | "ko" | "map"

  const myGroup = useMemo(
    () => GROUP_KEYS.find(g => GROUPS[g].includes(myTeam)),
    [myTeam]
  );

  // Scenario → computed path
  const sim = useMemo(() => {
    if (scenario === 3) {
      // 3rd place: show possibilities
      const { standings } = standingsWithMyRank(myTeam, 2);
      const thirdMap = assignThirds(standings);
      const r32Opts = findR32For3rd(myTeam, standings);
      return { kind:"3rd", standings, thirdMap, r32Opts };
    } else {
      const rankIdx = scenario - 1; // 0 or 1
      const { standings } = standingsWithMyRank(myTeam, rankIdx);
      const thirdMap = assignThirds(standings);
      const r32Info = findR32ForRanked(myTeam, rankIdx, standings, thirdMap);
      if (!r32Info) return { kind:"none" };
      const path = traceWinsFrom(r32Info.match.num, myTeam, standings, thirdMap);
      return { kind:"rank", path };
    }
  }, [myTeam, scenario]);

  // GS matches for my team
  const myGSMatches = useMemo(() =>
    ALL_MATCHES
      .filter(m => typeof m.team1 === "string" && (m.team1 === myTeam || m.team2 === myTeam))
      .sort((a,b) => a.num - b.num),
    [myTeam]
  );

  // Venues to highlight on the map
  const highlightVenues = useMemo(() => {
    const v = new Set(myGSMatches.map(m => m.venue));
    if (sim.kind === "rank") sim.path.forEach(p => v.add(p.match.venue));
    if (sim.kind === "3rd") sim.r32Opts.forEach(o => v.add(o.match.venue));
    return Array.from(v);
  }, [myGSMatches, sim]);

  return (
    <div className="min-h-screen bg-black text-zinc-100" style={{
      fontFamily: "'Noto Sans JP', sans-serif",
      backgroundImage: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16,185,129,0.12) 0%, transparent 60%), radial-gradient(ellipse 80% 50% at 50% 100%, rgba(244,63,94,0.08) 0%, transparent 60%)"
    }}>
      <div className="mx-auto" style={{ maxWidth: 440 }}>
        {/* ---- Header ---- */}
        <header className="px-5 pt-6 pb-4 border-b border-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display text-4xl leading-none tracking-widest">
                ROAD TO<br/><span className="text-emerald-400">2026</span>
              </div>
              <div className="text-[10px] font-mono text-zinc-500 tracking-[0.2em] mt-1">
                FIFA WORLD CUP · SIMULATOR
              </div>
            </div>
            <div className="text-right">
              <select value={myTeam} onChange={e=>setMyTeam(e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-sm mb-1">
                {Object.entries(TEAMS).sort((a,b)=>a[1].ja.localeCompare(b[1].ja,"ja")).map(([c,t]) => (
                  <option key={c} value={c}>{t.flag} {t.ja}</option>
                ))}
              </select>
              <div className="font-mono text-[10px] text-zinc-500">Group {myGroup} · FIFA#{FIFA_RANK[myTeam]}</div>
            </div>
          </div>
        </header>

        {/* ---- Tabs ---- */}
        <div className="grid grid-cols-3 border-b border-zinc-900 sticky top-0 bg-black/95 backdrop-blur z-10">
          {[
            {k:"gs",  label:"GL試合"},
            {k:"ko",  label:"決勝T"},
            {k:"map", label:"MAP"},
          ].map(t => (
            <button key={t.k} onClick={()=>setTab(t.k)}
              className={`py-3 font-display text-base tracking-widest
                ${tab===t.k ? "text-emerald-400 border-b-2 border-emerald-400" : "text-zinc-500"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ---- GS Tab ---- */}
        {tab === "gs" && (
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-display text-xl tracking-widest text-zinc-200">
                グループリーグ
              </div>
              <span className="font-mono text-[10px] text-zinc-500">Group {myGroup} · {myGSMatches.length}試合</span>
            </div>
            {myGSMatches.map(m => (
              <MatchCard key={m.num} match={m} myTeam={myTeam}
                opponent={m.team1===myTeam ? m.team2 : m.team1}
                stageLabel="グループリーグ" tone="base" />
            ))}
            <div className="mt-4 p-3 rounded-xl border border-zinc-800 bg-zinc-950">
              <div className="text-[11px] font-mono text-zinc-400">GROUP {myGroup} — 他のチーム</div>
              <div className="mt-1.5 grid grid-cols-2 gap-1 text-xs">
                {GROUPS[myGroup].filter(t => t !== myTeam).map(t => (
                  <div key={t} className="flex items-center gap-1.5">
                    <span className="font-mono text-zinc-600 w-6">#{FIFA_RANK[t]}</span>
                    <FlagTeam code={t} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---- KO Tab ---- */}
        {tab === "ko" && (
          <div className="p-4 space-y-3 pb-20">
            {/* Scenario selector */}
            <div className="flex gap-1.5">
              {[1,2,3].map(s => (
                <button key={s} onClick={()=>setScenario(s)}
                  className={`flex-1 py-2.5 rounded-lg font-display tracking-widest text-base border transition
                    ${scenario===s
                      ? "bg-emerald-500 text-black border-emerald-400"
                      : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600"}`}>
                  {s}位通過
                </button>
              ))}
            </div>

            <div className="text-[11px] font-mono text-zinc-500 leading-relaxed">
              ※ 他11グループはFIFAランキング順に1位〜4位が決まる前提でシミュレート。<br/>
              ※ 決勝Tは自チームが常勝する想定。他試合は高ランクチーム勝利で解決。
            </div>

            {scenario === 3 ? (
              <>
                <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5">
                  <div className="font-display text-lg tracking-widest text-amber-300 mb-1">
                    3位通過時のR32候補
                  </div>
                  <div className="text-[11px] text-amber-100/80">
                    3位通過した場合、グループ{myGroup}の3位は以下のいずれかの試合に振り分けられます(FIFA公式ルールでベスト8の3位通過チームの組み合わせにより決定)。
                  </div>
                </div>
                {sim.r32Opts && sim.r32Opts.map((opt, i) => (
                  <MatchCard key={i} match={opt.match} myTeam={myTeam} opponent={opt.opponent}
                    stageLabel={`R32 候補${i+1}`} tone="sim" />
                ))}
                <div className="text-center text-[11px] font-mono text-zinc-500 mt-2">
                  R32を勝ち抜けた先のトーナメント進行は、どの候補に入るかで変わります。
                </div>
              </>
            ) : sim.kind === "rank" ? (
              <>
                <div className="text-center font-display text-lg tracking-widest text-emerald-400">
                  {scenario}位通過シナリオ · 全勝パス
                </div>
                {sim.path.map((p, i) => (
                  <MatchCard key={i} match={p.match} myTeam={myTeam} opponent={p.opponent}
                    stageLabel={stageJa(p.stage)} tone="sim" />
                ))}
                <div className="mt-4 p-3 rounded-xl border border-zinc-800 bg-zinc-950">
                  <div className="font-display text-sm tracking-widest text-zinc-300 mb-1.5">
                    🛫 旅程サマリ
                  </div>
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
        )}

        {/* ---- Map Tab ---- */}
        {tab === "map" && (
          <div className="p-4 space-y-3 pb-20">
            <div className="font-display text-xl tracking-widest text-zinc-200 mb-1">
              試合会場マップ
            </div>
            <div className="text-[11px] font-mono text-zinc-500 mb-2">
              {TEAMS[myTeam].flag} {TEAMS[myTeam].ja}の関連会場をハイライト ({highlightVenues.length}箇所)
            </div>
            <VenueMap highlightVenues={highlightVenues} />
            <div className="mt-3 space-y-1.5">
              {highlightVenues.map(v => (
                <a key={v} href={gmapsLink(v)} target="_blank" rel="noopener noreferrer"
                   className="flex items-center justify-between px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 hover:border-emerald-500/40 transition">
                  <div className="text-xs min-w-0">
                    <div className="text-zinc-200 truncate">{v}</div>
                    <div className="text-zinc-500 font-mono text-[10px]">{VENUES[v].city}</div>
                  </div>
                  <span className="text-[10px] font-mono text-sky-400">Google Maps↗</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <footer className="text-center py-6 text-[10px] font-mono text-zinc-700 tracking-widest">
          ALL TIMES ET · DATA: FIFA v17 (10 APR 2026) · FIFA RANK APR 2026
        </footer>
      </div>

    </div>
  );
}
