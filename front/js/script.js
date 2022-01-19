// Mise en place d'une variable qui contiendra les données de l'API
let productsData = [];

//récupération des données de l'API, transformation en json, intégration a la variable productsData, mise en place .catch si aucune reponse de l'API. fonction asynchrone pour charger l'API en amont.
const fetchProducts = async () => {
  await fetch("http://localhost:3000/api/products/")
    .then((res) => res.json())
    .then((data) => (productsData = data))
    .catch((res) => {
      alert("une erreur est survenue!");
    });

  console.log(productsData); //log array pour garder un visuel sur le tableau json
};

//fonction d'affichage des produits dans le DOM
const displayProducts = async () => {
  await fetchProducts(); //on integre les donnée de l'API

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

  //récupération Id des produits et transfer sur l'url a afficher
  let cardsProducts = document.querySelectorAll(".items");
  console.log(cardsProducts);

  cardsProducts.forEach((cardsProducts) =>
    cardsProducts.addEventListener("click", () => {
      console.log(cardsProducts);

      window.location = `product.html?${cardsProducts.id}`;
    })
  );
};
displayProducts();
