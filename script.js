document.addEventListener('DOMContentLoaded', () => {
    // Cambio de tema (claro/oscuro)
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        themeToggle.innerHTML = body.classList.contains('dark-mode') ? 
            '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // Navegación suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animación de las barras de habilidades
    const skillBars = document.querySelectorAll('.skill-per');
    
    const animateSkillBars = () => {
        skillBars.forEach(skill => {
            const percentage = skill.getAttribute('per');
            skill.style.width = percentage;
        });
    };

    // Animación de partículas en la sección de inicio
    const particlesContainer = document.querySelector('.particles');
    
    const createParticle = () => {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDuration = Math.random() * 2 + 1 + 's';
        particlesContainer.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 5000);
    };

    setInterval(createParticle, 100);

    // Efecto parallax en la sección de inicio
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.content');
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
    });

    // Animación de entrada para los proyectos
    const projectCards = document.querySelectorAll('.project-card');
    
    const animateProjectCards = () => {
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    };

    // Observador de intersección para activar animaciones
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'skills') {
                    animateSkillBars();
                } else if (entry.target.id === 'projects') {
                    animateProjectCards();
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(document.querySelector('#skills'));
    observer.observe(document.querySelector('#projects'));

    // Efecto de escritura para el subtítulo
    const typewriter = document.querySelector('.typewriter');
    const text = typewriter.textContent;
    typewriter.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            typewriter.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }

    typeWriter();
});

// Estilos para las partículas
const style = document.createElement('style');
style.textContent = `
    .particle {
        position: absolute;
        width: 5px;
        height: 5px;
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        animation: float 3s infinite ease-in-out;
    }

    @keyframes float {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(style);