// État global de l'application
const appState = {
    products: [],
    filteredProducts: [],
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    filters: {
        categories: new Set(),
        maxPrice: 1000000,
        sellers: new Set(['BDS FASHION', 'BDS TECH'])
    },
    sortBy: 'featured',
    currentPage: 1,
    productsPerPage: 12
};

// Éléments du DOM
const DOM = {
    productGrid: document.getElementById('productGrid'),
    searchInput: document.getElementById('searchInput'),
    categoryTags: document.querySelectorAll('.category-tag'),
    filterToggle: document.querySelector('.filter-toggle'),
    filtersSidebar: document.querySelector('.filters-sidebar'),
    applyFiltersBtn: document.querySelector('.apply-filters'),
    sortSelect: document.getElementById('sort'),
    priceRange: document.getElementById('priceRange'),
    maxPriceEl: document.getElementById('maxPrice'),
    pagination: document.querySelector('.pagination'),
    prevPageBtn: document.querySelector('.prev-page'),
    nextPageBtn: document.querySelector('.next-page'),
    currentPageEl: document.querySelector('.current-page'),
    totalPagesEl: document.querySelector('.total-pages'),
    cartCount: document.querySelector('.cart-count'),
    cartCountFloating: document.querySelector('.cart-count-floating'),
    cartFloating: document.querySelector('.cart-floating')
};

// Initialisation de l'application
async function initApp() {
    await fetchProducts();
    setupEventListeners();
    applyFilters();
    updateCartCount();
}

// Récupérer les produits depuis le fichier JSON
async function fetchProducts() {
    try {
        const response = await fetch('../data/products.json');
        const data = await response.json();
        appState.products = data.products;
        appState.filteredProducts = [...appState.products];
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        // Utiliser des données par défaut en cas d'erreur
        appState.products = getDefaultProducts();
        appState.filteredProducts = [...appState.products];
    }
}

// Données de produits par défaut
function getDefaultProducts() {
    return [
        {
            id: 1,
            name: "Abaya élégante noire brodée",
            category: "Abayas",
            price: 29900,
            oldPrice: 34900,
            discount: 15,
            rating: 4.5,
            reviews: 24,
            images: ["images/products/abayas/im2.jpg"],
            sizes: ["S", "M", "L", "XL"],
            colors: ["Noir", "Bleu nuit", "Bordeaux"],
            description: "Abaya élégante en tissu fluide avec broderies dorées. Coupe ajustée avec capuche amovible.",
            stock: 15,
            seller: "BDS FASHION",
            shipping: "Livraison gratuite"
        },
        {
            id: 2,
            name: "Costume homme classique bleu marine",
            category: "Vêtements Homme",
            price: 49900,
            oldPrice: 59900,
            discount: 17,
            rating: 4.8,
            reviews: 56,
            images: ["images/products/men/im2.jpg"],
            sizes: ["M", "L", "XL", "XXL"],
            colors: ["Bleu marine", "Noir", "Anthracite"],
            description: "Costume 3 pièces en laine peignée. Veste ajustée, pantalon droit, gilet assorti.",
            stock: 8,
            seller: "BDS FASHION",
            shipping: "Livraison gratuite"
        },
        {
            id: 3,
            name: "Ordinateur portable HP 15s",
            category: "Ordinateurs",
            price: 549900,
            oldPrice: 599900,
            discount: 8,
            rating: 4.7,
            reviews: 132,
            images: ["images/products/computers/im3.jpeg"],
            specs: {
                processeur: "Intel Core i5 11e gén",
                ram: "8 Go",
                stockage: "512 Go SSD",
                écran: "15.6\" FHD"
            },
            stock: 5,
            seller: "BDS TECH",
            shipping: "Livraison gratuite",
            warranty: "2 ans"
        },
        {
            id: 4,
            name: "Montre connectée Huawei Watch GT 3",
            category: "Montres",
            price: 129900,
            oldPrice: 149900,
            discount: 13,
            rating: 4.6,
            reviews: 89,
            images: ["images/products/watches/im3.jpeg"],
            colors: ["Noir", "Argent", "Or"],
            description: "Montre connectée avec écran AMOLED 1.43\", suivi d'activité, moniteur de fréquence cardiaque et 14 jours d'autonomie.",
            stock: 12,
            seller: "BDS TECH",
            shipping: "Livraison gratuite",
            warranty: "1 an"
        }
    ];
}

// Configurer les écouteurs d'événements
function setupEventListeners() {
    // Barre de recherche
    if (DOM.searchInput) {
        DOM.searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Filtres par catégorie
    document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });
    
    // Prix maximum
    if (DOM.priceRange) {
        DOM.priceRange.addEventListener('input', e => {
            if (DOM.maxPriceEl) {
                DOM.maxPriceEl.textContent = formatPrice(e.target.value);
            }
        });
    }
    
    // Appliquer les filtres
    if (DOM.applyFiltersBtn) {
        DOM.applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    // Trier les produits
    if (DOM.sortSelect) {
        DOM.sortSelect.addEventListener('change', e => {
            appState.sortBy = e.target.value;
            applyFilters();
        });
    }
    
    // Navigation entre les pages
    if (DOM.prevPageBtn) {
        DOM.prevPageBtn.addEventListener('click', () => changePage(-1));
    }
    if (DOM.nextPageBtn) {
        DOM.nextPageBtn.addEventListener('click', () => changePage(1));
    }
    
    // Panier flottant
    if (DOM.cartFloating) {
        DOM.cartFloating.addEventListener('click', showCart);
    }
    
    // Catégories rapides
    document.querySelectorAll('.category-tag').forEach(tag => {
        tag.addEventListener('click', e => {
            e.preventDefault();
            const category = e.target.dataset.category;
            if (category === 'all') {
                document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(cb => {
                    cb.checked = true;
                });
            } else {
                const checkbox = document.querySelector(`.filter-options input[value="${category}"]`);
                if (checkbox) checkbox.checked = true;
            }
            applyFilters();
        });
    });
}

// Fonction utilitaire pour le debounce
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

// Gérer la recherche
function handleSearch() {
    applyFilters();
}

// Gérer les changements de filtre
function handleFilterChange() {
    // Cette fonction est appelée à chaque changement de filtre
    // On pourrait ajouter une logique de prévisualisation ici
}

// Appliquer les filtres et trier les produits
function applyFilters() {
    // Récupérer les filtres actifs
    const activeCategories = Array.from(document.querySelectorAll('.filter-options input[name="category"]:checked'))
        .map(cb => cb.value);
    const activeSellers = Array.from(document.querySelectorAll('.filter-options input[name="seller"]:checked'))
        .map(cb => cb.value);
    const maxPrice = DOM.priceRange ? parseInt(DOM.priceRange.value) : 1000000;
    const searchTerm = DOM.searchInput ? DOM.searchInput.value.toLowerCase() : '';
    
    // Filtrer les produits
    appState.filteredProducts = appState.products.filter(product => {
        const matchesCategory = activeCategories.length === 0 || activeCategories.includes(product.category);
        const matchesSeller = activeSellers.length === 0 || activeSellers.includes(product.seller);
        const matchesPrice = product.price <= maxPrice;
        const matchesSearch = searchTerm === '' || 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);
            
        return matchesCategory && matchesSeller && matchesPrice && matchesSearch;
    });
    
    // Trier les produits
    sortProducts();
    
    // Réinitialiser à la première page
    appState.currentPage = 1;
    
    // Mettre à jour l'affichage
    renderProducts();
    updatePagination();
}

// Trier les produits selon le critère sélectionné
function sortProducts() {
    const { sortBy } = appState;
    
    appState.filteredProducts.sort((a, b) => {
        switch (sortBy) {
            case 'price_asc':
                return a.price - b.price;
            case 'price_desc':
                return b.price - a.price;
            case 'newest':
                return new Date(b.addedDate || 0) - new Date(a.addedDate || 0);
            case 'rating':
                return b.rating - a.rating;
            case 'featured':
            default:
                // Par défaut, on garde l'ordre d'origine ou on trie par popularité
                return (b.views || 0) - (a.views || 0) || b.rating - a.rating;
        }
    });
}

// Afficher les produits
function renderProducts() {
    if (!DOM.productGrid) return;
    
    const startIndex = (appState.currentPage - 1) * appState.productsPerPage;
    const paginatedProducts = appState.filteredProducts.slice(
        startIndex, 
        startIndex + appState.productsPerPage
    );
    
    if (paginatedProducts.length === 0) {
        DOM.productGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Aucun produit trouvé</h3>
                <p>Essayez de modifier vos filtres ou votre recherche.</p>
            </div>
        `;
        return;
    }
    
    DOM.productGrid.innerHTML = paginatedProducts.map(product => `
        <div class="product-card">
            ${product.discount ? `<span class="product-badge">-${product.discount}%</span>` : ''}
            <img src="${product.images[0]}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                
                <div class="product-rating">
                    <div class="stars">
                        ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price)} FCFA</span>
                    ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ''}
                    ${product.discount ? `<span class="discount">-${product.discount}%</span>` : ''}
                </div>
                
                <div class="product-actions">
                    <button class="btn-add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Ajouter
                    </button>
                    <button class="btn-view-details" data-id="${product.id}">
                        <i class="fas fa-eye"></i> Voir
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Ajouter les écouteurs d'événements aux boutons
    addProductEventListeners();
}

// Mettre à jour la pagination
function updatePagination() {
    if (!DOM.pagination || !DOM.prevPageBtn || !DOM.nextPageBtn || !DOM.currentPageEl || !DOM.totalPagesEl) return;
    
    const totalPages = Math.ceil(appState.filteredProducts.length / appState.productsPerPage);
    
    // Mettre à jour les boutons de navigation
    DOM.prevPageBtn.disabled = appState.currentPage === 1;
    DOM.nextPageBtn.disabled = appState.currentPage >= totalPages;
    
    // Mettre à jour les numéros de page
    DOM.currentPageEl.textContent = appState.currentPage;
    DOM.totalPagesEl.textContent = totalPages || 1;
    
    // Afficher/masquer la pagination si nécessaire
    DOM.pagination.style.display = totalPages <= 1 ? 'none' : 'flex';
}

// Changer de page
function changePage(direction) {
    const newPage = appState.currentPage + direction;
    const totalPages = Math.ceil(appState.filteredProducts.length / appState.productsPerPage);
    
    if (newPage > 0 && newPage <= totalPages) {
        appState.currentPage = newPage;
        renderProducts();
        updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Ajouter les écouteurs d'événements aux produits
function addProductEventListeners() {
    // Boutons "Ajouter au panier"
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('button').dataset.id);
            addToCart(productId);
        });
    });

    // Boutons "Voir détails"
    document.querySelectorAll('.btn-view-details').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('button').dataset.id);
            viewProductDetails(productId);
        });
    });
}

// Afficher les détails d'un produit
function viewProductDetails(productId) {
    const product = appState.products.find(p => p.id === productId);
    if (!product) return;
    
    // Créer la modale de détails
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <div class="product-details">
                <div class="product-gallery">
                    <div class="main-image">
                        <img src="${product.images[0]}" alt="${product.name}">
                    </div>
                    <div class="thumbnails">
                        ${product.images.map((img, index) => `
                            <img src="${img}" alt="Vue ${index + 1}" class="${index === 0 ? 'active' : ''}">
                        `).join('')}
                    </div>
                </div>
                <div class="product-info">
                    <h2>${product.name}</h2>
                    <div class="product-meta">
                        <span class="seller">Vendu par ${product.seller}</span>
                        <span class="stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                            ${product.stock > 0 ? 'En stock' : 'Rupture de stock'}
                        </span>
                        <div class="rating">
                            ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                            <span>(${product.reviews} avis)</span>
                        </div>
                    </div>
                    
                    <div class="price-container">
                        <span class="price">${formatPrice(product.price)} FCFA</span>
                        ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)} FCFA</span>` : ''}
                        ${product.discount ? `<span class="discount">-${product.discount}%</span>` : ''}
                    </div>
                    
                    ${product.colors ? `
                        <div class="color-options">
                            <label>Couleur :</label>
                            <div class="colors">
                                ${product.colors.map(color => `
                                    <span class="color-option" style="background-color: ${color.toLowerCase()}" title="${color}"></span>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${product.sizes ? `
                        <div class="size-options">
                            <label>Taille :</label>
                            <div class="sizes">
                                ${product.sizes.map(size => `
                                    <span class="size-option">${size}</span>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="quantity-selector">
                        <label>Quantité :</label>
                        <div class="quantity-controls">
                            <button class="decrease-qty">-</button>
                            <input type="number" value="1" min="1" max="${product.stock || 10}">
                            <button class="increase-qty">+</button>
                        </div>
                    </div>
                    
                    <div class="product-actions">
                        <button class="btn-add-to-cart" data-id="${product.id}">
                            <i class="fas fa-cart-plus"></i> Ajouter au panier
                        </button>
                        <button class="btn-buy-now" data-id="${product.id}">
                            Acheter maintenant
                        </button>
                    </div>
                    
                    <div class="product-description">
                        <h3>Description</h3>
                        <p>${product.description}</p>
                    </div>
                    
                    ${product.specs ? `
                        <div class="product-specs">
                            <h3>Caractéristiques techniques</h3>
                            <ul>
                                ${Object.entries(product.specs).map(([key, value]) => `
                                    <li><strong>${key}</strong>: ${value}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    <div class="shipping-info">
                        <p><i class="fas fa-truck"></i> ${product.shipping}</p>
                        ${product.warranty ? `<p><i class="fas fa-shield-alt"></i> Garantie: ${product.warranty}</p>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Ajouter la modale au DOM
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Gérer les événements de la modale
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    });
    
    // Fermer en cliquant en dehors de la modale
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }
    });
    
    // Gérer les miniatures
    const mainImage = modal.querySelector('.main-image img');
    const thumbnails = modal.querySelectorAll('.thumbnails img');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            mainImage.src = thumb.src;
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });
    
    // Gérer la quantité
    const quantityInput = modal.querySelector('.quantity-selector input');
    modal.querySelector('.decrease-qty').addEventListener('click', () => {
        if (parseInt(quantityInput.value) > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
        }
    });
    
    modal.querySelector('.increase-qty').addEventListener('click', () => {
        if (parseInt(quantityInput.value) < (product.stock || 10)) {
            quantityInput.value = parseInt(quantityInput.value) + 1;
        }
    });
    
    // Gérer l'ajout au panier depuis la modale
    const addToCartBtn = modal.querySelector('.btn-add-to-cart');
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        addToCart(product.id, quantity);
    });
    
    // Gérer l'achat immédiat
    const buyNowBtn = modal.querySelector('.btn-buy-now');
    buyNowBtn.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        addToCart(product.id, quantity);
        window.location.href = 'checkout.html';
    });
}

// Ajouter un produit au panier
function addToCart(productId, quantity = 1) {
    const product = appState.products.find(p => p.id === productId);
    if (!product) return;
    
    // Vérifier si le produit est déjà dans le panier
    const existingItem = appState.cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Vérifier le stock disponible
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > (product.stock || 10)) {
            showNotification(`Désolé, il ne reste que ${product.stock} pièces en stock.`, 'error');
            return false;
        }
        existingItem.quantity = newQuantity;
    } else {
        // Vérifier le stock disponible
        if (quantity > (product.stock || 10)) {
            showNotification(`Désolé, il ne reste que ${product.stock} pièces en stock.`, 'error');
            return false;
        }
        
        // Ajouter le produit au panier
        appState.cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: quantity,
            maxQuantity: product.stock || 10,
            seller: product.seller
        });
    }
    
    // Mettre à jour le stock local et l'interface
    saveCart();
    updateCartCount();
    showNotification('Produit ajouté au panier');
    
    // Mettre à jour l'affichage du panier si ouvert
    if (document.querySelector('.cart-sidebar.show')) {
        renderCart();
    }
    
    return true;
}

// Afficher le panier
function showCart() {
    // Créer le panier s'il n'existe pas
    let cartSidebar = document.querySelector('.cart-sidebar');
    
    if (!cartSidebar) {
        cartSidebar = document.createElement('div');
        cartSidebar.className = 'cart-sidebar';
        cartSidebar.innerHTML = `
            <div class="cart-header">
                <h3>Votre panier</h3>
                <button class="close-cart">&times;</button>
            </div>
            <div class="cart-items">
                <!-- Les articles seront ajoutés ici -->
            </div>
            <div class="cart-summary">
                <div class="subtotal">
                    <span>Sous-total</span>
                    <span class="subtotal-amount">0 FCFA</span>
                </div>
                <button class="btn-checkout">Passer la commande</button>
                <p class="shipping-info">
                    <i class="fas fa-truck"></i> Livraison gratuite pour les commandes de plus de 50 000 FCFA
                </p>
            </div>
        `;
        
        document.body.appendChild(cartSidebar);
        
        // Gérer les événements du panier
        cartSidebar.querySelector('.close-cart').addEventListener('click', () => {
            cartSidebar.classList.remove('show');
            document.body.style.overflow = '';
        });
        
        // Gérer le passage à la caisse
        cartSidebar.querySelector('.btn-checkout').addEventListener('click', () => {
            if (appState.cart.length > 0) {
                window.location.href = 'checkout.html';
            } else {
                showNotification('Votre panier est vide', 'error');
            }
        });
        
        // Fermer en cliquant en dehors du panier
        cartSidebar.addEventListener('click', (e) => {
            if (e.target === cartSidebar) {
                cartSidebar.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Afficher le panier
    cartSidebar.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Remplir le panier
    renderCart();
}

// Afficher le contenu du panier
function renderCart() {
    const cartSidebar = document.querySelector('.cart-sidebar');
    if (!cartSidebar) return;
    
    const itemsContainer = cartSidebar.querySelector('.cart-items');
    const subtotalEl = cartSidebar.querySelector('.subtotal-amount');
    const checkoutBtn = cartSidebar.querySelector('.btn-checkout');
    
    if (appState.cart.length === 0) {
        itemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Votre panier est vide</p>
                <a href="#" class="continue-shopping">Continuer vos achats</a>
            </div>
        `;
        
        // Gérer le clic sur "Continuer vos achats"
        itemsContainer.querySelector('.continue-shopping')?.addEventListener('click', (e) => {
            e.preventDefault();
            cartSidebar.classList.remove('show');
            document.body.style.overflow = '';
        });
        
        subtotalEl.textContent = '0 FCFA';
        checkoutBtn.disabled = true;
        return;
    }
    
    // Calculer le sous-total
    let subtotal = 0;
    
    // Générer le HTML des articles du panier
    itemsContainer.innerHTML = appState.cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <div class="item-details">
                    <h4 class="item-title">${item.name}</h4>
                    <div class="item-seller">Vendu par ${item.seller}</div>
                    <div class="item-price">${formatPrice(item.price)} FCFA</div>
                    
                    <div class="item-quantity">
                        <button class="decrease-qty" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-qty" ${item.quantity >= item.maxQuantity ? 'disabled' : ''}>+</button>
                    </div>
                </div>
                <button class="remove-item">&times;</button>
            </div>
        `;
    }).join('');
    
    // Mettre à jour le sous-total
    subtotalEl.textContent = `${formatPrice(subtotal)} FCFA`;
    checkoutBtn.disabled = false;
    
    // Ajouter les écouteurs d'événements pour les quantités et la suppression
    itemsContainer.querySelectorAll('.decrease-qty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemEl = e.target.closest('.cart-item');
            const itemId = parseInt(itemEl.dataset.id);
            updateCartItemQuantity(itemId, -1);
        });
    });
    
    itemsContainer.querySelectorAll('.increase-qty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemEl = e.target.closest('.cart-item');
            const itemId = parseInt(itemEl.dataset.id);
            updateCartItemQuantity(itemId, 1);
        });
    });
    
    itemsContainer.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemEl = e.target.closest('.cart-item');
            const itemId = parseInt(itemEl.dataset.id);
            removeFromCart(itemId);
        });
    });
}

// Mettre à jour la quantité d'un article dans le panier
function updateCartItemQuantity(productId, change) {
    const item = appState.cart.find(item => item.id === productId);
    if (!item) return;
    
    const newQuantity = item.quantity + change;
    
    // Vérifier les limites de quantité
    if (newQuantity < 1 || newQuantity > item.maxQuantity) {
        showNotification(`Quantité invalide. Maximum: ${item.maxQuantity}`, 'error');
        return;
    }
    
    item.quantity = newQuantity;
    saveCart();
    renderCart();
    updateCartCount();
}

// Supprimer un article du panier
function removeFromCart(productId) {
    const itemIndex = appState.cart.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;
    
    appState.cart.splice(itemIndex, 1);
    saveCart();
    
    // Mettre à jour l'interface
    renderCart();
    updateCartCount();
    
    // Afficher une notification
    showNotification('Article retiré du panier');
}

// Sauvegarder le panier dans le stockage local
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(appState.cart));
}

// Mettre à jour le compteur du panier
function updateCartCount() {
    const totalItems = appState.cart.reduce((total, item) => total + item.quantity, 0);
    
    if (DOM.cartCount) {
        DOM.cartCount.textContent = totalItems;
        DOM.cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    if (DOM.cartCountFloating) {
        DOM.cartCountFloating.textContent = totalItems;
        DOM.cartCountFloating.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Afficher une notification
function showNotification(message, type = 'success') {
    // Supprimer les notifications existantes
    document.querySelectorAll('.notification').forEach(el => el.remove());
    
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Ajouter la notification au DOM
    document.body.appendChild(notification);
    
    // Faire apparaître la notification
    setTimeout(() => {
        notification.classList.add('show');
        
        // Faire disparaître après 3 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            
            // Supprimer du DOM après l'animation
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }, 100);
}

// Formater le prix
function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR').format(price);
}

// Initialiser l'application au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    
    // Gérer le défilement du header
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Initialiser le sélecteur de tri
    if (DOM.sortSelect) {
        DOM.sortSelect.value = appState.sortBy;
    }
    
    // Initialiser le sélecteur de prix
    if (DOM.priceRange && DOM.maxPriceEl) {
        DOM.priceRange.value = appState.filters.maxPrice;
        DOM.maxPriceEl.textContent = formatPrice(appState.filters.maxPrice);
    }
});

// Ajouter un produit au panier
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartCount();
        showNotification('Produit ajouté au panier');
    }
}

// Mettre à jour le compteur du panier
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Afficher une notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Faire disparaître la notification après 3 secondes
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }, 100);
}

// Ajouter les écouteurs d'événements
function addEventListeners() {
    // Boutons "Ajouter au panier"
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('button').dataset.id);
            addToCart(productId);
        });
    });

    // Boutons "Voir détails"
    document.querySelectorAll('.btn-view').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('button').dataset.id);
            viewProductDetails(productId);
        });
    });
}

// Afficher les détails d'un produit
function viewProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        // Ici, vous pouvez implémenter une modale ou une page de détails
        alert(`Détails du produit : ${product.name}\n\nPrix : ${formatPrice(product.price)} FCFA\n\n${product.description}`);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCartCount();
    
    // Animation au défilement
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
});
