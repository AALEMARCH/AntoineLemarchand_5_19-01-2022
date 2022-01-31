let itemRecovery = JSON.parse(localStorage.getItem("product"));

const cartDisplay = () => {
  if (itemRecovery === null) {
    alert("votre panier est vide");
    console.log(itemRecovery);
  } else if (itemRecovery) {
    for (let product in itemRecovery) {
      if (
        itemRecovery[product].color != undefined &&
        itemRecovery[product].price != undefined
      ) {
        //création et positionnement articles
        const cartItem = document.getElementById("cart__items");
        let itemArticle = document.createElement("article");
        cartItem.appendChild(itemArticle);
        itemArticle.setAttribute("class", "cart__item");
        itemArticle.setAttribute("data-id", `${itemRecovery[product].id}`);
        itemArticle.setAttribute(
          "data-color",
          `${itemRecovery[product].color}`
        );

        //création et positionnement div pour l'image
        let itemDivImage = document.createElement("div");
        itemArticle.appendChild(itemDivImage);
        itemDivImage.setAttribute("class", "cart__item__img");

        let itemImage = document.createElement("img");
        itemDivImage.appendChild(itemImage);
        itemImage.src = itemRecovery[product].imageUrl;
        itemImage.alt = itemRecovery[product].altImage;

        //création du contenu des  produit
        let itemDivContent = document.createElement("div");
        itemArticle.appendChild(itemDivContent);
        itemDivContent.setAttribute("class", "cart__item__content");

        //création div a l'interieur du contenu des produit
        let itemDivContentDescription = document.createElement("div");
        itemDivContent.appendChild(itemDivContentDescription);
        itemDivContentDescription.setAttribute(
          "class",
          "cart__item__content__description"
        );

        //insertion du titre h2
        let itemTitle = document.createElement("h2");
        itemDivContentDescription.appendChild(itemTitle);
        itemTitle.innerHTML = itemRecovery[product].name;

        //insertion de la couleur
        let itemDescription = document.createElement("p");
        itemDivContentDescription.appendChild(itemDescription);
        itemDescription.innerHTML = itemRecovery[product].color;

        //insertion du prix
        let itemPrice = document.createElement("p");
        itemDivContentDescription.appendChild(itemPrice);
        itemPrice.innerHTML = `${itemRecovery[product].price} €`;

        //insertion element div
        let itemDivSettings = document.createElement("div");
        itemDivContent.appendChild(itemDivSettings);
        itemDivSettings.setAttribute("class", "cart__item__content__settings");

        //Création div pour inséré la quantité
        let itemDivSettingQuantity = document.createElement("div");
        itemDivSettings.appendChild(itemDivSettingQuantity);
        itemDivSettingQuantity.setAttribute(
          "class",
          "cart__item__content__settings__quantity"
        );

        //insertion de la quantité
        let itemQuantity = document.createElement("p");
        itemDivSettingQuantity.appendChild(itemQuantity);
        itemQuantity.innerHTML = `Qté : + `;

        //insertion de l'input pour la quantité
        let itemInput = document.createElement("input");
        itemDivSettingQuantity.appendChild(itemInput);
        itemInput.setAttribute("type", "number");
        itemInput.setAttribute("class", "itemQuantity");
        itemInput.setAttribute("name", "itemQuantity");
        itemInput.setAttribute("min", "1");
        itemInput.setAttribute("max", "100");
        itemInput.setAttribute("value", `${itemRecovery[product].quantity}`);

        // insertion boutton supprimer l'article
        let itemDivDelete = document.createElement("div");
        itemDivSettings.appendChild(itemDivDelete);
        itemDivDelete.setAttribute(
          "class",
          "cart__item__content__settings__delete"
        );

        let itemButtonDelete = document.createElement("p");
        itemDivDelete.appendChild(itemButtonDelete);
        itemButtonDelete.setAttribute("class", "deleteItem");
        itemButtonDelete.innerHTML = `Supprimer`;
      }
    }
    itemRecovery;
    console.log(itemRecovery);
  }
};
cartDisplay();

/***************************************************************************************/
/***************************************************************************************/
/****************************calcul de la quantité total********************************/
function getTotalQuantity() {
  //initialisation du calcul de la quantité total
  let quantityCart = [];
  for (let a = 0; a < itemRecovery.length; a++) {
    let totalQuantityCart = itemRecovery[a].quantity;
    quantityCart.push(totalQuantityCart);
  }

  //convertion du tableau de chaine "quantityCart", en nombre entiers
  for (let e = 0; e < quantityCart.length; e++) {
    quantityCart[e] = parseInt(quantityCart[e]);
  }

  //finalisation du calcul de la quantité total
  let sumProductQuantity = 0;
  for (let d = 0; d < quantityCart.length; d++) {
    sumProductQuantity += quantityCart[d];
  }
  console.log(
    sumProductQuantity
  ); /**********************Quantité total********************/

  //insertion de la quantité total dans le dom
  let totalQuantity = document.querySelector("#totalQuantity");
  totalQuantity.innerHTML = sumProductQuantity;
}
getTotalQuantity();

/*****************************************************************************************/
/*****************************************************************************************/
/******************************calcul du prix total***************************************/
function getTotalPrice() {
  /*Somme individuel de chaque produit en fonction de sa quantité, mise en place d'un tableau qui recupere les chiffres*/
  let eachCartPrice = [];
  for (let product in itemRecovery) {
    totalEachProduct =
      itemRecovery[product].price * itemRecovery[product].quantity;
    eachCartPrice.push(totalEachProduct);
  }

  //Sommes des valeurs des produits individuel pour calculé le total du prix du panier
  let totalPriceCart = 0;
  for (let b = 0; b < eachCartPrice.length; b++) {
    totalPriceCart += eachCartPrice[b];
  }
  console.log(
    totalPriceCart
  ); /**************************Prix total**************************/

  //insertion du prix total dans le dom
  let domTotalPrice = document.querySelector("#totalPrice");
  domTotalPrice.innerHTML = totalPriceCart;
}
getTotalPrice();

/*****************************************************************************************/
/*****************************************************************************************/
/************************Activation du boutton supprimer**********************************/
const deleteProduct = () => {
  let balises = document.querySelectorAll(".deleteItem");

  //apres selection des bouton de suppression, ont boucle sur ces boutons
  for (let x = 0; x < balises.length; x++) {
    balises[x].addEventListener("click", (del) => {
      del.preventDefault();

      // Ont cible l'Id et la couleur des produits
      let delId = del.target.closest(".cart__item").dataset.id;
      let delColor = del.target.closest(".cart__item").dataset.color;

      //la methode .filter() va filtré les elements qui presente les condition suivantes
      itemRecovery = itemRecovery.filter(
        (el) => el.id !== delId || el.color !== delColor
      );

      //sauvegarde sur le local storage
      localStorage.setItem("product", JSON.stringify(itemRecovery));

      //rechargement de la page
      window.location.reload();
    });
  }
};

deleteProduct();

/******************************************************************************************/
/******************************************************************************************/
/*************************Modification de la quantité sur le panier************************/
const changeQuantity = () => {
  const baliseQuantity = document.querySelectorAll(".itemQuantity");

  for (let y = 0; y < baliseQuantity.length; y++) {
    baliseQuantity[y].addEventListener("change", (event) => {
      event.preventDefault();

      //ciblage de l'ID du produit, de sa couleur, du produit déja selectionner, et du changement effectuer
      let eventId = event.target.closest(".cart__item").dataset.id;
      let eventColor = event.target.closest(".cart__item").dataset.color;
      let savedProduct = itemRecovery[y].quantity;
      let modif = Number(baliseQuantity[y].value);

      const res = itemRecovery.find(
        (el) =>
          /*Ont cherche les element modifié qui sont different des element sauvegarder et si ils ont le meme ID et la meme couleurs*/
          el.modif !== savedProduct &&
          el.id === eventId &&
          el.color === eventColor
      );

      res.quantity = modif;
      itemRecovery[y].quantity = res.quantity;

      // sauvegarde du tableau modifié sur le local storage
      localStorage.setItem("product", JSON.stringify(itemRecovery));

      //rechargement de la page
      location.reload();
    });
  }
};
changeQuantity();

/********************************************************************************************/
/********************************************************************************************/
/********************************formulaire de contact***************************************/
