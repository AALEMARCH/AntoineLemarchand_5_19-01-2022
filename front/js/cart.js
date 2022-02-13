//********************************************Récupération du local storage
let itemRecovery = JSON.parse(localStorage.getItem("product"));

//******************************************Si le local storage est vide, ou si il y a quelque chose
const cartDisplay = () => {
  if (itemRecovery === null) {
    alert("votre panier est vide");
    itemRecovery = [];
  } else if (itemRecovery) {
    for (let product in itemRecovery) {
      // fetch afin de comparer les infos du ls aux infos produits
      loading().then((data) => {
        config = data;
        fetch(config.host + `/api/products/${itemRecovery[product].id}`)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);

            if (
              itemRecovery[product].color != undefined &&
              data.price != undefined
            ) {
              //création et positionnement articles
              const cartItem = document.getElementById("cart__items");
              let itemArticle = document.createElement("article");
              cartItem.appendChild(itemArticle);
              itemArticle.setAttribute("class", "cart__item");
              itemArticle.setAttribute(
                "data-id",
                `${itemRecovery[product].id}`
              );
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
              itemImage.src = data.imageUrl;
              itemImage.alt = data.altTxt;

              //création du contenu des produits
              let itemDivContent = document.createElement("div");
              itemArticle.appendChild(itemDivContent);
              itemDivContent.setAttribute("class", "cart__item__content");

              //création div a l'intérieur du contenu des produits
              let itemDivContentDescription = document.createElement("div");
              itemDivContent.appendChild(itemDivContentDescription);
              itemDivContentDescription.setAttribute(
                "class",
                "cart__item__content__description"
              );

              //insertion du titre h2
              let itemTitle = document.createElement("h2");
              itemDivContentDescription.appendChild(itemTitle);
              itemTitle.innerHTML = data.name;

              //insertion de la couleur
              let itemDescription = document.createElement("p");
              itemDivContentDescription.appendChild(itemDescription);
              itemDescription.innerHTML = itemRecovery[product].color;

              //insertion du prix
              let itemPrice = document.createElement("p");
              itemDivContentDescription.appendChild(itemPrice);
              itemPrice.innerHTML = `${data.price} €`;

              //insertion element div
              let itemDivSettings = document.createElement("div");
              itemDivContent.appendChild(itemDivSettings);
              itemDivSettings.setAttribute(
                "class",
                "cart__item__content__settings"
              );

              //Création div pour insérer la quantité
              let itemDivSettingQuantity = document.createElement("div");
              itemDivSettings.appendChild(itemDivSettingQuantity);
              itemDivSettingQuantity.setAttribute(
                "class",
                "cart__item__content__settings__quantity"
              );

              //insertion de la quantité
              let itemQuantity = document.createElement("p");
              itemDivSettingQuantity.appendChild(itemQuantity);
              itemQuantity.innerHTML = `Qté :  `;

              //insertion de l'input pour la quantité
              let itemInput = document.createElement("input");
              itemDivSettingQuantity.appendChild(itemInput);
              itemInput.setAttribute("type", "number");
              itemInput.setAttribute("class", "itemQuantity");
              itemInput.setAttribute("name", "itemQuantity");
              itemInput.setAttribute("min", "1");
              itemInput.setAttribute("max", "100");
              itemInput.setAttribute(
                "value",
                `${itemRecovery[product].quantity}`
              );

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
          });
      });
    }
    itemRecovery;
  }
};
cartDisplay();

//************************************calcul de la quantité total

function getTotalQuantity() {
  //récupération des quantités de chaque produit présent dans le local storage
  let quantityCart = [];
  for (let a = 0; a < itemRecovery.length; a++) {
    let totalQuantityCart = itemRecovery[a].quantity;
    quantityCart.push(totalQuantityCart);
  }

  //conversion du tableau de chaine "quantityCart", en nombre entier et addition des valeurs de produit individuelles
  let sumProductQuantity = 0;
  for (let e = 0; e < quantityCart.length; e++) {
    quantityCart[e] = parseInt(quantityCart[e]);
    sumProductQuantity += quantityCart[e];
  }

  //insertion de la quantité totale dans le dom

  let totalQuantity = document.querySelector("#totalQuantity");
  totalQuantity.innerHTML = sumProductQuantity;
}
getTotalQuantity();

// Ciblage des produit du local storage a l'aide d'un fetch et d'une comparaison avec les données API
let totalPriceCart = 0;
for (let i = 0; i < itemRecovery.length; i++) {
  loading().then((data) => {
    config = data;
    fetch(config.host + `/api/products/${itemRecovery[i].id}`)
      .then((res) => res.json())
      .catch((err) => console.log(err))
      .then((data) => {
        //**********************************************calcul du prix total des produits selectionnés
        function getTotalPrice() {
          // on incrémente la variable dédié au prix total, avec une multiplication du prix API par la quantité local storage
          totalPriceCart +=
            Number(data.price) * Number(itemRecovery[i].quantity);

          //insertion du prix total dans le dom
          let domTotalPrice = document.querySelector("#totalPrice");
          domTotalPrice.innerHTML = totalPriceCart;
        }

        getTotalPrice();

        //*********************************************************Activation du boutton supprimé
        const deleteProduct = () => {
          let balises = document.querySelectorAll(".deleteItem");

          //apres sélection des boutons de suppression, ont boucle sur ces boutons
          for (let x = 0; x < balises.length; x++) {
            balises[x].addEventListener("click", (del) => {
              del.preventDefault();

              // Ont cible l'Id et la couleur des produits
              let delId = del.target.closest(".cart__item").dataset.id;
              let delColor = del.target.closest(".cart__item").dataset.color;

              //la méthode .filter() va filtrer les éléments qui présente les conditions suivantes
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

        //**********************************************Modification de la quantité sur le panier
        const changeQuantity = () => {
          const baliseQuantity = document.querySelectorAll(".itemQuantity");

          for (let y = 0; y < baliseQuantity.length; y++) {
            baliseQuantity[y].addEventListener("change", (event) => {
              event.preventDefault();

              //ciblage de l'ID du produit, de sa couleur, du produit déja sélectionner, et du changement effectuer
              let eventId = event.target.closest(".cart__item").dataset.id;
              let eventColor =
                event.target.closest(".cart__item").dataset.color;
              let savedProduct = itemRecovery[y].quantity;
              let modif = Number(baliseQuantity[y].value);

              const res = itemRecovery.find(
                (el) =>
                  //On cherche les elements modifiés qui sont different des elements sauvegarder et si ils ont le meme ID et la même couleur
                  el.modif !== savedProduct &&
                  el.id === eventId &&
                  el.color === eventColor
              );

              res.quantity = modif;

              //limite de quantité entre 1 et 100 si l'utilisateur decide de modifier l'input sans passer par les fleches mais directement via son pavé numérique
              if (res.quantity < 1 || res.quantity > 100) {
                alert(
                  "veuillez selectionnez une quantité entre 1 et 100 ou supprimer le produit"
                );
                res.quantity = 1;
              }

              itemRecovery[y].quantity = res.quantity;

              // sauvegarde du tableau modifié sur le local storage
              localStorage.setItem("product", JSON.stringify(itemRecovery));

              //rechargement de la page
              window.location.reload();
            });
          }
        };
        changeQuantity();
      });
  });
}

//************************************************formulaire de contact

//fonction de sécurisation du formulaire
const secureForm = () => {
  //création et stockage des regexp
  let nameRegex = /^[a-z]{2,20}$/i;
  let lastNameRegex = /^[a-z ,.'-]+$/i;
  let adressRegex = /^[a-z|0-9\s]+[a-z\s]+[\w\-?\s]*[\w]*$/i;
  let cityRegex = /^[a-z]+(?:[\s-][a-z]+)*$/i;
  let emailRegex =
    /^[a-z0-9\-_]+[a-z0-9\.\-_]*@[a-z0-9\-_]{2,}\.[a-z\.\-_]+[a-z\-_]+$/i;

  // stockage des inputs
  let firstName = document.getElementById("firstName");
  let lastName = document.getElementById("lastName");
  let address = document.getElementById("address");
  let city = document.getElementById("city");
  let email = document.getElementById("email");
  let button = document.getElementById("order");

  //fonction de désactivation du bouton d'envoi du formulaire
  function disableSubmit(disabled) {
    if (disabled) {
      button.setAttribute("disabled", true);
      button.style.opacity = "0.55";
    } else {
      button.removeAttribute("disabled", false);
      button.style.opacity = "1";
    }
  }

  //validation du prénom
  const nameValidation = () => {
    return document.getElementById("firstNameErrorMsg");
  };

  //écoute du changement sur l'input
  firstName.addEventListener("change", (e) => {
    //e.preventDefault();
    //si le regexp ciblé n'est pas conforme, on désactive l'envoi du formulaire et on met un message de validation
    if (nameRegex.test(e.target.value)) {
      firstName.style.background = "white";
      nameValidation().innerText = "Prenom valide";
      nameValidation().style.color = "lightgreen";
      disableSubmit(false);
    } else {
      firstName.style.background = "pink";
      nameValidation().innerText = "Prenom invalide";
      nameValidation().style.color = "#fbbcbc";
      disableSubmit(true);
    }
  });

  //validation du nom
  const lastNameValidation = () => {
    return document.getElementById("lastNameErrorMsg");
  };

  lastName.addEventListener("change", (e) => {
    //e.preventDefault();
    if (lastNameRegex.test(e.target.value)) {
      lastName.style.background = "white";
      lastNameValidation().innerText = "Nom valide";
      lastNameValidation().style.color = "lightgreen";
      disableSubmit(false);
    } else {
      lastName.style.background = "pink";
      lastNameValidation().innerText = "Nom invalide";
      lastNameValidation().style.color = "#fbbcbc";
      disableSubmit(true);
    }
  });

  //validation de l'adresse
  const adressValidation = () => {
    return document.getElementById("addressErrorMsg");
  };

  address.addEventListener("change", (e) => {
    //e.preventDefault();
    if (adressRegex.test(e.target.value)) {
      address.style.background = "white";
      adressValidation().innerText = "Adresse valide";
      adressValidation().style.color = "lightgreen";
      disableSubmit(false);
    } else {
      address.style.background = "pink";
      adressValidation().innerText = "Adresse invalide";
      adressValidation().style.color = "#fbbcbc";
      disableSubmit(true);
    }
  });

  //validation de la ville
  const cityValidation = () => {
    return document.getElementById("cityErrorMsg");
  };

  city.addEventListener("change", (e) => {
    //e.preventDefault();
    if (cityRegex.test(e.target.value)) {
      city.style.background = "white";
      cityValidation().innerText = "Nom de ville valide";
      cityValidation().style.color = "lightgreen";
      disableSubmit(false);
    } else {
      city.style.background = "pink";
      cityValidation().innerText = "Nom de ville invalide";
      cityValidation().style.color = "#fbbcbc";
      disableSubmit(true);
    }
  });

  //validation de l'adresse email
  const emailValidation = () => {
    return document.getElementById("emailErrorMsg");
  };

  email.addEventListener("change", (e) => {
    //e.preventDefault();
    if (emailRegex.test(e.target.value)) {
      email.style.background = "white";
      emailValidation().innerText = "Adresse email valide";
      emailValidation().style.color = "lightgreen";
      disableSubmit(false);
    } else {
      email.style.background = "pink";
      emailValidation().innerText = "Adresse email invalide";
      emailValidation().style.color = "#fbbcbc";
      disableSubmit(true);
    }
  });
};
secureForm();

const commandButton = document.querySelector("#order");
commandButton.addEventListener("click", (event) => {
  event.preventDefault();

  //récupération des valeurs du formulaire
  const contact = {
    firstName: document.querySelector("#firstName").value,
    lastName: document.querySelector("#lastName").value,
    address: document.querySelector("#address").value,
    city: document.querySelector("#city").value,
    email: document.querySelector("#email").value,
  };

  console.log(contact);

  // Mise en place du tableau de produits destinée au serveur
  let products = [];

  // ont boucle sur le tableau du ls afin de ressortir les id
  for (let k = 0; k < itemRecovery.length; k++) {
    products.push(itemRecovery[k].id);
  }
  //si le tableau est vide, suppression du tableau du local storage
  if (products.length === 0) {
    localStorage.removeItem(product);
  }
  console.log(products);

  // Mise en place de l'objet contact dans le local storage
  localStorage.setItem("contact", JSON.stringify(contact));

  // objet formulaire et produit à envoyer vers le serveur

  const objectSendServer = {
    products,
    contact,
  };

  console.log(objectSendServer);

  if (
    firstName.value == "" ||
    lastName.value == "" ||
    address.value == "" ||
    city.value == "" ||
    email.value == ""
  ) {
    alert("veuilllez remplir le formulaire!");
  } else {
    //fonction de configuration et d'envoi du POST vers le serveur
    function sendForm() {
      const send = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objectSendServer),
      };

      fetch("http://localhost:3000/api/products/order", send)
        .then(async (res) => {
          const contentData = await res.json();
          window.location.href = `confirmation.html?orderId=${contentData.orderId}`;
        })
        .catch((error) => console.log(error));
    }
    sendForm();
  }
});
