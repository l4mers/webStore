import Product from "./product.js";

//variabel till sök taggen
const search = document.querySelector("#search");

//När sidan laddas så nullar vi allt som redan står i sökbaren
search.value = "";

//variablar för de sökalternativ som dyker upp när vi söker
const searchDrop = document.querySelector(".searchDropdown");
//Variabel till sök knappen
const submitButton = document.querySelector("#submit");

const electronics = document.querySelector("#electronic");
const jewelery = document.querySelector("#jewelery");
const mens = document.querySelector("#men");
const women = document.querySelector("#women");

//Produkt lista
let productList = [];

//Funktion som hämtar alla produkter och lägger dom i en lista
//samt skriver ut top 10 produkter samtidigt till startsidan
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

//Kallar på metoden ovanför
getProductsByCount();

//Evenlyssnare till sökbaren
search.addEventListener('keyup', (e) =>{
    //Om värdet är null i sökbaren raderar vi alla sökalternativ
    if(search.value == "" || search.value == null){
        searchDrop.innerHTML = "";
    } else {
        searchDrop.innerHTML = "";
        //Räknare för att inte visa förmånga sökförslag
        let count = 0;
        productList.forEach((e) =>{
            //Värdet personen söker på
            let searchWord = search.value.toLowerCase().trim();
            //Om användarens ord är en substring eller identisk med en title eller category
            //Skrivs det ut förslag att söka på
            if(e.title.trim().toLowerCase().includes(searchWord) || e.category.trim().toLowerCase().includes(searchWord) && count < 11){
                count++
                /**
                 * Skapar en ny html tag och trycker in html i den.
                 * blir till alternativ för användaren att trycka på.
                 * lägger till en eventlyssnare på förslagen så att de går att trycka på
                */
                let element = document.createElement("span");
                element.classList.add("searchResult");
                element.innerText = e.title + " (" + e.category + ")";
                searchDrop.appendChild(element);
                element.addEventListener("click", (ee) => {
                    search.value = ee.target.innerText;
                    searchDrop.innerHTML = `
                        <span class="searchResult">${search.value}</span>
                    `;
                    //om användaren trycker på ett av alternativen
                    //kallas denna metod som validerar
                    //Lägger föremålet i sessionStorage och tar användaren till info sidan
                    searchEventStatic(search.value.trim(), e.id);
                })
            }
        })
    }
});
//klick event om vi trycker på sök valideras det som står i listan
//Om en matching matchar flera produkter tas användaren till produktsidan
//där alla produkter som matchas visas
//annars tas användaren till produktinfo sidan 
submitButton.addEventListener('click', (e) =>{
    e.preventDefault();
    searchEvent(search.value.toLowerCase().trim());
})

//Om användaren tryckt på et tsökalternativ vet vi att produkten finns
//och användaren tas till produkt-info sidan där produkten visas
function searchEventStatic(searchWord, id){
    if(!searchWord == "" || !searchWord == null){
        //Lägger till id i sessionStorage så vi kan hämta rätt produkt
        window.sessionStorage.setItem("productID", id);
        //tar användaren till produkt-info sidan
        window.document.location = "product-info.html?id=" + id;
    }
}

//Om användaren trycker på sök knappen istället för på ett alternativ
//kan flera matchningar ske
function searchEvent(searchWord){
    if(!searchWord == "" || !searchWord == null){
        let productIDList = [];
        let matchWholeWord = false;
        productList.forEach(e =>{
            //Om sökvärdet är identiskt vet vi vilken produkt det handlar om
            if(e.title.toLowerCase().trim() === searchWord){
                window.sessionStorage.setItem("productID", e.id);
                matchWholeWord = true
            }
            //annars om sök ordet matchar flera lägger vi till alla matchande
            //produkters id i en lista
            else if(e.title.toLowerCase().includes(searchWord)){
                productIDList.push(e.id);
            }
        })
        //Om en 100% match gå till produkt info sidan.
        if(matchWholeWord){
            window.document.location = "product-info.html?id=" + id;
        //annars om sök ordet är en substräng av en produkt tas användaren också till
        //produkt info sidan
        } else if (productIDList.length == 1){
            window.sessionStorage.setItem("productID", JSON.stringify(productIDList));
            window.document.location = "product-info.html?id=" + id;
        //Där emot om användarens sökord matchar flera objekt
        //tas användaren till produktsidan där alla dessa produkter kommer visas
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
