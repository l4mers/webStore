import Customer from "./customer.js"; //laddar customer klassen

/**
 * om en produkt är vald kommer produktens
 * bild, titel och pris visas längst ned
 * samt en total pris på vald produkt. Detta kan sedan bli en sumering
 * om man valt flera produkter
 */
if(window.localStorage.getItem("product")){
    const order = document.querySelector('#orders');
    //metod som skriver ut html finns längst ned på denna sida
    let product = JSON.parse(window.localStorage.getItem("product"));
    order.innerHTML = printProductHTML(product);
    addition(product);
    subtraction(product);
    //remove knapp om man vill ta bort den valda produkten
    const remove = document.querySelector('#remove');
    const totalPrice = document.querySelector('#totprice');
    totalPrice.innerHTML = `Total ${product.price} €`;
    //remove knappen görs synlig
    remove.classList.remove("hidden");
    //Om knappen trycks tas info om produkten bort
    //och localStorage nollställs
    //knappen blir sen osynlig igen
    remove.addEventListener('click', e =>{
        e.preventDefault();
        order.innerHTML = null;
        totalPrice.innerHTML = null;
        window.localStorage.removeItem("product");
        remove.classList.add("hidden");
    })
}

//Gör submit knapp osynlig från början som en säkerhetsgrej
document.getElementById("submit").classList.add('hidden');

//Variabler för diverse html input taggar
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const telInput = document.querySelector("#tel");
const addressInput = document.querySelector("#address");
const postnrInput = document.querySelector("#postnr");
const ortInput = document.querySelector("#ort");

const submit = document.querySelector("#submit");

//Nollar alla värden i fälten
nameInput.value = "";
emailInput.value = "";
telInput.value = "";
addressInput.value = "";
postnrInput.value = "";
ortInput.value = "";

//bool som validerar om det som står i fälten är korrekt
let correctName = false;
let correctEmail = false;
let correctTel = false;
let correctAddress = false;
let correctPostnr = false;
let correctOrt = false;

//eventlyssnare på submit knapp
/**
 * Om en kund trycker submit
 * hämtas all info från alla fält och skapar upp en
 * customer obj som läggs i sessionStorage
 * och användaren tas till action-page
 */
submit.addEventListener('click', e =>{
    e.preventDefault();
    window.sessionStorage.setItem("customer", JSON.stringify(
        new Customer(nameInput.value,
            emailInput.value,
            telInput.value,
            addressInput.value,
            postnrInput.value,
            ortInput.value)
    ))
    window.sessionStorage.setItem("product", product);
    window.document.location = "action-page.html";
})

//Event lyssnare som validerar om namenet är mellan 2-50 bokstäver
//samt skriver ut real time info till användaren
nameInput.addEventListener('input', (e) =>{
    //metod som returnerar sant om användaren har skrivit 2-15 täcken
    correctName = symbolRange(nameInput, "name-ermsg", "Behöver 2-50 bokstäver");
    //Kollar om alla fält är sanna 
    submitField();
});

//samma fast för email
emailInput.addEventListener('input', (e) =>{
    correctEmail = symbolRangeWithRegX(emailInput,
        "email-ermsg",
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]+)*$/,
        emailInput.value.includes("."),
        "Behöver email format \"exempel@domain.org\"");
        submitField();
});

//samma fast för telefon nr
telInput.addEventListener('input', (e) =>{
    correctTel = symbolRangeWithRegX(telInput,
        "tel-ermsg",
        /^[0-9+() -]*$/,
        true,
        "Behöver ett telefonnummer");
        submitField();
});

//samma fast för address
addressInput.addEventListener('input', (e) =>{
    correctAddress = symbolRange(addressInput, "address-ermsg", "Behöver 2-50 bokstäver");
    submitField();
});

//samma fast för postnr
postnrInput.addEventListener('keyup', (e) =>{
    correctPostnr = symbolRangeWithRegX(postnrInput,
        "postnr-ermsg",
        /^[0-9]{3}\s?[0-9]{2}$/,
        true,
        "Behöver ett postnummer format \"000 00\"");
        //Om längden på det inmatade värdet är 3 lägg till ett space
        if(postnrInput.value.length == 3 && e.key != "Backspace"){
            postnrInput.value = postnrInput.value + " ";
        //Om längden på värdet är 4 och man trycker backspace radera 2 tecken
        } else if (postnrInput.value.length == 4 && e.key == "Backspace"){
            postnrInput.value = postnrInput.value.substring(0,2);
        }
        submitField();
});

//samma fast för ort
ortInput.addEventListener('input', (e) =>{
    correctOrt = symbolRange(ortInput, "ort-ermsg", "Behöver 2-50 bokstäver");
    submitField();
});

//Function som validerar användaren input med regX
//Skriver ut real time meddelande till användaren
//returnerar false elr true
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

//samma fast utan regEx
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

//om alla bools för alla input fields är sanna
//och användaren valt en produkt så blir submit knappen synlig
//Detta händer när valideringen från alal fields uppfyller kraven
function submitField(){
    document.getElementById("submit").classList.add('hidden');
    if (correctName &&
        correctEmail &&
        correctTel &&
        correctAddress &&
        correctPostnr &&
        correctOrt && window.localStorage.getItem("product")){
        document.getElementById("submit").classList.remove('hidden');
    }
}
//Skriver ut produkten som HTML
function printProductHTML(product){
    return `
        <div class="cart">

            <div class="product-and-title">
                <div class="product-img">
                    <img src="${product.imageURL}" alt="${product.title}">
                </div>
                <h3>${product.title}</h3>
            </div>

            
            <p class="action-price">${product.price} €</p>
            

            <div class="quantity">
                <button id="addButton" >+</button>
                <button id="subButton" >-</button>
                <p id="productQuantity">antal: ${product.quantity}</P>
            </div>
      `;
}

function addition(product){
    let addButton = document.querySelector('#addButton');
    let totprice = document.querySelector('#totprice');
    addButton.addEventListener('click', e =>{
        e.preventDefault();
        product.quantity++;
        let realCost = product.price * product.quantity;
        let cost = Math.round((realCost + Number.EPSILON) * 100) / 100;
        document.querySelector('#productQuantity').innerHTML = "antal: " + product.quantity;
        totprice.innerHTML = `Total ${cost} €`;
        localStorage.setItem('product', JSON.stringify(product));
    })
}

function subtraction(product){
    let addButton = document.querySelector('#subButton');
    let order = document.querySelector('#orders');
    let totprice = document.querySelector('#totprice');
    addButton.addEventListener('click', e =>{
        e.preventDefault();
        product.quantity--;
        if(product.quantity <= 0){
            order.innerHTML = null;
            totprice.innerHTML = null;
            window.localStorage.removeItem("product");
            document.querySelector('#remove').classList.add("hidden");
        }else{
            let realCost = product.price * product.quantity;
            let cost = Math.round((realCost + Number.EPSILON) * 100) / 100;
            document.querySelector('#productQuantity').innerHTML = "antal: " + product.quantity;
            totprice.innerHTML = `Total ${cost} €`;
            localStorage.setItem('product', JSON.stringify(product));
        }
    })
}
