document.addEventListener('DOMContentLoaded', function () {
    // Function to render products with deals from JSON data
    function renderDeals(products) {
        const container = document.getElementById('products-container');
        container.innerHTML = ''; // Clear container

        // Filter to only show products with deals (deal > 0)
        const productsWithDeals = products.filter(
            (product) => product.deal > 0
        );

        productsWithDeals.forEach((product) => {
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

        // Calculate discounted price
        const discountedPrice = product.price * (1 - product.deal / 100);

        productCol.innerHTML = `
            <div class="product-card card h-100 border rounded">
                <div class="product-tag">${product.tag}</div>
                <div class="deal-badge">${product.deal}% OFF</div>
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
                <div class="card-footer bg-white border-top-0 d-flex align-items-center">
                    <div class="product-price-container">
                        <p class="product-original-price">$${product.price.toFixed(
                            2
                        )}</p>
                        <p class="product-discounted-price">$${discountedPrice.toFixed(
                            2
                        )}</p>
                    </div>
                    <button 
                        class="btn btn-sm btn-success add-to-cart"
                        data-product-id="${product.id}"
                    >
                        <i class="bi bi-cart-plus me-1"></i>Add To Cart
                    </button>
                </div>
            </div>
        `;

        // Add cart functionality
        const addToCartButton = productCol.querySelector('.add-to-cart');
        addToCartButton.addEventListener('click', function (event) {
            event.preventDefault();

            const cartItem = {
                id: product.id,
                name: product.name,
                price: discountedPrice, // Use the discounted price for cart
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

            // If no categories are selected, show all products with deals
            if (selectedCategories.length === 0) {
                fetchProducts().then(renderDeals);
            } else {
                fetchProducts().then((products) => {
                    const filteredProducts = products.filter(
                        (product) =>
                            selectedCategories.includes(product.tag) &&
                            product.deal > 0
                    );
                    renderDeals(filteredProducts);
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

    // Initial load of products with deals
    fetchProducts().then(renderDeals);
});
