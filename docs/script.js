/* ========================================
   Luis Rosado - Modern Portfolio Script
   ======================================== */
 
(function () {
    'use strict';

    // --- DOM refs ---
    const body = document.body;
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const icon = darkModeToggle.querySelector('i');
    const backgroundVideo = document.getElementById('backgroundVideo');
    const cursorGlow = document.querySelector('.cursor-glow');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // --- Cursor Glow ---
    if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateGlow() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
    }

    // --- Dark Mode ---
    function setDarkMode(enabled) {
        body.classList.toggle('dark-mode', enabled);
        icon.classList.toggle('fa-moon', !enabled);
        icon.classList.toggle('fa-sun', enabled);
        localStorage.setItem('darkMode', enabled ? 'enabled' : 'disabled');

        const src = enabled ? 'img/Night.mp4' : 'img/Clouds.mp4';
        if (backgroundVideo.querySelector('source').src !== src) {
            backgroundVideo.querySelector('source').src = src;
            backgroundVideo.load();
        }
    }

    // Init dark mode from preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'enabled' || (savedMode === null && prefersDark)) {
        setDarkMode(true);
    }

    darkModeToggle.addEventListener('click', () => {
        setDarkMode(!body.classList.contains('dark-mode'));
    });

    // --- Mobile Nav Toggle ---
    navToggle.addEventListener('click', () => {
        const isOpen = navToggle.classList.toggle('open');
        navMenu.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen);
        body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile nav on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navMenu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
        });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
            navToggle.classList.remove('open');
            navMenu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
        }
    });

    // --- Navbar scroll state ---
    let lastScroll = 0;
    function handleScroll() {
        const scrollY = window.scrollY;
        navbar.classList.toggle('scrolled', scrollY > 30);
        lastScroll = scrollY;
    }

    // --- Active nav highlight ---
    function highlightNav() {
        const scrollY = window.scrollY + window.innerHeight * 0.35;
        let current = '';

        sections.forEach(section => {
            if (scrollY >= section.offsetTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle(
                'active',
                link.getAttribute('href') === '#' + current
            );
        });
    }

    // --- Scroll Reveal (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || 0);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(el => {
        revealObserver.observe(el);
    });

    // --- Skill Bars Animation ---
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target.querySelector('.skill-fill');
                if (fill) {
                    const width = fill.dataset.width;
                    setTimeout(() => {
                        fill.style.width = width + '%';
                    }, 200);
                }
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-card').forEach(card => {
        skillObserver.observe(card);
    });

    // --- Counter Animation ---
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('[data-count]');
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.count);
                    const duration = 1500;
                    const start = performance.now();

                    function updateCount(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        counter.textContent = Math.round(target * eased);
                        if (progress < 1) requestAnimationFrame(updateCount);
                    }
                    requestAnimationFrame(updateCount);
                });
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) counterObserver.observe(heroStats);

    // --- Scroll handler (throttled) ---
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                highlightNav();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Init
    handleScroll();
    highlightNav();

})();
