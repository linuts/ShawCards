(() => {
  const STORAGE_PREFIX = 'shavian_go_v1_';
  const deck = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'deck') || '[]');
  const byId = Object.fromEntries(deck.map(d => [d.id, d]));

  const sections = [
    { title: 'Tall : Deep', rows: [
      [['peep','bib'], ['tot','dead'], ['kick','gag'], ['fee','vow'], ['thigh','they'], ['so','zoo'], ['sure','measure'], ['church','judge'], ['yea','woe'], ['hung','haha']]
    ]},
    { title: 'Short : Short', rows: [
      [['loll','roar'], ['mime','nun']]
    ]},
    { title: 'Short : Short', rows: [
      [['if','eat'], ['egg','age'], ['ash','ice'], ['ado','up'], ['on','oak'], ['wool','ooze'], ['out','oil'], ['ah','awe']]
    ]},
    { title: 'Compound', rows: [
      [['are','or'], ['air','err'], ['array','ear'], ['ian','yew']]
    ]}
  ];

  const letters = document.getElementById('letters');
  function renderLetters() {
    sections.forEach(section => {
      const group = document.createElement('div');
      group.className = 'letter-group';
      const h3 = document.createElement('h3');
      h3.textContent = section.title;
      group.appendChild(h3);
      section.rows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'letter-row';
        row.forEach(([aId, bId]) => {
          const cell = document.createElement('div');
          cell.className = 'letter-cell';
          [aId, bId].forEach(id => {
            if (!id) return;
            const letter = byId[id];
            const div = document.createElement('div');
            div.className = 'letter';
            div.innerHTML = `<div class=\"glyph\">${letter.glyph}</div><div class=\"name\">${letter.name}</div>`;
            cell.appendChild(div);
          });
          rowDiv.appendChild(cell);
        });
        group.appendChild(rowDiv);
      });
      letters.appendChild(group);
    });
  }
  renderLetters();

  const input = document.getElementById('spellInput');
  const keyboard = document.getElementById('keyboard');
  const keyboardLayout = [
    [['peep','bib'], ['tot','dead'], ['kick','gag'], ['fee','vow'], ['thigh','they'], ['so','zoo'], ['sure','measure'], ['church','judge'], ['yea','woe'], ['hung','haha']],
    [['loll','roar'], ['mime','nun'], ['if','eat'], ['egg','age'], ['ash','ice'], ['ado','up'], ['on','oak'], ['wool','ooze'], ['out','oil'], ['ah','awe']],
    [['shift'], ['are','or'], ['air','err'], ['array','ear'], ['ian','yew'], ['shift']]
  ];
  let shifted = false;
  function renderKeyboard() {
    keyboard.innerHTML = '';
    keyboardLayout.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'keyboard-row';
      row.forEach(key => {
        if (key[0] === 'shift') {
          const shiftBtn = document.createElement('button');
          shiftBtn.className = 'shift';
          shiftBtn.textContent = 'Shift';
          shiftBtn.addEventListener('click', () => { shifted = !shifted; renderKeyboard(); });
          rowDiv.appendChild(shiftBtn);
        } else {
          const [aId, bId] = key;
          const id = shifted && bId ? bId : aId;
          const letter = byId[id];
          const btn = document.createElement('button');
          btn.textContent = letter.glyph;
          btn.title = letter.name;
          btn.addEventListener('click', () => { input.value += letter.glyph; });
          rowDiv.appendChild(btn);
        }
      });
      keyboard.appendChild(rowDiv);
    });
  }
  renderKeyboard();

  document.getElementById('clearBtn').addEventListener('click', () => { input.value = ''; });
  document.getElementById('backspaceBtn').addEventListener('click', () => { input.value = input.value.slice(0, -1); });
})();
