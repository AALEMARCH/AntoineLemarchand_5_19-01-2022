const url_id = window.location.search;
const urlSearchParams = new URLSearchParams(url_id);
const product_id = urlSearchParams.get("id");
console.log(product_id);

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
  const addProducts = () => {
    let button = document.getElementById("addToCart");
    console.log(button);
    button.addEventListener("click", () => {
      let optionSelect = document.getElementById("colors");
      console.log(optionSelect);
    });
  };
});
/*
const fetchEachProducts = async () => {
  await fetch(`http://localhost:3000/api/products/${product}`)
    .then((res) => res.json())
    .then((data) => (eachProductData = data))
    .catch((res) => {
      alert("une erreur est survenue!");
    });

  console.log(eachProductData);
};


const displayEachProduct = async () => {
  await fetchEachProducts();

 
};*/

//displayEachProduct();

//envoie des données dans le local storage

const sendData = () => {
  localStorage.setItem(
    addProducts(eachProductData),
    JSON.stringify(addProducts(eachProductData))
  );
};

/*
= document.getElementById("addToCart");
addProducts.addEventListener("click", () => {
  console.log(addProducts);
});
console.log(addProducts);*/