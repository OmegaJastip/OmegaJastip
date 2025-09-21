// Restaurant page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Load restaurant data
    loadRestaurants();

    // Setup search functionality
    setupSearch();

    // Setup filter functionality
    setupFilters();
});

async function loadRestaurants() {
    try {
        const response = await fetch('data/resto.json');
        const restaurants = await response.json();
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

function createRestaurantCard(restaurant) {
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
                    <button class="btn btn-outline" onclick="showRestaurantDetails(${restaurant.id})">
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

function showRestaurantDetails(restaurantId) {
    // Get restaurant data
    fetch('data/resto.json')
        .then(response => response.json())
        .then(restaurants => {
            const restaurant = restaurants.find(r => r.id === restaurantId);
            if (restaurant) {
                showRestaurantModal(restaurant);
            } else {
                alert('Data restoran tidak ditemukan!');
            }
        })
        .catch(error => {
            console.error('Error loading restaurant details:', error);
            alert('Terjadi kesalahan saat memuat detail restoran.');
        });
}

function showRestaurantModal(restaurant) {
    const ratingStars = generateStars(restaurant.rating);

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
                        <h3>Menu & Layanan</h3>
                        <div class="services-list">
                            ${restaurant.menu && restaurant.menu.map(service => `
                                <div class="service-item-detail">
                                    <span class="service-name">${service.name}</span>
                                    <span class="service-price">${service.price}</span>
                                </div>
                            `).join('')}
                        </div>
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
                color: #007bff;
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
                color: #007bff;
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
                background: #007bff;
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
        `;
        document.head.appendChild(styles);
    }
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
