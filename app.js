 (async () => {
  const STORAGE_PREFIX = 'shavian_go_v1_';
  const el = (id) => document.getElementById(id);
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  let deck = await (await fetch('/api/deck')).json();
  let currentId = deck[0].id;
  let flipped = false;
  let stats = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'stats') || 'null') || {
    totalCorrect: 0,
    totalWrong: 0,
    perCard: {},
    attempts: [],
  };
  let accountCode = '';

  function persist() {
    localStorage.setItem(STORAGE_PREFIX + 'stats', JSON.stringify(stats));
    scheduleSave();
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
  let saveTimer;
  function scheduleSave() {
    if (!accountCode) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: accountCode, stats })
      });
    }, 1000);
  }
  window.addEventListener('beforeunload', () => {
    if (!accountCode) return;
    navigator.sendBeacon('/api/save', new Blob([JSON.stringify({ code: accountCode, stats })], { type: 'application/json' }));
  });

  async function ensureAccount() {
    accountCode = location.hash.slice(1);
    if (!accountCode) {
      stats = { totalCorrect: 0, totalWrong: 0, perCard: {}, attempts: [] };
      localStorage.removeItem(STORAGE_PREFIX + 'stats');
      const res = await fetch('/api/new-account', { method: 'POST' });
      const data = await res.json();
      accountCode = data.code;
      location.hash = accountCode;
    }
    document.querySelectorAll('a[href="/stats"], a[href="/cheatsheet"]').forEach(a => {
      a.href = a.getAttribute('href') + '#' + accountCode;
    });
    const res = await fetch('/api/load', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: accountCode })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.stats) {
        stats = data.stats;
        localStorage.setItem(STORAGE_PREFIX + 'stats', JSON.stringify(stats));
      }
    }
  }
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

  await ensureAccount();
  currentId = deck[0].id;
  render();
})();
