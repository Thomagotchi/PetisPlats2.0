export function filterRecipes(recipes) {
  const url = new URL(window.location.href);
  const searchParams = url.searchParams;

  const ingredients = searchParams.getAll("ingredients");
  const appareils = searchParams.getAll("appareils");
  const ustensiles = searchParams.getAll("ustensiles");

  let filteredRecipes = recipes;

  if (ingredients.length > 0) {
    filteredRecipes = filteredRecipes.filter((recipe) => {
      return ingredients.every((ingredient) =>
        recipe.ingredients.some((recipeIngredient) =>
          recipeIngredient.ingredient
            .toLowerCase()
            .includes(ingredient.toLowerCase())
        )
      );
    });
  }

  if (appareils.length > 0) {
    filteredRecipes = filteredRecipes.filter((recipe) => {
      return appareils.some((app) =>
        recipe.appliance.toLowerCase().includes(app.toLowerCase())
      );
    });
  }

  if (ustensiles.length > 0) {
    filteredRecipes = filteredRecipes.filter((recipe) => {
      return ustensiles.every((ustensil) =>
        recipe.ustensils.some((recipeUstensil) =>
          recipeUstensil.toLowerCase().includes(ustensil.toLowerCase())
        )
      );
    });
  }

  return filteredRecipes;
}

export function watchUrlChange() {
  window.addEventListener("hashchange", handleUrlChange);
  window.addEventListener("popstate", handleUrlChange);
  window.addEventListener("urlChanged", handleUrlChange);
}

function handleUrlChange(event) {
  const url = new URL(window.location.href);
  const searchParams = url.searchParams;

  const ingredients = searchParams.getAll("ingredients");
  const appareils = searchParams.getAll("appareils");
  const ustensiles = searchParams.getAll("ustensiles");

  console.log("URL changed:", {
    ingredients,
    appareils,
    ustensiles,
    fullUrl: window.location.href,
  });

  window.dispatchEvent(
    new CustomEvent("recipesShouldUpdate", {
      detail: { ingredients, appareils, ustensiles },
    })
  );
}

export function addUrlParams(paramsType, paramsValue) {
  const url = new URL(window.location.href);
  const currentValues = url.searchParams.getAll(paramsType); // Use getAll instead of get

  if (currentValues.length > 0) {
    // Check if the value already exists to avoid duplicates
    if (!currentValues.includes(paramsValue)) {
      currentValues.push(paramsValue);
      // Remove existing params and add all new ones
      url.searchParams.delete(paramsType);
      currentValues.forEach((value) => {
        url.searchParams.append(paramsType, value);
      });
    }
  } else {
    url.searchParams.append(paramsType, paramsValue); // Use append instead of set
  }

  window.history.pushState({}, "", url);

  window.dispatchEvent(
    new CustomEvent("urlChanged", {
      detail: { paramsType, paramsValue },
    })
  );
}

// This function removes params when unchecked
export function removeUrlParam(paramsType, paramsValue) {
  const url = new URL(window.location.href);
  const currentValues = url.searchParams.getAll(paramsType); // Use getAll instead of get

  if (currentValues.length > 0) {
    const filteredValues = currentValues.filter(
      (value) => value !== paramsValue
    );

    // Remove all existing params
    url.searchParams.delete(paramsType);

    // Add back the filtered values
    filteredValues.forEach((value) => {
      url.searchParams.append(paramsType, value);
    });
  }

  window.history.pushState({}, "", url);

  window.dispatchEvent(
    new CustomEvent("urlChanged", {
      detail: { paramsType, paramsValue, action: "removed" },
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
