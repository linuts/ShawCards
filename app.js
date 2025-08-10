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
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  let deck = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'deck') || 'null') || DEFAULT_DECK;
  let queue = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'queue') || 'null') || shuffle(deck.map(d => d.id));
  let idx = parseInt(localStorage.getItem(STORAGE_PREFIX + 'idx') || '0', 10);
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
    localStorage.setItem(STORAGE_PREFIX + 'queue', JSON.stringify(queue));
    localStorage.setItem(STORAGE_PREFIX + 'idx', String(idx));
    localStorage.setItem(STORAGE_PREFIX + 'stats', JSON.stringify(stats));
  }
  function current() { return deck.find(d => d.id === queue[idx]) || deck[0]; }

  const cardFront = el('cardFront');
  const cardBack  = el('cardBack');
  const progressInner = el('progressInner');
  const progressTrend = el('progressTrend');
  const correctCount = el('correctCount');
  const wrongCount = el('wrongCount');
  const accuracy = el('accuracy');
  const perCardBody = el('perCardBody');
  const cardProgressChart = new Chart(document.getElementById('cardProgressChart').getContext('2d'), {
    type: 'line',
    data: {
      datasets: [
        { label: '% Learned', data: [], borderColor: 'rgba(16,185,129,0.8)', fill: false },
        { label: 'Trend', data: [], borderColor: 'rgba(59,130,246,0.8)', fill: false, pointRadius: 0 }
      ]
    },
    options: {
      responsive: true,
      scales: { x: { type: 'linear', beginAtZero: true }, y: { beginAtZero: true, max: 100 } },
      plugins: { legend: { display: false } }
    }
  });

  function render() {
    const cur = current();
    cardFront.textContent = cur.glyph;
    cardBack.innerHTML = `<div class="name">${cur.name}</div><div class="ipa"><b>${cur.ipa || ''}</b></div>`;

    cardFront.classList.toggle('show', !flipped);
    cardBack.classList.toggle('show', flipped);

    const pc = stats.perCard[cur.id] || {correct:0, wrong:0, attempts:[]};
    const { pct, trendPct, points, trendLine } = (function() {
      const attempts = pc.attempts || [];
      const alpha = 0.3;
      let ema = 0;
      const points = attempts.map((a, i) => {
        const val = a.result === 'correct' ? 1 : 0;
        ema = i === 0 ? val : alpha * val + (1 - alpha) * ema;
        return { x: i, y: ema * 100 };
      });
      const n = points.length;
      const currentPct = n ? points[n - 1].y : 0;
      let predicted = currentPct;
      let trendLine = [];
      if (n >= 2) {
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        points.forEach(p => { sumX += p.x; sumY += p.y; sumXY += p.x * p.y; sumXX += p.x * p.x; });
        const denom = n * sumXX - sumX * sumX;
        const m = denom ? (n * sumXY - sumX * sumY) / denom : 0;
        const b = (sumY - m * sumX) / n;
        predicted = clamp(m * n + b, 0, 100);
        trendLine = [
          { x: 0, y: clamp(b, 0, 100) },
          { x: n, y: predicted }
        ];
      }
      return { pct: Math.round(currentPct), trendPct: Math.round(predicted), points, trendLine };
    })();
    progressInner.style.width = pct + '%';
    progressTrend.style.width = trendPct + '%';
    cardProgressChart.data.datasets[0].data = points;
    cardProgressChart.data.datasets[1].data = trendLine;
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

  function requeue(result) {
    const curId = queue[idx];
    queue.splice(idx, 1);
    const insertAt = result === 'wrong' ? clamp(idx + 3, 0, queue.length) : queue.length;
    queue.splice(insertAt, 0, curId);
    if (idx >= queue.length) idx = 0;
    flipped = false;
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
    requeue(result);
    render();
  }

  el('shuffleBtn').addEventListener('click', () => {
    queue = shuffle(deck.map(d => d.id));
    idx = 0; flipped = false; render();
  });
  el('resetBtn').addEventListener('click', () => {
    stats = { totalCorrect: 0, totalWrong: 0, perCard: {}, sessions: (stats.sessions||0)+1, attempts: [] };
    queue = shuffle(deck.map(d => d.id));
    idx = 0; flipped = false; render();
  });
  el('skipBtn').addEventListener('click', () => { idx = (idx + 1) % queue.length; flipped = false; render(); });
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
      const ids = deck.map(d=>d.id);
      queue = shuffle(ids);
      idx = 0; flipped = false;
      render();
      deckDialog.close();
    } catch (e) {
      alert('Invalid JSON: ' + e.message);
    }
  });
  document.getElementById('resetDeckBtn').addEventListener('click', () => {
    deckTextarea.value = JSON.stringify(DEFAULT_DECK, null, 2);
  });

  render();
})();
