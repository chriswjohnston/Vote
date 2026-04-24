/* ============================================================
   Chris Johnston for Nipissing Township Council
   Shared navigation, footer injection + mobile menu toggle
   ============================================================ */

(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';

  const navLinks = [
    { href: 'index.html', label: 'Home' },

    {
      href: 'challenges.html',
      label: 'Challenges',
      children: [
        { href: 'case-2021-cao.html', label: 'CAO Recruitment' },
        { href: 'case-2022-software.html', label: 'Municipal Software' },
        { href: 'case-2023-strategic.html', label: 'Strategic Plan' },
        { href: 'case-2026-landfill.html', label: 'Landfill Card Delay' },
        { href: 'case-boards-committees.html', label: 'Boards & Committees' },
      ],
    },

    {
      href: 'platform.html',
      label: 'Platform',
      children: [
        { href: 'action.html', label: 'Action Plan' },
      ],
    },

    { href: 'election.html', label: 'Election Day' },
    { href: 'about.html', label: 'About' },
  ];

  function isActive(href) {
    if (href === 'index.html' && (path === '' || path === 'index.html')) return true;
    return path === href;
  }

  function hasActiveChild(item) {
    return item.children && item.children.some(function (child) {
      return isActive(child.href);
    });
  }

  function buildNavItem(item) {
    const active = isActive(item.href) || hasActiveChild(item);

    if (item.children && item.children.length) {
      return `
        <li class="nav__item nav__item--has-dropdown">
          <a href="${item.href}"${active ? ' class="active"' : ''}>
            ${item.label}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-left:2px;vertical-align:middle;opacity:0.6" aria-hidden="true">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </a>
          <ul class="nav__dropdown" role="list">
            ${item.children.map(function (child) {
              return `<li><a href="${child.href}"${isActive(child.href) ? ' class="active" aria-current="page"' : ''}>${child.label}</a></li>`;
            }).join('')}
          </ul>
        </li>
      `;
    }

    return `
      <li class="nav__item">
        <a href="${item.href}"${active ? ' class="active" aria-current="page"' : ''}>${item.label}</a>
      </li>
    `;
  }

  const navHTML = `
    <nav class="nav" id="site-nav" aria-label="Main navigation">
      <div class="nav__inner">
        <a href="index.html" class="nav__wordmark">
          Chris Johnston
          <span>Nipissing Township Council · 2026</span>
        </a>

        <button class="nav__toggle" type="button" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-links">
          <span></span><span></span><span></span>
        </button>

        <ul class="nav__links" id="nav-links" role="list">
          ${navLinks.map(buildNavItem).join('')}
          <li class="nav__item">
            <a href="contact.html" class="nav__cta${path === 'contact.html' ? ' active' : ''}"${path === 'contact.html' ? ' aria-current="page"' : ''}>Contact</a>
          </li>
        </ul>
      </div>
    </nav>
  `;

  const footerHTML = `
    <footer class="site-footer">
      <div class="site-footer__inner">
        <div>
          <div class="site-footer__brand">Chris Johnston</div>
          <div class="site-footer__tagline">Candidate for Nipissing Township Council · 2026</div>
          <a href="https://www.facebook.com/chris.johnston.nipissing" target="_blank" rel="noopener" class="site-footer__social" aria-label="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
            Facebook
          </a>
        </div>

        <ul class="site-footer__links" role="list">
          ${navLinks.map(function (item) {
            return `<li><a href="${item.href}">${item.label}</a></li>`;
          }).join('')}
          <li><a href="contact.html">Contact</a></li>
        </ul>

        <div class="site-footer__legal">
          Authorized by the official agent of Chris Johnston. Promoted by Chris Johnston, Nipissing Township, Ontario.
        </div>
      </div>
    </footer>
  `;

  document.body.insertAdjacentHTML('afterbegin', navHTML);

  if (!document.querySelector('.site-footer')) {
    document.body.insertAdjacentHTML('beforeend', footerHTML);
  }

  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');

  function closeMenu() {
    links.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');

    document.querySelectorAll('.nav__item.open').forEach(function (item) {
      item.classList.remove('open');
    });
  }

  if (toggle && links) {
    toggle.addEventListener('click', function (event) {
      event.stopPropagation();

      const isOpen = links.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));

      if (!isOpen) {
        document.querySelectorAll('.nav__item.open').forEach(function (item) {
          item.classList.remove('open');
        });
      }
    });

    document.querySelectorAll('.nav__item--has-dropdown > a').forEach(function (parentLink) {
      parentLink.addEventListener('click', function (event) {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (!isMobile) return;

        const item = parentLink.closest('.nav__item');
        const isAlreadyOpen = item.classList.contains('open');

        if (!isAlreadyOpen) {
          event.preventDefault();

          document.querySelectorAll('.nav__item.open').forEach(function (openItem) {
            if (openItem !== item) openItem.classList.remove('open');
          });

          item.classList.add('open');
        }
      });
    });

    document.querySelectorAll('.nav__dropdown a, .nav__item:not(.nav__item--has-dropdown) > a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });

    document.addEventListener('click', function (event) {
      if (!event.target.closest('.nav')) {
        closeMenu();
      }
    });

    window.addEventListener('resize', function () {
      if (!window.matchMedia('(max-width: 768px)').matches) {
        closeMenu();
      }
    });
  }
})();