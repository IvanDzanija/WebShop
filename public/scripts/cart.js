/*  
Using shopping.js methods for direcly updating the home page.
Since the page gets cached and doesn't reload on back button press.
*/


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

let getCartItems = async function (){
    const response = await fetch(`/cart/getAll`, {
        method: 'POST',
    });
    return await response.json();
    
}
let cartItems = await getCartItems();
// console.log(cartItems);
function renderCart() {
    updateCartDisplay();
    Object.keys(cartItems).forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add(item);

        const name = document.createElement('div');
        const productName = productIdMap[item].split("-").map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(" ") + " Hat";
        name.textContent = productName;

        const quantity = document.createElement('div');
        quantity.textContent = cartItems[item];

        const minusBtn = document.createElement('button');
        minusBtn.textContent = '-';
        minusBtn.addEventListener('click', async () => {
            const response = await fetch(`/cart/remove/${item}`, {
                method: 'POST',
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            if (quantity.textContent > 1){
                quantity.textContent--;
            }
            else{
                cartItemDiv.remove();
            }
            updateCartDisplay();
        });
        const plusBtn = document.createElement('button');
            plusBtn.textContent = '+';
            plusBtn.addEventListener('click', async () => {
                const response = await fetch(`/cart/add/${item}`, {
                    method: 'POST',
                });
        
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                quantity.textContent++;
                updateCartDisplay();

        });

        name.style.display = "inline";
        plusBtn.style.display = "block";
        minusBtn.style.display = "block";
        quantity.style.display = "inline";

        plusBtn.style.marginLeft = "85%";
        plusBtn.style.marginBottom = "1%";
        plusBtn.style.marginTop = "2%";
        minusBtn.style.marginLeft = "85%";
        minusBtn.style.marginTop = "1%";
        minusBtn.style.marginBottom = "2%";
        quantity.style.position = "absolute";
        quantity.style.right = "0";
        quantity.style.marginRight = "28.4%";
        
        cartItemDiv.appendChild(plusBtn);
        cartItemDiv.appendChild(name);
        cartItemDiv.appendChild(quantity);
        cartItemDiv.appendChild(minusBtn);
        cartItemDiv.style.margin = "2% 0%"
        const cartCont = document.querySelector('.cart-items');
        cartCont.appendChild(cartItemDiv);

    });
}

// function saveCart() {
//     sessionStorage.setItem("cart", JSON.stringify(cartItems));
//     updateCartDisplay();
// }

async function updateCartDisplay() {
    const response = await fetch(`/cart/getAll`, {
        method: 'POST',
    });

    const result = await response.json();
    var totalCount = 0;
    for (let temp in result){
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
    else{
        const icons = document.querySelector(`[data-id="header-icons"]`);
        icons.removeChild(icons.querySelector('.total-count'));
    }
    
}

renderCart();
window.addEventListener('pageshow', function(event) {
    if (event.persisted){
        window.location.reload();
        updateCartDisplay();
        // console.log("reloaded");
    }
});