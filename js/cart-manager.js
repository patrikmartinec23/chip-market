/**
 * CartManager class to handle all cart-related operations
 * This class manages the shopping cart and stores data in localStorage
 */
class CartManager {
    constructor() {
        // Check if an instance already exists
        if (CartManager.instance) {
            return CartManager.instance;
        }

        // If not, create one and store it
        CartManager.instance = this;

        this.cartKey = 'chipMarketCart';
        this.ordersKey = 'chipMarketOrders';
        this.eventListeners = [];
    }

    // Get cart items from local storage
    getCartItems() {
        const cartData = localStorage.getItem(this.cartKey);
        return cartData ? JSON.parse(cartData) : [];
    }

    // Save cart items to local storage
    saveCartItems(items) {
        localStorage.setItem(this.cartKey, JSON.stringify(items));
    }

    // Add item to cart
    addItem(item) {
        const cart = this.getCartItems();
        const existingItemIndex = cart.findIndex(
            (cartItem) => cartItem.id === item.id
        );

        if (existingItemIndex > -1) {
            // Item exists, increment quantity
            cart[existingItemIndex].quantity += item.quantity || 1;
        } else {
            // New item, ensure it has a quantity
            item.quantity = item.quantity || 1;
            cart.push(item);
        }

        this.saveCartItems(cart);
        this.dispatchCartUpdatedEvent();
    }

    // Remove item from cart
    removeItem(itemId) {
        let cart = this.getCartItems();
        cart = cart.filter((item) => item.id !== itemId);
        this.saveCartItems(cart);
        this.dispatchCartUpdatedEvent();
    }

    // Update item quantity
    updateQuantity(itemId, quantity) {
        const cart = this.getCartItems();
        const itemIndex = cart.findIndex((item) => item.id === itemId);

        if (itemIndex > -1) {
            cart[itemIndex].quantity = quantity;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
        }

        this.saveCartItems(cart);
        this.dispatchCartUpdatedEvent();
    }

    // Get total number of items in cart
    getTotalItems() {
        const cart = this.getCartItems();
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Calculate total price
    getTotalPrice() {
        const cart = this.getCartItems();
        return cart.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    }

    // Clear all items from cart
    clearCart() {
        this.saveCartItems([]);
        this.dispatchCartUpdatedEvent();
    }

    // Add event listener for cart updates
    addEventListener(callback) {
        this.eventListeners.push(callback);
    }

    // Remove event listener
    removeEventListener(callback) {
        this.eventListeners = this.eventListeners.filter(
            (listener) => listener !== callback
        );
    }

    // Dispatch event when cart is updated
    dispatchCartUpdatedEvent() {
        this.eventListeners.forEach((callback) => callback());
    }

    saveOrder() {
        const cartItems = this.getCartItems();
        const userId = sessionStorage.getItem('auth0_user_id');

        if (!userId) {
            alert('User is not authenticated. Please log in.');
            return;
        }

        if (cartItems.length === 0) {
            alert('Your cart is empty.');
            return;
        } else {
            alert(
                'Proceeding to checkout with ' +
                    this.getTotalItems() +
                    ' items totaling $' +
                    this.getTotalPrice().toFixed(2)
            );
        }

        const order = {
            userId: userId,
            items: cartItems,
            totalQuantity: this.getTotalItems(),
            totalPrice: this.getTotalPrice().toFixed(2),
            timestamp: new Date().toISOString(),
        };

        let orders = localStorage.getItem(this.ordersKey);
        orders = orders ? JSON.parse(orders) : [];
        orders.push(order);

        localStorage.setItem(this.ordersKey, JSON.stringify(orders));
        this.clearCart();
    }

    // Handle checkout process
    proceedToCheckout() {
        this.saveOrder();
    }
}

// Export the CartManager as a global variable
window.cartManager = new CartManager();
