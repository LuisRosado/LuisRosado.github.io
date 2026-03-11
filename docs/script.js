/* ============================================================
   SYSTEMS INTERFACE — script.js
   Vanilla JS. No dependencies. Cold corporate interface.
   Credentials rendered from JS data. Auto-rotating feed.
   ============================================================ */

(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- DOM ---- */
  var navbar         = document.getElementById('navbar');
  var themeToggle    = document.getElementById('theme-toggle');
  var hamburger      = document.getElementById('hamburger');
  var mobileMenu     = document.getElementById('mobile-menu');
  var navLinks       = document.querySelectorAll('.navbar__link');
  var mobileLinks    = document.querySelectorAll('.mobile-menu__link');
  var allNavLinks    = [].slice.call(navLinks).concat([].slice.call(mobileLinks));
  var sections       = document.querySelectorAll('section[id]');
  var bootOverlay    = document.getElementById('boot-overlay');
  var bootBar        = document.getElementById('boot-bar');
  var bootStatus     = document.getElementById('boot-status');

  /* ==========================================================
     CREDENTIALS DATA — Single source of truth
     Add new entries here. The feed auto-renders and rotates.
     ========================================================== */
  var credentials = [
    { title: 'Associate Cloud Engineer', issuer: 'Google Cloud', year: '2024' },
    { title: 'GitHub Copilot', issuer: 'GitHub', year: '2024' },
    { title: 'GitHub Foundations', issuer: 'GitHub', year: '2024' },
    { title: 'ENGX Bootcamp', issuer: 'EPAM Systems', year: '2024' },
    { title: 'Generative AI Fundamentals', issuer: 'Google Cloud', year: '2024' },
    { title: 'Applied Machine Learning Foundations', issuer: 'LinkedIn Learning', year: '2023' },
    { title: 'Agile Software Development: Scrum', issuer: 'LinkedIn Learning', year: '2023' },
    { title: 'Scrum Advanced', issuer: 'LinkedIn Learning', year: '2023' },
    { title: 'Meta Back-End Developer', issuer: 'Meta / Coursera', year: '2023' },
    { title: 'Django Web Framework', issuer: 'Meta / Coursera', year: '2023' },
    { title: 'Programming in Python', issuer: 'Meta / Coursera', year: '2023' },
    { title: 'Introduction to Databases', issuer: 'Meta / Coursera', year: '2023' },
    { title: 'Java 8 Essential Training', issuer: 'LinkedIn Learning', year: '2022' },
    { title: 'MySQL Essential Training', issuer: 'LinkedIn Learning', year: '2022' }
  ];

  /* ==========================================================
     BOOT SEQUENCE
     ========================================================== */
  var bootMessages = [
    'LOADING SYSTEM MODULES',
    'VERIFYING CREDENTIALS',
    'INITIALIZING INTERFACE',
    'ESTABLISHING SECURE CONNECTION',
    'SYSTEM READY'
  ];

  function runBoot() {
    if (reducedMotion || !bootOverlay) {
      if (bootOverlay) bootOverlay.remove();
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    var step = 0;
    var totalSteps = bootMessages.length;
    var interval = setInterval(function () {
      if (step < totalSteps) {
        var pct = Math.round(((step + 1) / totalSteps) * 100);
        bootBar.style.width = pct + '%';
        bootStatus.textContent = bootMessages[step];
        step++;
      } else {
        clearInterval(interval);
        setTimeout(function () {
          bootOverlay.classList.add('boot-overlay--done');
          document.body.style.overflow = '';
          setTimeout(function () { bootOverlay.remove(); }, 600);
        }, 300);
      }
    }, 350);
  }

  if (!sessionStorage.getItem('sys-booted')) {
    sessionStorage.setItem('sys-booted', '1');
    runBoot();
  } else {
    if (bootOverlay) bootOverlay.remove();
  }

  /* ==========================================================
     THEME
     ========================================================== */
  var THEME_KEY = 'sys-theme';

  function getPreferredTheme() {
    var stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f0f2f7' : '#080b12');
  }

  applyTheme(getPreferredTheme());

  themeToggle.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'light' : 'dark');
    }
  });

  /* ==========================================================
     NAVBAR SCROLL
     ========================================================== */
  var ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        navbar.classList.toggle('navbar--scrolled', window.scrollY > 30);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ==========================================================
     ACTIVE SECTION HIGHLIGHT
     ========================================================== */
  function highlightNav() {
    var scrollY = window.scrollY + window.innerHeight / 3;
    var currentId = '';

    sections.forEach(function (s) {
      if (s.offsetTop <= scrollY) currentId = s.getAttribute('id');
    });

    allNavLinks.forEach(function (link) {
      var isActive = link.getAttribute('data-section') === currentId;
      link.classList.toggle('navbar__link--active', isActive && link.classList.contains('navbar__link'));
      link.classList.toggle('mobile-menu__link--active', isActive && link.classList.contains('mobile-menu__link'));
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  /* ==========================================================
     MOBILE MENU
     ========================================================== */
  function openMobileMenu() {
    mobileMenu.hidden = false;
    void mobileMenu.offsetHeight;
    mobileMenu.classList.add('mobile-menu--visible');
    hamburger.classList.add('navbar__hamburger--open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('mobile-menu--visible');
    hamburger.classList.remove('navbar__hamburger--open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
    mobileMenu.addEventListener('transitionend', function handler() {
      if (!mobileMenu.classList.contains('mobile-menu--visible')) mobileMenu.hidden = true;
      mobileMenu.removeEventListener('transitionend', handler);
    });
  }

  hamburger.addEventListener('click', function () {
    var isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  mobileLinks.forEach(function (link) { link.addEventListener('click', closeMobileMenu); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
      closeMobileMenu();
      hamburger.focus();
    }
  });

  /* ==========================================================
     CREDENTIALS FEED — Auto-rotating, JS-rendered
     Shows 3 credentials at a time, cycles every 5s.
     Pauses on hover. Respects prefers-reduced-motion.
     ========================================================== */
  var credFeed      = document.getElementById('cred-feed');
  var credDotsWrap  = document.getElementById('cred-feed-dots');
  var credIndexEl   = document.getElementById('cred-feed-index');
  var credTotalEl   = document.getElementById('cred-feed-total');

  var VISIBLE_COUNT = 3;
  var ROTATE_INTERVAL = 5000;
  var currentPage   = 0;
  var totalPages    = Math.ceil(credentials.length / VISIBLE_COUNT);
  var rotateTimer   = null;
  var isPaused      = false;

  function createCardHTML(cred) {
    return '<article class="cred-feed__card">' +
      '<span class="cred-feed__verify" aria-hidden="true"></span>' +
      '<div class="cred-feed__content">' +
        '<div class="cred-feed__title">' + cred.title + '</div>' +
        '<div class="cred-feed__meta">' +
          '<span class="cred-feed__issuer">' + cred.issuer + '</span>' +
          '<span class="cred-feed__meta-sep" aria-hidden="true"></span>' +
          '<span class="cred-feed__year">' + cred.year + '</span>' +
        '</div>' +
      '</div>' +
      '<span class="cred-feed__status">' +
        '<span class="cred-feed__verify" aria-hidden="true"></span>' +
        'VERIFIED' +
      '</span>' +
    '</article>';
  }

  function renderPage(page) {
    var start = page * VISIBLE_COUNT;
    var slice = credentials.slice(start, start + VISIBLE_COUNT);

    /* Fade out existing cards */
    var existingCards = credFeed.querySelectorAll('.cred-feed__card');
    existingCards.forEach(function (card) {
      card.classList.remove('cred-feed__card--visible');
    });

    /* After fade-out, swap content */
    var delay = existingCards.length > 0 ? 250 : 0;

    setTimeout(function () {
      var html = '';
      slice.forEach(function (cred) {
        html += createCardHTML(cred);
      });
      credFeed.innerHTML = html;

      /* Staggered fade-in */
      var newCards = credFeed.querySelectorAll('.cred-feed__card');
      newCards.forEach(function (card, idx) {
        setTimeout(function () {
          card.classList.add('cred-feed__card--visible');
        }, idx * 80);
      });

      /* Update dots */
      updateDots(page);

      /* Update counter */
      credIndexEl.textContent = (page + 1).toString();
    }, delay);
  }

  function buildDots() {
    credDotsWrap.innerHTML = '';
    for (var i = 0; i < totalPages; i++) {
      var dot = document.createElement('button');
      dot.className = 'cred-feed__dot';
      dot.setAttribute('aria-label', 'Go to credential group ' + (i + 1));
      dot.setAttribute('data-page', i.toString());
      dot.addEventListener('click', function () {
        var p = parseInt(this.getAttribute('data-page'), 10);
        goToPage(p);
      });
      credDotsWrap.appendChild(dot);
    }
  }

  function updateDots(page) {
    var dots = credDotsWrap.querySelectorAll('.cred-feed__dot');
    dots.forEach(function (d, idx) {
      d.classList.toggle('cred-feed__dot--active', idx === page);
    });
  }

  function goToPage(page) {
    currentPage = page;
    renderPage(currentPage);
    restartTimer();
  }

  function nextPage() {
    currentPage = (currentPage + 1) % totalPages;
    renderPage(currentPage);
  }

  function startTimer() {
    if (reducedMotion) return;
    rotateTimer = setInterval(function () {
      if (!isPaused) nextPage();
    }, ROTATE_INTERVAL);
  }

  function restartTimer() {
    clearInterval(rotateTimer);
    startTimer();
  }

  /* Initialize feed */
  if (credFeed) {
    credTotalEl.textContent = totalPages.toString();
    buildDots();
    renderPage(0);
    startTimer();

    /* Pause on hover */
    credFeed.addEventListener('mouseenter', function () { isPaused = true; });
    credFeed.addEventListener('mouseleave', function () { isPaused = false; });
  }

  /* ==========================================================
     INTERSECTION OBSERVER ANIMATIONS
     ========================================================== */
  var heroEls = document.querySelectorAll('.anim-fade-up');
var sectionEls = document.querySelectorAll(
    '.section__header, .overview__bio, .overview__details, .domain-card, .deploy-card-link-wrapper, .cred-feed, .cred-feed__nav, .cred-feed__footnote, .contact__text, .contact__channels'
  );

  if ('IntersectionObserver' in window && !reducedMotion) {
    var heroObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('anim-visible');
          heroObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    heroEls.forEach(function (el) { heroObs.observe(el); });

    var sectionObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var parent = entry.target.parentElement;
          var siblings = parent ? [].slice.call(parent.children).filter(function (c) {
            return [].slice.call(sectionEls).indexOf(c) !== -1;
          }) : [];
          var idx = siblings.indexOf(entry.target);
          var delay = idx >= 0 ? idx * 50 : 0;

          setTimeout(function () {
            entry.target.classList.add('anim-in-view');
          }, delay);

          sectionObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

    sectionEls.forEach(function (el) { sectionObs.observe(el); });
  } else {
    /* No IntersectionObserver or reduced motion — show everything */
    heroEls.forEach(function (el) { el.classList.add('anim-visible'); });
    sectionEls.forEach(function (el) { el.classList.add('anim-in-view'); });
  }

  /* ==========================================================
     SMOOTH SCROLL
     ========================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
        history.pushState(null, '', targetId);
      }
    });
  });

  /* ==========================================================
     KEYBOARD SHORTCUT — T for theme toggle
     ========================================================== */
  document.addEventListener('keydown', function (e) {
    if (e.key === 't' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      var tag = document.activeElement.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      themeToggle.click();
    }
  });

  /* ==========================================================
     EASTER EGG — Konami code
     ========================================================== */
  var konamiSeq = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  var konamiIdx = 0;

  document.addEventListener('keydown', function (e) {
    if (e.keyCode === konamiSeq[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === konamiSeq.length) {
        konamiIdx = 0;
        document.documentElement.style.setProperty('--c-accent', '#f85149');
        setTimeout(function () {
          document.documentElement.style.removeProperty('--c-accent');
        }, 3000);
      }
    } else {
      konamiIdx = 0;
    }
  });

})();
