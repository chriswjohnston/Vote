/* ============================================================
   Chris Johnston for Nipissing Township Council
   Shared navigation, footer injection + mobile menu toggle
   ============================================================ */

(function () {
  // ── Determine active page ────────────────────────────────
  const path = window.location.pathname.split('/').pop() || 'index.html';

  const navLinks = [
    { href: 'index.html',      label: 'Home' },
    { href: 'challenges.html', label: 'Challenges' },
    { href: 'platform.html',   label: 'Platform' },
    { href: 'about.html',      label: 'About' },
  ];

  function isActive(href) {
    if (href === 'index.html' && (path === '' || path === 'index.html')) return true;
    return path === href;
  }

  // ── Build nav HTML ───────────────────────────────────────
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
      ${navLinks.map(l => `
      <li><a href="${l.href}"${isActive(l.href) ? ' class="active" aria-current="page"' : ''}>${l.label}</a></li>`).join('')}
      <li><a href="contact.html" class="nav__cta${path === 'contact.html' ? ' active' : ''}"${path === 'contact.html' ? ' aria-current="page"' : ''}>Contact</a></li>
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

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav')) {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when a link is clicked
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();
