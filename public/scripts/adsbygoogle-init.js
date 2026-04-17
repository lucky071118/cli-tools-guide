window.adsbygoogle = window.adsbygoogle || [];

for (const adElement of document.querySelectorAll('.adsbygoogle')) {
  if (!(adElement instanceof HTMLElement)) {
    continue;
  }

  if (adElement.dataset.adsbygoogleStatus || adElement.dataset.cspInit === 'true') {
    continue;
  }

  adElement.dataset.cspInit = 'true';
  window.adsbygoogle.push({});
}
