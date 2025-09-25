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

// Loading System
class LoadingManager {
    constructor() {
        this.init();
    }

    init() {
        this.createLoadingOverlay();
        this.setupSectionNavigation();
        this.setupPageNavigation();
    }

    createLoadingOverlay() {
        // Create loading overlay if it doesn't exist
        if (!document.getElementById('loading-overlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-content">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">Memuat...</div>
                </div>
            `;
            document.body.appendChild(overlay);
        }
    }

    showLoading(duration = 800) {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Auto hide after duration
            setTimeout(() => {
                this.hideLoading();
            }, duration);
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    setupSectionNavigation() {
        // Handle smooth scrolling with loading for section navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();

                // Show loading
                this.showLoading(600);

                const targetElement = document.querySelector(href);
                if (targetElement) {
                    // Scroll to target after a short delay
                    setTimeout(() => {
                        const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                        const targetPosition = targetElement.offsetTop - headerHeight;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });

                        // Update URL without jumping
                        if (history.pushState) {
                            history.pushState(null, null, href);
                        }
                    }, 300);
                }
            });
        });
    }

    setupPageNavigation() {
        // Handle page navigation with loading
        document.querySelectorAll('a[href$=".html"]').forEach(link => {
            link.addEventListener('click', (e) => {
                // Only handle internal links (same domain)
                const href = link.getAttribute('href');
                if (href && !href.startsWith('http') && !href.startsWith('//')) {
                    e.preventDefault();

                    // Show loading
                    this.showLoading(1200);

                    // Navigate after loading animation
                    setTimeout(() => {
                        window.location.href = href;
                    }, 600);
                }
            });
        });
    }
}

// Initialize loading system when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const loadingManager = new LoadingManager();
});

// Smooth scrolling for navigation links (backup method)
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

// Testimonials Story Navigation
document.addEventListener('DOMContentLoaded', function() {
    const storyDots = document.querySelectorAll('.story-dot');
    const storyCards = document.querySelectorAll('.story-card');

    if (storyDots.length > 0 && storyCards.length > 0) {
        storyDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                // Remove active class from all dots and cards
                storyDots.forEach(d => d.classList.remove('active'));
                storyCards.forEach(card => card.style.display = 'none');

                // Add active class to clicked dot and show corresponding card
                this.classList.add('active');
                if (storyCards[index]) {
                    storyCards[index].style.display = 'block';
                    // Add animation when showing card
                    storyCards[index].style.animation = 'fadeInScale 0.3s ease-out';
                }
            });
        });

        // Show first story by default
        storyCards.forEach((card, index) => {
            if (index === 0) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Add click animation to story reactions
    const reactions = document.querySelectorAll('.reaction');
    reactions.forEach(reaction => {
        reaction.addEventListener('click', function(e) {
            e.preventDefault();

            // Add a temporary animation class
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);

            // Simulate reaction count increase
            const countText = this.textContent.match(/\d+/);
            if (countText) {
                const currentCount = parseInt(countText[0]);
                this.innerHTML = this.innerHTML.replace(/\d+/, currentCount + 1);
            }
        });
    });

    // Auto-scroll through stories (optional)
    let currentStory = 0;
    const autoScrollInterval = setInterval(() => {
        if (storyDots.length > 1) {
            storyDots[currentStory].classList.remove('active');
            currentStory = (currentStory + 1) % storyDots.length;
            storyDots[currentStory].classList.add('active');
        }
    }, 5000); // Change story every 5 seconds

    // Pause auto-scroll on hover
    const storiesContainer = document.querySelector('.stories-container');
    if (storiesContainer) {
        storiesContainer.addEventListener('mouseenter', () => {
            clearInterval(autoScrollInterval);
        });
    }

    // Add keyboard navigation for stories
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' && currentStory > 0) {
            storyDots[currentStory].classList.remove('active');
            currentStory--;
            storyDots[currentStory].classList.add('active');
        } else if (e.key === 'ArrowRight' && currentStory < storyDots.length - 1) {
            storyDots[currentStory].classList.remove('active');
            currentStory++;
            storyDots[currentStory].classList.add('active');
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

    // Check if map is already initialized to prevent multiple initializations
    if (mapElement._leaflet_id) {
        console.log('Map already initialized, skipping...');
        return;
    }

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
});

// Add smooth scroll to top button functionality
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        );

        // Show button when scrolling down
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
    }
});

// PWA Install Prompt
document.addEventListener('DOMContentLoaded', function() {
    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js', { scope: '/sw.js' })
            .then(registration => {
                console.log('Service Worker registered successfully:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }

    let deferredPrompt;
    const installPopup = document.getElementById('pwa-install-popup');
    const installBtn = document.getElementById('pwa-install-btn');
    const closeBtn = document.getElementById('pwa-close-btn');

    // Create progress bar and success message elements
    const progressContainer = document.createElement('div');
    progressContainer.id = 'install-progress-container';
    progressContainer.style.display = 'none';
    progressContainer.style.textAlign = 'center';
    progressContainer.style.padding = '20px';
    progressContainer.innerHTML = `
        <div class="install-progress-bar" style="width: 100%; height: 20px; background-color: #e0e0e0; border-radius: 10px; margin: 10px 0; position: relative; overflow: hidden;">
            <div class="install-progress-fill" id="install-progress-fill" style="width: 0%; height: 100%; background-color: #2563eb; border-radius: 10px; transition: width 0.1s ease;"></div>
            <div class="install-progress-text" id="install-progress-text" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #333; font-weight: bold;">0%</div>
        </div>
        <div class="install-loading-text" style="margin-top: 10px; color: #666;">Menginstall aplikasi...</div>
    `;

    const successMessage = document.createElement('div');
    successMessage.id = 'install-success-message';
    successMessage.style.display = 'none';
    successMessage.style.textAlign = 'center';
    successMessage.style.padding = '20px';
    successMessage.innerHTML = `
        <div class="success-icon" style="font-size: 48px; color: #28a745; margin-bottom: 10px;">✓</div>
        <div class="success-text" style="font-size: 18px; color: #333; margin-bottom: 20px;">Aplikasi berhasil diinstall!</div>
        <button id="success-close-btn" class="success-close-btn" style="background-color: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px;">Tutup</button>
    `;

    if (installPopup) {
        installPopup.appendChild(progressContainer);
        installPopup.appendChild(successMessage);
    }

    // Handle success close button click
    const successCloseBtn = document.getElementById('success-close-btn');
    if (successCloseBtn) {
        successCloseBtn.addEventListener('click', () => {
            if (installPopup) {
                installPopup.style.display = 'none';
                // Clear the dismissal flag
                localStorage.removeItem('pwa-install-dismissed');
            }
        });
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return; // App is already installed, don't show popup
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;

        // Show the install popup after a short delay
        setTimeout(() => {
            if (installPopup && !localStorage.getItem('pwa-install-dismissed')) {
                installPopup.style.display = 'block';
            }
        }, 3000); // Show after 3 seconds
    });

    // Handle install button click
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                // Hide install and close buttons
                installBtn.style.display = 'none';
                if (closeBtn) closeBtn.style.display = 'none';

                // Show progress bar
                progressContainer.style.display = 'block';

                // Animate progress bar
                const progressFill = document.getElementById('install-progress-fill');
                const progressText = document.getElementById('install-progress-text');
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 2; // Increase by 2% every 50ms for 2.5 seconds
                    if (progressFill) progressFill.style.width = progress + '%';
                    if (progressText) progressText.textContent = progress + '%';
                    if (progress >= 100) {
                        clearInterval(interval);
                        // Show the install prompt after animation
                        deferredPrompt.prompt();

                        // Wait for the user to respond to the prompt
                        deferredPrompt.userChoice.then(({ outcome }) => {
                            // Reset the deferred prompt variable
                            deferredPrompt = null;

                            if (outcome === 'accepted') {
                                console.log('User accepted the install prompt');
                                // Hide progress and show success message
                                progressContainer.style.display = 'none';
                                successMessage.style.display = 'block';
                            } else {
                                console.log('User dismissed the install prompt');
                                // Hide popup
                                if (installPopup) {
                                    installPopup.style.display = 'none';
                                }
                            }
                        });
                    }
                }, 50);
            }
        });
    }

    // Handle close button click
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (installPopup) {
                installPopup.style.display = 'none';
                // Remember that user dismissed the popup for this session
                localStorage.setItem('pwa-install-dismissed', 'true');
            }
        });
    }

    // Listen for successful app installation
    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        // Hide the popup if it's still visible
        if (installPopup) {
            installPopup.style.display = 'none';
        }
        // Clear the dismissal flag
        localStorage.removeItem('pwa-install-dismissed');
    });
});

