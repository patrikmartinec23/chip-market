class NavbarComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);

        // Use the global cart manager instance
        this.cartManager = window.cartManager;

        // Listen for cart updates
        this.cartManager.addEventListener(() => {
            this.updateCartDisplay();
        });
    }

    render() {
        this.container.innerHTML = `
            <nav class="navbar navbar-expand-md shadow mb-4 sticky-top">
                <div class="container">
                    <a href="/" class="navbar-brand">
                        <h1 class="fs-4 m-0 link-primary">Chip Market</h1>
                    </a>

                    <div class="d-flex align-items-center">
                        <div class="dropdown">
                            <a class="btn btn-outline-primary position-relative" href="#" role="button" id="cartDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fas fa-shopping-bag"></i>
                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cart-badge">
                                    0
                                </span>
                            </a>
                            <div class="dropdown-menu dropdown-menu-end p-3 cart-dropdown-menu" aria-labelledby="cartDropdown" style="min-width: 300px;">
                                <h6 class="dropdown-header">Shopping Cart</h6>
                                <div class="cart-items">
                                    <!-- Cart items will be dynamically inserted here -->
                                </div>
                                <div class="d-flex justify-content-between align-items-center mt-3">
                                    <span class="fw-bold">Total: $<span class="cart-total">0.00</span></span>
                                    <button class="btn btn-primary btn-sm btn-checkout">Checkout</button>
                                </div>
                            </div>
                        </div>
                        <button 
                            class="navbar-toggler ms-2" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#navbarContent" 
                            aria-controls="navbarContent" 
                            aria-expanded="false" 
                            aria-label="Toggle navigation"
                        >
                            <span class="navbar-toggler-icon"></span>
                        </button>
                    </div>
                    
                    <div class="collapse navbar-collapse" id="navbarContent">
                        <ul class="navbar-nav mx-auto mb-2 mb-md-0">
                            ${this.createNavItems()}
                        </ul>
                        <div class="d-flex justify-content-center justify-content-md-start">
                            <button type="button" class="btn btn-outline-primary me-2">
                                Login
                            </button>
                            <button type="button" class="btn btn-primary me-2">
                                Sign-up
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        `;

        this.addEventListeners();
        this.updateCartDisplay();
    }

    getActiveLink() {
        const path = window.location.pathname;
        const hash = window.location.hash;
        const fullPath = path + hash;

        // Get the last part of the pathname (e.g., 'index.html')
        const lastPathPart = path.split('/').pop();

        const pageMap = {
            '': 'Home',
            'index.html': 'Home',
            'products.html': 'Products',
            'deals.html': 'Deals',
            'about-us.html': 'About Us',
            'contact.html': 'Contact',
        };

        const hashMap = {
            '#about-us': 'About Us',
            '#contact-us': 'Contact',
        };

        // Check if we're on a page with a hash that should override the page mapping
        if (hash && hashMap[hash]) {
            return hashMap[hash];
        }

        // Otherwise use the page mapping
        return pageMap[lastPathPart] || 'Home';
    }

    createNavItems() {
        const activeLink = this.getActiveLink();
        const navItems = [
            { text: 'Home', href: './index.html#' },
            { text: 'Products', href: './products.html' },
            { text: 'Deals', href: './deals.html' },
            { text: 'About Us', href: './index.html#about-us' },
            { text: 'Contact', href: './index.html#contact-us' },
        ];

        const navItemsHTML = navItems
            .map(
                (item) => `
            <li class="nav-item">
                <a href="${item.href}" class="nav-link px-2 ${
                    item.text === activeLink ? 'link-secondary' : ''
                }" data-nav-item="${item.text}">
                    ${item.text}
                </a>
            </li>
        `
            )
            .join('');

        // After inserting the HTML, add event listeners
        setTimeout(() => {
            const navLinks = document.querySelectorAll('[data-nav-item]');
            navLinks.forEach((link) => {
                link.addEventListener('click', () => {
                    // Remove active class from all links
                    navLinks.forEach((l) =>
                        l.classList.remove('link-secondary')
                    );

                    // Add active class to clicked link
                    link.classList.add('link-secondary');
                });
            });
        }, 0);

        return navItemsHTML;
    }

    addEventListeners() {
        const loginBtn = this.container.querySelector(
            '.btn-outline-primary:not([id="cartDropdown"])'
        );
        const signupBtn = this.container.querySelector('.btn-primary');

        loginBtn?.addEventListener('click', () => {
            console.log('Login clicked');
        });

        signupBtn?.addEventListener('click', () => {
            console.log('Signup clicked');
        });

        // Add cart-specific event listeners
        this.addCartEventListeners();
    }

    addCartEventListeners() {
        // Checkout button
        const checkoutBtn = this.container.querySelector('.btn-checkout');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.cartManager.proceedToCheckout();
            });
        }

        // Quantity buttons and remove buttons will be added when cart is updated
    }

    updateCartDisplay() {
        // Get navbar cart elements
        const cartBadge = this.container.querySelector('.cart-badge');

        // Update cart count badge
        if (cartBadge) {
            const itemCount = this.cartManager.getTotalItems();
            cartBadge.textContent = itemCount;
            cartBadge.style.display = itemCount > 0 ? 'block' : 'none';
        }

        // Update cart dropdown if it exists
        this.updateCartDropdown();
    }

    updateCartDropdown() {
        const cartDropdown = this.container.querySelector(
            '.cart-dropdown-menu'
        );

        if (!cartDropdown) return;

        const cartItems = this.cartManager.getCartItems();
        const cartItemsContainer = cartDropdown.querySelector('.cart-items');
        const cartTotalElement = cartDropdown.querySelector('.cart-total');

        // Clear existing items
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';

            if (cartItems.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="text-center py-3">
                        <p class="m-0">Your cart is empty</p>
                    </div>
                `;
            } else {
                // Add each cart item to the dropdown
                cartItems.forEach((item) => {
                    const itemElement = document.createElement('div');
                    itemElement.className =
                        'cart-item d-flex justify-content-between align-items-center p-2 border-bottom';
                    itemElement.innerHTML = `
                        <div>
                            <p class="m-0 fw-bold">${item.name}</p>
                            <div class="d-flex align-items-center">
                                <button class="btn btn-sm btn-outline-secondary quantity-decrease" data-id="${
                                    item.id
                                }">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="mx-2">${item.quantity}</span>
                                <button class="btn btn-sm btn-outline-secondary quantity-increase" data-id="${
                                    item.id
                                }">
                                    <i class="fas fa-plus"></i>
                                </button>
                                <span class="ms-3">$${(
                                    item.price * item.quantity
                                ).toFixed(2)}</span>
                            </div>
                        </div>
                        <button class="btn btn-sm btn-danger remove-item" data-id="${
                            item.id
                        }">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                    cartItemsContainer.appendChild(itemElement);
                });

                // Add event listeners to the newly created buttons
                this.addCartItemEventListeners();
            }
        }

        // Update total
        if (cartTotalElement) {
            cartTotalElement.textContent = this.cartManager
                .getTotalPrice()
                .toFixed(2);
        }
    }

    addCartItemEventListeners() {
        // Quantity decrease buttons
        this.container
            .querySelectorAll('.quantity-decrease')
            .forEach((button) => {
                button.addEventListener('click', (e) => {
                    const itemId = +e.currentTarget.dataset.id;
                    const cartItems = this.cartManager.getCartItems();
                    const item = cartItems.find((item) => item.id === itemId);
                    if (item) {
                        this.cartManager.updateQuantity(
                            itemId,
                            item.quantity - 1
                        );
                    }
                });
            });

        // Quantity increase buttons
        this.container
            .querySelectorAll('.quantity-increase')
            .forEach((button) => {
                button.addEventListener('click', (e) => {
                    const itemId = +e.currentTarget.dataset.id;
                    const cartItems = this.cartManager.getCartItems();
                    const item = cartItems.find((item) => item.id === itemId);
                    if (item) {
                        this.cartManager.updateQuantity(
                            itemId,
                            item.quantity + 1
                        );
                    }
                });
            });

        // Remove item buttons
        this.container.querySelectorAll('.remove-item').forEach((button) => {
            button.addEventListener('click', (e) => {
                const itemId = e.currentTarget.dataset.id;
                this.cartManager.removeItem(+itemId);
            });
        });
    }
}

// Initialize the navbar when DOM is loaded
function initNavbar() {
    const navbarContainer = document.getElementById('navbar');
    if (navbarContainer) {
        const navbar = new NavbarComponent('navbar');
        navbar.render();
    }
}

document.addEventListener('DOMContentLoaded', initNavbar);
