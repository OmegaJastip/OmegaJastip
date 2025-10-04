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

    return `
        <div class="store-card clickable-card" data-category="${restaurant.category}" data-name="${restaurant.name.toLowerCase()}" onclick="window.location.href='menu.html?id=${restaurant.id}'" style="background-image: url('${restaurant.image}'); background-size: cover; background-position: center; position: relative; height: 250px; border-radius: 12px; overflow: hidden; cursor: pointer;">
            <div class="store-overlay-transparent" style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.3)); padding: 15px; color: white;">
                <h3 style="margin: 0 0 5px 0; font-size: 1.2rem; font-weight: 600;">${restaurant.name}</h3>
                <div class="rating" style="margin-bottom: 5px;">
                    ${ratingStars}
                    <span class="rating-number" style="color: #ffd700; margin-left: 5px;">${restaurant.rating}</span>
                </div>
                <div class="category-badge" style="background: rgba(238, 77, 45, 0.9); color: white; padding: 3px 8px; border-radius: 10px; display: inline-block; font-size: 0.8rem; font-weight: 500;">${restaurant.category}</div>
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

    // Add clear button dynamically
    let clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'search-clear-btn';
    clearBtn.innerHTML = '&times;';
    clearBtn.style.display = 'none';
    searchInput.parentNode.appendChild(clearBtn);

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        filterRestaurants('');
        searchInput.focus();
    });

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterRestaurants(searchTerm);
        clearBtn.style.display = this.value ? 'block' : 'none';
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
                                ? (() => {
                                    const servicesByCategory = {};
                                    restaurant.services.forEach(service => {
                                        const category = service.category || 'Lainnya';
                                        if (!servicesByCategory[category]) {
                                            servicesByCategory[category] = [];
                                        }
                                        servicesByCategory[category].push(service);
                                    });
                                    return Object.keys(servicesByCategory).map(category => {
                                        const services = servicesByCategory[category];
                                        return `
                                            <div class="category-group">
                                                <h4>${category}</h4>
                                                <div class="category-services">
                                                    ${services.map(service => {
                                                        if (service.variants && service.variants.length > 0) {
                                                            return service.variants.map(variant => {
                                                                const displayName = variant.variant
                                                                    ? `${service.name} (${variant.variant})`
                                                                    : service.name;
                                                                return `
                                                                    <div class="service-item-detail">
                                                                        <div class="service-info">
                                                                            <span class="service-name">${displayName}</span>
                                                                            <span class="service-price">${variant.price}</span>
                                                                        </div>
                                                                        <button class="btn-add-cart" onclick="addToCart('${displayName.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}', '${variant.price}', '${variant.variant || ''}', '${restaurant.name.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}')">
                                                                            <i class="fas fa-cart-plus"></i> Tambah
                                                                        </button>
                                                                    </div>
                                                                `;
                                                            }).join('');
                                                        } else {
                                                            return `
                                                                <div class="service-item-detail">
                                                                    <div class="service-info">
                                                                        <span class="service-name">${service.name}</span>
                                                                        <span class="service-price">Harga tidak tersedia</span>
                                                                    </div>
                                                                    <button class="btn-add-cart" disabled>
                                                                        <i class="fas fa-cart-plus"></i> Tambah
                                                                    </button>
                                                                </div>
                                                            `;
                                                        }
                                                    }).join('')}
                                                </div>
                                            </div>
                                        `;
                                    }).join('');
                                })()
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
                ${restaurant.name !== "Mango Queen Lubuklinggau" ? `<a href="https://wa.me/62895700341213?text=Halo, saya mau pesan makanan dari ${encodeURIComponent(restaurant.name)}" class="btn btn-primary" target="_blank">
                    <i class="fab fa-whatsapp"></i> Pesan Makanan
                </a>` : ''}
                <button class="btn btn-outline" onclick="closeModal()">Tutup</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Add modal styles if not already added
    if (!document.getElementById('modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'modal-styles';
        styles.textContent = `
            .detail-modal {
                display: none;
                position: fixed;
                z-index: 1001;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(3px);
                animation: fadeIn 0.3s ease-out;
            }

            .modal-content {
                background-color: #ffffff;
                margin: 5% auto;
                padding: 0;
                border-radius: 24px;
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
                overflow: hidden;
                animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                border: 1px solid rgba(0, 0, 0, 0.05);
            }

            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 25px;
                background: linear-gradient(135deg, #ee4d2d, #f57c5a);
                color: white;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .modal-header h2 {
                margin: 0;
                font-size: 1.5rem;
                font-weight: 600;
            }

            .close-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                font-size: 1.8rem;
                cursor: pointer;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .close-btn:hover,
            .close-btn:active {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            .close-btn:active {
                transition: all 0.1s ease;
            }

            .modal-body {
                max-height: 60vh;
                overflow-y: auto;
                padding: 25px;
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            /* Custom Scrollbar for Modal Body */
            .modal-body::-webkit-scrollbar {
                width: 6px;
            }

            .modal-body::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 3px;
            }

            .modal-body::-webkit-scrollbar-thumb {
                background: #ee4d2d;
                border-radius: 3px;
            }

            .modal-body::-webkit-scrollbar-thumb:hover {
                background: #f57c5a;
            }

            .modal-image {
                text-align: center;
                margin-bottom: 15px;
            }

            .modal-image img {
                max-width: 100%;
                height: 200px;
                object-fit: cover;
                border-radius: 16px;
                box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
                transition: all 0.3s ease;
            }

            .modal-image img:hover {
                transform: scale(1.02);
            }

            .modal-info {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            .modal-rating {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding: 15px;
                background: #fafafa;
                border-radius: 12px;
                border-left: 4px solid #ee4d2d;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .rating {
                display: flex;
                align-items: center;
                gap: 5px;
                color: #ffd700;
                font-size: 1.1rem;
            }

            .rating-number {
                font-weight: 600;
                color: #ee4d2d;
                font-size: 1rem;
            }

            .category {
                background: #f57c5a;
                color: white;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 500;
            }

            .description {
                color: #555555;
                line-height: 1.6;
                font-size: 0.95rem;
                background: #ffffff;
                padding: 15px;
                border-radius: 12px;
                border-left: 4px solid #f57c5a;
                margin: 10px 0;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .info-section {
                background: #fafafa;
                padding: 20px;
                border-radius: 16px;
                margin-bottom: 15px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(0, 0, 0, 0.05);
            }

            .info-section h3 {
                color: #1c1b1f;
                margin-bottom: 15px;
                font-size: 1.2rem;
                border-bottom: 2px solid #ee4d2d;
                padding-bottom: 8px;
                font-weight: 600;
            }

            .info-item {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                gap: 10px;
            }

            .info-item i {
                color: #ee4d2d;
                width: 20px;
                font-size: 1.1rem;
            }

            .info-item span {
                color: #555555;
                flex: 1;
            }

            .services-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-bottom: 20px;
            }

            .category-group {
                margin-bottom: 20px;
            }

            .category-group h4 {
                color: #1c1b1f;
                margin-bottom: 10px;
                font-size: 1.1rem;
                border-bottom: 2px solid #ee4d2d;
                padding-bottom: 5px;
                font-weight: 600;
            }

            .category-services {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .service-item-detail {
                background: #ffffff;
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 12px;
                padding: 15px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .service-item-detail:hover,
            .service-item-detail:active {
                border-color: #ee4d2d;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.18);
                transform: translateY(-2px);
            }

            .service-item-detail:active {
                transition: all 0.1s ease;
            }

            .service-info {
                display: flex;
                flex-direction: column;
            }

            .service-name {
                font-weight: 500;
                color: #333333;
                margin-bottom: 4px;
            }

            .service-price {
                color: #ee4d2d;
                font-weight: 600;
                font-size: 1rem;
            }

            .btn-add-cart {
                background-color: #28a745;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: background-color 0.3s ease;
            }

            .btn-add-cart:hover {
                background-color: #218838;
            }

            .btn-add-cart i {
                font-size: 16px;
            }

            .services-badges {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }

            .service-badge {
                background: #f57c5a;
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 500;
            }

            .service-badge.delivery {
                background: #28a745;
            }

            .service-badge.pickup {
                background: #007bff;
            }

            .modal-footer {
                display: flex;
                gap: 15px;
                padding: 20px 25px;
                background: #fafafa;
                border-top: 1px solid rgba(0, 0, 0, 0.1);
                justify-content: center;
                flex-wrap: wrap;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .modal-footer .btn {
                flex: 1;
                min-width: 150px;
                text-align: center;
                padding: 12px 20px;
            }

            .modal-footer .btn-primary {
                background: linear-gradient(135deg, #ee4d2d, #f57c5a);
                border: none;
                box-shadow: 0 4px 15px rgba(238, 77, 45, 0.2);
            }

            .modal-footer .btn-primary:hover,
            .modal-footer .btn-primary:active {
                background: linear-gradient(135deg, #f57c5a, #ee4d2d);
                transform: translateY(-1px);
                box-shadow: 0 6px 20px rgba(238, 77, 45, 0.3);
            }

            .modal-footer .btn-primary:active {
                transition: all 0.1s ease;
            }

            .modal-footer .btn-outline {
                background: transparent;
                border: 2px solid #555555;
                color: #555555;
            }

            .modal-footer .btn-outline:hover {
                background: #555555;
                color: white;
                border-color: #555555;
            }

            /* Animations */
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-50px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            /* Responsive Modal */
            @media (max-width: 768px) {
                .modal-content {
                    width: 95%;
                    margin: 10% auto;
                    max-height: 85vh;
                }

                .modal-body {
                    max-height: 50vh;
                    padding: 20px;
                }

                .modal-header {
                    padding: 15px 20px;
                }

                .modal-header h2 {
                    font-size: 1.3rem;
                }

                .modal-footer {
                    padding: 15px 20px;
                    flex-direction: column;
                }

                .modal-footer .btn {
                    min-width: auto;
                }

                .info-section {
                    padding: 15px;
                }

                .services-list {
                    gap: 10px;
                }

                .service-item-detail {
                    padding: 12px;
                }
            }

            @media (max-width: 480px) {
                .modal-body {
                    max-height: 45vh;
                }

                .modal-image img {
                    height: 150px;
                }

                .description {
                    font-size: 0.9rem;
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

function addToCart(itemName, priceStr, variant = null, restaurantName = null) {
    const cart = getCart();
    const price = parsePrice(priceStr);

    // Check if item already exists
    const existingItem = cart.find(item =>
        item.name === itemName &&
        item.variant === variant &&
        item.restaurantName === restaurantName
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: itemName,
            price: price,
            quantity: 1,
            variant: variant,
            restaurantName: restaurantName
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
