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

        //insertion de l'input
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

//Activation du boutton supprimer
/*
const deleteButton = document
  .getElementsByClassName("deleteItem")
  .addEventListener("click", (event) => {
    event.preventDefault();
    if (deleteButton) {
      itemRecovery.splice([product]);
    }
  });*/
