export const displayError = (container: HTMLElement) => {
  const element = document.createElement("p");
  element.style.textAlign = "center";
  element.innerHTML =
    "There was an error loading. Please refresh and try again";
  container.innerHTML = "";
  container.appendChild(element);
};
