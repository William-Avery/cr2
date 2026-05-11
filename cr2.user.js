// ==UserScript==
// @name         CR2 — Crunchyroll Reskin
// @namespace    https://github.com/William-Avery/cr2
// @version      0.1.0
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

  const BUNDLE_URL = 'https://raw.githubusercontent.com/William-Avery/cr2/main/cr2.bundle.html';

  // Stop the CR app from booting beneath us.
  try { window.stop(); } catch (_) {}

  // Wait for documentElement to exist (we're at document-start).
  const start = () => {
    fetch(BUNDLE_URL + '?t=' + Date.now(), { cache: 'no-store' })
      .then(r => { if (!r.ok) throw new Error('Bundle HTTP ' + r.status); return r.text(); })
      .then(html => {
        // Replace the whole document with the bundle.
        document.open();
        document.write(html);
        document.close();
      })
      .catch(err => {
        document.documentElement.innerHTML =
          '<body style="background:#1a1410;color:#e87a3a;font:14px monospace;padding:40px">' +
          'CR2 loader failed to fetch bundle.<br>' + String(err) +
          '<br><br>URL: ' + BUNDLE_URL + '</body>';
      });
  };

  if (document.readyState === 'loading' && !document.body) start();
  else start();
})();
