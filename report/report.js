// The report form: sends the report to the function on Vercel (tomandes-report), which files it as a GitHub
// issue in the app's repository. Links can fill it in: ?app=keyboard-utils&version=1.0.2&zus=1
(function () {
  // Opened from one's own computer (trying the form out), it talks to the local dev server of tomandes-report.
  const ENDPOINT = /^(localhost|127\.0\.0\.1)$/.test(location.hostname)
    ? 'http://localhost:8787/api/report'
    : 'https://tomandes-report.vercel.app/api/report';
  // The apps the ZUŠ Moravský Krumlov pupils use: only they offer "Jsem žákem ZUŠ".
  const ZUS_APPS = ['keyboard-utils', 'keyboard-hero'];

  const form = document.getElementById('report');
  const app = document.getElementById('app');
  const zusRow = document.getElementById('zusRow');
  const zus = document.getElementById('zus');
  const title = document.getElementById('title');
  const descriptionLabel = document.getElementById('descriptionLabel');
  const descriptionHelp = document.getElementById('descriptionHelp');
  const error = document.getElementById('error');
  const send = document.getElementById('send');
  const startedAt = Date.now();

  // Pupils get simpler words and no technical fields.
  function update() {
    const school = ZUS_APPS.includes(app.value);
    zusRow.hidden = !school;
    if (!school) zus.checked = false;
    const simple = zus.checked;
    form.querySelectorAll('.technical').forEach((field) => (field.hidden = simple));
    title.placeholder = simple ? title.dataset.hintZus : title.dataset.hint;
    descriptionLabel.textContent = simple ? 'Co se stalo?' : 'Popis';
    descriptionHelp.textContent = simple
      ? 'Napiš vlastními slovy, co se stalo a co jsi zrovna dělal(a). Klidně krátce.'
      : 'Co se stalo, co jsi čekal(a) a co se stalo místo toho.';
  }

  // Filled in from the link (an app's "Report a bug").
  const params = new URLSearchParams(location.search);
  if (params.get('app') && app.querySelector(`option[value="${CSS.escape(params.get('app'))}"]`)) app.value = params.get('app');
  if (params.get('version')) document.getElementById('version').value = params.get('version').slice(0, 40);
  if (params.get('zus') === '1') zus.checked = true;
  app.addEventListener('change', update);
  zus.addEventListener('change', update);
  update();

  function showError(message) {
    error.textContent = message;
    error.hidden = false;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.hidden = true;
    const data = Object.fromEntries(new FormData(form));
    if (!data.app) return showError('Vyber aplikaci.');
    if (!String(data.title).trim()) return showError('Napiš krátce, o co jde.');
    if (!String(data.description).trim()) return showError('Napiš, co se stalo.');

    send.disabled = true;
    send.textContent = 'Odesílám…';
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, zus: zus.checked, startedAt }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Hlášení se nepodařilo odeslat. Zkus to prosím znovu.');

      form.hidden = true;
      const done = document.getElementById('done');
      const text = document.getElementById('doneText');
      if (result.url) {
        text.textContent = `Hlášení č. ${result.number} je uložené. `;
        const link = document.createElement('a');
        link.href = result.url;
        link.textContent = 'Zobrazit na GitHubu';
        text.append(link);
      } else {
        text.textContent = 'Hlášení dorazilo autorovi. Moc díky, že pomáháš appku vylepšit!';
      }
      done.hidden = false;
      done.scrollIntoView({ block: 'start' });
    } catch (err) {
      // What was written stays in the form - nothing is lost.
      showError(err instanceof TypeError ? 'Nepodařilo se spojit se serverem. Zkontroluj internet a zkus to znovu.' : err.message);
    } finally {
      send.disabled = false;
      send.textContent = 'Odeslat';
    }
  });
})();
