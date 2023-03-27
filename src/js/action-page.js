//Om en kund inte finns kommer användaren komma till index sidan
//Gör det itne möjligt att se sidan genom att skriva in den dirrekta URLen
if(!window.sessionStorage.getItem('customer')){
    window.location.replace("index.html");

//Annars skriver vi ut varan och beställer med bekräftelse att användaren har köp något
} else {
    const customer = JSON.parse(window.sessionStorage.getItem('customer'));
    const product = JSON.parse(window.localStorage.getItem('product'));
    let realCost = product.price * parseFloat(product.quantity);
    const cost = Math.round((realCost + Number.EPSILON) * 100) / 100;
    document.querySelector("#address").innerHTML = `
        Varan väntas skickas till: ${customer.address} ${customer.zip} ${customer.county}
    `;
    document.querySelector("#email").innerHTML = `
        Ditt kvitto har skickats till: ${customer.email}
    `;
    document.querySelector("#name").innerHTML = `
        Beställaren: ${customer.name}
    `;
    document.querySelector("#phone").innerHTML = `
        Telefon: ${customer.phone}
    `;
    document.querySelector("#title").innerHTML = `
        Vara: ${product.title} x${product.quantity}
    `;
    document.querySelector("#price").innerHTML = `
        Pris: ${cost} €
    `;
    window.localStorage.removeItem('product');
    window.sessionStorage.removeItem('customer');
}