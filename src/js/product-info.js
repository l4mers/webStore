import Product from "./product.js";
import Cart from "./cart.js";

let product;

if (sessionStorage.getItem("productID") == null){
    location.replace("index.html");
} else {
    const id = sessionStorage.getItem("productID");

    getProductById(id);

    const orderButton = document.querySelector("#ORDER");
    orderButton.addEventListener('click', (e) => {
      e.preventDefault();
      if(localStorage.getItem("cart")){
        let cart = JSON.parse(localStorage.getItem("cart"));
        cart.itemCount++;
        let itemNotInCart = true;
        cart.productList.forEach(element => {
          if(product.id == element.id){
            element.quantity++;
            itemNotInCart = false;
          }
        });
        if(itemNotInCart){
          cart.productList.push(product);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        document.querySelector("#itemCount").innerText = `Cart (${cart.itemCount})`;
      } else {
        let cart = new Cart();
        cart.productList.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        document.querySelector("#itemCount").innerText = `Cart (${cart.itemCount})`;
      }
    })
}

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
        setHTMLValues(product);
    })
    .catch((error) => console.error(error));
}

function setHTMLValues(product){
  document.querySelector('#singleProductImg').innerHTML = `<img src="${product.imageURL}" alt="${product.title}">`;
  document.querySelector('#titleInfo').innerHTML = `
      <h3 >${product.title}</h3>
      <p class="singleProductDesc">${product.description}</p>
  `;
  document.querySelector('#price').innerHTML = `<span>${product.price}€</span>`;
}