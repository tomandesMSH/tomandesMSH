// The report form: sends the report to the function on Vercel (tomandes-report), which files it as a GitHub
// issue in the app's repository. Links can fill it in: ?app=keyboard-utils&version=1.0.2&zus=1&lang=en
(function () {
  // Opened from one's own computer (trying the form out), it talks to the local dev server of tomandes-report.
  const ENDPOINT = /^(localhost|127\.0\.0\.1)$/.test(location.hostname)
    ? 'http://localhost:8787/api/report'
    : 'https://tomandes-report.vercel.app/api/report';
  // The apps the ZUŠ Moravský Krumlov pupils use: only they offer "Jsem žákem ZUŠ".
  const ZUS_APPS = ['keyboard-utils', 'keyboard-hero'];

  // Every text of the page. HTML has the Czech ones, so the page reads fine before this runs.
  const TEXTS = {
    cs: {
      pageTitle: 'Nahlásit problém – tomandesMSH',
      back: '← Projekty',
      heading: 'Nahlásit problém',
      lead: 'Něco nefunguje, máš nápad nebo otázku? Napiš to sem. GitHub účet nepotřebuješ. Hlášení se objeví jako veřejné „issue“ u dané aplikace na GitHubu.',
      app: 'Aplikace',
      appPick: 'Vyber aplikaci…',
      appOther: 'Jiné / tenhle web',
      zus: 'Jsem žákem ZUŠ Moravský Krumlov',
      kind: 'O co jde',
      kindBug: 'Něco nefunguje',
      kindIdea: 'Nápad na zlepšení',
      kindQuestion: 'Otázka',
      title: 'Krátce, o co jde',
      titlePh: 'např. Metronom po zapnutí nehraje',
      description: 'Popis',
      descriptionHelp: 'Co se stalo, co jsi čekal(a) a co se stalo místo toho.',
      steps: 'Jak to zopakovat',
      stepsPh: '1. Otevřu skladbu\n2. Zapnu metronom\n3. …',
      version: 'Verze aplikace',
      versionPh: 'např. 1.0.2',
      contact: 'Kontakt',
      contactHelp: 'E-mail nebo jméno, když chceš odpověď. <b>Uvidí ho jen autor</b>, ve veřejném hlášení nebude.',
      optional: 'nepovinné',
      send: 'Odeslat',
      sending: 'Odesílám…',
      thanks: 'Díky!',
      saved: (n) => `Hlášení č. ${n} je uložené. `,
      viewOnGitHub: 'Zobrazit na GitHubu',
      again: 'Nahlásit další',
      needApp: 'Vyber aplikaci.',
      needTitle: 'Napiš krátce, o co jde.',
      needDescription: 'Napiš, co se stalo.',
      failed: 'Hlášení se nepodařilo odeslat. Zkus to prosím znovu.',
      offline: 'Nepodařilo se spojit se serverem. Zkontroluj internet a zkus to znovu.',
    },
    en: {
      pageTitle: 'Report a problem – tomandesMSH',
      back: '← Projects',
      heading: 'Report a problem',
      lead: "Something not working, an idea or a question? Write it here - no GitHub account needed. The report shows up as a public issue of the app on GitHub.",
      app: 'App',
      appPick: 'Choose an app…',
      appOther: 'Other / this website',
      zus: 'I am a pupil of ZUŠ Moravský Krumlov',
      kind: "What it's about",
      kindBug: 'Something is broken',
      kindIdea: 'An idea',
      kindQuestion: 'A question',
      title: 'In short',
      titlePh: "e.g. The metronome doesn't play",
      description: 'Description',
      descriptionHelp: 'What happened, what you expected, and what happened instead.',
      steps: 'How to repeat it',
      stepsPh: '1. Open a song\n2. Turn the metronome on\n3. …',
      version: 'App version',
      versionPh: 'e.g. 1.0.2',
      contact: 'Contact',
      contactHelp: "An e-mail or a name, if you'd like an answer. <b>Only the author sees it</b> - it isn't in the public report.",
      optional: 'optional',
      send: 'Send',
      sending: 'Sending…',
      thanks: 'Thank you!',
      saved: (n) => `Report #${n} is saved. `,
      viewOnGitHub: 'View on GitHub',
      again: 'Report another',
      needApp: 'Choose an app.',
      needTitle: "Say briefly what it's about.",
      needDescription: 'Describe what happened.',
      failed: "The report couldn't be sent. Please try again.",
      offline: "Couldn't reach the server. Check your internet connection and try again.",
    },
  };

  const form = document.getElementById('report');
  const app = document.getElementById('app');
  const zusRow = document.getElementById('zusRow');
  const zus = document.getElementById('zus');
  const error = document.getElementById('error');
  const send = document.getElementById('send');
  const startedAt = Date.now();
  const params = new URLSearchParams(location.search);

  // The language: from the link, else the reader's last pick (shared with the home page), else the browser's
  // (Czech and Slovak read Czech).
  const LANG_KEY = 'tomandes-lang';
  function storedLang() {
    try { return localStorage.getItem(LANG_KEY) || localStorage.getItem('report-lang'); } catch { return null; }
  }
  let lang = [params.get('lang'), storedLang()].find((l) => l === 'cs' || l === 'en')
    || (/^(cs|sk)\b/i.test(navigator.language || '') ? 'cs' : 'en');
  const t = (key) => TEXTS[lang][key];

  function applyLang() {
    document.documentElement.lang = lang;
    document.title = t('pageTitle');
    document.querySelectorAll('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n)));
    document.querySelectorAll('[data-i18n-ph]').forEach((el) => (el.placeholder = t(el.dataset.i18nPh)));
    document.querySelectorAll('[data-i18n-html]').forEach((el) => (el.innerHTML = t(el.dataset.i18nHtml)));
    document.querySelectorAll('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    if (!send.disabled) send.textContent = t('send');
    // An error on screen was in the old language: hide it rather than mix the two.
    error.hidden = true;
  }

  document.querySelectorAll('.lang button').forEach((button) =>
    button.addEventListener('click', () => {
      lang = button.dataset.lang;
      try { localStorage.setItem(LANG_KEY, lang); } catch { /* the pick just isn't remembered */ }
      applyLang();
    }),
  );

  // "Jsem žákem ZUŠ" is offered with the school's apps only; it just marks the report.
  function update() {
    const school = ZUS_APPS.includes(app.value);
    zusRow.hidden = !school;
    if (!school) zus.checked = false;
  }

  // Filled in from the link (an app's "Report a bug").
  if (params.get('app') && app.querySelector(`option[value="${CSS.escape(params.get('app'))}"]`)) app.value = params.get('app');
  if (params.get('version')) document.getElementById('version').value = params.get('version').slice(0, 40);
  if (params.get('zus') === '1') zus.checked = true;
  app.addEventListener('change', update);
  update();
  applyLang();

  function showError(message) {
    error.textContent = message;
    error.hidden = false;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.hidden = true;
    const data = Object.fromEntries(new FormData(form));
    if (!data.app) return showError(t('needApp'));
    if (!String(data.title).trim()) return showError(t('needTitle'));
    if (!String(data.description).trim()) return showError(t('needDescription'));

    send.disabled = true;
    send.textContent = t('sending');
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // The server answers errors in this language too.
        body: JSON.stringify({ ...data, zus: zus.checked, startedAt, lang }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || t('failed'));

      form.hidden = true;
      const done = document.getElementById('done');
      const text = document.getElementById('doneText');
      text.textContent = t('saved')(result.number);
      const link = document.createElement('a');
      link.href = result.url;
      link.textContent = t('viewOnGitHub');
      text.append(link);
      done.hidden = false;
      done.scrollIntoView({ block: 'start' });
    } catch (err) {
      // What was written stays in the form - nothing is lost.
      showError(err instanceof TypeError ? t('offline') : err.message);
    } finally {
      send.disabled = false;
      send.textContent = t('send');
    }
  });
})();
