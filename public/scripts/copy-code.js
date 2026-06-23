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
      const text = code ? code.innerText : pre.innerText;
      try {
        await navigator.clipboard.writeText(text.trim());
        button.textContent = 'Copied';
        button.setAttribute('aria-pressed', 'true');
        setTimeout(() => { button.textContent = 'Copy'; button.removeAttribute('aria-pressed'); }, 2000);
      } catch (err) {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
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
