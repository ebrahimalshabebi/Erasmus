document.addEventListener('DOMContentLoaded', () => {
    const homeGrid = document.getElementById('mainPageAnnouncements');
    const modal = document.getElementById('homeAnnouncementModal');
    let homeData = [];

    if (!homeGrid) return;

    fetch('assets/data/announcements.json')
        .then(res => res.json())
        .then(data => {
            homeData = data;
            // Take the 6 most recent items
            const recent = data.slice(0, 6);

            // Create the HTML for the cards
            const cardHTML = recent.map(item => `
                <article class="announcement-card">
                    <div class="card-content">
                        <div class="card-header-flex">
                            <span class="card-tag ${item.tagColor}">${item.category}</span>
                            <div class="modern-date">${item.day}<span>${item.month}</span></div>
                        </div>
                        <h3>${item.title}</h3>
                        <p>${item.shortDesc}</p>
                        <button class="card-link view-home-btn" data-id="${item.id}" style="background:none; border:none; color:inherit; cursor:pointer; font-weight:700; padding:0;">
                            Read Full Details →
                        </button>
                    </div>
                </article>
            `).join('');

            // CRITICAL: Inject the list TWICE for the infinite loop effect
            homeGrid.innerHTML = cardHTML + cardHTML;

            attachHomeModalListeners();
        });

    function attachHomeModalListeners() {
        document.querySelectorAll('.view-home-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                const item = homeData.find(a => a.id === id);

                document.getElementById('homeModalTag').innerText = item.category;
                document.getElementById('homeModalTag').className = `card-tag ${item.tagColor}`;
                document.getElementById('homeModalDate').innerHTML = `${item.day}<span>${item.month}</span>`;
                document.getElementById('homeModalTitle').innerText = item.title;
                document.getElementById('homeModalBody').innerHTML = `<p>${item.fullDesc}</p>`;

                modal.style.display = 'flex';
            });
        });
    }

    document.querySelector('.close-home-modal').onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
});