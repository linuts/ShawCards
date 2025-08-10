(() => {
  const STORAGE_PREFIX = 'shavian_go_v1_';
  const deck = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'deck') || '[]');

  const tall = deck.filter(d => d.type && d.type.startsWith('Tall'));
  const deep = deck.filter(d => d.type && d.type.startsWith('Deep'));
  const short = deck.filter(d => d.type && d.type.startsWith('Short'));

  const letterGrid = document.getElementById('letterGrid');
  [tall, deep, short].forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'letter-row';
    row.forEach(d => {
      const cell = document.createElement('div');
      cell.className = 'letter-cell';
      cell.innerHTML = `<div class="glyph">${d.glyph}</div><div class="name">${d.name}</div>`;
      if (d.ipa) cell.title = d.ipa;
      rowDiv.appendChild(cell);
    });
    letterGrid.appendChild(rowDiv);
  });

  const input = document.getElementById('spellInput');
  const keyboard = document.getElementById('keyboard');
  [tall, deep, short].forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'keyboard-row';
    row.forEach(d => {
      const btn = document.createElement('button');
      btn.textContent = d.glyph;
      btn.addEventListener('click', () => { input.value += d.glyph; });
      rowDiv.appendChild(btn);
    });
    keyboard.appendChild(rowDiv);
  });

  document.getElementById('clearBtn').addEventListener('click', () => { input.value = ''; });
  document.getElementById('backspaceBtn').addEventListener('click', () => { input.value = input.value.slice(0, -1); });
})();
