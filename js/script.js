// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.innerHTML = navMenu.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Pricing Calculator
const calculateBtn = document.getElementById('calculate-btn');
const serviceType = document.getElementById('service-type');
const distance = document.getElementById('distance');
const weight = document.getElementById('weight');
const resultPrice = document.getElementById('result-price');
const resultDetails = document.getElementById('result-details');
const calculatorResult = document.getElementById('calculator-result');

// Function to toggle weight input visibility
function toggleWeightInput() {
    const weightContainer = document.querySelector('.weight-input-container');
    const selectedService = serviceType.value;

    // Show weight input for services that involve carrying goods
    const servicesWithWeight = ['goods', 'shopping', 'gift', 'pickup'];

    if (servicesWithWeight.includes(selectedService)) {
        weightContainer.style.display = 'flex';
    } else {
        weightContainer.style.display = 'none';
    }
}

// Function to calculate and update price automatically
function calculatePrice() {
    // Base pricing
    let basePrice = 10000; // 3 km pertama
    let distanceValue = parseFloat(distance.textContent.replace(' km', '')) || 0;
    let additionalDistance = Math.max(0, distanceValue - 3);
    let distanceCost = basePrice + (additionalDistance * 2500);

    // Additional costs
    let weightCost = 0;
    const selectedService = serviceType.value;
    const servicesWithWeight = ['goods', 'shopping', 'gift', 'pickup'];

    // Only calculate weight cost if service involves carrying goods
    if (servicesWithWeight.includes(selectedService) && weight.value > 5) {
        weightCost = (weight.value - 5) * 2000;
    }

    let waitingCost = 0;

    // Service type multiplier
    let serviceMultiplier = 1;
    switch(selectedService) {
        case 'food':
            serviceMultiplier = 1;
            break;
        case 'goods':
            serviceMultiplier = 1.2;
            break;
        case 'passenger':
            serviceMultiplier = 1.5;
            break;
        case 'shopping':
            serviceMultiplier = 1.8;
            break;
        case 'gift':
            serviceMultiplier = 1.3;
            break;
        case 'pickup':
            serviceMultiplier = 1.4;
            break;
    }

    // Calculate total cost
    let totalCost = (distanceCost + weightCost + waitingCost) * serviceMultiplier;

    // Format to Rupiah
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    });

    // Display result
    resultPrice.textContent = formatter.format(totalCost);

    // Display details with conditional weight info
    let detailsHTML = `
        <div>Jarak: ${distance.textContent}</div>
        <div>Jenis layanan: ${serviceType.options[serviceType.selectedIndex].text}</div>
    `;

    // Only show weight if service involves carrying goods
    if (servicesWithWeight.includes(selectedService)) {
        detailsHTML += `<div>Berat: ${weight.value} kg</div>`;
    }

    resultDetails.innerHTML = detailsHTML;
    calculatorResult.style.display = 'block';
}

// Add event listeners for automatic calculation and weight visibility (only if elements exist)
if (serviceType && weight) {
    serviceType.addEventListener('change', function() {
        toggleWeightInput();
        calculatePrice();
    });
    weight.addEventListener('input', calculatePrice);
}

// Initialize weight input visibility on page load (only if elements exist)
document.addEventListener('DOMContentLoaded', function() {
    if (serviceType) {
        toggleWeightInput();
    }
});

// Manual calculation button (optional, in case user wants to recalculate)
if (calculateBtn) {
    calculateBtn.addEventListener('click', calculatePrice);
}

// Scroll Animation for Sections
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.services, .pricing-calculator, .how-it-works, .testimonials, .cta');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Display random visitor count
    const visitorCountElement = document.getElementById('visitor-count');
    if (visitorCountElement) {
        const randomCount = Math.floor(Math.random() * 1000) + 1; // Random number between 1 and 1000
        visitorCountElement.textContent = randomCount.toLocaleString();
    }
});

// Map initialization and functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if map element exists before initializing
    const mapElement = document.getElementById('map');
    if (!mapElement) return; // Exit if map doesn't exist on this page

    // Koordinat default LubukLinggau
    const defaultCoords = [-3.2966, 102.8618];

    // Inisialisasi peta
    const map = L.map('map').setView(defaultCoords, 13);

    // Tambahkan tile layer dari OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Tambahkan marker untuk lokasi awal dan tujuan
    let startMarker = null;
    let endMarker = null;
    let routeLine = null;

    // Tambahkan pencarian alamat
    const searchInput = document.getElementById('address-search');
    const searchButton = document.getElementById('search-button');

    // Add event listeners only if elements exist
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', searchLocation);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchLocation();
            }
        });
    }

    function searchLocation() {
        const query = searchInput.value;
        if (!query) return;

        // Gunakan Nominatim untuk geocoding
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', LubukLinggau')}&limit=1`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const result = data[0];
                    const lat = parseFloat(result.lat);
                    const lon = parseFloat(result.lon);

                    // Pindahkan peta ke lokasi yang ditemukan
                    map.setView([lat, lon], 15);

                    // Tambahkan marker jika belum ada
                    if (!startMarker) {
                        startMarker = L.marker([lat, lon], {
                            draggable: true,
                            title: "Lokasi Awal"
                        }).addTo(map);
                        startMarker.bindPopup("Lokasi Awal").openPopup();
                        updateStartLocationName(lat, lon);

                        startMarker.on('dragend', function() {
                            updateStartLocationName(startMarker.getLatLng().lat, startMarker.getLatLng().lng);
                            calculateRoute();
                        });
                    } else if (!endMarker) {
                        endMarker = L.marker([lat, lon], {
                            draggable: true,
                            title: "Lokasi Tujuan"
                        }).addTo(map);
                        endMarker.bindPopup("Lokasi Tujuan").openPopup();
                        updateEndLocationName(lat, lon);

                        endMarker.on('dragend', function() {
                            updateEndLocationName(endMarker.getLatLng().lat, endMarker.getLatLng().lng);
                            calculateRoute();
                        });

                        calculateRoute();
                    } else {
                        // Reset markers jika kedua marker sudah ada
                        map.removeLayer(startMarker);
                        map.removeLayer(endMarker);
                        if (routeLine) map.removeLayer(routeLine);

                        startMarker = L.marker([lat, lon], {
                            draggable: true,
                            title: "Lokasi Awal"
                        }).addTo(map);
                        startMarker.bindPopup("Lokasi Awal").openPopup();
                        updateStartLocationName(lat, lon);

                        startMarker.on('dragend', function() {
                            updateStartLocationName(startMarker.getLatLng().lat, startMarker.getLatLng().lng);
                            if (endMarker) calculateRoute();
                        });

                        endMarker = null;
                        document.getElementById('end-location').textContent = "Belum dipilih";
                        document.getElementById('estimated-time').textContent = "-";
                        document.getElementById('distance').textContent = "-";
                    }
                } else {
                    alert("Alamat tidak ditemukan. Silakan coba dengan kata kunci lainnya.");
                }
            })
            .catch(error => {
                console.error('Error searching location:', error);
                alert("Terjadi kesalahan saat mencari alamat.");
            });
    }

    // Tambahkan event listener untuk klik pada peta
    map.on('click', function(e) {
        if (!startMarker) {
            startMarker = L.marker(e.latlng, {
                draggable: true,
                title: "Lokasi Awal"
            }).addTo(map);
            startMarker.bindPopup("Lokasi Awal").openPopup();
            updateStartLocationName(e.latlng.lat, e.latlng.lng);

            startMarker.on('dragend', function() {
                updateStartLocationName(startMarker.getLatLng().lat, startMarker.getLatLng().lng);
                if (endMarker) calculateRoute();
            });
        } else if (!endMarker) {
            endMarker = L.marker(e.latlng, {
                draggable: true,
                title: "Lokasi Tujuan"
            }).addTo(map);
            endMarker.bindPopup("Lokasi Tujuan").openPopup();
            updateEndLocationName(e.latlng.lat, e.latlng.lng);

            endMarker.on('dragend', function() {
                updateEndLocationName(endMarker.getLatLng().lat, endMarker.getLatLng().lng);
                calculateRoute();
            });

            calculateRoute();
        } else {
            // Reset markers jika kedua marker sudah ada
            map.removeLayer(startMarker);
            map.removeLayer(endMarker);
            if (routeLine) map.removeLayer(routeLine);

            startMarker = L.marker(e.latlng, {
                draggable: true,
                title: "Lokasi Awal"
            }).addTo(map);
            startMarker.bindPopup("Lokasi Awal").openPopup();
            updateStartLocationName(e.latlng.lat, e.latlng.lng);

            startMarker.on('dragend', function() {
                updateStartLocationName(startMarker.getLatLng().lat, startMarker.getLatLng().lng);
                if (endMarker) calculateRoute();
            });

            endMarker = null;
            document.getElementById('end-location').textContent = "Belum dipilih";
            document.getElementById('estimated-time').textContent = "-";
            document.getElementById('distance').textContent = "-";
        }
    });

    // Fungsi untuk mendapatkan nama lokasi berdasarkan koordinat
    function updateStartLocationName(lat, lng) {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
            .then(response => response.json())
            .then(data => {
                if (data && data.display_name) {
                    const address = data.display_name;
                    // Ambil bagian nama jalan atau area yang lebih spesifik
                    const addressParts = address.split(',');
                    const shortAddress = addressParts.slice(0, 3).join(',');
                    document.getElementById('start-location').textContent = shortAddress;
                }
            })
            .catch(error => {
                console.error('Error getting location name:', error);
                document.getElementById('start-location').textContent = "Lokasi dipilih";
            });
    }

    function updateEndLocationName(lat, lng) {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
            .then(response => response.json())
            .then(data => {
                if (data && data.display_name) {
                    const address = data.display_name;
                    // Ambil bagian nama jalan atau area yang lebih spesifik
                    const addressParts = address.split(',');
                    const shortAddress = addressParts.slice(0, 3).join(',');
                    document.getElementById('end-location').textContent = shortAddress;
                }
            })
            .catch(error => {
                console.error('Error getting location name:', error);
                document.getElementById('end-location').textContent = "Lokasi dipilih";
            });
    }

    // Fungsi untuk menghitung rute dan jarak
    function calculateRoute() {
        if (!startMarker || !endMarker) return;

        const startLatLng = startMarker.getLatLng();
        const endLatLng = endMarker.getLatLng();

        // Gunakan OSRM untuk menghitung rute
        fetch(`https://router.project-osrm.org/route/v1/driving/${startLatLng.lng},${startLatLng.lat};${endLatLng.lng},${endLatLng.lat}?overview=full&geometries=geojson`)
            .then(response => response.json())
            .then(data => {
                if (data.routes && data.routes.length > 0) {
                    const route = data.routes[0];
                    const distanceKm = (route.distance / 1000).toFixed(1);
                    const durationMin = Math.ceil(route.duration / 60);

                    // Update input jarak
                    document.getElementById('distance').textContent = distanceKm + ' km';

                    // Update estimasi waktu
                    document.getElementById('estimated-time').textContent = `${durationMin} menit`;

                    // Hapus rute sebelumnya jika ada
                    if (routeLine) {
                        map.removeLayer(routeLine);
                    }

                    // Gambar rute baru
                    const routeCoordinates = L.geoJSON(route.geometry).getLayers()[0].getLatLngs();
                    routeLine = L.polyline(routeCoordinates, {
                        color: '#2563eb',
                        weight: 5,
                        opacity: 0.7
                    }).addTo(map);

                    // Sesuaikan zoom peta untuk menampilkan seluruh rute
                    map.fitBounds(routeLine.getBounds());
                }
            })
            .catch(error => {
                console.error('Error calculating route:', error);
                alert("Terjadi kesalahan saat menghitung rute.");
            });
    }
});
