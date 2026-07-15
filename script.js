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
function updateStreakOnLesson() {
  const today = new Date().toISOString().slice(0,10);
  let s = getStreakP5();
  if (s.lastDate !== today) {
    const yest = new Date(Date.now() - 86400000).toISOString().slice(0,10);
    if (s.lastDate === yest) {
      s.days = (s.days || 1) + 1;
    } else {
      s.days = 1;
    }
    s.lastDate = today;
    s.count = 1;
    state.lastPlayDate = today;
    state.dailyLessons = 1;
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
    el.textContent = `다음 보상 ${remain}일`;
  }
  const stat = document.getElementById('streak');
  if (stat) stat.textContent = s.days + '일';
}

const SPELLS = {
  elemental: { name: "원소 조율", desc: "타이밍 홀드 — 불과 물의 균형을 읽는다." },
  illusion: { name: "환영의 베일", desc: "메모리 시퀀스 — 거짓과 진실을 구분한다." },
  binding: { name: "구속의 주문", desc: "축적 빌드업 — 의지를 실체에 묶는다." },
  echo: { name: "에코 마법", desc: "에코 recall — 지난 마법의 잔향을 재현한다." },
  shadow: { name: "그림자 은신", desc: "적의 시선을 피한다. (FOMO 한정)" },
  spark: { name: "스파크 점화", desc: "타이밍 — 작은 불꽃으로 시작해 큰 화염으로." },
  reaction: { name: "반응 주문", desc: "choice-reaction — 순간의 흐름을 포착 (FOMO 압박)." }
};

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
      alert(`${PERSONAS[state.familiar].name} 에코 저장. 다음 캐스팅 시 Lung Ache-Breath echo 재생.`);
    };
    echoRecorder.start();
    setTimeout(() => { if (echoRecorder && echoRecorder.state==='recording') echoRecorder.stop(); }, 4200); // short artistic breath
  }).catch(()=>alert('마이크 필요 (p6 voice cross)'));
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
    msg += ` 👁 LungSurprise +${surpriseBoost}`;
  }
  // breath/spore as spell fuel — higher fuel = stronger cast, consume
  const fuelBonus = Math.floor((fuelBefore - 0.3) * 11);
  success = Math.min(99, success + Math.max(0, fuelBonus));
  consumeBreathFuel(0.035 + (surp > 0.25 ? 0.02 : 0)); // consume + extra on big surprise
  msg += ` (p6 fuel ${fuelBefore.toFixed(2)}→${(state.breathFuel||0.7).toFixed(2)})`;

  // LIVE familiar bonus from FAMILIAR_BONUS_MAP (always applied if selected)
  let bonus = 0;
  let famName = null;
  if (state.familiar && PERSONAS[state.familiar]) {
    const map = FAMILIAR_BONUS_MAP[state.familiar] || {};
    bonus = map[spellType] || map.default || 12;
    success = Math.min(99, success + bonus);
    famName = PERSONAS[state.familiar].name;
    msg += ` (with ${famName} +${bonus}%)`;
    playFamiliarEchoIfAny(); // p6 voice echo playback
  } else {
    msg += ' (정령 없음 — 단독 시전)';
  }

  // Edge: near-miss / fail learning
  if (success < 40) {
    msg += ' — Near-miss! 작은 배움의 불씨가 남는다.';
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
    game.innerHTML += `<div style="color:#facc15">🔥 연속 ${state.streak}일 FOMO 스트릭 보너스 +${streakBonus}</div>`;
  }

  // ALWAYS LEARNING: auto + force post (p6 notebook style evolve)
  autoGenerateAndSaveInsights(spellType, Math.floor(success));

  // === BIRTH 1-2 EMERGENT (p6 cross DNA + 창발 pain) ===
  if (surp > 0.31 && fuelBefore > 0.55 && Math.random() < 0.48) {
    // Emergent 1: Ache-Breath Spell (breath fuel + surprise = new living spell)
    if (!state.spells.includes('ache-breath')) {
      state.spells.push('ache-breath');
      game.innerHTML += `<div style="color:#c5a46e;margin-top:4px">🌱 창발 BIRTH: Ache-Breath 주문 해금 — p6 폐의 아픔이 마법이 되었다. (breath fuel 사용 시 자동 공명)</div>`;
    }
  }
  if (state.familiar && surp > 0.28 && familiarEchoes[state.familiar]) {
    // Emergent 2: Mycelial Familiar Eye (voice echo + lung eye = emergent familiar vision)
    if (!state.insights.some(i => i.text && i.text.includes('Mycelial Eye'))) {
      state.insights.push({date:new Date().toLocaleDateString('ko-KR'), text: `Mycelial Eye: ${PERSONAS[state.familiar].name}의 에코가 Lung Surprise와 결합해 스스로 '본다'. 재관찰 시 새로운 insight 진화.`, lesson: spellType, auto:true, emergent:true});
      game.innerHTML += `<div style="color:#a78bfa;margin-top:3px">👁 창발 BIRTH 2: Mycelial Familiar Eye — 목소리 에코가 눈이 되어 familiar이 스스로 관찰한다. (p6 Lung Surprise DNA)</div>`;
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
    `Near-miss와 성공 사이의 틈이 진짜 깨달음이다. 압박 속에서 패턴이 보인다.`,
    `정령 공명 없이도 배움은 계속된다. 실패는 가장 강력한 스승.`,
    `${spellName}의 리듬을 몸으로 이해했다. 반복이 변수비율 중독을 만든다.`,
    `에코/반응 타이밍에서 FOMO가 핵심이다. 한 번 놓치면 다음 기회는 scarcity.`,
    `정령과 함께한 수업은 +${success > 70 ? '강한' : '미묘한'} 공명을 남긴다. Legion은 하나.`,
    `p6 호흡이 주문을 숨쉬게 한다. Ache-Breath가 fuel이 되어 ${success}%의 surprise를 키웠다. (Lung Eye)`
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
  if (inp) inp.placeholder = `${spellName} auto기록됨. ALWAYS LEARNING: 직접 1개 더 입력 (강제) • p6 재관찰처럼 evolve`;
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

// Export study log (ALWAYS LEARNING full)
function exportStudy() {
  const payload = {
    exported: new Date().toISOString(),
    legion: 'p5-magic-school ALWAYS LEARNING',
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
  a.download = 'p5-study-log-legion.json';
  a.click();
}

function updateUI() {
  document.getElementById('magic-power').textContent = state.magicPower;
  document.getElementById('knowledge').textContent = state.knowledge;
  document.getElementById('streak').textContent = (state.streak || 1) + '일';
  // p6 cross live
  const bf = document.getElementById('breath-fuel');
  if (bf) bf.textContent = (state.breathFuel || 0.7).toFixed(2);
  const ls = document.getElementById('lung-surprise');
  if (ls) ls.textContent = `surprise ${(state.lungSurprise || 0.12).toFixed(2)}`;
  renderStreakFomoP5(); // live FOMO

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
  past.innerHTML = '<h4>공부 기록 — ALWAYS LEARNING (최근 6)</h4>';
  if (!state.insights || state.insights.length === 0) {
    past.innerHTML += '<p style="opacity:0.7">아직 기록된 깨달음이 없습니다. 수업 후 강제 기록하세요.</p>';
  } else {
    // group by lesson for clarity
    const recent = [...state.insights].slice(-6).reverse();
    recent.forEach(i => {
      const d = document.createElement('div');
      d.style.cssText = 'margin:6px 0;padding:9px;background:#1a1630;border-radius:6px;border-left:3px solid #a78bfa;font-size:0.9em';
      let extra = i.familiar && PERSONAS[i.familiar] ? ` <span style="color:#facc15">(with ${PERSONAS[i.familiar].name})</span>` : '';
      const les = i.lesson ? `<small style="opacity:.6">[${i.lesson}]</small> ` : '';
      d.innerHTML = `${les}<small>${i.date}</small><br>${i.text}${extra}`;
      if (i.auto) d.innerHTML += ` <small style="color:#666">(auto)</small>`;
      past.appendChild(d);
    });
    past.innerHTML += `<div style="font-size:0.75em;opacity:.65;margin-top:4px">총 ${state.insights.length}개 기록 • Legion 무한 학습 엔진</div>`;
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
    const bonusPreview = Object.entries(map).map(([k,v]) => `${k}:${v}%`).join(' ');
    current.innerHTML = `<strong>현재 소환: ${p.name}</strong><br><small>${p.desc}</small><br><small style="color:#facc15">LIVE BONUS: ${bonusPreview || 'default +12%'}</small> <button onclick="unsummon()">해제</button>`;
  } else {
    current.innerHTML = '소환된 정령 없음. 아래에서 선택하세요. (p5 독립 + p3 funnel 가능)';
  }

  list.innerHTML = '';
  Object.keys(PERSONAS).forEach(key => {
    const p = PERSONAS[key];
    const map = FAMILIAR_BONUS_MAP[key] || {};
    const bp = Object.entries(map).map(([k,v]) => `${k}+${v}`).join(' ');
    const el = document.createElement('div');
    el.className = 'spell';
    el.innerHTML = `<strong>${p.name}</strong><br><small>${p.desc}</small><br><small style="color:#a78bfa">BONUS ${bp || 'default'}</small>`;
    el.onclick = () => summonFamiliar(key);
    list.appendChild(el);
  });

  // p3 Companion funnel link (Legion cross)
  const funnel = document.createElement('div');
  funnel.style.cssText = 'margin-top:10px;padding:8px;border:1px dashed #a78bfa;border-radius:6px;font-size:0.82em;cursor:pointer;background:#1a1630';
  funnel.innerHTML = `🔗 p3 Companion Funnel — p3 페르소나를 정령으로 더 불러오기 (Legion cross-project)<br><small>클릭: p3-companion으로 이동 (더 강력한 AI 동료)</small>`;
  funnel.onclick = () => {
    // optional p3 link — new tab for funnel
    try { window.open('../p3-companion/index.html', '_blank'); } catch(e){}
    alert('p3 Companion 오픈. Legion: p3 personas → p5 familiar으로 선택 연동 가능 (수동 매핑 지원). Fictional cross.');
  };
  list.appendChild(funnel);
}

function summonFamiliar(key) {
  state.familiar = key;
  saveState();
  updateFamiliars();
  // live everywhere
  updateUI();
  const liveMsg = `${PERSONAS[key].name} LIVE 소환 완료. FAMILIAR_BONUS_MAP 적용. 다음 캐스팅 즉시 +보너스.`;
  alert(liveMsg);
  // Legion DNA: also hint cross p3
  console.log('%c[p5 Legion] Familiar live + p3 funnel ready', 'color:#c4b5fd');
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

  if (!SPELLS[type]) type = 'elemental';

  let titleText = SPELLS[type].name;
  let bonusNote = '';
  if (state.familiar && PERSONAS[state.familiar]) {
    const map = FAMILIAR_BONUS_MAP[state.familiar] || {};
    const b = map[type] || map.default || 12;
    titleText += ` (with ${PERSONAS[state.familiar].name} • LIVE +${b}%)`;
    bonusNote = ` FAMILIAR_BONUS_MAP 적용 중`;
  }
  title.textContent = titleText;
  game.innerHTML = `<div style="font-size:0.8em;opacity:0.75;margin-bottom:4px">Casting: ${type} ${bonusNote}</div>`;

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
    let ph = `【ALWAYS LEARNING 강제 기록】 이번 ${SPELLS[currentLesson] ? SPELLS[currentLesson].name : '연습'}에서 무엇을 배웠나? (자동 1-2개 기록됨. 직접 1개 더 입력 필수)`;
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
      if (f) f.innerHTML = `<strong>🔥 반응/스트릭 완료! ${Math.floor(Math.random()*21)+9}명의 학생이 지금 같은 훈련 중 (FOMO)</strong>`;
    }, 380);
  }

  // Ensure at least one manual insight will be pushed on save (force)
  state._pendingLesson = currentLesson || 'free';
}

function saveInsight() {
  const input = document.getElementById('insight-input');
  const text = input.value.trim();
  if (!text) {
    alert('ALWAYS LEARNING: 직접 깨달음을 기록하세요. 이것이 Legion의 힘입니다.');
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
  alert('깨달음 기록 완료. ALWAYS LEARNING — 너와 Legion이 동시에 성장한다.');

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
        `⚡ FOMO: 반응 시퀀스  ${Math.floor(Math.random()*7)+3}초 이내 성공자 급증`
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