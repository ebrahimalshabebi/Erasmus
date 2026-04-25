// ===== Cursor Gradient Effect =====
const cursorGradient = document.getElementById('cursorGradient');
let mouseX = 0, mouseY = 0;
let gradientX = 0, gradientY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateGradient() {
    gradientX += (mouseX - gradientX) * 0.1;
    gradientY += (mouseY - gradientY) * 0.1;
    cursorGradient.style.left = gradientX + 'px';
    cursorGradient.style.top = gradientY + 'px';
    requestAnimationFrame(animateGradient);
}
animateGradient();

// ===== Hero Interactive Mouse Effect =====
const heroSection = document.getElementById('heroSection');
const heroParticles = document.getElementById('heroParticles');
const heroCursorLight = document.getElementById('heroCursorLight');

let isMouseInHero = false;
let heroMouseX = 0;
let heroMouseY = 0;
let lastHeroMouseX = 0;
let lastHeroMouseY = 0;
let trailDots = [];
let magneticDots = [];
const maxTrailDots = 12;
const maxMagneticDots = 20;
let sparkleTimeout = null;
let lastSparkleTime = 0;

// Create magnetic floating dots
function createMagneticDots() {
    for (let i = 0; i < maxMagneticDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'hero-magnetic-dot';
        dot.style.left = Math.random() * 100 + '%';
        dot.style.top = Math.random() * 100 + '%';
        dot.style.opacity = 0.3 + Math.random() * 0.4;
        dot.style.width = (4 + Math.random() * 6) + 'px';
        dot.style.height = dot.style.width;
        heroParticles.appendChild(dot);
        magneticDots.push({
            el: dot,
            baseX: parseFloat(dot.style.left),
            baseY: parseFloat(dot.style.top),
            currentX: 0,
            currentY: 0
        });
    }
}
createMagneticDots();

// Create trail dot
function createTrailDot() {
    const dot = document.createElement('div');
    dot.className = 'hero-trail-dot';
    heroParticles.appendChild(dot);
    return dot;
}

// Initialize trail dots
for (let i = 0; i < maxTrailDots; i++) {
    trailDots.push({
        el: createTrailDot(),
        x: 0,
        y: 0
    });
}

// Create sparkle effect
function createSparkle(x, y) {
    const now = Date.now();
    if (now - lastSparkleTime < 50) return;
    lastSparkleTime = now;

    for (let i = 0; i < 3; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'hero-sparkle';
        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 40;
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        sparkle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
        heroParticles.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 800);
    }
}

// Create expanding wave ring on click
function createWaveRing(x, y) {
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const ring = document.createElement('div');
            ring.className = 'hero-wave-ring';
            ring.style.left = x + 'px';
            ring.style.top = y + 'px';
            ring.style.width = (80 + i * 40) + 'px';
            ring.style.height = (80 + i * 40) + 'px';
            heroParticles.appendChild(ring);

            setTimeout(() => ring.remove(), 600);
        }, i * 100);
    }
}

// Create pulsing ring effect
function createPulseRing(x, y) {
    const ring = document.createElement('div');
    ring.className = 'hero-glow-ring';
    ring.style.left = x + 'px';
    ring.style.top = y + 'px';
    heroParticles.appendChild(ring);

    setTimeout(() => ring.remove(), 2000);
}

let pulseInterval = null;

heroSection.addEventListener('mouseenter', (e) => {
    isMouseInHero = true;
    heroSection.classList.add('mouse-active');
    heroCursorLight.style.opacity = '1';

    const rect = heroSection.getBoundingClientRect();
    heroMouseX = e.clientX - rect.left;
    heroMouseY = e.clientY - rect.top;

    // Start pulse effect
    pulseInterval = setInterval(() => {
        if (isMouseInHero) {
            createPulseRing(heroMouseX, heroMouseY);
        }
    }, 2000);
});

heroSection.addEventListener('mouseleave', () => {
    isMouseInHero = false;
    heroSection.classList.remove('mouse-active');
    heroCursorLight.style.opacity = '0';

    if (pulseInterval) {
        clearInterval(pulseInterval);
        pulseInterval = null;
    }

    // Reset magnetic dots
    magneticDots.forEach(dot => {
        dot.el.style.transform = 'translate(0, 0)';
    });
});

heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    heroMouseX = e.clientX - rect.left;
    heroMouseY = e.clientY - rect.top;

    // Calculate velocity for sparkles
    const vx = heroMouseX - lastHeroMouseX;
    const vy = heroMouseY - lastHeroMouseY;
    const velocity = Math.sqrt(vx * vx + vy * vy);

    if (velocity > 8) {
        createSparkle(heroMouseX, heroMouseY);
    }

    lastHeroMouseX = heroMouseX;
    lastHeroMouseY = heroMouseY;
});

heroSection.addEventListener('click', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createWaveRing(x, y);
});

// Animation loop for hero effects
function animateHeroEffects() {
    if (isMouseInHero) {
        // Update cursor light position
        heroCursorLight.style.left = heroMouseX + 'px';
        heroCursorLight.style.top = heroMouseY + 'px';

        // Update trail dots with smooth following
        let prevX = heroMouseX;
        let prevY = heroMouseY;

        trailDots.forEach((dot, i) => {
            const scale = 1 - (i / maxTrailDots) * 0.8;
            const size = 6 + (maxTrailDots - i) * 1.5;

            dot.x += (prevX - dot.x) * (0.3 - i * 0.015);
            dot.y += (prevY - dot.y) * (0.3 - i * 0.015);

            dot.el.style.left = dot.x + 'px';
            dot.el.style.top = dot.y + 'px';
            dot.el.style.width = size + 'px';
            dot.el.style.height = size + 'px';
            dot.el.style.opacity = scale * 0.8;
            dot.el.style.transform = 'translate(-50%, -50%)';

            prevX = dot.x;
            prevY = dot.y;
        });

        // Update magnetic dots
        const heroRect = heroSection.getBoundingClientRect();
        magneticDots.forEach(dot => {
            const dotX = (dot.baseX / 100) * heroRect.width;
            const dotY = (dot.baseY / 100) * heroRect.height;
            const dx = heroMouseX - dotX;
            const dy = heroMouseY - dotY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 200;

            if (distance < maxDistance) {
                const force = (1 - distance / maxDistance) * 30;
                const targetX = (dx / distance) * force;
                const targetY = (dy / distance) * force;

                dot.currentX += (targetX - dot.currentX) * 0.1;
                dot.currentY += (targetY - dot.currentY) * 0.1;
            } else {
                dot.currentX *= 0.95;
                dot.currentY *= 0.95;
            }

            dot.el.style.transform = `translate(${dot.currentX}px, ${dot.currentY}px)`;
        });
    } else {
        // Fade out trail dots when mouse leaves
        trailDots.forEach(dot => {
            dot.el.style.opacity = '0';
        });
    }

    requestAnimationFrame(animateHeroEffects);
}
animateHeroEffects();

// ===== Typing Animation =====
const typingElement = document.getElementById('typingText');
const phrases = [
    "We'd love to hear from you!",
    "Questions about Erasmus+?",
    "Ready to explore the world?",
    "Start your journey today!"
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 80;

function typeText() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
    } else {
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500;
    }

    setTimeout(typeText, typingSpeed);
}
typeText();

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Scroll Reveal Animation =====
const revealElements = document.querySelectorAll('.reveal');

function checkReveal() {
    const windowHeight = window.innerHeight;
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', checkReveal);
window.addEventListener('load', checkReveal);

// ===== FAQ Accordion =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  question.addEventListener('click', () => {
    const isOpen = answer.style.maxHeight;

    // Close all
    faqItems.forEach(i => {
      i.querySelector('.faq-answer').style.maxHeight = null;
      i.classList.remove('active');
    });

    // Open current
    if (!isOpen) {
      answer.style.maxHeight = answer.scrollHeight + "px";
      item.classList.add('active');
    }
  });
});

// ===== Chat Bubble =====
// const chatBubble = document.getElementById('chatBubble');
// const chatBtn = document.getElementById('chatBtn');

// chatBtn.addEventListener('click', () => {
//     chatBubble.classList.toggle('open');
// });

// function handleQuickReply(message) {
//     const chatBody = document.querySelector('.chat-body');
//     const messageDiv = document.createElement('div');
//     messageDiv.className = 'chat-message';
//     messageDiv.style.background = 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))';
//     messageDiv.style.color = 'white';
//     messageDiv.style.marginLeft = 'auto';
//     messageDiv.style.maxWidth = '80%';
//     messageDiv.textContent = message;

//     chatBody.insertBefore(messageDiv, chatBody.querySelector('.quick-replies'));

//     setTimeout(() => {
//         const responseDiv = document.createElement('div');
//         responseDiv.className = 'chat-message';
//         responseDiv.innerHTML = "Thanks for your question! For detailed information, please fill out our contact form or email us at <strong>erasmus@aydin.edu.tr</strong>";
//         chatBody.insertBefore(responseDiv, chatBody.querySelector('.quick-replies'));
//         chatBody.scrollTop = chatBody.scrollHeight;
//     }, 1000);
// }

// ===== Form Validation =====
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const formContainer = document.getElementById('contactFormContainer');

// Real-time validation
const inputs = contactForm.querySelectorAll('.form-input');
inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
        if (input.parentElement.parentElement.classList.contains('has-error')) {
            validateField(input);
        }
    });
});

function validateField(field) {
    const formGroup = field.parentElement.parentElement;
    let isValid = true;

    if (field.required && !field.value.trim()) {
        isValid = false;
    }

    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(field.value);
    }

    if (isValid) {
        formGroup.classList.remove('has-error');
        field.classList.remove('error');
        if (field.value.trim()) {
            field.classList.add('success');
        }
    } else {
        formGroup.classList.add('has-error');
        field.classList.add('error');
        field.classList.remove('success');
    }

    return isValid;
}

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isFormValid = true;
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });

    if (!isFormValid) return;

    // Show loading state
    submitBtn.classList.add('loading');

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Show success message
    submitBtn.classList.remove('loading');
    contactForm.style.display = 'none';
    successMessage.classList.add('show');
});

function resetForm() {
    contactForm.reset();
    inputs.forEach(input => {
        input.classList.remove('success', 'error');
        input.parentElement.parentElement.classList.remove('has-error');
    });
    contactForm.style.display = 'block';
    successMessage.classList.remove('show');
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
lucide.createIcons();