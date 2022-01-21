async function loading() {
  let result = await fetch("../config.json");
  return result.json();
}
