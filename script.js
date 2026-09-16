
document.addEventListener('DOMContentLoaded', () => {
    // Hafıza Kontrolü ve inStock Alanı Kontrolü
    let savedProducts = localStorage.getItem('yummy_products');
    
    if (!savedProducts || JSON.parse(savedProducts).length === 0) {
        localStorage.setItem('yummy_products', JSON.stringify(window.initialMenuProducts));
    } else {
        // Eski kaydedilmiş verilerde inStock değeri yoksa otomatik olarak true ekleyelim
        let parsed = JSON.parse(savedProducts);
        let updated = false;
        parsed = parsed.map(p => {
            if (p.inStock === undefined) {
                p.inStock = true;
                updated = true;
            }
            return p;
        });
        if (updated) {
            localStorage.setItem('yummy_products', JSON.stringify(parsed));
        }
    }

    // Intro Butonu
    const enterBtn = document.getElementById('enter-btn');
    const introOverlay = document.getElementById('intro-overlay');
    const mainContent = document.getElementById('main-content');

    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            introOverlay.style.opacity = '0';
            introOverlay.style.transition = 'opacity 0.6s ease';
            setTimeout(() => {
                introOverlay.classList.add('hidden');
                mainContent.classList.remove('hidden');
            }, 600);
        });
    }

    // Modal ve Kategori Tıklamaları
    const categoryItems = document.querySelectorAll('.cat-item');
    const modal = document.getElementById('category-modal');
    const modalTitle = document.getElementById('modal-category-title');
    const modalProductsList = document.getElementById('modal-products-list');
    const closeModalBtn = document.getElementById('close-modal');

    if (categoryItems.length > 0) {
        categoryItems.forEach(item => {
            item.addEventListener('click', () => {
                const categoryName = item.getAttribute('data-title');
                openCategory(categoryName);
            });
        });
    }

    function openCategory(categoryName) {
        if (!modalTitle || !modalProductsList) return;
        modalTitle.textContent = categoryName;
        modalProductsList.innerHTML = '';

        const allProducts = JSON.parse(localStorage.getItem('yummy_products')) || window.initialMenuProducts;
        const filtered = allProducts.filter(p => p.category === categoryName);

        if (filtered.length === 0) {
            modalProductsList.innerHTML = '<p style="text-align:center; color:#888; padding:20px;">Bu kategoride ürün bulunamadı.</p>';
        } else {
            filtered.forEach(p => {
                // Stok Durumu Kontrolü (varsayılan: true)
                const isOutOfStock = p.inStock === false;

                const card = `
                    <div class="product-item-card ${isOutOfStock ? 'out-of-stock' : ''}">
                        <img src="${p.image}" alt="${p.title}" class="product-card-img" loading="lazy">
                        <div class="product-card-info">
                            <h4>${p.title}</h4>
                            <p class="product-card-desc">${p.description || ''}</p>
                            <span class="product-card-price">${p.price} ₺</span>
                        </div>
                        ${isOutOfStock ? '<span class="out-of-stock-badge">TÜKENDİ</span>' : ''}
                    </div>
                `;
                modalProductsList.insertAdjacentHTML('beforeend', card);
            });
        }
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Arka planın kaymasını engelle
    }

    function closeModal() {
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = ''; // Scroll'u tekrar aç
        }
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Canvas Parçacık Animasyonu
    const canvas = document.getElementById('sparkle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let particles = Array.from({length: 40}, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedY: Math.random() * 0.4 + 0.1,
            opacity: Math.random() * 0.8 + 0.2
        }));

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.y -= p.speedY;
                if (p.y < 0) p.y = canvas.height;
                ctx.fillStyle = `rgba(255, 215, 0, ${p.opacity})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            requestAnimationFrame(draw);
        }
        draw();
    }
});