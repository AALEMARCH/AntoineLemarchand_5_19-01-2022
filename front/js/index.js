// Ont appel l'API et ont fait un fetch afin d'obtenir en reponse les donné produit de l'api
loading().then((data) => {
  config = data;
  fetch(config.host + "/api/products")
    .then((res) => res.json())
    .then((data) => {
      productsData = data;
      document.getElementById("items").innerHTML = productsData
        .map(
          //ont positionne le .map dans le dom
          (product) =>
            `
  <a href="./product.html?id=${product._id}">
    <article>
      <img src="${product.imageUrl}" alt="${product.altTxt}">
      <h3 class="productName">${product.name}</h3>
      <p class="productDescription">${product.description}</p>
    </article>
  </a>
  `
        )
        .join(""); //on enleve les guillemets
    });
});
