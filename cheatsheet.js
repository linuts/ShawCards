(() => {
  const STORAGE_PREFIX = 'shavian_go_v1_';
  const DEFAULT_DECK = [
    { id: "peep", glyph: "𐑐", name: "(P)eep" },
    { id: "tot", glyph: "𐑑", name: "(T)ot" },
    { id: "kick", glyph: "𐑒", name: "(K)ick" },
    { id: "fee", glyph: "𐑓", name: "(F)ee" },
    { id: "thigh", glyph: "𐑔", name: "(TH)igh" },
    { id: "so", glyph: "𐑕", name: "(S)o" },
    { id: "sure", glyph: "𐑖", name: "(SH)ure" },
    { id: "church", glyph: "𐑗", name: "(CH)urch" },
    { id: "yea", glyph: "𐑘", name: "(Y)ea" },
    { id: "hung", glyph: "𐑙", name: "hu(NG)" },
    { id: "bib", glyph: "𐑚", name: "(B)ib" },
    { id: "dead", glyph: "𐑛", name: "(D)ead" },
    { id: "gag", glyph: "𐑜", name: "(G)ag" },
    { id: "vow", glyph: "𐑝", name: "(V)ow" },
    { id: "they", glyph: "𐑞", name: "(TH)ey" },
    { id: "zoo", glyph: "𐑟", name: "(Z)oo" },
    { id: "measure", glyph: "𐑠", name: "mea(S)ure" },
    { id: "judge", glyph: "𐑡", name: "(J)udge" },
    { id: "woe", glyph: "𐑢", name: "(W)oe" },
    { id: "haha", glyph: "𐑣", name: "(H)aha" },
    { id: "loll", glyph: "𐑤", name: "(L)oll" },
    { id: "roar", glyph: "𐑮", name: "(R)oar" },
    { id: "mime", glyph: "𐑥", name: "(M)ime" },
    { id: "nun", glyph: "𐑯", name: "(N)un" },
    { id: "if", glyph: "𐑦", name: "(I)f" },
    { id: "eat", glyph: "𐑰", name: "(E)at" },
    { id: "egg", glyph: "𐑧", name: "(E)gg" },
    { id: "age", glyph: "𐑱", name: "(A)ge" },
    { id: "ash", glyph: "𐑨", name: "(A)sh" },
    { id: "ice", glyph: "𐑲", name: "(I)ce" },
    { id: "ado", glyph: "𐑩", name: "(A)do" },
    { id: "up", glyph: "𐑳", name: "(U)p" },
    { id: "on", glyph: "𐑪", name: "(O)n" },
    { id: "oak", glyph: "𐑴", name: "(O)ak" },
    { id: "wool", glyph: "𐑫", name: "w(OO)l" },
    { id: "ooze", glyph: "𐑵", name: "(OO)ze" },
    { id: "out", glyph: "𐑬", name: "(OU)t" },
    { id: "oil", glyph: "𐑶", name: "(OI)l" },
    { id: "ah", glyph: "𐑭", name: "(A)h" },
    { id: "awe", glyph: "𐑷", name: "(AW)e" },
    { id: "are", glyph: "𐑸", name: "(AR)e" },
    { id: "or", glyph: "𐑹", name: "(OR)" },
    { id: "air", glyph: "𐑺", name: "(AIR)" },
    { id: "err", glyph: "𐑻", name: "(ER)r" },
    { id: "array", glyph: "𐑼", name: "a(RA)y" },
    { id: "ear", glyph: "𐑽", name: "(EAR)" },
    { id: "ian", glyph: "𐑾", name: "(I)an" },
    { id: "yew", glyph: "𐑿", name: "(Y)ew" }
  ];
  let deck = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'deck') || 'null');
  if (!Array.isArray(deck) || deck.length === 0) {
    deck = DEFAULT_DECK;
    localStorage.setItem(STORAGE_PREFIX + 'deck', JSON.stringify(deck));
  }
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
