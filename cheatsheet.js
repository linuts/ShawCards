(async () => {
  const STORAGE_PREFIX = 'shavian_go_v1_';
  let accountCode = location.hash.slice(1) || localStorage.getItem(STORAGE_PREFIX + 'accountCode') || '';
  if (!accountCode) {
    const res = await fetch('/api/new-account', { method: 'POST' });
    const data = await res.json();
    accountCode = data.code;
  }
  location.hash = accountCode;
  localStorage.setItem(STORAGE_PREFIX + 'accountCode', accountCode);
  document.querySelectorAll('a[href="/"], a[href="/stats"], a[href="/cheatsheet"]').forEach(link => {
    const path = link.getAttribute('href').split('#')[0];
    link.href = path + '#' + accountCode;
  });
  const res = await fetch('/api/load', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: accountCode })
  });
  if (res.ok) {
    const data = await res.json();
    if (data.stats) localStorage.setItem(STORAGE_PREFIX + 'stats', JSON.stringify(data.stats));
  }
  const deck = await (await fetch('/api/deck')).json();

  function get(id) {
    return deck.find(d => d.id === id) || { glyph: id, name: id };
  }

  function makeCell(letter) {
    const div = document.createElement('div');
    div.className = 'cell';
    div.innerHTML = `<div class="glyph">${letter.glyph}</div><div class="name">${letter.name}</div>`;
    return div;
  }

  const tallDeepPairs = [
    [1, 2], [3, 4], [5, 6], [7, 8],
    [9, 10], [11, 12], [13, 14], [15, 16],
    [17, 18], [19, 20]
  ];

  const shortPairs = [
    [21, 22], [23, 24], [25, 26], [27, 28],
    [29, 30], [31, 32], [33, 34], [35, 36],
    [37, 38], [39, 40]
  ];

  const compounds = [41,42,43,44,45,46,47,48];

  function buildPairs(id, pairs) {
    const grid = document.getElementById(id);
    pairs.forEach(([a, b]) => {
      const div = document.createElement('div');
      div.className = 'pair';
      div.appendChild(makeCell(get(a)));
      div.appendChild(makeCell(get(b)));
      grid.appendChild(div);
    });
  }

  buildPairs('tallDeepGrid', tallDeepPairs);
  buildPairs('shortGrid', shortPairs);

  const compoundGrid = document.getElementById('compoundGrid');
  compounds.forEach(id => { compoundGrid.appendChild(makeCell(get(id))); });

  const input = document.getElementById('spellInput');
  const keyboard = document.getElementById('keyboard');
  deck.forEach(d => {
    const btn = document.createElement('button');
    btn.textContent = d.glyph;
    btn.addEventListener('click', () => { input.value += d.glyph; });
    keyboard.appendChild(btn);
  });

  document.getElementById('clearBtn').addEventListener('click', () => { input.value = ''; });
  document.getElementById('backspaceBtn').addEventListener('click', () => { input.value = input.value.slice(0, -1); });
})();
