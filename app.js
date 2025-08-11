(() => {
  const DEFAULT_DECK = [
    // Shavian letters in alphabetical order
    { id: "peep", glyph: "𐑐", name: "(P)eep", ipa: "/p/", type: "Tall Letter - Voiceless Consonant" },
    { id: "bib", glyph: "𐑚", name: "(B)ib", ipa: "/b/", type: "Deep Letter - Voiced Consonant" },
    { id: "tot", glyph: "𐑑", name: "(T)ot", ipa: "/t/", type: "Tall Letter - Voiceless Consonant" },
    { id: "dead", glyph: "𐑛", name: "(D)ead", ipa: "/d/", type: "Deep Letter - Voiced Consonant" },
    { id: "kick", glyph: "𐑒", name: "(K)ick", ipa: "/k/", type: "Tall Letter - Voiceless Consonant" },
    { id: "gag", glyph: "𐑜", name: "(G)ag", ipa: "/ɡ/", type: "Deep Letter - Voiced Consonant" },
    { id: "fee", glyph: "𐑓", name: "(F)ee", ipa: "/f/", type: "Tall Letter - Voiceless Consonant" },
    { id: "vow", glyph: "𐑝", name: "(V)ow", ipa: "/v/", type: "Deep Letter - Voiced Consonant" },
    { id: "thigh", glyph: "𐑔", name: "(TH)igh", ipa: "/θ/", type: "Tall Letter - Voiceless Consonant" },
    { id: "they", glyph: "𐑞", name: "(TH)ey", ipa: "/ð/", type: "Deep Letter - Voiced Consonant" },
    { id: "so", glyph: "𐑕", name: "(S)o", ipa: "/s/", type: "Tall Letter - Voiceless Consonant" },
    { id: "zoo", glyph: "𐑟", name: "(Z)oo", ipa: "/z/", type: "Deep Letter - Voiced Consonant" },
    { id: "sure", glyph: "𐑖", name: "(SH)ure", ipa: "/ʃ/", type: "Tall Letter - Voiceless Consonant" },
    { id: "measure", glyph: "𐑠", name: "mea(S)ure", ipa: "/ʒ/", type: "Deep Letter - Voiced Consonant" },
    { id: "church", glyph: "𐑗", name: "(CH)urch", ipa: "/t͡ʃ/", type: "Tall Letter - Voiceless Consonant" },
    { id: "judge", glyph: "𐑡", name: "(J)udge", ipa: "/d͡ʒ/", type: "Deep Letter - Voiced Consonant" },
    { id: "yea", glyph: "𐑘", name: "(Y)ea", ipa: "/j/", type: "Tall Letter - Approximant" },
    { id: "woe", glyph: "𐑢", name: "(W)oe", ipa: "/w/", type: "Deep Letter - Approximant" },
    { id: "hung", glyph: "𐑙", name: "hu(NG)", ipa: "/ŋ/", type: "Tall Letter - Nasal" },
    { id: "haha", glyph: "𐑣", name: "(H)aha", ipa: "/h/", type: "Deep Letter - Voiceless Consonant" },
    { id: "loll", glyph: "𐑤", name: "(L)oll", ipa: "/l/", type: "Short Letter - Liquid" },
    { id: "roar", glyph: "𐑮", name: "(R)oar", ipa: "/ɹ/", type: "Short Letter - Liquid" },
    { id: "mime", glyph: "𐑥", name: "(M)ime", ipa: "/m/", type: "Short Letter - Nasal" },
    { id: "nun", glyph: "𐑯", name: "(N)un", ipa: "/n/", type: "Short Letter - Nasal" },
    { id: "if", glyph: "𐑦", name: "(I)f", ipa: "/ɪ/", type: "Short Letter - Vowel" },
    { id: "eat", glyph: "𐑰", name: "(E)at", ipa: "/iː/", type: "Short Letter - Vowel" },
    { id: "egg", glyph: "𐑧", name: "(E)gg", ipa: "/ɛ/", type: "Short Letter - Vowel" },
    { id: "age", glyph: "𐑱", name: "(A)ge", ipa: "/eɪ/", type: "Short Letter - Vowel" },
    { id: "ash", glyph: "𐑨", name: "(A)sh", ipa: "/æ/", type: "Short Letter - Vowel" },
    { id: "ice", glyph: "𐑲", name: "(I)ce", ipa: "/aɪ/", type: "Short Letter - Vowel" },
    { id: "ado", glyph: "𐑩", name: "(A)do", ipa: "/ə/", type: "Short Letter - Vowel (Schwa)" },
    { id: "up", glyph: "𐑳", name: "(U)p", ipa: "/ʌ/", type: "Short Letter - Vowel" },
    { id: "on", glyph: "𐑪", name: "(O)n", ipa: "/ɒ~ɑ/", type: "Short Letter - Vowel" },
    { id: "oak", glyph: "𐑴", name: "(O)ak", ipa: "/oʊ/", type: "Short Letter - Vowel" },
    { id: "wool", glyph: "𐑫", name: "w(OO)l", ipa: "/ʊ/", type: "Short Letter - Vowel" },
    { id: "ooze", glyph: "𐑵", name: "(OO)ze", ipa: "/uː/", type: "Short Letter - Vowel" },
    { id: "out", glyph: "𐑬", name: "(OU)t", ipa: "/aʊ/", type: "Short Letter - Vowel" },
    { id: "oil", glyph: "𐑶", name: "Oil", ipa: "/ɔɪ/", type: "Short Letter - Vowel" },
    { id: "ah", glyph: "𐑭", name: "Ah", ipa: "/ɑː/", type: "Short Letter - Vowel" },
    { id: "awe", glyph: "𐑷", name: "Awe", ipa: "/ɔː/", type: "Short Letter - Vowel" },
    { id: "are", glyph: "𐑸", name: "Are", ipa: "/ɑr/", type: "Compound Vowel" },
    { id: "or", glyph: "𐑹", name: "Or", ipa: "/ɔr/", type: "Compound Vowel" },
    { id: "air", glyph: "𐑺", name: "Air", ipa: "/ɛr/", type: "Compound Vowel" },
    { id: "err", glyph: "𐑻", name: "Err", ipa: "/ɜr/", type: "Compound Vowel" },
    { id: "array", glyph: "𐑼", name: "Array", ipa: "/ər/", type: "Compound Vowel" },
    { id: "ear", glyph: "𐑽", name: "Ear", ipa: "/ɪr/", type: "Compound Vowel" },
    { id: "ian", glyph: "𐑾", name: "Ian", ipa: "/aɪr/", type: "Compound Vowel" },
    { id: "yew", glyph: "𐑿", name: "Yew", ipa: "/juː/", type: "Compound Vowel" }
  ];

  const STORAGE_PREFIX = 'shavian_go_v1_';
  const el = (id) => document.getElementById(id);
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const storedDeck = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'deck') || 'null') || [];
  const deckMap = new Map(storedDeck.map(d => [d.id, d]));
  let deck = DEFAULT_DECK.map(d => deckMap.get(d.id) || d);
  let currentId = deck[0].id;
  let flipped = false;
  let stats = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'stats') || 'null') || {
    totalCorrect: 0,
    totalWrong: 0,
    perCard: {},
    sessions: 1,
    attempts: [],
  };
  let accountCode = localStorage.getItem(STORAGE_PREFIX + 'accountCode') || '';

  function persist() {
    localStorage.setItem(STORAGE_PREFIX + 'deck', JSON.stringify(deck));
    localStorage.setItem(STORAGE_PREFIX + 'stats', JSON.stringify(stats));
    if (accountCode) localStorage.setItem(STORAGE_PREFIX + 'accountCode', accountCode);
  }
  function current() { return deck.find(d => d.id === currentId) || deck[0]; }

  const cardFront = el('cardFront');
  const cardBack  = el('cardBack');
  const progressInner = el('progressInner');
  const forecastInner = el('forecastInner');
  const correctCount = el('correctCount');
  const wrongCount = el('wrongCount');
  const accuracy = el('accuracy');
  const perCardBody = el('perCardBody');
  const codeInput = el('accountCode');
  const loginBtn = el('loginBtn');
  const saveBtn = el('saveBtn');
  const newAccountBtn = el('newAccountBtn');
  if (codeInput) codeInput.value = accountCode;
  const cardProgressChart = new Chart(document.getElementById('cardProgressChart').getContext('2d'), {
    type: 'line',
    data: {
      datasets: [
        { label: '% Learned', data: [], borderColor: 'rgba(16,185,129,0.8)', fill: false },
        { label: 'Forecast', data: [], borderColor: 'rgba(59,130,246,0.8)', fill: false, pointRadius: 0 },
        { label: 'Forecast Upper', data: [], borderColor: 'rgba(59,130,246,0.3)', borderDash: [5,5], fill: false, pointRadius: 0 },
        { label: 'Forecast Lower', data: [], borderColor: 'rgba(59,130,246,0.3)', borderDash: [5,5], fill: false, pointRadius: 0 }
      ]
    },
    options: {
      responsive: true,
      scales: { x: { type: 'time' }, y: { beginAtZero: true, max: 100 } },
      plugins: { legend: { display: false } }
    }
  });

  function nextId(id) {
    const idx = deck.findIndex(d => d.id === id);
    return deck[(idx + 1) % deck.length].id;
  }

  function selectNext() {
    const allAttempted = deck.every(d => {
      const pc = stats.perCard[d.id];
      return pc && (pc.correct + pc.wrong) > 0;
    });
    if (!allAttempted) {
      const idx = deck.findIndex(d => d.id === currentId);
      for (let i = 1; i <= deck.length; i++) {
        const next = deck[(idx + i) % deck.length];
        const pc = stats.perCard[next.id];
        if (!pc || (pc.correct + pc.wrong) === 0) return next.id;
      }
      return deck[(idx + 1) % deck.length].id;
    }
    const weights = deck.map(d => {
      const pc = stats.perCard[d.id] || { correct: 0, wrong: 0 };
      return (pc.wrong + 1) / (pc.correct + 1);
    });
    const maxW = Math.max(...weights);
    const minW = Math.min(...weights);
    if (Math.abs(maxW - minW) < 1e-9) {
      return nextId(currentId);
    }
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < deck.length; i++) {
      r -= weights[i];
      if (r <= 0) return deck[i].id;
    }
    return deck[deck.length - 1].id;
  }

  function fourierForecast(points, steps) {
    const n = points.length;
    if (n === 0) return { forecast: [], moe: 0 };
    const y = points.map(p => p.y);
    const kMax = Math.min(5, Math.floor(n / 2));
    const twoPiOverN = 2 * Math.PI / n;
    const a = new Array(kMax + 1).fill(0);
    const b = new Array(kMax + 1).fill(0);
    for (let k = 0; k <= kMax; k++) {
      let sumA = 0, sumB = 0;
      for (let t = 0; t < n; t++) {
        const angle = twoPiOverN * k * t;
        sumA += y[t] * Math.cos(angle);
        sumB += y[t] * Math.sin(angle);
      }
      a[k] = (2 / n) * sumA;
      b[k] = (2 / n) * sumB;
    }
    a[0] /= 2;

    const fit = [];
    for (let t = 0; t < n; t++) {
      let val = a[0];
      for (let k = 1; k <= kMax; k++) {
        const angle = twoPiOverN * k * t;
        val += a[k] * Math.cos(angle) + b[k] * Math.sin(angle);
      }
      fit.push(val);
    }
    const rmse = Math.sqrt(fit.reduce((acc, val, i) => acc + (y[i] - val) * (y[i] - val), 0) / n);
    const moe = 1.96 * rmse;

    const forecast = [];
    for (let i = 1; i <= steps; i++) {
      const t = n + i - 1;
      let val = a[0];
      for (let k = 1; k <= kMax; k++) {
        const angle = twoPiOverN * k * t;
        val += a[k] * Math.cos(angle) + b[k] * Math.sin(angle);
      }
      forecast.push(val);
    }
    return { forecast, moe };
  }

  function render() {
    const cur = current();
    cardFront.textContent = cur.glyph;
    cardBack.innerHTML = `<div class="name">${cur.name}</div><div class="ipa"><b>${cur.ipa || ''}</b></div><div class="type">${cur.type || ''}</div>`;

    cardFront.classList.toggle('show', !flipped);
    cardBack.classList.toggle('show', flipped);

    const pc = stats.perCard[cur.id] || {correct:0, wrong:0, attempts:[]};
    const attempts = pc.attempts || [];
    const alpha = 0.3;
    let ema = 0;
    const progressPoints = attempts.map((a, i) => {
      const val = a.result === 'correct' ? 1 : 0;
      ema = i === 0 ? val : alpha * val + (1 - alpha) * ema;
      return { x: new Date(a.t), y: ema * 100 };
    });
    const trend = fourierForecast(progressPoints, 10);
    const futurePoints = [], futureUpper = [], futureLower = [];
    if (progressPoints.length) {
      const lastTime = attempts.length ? attempts[attempts.length - 1].t : Date.now();
      const avgInterval = attempts.length > 1 ?
        (attempts[attempts.length - 1].t - attempts[0].t) / (attempts.length - 1) : 60000;
      trend.forecast.forEach((val, i) => {
        const time = new Date(lastTime + avgInterval * (i + 1));
        const y = clamp(val, 0, 100);
        futurePoints.push({ x: time, y });
        futureUpper.push({ x: time, y: clamp(y + trend.moe, 0, 100) });
        futureLower.push({ x: time, y: clamp(y - trend.moe, 0, 100) });
      });
      const lastPoint = progressPoints[progressPoints.length - 1];
      futurePoints.unshift(lastPoint);
      futureUpper.unshift({ x: lastPoint.x, y: lastPoint.y });
      futureLower.unshift({ x: lastPoint.x, y: lastPoint.y });
    }
    const learned = progressPoints.length ? progressPoints[progressPoints.length - 1].y : 0;
    const predicted = futurePoints.length > 1 ? futurePoints[1].y : learned;
    progressInner.style.width = learned + '%';
    forecastInner.style.width = predicted + '%';
    cardProgressChart.data.datasets[0].data = progressPoints;
    cardProgressChart.data.datasets[1].data = futurePoints;
    cardProgressChart.data.datasets[2].data = futureUpper;
    cardProgressChart.data.datasets[3].data = futureLower;
    cardProgressChart.update();

    correctCount.textContent = stats.totalCorrect;
    wrongCount.textContent = stats.totalWrong;
    const total = stats.totalCorrect + stats.totalWrong;
    accuracy.textContent = (total ? Math.round((stats.totalCorrect / total) * 100) : 0) + '%';

    perCardBody.innerHTML = '';
    deck.forEach(d => {
      const pc = stats.perCard[d.id] || {correct:0, wrong:0};
      const tries = pc.correct + pc.wrong;
      const acc = tries ? Math.round((pc.correct / tries) * 100) : 0;
      const tr = document.createElement('tr');
      tr.innerHTML = `<td class="glyph">${d.glyph}</td><td>${d.name}</td><td class="tr">${pc.correct}</td><td class="tr">${pc.wrong}</td><td class="tr">${acc}%</td>`;
      perCardBody.appendChild(tr);
    });

    persist();
  }

  function record(result) {
    const id = current().id;
    const pc = stats.perCard[id] || {correct:0, wrong:0, attempts:[]};
    const now = Date.now();
    if (result === 'correct') { pc.correct++; stats.totalCorrect++; }
    else { pc.wrong++; stats.totalWrong++; }
    (pc.attempts || (pc.attempts = [])).push({ t: now, result });
    stats.perCard[id] = pc;
    (stats.attempts || (stats.attempts = [])).push({ t: now, result });
    currentId = selectNext();
    flipped = false;
    render();
  }
  el('resetBtn').addEventListener('click', () => {
    stats = { totalCorrect: 0, totalWrong: 0, perCard: {}, sessions: (stats.sessions||0)+1, attempts: [] };
    currentId = deck[0].id;
    flipped = false; render();
  });
  function skip() {
    currentId = selectNext();
    flipped = false;
    render();
  }
  el('skipBtn').addEventListener('click', skip);
  el('wrongBtn').addEventListener('click', () => record('wrong'));
  el('correctBtn').addEventListener('click', () => record('correct'));

  const card = document.getElementById('card');
  card.addEventListener('click', () => { flipped = !flipped; render(); });
  card.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowUp') { e.preventDefault(); flipped = !flipped; render(); }
    if (e.code === 'ArrowDown') { e.preventDefault(); skip(); }
    if (e.code === 'ArrowLeft') { e.preventDefault(); record('wrong'); }
    if (e.code === 'ArrowRight') { e.preventDefault(); record('correct'); }
  });

  const deckDialog = document.getElementById('deckDialog');
  const deckTextarea = document.getElementById('deckTextarea');
  document.getElementById('editDeckBtn').addEventListener('click', () => {
    deckTextarea.value = JSON.stringify(deck, null, 2);
    deckDialog.showModal();
  });
  document.getElementById('saveDeckBtn').addEventListener('click', () => {
    try {
      const parsed = JSON.parse(deckTextarea.value);
      if (!Array.isArray(parsed)) throw new Error('Deck must be an array');
      parsed.forEach((d,i)=>{ if(!d.id||!d.glyph||!d.name) throw new Error('Missing fields at index '+i); });
      deck = parsed.map(d=>({ id: String(d.id), glyph: String(d.glyph), name: String(d.name), ipa: d.ipa?String(d.ipa):'' }));
      currentId = deck[0] ? deck[0].id : null;
      flipped = false;
      render();
      deckDialog.close();
    } catch (e) {
      alert('Invalid JSON: ' + e.message);
    }
  });
  document.getElementById('resetDeckBtn').addEventListener('click', () => {
    deckTextarea.value = JSON.stringify(DEFAULT_DECK, null, 2);
  });

  async function loadAccount() {
    const code = codeInput.value.trim();
    if (!code) { alert('Enter account code'); return; }
    accountCode = code;
    localStorage.setItem(STORAGE_PREFIX + 'accountCode', accountCode);
    const res = await fetch('/api/load', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: accountCode })
    });
    if (!res.ok) { alert('Account not found'); return; }
    const data = await res.json();
    deck = data.deck || deck;
    stats = data.stats || stats;
    currentId = deck[0] ? deck[0].id : currentId;
    flipped = false;
    render();
  }

  async function saveAccount() {
    if (!accountCode) { alert('No account code'); return; }
    await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: accountCode, deck, stats })
    });
    alert('Saved');
  }

  async function newAccount() {
    const res = await fetch('/api/new-account', { method: 'POST' });
    const data = await res.json();
    accountCode = data.code;
    if (codeInput) codeInput.value = accountCode;
    localStorage.setItem(STORAGE_PREFIX + 'accountCode', accountCode);
    alert('Your account code: ' + accountCode);
  }

  loginBtn && loginBtn.addEventListener('click', loadAccount);
  saveBtn && saveBtn.addEventListener('click', saveAccount);
  newAccountBtn && newAccountBtn.addEventListener('click', newAccount);

  currentId = deck[0].id;
  render();
})();
