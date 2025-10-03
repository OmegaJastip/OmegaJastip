// Admin panel JavaScript for managing restaurants
let restaurants = [];
let editingId = null;
let serviceCounter = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadRestaurants();
    setupRatingSystem();
    setupMapsLinkExtraction();
    setupPriceFormatting();
});

// Load restaurants from localStorage
function loadRestaurants() {
    const storedData = localStorage.getItem('restaurantsData');
    if (storedData) {
        restaurants = JSON.parse(storedData);
        displayRestaurants();
    } else {
        // Fallback to fetch from JSON file if localStorage empty
        fetch('../data/resto.json')
            .then(response => response.json())
            .then(data => {
                restaurants = data;
                displayRestaurants();
                saveRestaurantsToLocalStorage();
            })
            .catch(error => {
                console.error('Error loading restaurants:', error);
                alert('Error loading restaurant data');
            });
    }
}

// Save restaurants to localStorage
function saveRestaurantsToLocalStorage() {
    localStorage.setItem('restaurantsData', JSON.stringify(restaurants));
}

// Display restaurants in table
function displayRestaurants() {
    const tbody = document.getElementById('restaurants-tbody');
    tbody.innerHTML = '';

    restaurants.forEach(restaurant => {
        const servicesPreview = restaurant.services.slice(0, 2).map(s => s.name).join(', ') +
            (restaurant.services.length > 2 ? '...' : '');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="ID">${restaurant.id}</td>
            <td data-label="Image"><img src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-image"></td>
            <td data-label="Name">${restaurant.name}</td>
            <td data-label="Category">${restaurant.category}</td>
            <td data-label="Address">${restaurant.address}</td>
            <td data-label="Phone">${restaurant.phone}</td>
            <td data-label="Rating"><i class="fas fa-star"></i> ${restaurant.rating}</td>
            <td data-label="Services" class="services-preview" title="${restaurant.services.map(s => s.name).join(', ')}">${servicesPreview}</td>
            <td data-label="Actions" class="action-buttons">
                <button class="btn-edit" onclick="editRestaurant(${restaurant.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-delete" onclick="deleteRestaurant(${restaurant.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    saveRestaurantsToLocalStorage();
}

// Open add modal
function openAddModal() {
    editingId = null;
    document.getElementById('modal-title').textContent = 'Add Restaurant';
    document.getElementById('restaurant-form').reset();
    document.getElementById('services-container').innerHTML = '';
    addService(); // Add one empty service
    document.getElementById('restaurant-modal').style.display = 'block';
}

function editRestaurant(id) {
    const restaurant = restaurants.find(r => r.id === id);
    if (!restaurant) return;

    editingId = id;
    document.getElementById('modal-title').textContent = 'Edit Restaurant';

    // Fill form with restaurant data
    document.getElementById('restaurant-name').value = restaurant.name;
    document.getElementById('restaurant-category').value = restaurant.category;
    document.getElementById('restaurant-description').value = restaurant.description;
    document.getElementById('restaurant-image').value = restaurant.image;
    document.getElementById('restaurant-address').value = restaurant.address;
    document.getElementById('restaurant-phone').value = restaurant.phone;
    document.getElementById('restaurant-hours').value = restaurant.operating_hours;
    document.getElementById('restaurant-price-range').value = restaurant.price_range;
    document.getElementById('restaurant-rating').value = restaurant.rating;
    document.getElementById('delivery-available').checked = restaurant.delivery_available;
    document.getElementById('pickup-available').checked = restaurant.pickup_available;
    document.getElementById('restaurant-latitude').value = restaurant.latitude;
    document.getElementById('restaurant-longitude').value = restaurant.longitude;

    // Set rating stars
    setRatingStars(restaurant.rating);

    // Load services
    document.getElementById('services-container').innerHTML = '';
    restaurant.services.forEach(service => {
        // Handle both old and new data structures
        if (service.variants && Array.isArray(service.variants)) {
            // New structure with variants array
            addService(service.category || '', service.name, service.variants);
        } else {
            // Old structure with single variant/price
            const variants = service.price ? [{ variant: service.variant || '', price: service.price }] : [];
            addService(service.category || '', service.name, variants);
        }
    });

    document.getElementById('restaurant-modal').style.display = 'block';
}

// Delete restaurant
function deleteRestaurant(id) {
    if (confirm('Are you sure you want to delete this restaurant?')) {
        restaurants = restaurants.filter(r => r.id !== id);
        displayRestaurants();
    }
}

// Close modal
function closeModal() {
    document.getElementById('restaurant-modal').style.display = 'none';
    editingId = null;
}

// Handle form submission
document.getElementById('restaurant-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const services = getServicesFromForm();

    const restaurantData = {
        name: formData.get('name'),
        category: formData.get('category'),
        description: formData.get('description'),
        image: formData.get('image') || '../images/toko.png',
        address: formData.get('address'),
        phone: formData.get('phone'),
        operating_hours: formData.get('operating_hours'),
        price_range: formData.get('price_range'),
        rating: parseFloat(formData.get('rating')),
        delivery_available: document.getElementById('delivery-available').checked,
        pickup_available: document.getElementById('pickup-available').checked,
        latitude: parseFloat(formData.get('latitude')),
        longitude: parseFloat(formData.get('longitude')),
        services: services
    };

    if (editingId) {
        // Update existing restaurant
        const index = restaurants.findIndex(r => r.id === editingId);
        if (index !== -1) {
            restaurantData.id = editingId;
            restaurants[index] = restaurantData;
        }
    } else {
        // Add new restaurant
        const maxId = restaurants.length > 0 ? Math.max(...restaurants.map(r => r.id)) : 0;
        restaurantData.id = maxId + 1;
        restaurants.push(restaurantData);
    }

    displayRestaurants();
    saveRestaurantsToLocalStorage();
    closeModal();
});

// Get services from form
function getServicesFromForm() {
    const services = [];
    const serviceItems = document.querySelectorAll('.service-item');

    serviceItems.forEach(item => {
        const categoryInput = item.querySelector('.service-category');
        const nameInput = item.querySelector('.service-name');
        const variantItems = item.querySelectorAll('.variant-item');

        if (categoryInput.value.trim() && nameInput.value.trim()) {
            const variants = [];
            variantItems.forEach(variantItem => {
                const variantInput = variantItem.querySelector('.service-variant');
                const priceInput = variantItem.querySelector('.service-price');

                if (priceInput.value.trim()) {
                    variants.push({
                        variant: variantInput.value.trim(),
                        price: priceInput.value.trim()
                    });
                }
            });

            if (variants.length > 0) {
                services.push({
                    category: categoryInput.value.trim(),
                    name: nameInput.value.trim(),
                    variants: variants
                });
            }
        }
    });

    return services;
}

function addService(category = '', name = '', variants = []) {
    const container = document.getElementById('services-container');
    const serviceDiv = document.createElement('div');
    serviceDiv.className = 'service-item';

    let variantsHtml = '';
    if (variants.length > 0) {
        variants.forEach(variant => {
            variantsHtml += `
                <div class="variant-item">
                    <input type="text" class="service-variant" placeholder="Variant (e.g., Small)" value="${variant.variant || ''}">
                    <input type="text" class="service-price" placeholder="Price (e.g., Rp 25.000)" value="${variant.price || ''}" required>
                    <button type="button" class="btn-remove-variant" onclick="removeVariant(this)">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
            `;
        });
    } else {
        variantsHtml = `
            <div class="variant-item">
                <input type="text" class="service-variant" placeholder="Variant (e.g., Small)" value="">
                <input type="text" class="service-price" placeholder="Price (e.g., Rp 25.000)" value="" required>
                <button type="button" class="btn-remove-variant" onclick="removeVariant(this)">
                    <i class="fas fa-minus"></i>
                </button>
            </div>
        `;
    }

    serviceDiv.innerHTML = `
        <div class="service-header">
            <input type="text" class="service-category" placeholder="Category" value="${category}" required>
            <input type="text" class="service-name" placeholder="Service name" value="${name}" required>
            <button type="button" class="btn-remove-service" onclick="removeService(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="variants-container">
            ${variantsHtml}
        </div>
        <button type="button" class="btn-add-variant" onclick="addVariant(this)">
            <i class="fas fa-plus"></i> Add Variant
        </button>
    `;
    container.appendChild(serviceDiv);
}

// Remove service
function removeService(button) {
    button.parentElement.parentElement.remove();
}

// Add variant to a service
function addVariant(button) {
    const serviceItem = button.parentElement;
    const variantsContainer = serviceItem.querySelector('.variants-container');

    const variantDiv = document.createElement('div');
    variantDiv.className = 'variant-item';
    variantDiv.innerHTML = `
        <input type="text" class="service-variant" placeholder="Variant (e.g., Small)" value="">
        <input type="text" class="service-price" placeholder="Price (e.g., Rp 25.000)" value="" required>
        <button type="button" class="btn-remove-variant" onclick="removeVariant(this)">
            <i class="fas fa-minus"></i>
        </button>
    `;
    variantsContainer.appendChild(variantDiv);
}

// Remove variant
function removeVariant(button) {
    const variantsContainer = button.parentElement.parentElement;
    const variantItems = variantsContainer.querySelectorAll('.variant-item');

    // Keep at least one variant
    if (variantItems.length > 1) {
        button.parentElement.remove();
    } else {
        alert('At least one variant is required.');
    }
}

// Setup rating system
function setupRatingSystem() {
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('restaurant-rating');
    const ratingText = document.getElementById('rating-text');

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating);
            setRatingStars(rating);
            ratingInput.value = rating;
            ratingText.textContent = rating + '.0';
        });
    });
}

// Set rating stars
function setRatingStars(rating) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Export data as JSON
function exportData() {
    const jsonOutput = document.getElementById('json-output');
    const jsonData = JSON.stringify(restaurants, null, 2);
    jsonOutput.value = jsonData;

    // Copy to clipboard
    navigator.clipboard.writeText(jsonData).then(() => {
        console.log('JSON copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        // Fallback for older browsers
        jsonOutput.select();
        document.execCommand('copy');
    });

    // Create a blob of the data
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link to trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'restaurants_data.json';
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('JSON data has been copied to clipboard and downloaded as restaurants_data.json!');
}

// Setup Google Maps link extraction
function setupMapsLinkExtraction() {
    const mapsLinkInput = document.getElementById('restaurant-maps-link');
    mapsLinkInput.addEventListener('input', (e) => {
        const link = e.target.value.trim();
        if (link) {
            extractLatLngFromMapsLink(link)
                .then(coords => {
                    document.getElementById('restaurant-latitude').value = coords.lat;
                    document.getElementById('restaurant-longitude').value = coords.lng;
                })
                .catch(err => {
                    console.error('Error extracting coordinates:', err);
                    alert('Could not extract coordinates from the link. Please enter manually.');
                });
        }
    });
}

// Extract latitude and longitude from Google Maps link
function extractLatLngFromMapsLink(link) {
    // Directly parse the provided link for coordinates using regex
    const match = link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
        return Promise.resolve({ lat: parseFloat(match[1]), lng: parseFloat(match[2]) });
    } else {
        return Promise.reject(new Error('Coordinates not found in URL. Please provide the full Google Maps URL containing @lat,lng.'));
    }
}

// Setup price formatting for inputs
function setupPriceFormatting() {
    // Format price range input (e.g., "15000-35000" -> "Rp 15.000 - Rp 35.000")
    const priceRangeInput = document.getElementById('restaurant-price-range');
    if (priceRangeInput) {
        priceRangeInput.addEventListener('input', formatPriceRange);
        priceRangeInput.addEventListener('blur', formatPriceRange);
    }

    // Format service price inputs (e.g., "25000" -> "Rp 25.000")
    // Use event delegation for dynamically added service price inputs
    const servicesContainer = document.getElementById('services-container');
    if (servicesContainer) {
        servicesContainer.addEventListener('input', function(e) {
            if (e.target.classList.contains('service-price')) {
                formatServicePrice(e.target);
            }
        });
        servicesContainer.addEventListener('blur', function(e) {
            if (e.target.classList.contains('service-price')) {
                formatServicePrice(e.target);
            }
        });
    }
}

// Format price range input
function formatPriceRange(e) {
    const input = e.target;
    let value = input.value.replace(/[^\d\-]/g, ''); // Remove non-digits except dash

    if (value) {
        const parts = value.split('-');
        if (parts.length === 2) {
            const minPrice = parts[0].replace(/\D/g, '');
            const maxPrice = parts[1].replace(/\D/g, '');
            if (minPrice && maxPrice) {
                input.value = `Rp ${formatNumber(minPrice)} - Rp ${formatNumber(maxPrice)}`;
            }
        } else if (parts.length === 1) {
            const price = parts[0].replace(/\D/g, '');
            if (price) {
                input.value = `Rp ${formatNumber(price)}`;
            }
        }
    }
}

// Format service price input
function formatServicePrice(input) {
    let value = input.value.replace(/[^\d]/g, ''); // Remove non-digits
    if (value) {
        input.value = `Rp ${formatNumber(value)}`;
    }
}

// Format number with thousand separators (Indonesian style)
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('restaurant-modal');
    if (event.target === modal) {
        closeModal();
    }
}
