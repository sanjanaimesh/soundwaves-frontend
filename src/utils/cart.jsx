export function loadCart() {
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        cart = {
            orderedItems: [],
            days: 1,
            startingDate: formatDate(new Date()),
            endingDate: formatDate(new Date())
        }

        const cartString = JSON.stringify(cart);
        localStorage.setItem("cart", cartString);
        return cart;
    }
    cart = JSON.parse(cart);
    return cart;
}

export function updateCartDates(startingDate, endingDate, days) {
    const cart = loadCart();
    cart.startingDate = startingDate;
    cart.endingDate = endingDate;
    cart.days = days;
    const cartString = JSON.stringify(cart);
    localStorage.setItem("cart", cartString);
}

export function addToCart(key, qty) {
    const cart = loadCart();
    let found = false;
    for (let i = 0; i < cart.orderedItems.length; i++) {
        if (cart.orderedItems[i].key == key) {
            cart.orderedItems[i].qty += qty;
            found = true;
        }
    }

    if(!found){
        cart.orderedItems.push({key, qty});
    }

    const cartString = JSON.stringify(cart);
    localStorage.setItem("cart", cartString);
}

export function removeFromCart(key) { // key parameter එක add කළා
    const cart = loadCart();
    const newCart = cart.orderedItems.filter((item) => item.key !== key); // !== use කළා
    cart.orderedItems = newCart;
    const cartString = JSON.stringify(cart);
    localStorage.setItem("cart", cartString);
}

export function updateCartItemQty(key, qty) { // නව function එකක්
    const cart = loadCart();
    
    if (qty <= 0) {
        // If quantity is 0 or less, remove the item
        removeFromCart(key);
        return;
    }
    
    // Find and update the item
    let found = false;
    for (let i = 0; i < cart.orderedItems.length; i++) {
        if (cart.orderedItems[i].key === key) {
            cart.orderedItems[i].qty = qty;
            found = true;
            break;
        }
    }
    
    // If item not found, add it
    if (!found) {
        cart.orderedItems.push({key, qty});
    }
    
    const cartString = JSON.stringify(cart);
    localStorage.setItem("cart", cartString);
}

export function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}