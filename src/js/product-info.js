import Product from "./product.js";

//Variabel till taggen som visar produkten
const productsContainer = document.querySelector(".singleProductContainer");

//Tom variabel för produkten
let product;

//Om användaren skriver in URLen när ingen produktvalts
//Tas användaren tillbaka till index sidan
//detta för att inte visa en tom sida
if (window.sessionStorage.getItem("productID") == null){
    window.location.replace("index.html");
} else {
    //Hämtar id på produkten som valts
    const id = window.sessionStorage.getItem("productID");
    //fetchar produkten med det IDet
    //samt tilldelar produkt variabeln till att bli den produkt som hämtas
    getProductById(id);
    //add to cart knapp och dess lyssnare
    const orderButton = document.querySelector("#ORDER");
    orderButton.addEventListener('click', (e) => {
      e.preventDefault();
      //Om det redan finns en vald produkt
      //bytut gamla produkten mot nya
      if(window.localStorage.getItem("product")){
        window.localStorage.removeItem("product");
        window.localStorage.setItem("product", JSON.stringify(product));
        //ananrs lägg till produkten i localStorage
      } else {
        window.localStorage.setItem("product", JSON.stringify(product));
      }
      //Ta användaren till order sidan
      window.document.location = "order.html";
    })
}

//fetcha valda produkten baserat på ID
//Lägg till produkten som hämtas som ett produkt objekt och spara
//den i variabeln product
//samt skriv ut produktens info i HTML
async function getProductById(id){
    fetch(`https://fakestoreapi.com/products/${id}`)
    .then((response) => response.json())
    .then((data) => {
        product = new Product(
          data.id,
          data.title,
          data.price,
          data.category,
          data.description,
          data.image,
          1
        );
        //Skriver ut produkten i HTML taggar
        setHTMLValues(
          product.imageURL,
          product.title,
          product.description,
          product.price
        );
    })
    .catch((error) => console.error(error));
}

//Funktion för att sätta HTML värden
function setHTMLValues(imageURL, title, description, price){

  document.querySelector('#singleProductImg').innerHTML = `<img src="${imageURL}" alt="${title}">`;
  document.querySelector('#titleInfo').innerHTML = `
      <h3 >${title}</h3>
      <p class="singleProductDesc">${description}</p>
  `;
  document.querySelector('#price').innerHTML = `<span>${price}€</span>`;
}