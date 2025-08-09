(() => {
  const STORAGE_PREFIX = 'shavian_go_v1_';
  const stats = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'stats') || '{}');
  const deck = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'deck') || '[]');

  document.getElementById('totalSessions').textContent = stats.sessions || 1;
  document.getElementById('totalCorrect').textContent = stats.totalCorrect || 0;
  document.getElementById('totalWrong').textContent = stats.totalWrong || 0;
  const total = (stats.totalCorrect || 0) + (stats.totalWrong || 0);
  document.getElementById('overallAcc').textContent = total ? Math.round((stats.totalCorrect || 0) / total * 100) + '%' : '0%';

  const labels = deck.map(d => d.glyph);
  const correct = deck.map(d => (stats.perCard && stats.perCard[d.id] ? stats.perCard[d.id].correct : 0));
  const wrong = deck.map(d => (stats.perCard && stats.perCard[d.id] ? stats.perCard[d.id].wrong : 0));

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
