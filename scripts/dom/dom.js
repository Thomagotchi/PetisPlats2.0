import { recipes } from "../../data/recipes.js";

// This function takes an array, iterates over it and renders each recipe to the DOM
export function renderRecipes(recipes) {
  const recipesGallery = document.getElementById("recipes-gallery");

  recipesGallery.innerHTML = "";

  recipes.forEach((recipe) => {
    renderRecipe(recipe);
  });

  updateRecipesCounter(recipes);
}

// This is the template generated in JS for a single recipe
export function renderRecipe(recipe) {
  const recipeElement = `
    <article class="w-full h-[731px] bg-white rounded-[21px] shadow-card relative none flex-col overflow-hidden">
      <span class="absolute top-[22px] right-[22px] text-primary text-[12px] font-manrope font-[400] leading-[100%] py-[5px] px-[15px] bg-secondary rounded-[14px]">${
        recipe.time
      }min</span>
      <img src="./assets/recipes/${
        recipe.image
      }" class="w-full h-[253px] object-cover" alt="Photo d'un plat de cuisine.">
      <div class="px-[25px] pt-[32px] pb-[61px] flex flex-col gap-[29px] grow">
        <h2 class="text-primary font-anton text-[18px] font-[400] leading-[140%]">${
          recipe.name
        }</h2>
        <div class="flex flex-col gap-[10px]">
          <h3 class="text-tertiary font-manrope text-[12px] font-[700] leading-[140%]">RECETTE</h3>
          <p class="text-primary font-manrope text-[14px] font-[400] leading-[140%] max-h-[4lh] overflow-hidden line-clamp-4">${
            recipe.description
          }</p>
        </div>
        <div class="flex flex-col gap-[10px]">
          <h3 class="text-tertiary font-manrope text-[12px] font-[700] leading-[140%]">INGRÉDIENTS</h3>
          <div class="w-full grid grid-cols-2 gap-y-[21px]">
            ${recipe.ingredients
              .map((ingredient) => {
                return `
                <div class="flex flex-col gap-[1px]">
                  <p class="text-primary font-manrope text-[14px] font-[500] leading-[140%]">${ingredient.ingredient}</p>
                  <p class="text-tertiary font-manrope text-[14px] font-[400] leading-[140%]">${ingredient.quantity} ${ingredient.unit}</p>
                </div>
              `;
              })
              .join("")}
          </div>
        </div>
      </div>
    </article>
  `;
  document
    .getElementById("recipes-gallery")
    .insertAdjacentHTML("beforeend", recipeElement);
}

// This function updates the counter for recipes
export function updateRecipesCounter(recipes) {
  const recipesCounter = document.getElementById("recipes-counter");
  recipesCounter.innerText = `${recipes.length} recettes`;
}

// TODO:
// I will change from select to checkboxs with custom dropdown to make multiple selection and dom manipulation easier
export function updateSelect(selectType, recipes) {
  const select = document.getElementById(selectType + "-dropdown");
  const selectLabel = document.getElementById(selectType + "-dropdown-label");
  const selectContent = document.getElementById(
    selectType + "-dropdown-content"
  );
  const options = select.querySelectorAll("input[type='checkbox']");
  const allOptions = new Set();

  selectLabel.addEventListener("click", () => {
    selectContent.classList.toggle("h-[100px!important]");
    document
      .getElementById(selectType + "-dropdown-icon")
      .classList.toggle("rotate-180");
  });

  Array.from(options.entries()).map((option, index) => {
    if (option.checked) {
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

  // Array.from(allOptions).forEach((option) => {
  //   const newOption = document.createElement("input");
  //   newOption.type = "checkbox";
  //   newOption.value = option;
  //   newOption.id = selectType + "-" + option;
  //   newOption.name = selectType;
  //   select.appendChild(newOption);
  // });
}

renderRecipes(recipes);
updateSelect("ingredients", recipes);
