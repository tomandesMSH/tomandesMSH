// Czech / English for tomandes.eu. The Czech texts stay in index.html (edit them there); this has the English
// ones, keyed by the elements' data-i18n (text), data-i18n-html (with markup), data-i18n-aria (aria-label) and
// data-i18n-content (a meta tag). The language is shared with tomandes.eu/report (localStorage "tomandes-lang");
// the first visit follows the browser (Czech and Slovak read Czech), and ?lang=en / ?lang=cs set it from a link.
(function () {
  const EN = {
    metaDescription: "Portfolio of tomandesMSH: projects, Inkscape artwork, PowerPoint presentations, certificates and more.",
    navLabel: "Main navigation",
    navAbout: "About",
    navProjects: "Projects",
    navGallery: "Gallery",
    navContact: "Contact",
    navToggle: "Open the menu",
    tagline: "I fix what shouldn't be broken,<br>and make what should have been made long ago..",
    scrollDown: "Scroll down",
    aboutTitle: "About me",
    aboutText: "I'm a high school student interested in programming, hardware and looking after operating systems. I like solving problems, however big or small - whether it's a clogged-up Windows or a mod for a game long forgotten. I enjoy working in Inkscape, Photoshop, Paint.NET and Blender, and looking after and building computers. I experiment with different technologies and programming languages, and keep adding new projects to my portfolio.",
    projectsTitle: "Projects",
    webProjects: "Web projects",
    games: "Games and mods",
    other: "Other",
    docs: "Documentation",
    download: "Download",
    website: "Website",
    pKaspar: " - A Windows \"debloater\", a set of tools for tweaking the system (C#, WinUI 3)",
    pKasparNro: " - Installing Windows without internet, with a local account (Batch)",
    pKeyboardUtils: " - An app for practising the piano. Plays songs from MIDI/MusicXML as falling notes, listens to what you play, scores you and records your playing. (C#)",
    pCustomAutoplay: " - A tool that edits the Windows AutoPlay registry for you (Python)",
    pSoundpad: " - A second keyboard as a soundboard for Soundpad. (C#)",
    pClipThat: " - A replacement for the Windows 11 clipboard history. (Python)",
    pKeyboardHero: " - A web app for ZUŠ Moravský Krumlov (an art school) that gets children to practise their instrument at home regularly, in a playful way. (TypeScript)",
    pCompendium: " - The complete Compendium from Persona 3 Reload. (HTML, JS)",
    pNeofetch: " - An animated neofetch-style card for a GitHub profile README. (Python, JS)",
    pP3rp: " - A second portfolio in the style of Persona 3 Reload. (HTML, CSS, JS)",
    pSonic: " - A guide to building the Sonic game decompilations legally (RSDK, HTML, CSS).",
    pTboiMods: " - A mod installer for the original Flash version of The Binding of Isaac. Tick the mods, click Install and play. (Python, C#)",
    pEid: " - Descriptions of items, trinkets, cards and pills right in the game. (Lua, ActionScript, Python)",
    pStatsHud: " - Isaac's current stats and the devil/angel room chances, like in Repentance. (ActionScript, Python)",
    pDebugConsole: " - The debug console from Repentance: giveitem, spawn, goto, stage... (ActionScript, Python)",
    pShareSeed: " - A mod for The Binding of Isaac: Repentance+. Packs the seed and your unlocks into one code, so everyone plays the same run. (Lua)",
    pUpgrader: " - A mod for The Binding of Isaac: Repentance+ for upgrading and duplicating items. (Lua)",
    pJsab: " - A save editor for Just Shapes and Beats. (Python)",
    pWasd: " - WASD controls in games that only support the arrow keys. (Python)",
    pVytahnito: " - A Chrome extension that downloads every image and video on a page. (JS)",
    pClassroom: " - A Tampermonkey userscript: live search and custom labels in Google Classroom. (JS)",
    pQubuntu: " - Quick access to an Ubuntu server: Wake-on-LAN, SSH, CasaOS, Jellyfin. (Python)",
    pMkPkg: " - A package that recognises and captures input from a second (macro) keyboard. Used by Soundpad Translator and Keyboard Utils.",
    galleryTitle: "Gallery",
    gCerts: "Certificates",
    gInkscape: "Inkscape projects",
    gPptx: "PowerPoint presentations",
    gOther: "Other",
    gFcc: "FreeCodeCamp & Microsoft - C# certificate",
    gCat: "Lowpoly cat",
    gBird: "Lowpoly bird",
    gPepsi: "Pepsi logo, vector",
    gSpotify: "Spotify logo, vector",
    gRam: "RAM, XMP/EXPO explained",
    gGpu: "GPU, the basics explained",
    gMonetize: "How Windows 11 makes money",
    gConstruct: "A game in Construct3",
    contactTitle: "Contact:",
    report: "Report a problem",
    p3Label: "Link to another portfolio",
    close: "Close",
    p3Eyebrow: "welcome to my velvet room",
    p3Sub: "Have a look at my second portfolio in Persona 3 Reload style | For now it is just a showcase.",
    open: "Open",
  };

  const KEY = 'tomandes-lang';
  const kinds = [
    ['data-i18n', (el) => el.textContent, (el, v) => (el.textContent = v)],
    ['data-i18n-html', (el) => el.innerHTML, (el, v) => (el.innerHTML = v)],
    ['data-i18n-aria', (el) => el.getAttribute('aria-label'), (el, v) => el.setAttribute('aria-label', v)],
    ['data-i18n-content', (el) => el.getAttribute('content'), (el, v) => el.setAttribute('content', v)],
  ];

  // The Czech originals, to switch back to.
  const originals = new Map();
  for (const [attr, get] of kinds) {
    document.querySelectorAll('[' + attr + ']').forEach((el) => originals.set(el.getAttribute(attr) + '|' + attr, get(el)));
  }

  function stored() {
    try { return localStorage.getItem(KEY); } catch { return null; }
  }
  const fromLink = new URLSearchParams(location.search).get('lang');
  let lang = [fromLink, stored()].find((l) => l === 'cs' || l === 'en')
    || (/^(cs|sk)/i.test(navigator.language || '') ? 'cs' : 'en');

  function apply() {
    document.documentElement.lang = lang;
    for (const [attr, , set] of kinds) {
      document.querySelectorAll('[' + attr + ']').forEach((el) => {
        const key = el.getAttribute(attr);
        set(el, lang === 'en' && key in EN ? EN[key] : originals.get(key + '|' + attr));
      });
    }
    document.querySelectorAll('.lang-switch button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  }

  document.querySelectorAll('.lang-switch button').forEach((button) =>
    button.addEventListener('click', () => {
      lang = button.dataset.lang;
      try { localStorage.setItem(KEY, lang); } catch { /* not remembered, still switched */ }
      apply();
    }),
  );

  apply();
})();
