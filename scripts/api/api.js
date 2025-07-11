export function filterRecipes(recipes) {
  const url = new URL(window.location.href);
  const searchParams = url.searchParams;

  const ingredients = searchParams.get("ingredients");
  const appliance = searchParams.get("appliance");
  const ustensils = searchParams.get("ustensils");

  let filteredRecipes = recipes;

  if (ingredients) {
    const ingredientList = ingredients.split(",").map((item) => item.trim());
    filteredRecipes = filteredRecipes.filter((recipe) => {
      return ingredientList.every((ingredient) =>
        recipe.ingredients.some((recipeIngredient) =>
          recipeIngredient.ingredient
            .toLowerCase()
            .includes(ingredient.toLowerCase())
        )
      );
    });
  }

  if (appliance) {
    const applianceList = appliance.split(",").map((item) => item.trim());
    filteredRecipes = filteredRecipes.filter((recipe) => {
      return applianceList.some((app) =>
        recipe.appliance.toLowerCase().includes(app.toLowerCase())
      );
    });
  }

  if (ustensils) {
    const ustensilList = ustensils.split(",").map((item) => item.trim());
    filteredRecipes = filteredRecipes.filter((recipe) => {
      return ustensilList.every((ustensil) =>
        recipe.ustensils.some((recipeUstensil) =>
          recipeUstensil.toLowerCase().includes(ustensil.toLowerCase())
        )
      );
    });
  }

  // TODO: There are duplicates in the filters due to
  // capital letters, and the filtering is taking into
  // consideration if the recipe has one, i want it to
  // filter by all filters
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

  const ingredients = searchParams.get("ingredients");
  const appliance = searchParams.get("appliance");
  const ustensils = searchParams.get("ustensils");

  console.log("URL changed:", {
    ingredients,
    appliance,
    ustensils,
    fullUrl: window.location.href,
  });

  window.dispatchEvent(
    new CustomEvent("recipesShouldUpdate", {
      detail: { ingredients, appliance, ustensils },
    })
  );
}

export function addUrlParams(paramsType, paramsValue) {
  const url = new URL(window.location.href);
  const currentValues = url.searchParams.get(paramsType);

  if (currentValues) {
    // Check if the value already exists to avoid duplicates
    const values = currentValues.split(",").map((v) => v.trim());
    if (!values.includes(paramsValue)) {
      values.push(paramsValue);
      url.searchParams.set(paramsType, values.join(","));
    }
  } else {
    url.searchParams.set(paramsType, paramsValue);
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
  const currentValues = url.searchParams.get(paramsType);

  if (currentValues) {
    const values = currentValues
      .split(",")
      .filter((value) => value.trim() !== paramsValue);

    if (values.length > 0) {
      url.searchParams.set(paramsType, values.join(","));
    } else {
      url.searchParams.delete(paramsType);
    }
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
