document.addEventListener('DOMContentLoaded', () => {
    // --- State Variables ---
    let allAnnouncements = [];
    let filteredData = [];
    let currentPage = 1;
    const itemsPerPage = 9;

    // --- DOM Elements ---
    const grid = document.getElementById('announcementsGrid');
    const pagination = document.getElementById('paginationControls');
    const modal = document.getElementById('announcementModal');

    // Filter Elements
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const resetBtn = document.getElementById('resetFilters');

    // --- Initialization (Fetching the JSON) ---
    fetch('assets/data/announcements.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            allAnnouncements = data;
            filteredData = [...allAnnouncements]; // Copy the data to our filtered array
            renderPage(); // Render the first page once data is loaded
        })
        .catch(error => {
            console.error('Error loading announcements:', error);
            grid.innerHTML = '<p>Error loading announcements. Please try again later.</p>';
        });

    // --- Core Functions ---
    function renderPage() {
        grid.innerHTML = '';
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = filteredData.slice(start, end);

        if (paginatedItems.length === 0) {
            grid.innerHTML = '<p>No announcements found matching your criteria.</p>';
            pagination.innerHTML = '';
            return;
        }

        paginatedItems.forEach(item => {
            const card = document.createElement('article');
            card.className = 'announcement-card';
            card.innerHTML = `
                <div class="card-content">
                    <div class="card-header-flex">
                        <span class="card-tag ${item.tagColor}">${item.category}</span>
                        <div class="modern-date">${item.day}<span>${item.month}</span></div>
                    </div>
                    <h3>${item.title}</h3>
                    <p>${item.shortDesc}</p>
                    <a href="javascript:void(0)" class="card-link view-more-btn" data-id="${item.id}">View More →</a>
                </div>
            `;
            grid.appendChild(card);
        });

        attachModalListeners();
        renderPaginationControls();
    }

    function renderPaginationControls() {
        pagination.innerHTML = '';
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);

        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            btn.innerText = i;
            btn.addEventListener('click', () => {
                currentPage = i;
                renderPage();
                // Smooth scroll back to the top of the grid when page changes
                window.scrollTo({ top: document.querySelector('.filter-bar').offsetTop - 100, behavior: 'smooth' });
            });
            pagination.appendChild(btn);
        }
    }

    // --- Filtering Logic ---
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const start = startDate.value ? new Date(startDate.value) : null;
        const end = endDate.value ? new Date(endDate.value) : null;

        filteredData = allAnnouncements.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm) || item.shortDesc.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'All' || item.category === category;

            let matchesDate = true;
            if (start || end) {
                const itemDate = new Date(item.date);
                if (start && itemDate < start) matchesDate = false;
                if (end && itemDate > end) matchesDate = false;
            }

            return matchesSearch && matchesCategory && matchesDate;
        });

        currentPage = 1; // Reset to first page on new search
        renderPage();
    }

    // --- Event Listeners for Filters ---
    searchInput.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    startDate.addEventListener('change', applyFilters);
    endDate.addEventListener('change', applyFilters);

    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        categoryFilter.value = 'All';
        startDate.value = '';
        endDate.value = '';
        applyFilters();
    });

    // --- Modal Logic ---
    function attachModalListeners() {
        document.querySelectorAll('.view-more-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const item = allAnnouncements.find(a => a.id === id);

                document.getElementById('modalTag').innerText = item.category;
                document.getElementById('modalTag').className = `card-tag ${item.tagColor}`;
                document.getElementById('modalDate').innerHTML = `${item.day}<span>${item.month}</span>`;
                document.getElementById('modalTitle').innerText = item.title;
                document.getElementById('modalBody').innerHTML = `<p>${item.fullDesc}</p>`;

                modal.style.display = 'flex';
            });
        });
    }

    document.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
});