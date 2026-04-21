/* ============================================================
   Chris Johnston for Nipissing Township Council
   Shared navigation, footer injection + mobile menu toggle
   ============================================================ */

(function () {
  // ── Determine active page ────────────────────────────────
  const path = window.location.pathname.split('/').pop() || 'index.html';

  const navLinks = [
    { href: 'index.html',      label: 'Home' },
    { href: 'challenges.html', label: 'Challenges', children: [
      { href: 'case-2021-cao.html',           label: 'CAO Recruitment' },
      { href: 'case-2022-software.html',      label: 'Municipal Software' },
      { href: 'case-2023-strategic.html',     label: 'Strategic Plan' },
      { href: 'case-2026-landfill.html',      label: 'Landfill Card Delay' },
      { href: 'case-boards-committees.html',  label: 'Boards & Committees' },
    ]},
    { href: 'platform.html',   label: 'Platform', children: [
      { href: 'action.html',   label: 'Action Plan' },
    ]},
    { href: 'about.html',      label: 'About' },
  ];

  function isActive(href) {
    if (href === 'index.html' && (path === '' || path === 'index.html')) return true;
    return path === href;
  }

  // ── Build nav HTML ───────────────────────────────────────
  function buildNavItem(l) {
    const active = isActive(l.href) || (l.children && l.children.some(c => isActive(c.href)));
    if (l.children && l.children.length) {
      return `<li class="nav__item">
        <a href="${l.href}"${active ? ' class="active"' : ''}>${l.label} <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-left:2px;vertical-align:middle;opacity:0.6"><polyline points="6 9 12 15 18 9"/></svg></a>
        <ul class="nav__dropdown" role="list">
          ${l.children.map(c => `<li><a href="${c.href}"${isActive(c.href) ? ' class="active"' : ''}>${c.label}</a></li>`).join('')}
        </ul>
      </li>`;
    }
    return `<li class="nav__item"><a href="${l.href}"${active ? ' class="active" aria-current="page"' : ''}>${l.label}</a></li>`;
  }

  const navHTML = `
<nav class="nav" id="site-nav" aria-label="Main navigation">
  <div class="nav__inner">
    <a href="index.html" class="nav__wordmark">
      Chris Johnston
      <span>Nipissing Township Council · 2026</span>
    </a>
    <button class="nav__toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-links">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav__links" id="nav-links" role="list">
      ${navLinks.map(buildNavItem).join('')}
      <li class="nav__item"><a href="contact.html" class="nav__cta${path === 'contact.html' ? ' active' : ''}"${path === 'contact.html' ? ' aria-current="page"' : ''}>Contact</a></li>
    </ul>
  </div>
</nav>`;

  // ── Build footer HTML ────────────────────────────────────
  const footerHTML = `
<footer class="site-footer">
  <div class="site-footer__inner">
    <div>
      <div class="site-footer__brand">Chris Johnston</div>
      <div class="site-footer__tagline">Candidate for Nipissing Township Council · 2026</div>
      <a href="https://www.facebook.com/chris.johnston.nipissing" target="_blank" rel="noopener" class="site-footer__social" aria-label="Facebook">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        Facebook
      </a>
    </div>
    <ul class="site-footer__links" role="list">
      ${navLinks.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}
      <li><a href="contact.html">Contact</a></li>
    </ul>
    <div class="site-footer__legal">
      Authorized by the official agent of Chris Johnston. Promoted by Chris Johnston, Nipissing Township, Ontario.
    </div>
  </div>
</footer>`;

  // ── Inject nav before body content ──────────────────────
  document.body.insertAdjacentHTML('afterbegin', navHTML);

  // ── Inject footer at end of body ────────────────────────
  document.body.insertAdjacentHTML('beforeend', footerHTML);

  // ── Mobile menu toggle ───────────────────────────────────
  const toggle = document.querySelector('.nav__toggle');
  const links  = document.querySelector('.nav__links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const isOpen = links.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Mobile: tap on parent nav item to toggle dropdown
    links.querySelectorAll('.nav__item > a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        const item = a.closest('.nav__item');
        const dropdown = item && item.querySelector('.nav__dropdown');
        if (dropdown && window.innerWidth <= 768) {
          e.preventDefault();
          item.classList.toggle('open');
        }
      });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav')) {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        links.querySelectorAll('.nav__item.open').forEach(function(i) { i.classList.remove('open'); });
      }
    });

    // Close menu when a leaf link (no dropdown) is clicked
    links.querySelectorAll('.nav__dropdown a, .nav__item:not(:has(.nav__dropdown)) a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();
