(() => {
  const DEFAULT_DECK = [
    { id: "peep", glyph: "𐑐", name: "peep", ipa: "/p/" },
    { id: "bab", glyph: "𐑚", name: "bab", ipa: "/b/" },
    { id: "tot", glyph: "𐑑", name: "tot", ipa: "/t/" },
    { id: "dead", glyph: "𐑛", name: "dead", ipa: "/d/" },
    { id: "kick", glyph: "𐑒", name: "kick", ipa: "/k/" },
    { id: "gag", glyph: "𐑜", name: "gag", ipa: "/ɡ/" },
    { id: "fee", glyph: "𐑓", name: "fee", ipa: "/f/" },
    { id: "vow", glyph: "𐑝", name: "vow", ipa: "/v/" },
    { id: "thigh", glyph: "𐑔", name: "thigh", ipa: "/θ/" },
    { id: "they", glyph: "𐑞", name: "they", ipa: "/ð/" },
    { id: "so", glyph: "𐑕", name: "so", ipa: "/s/" },
    { id: "zoo", glyph: "𐑟", name: "zoo", ipa: "/z/" },
    { id: "shy", glyph: "𐑖", name: "shy", ipa: "/ʃ/" },
    { id: "azure", glyph: "𐑠", name: "azure", ipa: "/ʒ/" },
    { id: "church", glyph: "𐑗", name: "church", ipa: "/t͡ʃ/" },
    { id: "judge", glyph: "𐑡", name: "judge", ipa: "/d͡ʒ/" },
    { id: "yea", glyph: "𐑘", name: "yea", ipa: "/j/" },
    { id: "woe", glyph: "𐑢", name: "woe", ipa: "/w/" },
    { id: "hung", glyph: "𐑙", name: "hung", ipa: "/ŋ/" },
    { id: "ha-ha", glyph: "𐑣", name: "ha-ha", ipa: "/h/" },
    { id: "lol", glyph: "𐑤", name: "lol", ipa: "/l/" },
    { id: "roar", glyph: "𐑮", name: "roar", ipa: "/ɹ/" },
    { id: "mime", glyph: "𐑥", name: "mime", ipa: "/m/" },
    { id: "nun", glyph: "𐑯", name: "nun", ipa: "/n/" },
    { id: "egg", glyph: "𐑧", name: "egg", ipa: "/ɛ/" },
    { id: "ash", glyph: "𐑨", name: "ash", ipa: "/æ/" },
    { id: "odd", glyph: "𐑪", name: "odd", ipa: "/ɒ~ɑ/" },
    { id: "up", glyph: "𐑳", name: "up", ipa: "/ʌ/" },
    { id: "ado", glyph: "𐑩", name: "ado", ipa: "/ə/" },
    { id: "eat", glyph: "𐑰", name: "eat", ipa: "/iː/" },
    { id: "if", glyph: "𐑦", name: "if", ipa: "/ɪ/" },
    { id: "ooze", glyph: "𐑵", name: "ooze", ipa: "/uː/" },
    { id: "wool", glyph: "𐑬", name: "wool", ipa: "/ʊ/" },
    { id: "age", glyph: "𐑱", name: "age", ipa: "/eɪ/" },
    { id: "ice", glyph: "𐑲", name: "ice", ipa: "/aɪ/" },
    { id: "oak", glyph: "𐑴", name: "oak", ipa: "/oʊ/" },
    { id: "awe", glyph: "𐑷", name: "awe", ipa: "/ɔː/" },
    { id: "out", glyph: "𐑿", name: "out", ipa: "/aʊ/" },
    { id: "oil", glyph: "𐑶", name: "oil", ipa: "/ɔɪ/" }
  ];

  const STORAGE_PREFIX = 'shavian_go_v1_';
  const el = (id) => document.getElementById(id);
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  let deck = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'deck') || 'null') || DEFAULT_DECK;
  let currentId = localStorage.getItem(STORAGE_PREFIX + 'currentId');
  let flipped = false;
  let stats = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'stats') || 'null') || {
    totalCorrect: 0,
    totalWrong: 0,
    perCard: {},
    sessions: 1,
    attempts: [],
  };

  function persist() {
    localStorage.setItem(STORAGE_PREFIX + 'deck', JSON.stringify(deck));
    if (currentId) localStorage.setItem(STORAGE_PREFIX + 'currentId', currentId);
    localStorage.setItem(STORAGE_PREFIX + 'stats', JSON.stringify(stats));
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

  function weight(id) {
    const pc = stats.perCard[id] || {correct:0, wrong:0};
    return Math.max(1, 1 + pc.wrong - pc.correct);
  }

  function pickNext(excludeId) {
    const weights = deck.map(d => ({ id: d.id, w: weight(d.id) }));
    if (excludeId && deck.length > 1) {
      weights.forEach(w => { if (w.id === excludeId) w.w = 0; });
    }
    const total = weights.reduce((s, w) => s + w.w, 0);
    let r = Math.random() * total;
    for (const w of weights) {
      if (w.w === 0) continue;
      r -= w.w;
      if (r <= 0) return w.id;
    }
    return weights.find(w => w.w > 0).id;
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
    cardBack.innerHTML = `<div class="name">${cur.name}</div><div class="ipa"><b>${cur.ipa || ''}</b></div>`;

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
    }
    const learned = progressPoints.length ? progressPoints[progressPoints.length - 1].y : 0;
    const predicted = futurePoints.length ? futurePoints[0].y : learned;
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
    currentId = pickNext(id);
    flipped = false;
    render();
  }
  el('resetBtn').addEventListener('click', () => {
    stats = { totalCorrect: 0, totalWrong: 0, perCard: {}, sessions: (stats.sessions||0)+1, attempts: [] };
    currentId = pickNext();
    flipped = false; render();
  });
  el('skipBtn').addEventListener('click', () => { currentId = pickNext(currentId); flipped = false; render(); });
  el('wrongBtn').addEventListener('click', () => record('wrong'));
  el('correctBtn').addEventListener('click', () => record('correct'));

  const card = document.getElementById('card');
  card.addEventListener('click', () => { flipped = !flipped; render(); });
  card.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { e.preventDefault(); flipped = !flipped; render(); }
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
      currentId = pickNext();
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

  if (!currentId) currentId = pickNext();
  render();
})();
