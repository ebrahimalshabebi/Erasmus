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

    next.addEventListener('click', () => {
        const maxScroll = slider.scrollWidth - slider.clientWidth;

        if (slider.scrollLeft >= maxScroll - 5) {
            // 🔁 back to start
            slider.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            slider.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
        }
    });

    prev.addEventListener('click', () => {
        if (slider.scrollLeft <= 5) {
            // 🔁 go to end
            slider.scrollTo({
                left: slider.scrollWidth,
                behavior: 'smooth'
            });
        } else {
            slider.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
        }
    });
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

const modal = document.getElementById("bipModal");
const modalBody = document.getElementById("bipModalBody");
const closeBtn = document.querySelector(".bip-close");

const data = {
    germany: `
    <div class="modal-header">
        <small>DE · DIGITAL INNOVATION</small>
        <h2>Digital Innovation BIP</h2>
    </div>

    <div class="modal-content-inner">
        <p><strong>Technische Universität Berlin · Berlin, Germany</strong></p>

        <div class="modal-grid">
            <div class="modal-box">ECTS<br><strong>6</strong></div>
            <div class="modal-box">Dates<br><strong>Jun–Jul 2026</strong></div>
            <div class="modal-box">Language<br><strong>English</strong></div>
            <div class="modal-box">Spots<br><strong>10 left</strong></div>
        </div>

        <div class="modal-section">
            <h3>Programme Timeline</h3>
            <div class="modal-timeline">
                <div class="modal-step">💻 <strong>Online Phase</strong> — startup basics & ideation</div>
                <div class="modal-step">🚀 <strong>Physical Phase</strong> — Berlin innovation labs</div>
                <div class="modal-step">📊 <strong>Final Phase</strong> — pitch to mentors</div>
            </div>
        </div>

        <div class="modal-section">
            <h3>Partner Universities</h3>
            <div class="modal-tags">
                <span class="modal-tag">TU Berlin</span>
                <span class="modal-tag">University of Warsaw</span>
                <span class="modal-tag">Utrecht University</span>
                <span class="modal-tag">University of Vienna</span>
            </div>
        </div>

        <div class="modal-trip">
            <h3>📍 Planning your trip to Berlin?</h3>
            <div class="modal-trip-grid">
                <div class="modal-trip-item">✈️ Flights to Berlin</div>
                <div class="modal-trip-item">🏨 Student dorms</div>
                <div class="modal-trip-item">🍔 Cheap eats</div>
                <div class="modal-trip-item">🚇 Public transport</div>
            </div>
        </div>

        <a href="#" class="modal-apply">Apply Now →</a>
    </div>
    `,

    netherlands: `
    <div class="modal-header">
        <small>NL · SUSTAINABILITY</small>
        <h2>Sustainable Cities</h2>
    </div>

    <div class="modal-content-inner">
        <p><strong>University of Amsterdam · Amsterdam, Netherlands</strong></p>

        <div class="modal-grid">
            <div class="modal-box">ECTS<br><strong>8</strong></div>
            <div class="modal-box">Dates<br><strong>May–Jun 2026</strong></div>
            <div class="modal-box">Language<br><strong>English</strong></div>
            <div class="modal-box">Spots<br><strong>7 left</strong></div>
        </div>

        <div class="modal-section">
            <h3>Programme Timeline</h3>
            <div class="modal-timeline">
                <div class="modal-step">🌍 Online research & prep</div>
                <div class="modal-step">🏙 Field work in Amsterdam</div>
                <div class="modal-step">📘 Final sustainability project</div>
            </div>
        </div>

        <div class="modal-section">
            <h3>Partner Universities</h3>
            <div class="modal-tags">
                <span class="modal-tag">University of Amsterdam</span>
                <span class="modal-tag">TU Delft</span>
                <span class="modal-tag">Lund University</span>
                <span class="modal-tag">KU Leuven</span>
            </div>
        </div>

        <div class="modal-trip">
            <h3>📍 Planning your trip to Amsterdam?</h3>
            <div class="modal-trip-grid">
                <div class="modal-trip-item">✈️ Flights</div>
                <div class="modal-trip-item">🏨 Hostels & housing</div>
                <div class="modal-trip-item">🚲 Bike culture tips</div>
                <div class="modal-trip-item">🍟 Local food</div>
            </div>
        </div>

        <a href="#" class="modal-apply">Apply Now →</a>
    </div>
    `,

    spain: `
        <div class="modal-header">
            <small>ES · URBAN PLANNING</small>
            <h2>Sustainable Cities of the Future</h2>
        </div>

        <div class="modal-content-inner">
            <p><strong>Universidad Complutense de Madrid · Madrid, Spain</strong></p>

            <div class="modal-grid">
                <div class="modal-box">ECTS<br><strong>3</strong></div>
                <div class="modal-box">Dates<br><strong>Jul 14–24, 2026</strong></div>
                <div class="modal-box">Language<br><strong>English</strong></div>
                <div class="modal-box">Spots<br><strong>7 left</strong></div>
            </div>

            <div class="modal-section">
                <h3>Programme Timeline</h3>
                <div class="modal-timeline">
                    <div class="modal-step">
                        💻 <strong>Online Phase — 3 weeks online</strong>
                    </div>
                    <div class="modal-step">
                        ✈️ <strong>Physical Mobility — 10 days physical</strong>
                    </div>
                    <div class="modal-step">
                        🎓 <strong>Final Deliverable — post phase</strong>
                    </div>
                </div>
            </div>

            <div class="modal-section">
                <h3>Partner Universities</h3>
                <div class="modal-tags">
                    <span class="modal-tag">UCM</span>
                    <span class="modal-tag">TU Berlin</span>
                    <span class="modal-tag">Politecnico di Milano</span>
                    <span class="modal-tag">KU Leuven</span>
                </div>
            </div>

            <div class="modal-trip">
                <h3>📍 Planning your trip?</h3>
                <div class="modal-trip-grid">
                    <div class="modal-trip-item">✈️ Flights</div>
                    <div class="modal-trip-item">🏨 Housing</div>
                    <div class="modal-trip-item">🍽 Food</div>
                    <div class="modal-trip-item">🚌 Transport</div>
                </div>
            </div>

            <a href="#" class="modal-apply">Apply Now →</a>
        </div>
    `,

    italy: `
    <div class="modal-header">
        <small>IT · DESIGN</small>
        <h2>Creative Design Lab</h2>
    </div>

    <div class="modal-content-inner">
        <p><strong>Politecnico di Milano · Milan, Italy</strong></p>

        <div class="modal-grid">
            <div class="modal-box">ECTS<br><strong>4</strong></div>
            <div class="modal-box">Dates<br><strong>Apr–May 2026</strong></div>
            <div class="modal-box">Language<br><strong>English</strong></div>
            <div class="modal-box">Spots<br><strong>9 left</strong></div>
        </div>

        <div class="modal-section">
            <h3>Programme Timeline</h3>
            <div class="modal-timeline">
                <div class="modal-step">🎨 Online inspiration phase</div>
                <div class="modal-step">🧠 Milan design workshops</div>
                <div class="modal-step">📦 Final concept presentation</div>
            </div>
        </div>

        <div class="modal-section">
            <h3>Partner Universities</h3>
            <div class="modal-tags">
                <span class="modal-tag">Politecnico di Milano</span>
                <span class="modal-tag">ESAD Porto</span>
                <span class="modal-tag">University of Barcelona</span>
            </div>
        </div>

        <div class="modal-trip">
            <h3>📍 Planning your trip to Milan?</h3>
            <div class="modal-trip-grid">
                <div class="modal-trip-item">✈️ Flights</div>
                <div class="modal-trip-item">🏨 Housing</div>
                <div class="modal-trip-item">🍝 Italian food</div>
                <div class="modal-trip-item">🚋 City transport</div>
            </div>
        </div>

        <a href="#" class="modal-apply">Apply Now →</a>
    </div>
    `,

    france: `
    <div class="modal-header">
        <small>FR · ENTREPRENEURSHIP</small>
        <h2>Green Entrepreneurship</h2>
    </div>

    <div class="modal-content-inner">
        <p><strong>Université de Lyon · Lyon, France</strong></p>

        <div class="modal-grid">
            <div class="modal-box">ECTS<br><strong>5</strong></div>
            <div class="modal-box">Dates<br><strong>Sep–Oct 2026</strong></div>
            <div class="modal-box">Language<br><strong>English</strong></div>
            <div class="modal-box">Spots<br><strong>8 left</strong></div>
        </div>

        <div class="modal-section">
            <h3>Programme Timeline</h3>
            <div class="modal-timeline">
                <div class="modal-step">🌱 Online idea development</div>
                <div class="modal-step">🚀 Startup building in Lyon</div>
                <div class="modal-step">📈 Final pitch</div>
            </div>
        </div>

        <div class="modal-section">
            <h3>Partner Universities</h3>
            <div class="modal-tags">
                <span class="modal-tag">Université de Lyon</span>
                <span class="modal-tag">HEC Paris</span>
                <span class="modal-tag">University of Bologna</span>
            </div>
        </div>

        <div class="modal-trip">
            <h3>📍 Planning your trip to Lyon?</h3>
            <div class="modal-trip-grid">
                <div class="modal-trip-item">✈️ Flights</div>
                <div class="modal-trip-item">🏨 Student housing</div>
                <div class="modal-trip-item">🥐 French cuisine</div>
                <div class="modal-trip-item">🚋 Transport</div>
            </div>
        </div>

        <a href="#" class="modal-apply">Apply Now →</a>
    </div>
    `,

    portugal: `
    <div class="modal-header">
        <small>PT · OCEANS</small>
        <h2>Blue Economy & Oceans</h2>
    </div>

    <div class="modal-content-inner">
        <p><strong>University of Lisbon · Lisbon, Portugal</strong></p>

        <div class="modal-grid">
            <div class="modal-box">ECTS<br><strong>7</strong></div>
            <div class="modal-box">Dates<br><strong>Oct 2026</strong></div>
            <div class="modal-box">Language<br><strong>English</strong></div>
            <div class="modal-box">Spots<br><strong>6 left</strong></div>
        </div>

        <div class="modal-section">
            <h3>Programme Timeline</h3>
            <div class="modal-timeline">
                <div class="modal-step">🌊 Online marine studies</div>
                <div class="modal-step">⚓ Coastal field visits</div>
                <div class="modal-step">📊 Final sustainability report</div>
            </div>
        </div>

        <div class="modal-section">
            <h3>Partner Universities</h3>
            <div class="modal-tags">
                <span class="modal-tag">University of Lisbon</span>
                <span class="modal-tag">University of Porto</span>
                <span class="modal-tag">University of Bergen</span>
            </div>
        </div>

        <div class="modal-trip">
            <h3>📍 Planning your trip to Lisbon?</h3>
            <div class="modal-trip-grid">
                <div class="modal-trip-item">✈️ Flights</div>
                <div class="modal-trip-item">🏨 Accommodation</div>
                <div class="modal-trip-item">🌊 Beaches</div>
                <div class="modal-trip-item">🚋 Transport</div>
            </div>
        </div>

        <a href="#" class="modal-apply">Apply Now →</a>
    </div>
    `
};

document.querySelectorAll(".open-modal").forEach(btn => {
    btn.addEventListener("click", () => {
        const key = btn.dataset.bip;
        modalBody.innerHTML = data[key];

        modal.style.display = "flex";
        document.body.style.overflow = "hidden"; // 🔥 lock background scroll
    });
});

closeBtn.onclick = () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // 🔓 unlock scroll
};

window.onclick = e => {
    if (e.target === modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // 🔓 unlock scroll
    }
};