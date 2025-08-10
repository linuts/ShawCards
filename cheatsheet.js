(() => {
  const STORAGE_PREFIX = 'shavian_go_v1_';
  const storedDeck = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'deck') || '[]');
  const ORDER = [
    'peep','bib','tot','dead','kick','gag','fee','vow','thigh','they','so','zoo',
    'sure','measure','church','judge','yea','woe','hung','haha','loll','roar','mime',
    'nun','if','eat','egg','age','ash','ice','ado','up','on','oak','wool','ooze',
    'out','oil','ah','awe','are','or','air','err','array','ear','ian','yew'
  ];
  const deckMap = new Map(storedDeck.map(d => [d.id, d]));
  const deck = ORDER.map(id => deckMap.get(id)).filter(Boolean);

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
    ['peep', 'bib'], ['tot', 'dead'], ['kick', 'gag'], ['fee', 'vow'],
    ['thigh', 'they'], ['so', 'zoo'], ['sure', 'measure'], ['church', 'judge'],
    ['yea', 'woe'], ['hung', 'haha']
  ];

  const shortPairs = [
    ['loll', 'roar'], ['mime', 'nun'], ['if', 'eat'], ['egg', 'age'],
    ['ash', 'ice'], ['ado', 'up'], ['on', 'oak'], ['wool', 'ooze'],
    ['out', 'oil'], ['ah', 'awe']
  ];

  const compounds = ['are','or','air','err','array','ear','ian','yew'];

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
