/* ========================================
   Luis Rosado - Premium Portfolio Script
   Rework: Clean, performant interactions
   ======================================== */

(function () {
    'use strict';

    // --- DOM refs ---
    const body = document.body;
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const icon = darkModeToggle ? darkModeToggle.querySelector('i') : null;
    const backgroundVideo = document.getElementById('backgroundVideo');
    const cursorGlow = document.querySelector('.cursor-glow');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const scrollProgress = document.getElementById('scrollProgress');

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
        if (icon) {
            icon.classList.toggle('fa-moon', !enabled);
            icon.classList.toggle('fa-sun', enabled);
        }
        localStorage.setItem('darkMode', enabled ? 'enabled' : 'disabled');

        if (backgroundVideo) {
            const src = enabled ? 'img/Night.mp4' : 'img/Clouds.mp4';
            const source = backgroundVideo.querySelector('source');
            if (source && source.src !== src) {
                source.src = src;
                backgroundVideo.load();
            }
        }
    }

    // Init dark mode from preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'enabled' || (savedMode === null && prefersDark)) {
        setDarkMode(true);
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            setDarkMode(!body.classList.contains('dark-mode'));
        });
    }

    // --- Mobile Nav Toggle ---
    if (navToggle && navMenu) {
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
    }

    // --- Navbar scroll state + Scroll Progress ---
    function handleScroll() {
        const scrollY = window.scrollY;
        if (navbar) {
            navbar.classList.toggle('scrolled', scrollY > 30);
        }

        // Scroll progress bar
        if (scrollProgress) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
            scrollProgress.style.width = progress + '%';
        }
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

    // --- Typing Effect ---
    (function initTypingEffect() {
        const typedEl = document.getElementById('typedText');
        if (!typedEl) return;

        const phrases = [
            'AI & Machine Learning',
            'Cloud Architecture',
            'Product Engineering',
            'Full-Stack Development'
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typeSpeed = 80;
        const deleteSpeed = 50;
        const pauseEnd = 2200;
        const pauseStart = 500;

        function tick() {
            const current = phrases[phraseIndex];

            if (!isDeleting) {
                typedEl.textContent = current.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === current.length) {
                    isDeleting = true;
                    setTimeout(tick, pauseEnd);
                    return;
                }
                setTimeout(tick, typeSpeed);
            } else {
                typedEl.textContent = current.substring(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    setTimeout(tick, pauseStart);
                    return;
                }
                setTimeout(tick, deleteSpeed);
            }
        }

        // Start after a brief initial delay
        setTimeout(tick, 1500);
    })();

    // --- Particle Canvas (Hero) ---
    (function initParticles() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let mouseX = -1000, mouseY = -1000;
        const maxParticles = 45;
        const connectDistance = 110;
        const mouseRadius = 140;

        // Respect reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        function resize() {
            const hero = canvas.parentElement;
            width = canvas.width = hero.offsetWidth;
            height = canvas.height = hero.offsetHeight;
        }

        function createParticle() {
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                size: Math.random() * 1.8 + 0.8,
                opacity: Math.random() * 0.4 + 0.15
            };
        }

        function init() {
            resize();
            particles = [];
            for (let i = 0; i < maxParticles; i++) {
                particles.push(createParticle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                // Mouse repel
                const dx = p.x - mouseX;
                const dy = p.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouseRadius && dist > 0) {
                    const force = (mouseRadius - dist) / mouseRadius;
                    p.x += (dx / dist) * force * 1.2;
                    p.y += (dy / dist) * force * 1.2;
                }

                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(45, 212, 191, ' + p.opacity + ')';
                ctx.fill();
            });

            // Draw connecting lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectDistance) {
                        const opacity = (1 - dist / connectDistance) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = 'rgba(45, 212, 191, ' + opacity + ')';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        // Track mouse on the hero section
        const heroSection = document.getElementById('home');
        if (heroSection) {
            heroSection.addEventListener('mousemove', (e) => {
                const rect = heroSection.getBoundingClientRect();
                mouseX = e.clientX - rect.left;
                mouseY = e.clientY - rect.top;
            });
            heroSection.addEventListener('mouseleave', () => {
                mouseX = -1000;
                mouseY = -1000;
            });
        }

        window.addEventListener('resize', resize);
        init();
        animate();
    })();

    // --- Magnetic Buttons ---
    (function initMagneticButtons() {
        if (!window.matchMedia('(pointer: fine)').matches) return;

        const magnetics = document.querySelectorAll('.magnetic-btn');
        magnetics.forEach(wrap => {
            const btn = wrap.firstElementChild;
            if (!btn) return;

            wrap.addEventListener('mousemove', (e) => {
                const rect = wrap.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
            });

            wrap.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    })();

    // --- Section Parallax on Headers ---
    (function initParallax() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const headers = document.querySelectorAll('.section-header');
        if (!headers.length) return;

        function updateParallax() {
            headers.forEach(header => {
                const rect = header.getBoundingClientRect();
                const inView = rect.top < window.innerHeight && rect.bottom > 0;
                if (inView) {
                    const offset = (rect.top / window.innerHeight) * 12;
                    header.style.transform = 'translateY(' + offset + 'px)';
                }
            });
        }

        window.addEventListener('scroll', updateParallax, { passive: true });
    })();

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
