(() => {
  const STORAGE_PREFIX = 'shavian_go_v1_';
  const deck = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'deck') || '[]');

  // All letters are now in the deck, so no extras are required.
  const extra = {};

  function get(id) {
    return deck.find(d => d.id === id) || extra[id];
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

  const compounds = [
    { glyph: '𐑸', name: 'Are' }, { glyph: '𐑹', name: 'Or' },
    { glyph: '𐑺', name: 'Air' }, { glyph: '𐑻', name: 'Err' },
    { glyph: '𐑼', name: 'Array' }, { glyph: '𐑽', name: 'Ear' },
    { glyph: '𐑾', name: 'Ian' }, { glyph: '𐑿', name: 'Yew' }
  ];

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
  compounds.forEach(c => { compoundGrid.appendChild(makeCell(c)); });

  const input = document.getElementById('spellInput');
  const keyboard = document.getElementById('keyboard');
  const keyboardLetters = deck.concat(compounds);
  keyboardLetters.forEach(d => {
    const btn = document.createElement('button');
    btn.textContent = d.glyph;
    btn.addEventListener('click', () => { input.value += d.glyph; });
    keyboard.appendChild(btn);
  });

  document.getElementById('clearBtn').addEventListener('click', () => { input.value = ''; });
  document.getElementById('backspaceBtn').addEventListener('click', () => { input.value = input.value.slice(0, -1); });
})();
