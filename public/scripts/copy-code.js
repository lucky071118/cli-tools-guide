document.addEventListener('DOMContentLoaded', () => {
  const preSelector = '.prose-tool pre';
  document.querySelectorAll(preSelector).forEach((pre) => {
    if (pre.querySelector('.copy-btn')) return;
    // ensure positioned parent
    const computed = window.getComputedStyle(pre);
    if (computed.position === 'static') pre.style.position = 'relative';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-btn';
    button.setAttribute('aria-label', 'Copy code');
    button.textContent = 'Copy';

    button.addEventListener('click', async () => {
      const code = pre.querySelector('code');
      const src = code ? code.innerText : pre.innerText;
      const cleaned = src.split('\n').filter(l => !/^\s*#(?!\!)/.test(l)).join('\n').trim();
      try {
        await navigator.clipboard.writeText(cleaned);
        button.textContent = 'Copied';
        button.setAttribute('aria-pressed', 'true');
        setTimeout(() => { button.textContent = 'Copy'; button.removeAttribute('aria-pressed'); }, 2000);
      } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = cleaned;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); button.textContent = 'Copied'; } catch (e) { /* ignore */ }
        document.body.removeChild(ta);
        setTimeout(() => { button.textContent = 'Copy'; }, 2000);
      }
    });

    pre.appendChild(button);
  });
});
