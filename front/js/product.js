const url_id = window.location.search;
const urlSearchParams = new URLSearchParams(url_id);
const product_id = urlSearchParams.get("id");
const optionSelect = document.getElementById("colors");
const quantity = document.getElementById("quantity");
console.log(product_id);

//appelle de produit individuel via l'api et l'ID
//insertion dans le HTML via JavaScript
loading().then((data) => {
  config = data;
  fetch(config.host + `/api/products/${product_id}`)
    .then((res) => res.json())
    .then((data) => {
      eachProductData = data;
      console.log(eachProductData);
      let oneProductImg = document.createElement("img");
      document.querySelector(".item__img").appendChild(oneProductImg);
      oneProductImg.src = eachProductData.imageUrl;
      oneProductImg.alt = eachProductData.altTxt;

      let oneProductName = document.getElementById("title");
      oneProductName.innerHTML = eachProductData.name;

      let oneProductPrice = document.getElementById("price");
      oneProductPrice.innerHTML = eachProductData.price;

      let oneProductDescription = document.getElementById("description");
      oneProductDescription.innerHTML = eachProductData.description;

      for (let colors of eachProductData.colors) {
        let colorSelect = document.createElement("option");
        document.querySelector("select").appendChild(colorSelect);
        colorSelect.innerHTML = `<option value="${colors}">${colors}</option>`;
      }
      addProducts(eachProductData);
    });

  // gestion du panier
  const addProducts = (eachProductData) => {
    const button = document.getElementById("addToCart");
    button.addEventListener("click", (event) => {
      event.preventDefault();

      let quantityProducts = quantity.value;
      let colorsProducts = optionSelect.value;

      //création d'une fenêtre poPup de confirmation d'article
      const popupConfirmation = () => {
        if (
          window.confirm(
            `votre commande n° ${product_id}, ${eachProductData.name}, de couleur ${colorsProducts} est validé, consultez le panier OK ou continuer vos achats ANNULER`
          )
        ) {
          window.location.href = "cart.html";
        } else {
          window.location.href = "index.html";
        }
      };

      // fenêtre poPup en fonction des conditions
      const productIsOk = () => {
        if (
          quantityProducts < 1 ||
          quantityProducts > 100 ||
          colorsProducts === ""
        ) {
          return alert("veuillez remplir correctement les champs demander!");
        } else {
          return popupConfirmation();
        }
      };

      // Receuil des données à ajouter au panier

      let tableToAddLocalStorage = {
        color: colorsProducts,
        quantity: quantityProducts,
        id: product_id,
      };
      console.log(tableToAddLocalStorage);

      //initialisation du local sttorage "key value"/ conversion des données au format JSON , en objet Javascript
      let tableProducts = JSON.parse(localStorage.getItem("product"));

      // ajout de produit dans le local storage
      const pushArray = () => {
        tableProducts.push(tableToAddLocalStorage);
        localStorage.setItem("product", JSON.stringify(tableProducts));
      };

      //si il y a déjà des produits enregistrés dans le local storage
      //si il y a déjà un produit similaire de sélectionner
      //si il n'y a pas encore de produit dans le local storage

      if (
        tableToAddLocalStorage.quantity >= 1 &&
        tableToAddLocalStorage.quantity <= 100 &&
        tableToAddLocalStorage.color != ""
      ) {
        if (tableProducts) {
          const resultFind = tableProducts.find(
            (element) =>
              element.id === product_id && element.color === colorsProducts
          );
          if (resultFind) {
            resultFind.quantity =
              parseInt(tableToAddLocalStorage.quantity) +
              parseInt(resultFind.quantity);
            localStorage.setItem("product", JSON.stringify(tableProducts));
            productIsOk();
          } else {
            pushArray();
            productIsOk();
          }
        } else {
          tableProducts = [];
          pushArray();
          productIsOk();
        }
      } else {
        productIsOk();
      }
    });
  };
});
