import { recipes } from "../../data/recipes.js";

export function renderRecipes(recipes) {
  const recipeTemplate = document.querySelector(
    '[data-attribute="recipe-template"]'
  );
  const recipesGallery = document.querySelector(
    '[data-attribute="recipes-gallery"]'
  );

  recipesGallery.innerHTML = "";

  recipes.forEach((recipe) => {
    const recipeClone = recipeTemplate.cloneNode(true);
    recipeClone.setAttribute("data-name", recipe.name);
    recipeClone.removeAttribute("data-attribute", "recipe-template");
    recipeClone.setAttribute("data-attribute", "recipe");
    recipeClone.style.display = "flex";
    recipeClone.querySelector(
      '[data-attribute="recipe-image"]'
    ).src = `./assets/recipes/${recipe.image}`;
    recipeClone.querySelector('[data-attribute="recipe-name"]').innerText =
      recipe.name;
    recipeClone.querySelector(
      '[data-attribute="recipe-recipe-text"]'
    ).innerText = recipe.description;

    const ingredientsContainer = recipeClone.querySelector(
      '[data-attribute="recipe-ingredient"]'
    ).parentElement;
    ingredientsContainer.innerHTML = "";

    recipe.ingredients.forEach((ingredient, i) => {
      const ingredientDiv = document.createElement("div");
      ingredientDiv.className = "flex flex-col gap-[1px]";
      ingredientDiv.innerHTML = `
        <p class="text-primary font-manrope text-[14px] font-[500] leading-[140%]">${
          ingredient.ingredient
        }</p>
        <p class="text-tertiary font-manrope text-[14px] font-[400] leading-[140%]">${
          ingredient.quantity || ""
        }${ingredient.unit || ""}</p>
      `;
      ingredientsContainer.appendChild(ingredientDiv);
    });

    recipeClone.setAttribute("data-utensils", recipe.ustensils.join(", "));

    recipeClone.querySelector(
      '[data-attribute="recipe-time"]'
    ).innerText = `${recipe.time}min`;
    recipesGallery.appendChild(recipeClone);
  });

  updateRecipesCounter();
}

export function updateRecipesCounter() {
  const recipesCounter = document.querySelector(
    '[data-attribute="recipes-counter"]'
  );
  const currentRecipes = Array.from(
    document.querySelectorAll('[data-attribute="recipe"]')
  );
  recipesCounter.innerText = `${currentRecipes.length} recettes`;
}

// TODO:
// I will change from select to radio with custom dropdown to make multiple selection and dom manipulation easier
export function updateSelect(selectType, recipes) {
  const select = document.getElementById(selectType);
  const options = select.querySelectorAll("option");
  const allOptions = new Set();

  Array.from(options.entries()).map((option, index) => {
    if (index !== 0) {
      option.remove();
    }
  });

  recipes.forEach((recipe) => {
    if (selectType === "ingredients") {
      recipe.ingredients.forEach((ingredientObj) => {
        allOptions.add(ingredientObj.ingredient);
      });
    } else if (typeof recipe[selectType] === "string") {
      allOptions.add(recipe[selectType]);
    } else {
      recipe[selectType].forEach((option) => {
        allOptions.add(option);
      });
    }
  });

  Array.from(allOptions).forEach((option) => {
    const newOption = document.createElement("option");
    newOption.value = option;
    newOption.innerText = option;
    select.appendChild(newOption);
  });
}

renderRecipes(recipes);
updateSelect("ingredients", recipes);
updateSelect("appliance", recipes);
updateSelect("ustensils", recipes);
