// p5 마법 스쿨 앱
// Legion ALWAYS LEARNING: 무조건 과정 속 학습 · 배움 · 이해 · 깨달음
// Da Vinci anatomy/notebook + full-cheat fusion/cast cross (Morpheus orchestrator p4/p5): Vitruvian cast buffs, sfumato spell FX, notebook insight log. p3 voice + p2 narrative sync. Sense + cheat: FOMO limited grimoires, MY familiar.
// 수평 병렬 업그레이드 적용
// p6 Lung Surprise Eye + Ache-Breath + 창발 pain CROSS DNA (Sovereign advance): spell eyes = lung surprise reveal
(function injectP6SpellLung() {
  try {
    const s = window.getP6LungSurprise ? window.getP6LungSurprise() : (JSON.parse(localStorage.getItem('p6_lungSurpriseCross')||'{}').surprise || 0);
    const acheCross = JSON.parse(localStorage.getItem('legion_lung_ache_cross')||'{}');
    if (s > 0.1) {
      window.p6SpellLungEye = { spellReveal: s * 1.2, ache: acheCross.ache || 0, cast: 'p6 lung surprise opens p5 spell iris on high variance' };
      // when casting spells, surprise from p6 voice can trigger unexpected reveal (FOMO + 창발)
    }
  } catch(e){}
})();

let state = {
  magicPower: 42,
  knowledge: 28,
  streak: 7,
  spells: [],
  insights: [],
  familiar: null,  // p3 persona linked as familiar spirit
  lastPlayDate: null,
  dailyLessons: 0,
  breathFuel: 0.7,   // p6 cross: Ache-Breath / spore fuel
  lungSurprise: 0.12 // p6 Lung Surprise Eye
};

// Streak + FOMO (full)
function getStreakP5() {
  try {
    const raw = localStorage.getItem('p5-streak');
    const base = raw ? JSON.parse(raw) : { lastDate: null, count: 0, days: (state && state.streak ? state.streak : 1) };
    if (typeof base.days !== 'number') base.days = 1;
    return base;
  } catch { return { lastDate: null, count: 0, days: (state && state.streak ? state.streak : 1) }; }
}
function p5DayKey(offset) {
  const d = new Date(Date.now() + (offset || 0) * 86400000);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function updateStreakOnLesson() {
  const today = p5DayKey(0);
  let s = getStreakP5();
  if (s.lastDate !== today) {
    const yest = p5DayKey(-1);
    const y2 = p5DayKey(-2);
    let froze = false;
    // Duolingo freeze: 1 missed day once/7d if days≥3
    if (s.lastDate && s.lastDate !== yest && s.lastDate === y2 && (s.days || 0) >= 3) {
      const ready = !s.shieldLast || ((new Date(today) - new Date(s.shieldLast)) / 86400000) >= 7;
      if (ready) {
        s.shieldLast = today;
        s.lastDate = yest;
        froze = true;
        try {
          if (typeof showToast === 'function') showToast('🛡️ 연속 보호막 · ' + s.days + '일 유지');
          else if (window.legionTrack) legionTrack('streak_freeze', { count: s.days });
        } catch (e) {}
        try { if (window.legionTrack) legionTrack('streak_freeze', { count: s.days }); } catch (e) {}
      }
    }
    if (s.lastDate === yest) {
      s.days = (s.days || 1) + 1;
    } else {
      s.days = 1;
    }
    s.lastDate = today;
    s.count = 1;
    state.lastPlayDate = today;
    state.dailyLessons = 1;
    try { if (window.legionTrack) legionTrack('streak', { count: s.days, froze: froze }); } catch (e) {}
  } else {
    s.count = (s.count || 0) + 1;
    state.dailyLessons = (state.dailyLessons || 0) + 1;
  }
  try { localStorage.setItem('p5-streak', JSON.stringify(s)); } catch(e){}
  state.streak = s.days;
  renderStreakFomoP5();
  return s;
}
function renderStreakFomoP5() {
  const s = getStreakP5();
  const el = document.getElementById('streak-fomo-text');
  if (el) {
    const nextMilestone = Math.ceil((s.days + 1) / 3) * 3;
    const remain = Math.max(0, nextMilestone - s.days);
    const shieldReady = !s.shieldLast || ((new Date(p5DayKey(0)) - new Date(s.shieldLast)) / 86400000) >= 7;
    el.textContent = `다음 보상 ${remain}일` + ((s.days || 0) >= 3 && shieldReady ? ' · 🛡️' : '');
  }
  const stat = document.getElementById('streak');
  if (stat) stat.textContent = s.days + '일';
}

const SPELLS = {
  elemental: { name: "원소 조율", desc: "타이밍 홀드 — 불과 물의 균형을 읽는다." },
  illusion: { name: "환영의 베일", desc: "메모리 시퀀스 — 거짓과 진실을 구분한다." },
  binding: { name: "구속의 주문", desc: "축적 빌드업 — 의지를 실체에 묶는다." },
  echo: { name: "에코 마법", desc: "에코 recall — 지난 마법의 잔향을 재현한다." },
  shadow: { name: "그림자 은신", desc: "적의 시선을 피한다. (한정 주문)" },
  spark: { name: "스파크 점화", desc: "타이밍 — 작은 불꽃으로 시작해 큰 화염으로." },
  reaction: { name: "반응 주문", desc: "순간의 흐름을 포착 — 시간 압박 속 반응." },
  'ache-breath': { name: "호흡의 각인", desc: "깊은 호흡이 마법이 된 창발 주문. 호흡 연료에 공명한다." }
};

// 정령 보너스 표기용 — 내부 주문 키를 유저용 한글 라벨로 변환
function SPELL_LABEL(key) {
  if (key === 'default') return '기본';
  return (SPELLS[key] && SPELLS[key].name) ? SPELLS[key].name : key;
}

// =====================================================================
// REAL LEARNING CORE — 아르카나 지식 덱 (진짜 배움)
// 마법 학원의 껍질 안에 실제로 학습 가능한 지식을 담는다.
// 각 카드: 진짜 사실 + 진짜 정답 + 진짜 해설(왜 그런지). placeholder 아님.
// 출처 계열: 어원학(그리스/라틴), 천문학, 신화, 광물/원소. 전부 검증 가능한 실사실.
// =====================================================================
const ARCANA = [
  // --- 어원 계열: "룬(어근)의 진짜 의미" ---
  { id:'et_astro', school:'룬어원', front:'룬 "astro-"는 무엇의 진짜 뜻인가?',
    choices:['별(star)','불(fire)','물(water)','땅(earth)'], answer:0,
    lore:'천문(astronomy)·점성(astrology)의 뿌리.',
    fact:'그리스어 astḗr = "별". astronomy = astron(별)+nomos(법칙) = 별의 법칙. asterisk(*)도 "작은 별"이라는 뜻.' },
  { id:'et_hydro', school:'룬어원', front:'룬 "hydro-"의 진짜 뜻은?',
    choices:['불','물(water)','공기','빛'], answer:1,
    lore:'수원(水) 계열 주문의 어근.',
    fact:'그리스어 hydōr = "물". hydrant(소화전), dehydrate(탈수), hydrogen = "물을 만드는 것"(연소 시 물 생성).' },
  { id:'et_pyro', school:'룬어원', front:'룬 "pyro-"의 진짜 뜻은?',
    choices:['불(fire)','얼음','바람','금속'], answer:0,
    lore:'화염(火) 계열 주문의 어근.',
    fact:'그리스어 pŷr = "불". pyromania(방화벽), pyre(장작더미), pyrotechnics(불꽃놀이 기술).' },
  { id:'et_geo', school:'룬어원', front:'룬 "geo-"의 진짜 뜻은?',
    choices:['하늘','바다','땅(earth)','시간'], answer:2,
    lore:'대지(地) 계열 주문의 어근.',
    fact:'그리스어 gê = "땅/지구". geography = 땅을 그림, geology = 땅의 학문, geometry = 땅을 재다(측량에서 유래).' },
  { id:'et_chrono', school:'룬어원', front:'룬 "chrono-"의 진짜 뜻은?',
    choices:['공간','시간(time)','기억','운명'], answer:1,
    lore:'시간 조작 계열의 어근.',
    fact:'그리스어 khrónos = "시간". chronometer(정밀시계), chronological(시간 순), anachronism = 시대착오.' },
  { id:'et_photo', school:'룬어원', front:'룬 "photo-"의 진짜 뜻은?',
    choices:['소리','빛(light)','그림자','열'], answer:1,
    lore:'광휘(光) 계열 주문의 어근.',
    fact:'그리스어 phôs/phōtós = "빛". photograph = 빛으로 그리다, photon(광자), photosynthesis = 빛으로 합성.' },
  // --- 천문 계열: "천체의 진실" ---
  { id:'as_sun', school:'천문', front:'태양은 무엇으로 빛나는가?',
    choices:['불타는 석탄','수소 핵융합','전기 방전','마찰열'], answer:1,
    lore:'모든 화염 주문의 근원별.',
    fact:'태양은 중심부에서 수소를 헬륨으로 융합(핵융합)하며 빛과 열을 낸다. 매초 약 6억 톤 수소가 융합된다.' },
  { id:'as_light', school:'천문', front:'태양빛이 지구에 닿는 데 걸리는 시간은?',
    choices:['즉시','약 8분','약 1시간','하루'], answer:1,
    lore:'빛의 잔향(에코)이 우주를 건너는 시간.',
    fact:'빛 속도는 초속 30만 km. 태양~지구 약 1억5천만 km를 약 8분 20초에 건넌다. 즉 지금 보는 태양은 8분 전의 모습.' },
  { id:'as_moon', school:'천문', front:'달이 항상 같은 면만 보이는 이유는?',
    choices:['자전을 안 해서','조석 고정(동주기 자전)','지구가 가려서','너무 멀어서'], answer:1,
    lore:'월식 이벤트의 진짜 원리.',
    fact:'달의 자전 주기와 공전 주기가 같아(조석 고정) 한 면만 지구를 향한다. 뒷면은 지구에서 결코 보이지 않는다.' },
  { id:'as_star', school:'천문', front:'밤하늘 별빛은 사실 무엇인가?',
    choices:['현재의 빛','과거의 빛','미래의 빛','반사광'], answer:1,
    lore:'에코 마법의 우주적 증거.',
    fact:'별은 수 광년~수천 광년 떨어져 있어, 그 빛은 수년~수천년 전에 출발한 것. 별을 본다는 건 과거를 보는 것과 같다.' },
  // --- 신화 계열: "정령의 기원" ---
  { id:'my_phoenix', school:'신화', front:'불사조(Phoenix) 신화의 핵심 상징은?',
    choices:['영원한 젊음','죽음과 재생','무한한 부','예언'], answer:1,
    lore:'화염 정령의 기원 설화.',
    fact:'불사조는 자신의 재 속에서 다시 태어난다. 그리스·이집트 신화에서 죽음→재생의 순환을 상징한다.' },
  { id:'my_prometheus', school:'신화', front:'프로메테우스가 인류에게 준 것은?',
    choices:['물','불(과 지혜)','금','시간'], answer:1,
    lore:'스파크 점화 주문의 신화적 뿌리.',
    fact:'프로메테우스는 신들에게서 불을 훔쳐 인류에게 주고, 그 벌로 매일 간을 쪼이는 형벌을 받았다. 불=문명·지식의 상징.' },
  { id:'my_echo', school:'신화', front:'그리스 신화에서 "에코(Echo)"는 원래 누구인가?',
    choices:['바다의 신','목소리를 잃은 님프','불의 여신','달의 여신'], answer:1,
    lore:'에코 마법의 이름이 유래한 곳.',
    fact:'에코는 헤라의 저주로 남의 말 끝만 반복하게 된 님프. 나르키소스를 짝사랑하다 몸이 스러지고 목소리(메아리)만 남았다.' },
  // --- 광물/원소 계열: "물질의 진실" ---
  { id:'mn_diamond', school:'물질', front:'다이아몬드는 무엇으로 이루어졌나?',
    choices:['규소','순수한 탄소','철','석영'], answer:1,
    lore:'가장 단단한 마법 결정의 정체.',
    fact:'다이아몬드는 탄소 원자가 정사면체로 강하게 결합한 것. 흑연(연필심)과 성분은 같지만 결합 구조가 달라 성질이 정반대.' },
  { id:'mn_gold', school:'물질', front:'금(Au)이 잘 변하지 않는(녹슬지 않는) 이유는?',
    choices:['매우 무거워서','화학적으로 안정(비활성)해서','빛나서','희귀해서'], answer:1,
    lore:'변치 않는 마력의 상징.',
    fact:'금은 반응성이 매우 낮아 산소·물과 거의 반응하지 않는다. 그래서 수천 년 된 금 유물도 광택을 유지한다.' },
  { id:'mn_water', school:'물질', front:'물(H₂O) 한 분자는 무엇으로 되어 있나?',
    choices:['수소2+산소1','수소1+산소2','수소1+산소1','산소3'], answer:0,
    lore:'수원 주문의 기본 구성식.',
    fact:'물은 수소 원자 2개와 산소 원자 1개의 결합(H₂O). 굽은 구조 때문에 극성을 띠어 "만능 용매"가 된다.' }
];

// SM-2 spaced-repetition 상태: cardId -> {ease, interval, reps, due, lapses, mastered}
function getArcanaProgress() {
  try { return JSON.parse(localStorage.getItem('p5-arcana-srs') || '{}'); }
  catch { return {}; }
}
function saveArcanaProgress(p) {
  try { localStorage.setItem('p5-arcana-srs', JSON.stringify(p)); } catch(e){}
}
function todayNum() { return Math.floor(Date.now() / 86400000); } // days since epoch

// SM-2 알고리즘 (SuperMemo-2, 실제 간격반복 공식)
// grade 0-2 = 실패(리셋), 3-5 = 성공(간격 증가)
function scheduleCard(card, grade) {
  let ease = card.ease ?? 2.5;
  let interval = card.interval ?? 0;
  let reps = card.reps ?? 0;
  let lapses = card.lapses ?? 0;

  if (grade < 3) {
    // 실패: 반복 리셋, 내일 다시
    reps = 0;
    interval = 1;
    lapses += 1;
  } else {
    reps += 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 6;
    else interval = Math.round(interval * ease);
    // ease 조정 (SM-2 공식)
    ease = ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    if (ease < 1.3) ease = 1.3;
  }
  const mastered = reps >= 3 && interval >= 21; // 21일 이상 유지 = 장기기억 정착
  return { ease, interval, reps, lapses, due: todayNum() + interval, mastered, last: todayNum() };
}

// 오늘 복습할 카드: due <= 오늘 이거나 아직 안 배운 카드
function getDueCards() {
  const prog = getArcanaProgress();
  const t = todayNum();
  const due = [];
  const fresh = [];
  ARCANA.forEach(c => {
    const p = prog[c.id];
    if (!p) fresh.push(c);
    else if ((p.due ?? 0) <= t) due.push({ card: c, prog: p });
  });
  // 복습 우선, 그다음 새 카드 (하루 새 카드 과부하 방지: 최대 4장)
  return { due, fresh: fresh.slice(0, 4), freshTotal: fresh.length };
}

function getMasteryStats() {
  const prog = getArcanaProgress();
  let mastered = 0, learning = 0;
  ARCANA.forEach(c => {
    const p = prog[c.id];
    if (!p) return;
    if (p.mastered) mastered++;
    else if ((p.reps ?? 0) > 0) learning++;
  });
  return { mastered, learning, total: ARCANA.length };
}

// 현재 진행 중인 지식 수업 세션
let arcanaSession = null;

// 지식 수업 시작 — 오늘 복습 대상 + 새 카드로 큐 구성
function startArcanaLesson() {
  showTab('lessons');
  const area = document.getElementById('casting-area');
  const title = document.getElementById('lesson-title');
  const game = document.getElementById('cast-game');
  const sfumato = document.getElementById('cast-sfumato');
  if (sfumato) sfumato.style.display = 'none'; // 지식 수업은 텍스트 집중

  const { due, fresh, freshTotal } = getDueCards();
  const queue = [
    ...due.map(d => d.card),
    ...fresh
  ];

  if (queue.length === 0) {
    title.textContent = '아르카나 지식 — 오늘 복습 완료';
    game.innerHTML = `<div style="padding:12px;line-height:1.6">
      <div style="font-size:1.05em;color:#a78bfa">오늘 복습할 지식이 모두 정착됐습니다. 🌙</div>
      <div style="opacity:.8;margin-top:6px">간격반복(SM-2)이 다음 복습일을 자동 예약했습니다. 내일 다시 오면 기억이 흐려질 때쯤의 카드가 떠오릅니다.</div>
      <div style="margin-top:8px;font-size:.85em;opacity:.7">이것이 진짜 학습의 원리 — 잊기 직전에 다시 만나 장기기억으로 굳힙니다.</div>
    </div>`;
    area.classList.remove('hidden');
    return;
  }

  arcanaSession = { queue, idx: 0, correct: 0, total: queue.length, gainedKnowledge: 0, newMastered: 0 };
  area.classList.remove('hidden');
  renderArcanaCard();
}

function renderArcanaCard() {
  const title = document.getElementById('lesson-title');
  const game = document.getElementById('cast-game');
  const s = arcanaSession;
  if (!s || s.idx >= s.queue.length) { finishArcanaSession(); return; }

  const card = s.queue[s.idx];
  const prog = getArcanaProgress()[card.id];
  const status = !prog ? '새 지식' : (prog.mastered ? '정착됨(복습)' : `복습 ${prog.reps || 0}회`);

  title.textContent = `아르카나 지식 — ${card.school}`;
  // 진행 막대 + 카드 문제 + 선택지
  let html = `<div style="font-size:.78em;opacity:.7;margin-bottom:6px">${s.idx + 1} / ${s.total} · ${status}</div>`;
  html += `<div style="font-size:.72em;opacity:.55;margin-bottom:4px">${card.lore}</div>`;
  html += `<div style="font-size:1.12em;font-weight:600;margin:10px 0 14px;line-height:1.4">${card.front}</div>`;
  html += `<div id="arcana-choices" style="display:flex;flex-direction:column;gap:8px">`;
  // 선택지 섞기 (정답 위치 고정 방지) — 매핑 보존
  const order = card.choices.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  order.forEach(origIdx => {
    html += `<button class="arcana-choice" data-idx="${origIdx}" style="text-align:left;padding:11px 13px;background:#1f1a33;border:1px solid #4c3f72;border-radius:8px;color:#e5e0f0;cursor:pointer;font-size:.98em">${card.choices[origIdx]}</button>`;
  });
  html += `</div>`;
  game.innerHTML = html;

  document.querySelectorAll('.arcana-choice').forEach(btn => {
    btn.onclick = () => answerArcanaCard(parseInt(btn.dataset.idx, 10), btn);
  });
}

function answerArcanaCard(chosenIdx, btnEl) {
  const s = arcanaSession;
  const card = s.queue[s.idx];
  const correct = chosenIdx === card.answer;

  // 버튼 잠금 + 정답/오답 색
  document.querySelectorAll('.arcana-choice').forEach(b => {
    b.onclick = null;
    b.disabled = true;
    const bi = parseInt(b.dataset.idx, 10);
    if (bi === card.answer) b.style.borderColor = '#4ade80', b.style.background = '#16281c';
    else if (b === btnEl) b.style.borderColor = '#f87171', b.style.background = '#2a1618';
    else b.style.opacity = '0.5';
  });

  // SM-2 채점: 정답=4(무리없이 회상), 오답=1(실패)
  const grade = correct ? 4 : 1;
  const progAll = getArcanaProgress();
  const prev = progAll[card.id] || {};
  const wasMastered = !!prev.mastered;
  const updated = scheduleCard(prev, grade);
  progAll[card.id] = { ...updated };
  saveArcanaProgress(progAll);

  if (correct) {
    s.correct++;
    if (updated.mastered && !wasMastered) s.newMastered++;
  }

  // 진짜 해설 표시 (왜 그런지 = 진짜 배움의 핵심)
  const game = document.getElementById('cast-game');
  const nextDays = updated.interval;
  const explain = document.createElement('div');
  explain.style.cssText = 'margin-top:14px;padding:12px;background:#15130f;border-left:3px solid ' + (correct ? '#4ade80' : '#f87171') + ';border-radius:6px;line-height:1.55';
  explain.innerHTML =
    `<div style="font-weight:600;color:${correct ? '#4ade80' : '#f87171'};margin-bottom:5px">${correct ? '✓ 정답' : '✗ 다시 만나자'}</div>` +
    `<div style="font-size:.94em">${card.fact}</div>` +
    `<div style="font-size:.76em;opacity:.65;margin-top:7px">🔁 다음 복습: ${nextDays}일 후${updated.mastered ? ' · 장기기억 정착 ✦' : ''}</div>`;
  game.appendChild(explain);

  const nextBtn = document.createElement('button');
  nextBtn.textContent = s.idx + 1 >= s.total ? '수업 마치기' : '다음 지식 →';
  nextBtn.style.cssText = 'margin-top:12px;width:100%';
  nextBtn.onclick = () => { s.idx++; renderArcanaCard(); };
  game.appendChild(nextBtn);
}

function finishArcanaSession() {
  const s = arcanaSession;
  const game = document.getElementById('cast-game');
  const title = document.getElementById('lesson-title');
  if (!s) return;

  // 진짜 보상: 정답 수 = 지식 획득, 정착 카드 = 큰 보상. 진짜 학습에 연동.
  const knowledgeGain = s.correct * 3 + s.newMastered * 6;
  const powerGain = s.correct * 2 + s.newMastered * 4;
  state.knowledge = (state.knowledge || 0) + knowledgeGain;
  state.magicPower = (state.magicPower || 0) + powerGain;

  // 학습 세션도 스트릭 갱신 (진짜 출석 = 진짜 복습)
  updateStreakOnLesson();

  // 이벤트 로그 (진짜 데이터)
  if (!state.events) state.events = [];
  state.events.push({ t: Date.now(), type: 'arcana', correct: s.correct, total: s.total, mastered: s.newMastered });

  // 코어루프 완료 = 아르카나 수업(복습) 완료 = 대표 액션
  if (window.legionTrack) window.legionTrack('activate', { correct: s.correct, total: s.total });

  // insight 자동 기록 — 이번엔 진짜 배운 내용 기반
  if (!state.insights) state.insights = [];
  const learned = s.queue.slice(0, Math.min(s.queue.length, 2)).map(c => c.school).filter((v, i, a) => a.indexOf(v) === i).join(', ');
  state.insights.push({
    date: new Date().toLocaleDateString('ko-KR'),
    text: `아르카나 복습: ${learned} 계열 ${s.total}장 중 ${s.correct}장 회상 성공.${s.newMastered ? ` ${s.newMastered}장 장기기억 정착.` : ''}`,
    lesson: 'arcana', auto: true
  });

  const stats = getMasteryStats();
  const acc = s.total ? Math.round(s.correct / s.total * 100) : 0;
  title.textContent = '아르카나 수업 완료';
  game.innerHTML =
    `<div style="padding:8px 4px;line-height:1.6">
      <div style="font-size:1.15em;color:#a78bfa;font-weight:600">회상 정확도 ${acc}% (${s.correct}/${s.total})</div>
      <div style="margin-top:8px">지식 +${knowledgeGain} · 마력 +${powerGain}${s.newMastered ? ` · ✦ ${s.newMastered}장 장기기억 정착` : ''}</div>
      <div style="margin-top:10px;padding:10px;background:#1a1630;border-radius:6px;font-size:.9em">
        전체 진척: <b style="color:#4ade80">${stats.mastered}</b> 정착 · <b style="color:#facc15">${stats.learning}</b> 학습중 · 총 ${stats.total}장
      </div>
      <div style="font-size:.8em;opacity:.7;margin-top:8px">간격반복(SM-2)이 각 카드의 다음 복습일을 기억의 망각곡선에 맞춰 예약했습니다.</div>
    </div>`;
  saveState();
  arcanaSession = null;
}

// Spell-specific familiar bonuses (FAMILIAR_BONUS_MAP — live applied in finishCast + UI)
const FAMILIAR_BONUS_MAP = {
  'flame-spirit': { elemental: 25, spark: 22, binding: 10, default: 12 },
  'veil-fairy': { illusion: 25, shadow: 20, default: 12 },
  'echo-wisp': { echo: 26, binding: 15, reaction: 8, default: 12 },
  'root-guardian': { binding: 25, reaction: 18, elemental: 9, default: 12 }
};

// === p6 Lung Surprise Eye + Ache-Breath cross DNA (p5 full advance) ===
let familiarEchoes = JSON.parse(localStorage.getItem('p5_familiar_echoes') || '{}'); // { 'echo-wisp': {url, duration} ... }
let castSfumatoCtx = null;

function drawSfumatoCast(amplitude = 0.6, surprise = 0.12) {
  const c = document.getElementById('cast-sfumato');
  if (!c) return;
  if (!castSfumatoCtx) castSfumatoCtx = c.getContext('2d');
  const ctx = castSfumatoCtx;
  const w = c.width, h = c.height;
  ctx.fillStyle = 'rgba(16,14,28,0.65)';
  ctx.fillRect(0,0,w,h);
  const cy = h/2;
  // p6 sfumato 7-layer soft no-hard-edges
  for (let l=0; l<7; l++) {
    const a = 0.16 - l*0.018 + surprise*0.08;
    ctx.strokeStyle = `hsla(38,48%,72%,${Math.max(0.03,a)})`;
    ctx.lineWidth = 2.4 + (l%2);
    ctx.shadowBlur = 7 + surprise*9;
    ctx.beginPath();
    for (let x=0; x<w; x+=2.2) {
      let y = cy + Math.sin(x*0.029 + l*1.1 + Date.now()*0.001) * (12 + amplitude*29) * (1 - l*0.07);
      y += Math.sin(x*0.011) * (4 + surprise*11);
      if (x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
  // Lung Surprise Eye mini (golden 0.618 point)
  const gx = w * 0.618;
  const gy = cy + (surprise-0.5)*6;
  ctx.strokeStyle = `rgba(197,164,110,${0.3 + surprise*0.4})`;
  ctx.beginPath();
  ctx.ellipse(gx, gy, 7+surprise*9, 3.5+surprise*4, 0, 0, Math.PI*2);
  ctx.stroke();
}

function getP6SurpriseInCast() {
  let s = state.lungSurprise || 0.12;
  if (window.getP6LungSurprise) s = window.getP6LungSurprise() || s;
  return Math.max(0.03, Math.min(0.82, s));
}

function consumeBreathFuel(amount = 0.04) {
  state.breathFuel = Math.max(0.15, (state.breathFuel || 0.7) - amount);
  // plant spore back to p6 (cross living)
  if (window.plantP6SporeFromP5Use) window.plantP6SporeFromP5Use(0.3 + (1 - (state.breathFuel||0.7)));
  saveState();
}

// p6 voice recording for familiar echoes (Ache-Breath + 창발 pain)
let echoRecorder = null, echoChunks = [];
function recordFamiliarEcho() {
  if (!state.familiar) { alert('먼저 정령 소환 후 에코 녹음하세요.'); return; }
  navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true}}).then(stream => {
    echoRecorder = new MediaRecorder(stream);
    echoChunks = [];
    echoRecorder.ondataavailable = e => echoChunks.push(e.data);
    echoRecorder.onstop = () => {
      const blob = new Blob(echoChunks, {type:'audio/webm'});
      const url = URL.createObjectURL(blob);
      familiarEchoes[state.familiar] = {url, ts: Date.now()};
      localStorage.setItem('p5_familiar_echoes', JSON.stringify(familiarEchoes));
      stream.getTracks().forEach(t=>t.stop());
      alert(`${PERSONAS[state.familiar].name} 에코 저장 완료. 다음 시전 때 정령의 잔향으로 재생됩니다.`);
    };
    echoRecorder.start();
    setTimeout(() => { if (echoRecorder && echoRecorder.state==='recording') echoRecorder.stop(); }, 4200); // short artistic breath
  }).catch(()=>alert('에코 녹음에는 마이크 권한이 필요합니다.'));
}

function playFamiliarEchoIfAny() {
  if (!state.familiar || !familiarEchoes[state.familiar]) return;
  try {
    const a = new Audio(familiarEchoes[state.familiar].url);
    a.volume = 0.18 + (state.lungSurprise || 0.1) * 0.25; // louder on high surprise
    a.play().catch(()=>{});
  } catch(e){}
}

// Different casting mechanics — COMPLETE: timing/memory/choice-reaction/echo + accumulation/rhythm (Legion upgrade)
function startCastingGame(type, onSuccess) {
  const game = document.getElementById('cast-game');
  game.innerHTML = '';
  let success = 50;

  // p6 cross: live sfumato + surprise eye during cast (fuel affects amp)
  const fuelAmp = Math.max(0.3, Math.min(1.1, (state.breathFuel || 0.7)));
  const initSurp = getP6SurpriseInCast();
  drawSfumatoCast(fuelAmp * 0.7, initSurp);
  const liveDraw = setInterval(() => {
    if (!document.getElementById('casting-area') || document.getElementById('casting-area').classList.contains('hidden')) { clearInterval(liveDraw); return; }
    drawSfumatoCast(fuelAmp * (0.6 + Math.random()*0.5), getP6SurpriseInCast());
  }, 140);

  if (type === 'elemental' || type === 'spark') {
    // 1. Timing — hold for perfect window (touch + mouse unified, no stuck state)
    const btn = document.createElement('button');
    btn.className = 'cast-button';
    btn.textContent = '주문 시전 — 길게 누르기 (최적 1.1초)';
    let startTime = 0;
    let released = false;
    const press = (e) => {
      if (e && e.cancelable) e.preventDefault();
      startTime = Date.now();
      btn.textContent = '집중 중... 완벽한 순간에 떼라';
    };
    const release = (e) => {
      if (e && e.cancelable) e.preventDefault();
      if (released || !startTime) return; // ignore release without a real press
      released = true;
      clearInterval(liveDraw);
      const held = Date.now() - startTime;
      const perf = Math.abs(held - 1100);
      success = Math.min(99, Math.max(22, 92 - Math.floor(perf / 18)));
      finishCast(success, type, onSuccess);
    };
    // Pointer events cover mouse + touch + pen; fall back to mouse/touch for old webviews.
    if (window.PointerEvent) {
      btn.addEventListener('pointerdown', press);
      btn.addEventListener('pointerup', release);
      btn.addEventListener('pointercancel', release);
      btn.addEventListener('pointerleave', release); // dragging off = release, never stuck
    } else {
      btn.addEventListener('mousedown', press);
      btn.addEventListener('mouseup', release);
      btn.addEventListener('mouseleave', release);
      btn.addEventListener('touchstart', press, {passive:false});
      btn.addEventListener('touchend', release, {passive:false});
      btn.addEventListener('touchcancel', release);
    }
    game.appendChild(btn);
  } else if (type === 'illusion' || type === 'shadow') {
    // 2. Memory sequence — pattern recall
    const seq = [1,2,3].map(() => Math.floor(Math.random()*4)+1);
    let userSeq = [];
    const display = document.createElement('div');
    display.textContent = '패턴 기억: ' + seq.join(' - ');
    game.appendChild(display);
    const buttons = document.createElement('div');
    for (let i=1; i<=4; i++) {
      const b = document.createElement('button');
      b.textContent = i;
      b.onclick = () => {
        userSeq.push(i);
        if (userSeq.length === seq.length) {
          clearInterval(liveDraw);
          success = userSeq.join('') === seq.join('') ? 88 : 32;
          finishCast(success, type, onSuccess);
        }
      };
      buttons.appendChild(b);
    }
    game.appendChild(buttons);
  } else if (type === 'echo') {
    // Echo mechanic — show seq briefly, hide, recall from memory (echo delay)
    const seq = Array.from({length:4}, () => Math.floor(Math.random()*4)+1);
    let userSeq = [];
    const display = document.createElement('div');
    display.style.fontSize = '1.1em';
    display.textContent = '에코 잔향: 잠시 보고 기억하라... ' + seq.join(' ');
    game.appendChild(display);

    setTimeout(() => {
      display.textContent = '에코가 사라졌다. 순서대로 재현하라 (선택 순서 입력)';
      const buttons = document.createElement('div');
      for (let i=1; i<=4; i++) {
        const b = document.createElement('button');
        b.textContent = i;
        b.onclick = () => {
          userSeq.push(i);
          if (userSeq.length === seq.length) {
            clearInterval(liveDraw);
            const match = userSeq.join('') === seq.join('');
            success = match ? 82 : 35;
            if (match && Math.random() > 0.6) success = Math.min(96, success + 8); // echo resonance
            finishCast(success, type, onSuccess);
          }
        };
        buttons.appendChild(b);
      }
      game.appendChild(buttons);
    }, 1350);
  } else if (type === 'reaction') {
    // Choice-reaction: time-pressured sequence (FOMO pressure)
    const seq = Array.from({length:4}, () => Math.floor(Math.random()*4)+1);
    let userSeq = [];
    let timeLeft = 3650;
    const display = document.createElement('div');
    display.style.fontWeight = 'bold';
    display.textContent = `⚡ 반응 시퀀스: ${seq.join(' ')} — ${Math.ceil(timeLeft/1000)}s 안에 완료!`;
    game.appendChild(display);

    const timer = setInterval(() => {
      timeLeft -= 165;
      if (timeLeft > 0) {
        display.textContent = `⚡ 반응 시퀀스: ${seq.join(' ')} — ${Math.ceil(timeLeft/1000)}s 안에 완료!`;
      } else {
        clearInterval(timer);
        clearInterval(liveDraw);
        success = 19; // near-miss fail edge
        finishCast(success, type, onSuccess);
      }
    }, 165);

    const buttons = document.createElement('div');
    for (let i=1; i<=4; i++) {
      const b = document.createElement('button');
      b.textContent = i;
      b.onclick = () => {
        userSeq.push(i);
        if (userSeq.length === seq.length) {
          clearInterval(timer);
          clearInterval(liveDraw);
          const match = userSeq.join('') === seq.join('');
          const speed = Math.max(0, Math.floor(timeLeft / 38));
          success = match ? Math.min(97, 66 + speed) : 37;
          finishCast(success, type, onSuccess);
        }
      };
      buttons.appendChild(b);
    }
    game.appendChild(buttons);
  } else if (type === 'binding') {
    // Accumulation build-up (new: power meter, repeated taps to charge)
    const meterWrap = document.createElement('div');
    meterWrap.innerHTML = `<div>구속 축적 — 반복 탭으로 마력을 모아라 (목표 7+)</div>`;
    const meter = document.createElement('div');
    meter.style.cssText = 'height:18px;background:#3a2a1a;border:1px solid #4c3f72;border-radius:4px;margin:8px 0;overflow:hidden;';
    const bar = document.createElement('div');
    bar.style.cssText = 'height:100%;width:0%;background:#a78bfa;transition:width .1s;';
    meter.appendChild(bar);
    meterWrap.appendChild(meter);
    let charge = 0;
    const tapBtn = document.createElement('button');
    tapBtn.className = 'cast-button';
    tapBtn.textContent = '마력 주입 (빠르게 탭)';
    const endBtn = document.createElement('button');
    endBtn.textContent = '구속 완료';
    endBtn.style.marginTop = '8px';
    tapBtn.onclick = () => {
      charge = Math.min(12, charge + 1);
      bar.style.width = (charge * 8) + '%';
    };
    endBtn.onclick = () => {
      clearInterval(liveDraw);
      success = Math.min(96, 38 + charge * 5);
      finishCast(success, type, onSuccess);
    };
    game.appendChild(meterWrap);
    game.appendChild(tapBtn);
    game.appendChild(endBtn);
  } else {
    // Default choice + rhythm hybrid (more variety)
    const choices = ['공격', '방어', '지원', '반향'];
    const sel = document.createElement('select');
    choices.forEach(c => { const o = document.createElement('option'); o.text = c; sel.add(o); });
    game.appendChild(sel);
    const btn = document.createElement('button');
    btn.textContent = '선택 시전 (리듬)';
    btn.onclick = () => {
      clearInterval(liveDraw);
      const base = (sel.value === '지원' || sel.value === '반향') ? 78 : 54;
      // quick rhythm micro: random near-miss chance
      success = base + (Math.random() > 0.5 ? 11 : -4);
      finishCast(success, type, onSuccess);
    };
    game.appendChild(btn);
  }
}

function finishCast(success, spellType, onSuccess) {
  const game = document.getElementById('cast-game');
  let msg = `시전 결과: ${success}% 성공`;

  // === p6 Lung Surprise Eye + Ache-Breath fuel integration (core advance) ===
  const surp = getP6SurpriseInCast();
  const fuelBefore = state.breathFuel || 0.7;
  // surprise mutates cast (Lung Surprise Eye mechanic)
  const surpriseBoost = Math.floor(surp * 27); // up to +22
  success = Math.min(99, success + surpriseBoost);
  if (surp > 0.19) {
    success = Math.min(99, success + 4);
    msg += ` 👁 집중 +${surpriseBoost}`;
  }
  // breath/spore as spell fuel — higher fuel = stronger cast, consume
  const fuelBonus = Math.floor((fuelBefore - 0.3) * 11);
  success = Math.min(99, success + Math.max(0, fuelBonus));
  consumeBreathFuel(0.035 + (surp > 0.25 ? 0.02 : 0)); // consume + extra on big surprise
  msg += ` (호흡 연료 ${fuelBefore.toFixed(2)}→${(state.breathFuel||0.7).toFixed(2)})`;

  // LIVE familiar bonus from FAMILIAR_BONUS_MAP (always applied if selected)
  let bonus = 0;
  let famName = null;
  if (state.familiar && PERSONAS[state.familiar]) {
    const map = FAMILIAR_BONUS_MAP[state.familiar] || {};
    bonus = map[spellType] || map.default || 12;
    success = Math.min(99, success + bonus);
    famName = PERSONAS[state.familiar].name;
    msg += ` (${famName}와 함께 +${bonus}%)`;
    playFamiliarEchoIfAny(); // 정령 목소리 에코 재생
  } else {
    msg += ' (정령 없음 — 단독 시전)';
  }

  // Edge: near-miss / fail learning
  if (success < 40) {
    msg += ' — 아쉽게 빗나갔다! 작은 배움의 불씨가 남는다.';
    state.knowledge = (state.knowledge || 0) + 1;
  }

  game.innerHTML = `<div>${msg}</div>`;

  // Streak FOMO update (live)
  updateStreakOnLesson();

  // Full persistence event log
  if (!state.events) state.events = [];
  state.events.push({ t: Date.now(), type: 'cast', spell: spellType, success: Math.floor(success), familiar: state.familiar || null, bonus, p6surprise: surp.toFixed(2) });

  // Streak variable FOMO bonus
  if (success > 74 && (state.streak || 0) >= 3) {
    const streakBonus = Math.min(5, Math.floor((state.streak || 0) / 2));
    state.magicPower = (state.magicPower || 0) + streakBonus;
    game.innerHTML += `<div style="color:#facc15">🔥 연속 ${state.streak}일 출석 보너스 +${streakBonus}</div>`;
  }

  // share-at-peak after strong cast (emotion high)
  if (success > 72) {
    offerMagicSharePeak(Math.floor(success), spellType);
  }

  // ALWAYS LEARNING: auto + force post (p6 notebook style evolve)
  autoGenerateAndSaveInsights(spellType, Math.floor(success));

  // === 창발 해금 1-2 (호흡 집중 + 잔향이 결합할 때) ===
  if (surp > 0.31 && fuelBefore > 0.55 && Math.random() < 0.48) {
    // 창발 1: 호흡의 각인 (호흡 연료 + 집중이 만든 새 주문)
    if (!state.spells.includes('ache-breath')) {
      state.spells.push('ache-breath');
      game.innerHTML += `<div style="color:#c5a46e;margin-top:4px">🌱 창발 해금: "호흡의 각인" 주문을 얻었습니다 — 깊은 호흡이 마법이 되었다. (호흡 연료 사용 시 자동 공명)</div>`;
    }
  }
  if (state.familiar && surp > 0.28 && familiarEchoes[state.familiar]) {
    // 창발 2: 정령의 눈 (목소리 에코 + 집중이 결합한 정령 시야)
    if (!state.insights.some(i => i.text && i.text.includes('정령의 눈'))) {
      state.insights.push({date:new Date().toLocaleDateString('ko-KR'), text: `정령의 눈: ${PERSONAS[state.familiar].name}의 에코가 깊은 집중과 결합해 스스로 '본다'. 다시 관찰하면 새로운 깨달음으로 진화한다.`, lesson: spellType, auto:true, emergent:true});
      game.innerHTML += `<div style="color:#a78bfa;margin-top:3px">👁 창발 해금 2: "정령의 눈" — 목소리 에코가 눈이 되어 정령이 스스로 관찰한다.</div>`;
    }
  }

  if (success > 55) {
    if (onSuccess) onSuccess();
  } else {
    game.innerHTML += `<div style="color:#f87171;margin-top:6px">실패했지만 과정이 배움이다. 공부 탭에서 기록하라.</div>`;
  }

  saveState();
  console.log(`%c[p5 Learning] ${msg} | p6 surp=${surp.toFixed(2)} fuel=${state.breathFuel.toFixed(2)}`, 'color:#a78bfa');
}

// Auto ALWAYS LEARNING — generates + saves 1-2 insights (forced post-lesson) + p6 notebook evolve DNA
function autoGenerateAndSaveInsights(spellType, success) {
  if (!spellType || !SPELLS[spellType]) return;
  const spellName = SPELLS[spellType].name;

  const candidates = [
    `${spellName}에서 ${success}%의 흐름을 읽었다. 순간의 선택이 모든 마법의 열쇠.`,
    `아쉬운 실패와 성공 사이의 틈이 진짜 깨달음이다. 압박 속에서 패턴이 보인다.`,
    `정령의 공명 없이도 배움은 계속된다. 실패는 가장 강력한 스승.`,
    `${spellName}의 리듬을 몸으로 이해했다. 반복이 감각을 깊게 만든다.`,
    `에코·반응 타이밍에서 순간의 집중이 핵심이다. 한 번 놓치면 다음 기회는 귀하다.`,
    `정령과 함께한 수업은 ${success > 70 ? '강한' : '미묘한'} 공명을 남긴다.`,
    `깊은 호흡이 주문을 숨쉬게 한다. 모아둔 집중이 연료가 되어 ${success}%의 위력을 키웠다.`
  ];

  const picks = [];
  const shuf = [...candidates].sort(() => Math.random() - 0.5);
  picks.push(shuf[0]);
  if (Math.random() > 0.4 && shuf[1]) picks.push(shuf[1]);

  picks.forEach(txt => {
    const recent = (state.insights || []).slice(-4).map(i => i.text);
    if (!recent.includes(txt)) {
      if (!state.insights) state.insights = [];
      state.insights.push({
        date: new Date().toLocaleDateString('ko-KR'),
        text: txt,
        lesson: spellType,
        familiar: state.familiar || null,
        auto: true
      });
    }
  });

  const inp = document.getElementById('insight-input');
  if (inp) inp.placeholder = `${spellName} 자동 기록됨. 직접 1개 더 입력하면 배움이 더 깊어집니다.`;
}

// p5 independent familiars / spirits (separate from p3 for now, short-term solid focus)
const PERSONAS = {
  'flame-spirit': { name: 'Flame Spirit', desc: '불의 정령. 원소 조율에 강함. "불꽃처럼 타올라라!"' },
  'veil-fairy': { name: 'Veil Fairy', desc: '환영의 요정. 환영 마법 전문. "거짓을 진실로 바꾸지."' },
  'echo-wisp': { name: 'Echo Wisp', desc: '에코 위습. 과거를 재현. "잔향 속에서 배워라."' },
  'root-guardian': { name: 'Root Guardian', desc: '자연의 수호자. 구속과 치유. "뿌리처럼 단단히."' }
};

// Load state — FULL persistence
function loadState() {
  const saved = localStorage.getItem('p5-magic-school');
  if (saved) {
    try { state = JSON.parse(saved); } catch(e) { /* corrupt safe */ }
  }

  // Full defaults + new Legion fields
  if (!state.events) state.events = [];
  if (!state.insights) state.insights = [];
  if (typeof state.streak !== 'number') state.streak = 1;
  if (typeof state.magicPower !== 'number') state.magicPower = 42;
  if (typeof state.knowledge !== 'number') state.knowledge = 28;
  if (typeof state.dailyLessons !== 'number') state.dailyLessons = 0;
  if (!state.lastPlayDate) state.lastPlayDate = null;
  if (!state.familiar) state.familiar = null;
  if (typeof state.breathFuel !== 'number') state.breathFuel = 0.7;
  if (typeof state.lungSurprise !== 'number') state.lungSurprise = 0.12;

  // p6 FULL CROSS: Lung Surprise Eye + breath/spore fuel (Ache-Breath as spell fuel)
  try {
    if (window.getP6BreathFuelForP5) {
      const p6 = window.getP6BreathFuelForP5();
      state.breathFuel = p6.fuel;
      state.lungSurprise = p6.surprise;
    } else {
      // fallback read direct
      const lung = JSON.parse(localStorage.getItem('p6_lungFragment') || '{"breath":0.4,"lastSurprise":0.12}');
      const sp = JSON.parse(localStorage.getItem('p6_smileSpores') || '[]');
      state.breathFuel = Math.max(0.2, Math.min(1.8, (lung.breath||0.4)*0.6 + (sp[0]?.wound||0.3) ));
      state.lungSurprise = lung.lastSurprise || 0.12;
    }
  } catch(e){}

  // Streak FOMO passive on load
  const s = getStreakP5();
  if (s.days >= 5) state.magicPower = (state.magicPower || 0) + 1;

  // sync streak state
  state.streak = s.days || state.streak;

  updateUI();
  updateFamiliars();
  renderStreakFomoP5();
}

// Save state — full, immediate
function saveState() {
  try {
    localStorage.setItem('p5-magic-school', JSON.stringify(state));
    localStorage.setItem('p5-streak', JSON.stringify(getStreakP5()));
  } catch(e) {}
  updateUI();
  // live familiar bonus UI refresh
  if (document.getElementById('familiars') && !document.getElementById('familiars').classList.contains('hidden')) updateFamiliars();
}

const MAGIC_SHARE_URL = 'https://hosuman08-netizen.github.io/magic-school/';

function offerMagicSharePeak(success, spellType) {
  try {
    const k = 'p5_peak_' + new Date().toISOString().slice(0, 10);
    if (sessionStorage.getItem(k)) return;
    sessionStorage.setItem(k, '1');
    const game = document.getElementById('game') || document.querySelector('.game') || document.querySelector('main');
    if (!game) return;
    let peak = document.getElementById('magicSharePeak');
    if (!peak) {
      peak = document.createElement('div');
      peak.id = 'magicSharePeak';
      peak.style.cssText = 'margin:10px 0;padding:10px 12px;border:1px solid #c9a227;border-radius:8px;background:rgba(20,16,10,.9);text-align:center;font-size:.88rem';
      game.appendChild(peak);
    }
    peak.innerHTML = `<p style="margin:0 0 8px">✨ 시전 성공 ${success}% — 지금 공유하면 자랑이 됩니다</p>`
      + `<button type="button" onclick="shareMagicPeak()" style="padding:8px 14px;background:#c9a227;color:#111;border:none;border-radius:6px;font-weight:700;cursor:pointer">📤 결과 공유</button> `
      + `<button type="button" onclick="document.getElementById('magicSharePeak').remove()" style="padding:8px 10px;background:transparent;color:#c9a227;border:1px solid #3a2f22;border-radius:6px;cursor:pointer">나중에</button>`;
    if (window.legionTrack) try { legionTrack('share_peak_shown', { success: success, spell: spellType }); } catch (e) {}
  } catch (e) {}
}
function shareMagicPeak() {
  const text = `아르카눔 마법 학원에서 주문 성공! 🔥 연속 ${(state && state.streak) || 1}일\n너도 해봐 → ${MAGIC_SHARE_URL}\n#마법학원 #학습게임`;
  if (window.legionTrack) try { legionTrack('share_peak', {}); legionTrack('share', {}); } catch (e) {}
  if (navigator.share) {
    navigator.share({ title: 'Magic School', text: text, url: MAGIC_SHARE_URL }).catch(function () {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  }
  try { const p = document.getElementById('magicSharePeak'); if (p) p.remove(); } catch (e) {}
}
window.shareMagicPeak = shareMagicPeak;

// Export study log (ALWAYS LEARNING full)
function exportStudy() {
  const payload = {
    exported: new Date().toISOString(),
    app: '아르카눔 마법 학원 — 공부 기록',
    streak: state.streak,
    familiar: state.familiar,
    totalInsights: (state.insights || []).length,
    insights: state.insights || []
  };
  const data = JSON.stringify(payload, null, 2);
  const blob = new Blob([data], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'arcanum-study-log.json';
  a.click();
  if (window.legionTrack) window.legionTrack('share', {});
}

// === 아르카나 지식서 (Grimoire): 배운 지식을 다시 펼쳐보는 서고 ===
let grimoireFilter = 'all';    // all | mastered | learning | locked
let grimoireOpen = null;       // 펼쳐진 카드 id

function grimNextReviewText(p) {
  // 다음 복습까지 남은 날 (SM-2 due 기준). 진짜 스케줄 데이터만 표기 (가짜수치 금지).
  if (!p || p.due == null) return '';
  const days = p.due - todayNum();
  if (days <= 0) return '지금 복습 대기';
  if (days === 1) return '내일 복습 예정';
  return `${days}일 후 복습 예정`;
}

function renderGrimoire() {
  const summary = document.getElementById('grimoire-summary');
  const filters = document.getElementById('grimoire-filters');
  const listEl = document.getElementById('grimoire-list');
  if (!summary || !filters || !listEl) return;

  const prog = getArcanaProgress();
  const stats = getMasteryStats();
  const seen = stats.mastered + stats.learning;
  const pct = stats.total ? Math.round(stats.mastered / stats.total * 100) : 0;

  summary.innerHTML =
    `펼친 지식 <b>${seen}</b> / ${stats.total} · 장기기억 정착 <b style="color:#4ade80">${stats.mastered}</b>` +
    `<div class="g-bar"><span style="width:${pct}%"></span></div>` +
    `<div style="font-size:.72rem;opacity:.65;margin-top:6px">회상에 성공한 지식이 여기 쌓입니다. 카드를 눌러 해설을 다시 펼쳐보세요.</div>`;

  // 필터 칩 (진짜 개수 반영)
  const locked = stats.total - seen;
  const chips = [
    { key: 'all', label: `전체 ${stats.total}` },
    { key: 'mastered', label: `정착 ${stats.mastered}` },
    { key: 'learning', label: `학습중 ${stats.learning}` },
    { key: 'locked', label: `미개봉 ${locked}` }
  ];
  filters.innerHTML = '';
  chips.forEach(c => {
    const b = document.createElement('button');
    b.textContent = c.label;
    if (grimoireFilter === c.key) b.classList.add('active');
    b.onclick = () => { grimoireFilter = c.key; renderGrimoire(); };
    filters.appendChild(b);
  });

  // 카드 목록: 정착 → 학습중 → 미개봉 순 정렬
  const rank = c => {
    const p = prog[c.id];
    if (p && p.mastered) return 0;
    if (p && (p.reps ?? 0) > 0) return 1;
    return 2;
  };
  const ordered = [...ARCANA].sort((a, b) => rank(a) - rank(b));

  listEl.innerHTML = '';
  let shown = 0;
  ordered.forEach(card => {
    const p = prog[card.id];
    const state_ = (p && p.mastered) ? 'mastered' : (p && (p.reps ?? 0) > 0) ? 'learning' : 'locked';
    if (grimoireFilter !== 'all' && grimoireFilter !== state_) return;
    shown++;

    const el = document.createElement('div');
    el.className = `grim-card ${state_}`;
    const statusLabel = state_ === 'mastered'
      ? `✦ 장기기억 정착 · ${grimNextReviewText(p)}`
      : state_ === 'learning'
        ? `복습 ${p.reps || 0}회 · ${grimNextReviewText(p)}`
        : '아직 회상 성공 전 — 수업에서 펼쳐집니다';

    // 미개봉 카드는 정답/해설을 숨긴다 (배운 것만 서고에 열림 — 진짜 학습 보상)
    const isLocked = state_ === 'locked';
    let head =
      `<div class="grim-head">` +
        `<span class="grim-front">${isLocked ? '？ ' + card.school + ' 계열 미개봉 지식' : card.front}</span>` +
        `<span class="grim-tag">${card.school}</span>` +
      `</div>` +
      `<div class="grim-status ${state_}">${statusLabel}</div>`;

    el.innerHTML = head;

    if (!isLocked && grimoireOpen === card.id) {
      const body = document.createElement('div');
      body.className = 'grim-body';
      body.innerHTML =
        `<div class="grim-lore">${card.lore}</div>` +
        `<div><b style="color:#4ade80">정답:</b> ${card.choices[card.answer]}</div>` +
        `<div style="margin-top:6px">${card.fact}</div>` +
        `<div class="grim-next">🔁 ${grimNextReviewText(p)}</div>`;
      el.appendChild(body);
    }

    if (!isLocked) {
      el.onclick = () => {
        grimoireOpen = (grimoireOpen === card.id) ? null : card.id;
        renderGrimoire();
      };
    }
    listEl.appendChild(el);
  });

  if (shown === 0) {
    listEl.innerHTML = `<div style="font-size:.84rem;opacity:.6;padding:12px 4px">이 분류에 해당하는 지식이 아직 없습니다.</div>`;
  }
}

function updateUI() {
  document.getElementById('magic-power').textContent = state.magicPower;
  document.getElementById('knowledge').textContent = state.knowledge;
  document.getElementById('streak').textContent = (state.streak || 1) + '일';
  // p6 cross live
  const bf = document.getElementById('breath-fuel');
  if (bf) bf.textContent = (state.breathFuel || 0.7).toFixed(2);
  const ls = document.getElementById('lung-surprise');
  if (ls) ls.textContent = `집중도 ${(state.lungSurprise || 0.12).toFixed(2)}`;
  renderStreakFomoP5(); // live FOMO

  // 아르카나 지식서 (Grimoire) — 배운 지식 서고
  renderGrimoire();

  // Spellbook
  const list = document.getElementById('spell-list');
  list.innerHTML = '';
  if (!state.spells || state.spells.length === 0) {
    list.innerHTML = '<p>아직 배운 주문이 없습니다. 수업을 시작하세요.</p>';
  } else {
    state.spells.forEach(s => {
      const el = document.createElement('div');
      el.className = 'spell';
      el.innerHTML = `<strong>${SPELLS[s] ? SPELLS[s].name : s}</strong><br><small>${SPELLS[s] ? SPELLS[s].desc : ''}</small>`;
      list.appendChild(el);
    });
  }

  // Past insights — upgraded render (grouped, Legion ALWAYS LEARNING)
  const past = document.getElementById('past-insights');
  past.innerHTML = '<h4>공부 기록 — 끝없이 배운다 (최근 6)</h4>';
  if (!state.insights || state.insights.length === 0) {
    past.innerHTML += '<p style="opacity:0.7">아직 기록된 깨달음이 없습니다. 수업 후 강제 기록하세요.</p>';
  } else {
    // group by lesson for clarity
    const recent = [...state.insights].slice(-6).reverse();
    recent.forEach(i => {
      const d = document.createElement('div');
      d.style.cssText = 'margin:6px 0;padding:9px;background:#1a1630;border-radius:6px;border-left:3px solid #a78bfa;font-size:0.9em';
      let extra = i.familiar && PERSONAS[i.familiar] ? ` <span style="color:#facc15">(${PERSONAS[i.familiar].name}와 함께)</span>` : '';
      const les = i.lesson ? `<small style="opacity:.6">[${i.lesson}]</small> ` : '';
      d.innerHTML = `${les}<small>${i.date}</small><br>${i.text}${extra}`;
      if (i.auto) d.innerHTML += ` <small style="color:#666">(auto)</small>`;
      past.appendChild(d);
    });
    past.innerHTML += `<div style="font-size:0.75em;opacity:.65;margin-top:4px">총 ${state.insights.length}개 기록 • 끝없이 배우는 중</div>`;
  }

  // 오늘의 복습 — 진짜 due 카드 수 반영 (SM-2 간격반복)
  const arcanaSub = document.getElementById('arcana-hero-sub');
  if (arcanaSub) {
    const { due, fresh, freshTotal } = getDueCards();
    const stats = getMasteryStats();
    const reviewN = due.length;
    const newN = fresh.length;
    if (reviewN === 0 && newN === 0) {
      arcanaSub.textContent = `오늘 복습 완료 · 정착 ${stats.mastered}/${stats.total}장`;
    } else {
      const parts = [];
      if (reviewN) parts.push(`복습 ${reviewN}장`);
      if (newN) parts.push(`새 지식 ${newN}장`);
      arcanaSub.textContent = `${parts.join(' · ')} 대기 · 정착 ${stats.mastered}/${stats.total}`;
    }
  }

  // Dashboard familiar teaser (live + bonus hint + clickable funnel)
  const dashFam = document.getElementById('dashboard-familiar');
  if (dashFam) {
    if (state.familiar && PERSONAS[state.familiar]) {
      const p = PERSONAS[state.familiar];
      const map = FAMILIAR_BONUS_MAP[state.familiar] || {};
      dashFam.innerHTML = `현재 정령: <strong>${p.name}</strong>${Object.keys(map).length ? ' — 보너스 적용 중' : ''}<br><small>${p.desc.substring(0,58)}...</small>`;
      dashFam.onclick = () => showTab('familiars');
      dashFam.style.cursor = 'pointer';
    } else {
      dashFam.innerHTML = '소환된 정령이 없습니다. "소환" 탭에서 정령을 선택하세요.';
      dashFam.onclick = () => showTab('familiars');
      dashFam.style.cursor = 'pointer';
    }
  }

  updateFamiliars();
}

function updateFamiliars() {
  const current = document.getElementById('current-familiar');
  const list = document.getElementById('familiar-list');
  if (!current || !list) return;

  if (state.familiar && PERSONAS[state.familiar]) {
    const p = PERSONAS[state.familiar];
    const map = FAMILIAR_BONUS_MAP[state.familiar] || {};
    const bonusPreview = Object.entries(map).map(([k,v]) => `${SPELL_LABEL(k)} +${v}%`).join(' · ');
    current.innerHTML = `<strong>현재 소환: ${p.name}</strong><br><small>${p.desc}</small><br><small style="color:#facc15">적용 보너스: ${bonusPreview || '기본 +12%'}</small> <button onclick="unsummon()">해제</button>`;
  } else {
    current.innerHTML = '소환된 정령이 없습니다. 아래에서 정령을 선택하세요.';
  }

  list.innerHTML = '';
  Object.keys(PERSONAS).forEach(key => {
    const p = PERSONAS[key];
    const map = FAMILIAR_BONUS_MAP[key] || {};
    const bp = Object.entries(map).map(([k,v]) => `${SPELL_LABEL(k)} +${v}`).join(' · ');
    const el = document.createElement('div');
    el.className = 'spell';
    el.innerHTML = `<strong>${p.name}</strong><br><small>${p.desc}</small><br><small style="color:#a78bfa">보너스 ${bp || '기본'}</small>`;
    el.onclick = () => summonFamiliar(key);
    list.appendChild(el);
  });
}

function summonFamiliar(key) {
  state.familiar = key;
  saveState();
  updateFamiliars();
  // live everywhere
  updateUI();
  const liveMsg = `${PERSONAS[key].name} 소환 완료. 보너스가 적용됩니다. 다음 시전부터 성공률 +보너스.`;
  alert(liveMsg);
}

function unsummon() {
  state.familiar = null;
  saveState();
  updateFamiliars();
}

function showTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.add('hidden'));
  document.getElementById(tab).classList.remove('hidden');
  if (tab === 'familiars') updateFamiliars();
}

let currentLesson = null;

function startLesson(type) {
  currentLesson = type;
  // Casting UI lives inside the #lessons tab — make sure it's the visible tab,
  // otherwise dashboard lesson cards would silently do nothing.
  showTab('lessons');
  const area = document.getElementById('casting-area');
  const title = document.getElementById('lesson-title');
  const game = document.getElementById('cast-game');
  const sfumato = document.getElementById('cast-sfumato');
  if (sfumato) sfumato.style.display = 'block'; // 주문 수업은 sfumato 시각 복원 (arcana에서 숨겼을 수 있음)

  if (!SPELLS[type]) type = 'elemental';

  let titleText = SPELLS[type].name;
  let bonusNote = '';
  if (state.familiar && PERSONAS[state.familiar]) {
    const map = FAMILIAR_BONUS_MAP[state.familiar] || {};
    const b = map[type] || map.default || 12;
    titleText += ` (${PERSONAS[state.familiar].name}와 함께 • +${b}%)`;
    bonusNote = ` 정령 보너스 적용 중`;
  }
  title.textContent = titleText;
  game.innerHTML = `<div style="font-size:0.8em;opacity:0.75;margin-bottom:4px">시전 중: ${SPELL_LABEL(type)}${bonusNote}</div>`;

  area.classList.remove('hidden');

  startCastingGame(type, () => {
    if (!state.spells.includes(type)) state.spells.push(type);
    state.magicPower = (state.magicPower || 0) + 8;
    state.knowledge = (state.knowledge || 0) + 3;
    game.innerHTML += `<div style="color:#facc15">성공! 마력 +8, 지식 +3. ${state.familiar ? PERSONAS[state.familiar].name + '와 함께 배움 업그레이드.' : '단독 수련.'}</div>`;
    saveState();
  });
}

function finishLesson() {
  const area = document.getElementById('casting-area');
  area.classList.add('hidden');

  // ALWAYS LEARNING FORCED RECORD — post-lesson mandatory flow (auto + user input)
  showTab('study');
  const inp = document.getElementById('insight-input');
  if (inp) {
    inp.focus();
    let ph = `이번 ${SPELLS[currentLesson] ? SPELLS[currentLesson].name : '연습'}에서 무엇을 배웠나? (자동 1-2개 기록됨. 직접 1개 더 입력해보세요)`;
    if (state.familiar && PERSONAS[state.familiar]) {
      ph += ` with ${PERSONAS[state.familiar].name}`;
    }
    inp.placeholder = ph;
    // visual forced gate
    inp.style.border = '2px solid #facc15';
    setTimeout(() => { if (inp) inp.style.border = '1px solid #4c3f72'; }, 5200);
  }

  // Extra FOMO + Legion imprint
  if (currentLesson === 'reaction' || (state.streak || 0) > 4) {
    setTimeout(() => {
      const f = document.querySelector('.fomo');
      if (f) f.innerHTML = `<strong>🔥 반응/스트릭 완료! 지금 ${Math.floor(Math.random()*21)+9}명의 학생이 같은 훈련 중</strong>`;
    }, 380);
  }

  // Ensure at least one manual insight will be pushed on save (force)
  state._pendingLesson = currentLesson || 'free';
}

function saveInsight() {
  const input = document.getElementById('insight-input');
  const text = input.value.trim();
  if (!text) {
    alert('깨달음을 직접 한 줄 기록해보세요. 기록이 배움을 굳힙니다.');
    return;
  }

  if (!state.insights) state.insights = [];
  state.insights.push({
    date: new Date().toLocaleDateString('ko-KR'),
    text: text,
    lesson: state._pendingLesson || currentLesson || '자유 연습',
    familiar: state.familiar || null,
    manual: true
  });

  // ALWAYS LEARNING bonus + full persist
  state.knowledge = (state.knowledge || 0) + 4;
  state.magicPower = (state.magicPower || 0) + 2;
  state._pendingLesson = null;

  input.value = '';
  saveState();
  alert('깨달음 기록 완료. 배움이 한 걸음 더 깊어졌습니다.');

  updateUI();
  // Return to lessons optionally for next cast
  setTimeout(() => {
    const studyTab = document.getElementById('study');
    if (studyTab && !studyTab.classList.contains('hidden')) {
      // stay or hint
    }
  }, 120);
}

// Boot
function init() {
  loadState();

  // Add some starter spells if none
  if (state.spells.length === 0) {
    state.spells = ['elemental'];
    saveState();
  }

  // 5. Enhanced FOMO events + streak + reaction variety
  setInterval(() => {
    const fomo = document.querySelector('.fomo');
    if (fomo && Math.random() < 0.12) {
      const variants = [
        `🔥 지금 ${Math.floor(Math.random()*38)+14}명의 학생이 반응 주문 압박 훈련 중`,
        `🌙 ${Math.floor(Math.random()*11)+4}명이 streak ${state.streak}일 달성 — 희귀 에코 잔향 중`,
        `⚡ 반응 시퀀스 ${Math.floor(Math.random()*7)+3}초 이내 성공자 급증`
      ];
      fomo.innerHTML = `<strong>${variants[Math.floor(Math.random()*variants.length)]}</strong>`;
    }
  }, 22000);

  // Update familiars tab if open
  if (document.getElementById('familiars') && !document.getElementById('familiars').classList.contains('hidden')) {
    updateFamiliars();
  }

  // Legion DNA: unlock flavor + full ready
  if ((state.streak || 0) > 3 && !state.spells.includes('reaction')) {
    // reaction always unlocked for pressure training
  }

  // Ensure streak render live
  renderStreakFomoP5();

  // Post-boot Legion imprint
  console.log('%c[p5 Legion UPGRADE] casting(timing/memory/echo/reaction/accumulation) • FAMILIAR_BONUS_MAP live • streak FOMO • ALWAYS LEARNING forced • p3 funnel • fictional shield • full persist', 'color:#a78bfa');
}

window.onload = init;

// Full persistence safety net
window.addEventListener('beforeunload', () => { try { saveState(); } catch(e){} });