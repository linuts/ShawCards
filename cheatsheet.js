(() => {
  const STORAGE_PREFIX = 'shavian_go_v1_';
  const deck = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'deck') || '[]');
  const byId = Object.fromEntries(deck.map(d => [d.id, d]));

  const layout = [
    [['peep','bib'], ['tot','dead'], ['kick','gag'], ['fee','vow'], ['thigh','they'], ['so','zoo'], ['sure','measure'], ['church','judge'], ['yea','woe'], ['hung','haha']],
    [['loll','roar'], ['mime','nun'], ['if','eat'], ['egg','age'], ['ash','ice'], ['ado','up'], ['on','oak'], ['wool','ooze'], ['out', null], [null, null]]
  ];

  const letterGrid = document.getElementById('letterGrid');
  layout.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'letter-row';
    row.forEach(pair => {
      const [aId, bId] = pair;
      const cell = document.createElement('div');
      cell.className = 'letter-cell';
      if (aId) {
        const a = byId[aId];
        cell.innerHTML += `<div class="glyph">${a.glyph}</div><div class="name">${a.name}</div>`;
      }
      if (bId) {
        const b = byId[bId];
        cell.innerHTML += `<div class="glyph">${b.glyph}</div><div class="name">${b.name}</div>`;
      }
      rowDiv.appendChild(cell);
    });
    letterGrid.appendChild(rowDiv);
  });

  const input = document.getElementById('spellInput');
  const keyboard = document.getElementById('keyboard');
  let shifted = false;
  function renderKeyboard() {
    keyboard.innerHTML = '';
    layout.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'keyboard-row';
      row.forEach(pair => {
        const [aId, bId] = pair;
        const id = shifted && bId ? bId : aId;
        if (!id) {
          const spacer = document.createElement('div');
          spacer.className = 'key-spacer';
          rowDiv.appendChild(spacer);
          return;
        }
        const letter = byId[id];
        const btn = document.createElement('button');
        btn.textContent = letter.glyph;
        btn.title = letter.name;
        btn.addEventListener('click', () => { input.value += letter.glyph; });
        rowDiv.appendChild(btn);
      });
      keyboard.appendChild(rowDiv);
    });
    const shiftRow = document.createElement('div');
    shiftRow.className = 'keyboard-row';
    const shiftBtn = document.createElement('button');
    shiftBtn.textContent = 'Shift';
    shiftBtn.addEventListener('click', () => { shifted = !shifted; renderKeyboard(); });
    shiftRow.appendChild(shiftBtn);
    keyboard.appendChild(shiftRow);
  }
  renderKeyboard();

  document.getElementById('clearBtn').addEventListener('click', () => { input.value = ''; });
  document.getElementById('backspaceBtn').addEventListener('click', () => { input.value = input.value.slice(0, -1); });
})();
