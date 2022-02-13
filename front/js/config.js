/*fonction qui paramètre un fetch sur l'API de manière asynchrone, elle permettra notamment d'éviter les répétitions par la suite*/
async function loading() {
  let result = await fetch("../config.json");
  return result.json();
}
