/*fonction qui parametre un fetch sur l'API de maniere asynchrone, elle permettra notemment d'éviter les repetitions par la suite*/
async function loading() {
  let result = await fetch("../config.json");
  return result.json();
}
