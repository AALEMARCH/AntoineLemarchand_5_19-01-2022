const product = window.location.search.split("?id=").join("");
console.log(product);

let eachProductData = [];

const fetchEachProducts = async () => {
  await fetch(`http://localhost:3000/api/products/${product}`)
    .then((res) => res.json())
    .then((data) => (eachProductData = data))
    .catch((res) => {
      alert("une erreur est survenue!");
    });

  console.log(eachProductData);
};

fetchEachProducts();
