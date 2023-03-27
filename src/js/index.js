import Product from "./product.js";

const search = document.querySelector("#search");

search.value = "";

const searchDrop = document.querySelector(".searchDropdown");

const submitButton = document.querySelector("#submit");

const electronics = document.querySelector("#electronic");
const jewelery = document.querySelector("#jewelery");
const mens = document.querySelector("#men");
const women = document.querySelector("#women");

let productList = [];

async function getProductsByCount(){
    fetch("https://fakestoreapi.com/products")
        .then((response) => response.json())
        .then((data) => {
            data.forEach(element => {
                productList.push(new Product(element.id, element.title, element.price, element.category, element.description, element.image));
            });
            data.sort((a, b) => {
                return b.rating.count - a.rating.count;
            });
            for (let i = 0; i < 10; i++){
                let div = document.createElement("div");
                div.classList.add("product-card");
                div.innerHTML = `
                    <figure class="product-header">
                        <img src="${data[i].image}" alt="${data[i].title}">
                    </figure>
                    <article class="product-body">
                        <h3 class="product-title">${data[i].title}</h3>
                        <p class="price">${data[i].price}€</p>
                    </article>
                `;

                div.addEventListener('click', e =>{
                    e.preventDefault();
                    window.sessionStorage.setItem("productID", data[i].id);
                    window.document.location = "product-info.html?id=" + data[i].id;
                })
                document.getElementById("topproducts").appendChild(div);
            }
        })
        .catch((error) => console.error(error));
}

getProductsByCount();

search.addEventListener('keyup', (e) =>{
    if(search.value == "" || search.value == null){
        searchDrop.innerHTML = "";
    } else {
        searchDrop.innerHTML = "";
        let count = 0;
        productList.forEach((e) =>{
            let searchWord = search.value.toLowerCase().trim();
            if(e.title.trim().toLowerCase().includes(searchWord) || e.category.trim().toLowerCase().includes(searchWord) && count < 11){
                count++
                let element = document.createElement("span");
                element.classList.add("searchResult");
                element.innerText = e.title + " (" + e.category + ")";
                searchDrop.appendChild(element);
                element.addEventListener("click", (ee) => {
                    search.value = ee.target.innerText;
                    searchDrop.innerHTML = `
                        <span class="searchResult">${search.value}</span>
                    `;
                    searchEventStatic(search.value.trim(), e.id);
                })
            }
        })
    }
});
submitButton.addEventListener('click', (e) =>{
    e.preventDefault();
    searchEvent(search.value.toLowerCase().trim());
})

function searchEventStatic(searchWord, id){
    if(!searchWord == "" || !searchWord == null){
        window.sessionStorage.setItem("productID", id);
        window.document.location = "product-info.html?id=" + id;
    }
}

function searchEvent(searchWord){
    if(!searchWord == "" || !searchWord == null){
        let productIDList = [];
        let matchWholeWord = false;
        productList.forEach(e =>{
            if(e.title.toLowerCase().trim() === searchWord){
                window.sessionStorage.setItem("productID", e.id);
                matchWholeWord = true
            }
            else if(e.title.toLowerCase().includes(searchWord)){
                productIDList.push(e.id);
            }
        })
        if(matchWholeWord){
            window.document.location = "product-info.html?id=" + id;
        } else if (productIDList.length == 1){
            window.sessionStorage.setItem("productID", JSON.stringify(productIDList));
            window.document.location = "product-info.html?id=" + id;
        } else if (productIDList.length > 1){
            window.sessionStorage.setItem("productIDList", JSON.stringify(productIDList));
            window.document.location = "produkter.html";
        }
    }
}

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
    window.document.location = "produkter.html";
}
