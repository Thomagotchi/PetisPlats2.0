export function filterRecipes(recipes) {
  return recipes;
}

export function watchUrlChange() {
  window.addEventListener("hashchange", handleUrlChange);
  window.addEventListener("popstate", handleUrlChange);
  window.addEventListener("urlChanged", handleUrlChange);
}

function handleUrlChange(event) {
  const url = new URL(window.location.href);
  const searchParams = url.searchParams;

  const ingredients = searchParams.get("ingredients");
  const appliance = searchParams.get("appliance");
  const ustensils = searchParams.get("ustensils");

  console.log("URL changed:", {
    ingredients,
    appliance,
    ustensils,
    fullUrl: window.location.href,
  });
}

function addUrlParams(paramsType, paramsValue) {
  const url = new URL(window.location.href);
  url.searchParams.set(paramsType, paramsValue);
  window.history.pushState({}, "", url);

  window.dispatchEvent(
    new CustomEvent("urlChanged", {
      detail: { paramsType, paramsValue },
    })
  );
}

const temporaryTrigger = document.querySelector(
  '[data-attribute="temporary-trigger"]'
);

if (temporaryTrigger) {
  temporaryTrigger.addEventListener("click", () => {
    addUrlParams("ingredients", "Lait de coco");
  });
}

watchUrlChange();
