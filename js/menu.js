// JavaScript for pages/menu.html to load and display restaurant menu based on query param id

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('id');

    if (!restaurantId) {
        document.getElementById('menu-content').innerHTML = '<p>Restoran tidak ditemukan. ID restoran tidak diberikan.</p>';
        return;
    }

    loadRestaurantMenu(parseInt(restaurantId));
});

async function loadRestaurantMenu(id) {
    try {
        const response = await fetch('../data/resto.json');
        const restaurants = await response.json();

        const restaurant = restaurants.find(r => r.id === id);
        if (!restaurant) {
            document.getElementById('menu-content').innerHTML = '<p>Restoran tidak ditemukan.</p>';
            return;
        }

        document.getElementById('restaurant-name').textContent = restaurant.name;

        // Build menu HTML grouped by category
        const menuByCategory = {};
        if (restaurant.menu && restaurant.menu.length > 0) {
            restaurant.menu.forEach(item => {
                if (!menuByCategory[item.category]) {
                    menuByCategory[item.category] = [];
                }
                menuByCategory[item.category].push(item);
            });
        }

        let menuHtml = '';
        for (const category in menuByCategory) {
            menuHtml += `<h3>${category}</h3><ul class="menu-category-list">`;
            menuByCategory[category].forEach(item => {
                menuHtml += `<li>
                    <span class="menu-item-name">${item.name}</span>
                    <span class="menu-item-price">${item.price}</span>
                </li>`;
                if (item.variants && item.variants.length > 0) {
                    menuHtml += '<ul class="menu-variants-list">';
                    item.variants.forEach(variant => {
                        menuHtml += `<li class="menu-variant-item">
                            <span class="variant-name">${variant.name}</span>
                            <span class="variant-price">${variant.price}</span>
                        </li>`;
                    });
                    menuHtml += '</ul>';
                }
            });
            menuHtml += '</ul>';
        }

        document.getElementById('menu-content').innerHTML = menuHtml;

        // Update WhatsApp order link with restaurant name
        const orderBtn = document.getElementById('order-btn');
        orderBtn.href = `https://wa.me/62895700341213?text=Halo, saya mau pesan dari ${encodeURIComponent(restaurant.name)}`;

    } catch (error) {
        console.error('Error loading restaurant menu:', error);
        document.getElementById('menu-content').innerHTML = '<p>Terjadi kesalahan saat memuat menu restoran.</p>';
    }
}
