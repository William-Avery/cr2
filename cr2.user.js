// ==UserScript==
// @name         CR2 — Crunchyroll Reskin
// @namespace    https://github.com/William-Avery/cr2
// @version      0.3.0
// @description  Personal UI reskin for crunchyroll.com — loads the CR2 prototype bundle.
// @author       William Avery
// @match        https://www.crunchyroll.com/*
// @match        https://crunchyroll.com/*
// @run-at       document-start
// @grant        none
// @updateURL    https://raw.githubusercontent.com/William-Avery/cr2/main/cr2.user.js
// @downloadURL  https://raw.githubusercontent.com/William-Avery/cr2/main/cr2.user.js
// ==/UserScript==

(function () {
  'use strict';

  console.log('[CR2] loader start', location.href, document.readyState);

  const BUNDLE_URL = 'https://raw.githubusercontent.com/William-Avery/cr2/main/cr2.bundle.html';

  const showError = (err) => {
    const overlay = document.createElement('div');
    overlay.setAttribute('style',
      'position:fixed;inset:0;background:#ff0000;color:#fff;' +
      'font:14px monospace;padding:40px;z-index:2147483647;' +
      'white-space:pre-wrap;overflow:auto');
    overlay.textContent =
      'CR2 loader error\n\n' + String((err && err.stack) || err) +
      '\n\nURL: ' + BUNDLE_URL;
    (document.body || document.documentElement).appendChild(overlay);
  };

  try {
    // Stop the CR app from booting beneath us.
    try { window.stop(); } catch (_) {}

    const start = () => {
      console.log('[CR2] fetching', BUNDLE_URL);
      fetch(BUNDLE_URL + '?t=' + Date.now(), { cache: 'no-store' })
        .then(r => { if (!r.ok) throw new Error('Bundle HTTP ' + r.status); return r.text(); })
        .then(html => {
          console.log('[CR2] bundle loaded, length', html.length);
          console.log('[CR2] writing bundle to document');
          document.open();
          document.write(html);
          document.close();
          setTimeout(() => {
            console.log('[CR2] post-write', document.readyState, 'scripts:', document.scripts.length);
          }, 0);
        })
        .catch(err => {
          console.error('[CR2] fetch failed', err);
          showError(err);
        });
    };

    if (document.readyState === 'loading' && !document.body) start();
    else start();
  } catch (err) {
    console.error('[CR2] loader threw', err);
    showError(err);
  }
})();
