// Restaurant page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Load restaurant data
    loadRestaurants();
});

// Function to get unique categories from restaurant data
function getUniqueCategories(restaurants) {
    const categories = new Set();

    // Add "all" category for "Semua" button
    categories.add('all');

    // Extract unique categories from restaurant data
    restaurants.forEach(restaurant => {
        if (restaurant.category) {
            categories.add(restaurant.category);
        }
    });

    return Array.from(categories);
}

// Function to create filter buttons dynamically
function createFilterButtons(categories) {
    const filterContainer = document.querySelector('.filter-buttons');

    // Clear existing buttons (except search box)
    const existingButtons = filterContainer.querySelectorAll('.filter-btn');
    existingButtons.forEach(button => button.remove());

    // Create new filter buttons based on data
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.dataset.category = category;

        // Set button text
        if (category === 'all') {
            button.textContent = 'Semua';
            button.classList.add('active'); // Make "Semua" active by default
        } else {
            button.textContent = category;
        }

        filterContainer.appendChild(button);
    });
}

async function loadRestaurants() {
    try {
        const response = await fetch('data/resto.json');
        const restaurants = await response.json();

        // Get unique categories and create filter buttons dynamically
        const categories = getUniqueCategories(restaurants);
        createFilterButtons(categories);

        // Setup filter functionality after buttons are created
        setupFilters();

        // Display restaurants
        displayRestaurants(restaurants);
    } catch (error) {
        console.error('Error loading restaurant data:', error);
        displayErrorMessage();
    }
}

function displayRestaurants(restaurants) {
    const container = document.getElementById('restaurants-grid');

    if (!restaurants || restaurants.length === 0) {
        container.innerHTML = '<div class="no-results">Tidak ada restoran yang tersedia saat ini.</div>';
        return;
    }

    const html = restaurants.map(restaurant => createRestaurantCard(restaurant)).join('');
    container.innerHTML = html;
}

function createRestaurantCard(restaurant, currentCategoryFilter = 'all') {
    const ratingStars = generateStars(restaurant.rating);
    const services = restaurant.delivery_available && restaurant.pickup_available
        ? '<span class="service-badge delivery">Delivery</span><span class="service-badge pickup">Pickup</span>'
        : restaurant.delivery_available
        ? '<span class="service-badge delivery">Delivery</span>'
        : restaurant.pickup_available
        ? '<span class="service-badge pickup">Pickup</span>'
        : '';

    return `
        <div class="restaurant-card" data-category="${restaurant.category}" data-name="${restaurant.name.toLowerCase()}">
            <div class="restaurant-image">
                <img src="${restaurant.image}" alt="${restaurant.name}" onerror="this.src='images/placeholder-resto.jpg'">
                <div class="restaurant-overlay">
                    <div class="services-badges">
                        ${services}
                    </div>
                </div>
            </div>
            <div class="restaurant-info">
                <div class="restaurant-header">
                    <h3>${restaurant.name}</h3>
                    <div class="rating">
                        ${ratingStars}
                        <span class="rating-number">${restaurant.rating}</span>
                    </div>
                </div>
                <div class="restaurant-category">
                    <i class="fas fa-tag"></i>
                    <span>${restaurant.category}</span>
                </div>
                <p class="restaurant-description">${restaurant.description}</p>
                <div class="restaurant-details">
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${restaurant.address}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-phone"></i>
                        <span>${restaurant.phone}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${restaurant.operating_hours}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-money-bill-wave"></i>
                        <span>${restaurant.price_range}</span>
                    </div>
                </div>
                <div class="menu-preview">
                    <h4>Menu Utama:</h4>
                    <div class="menu-items">
                        ${restaurant.menu && restaurant.menu.slice(0, 3).map(item => `<span class="menu-item">${item.name}</span>`).join('')}
                        ${restaurant.menu && restaurant.menu.length > 3 ? `<span class="menu-more">+${restaurant.menu.length - 3} lainnya</span>` : ''}
                    </div>
                </div>
                <div class="restaurant-actions">
                    <a href="https://wa.me/62895700341213?text=Halo, saya mau pesan dari ${encodeURIComponent(restaurant.name)}" class="btn btn-primary" target="_blank">
                        <i class="fab fa-whatsapp"></i> Pesan via WA
                    </a>
                    <button class="btn btn-outline" onclick="showRestaurantDetails(${restaurant.id}, '${currentCategoryFilter}')">
                        <i class="fas fa-info-circle"></i> Detail
                    </button>
                </div>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

function setupSearch() {
    const searchInput = document.getElementById('search-resto');

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterRestaurants(searchTerm);
    });
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const category = this.dataset.category;
            filterByCategory(category);
        });
    });
}

function filterRestaurants(searchTerm) {
    const cards = document.querySelectorAll('.restaurant-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const name = card.dataset.name;
        const category = card.dataset.category;

        if (name.includes(searchTerm) || category.toLowerCase().includes(searchTerm)) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show/hide no results message
    const container = document.getElementById('restaurants-grid');
    let noResultsMsg = container.querySelector('.no-results');

    if (visibleCount === 0) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results';
            noResultsMsg.textContent = 'Tidak ada restoran yang sesuai dengan pencarian Anda.';
            container.appendChild(noResultsMsg);
        }
    } else {
        if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }
}

function filterByCategory(category) {
    const cards = document.querySelectorAll('.restaurant-card');
    let visibleCount = 0;

    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show/hide no results message
    const container = document.getElementById('restaurants-grid');
    let noResultsMsg = container.querySelector('.no-results');

    if (visibleCount === 0) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results';
            noResultsMsg.textContent = 'Tidak ada restoran dalam kategori ini.';
            container.appendChild(noResultsMsg);
        }
    } else {
        if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }
}

function showRestaurantDetails(restaurantId, menuCategoryFilter = null) {
    // Get restaurant data
    fetch('data/resto.json')
        .then(response => response.json())
        .then(restaurants => {
            const restaurant = restaurants.find(r => r.id === restaurantId);
            if (restaurant) {
                showRestaurantModal(restaurant, menuCategoryFilter);
            } else {
                alert('Data restoran tidak ditemukan!');
            }
        })
        .catch(error => {
            console.error('Error loading restaurant details:', error);
            alert('Terjadi kesalahan saat memuat detail restoran.');
        });
}


function showRestaurantModal(restaurant, menuCategoryFilter = null) {
    const ratingStars = generateStars(restaurant.rating);

    // Group menu items by category
    const menuByCategory = {};
    if (restaurant.menu && restaurant.menu.length > 0) {
        restaurant.menu.forEach(item => {
            if (!menuByCategory[item.category]) {
                menuByCategory[item.category] = [];
            }
            menuByCategory[item.category].push(item);
        });
    }

    // Get unique categories for category filter
    const categories = Object.keys(menuByCategory);

    // Generate HTML for category filter buttons
    let categoryFilterHtml = '<div class="modal-category-filters">';
    categoryFilterHtml += '<button class="category-filter-btn active" data-category="all">Semua</button>';
    categories.forEach(cat => {
        categoryFilterHtml += `<button class="category-filter-btn" data-category="${cat}">${cat}</button>`;
    });
    categoryFilterHtml += '</div>';

    // Generate HTML for menu grouped by category
    let menuHtml = '<div id="modal-menu-list">';
    for (const category in menuByCategory) {
        menuHtml += `<h4 class="menu-category" data-category="${category}">${category}</h4><div class="services-list">`;
        menuByCategory[category].forEach(item => {
            menuHtml += `
                <div class="service-item-detail" data-name="${item.name.toLowerCase()}">
                    <div class="service-header">
                        <span class="service-name">${item.name}</span>
                        <span class="service-price">${item.price}</span>
                    </div>
            `;

            // Add variants if they exist
            if (item.variants && item.variants.length > 0) {
                menuHtml += '<div class="service-variants">';
                item.variants.forEach(variant => {
                    menuHtml += `
                        <div class="variant-item">
                            <span class="variant-name">${variant.name}</span>
                            <span class="variant-price">${variant.price}</span>
                        </div>
                    `;
                });
                menuHtml += '</div>';
            }

            menuHtml += '</div>';
        });
        menuHtml += '</div>';
    }
    menuHtml += '</div>';

    const modal = document.createElement('div');
    modal.className = 'detail-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${restaurant.name}</h2>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="modal-image">
                    <img src="${restaurant.image}" alt="${restaurant.name}" onerror="this.src='images/placeholder-resto.jpg'">
                </div>
                <div class="modal-info">
                    <div class="modal-rating">
                        <div class="rating">
                            ${ratingStars}
                            <span class="rating-number">${restaurant.rating}</span>
                        </div>
                        <span class="category">${restaurant.category}</span>
                    </div>

                    <p class="description">${restaurant.description}</p>

                    <div class="info-section">
                        <h3>Informasi Kontak</h3>
                        <div class="info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${restaurant.address}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-phone"></i>
                            <span>${restaurant.phone}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <span>${restaurant.operating_hours}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-money-bill-wave"></i>
                            <span>${restaurant.price_range}</span>
                        </div>
                    </div>

                    <div class="info-section">
                        <h3>Menu & Layanan (berdasarkan kategori menu)</h3>
                        <input type="text" id="modal-menu-search" placeholder="Search menu..." />
                        ${categoryFilterHtml}
                        ${menuHtml}
                    </div>

                    <div class="info-section">
                        <h3>Layanan Tersedia</h3>
                        <div class="services-badges">
                            ${restaurant.delivery_available && restaurant.pickup_available
                                ? '<span class="service-badge delivery">Delivery</span><span class="service-badge pickup">Pickup</span>'
                                : restaurant.delivery_available
                                ? '<span class="service-badge delivery">Delivery</span>'
                                : restaurant.pickup_available
                                ? '<span class="service-badge pickup">Pickup</span>'
                                : '<span class="service-badge">Tidak ada layanan</span>'}
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <a href="https://wa.me/62895700341213?text=Halo, saya mau pesan dari ${encodeURIComponent(restaurant.name)}" class="btn btn-primary" target="_blank">
                    <i class="fab fa-whatsapp"></i> Pesan via WhatsApp
                </a>
                <button class="btn btn-outline" onclick="closeModal()">Tutup</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add modal styles if not already added
    if (!document.getElementById('modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'modal-styles';
        styles.textContent = `
            .detail-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            }

            .modal-content {
                background: white;
                border-radius: 12px;
                max-width: 600px;
                max-height: 90vh;
                width: 90%;
                overflow-y: auto;
                animation: slideIn 0.3s ease;
            }

            .modal-header {
                padding: 20px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .modal-header h2 {
                margin: 0;
                color: #333;
                font-size: 1.5rem;
            }

            .close-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .close-btn:hover {
                color: #333;
            }

            .modal-body {
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            .modal-image {
                width: 100%;
                height: 200px;
                overflow: hidden;
                border-radius: 8px;
            }

            .modal-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .modal-info {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .modal-rating {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .modal-rating .rating {
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .modal-rating .category {
                background: #f0f0f0;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.9rem;
                color: #666;
            }

            .info-section {
                border-top: 1px solid #eee;
                padding-top: 15px;
            }

            .info-section h3 {
                margin: 0 0 10px 0;
                color: #333;
                font-size: 1.1rem;
            }

            .info-item {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 8px;
                color: #666;
            }

            .info-item i {
                width: 16px;
                color: #EE4D2D;
            }

            .service-item-detail {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid #f0f0f0;
            }

            .service-name {
                font-weight: 500;
            }

            .service-price {
                color: #EE4D2D;
                font-weight: 600;
            }

            .services-badges {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }

            .service-badge {
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 500;
            }

            .service-badge.delivery {
                background: #28a745;
                color: white;
            }

            .service-badge.pickup {
                background: #EE4D2D;
                color: white;
            }

            .modal-footer {
                padding: 20px;
                border-top: 1px solid #eee;
                display: flex;
                gap: 15px;
                justify-content: flex-end;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-50px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            @media (max-width: 768px) {
                .modal-content {
                    width: 95%;
                    margin: 10px;
                }

                .modal-footer {
                    flex-direction: column;
                }
            }

            .modal-category-filters {
                margin-bottom: 10px;
            }

            .category-filter-btn {
                background: #f0f0f0;
                border: none;
                border-radius: 20px;
                padding: 6px 12px;
                margin-right: 8px;
                cursor: pointer;
                font-size: 0.9rem;
                transition: background-color 0.3s ease;
            }

            .category-filter-btn.active,
            .category-filter-btn:hover {
                background: #EE4D2D;
                color: white;
            }

            #modal-menu-search {
                width: 100%;
                padding: 8px 12px;
                margin-bottom: 10px;
                border: 1px solid #ccc;
                border-radius: 8px;
                font-size: 1rem;
            }

            .service-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
            }

            .service-variants {
                margin-left: 20px;
                margin-top: 5px;
                border-left: 2px solid #f0f0f0;
                padding-left: 15px;
            }

            .variant-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 4px 0;
                font-size: 0.9rem;
            }

            .variant-name {
                color: #666;
                font-style: italic;
            }

            .variant-price {
                color: #EE4D2D;
                font-weight: 500;
                font-size: 0.85rem;
            }
        `;
        document.head.appendChild(styles);
    }

    // Add event listeners for search and category filter
    const searchInput = document.getElementById('modal-menu-search');
    const categoryButtons = modal.querySelectorAll('.category-filter-btn');
    const menuList = modal.querySelector('#modal-menu-list');

    function filterMenu() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeCategoryBtn = modal.querySelector('.category-filter-btn.active');
        const activeCategory = activeCategoryBtn ? activeCategoryBtn.dataset.category : 'all';

        const menuCategories = menuList.querySelectorAll('.menu-category');
        menuCategories.forEach(categoryEl => {
            const category = categoryEl.dataset.category;
            const serviceItems = categoryEl.nextElementSibling.querySelectorAll('.service-item-detail');

            // Show/hide category based on active category filter
            if (activeCategory !== 'all' && category !== activeCategory) {
                categoryEl.style.display = 'none';
                categoryEl.nextElementSibling.style.display = 'none';
                return;
            } else {
                categoryEl.style.display = '';
                categoryEl.nextElementSibling.style.display = '';
            }

            // Filter service items by search term
            serviceItems.forEach(item => {
                const name = item.dataset.name;
                if (name.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });

            // If all items are hidden, hide the category as well
            const visibleItems = Array.from(serviceItems).some(item => item.style.display !== 'none');
            if (!visibleItems) {
                categoryEl.style.display = 'none';
                categoryEl.nextElementSibling.style.display = 'none';
            }
        });
    }

    searchInput.addEventListener('input', filterMenu);

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterMenu();
        });
    });
}

function closeModal() {
    const modal = document.querySelector('.detail-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function displayErrorMessage() {
    const container = document.getElementById('restaurants-grid');
    container.innerHTML = '<div class="error-message">Maaf, terjadi kesalahan saat memuat data restoran. Silakan coba lagi nanti.</div>';
}
