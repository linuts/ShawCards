(async () => {
  let accountCode = location.hash.slice(1);
  if (!accountCode) {
    const res = await fetch('/api/new-account', { method: 'POST' });
    const data = await res.json();
    accountCode = data.code;
    location.hash = accountCode;
  }
  document.querySelectorAll('a[href="/"], a[href="/stats"], a[href="/cheatsheet"], a[href="/help"]').forEach(link => {
    const path = link.getAttribute('href').split('#')[0];
    link.href = path + '#' + accountCode;
  });
})();
