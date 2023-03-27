const productsContainer = document.getElementById("products");

const electronics = document.querySelector("#electronic");
const jewelery = document.querySelector("#jewelery");
const mens = document.querySelector("#men");
const women = document.querySelector("#women");

electronics.addEventListener('click', e =>{
  e.preventDefault();
  categoryEvent("electronics");
})

jewelery.addEventListener('click', e =>{
  e.preventDefault();
  categoryEvent("jewelery");
})

mens.addEventListener('click', e =>{
  e.preventDefault();
  categoryEvent("men's clothing");
})

women.addEventListener('click', e =>{
  e.preventDefault();
  categoryEvent("women's clothing");
})

function categoryEvent(category){
  window.sessionStorage.setItem("category", category);
  productsContainer.innerHTML = null;
  getAllProducts();
}

//Lista med IDs som har matchat fåran sökning
let idList = JSON.parse(window.sessionStorage.getItem("productIDList"));



//fetcha produkter baserat på categori, sök matchningar
//annars skriv ut alla produkter
function getAllProducts(){
    fetch("https://fakestoreapi.com/products")
        .then((response) => response.json())
        .then((data) => {
          //Skriv ut alla produkter om categori valts
          if(window.sessionStorage.getItem("category")){
            data.forEach((product) => {
              if(product.category == window.sessionStorage.getItem("category")){
                createProductDiv(product.image, product.title, product.price, product.id);
              }
            });
            //Skriv ut alla produkter som matchat en sökning
          } else if (idList){
            data.forEach((product) => {
              idList.forEach(e =>{
                if(product.id == e){
                  createProductDiv(product.image, product.title, product.price, product.id);
                }
              })
            });
            //Annars skriv ut alla
          } else {
            data.forEach((product) => {
              createProductDiv(product.image, product.title, product.price, product.id);
            });
          }
          window.sessionStorage.removeItem("category");
          window.sessionStorage.removeItem("productIDList");

        })
        .catch((error) => console.error(error));
}

function createProductDiv(imageURL, title, price, id){
  let div = document.createElement("div");
  div.classList.add("product-card");
  div.innerHTML = printProductHTML(imageURL, title, price);
  div.addEventListener('click', e =>{
    e.preventDefault();
    window.sessionStorage.setItem("productID", id);
    window.document.location = "product-info.html?id=" + id;
  })
  productsContainer.appendChild(div);
}

//Metod som printar HTML
function printProductHTML(imageURL, title, price){
  return `   
          <figure class="product-header">
              <img src="${imageURL}" alt="${title}">
          </figure>
          <article class="product-body">
              <h3 class="product-title">${title}</h3>
              <p class="price">${price}€</p>
          </article>
        `;
}

getAllProducts();