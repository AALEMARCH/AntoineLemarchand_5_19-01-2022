//********************************************Récupération du local storage
let itemRecovery = JSON.parse(localStorage.getItem("product"));

//******************************************Si le local storage est vide, ou si il y a quelque chose
const cartDisplay = () => {
  if (itemRecovery === null) {
    alert("votre panier est vide");
    itemRecovery = [];
    console.log(itemRecovery);
  } else if (itemRecovery) {
    for (let product in itemRecovery) {
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
  //récupération des quantité de chaques produit présent dans le local storage
  let quantityCart = [];
  for (let a = 0; a < itemRecovery.length; a++) {
    let totalQuantityCart = itemRecovery[a].quantity;
    quantityCart.push(totalQuantityCart);
  }

  //convertion du tableau de chaine "quantityCart", en nombre entiers et addition des valeurs de produit individuel
  let sumProductQuantity = 0;
  for (let e = 0; e < quantityCart.length; e++) {
    quantityCart[e] = parseInt(quantityCart[e]);
    sumProductQuantity += quantityCart[e];
  }

  //insertion de la quantité total dans le dom
  let totalQuantity = document.querySelector("#totalQuantity");
  totalQuantity.innerHTML = sumProductQuantity;
}
getTotalQuantity();

//*******************************************Calcul du prix total

// Ciblage des produit du local storage a l'aide d'un fetch et d'une comparaison avec les donnée API
function getTotalPrice() {
  let totalPriceCart = 0;
  for (let i = 0; i < itemRecovery.length; i++) {
    loading().then((data) => {
      config = data;
      fetch(config.host + `/api/products/${itemRecovery[i].id}`)
        .then((res) => res.json())
        .catch((err) => console.log(err))
        .then((data) => {
          // ont incrémente la variable dedié au prix total, avec une multiplication du prix API par la quantité local storage
          totalPriceCart +=
            Number(data.price) * Number(itemRecovery[i].quantity);

          //insertion du prix total dans le dom
          let domTotalPrice = document.querySelector("#totalPrice");
          domTotalPrice.innerHTML = totalPriceCart;

          //*********************************************************Activation du boutton supprimer
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

          //**********************************************Modification de la quantité sur le panier
          const changeQuantity = () => {
            const baliseQuantity = document.querySelectorAll(".itemQuantity");

            for (let y = 0; y < baliseQuantity.length; y++) {
              baliseQuantity[y].addEventListener("change", (event) => {
                event.preventDefault();

                //ciblage de l'ID du produit, de sa couleur, du produit déja selectionner, et du changement effectuer
                let eventId = event.target.closest(".cart__item").dataset.id;
                let eventColor =
                  event.target.closest(".cart__item").dataset.color;
                let savedProduct = itemRecovery[y].quantity;
                let modif = Number(baliseQuantity[y].value);

                const res = itemRecovery.find(
                  (el) =>
                    //Ont cherche les element modifié qui sont different des element sauvegarder et si ils ont le meme ID et la meme couleurs
                    el.modif !== savedProduct &&
                    el.id === eventId &&
                    el.color === eventColor
                );

                res.quantity = modif;
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
}
getTotalPrice();

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

  // stockage des input
  let firstName = document.getElementById("firstName");
  let lastName = document.getElementById("lastName");
  let address = document.getElementById("address");
  let city = document.getElementById("city");
  let email = document.getElementById("email");

  //fonction de désactivation du bouton d'envoie du formulaire
  function disableSubmit(disabled) {
    if (disabled) {
      document.getElementById("order").setAttribute("disabled", true);
    } else {
      document.getElementById("order").removeAttribute("disabled", false);
    }
  }

  const stopForm = () => {
    if (firstName.value == undefined) {
      document.getElementById("order").setAttribute("disabled", true);
    }
  };
  stopForm();
  //validation du prenom
  const nameValidation = () => {
    return document.getElementById("firstNameErrorMsg");
  };

  firstName.addEventListener("input", (e) => {
    if (nameRegex.test(e.target.value)) {
      firstName.style.background = "white";
      nameValidation().innerText = "Prenom valide";
      disableSubmit(false);
    } else {
      firstName.style.background = "pink";
      nameValidation().innerText = "Prenom invalide";
      disableSubmit(true);
    }
  });

  //validation du nom
  const lastNameValidation = () => {
    return document.getElementById("lastNameErrorMsg");
  };

  lastName.addEventListener("input", (e) => {
    if (lastNameRegex.test(e.target.value)) {
      lastName.style.background = "white";
      lastNameValidation().innerText = "Nom valide";
      disableSubmit(false);
    } else {
      lastName.style.background = "pink";
      lastNameValidation().innerText = "Nom invalide";
      disableSubmit(true);
    }
  });

  //validation de l'adresse
  const adressValidation = () => {
    return document.getElementById("addressErrorMsg");
  };

  address.addEventListener("input", (e) => {
    if (adressRegex.test(e.target.value)) {
      address.style.background = "white";
      adressValidation().innerText = "Adresse valide";
      disableSubmit(false);
    } else {
      address.style.background = "pink";
      adressValidation().innerText = "Adresse invalide";
      disableSubmit(true);
    }
  });

  //validation de la ville
  const cityValidation = () => {
    return document.getElementById("cityErrorMsg");
  };

  city.addEventListener("input", (e) => {
    if (cityRegex.test(e.target.value)) {
      city.style.background = "white";
      cityValidation().innerText = "Nom de ville valide";
      disableSubmit(false);
    } else {
      city.style.background = "pink";
      cityValidation().innerText = "Nom de ville invalide";
      disableSubmit(true);
    }
  });

  //validation de l'adresse email
  const emailValidation = () => {
    return document.getElementById("emailErrorMsg");
  };

  email.addEventListener("input", (e) => {
    if (emailRegex.test(e.target.value)) {
      email.style.background = "white";
      emailValidation().innerText = "Adresse email valide";
      disableSubmit(false);
    } else {
      email.style.background = "pink";
      emailValidation().innerText = "Adresse email invalide";
      disableSubmit(true);
    }
  });
};
secureForm();

//fonction d'envoie du formulaire
const postForm = () => {
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

    // Mise en place du tableau de produits desttiné au server
    let products = [];
    for (let k = 0; k < itemRecovery.length; k++) {
      products.push(itemRecovery[k].id);
    }

    // Mise en place de l'objet formValues dans le local storage
    localStorage.setItem("contact", JSON.stringify(contact));

    // objet formulaire et produit a envoyer ver le server
    const objectSendServer = {
      products,
      contact,
    };
    console.log(objectSendServer);

    //Envoie au serveur
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
          console.log(res);
          const contentData = await res.json();
          console.log(contentData);
          window.location.href = `confirmation.html?orderId=${contentData.orderId}`;
        })
        .catch((error) => console.log(error));
    }
    sendForm();
  });
};
postForm();
