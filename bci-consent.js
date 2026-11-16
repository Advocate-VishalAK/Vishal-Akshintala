/*
 * Bar Council of India disclaimer.
 *
 * Rule 36 of the Bar Council of India Rules does not permit advocates to solicit work or
 * advertise. This shows the customary disclaimer before a visitor reads the site, and lets
 * them in only after they agree.
 *
 * - The visitor's choice is remembered in their own browser only (localStorage), for 30 days.
 *   Nothing about the visitor is sent anywhere.
 * - GoatCounter, the site's privacy-friendly visit counter, records only the totals of
 *   "agreed" and "left", with no personal data.
 * - Changing CONSENT_VERSION shows the disclaimer again to everyone, for example after the
 *   wording changes.
 * - Without JavaScript the site stays readable, and the same text is on the FAQ page.
 */
(function () {
  'use strict';

  var CONSENT_VERSION = '2026-11-16';
  var KEY = 'bci-disclaimer';
  var DAYS = 30;

  function accepted() {
    try {
      var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      return saved && saved.v === CONSENT_VERSION && Date.now() - saved.at < DAYS * 864e5;
    } catch (e) {
      return false;
    }
  }

  function remember() {
    try {
      localStorage.setItem(KEY, JSON.stringify({ v: CONSENT_VERSION, at: Date.now() }));
    } catch (e) {
      /* private browsing: the disclaimer simply shows again next time */
    }
  }

  function count(path, title) {
    try {
      if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: path, title: title, event: true });
    } catch (e) {
      /* counting is optional */
    }
  }

  if (accepted()) return;

  var css =
    '#bci-veil{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:16px;' +
    'background:rgba(0,0,0,.72);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}' +
    '#bci-box{width:100%;max-width:640px;max-height:calc(100vh - 32px);overflow:auto;background:#0b0b0c;color:#FAFAFA;' +
    'border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:28px 28px 22px;box-shadow:0 30px 80px rgba(0,0,0,.6);' +
    "font:15px/1.6 'Inter',system-ui,-apple-system,'Segoe UI',sans-serif}" +
    '#bci-box .bci-k{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#FF6A3D;font-weight:600;margin:0 0 8px}' +
    "#bci-box h2{font:500 26px/1.2 'Fraunces',Georgia,serif;margin:0 0 14px;color:#FAFAFA}" +
    '#bci-box p{margin:0 0 12px;color:#D4D4D8}' +
    '#bci-box ul{margin:0 0 14px;padding-left:20px;color:#D4D4D8}' +
    '#bci-box li{margin:0 0 8px}' +
    '#bci-actions{display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end;margin-top:18px}' +
    '#bci-actions button{font:600 15px/1 inherit;font-family:inherit;border-radius:999px;padding:13px 22px;cursor:pointer;border:1px solid rgba(255,255,255,.18)}' +
    '#bci-agree{background:#FF6A3D;color:#0b0b0c;border-color:#FF6A3D}' +
    '#bci-agree:hover{filter:brightness(1.08)}' +
    '#bci-exit{background:transparent;color:#FAFAFA}' +
    '#bci-exit:hover{border-color:#FAFAFA}' +
    '#bci-actions button:focus-visible{outline:2px solid #FAFAFA;outline-offset:3px}' +
    'html.bci-lock,html.bci-lock body{overflow:hidden!important}' +
    '@media (max-width:520px){#bci-box{padding:22px 18px 18px}#bci-box h2{font-size:22px}#bci-actions button{flex:1}}';

  var html =
    '<div id="bci-box" role="dialog" aria-modal="true" aria-labelledby="bci-title" aria-describedby="bci-text">' +
    '<p class="bci-k">Disclaimer</p>' +
    '<h2 id="bci-title">Before you continue</h2>' +
    '<div id="bci-text">' +
    '<p>The Bar Council of India does not permit advocates to solicit work or advertise. By clicking <strong>I agree</strong>, you acknowledge that:</p>' +
    '<ul>' +
    '<li>there has been no advertisement, personal communication, solicitation, invitation or inducement of any sort from me, or anyone on my behalf, to seek work through this website;</li>' +
    '<li>you are visiting this website of your own accord, to learn more about me for your own information and use;</li>' +
    '<li>the information here is provided at your request and is not a solicitation or an invitation;</li>' +
    '<li>nothing on this website is legal advice, and reading it or contacting me does not create an advocate–client relationship;</li>' +
    '<li>I am not responsible for any action taken in reliance on material on this website. For advice on your situation, please consult an advocate.</li>' +
    '</ul>' +
    '</div>' +
    '<div id="bci-actions"><button type="button" id="bci-exit">Exit</button><button type="button" id="bci-agree">I agree</button></div>' +
    '</div>';

  function show() {
    if (document.getElementById('bci-veil')) return;
    var style = document.createElement('style');
    style.id = 'bci-style';
    style.textContent = css;
    document.head.appendChild(style);

    var veil = document.createElement('div');
    veil.id = 'bci-veil';
    veil.innerHTML = html;
    document.body.appendChild(veil);
    document.documentElement.classList.add('bci-lock');

    // Everything behind the disclaimer is hidden from screen readers and keyboard until they agree.
    var hidden = [];
    Array.prototype.forEach.call(document.body.children, function (el) {
      if (el !== veil && !el.hasAttribute('inert')) {
        el.setAttribute('inert', '');
        el.setAttribute('aria-hidden', 'true');
        hidden.push(el);
      }
    });

    var agree = document.getElementById('bci-agree');
    var exit = document.getElementById('bci-exit');
    agree.focus();

    // Keep keyboard focus inside the two buttons. Escape does not dismiss it: a choice is needed.
    veil.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') e.preventDefault();
      if (e.key !== 'Tab') return;
      var first = exit;
      var last = agree;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    agree.addEventListener('click', function () {
      remember();
      count('bci-disclaimer-agreed', 'Bar Council disclaimer: agreed');
      hidden.forEach(function (el) {
        el.removeAttribute('inert');
        el.removeAttribute('aria-hidden');
      });
      document.documentElement.classList.remove('bci-lock');
      veil.remove();
      style.remove();
    });

    exit.addEventListener('click', function () {
      count('bci-disclaimer-exit', 'Bar Council disclaimer: left');
      if (document.referrer && document.referrer.indexOf(location.host) === -1 && history.length > 1) history.back();
      else location.href = 'https://www.google.com/';
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show);
  else show();
})();
