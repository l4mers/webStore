
if(!localStorage.getItem('cart')){
    location.replace("index.html");
} else {
    const cart = JSON.parse(localStorage.getItem('cart'));
    if(cart.customer == ""){
        location.replace("index.html");
    } else {
        let titles = document.querySelector("#title");
        titles.innerHTML = `product(s): `;
        let total = 0;
        cart.productList.forEach(product => {
            total += product.price * product.quantity;
            titles.innerHTML += `${product.title} x${product.quantity}, `;
        });
        total = Math.round((total + Number.EPSILON) * 100) / 100;
        document.querySelector("#address").innerHTML = `
            Your product(s) will soon be sent to: ${cart.customer.address} ${cart.customer.zip} ${cart.customer.county}
        `;
        document.querySelector("#email").innerHTML = `
            Your receipt have been sent to: ${cart.customer.email}
        `;
        document.querySelector("#name").innerHTML = `
            Customer: ${cart.customer.name}
        `;
        document.querySelector("#phone").innerHTML = `
            Phone: ${cart.customer.phone}
        `;
        document.querySelector("#price").innerHTML = `
            Pris: ${total} €
        `;
        localStorage.removeItem('cart');
    }
}