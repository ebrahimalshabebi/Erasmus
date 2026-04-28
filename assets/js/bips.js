/* ===== BIPs Page — Interactions ===== */

/* Header scroll state */
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
}, { passive: true });

/* Mobile nav toggle */
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.getElementById('primary-nav');
if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
        primaryNav.classList.toggle('is-open');
    });
}

/* Scroll reveal using IntersectionObserver */
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
        }
    });
}, { threshold: 0.15 });
revealEls.forEach((el) => io.observe(el));

/* Floating particles in hero */
(function initParticles() {
    const container = document.querySelector('.particles');
    if (!container) return;
    const PARTICLE_COUNT = 28;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = document.createElement('span');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.width = (2 + Math.random() * 3) + 'px';
        p.style.height = p.style.width;
        p.style.animationDuration = (8 + Math.random() * 12) + 's';
        p.style.animationDelay = (Math.random() * 10) + 's';
        p.style.opacity = (0.3 + Math.random() * 0.5).toString();
        container.appendChild(p);
    }
})();

/* Card 3D tilt effect on .bip-card */
(function initTilt() {
    const cards = document.querySelectorAll('.bip-card');
    const maxTilt = 7; // degrees

    cards.forEach((card) => {
        let rafId = null;

        function onMove(e) {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotY = (x - 0.5) * maxTilt * 2;
            const rotX = -(y - 0.5) * maxTilt * 2;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                card.style.transform =
                    `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-10px)`;
            });
        }

        function onLeave() {
            if (rafId) cancelAnimationFrame(rafId);
            card.style.transform = '';
        }

        // Disable on touch / small screens
        if (window.matchMedia('(hover: hover)').matches) {
            card.addEventListener('mousemove', onMove);
            card.addEventListener('mouseleave', onLeave);
        }
    });
})();

/* Experience slider controls */
(function initSlider() {
    const slider = document.getElementById('expSlider');
    const prev = document.getElementById('expPrev');
    const next = document.getElementById('expNext');
    if (!slider || !prev || !next) return;

    function getScrollStep() {
        const card = slider.querySelector('.exp-card');
        if (!card) return 320;
        const styles = getComputedStyle(slider);
        const gap = parseFloat(styles.gap) || 24;
        return card.getBoundingClientRect().width + gap;
    }

    function updateButtons() {
        prev.disabled = slider.scrollLeft <= 2;
        next.disabled = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 2;
    }

    prev.addEventListener('click', () => {
        slider.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    });
    next.addEventListener('click', () => {
        slider.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    });
    slider.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    updateButtons();
})();

/* Smooth anchor scrolling with header offset */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});