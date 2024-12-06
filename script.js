const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal =  document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const footer = document.getElementById("footer")


let cart = [];
let cartFooterQtd = 0;

cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex"
})

cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){
    const isOpen = checkRestaurantOpen();

    if(!isOpen){
        Toastify({
            text: "Ops, O restaurante está fechado neste horário",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "#ef4444",
            },
        }).showToast();
        return;
    }

    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }
})

function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        existingItem.quantity += 1;
    }

    else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
        
    }

    cartFooterQtd += 1;
    updateCartModal()

    
    if(addToCart){
        Toastify({
            text: "Item adicionado ao carrinho",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "#3CB371",
            },
        }).showToast();

    
        return;
    }

}

function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemsElement = document.createElement("div");
        cartItemsElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemsElement.innerHTML = `
        <div class = "flex items-center justify-between">
            <div>
                <p class = "font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class = "font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

            <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
            </button>
            
        </div>
        
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemsElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    if(cartFooterQtd !== 0){
        footer.classList.remove("hidden")
    }
    else{
        footer.classList.add("hidden")
    }

    cartCounter.innerHTML = cartFooterQtd;

}


cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemsCart(name);
        
    }
    updateCartModal();
})


function removeItemsCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            cartFooterQtd -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        cartFooterQtd -= 1;
        updateCartModal();
    }

}


addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500", "placeholder-red-300")
    }
})

checkoutBtn.addEventListener("click", function(){
    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressInput.classList.add("border-red-500", "placeholder-red-300")
        return;
    }


    const cartItems = cart.map((item) => {
        return (
            `*${item.name}* \n Quantidade: ${item.quantity} \n Preço Unitário: R$ ${item.price.toFixed(2)} \n Subtotal: R$ ${(item.price * item.quantity).toFixed(2)} \n `
        )
    }).join("\n\n")

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);
    
    const message = encodeURIComponent(`Olá, gostaria de fazer o seguinte pedido: \n\n ${cartItems} \n *Total: R$ ${total}* \n\n *Endereço de entrega:* ${addressInput.value}`)
    
    const phone =  "63999537447"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    addressInput.value = "";
    cartFooterQtd = 0;
    if(cartFooterQtd === 0){
        footer.classList.add("hidden")
    }
    
    updateCartModal();

})


function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 23;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}
else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}