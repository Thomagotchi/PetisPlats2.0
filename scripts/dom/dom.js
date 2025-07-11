import { recipes } from "../../data/recipes.js";
import { addUrlParams, filterRecipes, removeUrlParam } from "../api/api.js";

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

// This function renders the HTML for an option in the checked or unchecked format
function renderSelectOption(option, checked, selectType) {
  const targetGallery = checked
    ? document.getElementById(selectType + "-checked-filters")
    : document.getElementById(selectType + "-unchecked-filters");

  const element = `
    <div class="flex relative cursor-pointer">
      <input type="checkbox" value="${option}" ${
    checked ? "checked" : ""
  } class="peer border-none opacity-0 outline-none absolute top-0 left-0 z-10 bg-[transparent] w-full h-full cursor-pointer">
      <label class="text-primary font-manrope text-[14px] font-[400] leading-[100%] w-full peer-checked:bg-secondary peer-checked:py-[9px] px-[16px] cursor-pointer">${option}</label>
    </div>
  `;

  targetGallery.insertAdjacentHTML("beforeend", element);
}

// This function updates the counter for recipes
export function updateRecipesCounter(recipes) {
  const recipesCounter = document.getElementById("recipes-counter");
  recipesCounter.innerText = `${recipes.length} recettes`;
}

// This function updates the empty selects with the corresponding options
export function updateSelect(selectType, recipes) {
  const select = document.getElementById(selectType + "-dropdown");
  const selectLabel = document.getElementById(selectType + "-dropdown-label");
  const selectCheckedFilters = document.getElementById(
    selectType + "-checked-filters"
  );
  const selectUncheckedFilters = document.getElementById(
    selectType + "-unchecked-filters"
  );
  const selectContent = document.getElementById(
    selectType + "-dropdown-content"
  );
  const allOptions = [];
  const checkedOptions = new Set();

  // Remove existing event listener to prevent duplicates
  const newSelectLabel = selectLabel.cloneNode(true);
  selectLabel.parentNode.replaceChild(newSelectLabel, selectLabel);

  // Toggle dropdown open / close
  newSelectLabel.addEventListener("click", (e) => {
    selectContent.classList.toggle("h-[324px]");
    selectContent.classList.toggle("overflow-y-scroll");
    document
      .getElementById(selectType + "-dropdown-icn")
      .classList.toggle("rotate-180");
  });

  selectCheckedFilters.innerHTML = "";
  selectUncheckedFilters.innerHTML = "";

  recipes.forEach((recipe) => {
    if (selectType === "ingredients") {
      recipe.ingredients.forEach((ingredientObj) => {
        if (!allOptions.includes(ingredientObj.ingredient)) {
          allOptions.push(ingredientObj.ingredient);
        }
      });
    } else if (selectType === "ustensiles") {
      recipe.ustensils.forEach((ustensilObj) => {
        if (!allOptions.includes(ustensilObj)) {
          allOptions.push(ustensilObj);
        }
      });
    } else if (selectType === "appareils") {
      if (!allOptions.includes(recipe.appliance)) {
        allOptions.push(recipe.appliance);
      }
    }
  });

  allOptions.forEach((option) => {
    renderSelectOption(option, false, selectType);
  });

  // Add event listeners to all checkboxes
  addCheckboxListeners(selectType, allOptions, checkedOptions);
}

// This function adds the corresponding listener to checked and unchecked boxes
function addCheckboxListeners(selectType, allOptions, checkedOptions) {
  const selectCheckedFilters = document.getElementById(
    selectType + "-checked-filters"
  );
  const selectUncheckedFilters = document.getElementById(
    selectType + "-unchecked-filters"
  );

  // Unchecked filter listener
  selectUncheckedFilters.addEventListener("change", (e) => {
    if (e.target.type === "checkbox") {
      const option = e.target.value;
      if (e.target.checked) {
        e.target.closest("div").style.display = "none";
        checkedOptions.add(option);
        renderSelectOption(option, true, selectType);

        // Add to URL parameters
        addUrlParams(selectType, option);
      }
    }
  });

  // Check filter listener
  selectCheckedFilters.addEventListener("change", (e) => {
    if (e.target.type === "checkbox") {
      const option = e.target.value;

      if (!e.target.checked) {
        checkedOptions.delete(option);
        e.target.closest("div").remove();
        const originalOption = selectUncheckedFilters.querySelector(
          `input[value="${option}"]`
        );
        if (originalOption) {
          originalOption.closest("div").style.display = "flex";
          originalOption.checked = false;
        }

        // Remove from URL parameters
        removeUrlParam(selectType, option);
      }
    }
  });
}

// Init functions
renderRecipes(recipes);
updateSelect("ingredients", recipes);
updateSelect("appareils", recipes);
updateSelect("ustensiles", recipes);

// Listen for URL changes and update recipes
window.addEventListener("recipesShouldUpdate", (event) => {
  const filteredRecipes = filterRecipes(recipes);
  renderRecipes(filteredRecipes);
});
