/**
 * events.js
 * Handles modal, carousel, and "show all" logic for events.html
 */

(function () {
    'use strict';

    // Mock Database of Events
    const eventsDB = {
        'e1': {
            title: 'Erasmus+ Orientation Day',
            date: 'Friday, May 23rd',
            desc: 'Welcome to all new incoming students! Join us for an essential overview of campus life, registration procedures, and a campus tour to kickstart your Erasmus journey.',
            body: `<h3>Welcome to Campus</h3>
                   <p>Our Orientation Day is designed to give you the best possible start to your Erasmus+ experience. You will meet the International Office staff, your departmental coordinators, and fellow exchange students.</p>
                   <h3>Agenda</h3>
                   <p><strong>09:30 AM:</strong> Registration & Welcome Coffee<br>
                   <strong>10:00 AM:</strong> Official Welcome Presentation<br>
                   <strong>11:30 AM:</strong> Academic Information & Course Registration<br>
                   <strong>01:00 PM:</strong> Lunch Break<br>
                   <strong>02:30 PM:</strong> Campus Tour & City Guide</p>
                   <p>Attendance is <strong>mandatory</strong> for all incoming students. Please bring your ID and acceptance letter.</p>`,
            images: [
                'https://picsum.photos/seed/ev1_1/800/600',
                'https://picsum.photos/seed/ev1_2/800/600',
                'https://picsum.photos/seed/ev1_3/800/600'
            ]
        },
        'e2': {
            title: 'Cultural Exchange Night',
            date: 'Saturday, June 1st',
            desc: 'Experience global cultures without leaving campus. Taste traditional food, watch performances, and share your own culture with fellow international students.',
            body: `<h3>A Night Around the World</h3>
                   <p>The Cultural Exchange Night is one of the highlights of the semester. Students from over 40 different countries will showcase their culture, traditions, music, and food.</p>
                   <p>We encourage everyone to wear traditional clothing or colors representing their home country. If you wish to set up a stand for your country or perform, please contact the Student Club.</p>
                   <h3>Highlights</h3>
                   <p>- International Food Tasting<br>
                   - Traditional Dance Performances<br>
                   - Interactive Cultural Booths<br>
                   - Live Music</p>`,
            images: [
                'https://picsum.photos/seed/ev2_1/800/600',
                'https://picsum.photos/seed/ev2_2/800/600'
            ]
        },
        'e3': {
            title: 'Historical City Tour',
            date: 'Sunday, June 9th',
            desc: 'Discover the hidden gems and rich history of the city with our expert guides. A perfect weekend getaway for new Erasmus students.',
            body: `<h3>Explore the City</h3>
                   <p>Join us for a comprehensive walking tour of the historical peninsula. Our knowledgeable guides will take you through centuries of history, from ancient ruins to modern landmarks.</p>
                   <p>The tour will involve a significant amount of walking, so please wear comfortable shoes and bring a water bottle. Lunch will be provided at a traditional local restaurant.</p>`,
            images: [
                'https://picsum.photos/seed/ev3_1/800/600',
                'https://picsum.photos/seed/ev3_2/800/600',
                'https://picsum.photos/seed/ev3_3/800/600',
                'https://picsum.photos/seed/ev3_4/800/600'
            ]
        },
        'p1': {
            title: 'Winter Farewell Gala',
            date: 'January 15th, 2026',
            desc: 'A wonderful evening celebrating the end of the fall semester with our departing exchange students.',
            body: `<h3>A Night to Remember</h3><p>We said goodbye to our fall semester exchange students with a beautiful gala dinner. Awards were given for "Most Active Participant", "Best Cultural Ambassador", and more.</p>`,
            images: ['https://picsum.photos/seed/wintergala_1/800/600', 'https://picsum.photos/seed/wintergala_2/800/600']
        },
        'p2': {
            title: 'Global Language Cafe',
            date: 'December 5th, 2025',
            desc: 'Students practiced over 10 different languages in an informal and fun setting while enjoying international snacks.',
            body: `<h3>Language Exchange</h3><p>Our monthly Language Cafe brought together over 100 students to practice languages ranging from Spanish and French to Korean and Arabic. It was a fantastic evening of peer-to-peer learning.</p>`,
            images: ['https://picsum.photos/seed/pe2_1/800/600']
        },
        'p3': {
            title: 'Erasmus Days Celebration',
            date: 'October 12th, 2025',
            desc: 'A three-day campus festival celebrating the impact and opportunities of the Erasmus+ program.',
            body: `<h3>Celebrating Mobility</h3><p>As part of the global Erasmus Days, our campus hosted seminars, alumni panels, and a massive outdoor festival highlighting the benefits of studying abroad.</p>`,
            images: ['https://picsum.photos/seed/pe3_1/800/600', 'https://picsum.photos/seed/pe3_2/800/600']
        },
        'p4': {
            title: 'CV Building Workshop',
            date: 'September 20th, 2025',
            desc: 'Career experts helped international students tailor their resumes for the European job market.',
            body: `<h3>Career Prep</h3><p>Experts from our Career Center provided one-on-one resume reviews and hosted a seminar on interview techniques for the European job market.</p>`,
            images: ['https://picsum.photos/seed/pe4_1/800/600']
        },
        // Extra past events for the "Show All" modal
        'p5': {
            title: 'Welcome Boat Party',
            date: 'September 5th, 2025',
            desc: 'Kicking off the semester with a spectacular sunset cruise along the coast.',
            body: `<h3>Sailing into the Semester</h3><p>The best way to start the semester! 300 international students enjoyed a sunset cruise with music, dancing, and breathtaking views.</p>`,
            images: ['https://picsum.photos/seed/pe5_1/800/600']
        },
        'p6': {
            title: 'International Food Festival',
            date: 'May 10th, 2025',
            desc: 'A culinary journey featuring dishes cooked by students from 35 different countries.',
            body: `<h3>Taste the World</h3><p>The campus smelled amazing as students prepared their favorite traditional dishes to share. The spicy taco stand and homemade pasta were crowd favorites.</p>`,
            images: ['https://picsum.photos/seed/pe6_1/800/600']
        }
    };

    const pastEventsIds = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];

    // DOM Elements
    const eventDetailModal = document.getElementById('eventDetailModal');
    const closeDetailModalBtn = document.getElementById('closeDetailModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const modalBody = document.getElementById('modalBody');
    
    // Carousel Elements
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselDots = document.getElementById('carouselDots');
    const carouselPrev = document.getElementById('carouselPrev');
    const carouselNext = document.getElementById('carouselNext');
    let currentSlide = 0;
    let totalSlides = 0;

    // Show All Modal Elements
    const allPastEventsModal = document.getElementById('allPastEventsModal');
    const btnShowAllEvents = document.getElementById('btnShowAllEvents');
    const closeAllPastModalBtn = document.getElementById('closeAllPastModal');
    const allPastEventsGrid = document.getElementById('allPastEventsGrid');

    // ----------------------------------------------------
    // Event Detail Modal & Carousel Logic
    // ----------------------------------------------------

    function openEventDetail(eventId) {
        const data = eventsDB[eventId];
        if (!data) return;

        // Populate text
        modalTitle.textContent = data.title;
        // Keep the SVG icon for date, just update the span text
        const dateVal = document.getElementById('modalDateVal');
        if(dateVal) {
            dateVal.textContent = data.date;
        }
        modalBody.innerHTML = data.body;

        // Build Carousel
        carouselTrack.innerHTML = '';
        carouselDots.innerHTML = '';
        currentSlide = 0;
        totalSlides = data.images.length;

        data.images.forEach((imgSrc, index) => {
            // Slide
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = `<img src="${imgSrc}" alt="Event Image ${index + 1}">`;
            carouselTrack.appendChild(slide);

            // Dot
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => goToSlide(index));
            carouselDots.appendChild(dot);
        });

        updateCarouselUI();

        // Show Modal
        eventDetailModal.classList.add('is-active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeEventDetail() {
        eventDetailModal.classList.remove('is-active');
        document.body.style.overflow = '';
    }

    function goToSlide(index) {
        if (totalSlides === 0) return;
        currentSlide = (index + totalSlides) % totalSlides; // Wrap around
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update dots
        Array.from(carouselDots.children).forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    // Attach Carousel Listeners
    if (carouselPrev) carouselPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
    if (carouselNext) carouselNext.addEventListener('click', () => goToSlide(currentSlide + 1));

    // Attach Card Click Listeners
    document.addEventListener('click', function(e) {
        const card = e.target.closest('.js-open-modal');
        if (card) {
            e.preventDefault();
            const id = card.getAttribute('data-id');
            openEventDetail(id);
        }
    });

    if (closeDetailModalBtn) closeDetailModalBtn.addEventListener('click', closeEventDetail);
    if (eventDetailModal) {
        eventDetailModal.addEventListener('click', function(e) {
            if (e.target === eventDetailModal) closeEventDetail();
        });
    }

    // ----------------------------------------------------
    // "Show All Past Events" Modal Logic
    // ----------------------------------------------------

    function generateAllPastEvents() {
        allPastEventsGrid.innerHTML = '';
        pastEventsIds.forEach(id => {
            const data = eventsDB[id];
            if (!data) return;

            const article = document.createElement('article');
            article.className = 'event-card js-open-modal';
            article.setAttribute('data-id', id);
            
            // Just use the first image for the card cover
            const coverImg = data.images && data.images.length > 0 ? data.images[0] : `https://picsum.photos/seed/${id}/600/400`;

            article.innerHTML = `
                <div class="event-card-img-wrap">
                    <img src="${coverImg}" alt="${data.title}" class="event-card-img">
                </div>
                <div class="event-card-content">
                    <div class="event-date">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        ${data.date}
                    </div>
                    <h3 class="event-title">${data.title}</h3>
                    <p class="event-desc">${data.desc}</p>
                </div>
            `;
            allPastEventsGrid.appendChild(article);
        });
    }

    if (btnShowAllEvents) {
        btnShowAllEvents.addEventListener('click', () => {
            generateAllPastEvents();
            allPastEventsModal.classList.add('is-active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeAllPastModalBtn) {
        closeAllPastModalBtn.addEventListener('click', () => {
            allPastEventsModal.classList.remove('is-active');
            document.body.style.overflow = '';
        });
    }

    if (allPastEventsModal) {
        allPastEventsModal.addEventListener('click', function(e) {
            if (e.target === allPastEventsModal) {
                allPastEventsModal.classList.remove('is-active');
                document.body.style.overflow = '';
            }
        });
    }

    // Keydown for Modals (ESC to close)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (eventDetailModal && eventDetailModal.classList.contains('is-active')) {
                closeEventDetail();
            } else if (allPastEventsModal && allPastEventsModal.classList.contains('is-active')) {
                allPastEventsModal.classList.remove('is-active');
                document.body.style.overflow = '';
            }
        }
    });

    function updateCarouselUI() {
        if (totalSlides <= 1) {
            carouselPrev.style.display = 'none';
            carouselNext.style.display = 'none';
            carouselDots.style.display = 'none';
        } else {
            carouselPrev.style.display = '';
            carouselNext.style.display = '';
            carouselDots.style.display = '';
        }
    }

})();
