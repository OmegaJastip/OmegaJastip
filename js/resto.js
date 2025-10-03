// Restaurant page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Load restaurant data
    loadRestaurants();

    // Setup search functionality
    setupSearch();

    // Setup filter functionality
    setupFilters();

    // Update cart count on page load
    updateCartCount();
});

async function loadRestaurants() {
    try {
        const response = await fetch('../data/resto.json');
        const restaurants = await response.json();
        displayRestaurants(restaurants);
    } catch (error) {
        console.error('Error loading restaurant data:', error);
        displayErrorMessage();
    }
}

function displayRestaurants(restaurants) {
    const container = document.getElementById('stores-grid');

    if (!restaurants || restaurants.length === 0) {
        container.innerHTML = '<div class="no-results">Tidak ada restoran yang tersedia saat ini.</div>';
        return;
    }

    const html = restaurants.map(restaurant => createRestaurantCard(restaurant)).join('');
    container.innerHTML = html;
}

function createRestaurantCard(restaurant) {
    const ratingStars = generateStars(restaurant.rating);
    const services = restaurant.services && restaurant.services.length > 0
        ? restaurant.services.map(service => `<span class="service-item">${service.name}</span>`).join('')
        : '<span class="service-item">Menu tidak tersedia</span>';

    return `
        <div class="store-card" data-category="${restaurant.category}" data-name="${restaurant.name.toLowerCase()}">
            <div class="store-image">
                <img src="${restaurant.image}" alt="${restaurant.name}" onerror="this.src='../images/toko.png'">
                <div class="store-overlay">
                    <div class="category-badge">${restaurant.category}</div>
                </div>
            </div>
            <div class="store-info">
                <div class="store-header">
                    <h3>${restaurant.name}</h3>
                    <div class="rating">
                        ${ratingStars}
                        <span class="rating-number">${restaurant.rating}</span>
                    </div>
                </div>
                <p class="store-description">${restaurant.description}</p>
                <div class="store-details">
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
                <div class="services-preview">
                    <h4>Menu Populer:</h4>
                    <div class="services-list">
                        ${services}
                    </div>
                </div>
                <div class="store-actions">
                    <a href="https://wa.me/62895700341213?text=Halo, saya mau pesan makanan dari ${encodeURIComponent(restaurant.name)}" class="btn btn-primary" target="_blank">
                        <i class="fab fa-whatsapp"></i> Pesan Makanan
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
    const cards = document.querySelectorAll('.store-card');
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
    const container = document.getElementById('stores-grid');
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
    const cards = document.querySelectorAll('.store-card');
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
    const container = document.getElementById('stores-grid');
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
    fetch('../data/resto.json')
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
                    <img src="${restaurant.image}" alt="${restaurant.name}" onerror="this.src='../images/toko.png'">
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
                        <h3>Menu & Harga</h3>
                        <div class="services-list">
                            ${restaurant.services && restaurant.services.length > 0
                                ? restaurant.services.map(service => `
                                    <div class="service-item-detail">
                                        <div class="service-info">
                                            <span class="service-name">${service.name}</span>
                                            <span class="service-price">${service.price}</span>
                                        </div>
                                        <button class="btn-add-cart" onclick="addToCart('${service.name.replace(/'/g, "\\'")}', '${service.price}')">
                                            <i class="fas fa-cart-plus"></i> Tambah
                                        </button>
                                    </div>
                                `).join('')
                                : '<div class="service-item-detail">Menu tidak tersedia</div>'}
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
                <a href="checkout.html" class="btn btn-secondary">
                    <i class="fas fa-shopping-cart"></i> Lihat Keranjang
                </a>
                <a href="https://wa.me/62895700341213?text=Halo, saya mau pesan makanan dari ${encodeURIComponent(restaurant.name)}" class="btn btn-primary" target="_blank">
                    <i class="fab fa-whatsapp"></i> Pesan Makanan
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

            .service-info {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .service-name {
                font-weight: 500;
            }

            .service-price {
                color: #007bff;
                font-weight: 600;
            }

            .btn-add-cart {
                background: #28a745;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.85rem;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 5px;
                transition: background-color 0.2s;
            }

            .btn-add-cart:hover {
                background: #218838;
            }

            .btn-add-cart i {
                font-size: 0.8rem;
            }

            .btn-secondary {
                background: #6c757d;
                color: white;
                text-decoration: none;
                padding: 10px 16px;
                border-radius: 6px;
                font-size: 0.9rem;
                font-weight: 500;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                transition: background-color 0.2s;
            }

            .btn-secondary:hover {
                background: #5a6268;
                color: white;
                text-decoration: none;
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
    const container = document.getElementById('stores-grid');
    container.innerHTML = '<div class="error-message">Maaf, terjadi kesalahan saat memuat data restoran. Silakan coba lagi nanti.</div>';
}

// Cart management functions
function getCart() {
    const cart = localStorage.getItem('shoppingCart');
    return cart ? JSON.parse(cart) : [];
}

function parsePrice(priceStr) {
    // Extract number from "Rp 15.000" -> 15000
    const match = priceStr.match(/Rp\s*([\d.,]+)/);
    return match ? parseInt(match[1].replace(/\./g, '')) : 0;
}

function saveCart(cart) {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

function addToCart(itemName, priceStr, variant = null) {
    const cart = getCart();
    const price = parsePrice(priceStr);

    // Check if item already exists
    const existingItem = cart.find(item =>
        item.name === itemName &&
        item.variant === variant
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: itemName,
            price: price,
            quantity: 1,
            variant: variant
        });
    }

    saveCart(cart);
    updateCartCount();

    // Show success message
    showToast('Item berhasil ditambahkan ke keranjang!');
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const floatingCta = document.querySelector('.floating-cta');
    if (!floatingCta) return;

    let countBadge = floatingCta.querySelector('.cart-count-badge');
    if (!countBadge) {
        countBadge = document.createElement('span');
        countBadge.className = 'cart-count-badge';
        countBadge.style.position = 'absolute';
        countBadge.style.top = '5px';
        countBadge.style.right = '5px';
        countBadge.style.background = '#ee4d2d';
        countBadge.style.color = 'white';
        countBadge.style.borderRadius = '50%';
        countBadge.style.padding = '2px 6px';
        countBadge.style.fontSize = '0.75rem';
        countBadge.style.fontWeight = '700';
        countBadge.style.minWidth = '20px';
        countBadge.style.textAlign = 'center';
        floatingCta.style.position = 'fixed';
        floatingCta.appendChild(countBadge);
    }
    if (count > 0) {
        countBadge.textContent = count;
        countBadge.style.display = 'inline-block';
    } else {
        countBadge.style.display = 'none';
    }
}

function showToast(message) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.background = '#28a745';
    toast.style.color = 'white';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '6px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    toast.style.zIndex = '9999';
    toast.style.fontSize = '0.9rem';
    toast.style.fontWeight = '500';
    toast.style.animation = 'slideInRight 0.3s ease';

    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);

    // Add toast styles if not already added
    if (!document.getElementById('toast-styles')) {
        const styles = document.createElement('style');
        styles.id = 'toast-styles';
        styles.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}
