function panel() {
    const header = document.querySelector("#panel");
    const path = window.location.pathname;

    let items = 0;

    if(localStorage.getItem("cart")){
      let cart = JSON.parse(localStorage.getItem("cart"));
      items = cart.itemCount;
    }
  
    if (path === "/") {
      window.location.pathname = "/index.html";
    }
  
    header.innerHTML = `
      <nav class="nav">
        <ul>
          <li class="${path.includes("/kontakt.html") ? "active" : ""}">
            <a href="kontakt.html">Kontakt</a>
          </li>
          <li class="${path.includes("/produkter.html") ? "active" : ""}">
            <a href="produkter.html">Produkter</a>
          </li>
          <li class="${path.includes("/order.html") ? "active" : ""}">
            <a id="itemCount" href="order.html">Cart (${items})</a>
          </li>
          <li class="${path.includes("/index.html") ? "active" : ""}">
            <a href="index.html">Startsida</a>
          </li>
        </ul>
      </nav>
    `;
}

  function footer(){
    const footer = document.querySelector("#footer");
    footer.innerHTML = `
    <b>Copyright &copy; 2023 - Melinda Walter, Oscar Jidåker, Kevin Dybeck, Gustav Henriksson</b>
    `
}

footer();
  
panel();