// ===================================
// DOM Elements
// ===================================
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const icon = darkModeToggle.querySelector('i');
const backgroundVideo = document.getElementById('backgroundVideo');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.getElementById('navbar');

// ===================================
// Dark Mode Toggle
// ===================================
function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('darkMode', 'enabled');
        backgroundVideo.querySelector('source').src = 'img/Night.mp4';
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('darkMode', 'disabled');
        backgroundVideo.querySelector('source').src = 'img/Clouds.mp4';
    }
    
    backgroundVideo.load();
}

darkModeToggle.addEventListener('click', toggleDarkMode);

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'disabled') {
    body.classList.remove('dark-mode');
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
    backgroundVideo.querySelector('source').src = 'img/Clouds.mp4';
    backgroundVideo.load();
}

// ===================================
// Mobile Navigation Toggle
// ===================================
function toggleMobileNav() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

navToggle.addEventListener('click', toggleMobileNav);

// Close mobile nav when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMobileNav();
        }
    });
});

// Close mobile nav when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !navToggle.contains(e.target)) {
        toggleMobileNav();
    }
});

// ===================================
// Navbar Background on Scroll
// ===================================
let lastScrollY = window.scrollY;

function handleNavbarScroll() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        navbar.style.background = body.classList.contains('dark-mode') 
            ? 'rgba(15, 23, 42, 0.95)' 
            : 'rgba(248, 250, 252, 0.95)';
    } else {
        navbar.style.background = body.classList.contains('dark-mode')
            ? 'rgba(15, 23, 42, 0.9)'
            : 'rgba(248, 250, 252, 0.9)';
    }
    
    lastScrollY = currentScrollY;
}

window.addEventListener('scroll', handleNavbarScroll);

// ===================================
// Smooth Scroll for Navigation Links
// ===================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Active Navigation Link on Scroll
// ===================================
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + navbar.offsetHeight + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ===================================
// Skill Bars Animation
// ===================================
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = `${width}%`;
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// ===================================
// Scroll Animations
// ===================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.section-header, .project-card, .certificate-card, .skill-category, .about-content, .profile-card, .contact-item, .social-link'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });
}

// ===================================
// Typing Effect for Hero
// ===================================
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;
    
    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.borderRight = '2px solid var(--color-primary)';
    
    let charIndex = 0;
    
    function typeChar() {
        if (charIndex < text.length) {
            subtitle.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(typeChar, 80);
        } else {
            setTimeout(() => {
                subtitle.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    setTimeout(typeChar, 500);
}

// ===================================
// Video Fallback
// ===================================
function initVideoFallback() {
    backgroundVideo.addEventListener('error', () => {
        const heroSection = document.querySelector('.hero');
        heroSection.style.background = body.classList.contains('dark-mode')
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';
    });
}

// ===================================
// Initialize
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    animateSkillBars();
    initScrollAnimations();
    initTypingEffect();
    initVideoFallback();
    handleNavbarScroll();
    updateActiveNavLink();
});

// Preload handling
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
