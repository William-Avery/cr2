// ==UserScript==
// @name         CR2 — Crunchyroll Reskin
// @namespace    https://github.com/William-Avery/cr2
// @version      0.8.0
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
          // document.write was being reverted by CR's leftover JS — the live
          // DOM ended up with CR's content, not the bundle's. Swap the root
          // element directly instead. DOMParser builds an inert tree (scripts
          // don't auto-execute), then we adopt it as the live documentElement.
          const parsed = new DOMParser().parseFromString(html, 'text/html');
          const ourInline = Array.from(parsed.scripts).filter(s => !s.src);
          console.log('[CR2] bundle inline scripts:', ourInline.length);
          console.log('[CR2] swapping documentElement');
          document.documentElement.replaceWith(parsed.documentElement);
          setTimeout(() => {
            const stillAttached = ourInline.filter(s => s.isConnected);
            console.log('[CR2] post-swap', document.readyState,
              'scripts in doc:', document.scripts.length,
              'ours still attached:', stillAttached.length);
            // Adopted scripts don't auto-execute. Replace each with a fresh
            // element (same content) to trigger execution.
            for (const oldScript of stillAttached) {
              const newScript = document.createElement('script');
              for (const attr of oldScript.attributes) {
                newScript.setAttribute(attr.name, attr.value);
              }
              newScript.textContent = oldScript.textContent;
              oldScript.replaceWith(newScript);
            }
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
