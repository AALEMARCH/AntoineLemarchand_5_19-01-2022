const url_id = window.location.search;
const urlSearchParams = new URLSearchParams(url_id);
const product_id = urlSearchParams.get("id");
const optionSelect = document.getElementById("colors");
const quantity = document.getElementById("quantity");
console.log(product_id);

//appelle de produit individuel via l'api et l'ID
loading().then((data) => {
  config = data;
  fetch(config.host + `/api/products/${product_id}`)
    .then((res) => res.json())
    .then((data) => {
      eachProductData = data;
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

      //condition de limite de quantités
      const limiteQuantity = () => {
        if (quantityProducts >= 1 && quantityProducts <= 100) {
          return quantityProducts;
        } else {
          return alert("Nombre d'article(s) (1-100)!");
        }
      };

      //multiplication du prix en fonction de la quantité d'article selectionné
      const priceProduct = () => {
        if (quantityProducts >= 1 && quantityProducts <= 100) {
          return eachProductData.price * quantityProducts;
        } else {
          return undefined;
        }
      };

      //alerte si aucune couleurs d'article n'a été selectionné
      const warningColor = () => {
        if (colorsProducts != [""]) {
          return colorsProducts;
        } else {
          return alert("veuillez choisir une couleur!");
        }
      };

      //création d'un tableau qui prend en compte les article selectionner, la quantité, la couleur et le prix

      let tableToAddLocalStorage = {
        altImage: eachProductData.altTxt,
        color: warningColor(),
        description: eachProductData.description,
        imageUrl: eachProductData.imageUrl,
        name: eachProductData.name,
        price: priceProduct(),
        quantity: limiteQuantity(),
        id: product_id,
      };

      console.log(tableToAddLocalStorage);

      //fonction fenetre popup
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

      //initialisation du local sttorage "key value"/ conversion des donnée au format json , en objet javascript
      let tableProducts = JSON.parse(localStorage.getItem("product"));

      // ajout de produit dans le local storage
      const pushArray = () => {
        tableProducts.push(tableToAddLocalStorage);
        localStorage.setItem("product", JSON.stringify(tableProducts));
      };

      //si il y a deja des produits enregistré dans le local storage
      if (tableProducts) {
        pushArray();
        popupConfirmation();

        //si il n'y a pas de produit dans le local storage
      } else {
        tableProducts = [];
        pushArray();
        popupConfirmation();
      }
      console.log(tableProducts);
    });
  };
});
