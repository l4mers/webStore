import Customer from "./customer.js";

let cart;
let total = 0;
const totalPrice = document.querySelector('#totprice');

if(localStorage.getItem("cart")){
    const order = document.querySelector('#orders');
    cart = JSON.parse(localStorage.getItem("cart"));
    cart.productList.forEach(e => {
        addEventListener(productHTML(order, e), e);
        total += e.price * e.quantity;
    });
    total = returnRound(total);
    totalPrice.innerHTML = `Total ${total} €`;
}

function productHTML(element, product){

    let productContainer = document.createElement("div");
    productContainer.classList.add("cart");

    productContainer.innerHTML += `
        <div class="product-and-title">
            <div class="product-img">
            <img src="${product.imageURL}" alt="${product.title}">
            </div>
            <h3>${product.title}</h3>
        </div>
        <p class="action-price">${product.price} €</p>
    `;
    let quantityContainer = document.createElement("div");
    quantityContainer.classList.add("quantity");
    let addButton = document.createElement("button");
    addButton.innerHTML = "+";
    let subButton = document.createElement("button");
    subButton.innerHTML = "-";
    let productQuantity = document.createElement("p");

    productQuantity.innerText = `quantity: ${product.quantity}`;
    quantityContainer.appendChild(addButton);
    quantityContainer.appendChild(subButton);
    quantityContainer.appendChild(productQuantity);
    productContainer.appendChild(quantityContainer);
    element.appendChild(productContainer);

    return [addButton, subButton, productQuantity, productContainer];
}

function addEventListener(elements, product){
    elements[0].addEventListener('click', e =>{
        e.preventDefault();
        product.quantity++;
        cart.itemCount++;
        total = returnRound(total + product.price);
        totalPrice.innerHTML = `Total ${total} €`;
        elements[2].innerText = `Quantity: ${product.quantity}`;
        localStorage.setItem('cart', JSON.stringify(cart));
        document.querySelector("#itemCount").innerText = `Cart (${cart.itemCount})`;
    });

    elements[1].addEventListener('click', e =>{
        e.preventDefault();
        product.quantity--;
        cart.itemCount--;
        document.querySelector("#itemCount").innerText = `Cart (${cart.itemCount})`;
        if(product.quantity <= 0){
            total = returnRound(total - product.price);
            totalPrice.innerHTML = `Total ${total} €`;
            elements[3].remove();
            let index = cart.productList.indexOf(product);
            cart.productList.splice(index, 1);
            if(cart.productList.length == 0){
                localStorage.removeItem('cart');
                totalPrice.innerHTML = null;
            }else {
                localStorage.setItem('cart', JSON.stringify(cart));
            }
        } else {
            total = returnRound(total - product.price);
            totalPrice.innerHTML = `Total ${total} €`;
            elements[2].innerText = `Quantity: ${product.quantity}`;
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    });
}

function returnRound(expression){
    return Math.round((expression + Number.EPSILON) * 100) / 100;
}

document.getElementById("submit").classList.add('hidden');

const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const telInput = document.querySelector("#tel");
const addressInput = document.querySelector("#address");
const postnrInput = document.querySelector("#postnr");
const ortInput = document.querySelector("#ort");

const submit = document.querySelector("#submit");

nameInput.value = "";
emailInput.value = "";
telInput.value = "";
addressInput.value = "";
postnrInput.value = "";
ortInput.value = "";

let correctName = false;
let correctEmail = false;
let correctTel = false;
let correctAddress = false;
let correctPostnr = false;
let correctOrt = false;

submit.addEventListener('click', e =>{
    e.preventDefault();
    let customer = new Customer(
            nameInput.value,
            emailInput.value,
            telInput.value,
            addressInput.value,
            postnrInput.value,
            ortInput.value);

    cart.customer = customer;
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log(cart);
    window.document.location = "action-page.html";
})

nameInput.addEventListener('input', (e) =>{
    correctName = symbolRange(nameInput, "name-ermsg", "Behöver 2-50 bokstäver");
    submitField();
});

emailInput.addEventListener('input', (e) =>{
    correctEmail = symbolRangeWithRegX(emailInput,
        "email-ermsg",
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]+)*$/,
        emailInput.value.includes("."),
        "Behöver email format \"exempel@domain.org\"");
        submitField();
});

telInput.addEventListener('input', (e) =>{
    correctTel = symbolRangeWithRegX(telInput,
        "tel-ermsg",
        /^[0-9+() -]*$/,
        true,
        "Behöver ett telefonnummer");
        submitField();
});

addressInput.addEventListener('input', (e) =>{
    correctAddress = symbolRange(addressInput, "address-ermsg", "Behöver 2-50 bokstäver");
    submitField();
});

postnrInput.addEventListener('keyup', (e) =>{
    correctPostnr = symbolRangeWithRegX(postnrInput,
        "postnr-ermsg",
        /^[0-9]{3}\s?[0-9]{2}$/,
        true,
        "Behöver ett postnummer format \"000 00\"");
        if(postnrInput.value.length == 3 && e.key != "Backspace"){
            postnrInput.value = postnrInput.value + " ";
        } else if (postnrInput.value.length == 4 && e.key == "Backspace"){
            postnrInput.value = postnrInput.value.substring(0,2);
        }
        submitField();
});

ortInput.addEventListener('input', (e) =>{
    correctOrt = symbolRange(ortInput, "ort-ermsg", "Behöver 2-50 bokstäver");
    submitField();
});

function symbolRangeWithRegX(tag, pID, regX, bool, message){
    if(tag.value == null || tag.value == ""){
        document.getElementById(pID).classList.add('yellow');
        document.getElementById(pID).classList.remove('green');
        document.getElementById(pID).classList.remove('red');
        document.getElementById(pID).innerText = "Obligatoriskt fält";
        return false;
    }else if (tag.value.match(regX) && bool && tag.value.length > 2 && tag.value.length < 51){
        document.getElementById(pID).classList.remove('yellow');
        document.getElementById(pID).classList.add('green');
        document.getElementById(pID).classList.remove('red');
        document.getElementById(pID).innerText = "Accepterat";
        return true;
    }else{
        document.getElementById(pID).classList.remove('yellow');
        document.getElementById(pID).classList.remove('green');
        document.getElementById(pID).classList.add('red');
        document.getElementById(pID).innerText = message;
        return false;
    }
}

function symbolRange(tag, pID, message){
    if(tag.value.length < 2 || tag.value.length > 50){
        if(tag.value == null || tag.value == ""){
            document.getElementById(pID).classList.add('yellow');
            document.getElementById(pID).classList.remove('green');
            document.getElementById(pID).classList.remove('red');
            document.getElementById(pID).innerText = "Obligatoriskt fält";
        } else {
            document.getElementById(pID).classList.remove('yellow');
            document.getElementById(pID).classList.remove('green');
            document.getElementById(pID).classList.add('red');
            document.getElementById(pID).innerText = message;
        }
        return false;
    }else{
        document.getElementById(pID).classList.remove('yellow');
        document.getElementById(pID).classList.add('green');
        document.getElementById(pID).classList.remove('red');
        document.getElementById(pID).innerText = "Accepterat";
        return true;
    }
}

function submitField(){
    document.getElementById("submit").classList.add('hidden');
    if (correctName &&
        correctEmail &&
        correctTel &&
        correctAddress &&
        correctPostnr &&
        correctOrt && localStorage.getItem("cart")){
        document.getElementById("submit").classList.remove('hidden');
    }
}
