(async () => {
  let accountCode = location.hash.slice(1);
  if (!accountCode) {
    const res = await fetch('/api/new-account', { method: 'POST' });
    const data = await res.json();
    accountCode = data.code;
    location.hash = accountCode;
  }
  document.querySelectorAll('a[href="/"], a[href="/stats"], a[href="/cheatsheet"], a[href="/help"]').forEach(link => {
    const path = link.getAttribute('href').split('#')[0];
    link.href = path + '#' + accountCode;
  });
  const prog = document.getElementById('progressInner');
  const forecast = document.getElementById('forecastInner');
  if (prog && forecast) {
    prog.style.width = '60%';
    forecast.style.width = '80%';
  }
  const ctx1 = document.getElementById('progressChartExample').getContext('2d');
  const now = Date.now();
  const progress = [
    { x: new Date(now - 86400000 * 3), y: 20 },
    { x: new Date(now - 86400000 * 2), y: 40 },
    { x: new Date(now - 86400000), y: 55 },
    { x: new Date(now), y: 60 }
  ];
  const forecastPts = [
    { x: new Date(now), y: 60 },
    { x: new Date(now + 86400000), y: 70 },
    { x: new Date(now + 86400000 * 2), y: 80 }
  ];
  new Chart(ctx1, {
    type: 'line',
    data: {
      datasets: [
        { label: '% Learned', data: progress, borderColor: 'rgba(16,185,129,0.8)', fill: false },
        { label: 'Forecast', data: forecastPts, borderColor: 'rgba(59,130,246,0.8)', fill: false, pointRadius: 0 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { x: { type: 'time' }, y: { beginAtZero: true, max: 100 } }
    }
  });
  const ctx2 = document.getElementById('perCardChartExample').getContext('2d');
  new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: ['𐑕', '𐑚', '𐑛'],
      datasets: [
        { label: 'Correct', data: [3, 1, 0], backgroundColor: 'rgba(16,185,129,0.7)' },
        { label: 'Wrong', data: [1, 2, 4], backgroundColor: 'rgba(239,68,68,0.7)' }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } }
    }
  });
})();
