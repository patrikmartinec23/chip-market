document.addEventListener('DOMContentLoaded', function () {
    // Function to render products from JSON data
    function renderProducts(products) {
        const container = document.getElementById('products-container');
        container.innerHTML = ''; // Clear container

        // Filter to only show products with deals (deal > 0) if on deals page
        const isDealsPage = window.location.pathname.includes('deals');
        const productsToRender = isDealsPage
            ? products.filter((product) => product.deal > 0)
            : products;

        productsToRender.forEach((product) => {
            const productElement = createProductElement(product);
            container.appendChild(productElement);
        });
    }

    // Function to create a product element with proper Bootstrap classes
    function createProductElement(product) {
        const productCol = document.createElement('div');
        // Updated class for responsive behavior:
        // - Full width on small devices (<768px)
        // - Two products per row on medium devices (≥768px)
        // - Three products per row on large devices (≥1200px)
        productCol.className = 'col-12 col-md-6 col-xl-4 mb-4';

        // Calculate discounted price if deal exists
        const hasDiscount = product.deal && product.deal > 0;
        const discountedPrice = hasDiscount
            ? product.price * (1 - product.deal / 100)
            : null;

        // Create the inner HTML with conditional elements for deals
        let innerHTML = `
            <div class="product-card card h-100 border rounded">
                <div class="product-tag">${product.tag}</div>`;

        // Only add deal badge if there's a deal
        if (hasDiscount) {
            innerHTML += `<div class="deal-badge">${product.deal}% OFF</div>`;
        }

        innerHTML += `
                <div class="product-image-container">
                    <img 
                        src="${product.image}"
                        class="product-image"
                        alt="${product.name}"
                    />
                </div>
                <div class="card-body pt-0 pb-2">
                    <h5 class="product-name">${product.name}</h5>
                </div>
                <div class="card-footer bg-white border-top-0 d-flex align-items-center">`;

        // Different price display based on whether there's a discount
        if (hasDiscount) {
            innerHTML += `
                    <div class="product-price-container">
                        <p class="product-original-price">$${product.price.toFixed(
                            2
                        )}</p>
                        <p class="product-discounted-price">$${discountedPrice.toFixed(
                            2
                        )}</p>
                    </div>`;
        } else {
            innerHTML += `<p class="product-price">$${product.price.toFixed(
                2
            )}</p>`;
        }

        innerHTML += `
                    <button 
                        class="btn btn-sm btn-success add-to-cart"
                        data-product-id="${product.id}"
                    >
                        <i class="bi bi-cart-plus me-1"></i>Add To Cart
                    </button>
                </div>
            </div>
        `;

        productCol.innerHTML = innerHTML;

        // Add cart functionality
        const addToCartButton = productCol.querySelector('.add-to-cart');
        addToCartButton.addEventListener('click', function (event) {
            event.preventDefault();

            const cartItem = {
                id: product.id,
                name: product.name,
                price: hasDiscount ? discountedPrice : product.price, // Use discounted price if available
                tag: product.tag,
                quantity: 1,
            };

            window.cartManager.addItem(cartItem);

            // Visual feedback (optional)
            this.classList.add('btn-secondary');
            this.classList.remove('btn-success');
            this.innerHTML = '<i class="bi bi-check-lg me-1"></i>Added';

            // Reset button after a short delay
            setTimeout(() => {
                this.classList.add('btn-success');
                this.classList.remove('btn-secondary');
                this.innerHTML =
                    '<i class="bi bi-cart-plus me-1"></i>Add To Cart';
            }, 1000);
        });

        return productCol;
    }

    // Add event listeners for category checkboxes
    const categoryCheckboxes = document.querySelectorAll(
        '.category-checkbox input'
    );
    categoryCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', function () {
            // Filter products based on selected categories
            const selectedCategories = Array.from(categoryCheckboxes)
                .filter((cb) => cb.checked)
                .map((cb) => cb.value);

            // If no categories are selected, show all products (with deal filter if on deals page)
            if (selectedCategories.length === 0) {
                fetchProducts().then(renderProducts);
            } else {
                fetchProducts().then((products) => {
                    let filteredProducts = products.filter((product) =>
                        selectedCategories.includes(product.tag)
                    );

                    // Additional filter for deals page
                    const isDealsPage =
                        window.location.pathname.includes('deals');
                    if (isDealsPage) {
                        filteredProducts = filteredProducts.filter(
                            (product) => product.deal > 0
                        );
                    }

                    renderProducts(filteredProducts);
                });
            }
        });
    });

    // Fetch products from JSON file
    function fetchProducts() {
        return fetch('../data/products.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                return []; // Return empty array on error
            });
    }

    // Initial load of products
    fetchProducts().then(renderProducts);
});
