let categories = await fetch('/home/getCategories', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
})
.then(response => response.json()) 
// console.log(categories);


var productMap = {};
var productIdMap = {};
for (const category of categories) {
    for (const product of category.products){
        productMap[product.name] = product.id;
        productIdMap[product.id] = product.name;
    }
};
// console.log(productIdMap);


async function addToCart(productName) {
    // console.log(productName);
    let productId = undefined;
    if (productMap.hasOwnProperty(productName)) {
        productId = productMap[productName];
    }
    // console.log(productId);
    try {
        const response = await fetch(`/cart/add/${productId}`, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        alert(`Product added to cart!`);

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add product to cart.');
    }
    updateCartDisplay();
}

async function getItemCountFromCart(productId) {
    const response = await fetch(`/cart/getAll`, {
        method: 'POST',
    });

    const result = await response.json();
    if (!result) {
        return 0;
    }
    if (result.hasOwnProperty(productId)) {
        return result[productId];
    } else {
        return 0;
    }
}
async function updateCartDisplay() {
    console.log("tuu")
    const response = await fetch(`/cart/getAll`, {
        method: 'POST',
    });

    const result = await response.json();
    var totalCount = 0;
    for (let temp in result){
        updateProductCount(temp)
        totalCount += result[temp];
    }
    if (totalCount > 0){
        const icons = document.querySelector(`[data-id="header-icons"]`);
        const cartCountDisplay = document.createElement('span');
        cartCountDisplay.classList.add('total-count');
        cartCountDisplay.textContent = totalCount;
        const existingChild = icons.querySelector('.total-count');
        if (existingChild){
            existingChild.textContent = totalCount;
        }
        else{
            const ttlCount = document.createElement('div');
            ttlCount.classList.add('total-count');
            ttlCount.textContent = totalCount;
            ttlCount.style.display = "inline";
            ttlCount.style.margin = "0";
            ttlCount.style.color = "royalblue";
            icons.append(ttlCount);
        }
    }
    
}
// function updateCartCounter() {
//     const cart = JSON.parse(sessionStorage.getItem('cart')) || {};
//     const totalItems = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
//     const cartCounter = document.querySelector('.cart-counter');
//     if (cartCounter) {
//         cartCounter.textContent = totalItems;
//     }
//     updateCartDisplay();
// }
async function updateProductCount(productId) {
    const product = document.querySelector(`[data-id="${productIdMap[productId]}"]`);
    // console.log(product);
    if (product) {
  
        const itemCount = await getItemCountFromCart(productId);
        const itemCountElement = document.createElement('span');
        itemCountElement.classList.add('item-count');
        itemCountElement.textContent = itemCount;
        const existingChild = product.querySelector('.cart-count');
        if (existingChild){
            existingChild.textContent = itemCount;
        }
        else{
            const cartCount = document.createElement('div');
            cartCount.classList.add('cart-count');
            const referenceElement = product.querySelector('.product-info');
            cartCount.style.position = "absolute"
            cartCount.style.top = "70%";
            cartCount.style.left = "90%";
            cartCount.textContent = itemCount;
            cartCount.style.display = "flex";
            cartCount.style.color = "green";
            product.insertBefore(cartCount, referenceElement);
        }
        
    }
}


const cartIcons = document.querySelectorAll('#cart-icon');
cartIcons.forEach(icon => {
    icon.addEventListener('click', function() {
        addToCart(this.parentNode.dataset.id);
    });
});
 

updateCartDisplay();
window.addEventListener('pageshow', function(event) {
    if (event.persisted){
        window.location.reload();
        updateCartDisplay();
        // console.log("reloaded");
    }
});
// let reloaded = false;
// if (reloaded == false){
//     location.reload(true);
//     reloaded = true;
// }




