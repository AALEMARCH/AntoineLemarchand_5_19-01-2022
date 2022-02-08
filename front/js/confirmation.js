//récupération de l'ID du formulaire et affichage du message de confirmation

const orderIdRetrieval = () => {
  const url_orderId = window.location.search;
  const urlSearchParams = new URLSearchParams(url_orderId);
  const orderId = urlSearchParams.get("orderId");
  document.getElementById("orderId").textContent = orderId;
};
orderIdRetrieval();
