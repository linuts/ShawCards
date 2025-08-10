(() => {
  const STORAGE_PREFIX = 'shavian_go_v1_';
  const deck = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'deck') || '[]');

  const body = document.getElementById('cheatBody');
  deck.forEach(d => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="glyph">${d.glyph}</td><td>${d.name}</td><td>${d.ipa || ''}</td><td>${d.type || ''}</td>`;
    body.appendChild(tr);
  });

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
