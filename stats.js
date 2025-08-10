(() => {
  const STORAGE_PREFIX = 'shavian_go_v1_';
  const stats = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'stats') || '{}');
  const storedDeck = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'deck') || '[]');
  const ORDER = [
    'peep','bib','tot','dead','kick','gag','fee','vow','thigh','they','so','zoo',
    'sure','measure','church','judge','yea','woe','hung','haha','loll','roar','mime',
    'nun','if','eat','egg','age','ash','ice','ado','up','on','oak','wool','ooze',
    'out','oil','ah','awe','are','or','air','err','array','ear','ian','yew'
  ];
  const deckMap = new Map(storedDeck.map(d => [d.id, d]));
  const deck = ORDER.map(id => deckMap.get(id)).filter(Boolean);

  document.getElementById('totalSessions').textContent = stats.sessions || 1;
  document.getElementById('totalCorrect').textContent = stats.totalCorrect || 0;
  document.getElementById('totalWrong').textContent = stats.totalWrong || 0;
  const total = (stats.totalCorrect || 0) + (stats.totalWrong || 0);
  document.getElementById('overallAcc').textContent = total ? Math.round((stats.totalCorrect || 0) / total * 100) + '%' : '0%';

  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

  const attempts = stats.attempts || [];
  const alpha = 0.3; // weight newer data more heavily
  let ema = 0;
  const progressPoints = attempts.map((a, i) => {
    const val = a.result === 'correct' ? 1 : 0;
    ema = i === 0 ? val : alpha * val + (1 - alpha) * ema;
    return { x: new Date(a.t), y: ema * 100 };
  });

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

  const perCardStats = deck.map(d => {
    const pcRaw = (stats.perCard && stats.perCard[d.id]) || {};
    const correct = pcRaw.correct || 0;
    const wrong = pcRaw.wrong || 0;
    return { glyph: d.glyph, correct, wrong };
  });

  const labels = perCardStats.map(p => p.glyph);
  const correct = perCardStats.map(p => p.correct);
  const wrong = perCardStats.map(p => p.wrong);

  const progCtx = document.getElementById('progressChart').getContext('2d');
  new Chart(progCtx, {
    type: 'line',
    data: {
      datasets: [
        { label: '% Learned', data: progressPoints, borderColor: 'rgba(16,185,129,0.8)', fill: false },
        { label: `Fourier Forecast (±${trend.moe.toFixed(1)}%)`, data: futurePoints, borderColor: 'rgba(59,130,246,0.8)', fill: false },
        { label: 'Forecast Upper', data: futureUpper, borderColor: 'rgba(59,130,246,0.3)', borderDash: [5,5], fill: false, pointRadius: 0 },
        { label: 'Forecast Lower', data: futureLower, borderColor: 'rgba(59,130,246,0.3)', borderDash: [5,5], fill: false, pointRadius: 0 }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: { type: 'time' },
        y: { beginAtZero: true, max: 100 }
      }
    }
  });

  const ctx = document.getElementById('perCardChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Correct', data: correct, backgroundColor: 'rgba(16,185,129,0.7)' },
        { label: 'Wrong', data: wrong, backgroundColor: 'rgba(239,68,68,0.7)' }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true }
      }
    }
  });
})();
