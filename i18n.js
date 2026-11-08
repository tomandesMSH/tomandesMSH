// Czech / English switch for tomandes.eu. Each language is its own page: / (Czech, the default) and /en/ (built by
// tools/build-en.py from index.html and i18n/en.json), so search engines see both without running this.
// The choice is remembered (localStorage "tomandes-lang", shared with tomandes.eu/report): someone who picked
// English and opens / later gets /en/. Nobody is redirected by browser language - that would also send Google's
// crawler, which reads English, away from the Czech page.
(function () {
  const KEY = 'tomandes-lang';
  const page = document.documentElement.lang === 'en' ? 'en' : 'cs';
  const urls = { cs: '/', en: '/en/' };

  function stored() {
    try { return localStorage.getItem(KEY); } catch { return null; }
  }
  function remember(lang) {
    try { localStorage.setItem(KEY, lang); } catch { /* not remembered, still switched */ }
  }

  // ?lang=en / ?lang=cs in a link, or a choice made earlier.
  const fromLink = new URLSearchParams(location.search).get('lang');
  if (fromLink === 'cs' || fromLink === 'en')
    remember(fromLink);
  const wanted = stored();
  if ((wanted === 'cs' || wanted === 'en') && wanted !== page) {
    location.replace(urls[wanted] + location.hash);
    return;
  }

  document.querySelectorAll('.lang-switch button').forEach((button) =>
    button.addEventListener('click', () => {
      const lang = button.dataset.lang;
      remember(lang);
      if (lang !== page)
        location.href = urls[lang] + location.hash;
    }),
  );
})();
