// JavaScript for pages/checkout.html to handle cart display and checkout process

let map;
let restaurantMarkers = [];
let destinationMarker = null;
let routingControl = null;
let restaurants = [];

document.addEventListener('DOMContentLoaded', () => {
    setupFormSubmission();
    initializeMap();
    loadRestaurantsAndCart();
});



function getCart() {
    const cart = localStorage.getItem('shoppingCart');
    return cart ? JSON.parse(cart) : [];
}

function parsePrice(priceStr) {
    // Extract number from "Rp 15.000" -> 15000
    const match = priceStr.match(/Rp\s*([\d.,]+)/);
    return match ? parseInt(match[1].replace(/\./g, '')) : 0;
}

function formatPrice(price) {
    return 'Rp ' + price.toLocaleString('id-ID');
}

function getRestaurantsFromCart(cart) {
    // Load restaurant data and find restaurants that have items in cart
    return restaurants.filter(restaurant =>
        cart.some(item =>
            restaurant.services.some(service => service.name === item.name)
        )
    );
}

function loadRestaurantsAndCart() {
    fetch('../data/resto.json')
        .then(response => response.json())
        .then(data => {
            restaurants = data;
            loadCartItems();
            loadRestaurants();
        })
        .catch(error => console.error('Error loading restaurants:', error));
}

function loadCartItems() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Keranjang belanja Anda kosong</p>
                <a href="resto.html" class="btn">Mulai Belanja</a>
            </div>
        `;
        cartTotal.style.display = 'none';
        return;
    }

    cartTotal.style.display = 'block';

    let cartHtml = '';
    let subtotal = 0;

    // Calculate subtotal from all cart items first
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
    });

    // Get unique restaurants from cart items
    const cartRestaurants = getRestaurantsFromCart(cart);

    // Group cart items by restaurant for display
    const itemsByRestaurant = {};
    cart.forEach((item, index) => {
        // Find which restaurant this item belongs to
        const restaurant = cartRestaurants.find(r =>
            r.services.some(service => service.name === item.name)
        );

        if (restaurant) {
            if (!itemsByRestaurant[restaurant.id]) {
                itemsByRestaurant[restaurant.id] = {
                    restaurant: restaurant,
                    items: []
                };
            }
            itemsByRestaurant[restaurant.id].items.push({ item, index });
        } else {
            // If only one item in cart, assign to that item's restaurant instead of "Restoran Lainnya"
            if (cart.length === 1) {
                // Find restaurant for the single item
                const singleItem = cart[0];
                const singleItemRestaurant = restaurants.find(r =>
                    r.services.some(service => service.name === singleItem.name)
                );
                if (singleItemRestaurant) {
                    if (!itemsByRestaurant[singleItemRestaurant.id]) {
                        itemsByRestaurant[singleItemRestaurant.id] = {
                            restaurant: singleItemRestaurant,
                            items: []
                        };
                    }
                    itemsByRestaurant[singleItemRestaurant.id].items.push({ item, index });
                } else {
                    // Fallback to unknown group
                    if (!itemsByRestaurant['unknown']) {
                        itemsByRestaurant['unknown'] = {
                            restaurant: { name: 'Restoran Lainnya', id: 'unknown' },
                            items: []
                        };
                    }
                    itemsByRestaurant['unknown'].items.push({ item, index });
                }
            } else {
                // If restaurant not found and multiple items, put in a default group
                if (!itemsByRestaurant['unknown']) {
                    itemsByRestaurant['unknown'] = {
                        restaurant: { name: 'Restoran Lainnya', id: 'unknown' },
                        items: []
                    };
                }
                itemsByRestaurant['unknown'].items.push({ item, index });
            }
        }
    });

    // Display items grouped by restaurant
    Object.values(itemsByRestaurant).forEach(restaurantGroup => {
        const { restaurant, items } = restaurantGroup;

        // Add restaurant section container
        cartHtml += `<div class="restaurant-section" style="margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #eee;">`;

        // Add restaurant header
        cartHtml += `
            <div class="restaurant-header" style="background: #f8f9fa; padding: 12px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #ee4d2d;">
                <h3 style="margin: 0; color: #333; font-size: 1.1rem; font-weight: 600;">${restaurant.name}</h3>
            </div>
        `;

        // Add items for this restaurant
        items.forEach(({ item, index }) => {
            const itemTotal = item.price * item.quantity;

            cartHtml += `
                <div class="cart-item" data-index="${index}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">${formatPrice(item.price)} x ${item.quantity}</p>
                        ${item.variant ? `<p class="cart-item-variant">Varian: ${item.variant}</p>` : ''}
                    </div>
                    <div class="cart-item-total">
                        <span>${formatPrice(itemTotal)}</span>
                    </div>
                    <div class="cart-item-actions">
                        <button class="btn-small decrease-qty" data-index="${index}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="btn-small increase-qty" data-index="${index}">+</button>
                        <button class="btn-small remove-item" data-index="${index}">Hapus</button>
                    </div>
                </div>
            `;
        });

        // Close restaurant section container
        cartHtml += `</div>`;
    });

    cartItemsContainer.innerHTML = cartHtml;

    // Add event listeners for quantity changes and remove
    document.querySelectorAll('.decrease-qty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            changeQuantity(index, -1);
        });
    });

    document.querySelectorAll('.increase-qty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            changeQuantity(index, 1);
        });
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            removeItem(index);
        });
    });

    updateTotals(subtotal);
}

function changeQuantity(index, delta) {
    const cart = getCart();
    if (cart[index]) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart(cart);
        loadCartItems();
        loadRestaurants(); // Reload restaurants in case cart contents changed
        updateCartCount();
    }
}

function removeItem(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    loadCartItems();
    loadRestaurants(); // Reload restaurants in case cart contents changed
    updateCartCount();
}

function saveCart(cart) {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
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

function updateTotals(subtotal) {
    const shippingElement = document.getElementById('shipping');
    const calculatedShippingElement = document.getElementById('calculated-shipping');

    // Use calculated shipping if available, otherwise use default
    let shipping = 0; // Default shipping
    if (calculatedShippingElement && calculatedShippingElement.textContent !== 'Rp 0') {
        shipping = parsePrice(calculatedShippingElement.textContent);
    }

    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    shippingElement.textContent = formatPrice(shipping);
    document.getElementById('total').textContent = formatPrice(total);
}

function setupFormSubmission() {
    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const cart = getCart();
        if (cart.length === 0) {
            alert('Keranjang belanja kosong. Tambahkan item terlebih dahulu.');
            return;
        }

        const formData = new FormData(form);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const address = formData.get('address');
        const notes = formData.get('notes');
        const payment = formData.get('payment');

        // Get accurate coordinates from marker if available
        let mapsLink = `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
        if (destinationMarker) {
            const pos = destinationMarker.getLatLng();
            mapsLink = `https://www.google.com/maps?q=${pos.lat},${pos.lng}`;
        }

        // Calculate totals
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shippingElement = document.getElementById('shipping');
        const shipping = parsePrice(shippingElement.textContent);
        const total = subtotal + shipping;

        // Get distance and shipping info
        const distanceElement = document.getElementById('distance');
        const calculatedShippingElement = document.getElementById('calculated-shipping');
        const distance = distanceElement ? distanceElement.textContent : '0';
        const calculatedShipping = calculatedShippingElement ? calculatedShippingElement.textContent : 'Rp 0';

        // Build order message
        let message = `PESANAN BARU - OMEGA JASTIP\n\n`;
        message += `Nama: ${name}\n`;
        message += `No. HP: ${phone}\n`;
        message += `Alamat: ${mapsLink}\n`;
        if (notes) {
            message += `Catatan: ${notes}\n`;
        }
        message += `Metode Pembayaran: ${payment === 'cod' ? 'COD' : 'Transfer Bank'}\n\n`;

        message += `DETAIL PESANAN:\n`;
        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name}`;
            if (item.variant) {
                message += ` (${item.variant})`;
            }
            message += ` - ${item.quantity} x ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}\n`;
        });

        message += `\n\nRINCIAN BIAYA:\n`;
        message += `Subtotal: ${formatPrice(subtotal)}\n`;
        message += `Biaya Pengiriman: ${formatPrice(shipping)}\n`;
        message += `Total: ${formatPrice(total)}\n\n`;

        message += `Mohon konfirmasi pesanan ini. Terima kasih!`;

        // Encode message for WhatsApp
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/62895700341213?text=${encodedMessage}`;

        // Open WhatsApp
        window.open(whatsappUrl, '_blank');

        // Clear cart after order
        localStorage.removeItem('shoppingCart');
        updateCartCount();

        // Redirect to home or show success message
        alert('Pesanan telah dikirim via WhatsApp. Terima kasih!');
        window.location.href = '../index.html';
    });
}

// Map and shipping calculation functions
function initializeMap() {
    // Initialize map centered on Lubuklinggau
    map = L.map('shipping-map').setView([-3.2947, 102.8617], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add click event to set destination
    map.on('click', function(e) {
        setDestinationFromMap(e.latlng.lat, e.latlng.lng);
    });

    // Add address input listener
    const addressInput = document.getElementById('address');
    addressInput.addEventListener('input', debounce(geocodeAddress, 1000));
}

function loadRestaurants() {
    fetch('../data/resto.json')
        .then(response => response.json())
        .then(data => {
            restaurants = data;
            const select = document.getElementById('restaurant-select');
            const cart = getCart();

            // Get restaurants that have items in cart
            const cartRestaurants = getRestaurantsFromCart(cart);

            // Clear existing markers
            restaurantMarkers.forEach(item => {
                map.removeLayer(item.marker);
            });
            restaurantMarkers = [];

            // Only show markers for restaurants in cart
            cartRestaurants.forEach(restaurant => {
                // Add marker to map
                const marker = L.marker([restaurant.latitude, restaurant.longitude])
                    .addTo(map)
                    .bindPopup(`<b>${restaurant.name}</b><br>${restaurant.address}`);

                restaurantMarkers.push({
                    id: restaurant.id,
                    marker: marker,
                    restaurant: restaurant
                });
            });

            // Populate dropdown with cart restaurants (only if select element exists)
            if (select) {
                select.innerHTML = '<option value="">Pilih restoran...</option>';
                cartRestaurants.forEach(restaurant => {
                    const option = document.createElement('option');
                    option.value = restaurant.id;
                    option.textContent = restaurant.name;
                    select.appendChild(option);
                });

                // Auto-select first restaurant if only one
                if (cartRestaurants.length === 1) {
                    select.value = cartRestaurants[0].id;
                    select.dispatchEvent(new Event('change'));
                }

                // Add change listener for restaurant selection
                select.addEventListener('change', handleRestaurantChange);
            }
        })
        .catch(error => console.error('Error loading restaurants:', error));
}

function handleRestaurantChange(e) {
    const restaurantId = parseInt(e.target.value);
    if (!restaurantId) {
        clearRoute();
        return;
    }

    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (restaurant) {
        // Center map on selected restaurant
        map.setView([restaurant.latitude, restaurant.longitude], 15);

        // Highlight selected marker
        restaurantMarkers.forEach(item => {
            if (item.id === restaurantId) {
                item.marker.openPopup();
            }
        });

        // Calculate route if destination is set
        const destinationInput = document.getElementById('address');
        if (destinationInput.value.trim()) {
            geocodeAddress();
        }
    }
}

function geocodeAddress() {
    const address = document.getElementById('address').value.trim();
    const cart = getCart();
    const cartRestaurants = getRestaurantsFromCart(cart);

    if (!address || cartRestaurants.length === 0) {
        clearRoute();
        return;
    }

    // Use the first restaurant from cart for shipping calculation
    const selectedRestaurant = cartRestaurants[0];
    const restaurantSelect = document.getElementById('restaurant-select');

    // Auto-select the restaurant if not already selected (only if element exists)
    if (restaurantSelect && !restaurantSelect.value) {
        restaurantSelect.value = selectedRestaurant.id;
    }

    // Use Nominatim API for geocoding
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ', Lubuklinggau, Indonesia')}&limit=1`;

    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);

                // Remove previous destination marker
                if (destinationMarker) {
                    map.removeLayer(destinationMarker);
                }

                // Add new destination marker
                destinationMarker = L.marker([lat, lon], {
                    icon: L.icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    }),
                    draggable: true
                })
                .addTo(map)
                .bindPopup(`<b>Tujuan Pengiriman</b><br>${address}`);

                // Add drag event listener to update route and address
                destinationMarker.on('dragend', function(event) {
                    const marker = event.target;
                    const position = marker.getLatLng();
                    updateMarkerPosition(position.lat, position.lng);
                });

                // Calculate route and distance using the first cart restaurant
                calculateRoute(selectedRestaurant.id, lat, lon);
            } else {
                console.warn('Address not found');
                clearRoute();
            }
        })
        .catch(error => {
            console.error('Geocoding error:', error);
            clearRoute();
        });
}

function calculateRoute(restaurantId, destLat, destLon) {
    const restaurant = restaurants.find(r => r.id === parseInt(restaurantId));
    if (!restaurant) return;

    const originLat = restaurant.latitude;
    const originLon = restaurant.longitude;

    // Remove existing routing control
    if (routingControl) {
        map.removeControl(routingControl);
    }

    // Create new routing control with waypoints
    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(originLat, originLon),
            L.latLng(destLat, destLon)
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        createMarker: function() { return null; }, // Don't create default markers
        lineOptions: {
            styles: [{ color: 'blue', weight: 4, opacity: 0.7 }]
        },
        show: false, // Hide the routing instructions panel
        collapsible: false
    }).addTo(map);

    // Listen for route found event to get actual distance
    routingControl.on('routesfound', function(e) {
        const routes = e.routes;
        if (routes && routes.length > 0) {
            const route = routes[0];
            const distanceKm = route.summary.totalDistance / 1000; // Convert meters to km

            // Calculate shipping cost using the same logic as calculator.html
            // Base pricing: Rp 10,000 for first 3 km, Rp 2,500 per km after
            let basePrice = 10000; // 3 km pertama
            let additionalDistance = Math.max(0, distanceKm - 3);
            let distanceCost = basePrice + (additionalDistance * 2500);

            // Check if cart has items from multiple restaurants
            const cart = getCart();
            const cartRestaurants = getRestaurantsFromCart(cart);
            let multiRestaurantSurcharge = 0;

            if (cartRestaurants.length > 1) {
                multiRestaurantSurcharge = 2000; // Rp 2,000 for orders from different restaurants
            }

            // For checkout, we assume food delivery service (multiplier = 1)
            // No weight cost since we don't have weight input in checkout
            let shippingCost = distanceCost + multiRestaurantSurcharge;

            // Update UI
            document.getElementById('distance').textContent = distanceKm.toFixed(1);
            document.getElementById('calculated-shipping').textContent = formatPrice(shippingCost);
            document.getElementById('distance-info').style.display = 'block';

            // Update totals
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            updateTotals(subtotal);
        }
    });

    // Fit map to show the route
    const bounds = L.latLngBounds([
        [originLat, originLon],
        [destLat, destLon]
    ]);
    map.fitBounds(bounds, {padding: [20, 20]});
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function clearRoute() {
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }
    if (destinationMarker) {
        map.removeLayer(destinationMarker);
        destinationMarker = null;
    }
    document.getElementById('distance-info').style.display = 'none';
    document.getElementById('calculated-shipping').textContent = 'Rp 0';

    // Reset to default shipping
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    updateTotals(subtotal);
}

// Set destination from map click
function setDestinationFromMap(lat, lng) {
    const cart = getCart();
    const cartRestaurants = getRestaurantsFromCart(cart);

    if (cartRestaurants.length === 0) {
        return;
    }

    // Use the first restaurant from cart for shipping calculation
    const selectedRestaurant = cartRestaurants[0];
    const restaurantSelect = document.getElementById('restaurant-select');

    // Auto-select the restaurant if not already selected (only if element exists)
    if (restaurantSelect && !restaurantSelect.value) {
        restaurantSelect.value = selectedRestaurant.id;
    }

    // Remove previous destination marker
    if (destinationMarker) {
        map.removeLayer(destinationMarker);
    }

    // Add new destination marker
    destinationMarker = L.marker([lat, lng], {
        icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        }),
        draggable: true
    })
    .addTo(map)
    .bindPopup(`<b>Tujuan Pengiriman</b><br>Loading address...`);

    // Add drag event listener to update route and address
    destinationMarker.on('dragend', function(event) {
        const marker = event.target;
        const position = marker.getLatLng();
        updateMarkerPosition(position.lat, position.lng);
    });

    // Reverse geocode to get address (using CORS proxy for localhost)
    const reverseGeocodeUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)}`;

    fetch(reverseGeocodeUrl)
        .then(response => response.json())
        .then(proxyData => {
            // Extract the actual API response from the proxy
            const data = proxyData.contents ? JSON.parse(proxyData.contents) : proxyData;

            let address = 'Unknown location';
            if (data && data.display_name) {
                // Extract relevant address parts
                const addressParts = [];
                if (data.address) {
                    if (data.address.road) addressParts.push(data.address.road);
                    if (data.address.suburb) addressParts.push(data.address.suburb);
                    if (data.address.city) addressParts.push(data.address.city);
                    else if (data.address.town) addressParts.push(data.address.town);
                    else if (data.address.village) addressParts.push(data.address.village);
                }
                if (addressParts.length > 0) {
                    address = addressParts.join(', ');
                } else {
                    address = data.display_name.split(',')[0]; // Fallback to first part
                }
            }

            // Update address input
            document.getElementById('address').value = address;

            // Update marker popup
            destinationMarker.bindPopup(`<b>Tujuan Pengiriman</b><br>${address}`);

            // Calculate route and distance
            calculateRoute(selectedRestaurant.id, lat, lng);
        })
        .catch(error => {
            console.error('Reverse geocoding error:', error);
            // Fallback to coordinates
            const coordAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            document.getElementById('address').value = coordAddress;
            destinationMarker.bindPopup(`<b>Tujuan Pengiriman</b><br>${coordAddress}`);
            calculateRoute(selectedRestaurant.id, lat, lng);
        });
}

// Update marker position when dragged
function updateMarkerPosition(lat, lng) {
    const cart = getCart();
    const cartRestaurants = getRestaurantsFromCart(cart);

    if (cartRestaurants.length === 0) {
        return;
    }

    // Use the first restaurant from cart for shipping calculation
    const selectedRestaurant = cartRestaurants[0];

    // Reverse geocode to get address (using CORS proxy for localhost)
    const reverseGeocodeUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)}`;

    fetch(reverseGeocodeUrl)
        .then(response => response.json())
        .then(proxyData => {
            // Extract the actual API response from the proxy
            const data = proxyData.contents ? JSON.parse(proxyData.contents) : proxyData;

            let address = 'Unknown location';
            if (data && data.display_name) {
                // Extract relevant address parts
                const addressParts = [];
                if (data.address) {
                    if (data.address.road) addressParts.push(data.address.road);
                    if (data.address.suburb) addressParts.push(data.address.suburb);
                    if (data.address.city) addressParts.push(data.address.city);
                    else if (data.address.town) addressParts.push(data.address.town);
                    else if (data.address.village) addressParts.push(data.address.village);
                }
                if (addressParts.length > 0) {
                    address = addressParts.join(', ');
                } else {
                    address = data.display_name.split(',')[0]; // Fallback to first part
                }
            }

            // Update address input
            document.getElementById('address').value = address;

            // Update marker popup
            destinationMarker.bindPopup(`<b>Tujuan Pengiriman</b><br>${address}`).openPopup();

            // Recalculate route and distance
            calculateRoute(selectedRestaurant.id, lat, lng);
        })
        .catch(error => {
            console.error('Reverse geocoding error:', error);
            // Fallback to coordinates
            const coordAddress = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            document.getElementById('address').value = coordAddress;
            destinationMarker.bindPopup(`<b>Tujuan Pengiriman</b><br>${coordAddress}`).openPopup();
            calculateRoute(selectedRestaurant.id, lat, lng);
        });
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
