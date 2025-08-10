(() => {
  const STORAGE_PREFIX = 'shavian_go_v1_';
  const stats = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'stats') || '{}');
  const deck = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'deck') || '[]');

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

  function regression(points) {
    const n = points.length;
    if (n === 0) return { m: 0, b: 0 };
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    points.forEach((p, i) => {
      sumX += i; sumY += p.y; sumXY += i * p.y; sumXX += i * i;
    });
    const denom = n * sumXX - sumX * sumX;
    const m = denom ? (n * sumXY - sumX * sumY) / denom : 0;
    const b = (sumY - m * sumX) / n;
    return { m, b };
  }

  const trend = regression(progressPoints);
  const futurePoints = [];
  if (progressPoints.length) {
    const lastTime = attempts.length ? attempts[attempts.length - 1].t : Date.now();
    const avgInterval = attempts.length > 1 ?
      (attempts[attempts.length - 1].t - attempts[0].t) / (attempts.length - 1) : 60000;
    const lastIdx = progressPoints.length - 1;
    for (let i = 1; i <= 10; i++) {
      const idx = lastIdx + i;
      const time = new Date(lastTime + avgInterval * i);
      const y = clamp(trend.m * idx + trend.b, 0, 100);
      futurePoints.push({ x: time, y });
    }
  }

  const perCardStats = deck.map(d => {
    const pcRaw = (stats.perCard && stats.perCard[d.id]) || {};
    const correct = pcRaw.correct || 0;
    const wrong = pcRaw.wrong || 0;
    return { glyph: d.glyph, correct, wrong, diff: correct - wrong };
  }).sort((a, b) => b.diff - a.diff);

  const labels = perCardStats.map(p => p.glyph);
  const correct = perCardStats.map(p => p.correct);
  const wrong = perCardStats.map(p => p.wrong);

  const progCtx = document.getElementById('progressChart').getContext('2d');
  new Chart(progCtx, {
    type: 'line',
    data: {
      datasets: [
        { label: '% Learned', data: progressPoints, borderColor: 'rgba(59,130,246,0.8)', fill: false },
        { label: 'Trend', data: futurePoints, borderColor: 'rgba(16,185,129,0.6)', borderDash: [5,5], fill: false }
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
