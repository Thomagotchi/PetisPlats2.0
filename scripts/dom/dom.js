import { recipes } from "../../data/recipes.js";
import { addUrlParams, filterRecipes, removeUrlParam } from "../api/api.js";

// TO DO :
// Apply early return to all functions
// Extrapolate nested functions
// Add Second search function
// Measure both performances and justify why

// Cette fonction affiche toutes les recettes dans la galerie en partant d'un array
export function renderRecipes(recipes) {
  const recipesGallery = document.getElementById("recipes-gallery");

  recipesGallery.innerHTML = "";

  recipes.forEach((recipe) => {
    renderRecipe(recipe);
  });

  updateRecipesCounter(recipes);
}

// Cette fonction retourne le HTML pour une recette
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
                  <p class="text-primary font-manrope text-[14px] font-[500] leading-[140%]">${
                    ingredient.ingredient
                  }</p>
                  <p class="text-tertiary font-manrope text-[14px] font-[400] leading-[140%]">${
                    ingredient.quantity ? ingredient.quantity : ""
                  } ${ingredient.unit ? ingredient.unit : ""}</p>
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

// Cette fonction met à jour le compteur de recettes
export function updateRecipesCounter(recipes) {
  const recipesCounter = document.getElementById("recipes-counter");
  recipesCounter.innerText = `${recipes.length} recettes`;
}

// Cette fonction retourne le HTML pour une option de filtre (checked / unchecked)
function renderSelectOption(option, checked, selectType) {
  const targetGallery = checked
    ? document.getElementById(selectType + "-checked-filters")
    : document.getElementById(selectType + "-unchecked-filters");

  const element = `
    <div class="flex relative cursor-pointer">
      <input type="checkbox" value="${option}" ${
    checked ? "checked" : ""
  } class="peer border-none opacity-0 outline-none absolute top-0 left-0 z-10 bg-[transparent] w-full h-full cursor-pointer">
      ${
        checked
          ? `
          <svg
            class="absolute right-[16px] top-[7px] hidden peer-hover:block"
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
          >
            <circle cx="8.5" cy="8.5" r="8.5" fill="black" />
            <path
              d="M11 11L8.5 8.5M8.5 8.5L6 6M8.5 8.5L11 6M8.5 8.5L6 11"
              stroke="#FFD15B"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        `
          : ""
      }
      <label class="text-primary font-manrope text-[14px] font-[400] leading-[100%] w-full peer-checked:bg-secondary peer-checked:py-[9px] px-[16px] cursor-pointer">${option}</label>
    </div>
  `;

  targetGallery.insertAdjacentHTML("beforeend", element);
}

// Cette fonction retourne le HTML pour une option de filtre checked en dehors du select (au dessus de la galerie)
function renderCheckedOption(option) {
  return `
    <div class="flex items-center justify-between bg-secondary py-[17px] px-[18px] rounded-[10px] cursor-pointer">
      <span class="text-primary font-manrope text-[14px] font-[400] leading-[100%]">${option}</span>
      <svg class="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" fill="none">
        <path d="M12 11.5L7 6.5M7 6.5L2 1.5M7 6.5L12 1.5M7 6.5L2 11.5" stroke="#1B1B1B" stroke-width="2.16667" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  `;
}

// Cette fonction met à jour le conteneur de filtres cochés avec une option et ajoute le listener de filtration
function updateCheckedFiltersContainer(selectType) {
  const container = document.getElementById(
    selectType + "-checked-filters-container"
  );
  const params = new URLSearchParams(window.location.search);
  const checkedOptions = params.getAll(selectType);

  container.innerHTML = "";

  checkedOptions.forEach((option) => {
    const optionElement = document.createElement("div");
    optionElement.innerHTML = renderCheckedOption(option, selectType);

    const closeIcon = optionElement.querySelector("svg");
    closeIcon.addEventListener("click", () => {
      removeUrlParam(selectType, option);
      updateFilters(selectType);
      updateCheckedFiltersContainer(selectType);

      const updated = getFilteredRecipesFromUrl();
      renderRecipes(updated);
    });

    container.appendChild(optionElement.firstElementChild);
  });
}

// Cette fonction met à jour le select avec les options
export function updateSelect(selectType, recipes) {
  const select = document.getElementById(selectType + "-dropdown");
  const selectLabel = document.getElementById(selectType + "-dropdown-label");
  const selectContent = document.getElementById(
    selectType + "-dropdown-content"
  );

  const newSelectLabel = selectLabel.cloneNode(true);
  selectLabel.parentNode.replaceChild(newSelectLabel, selectLabel);

  newSelectLabel.addEventListener("click", (e) => {
    selectContent.classList.toggle("h-[324px]");
    select.classList.toggle("h-[192px]");
    selectContent.classList.toggle("overflow-y-scroll");
    selectContent.classList.toggle("mb-[20px]");
    document
      .getElementById(selectType + "-dropdown-icn")
      .classList.toggle("rotate-180");
  });

  updateFilters(selectType);

  addCheckboxListeners(selectType);
  addSearchInputListeners(selectType);
}

// Cette fonction filtre les options du select en fonction de la recherche
function filterOptions(searchInput, selectType) {
  const allSearchInputs = searchInput.split(" ");
  const uncheckedGallery = document.getElementById(
    selectType + "-unchecked-filters"
  );

  uncheckedGallery.querySelectorAll("div").forEach((option) => {
    const optionText = option.querySelector("label").textContent.toLowerCase();
    const shouldShow = allSearchInputs.every((input) =>
      optionText.includes(input.toLowerCase())
    );
    option.style.display = shouldShow ? "flex" : "none";
  });
}

function addSearchInputListeners(selectType) {
  const searchInput = document.getElementById(selectType + "-search-input");
  const closeIcon = searchInput.parentElement.querySelector('svg[width="8"]');

  searchInput.addEventListener("input", (e) => {
    const value = e.target.value;
    filterOptions(value, selectType);

    if (value.length > 0) {
      closeIcon.classList.remove("hidden");
    } else {
      closeIcon.classList.add("hidden");
    }
  });

  closeIcon.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    closeIcon.classList.add("hidden");
    filterOptions("", selectType);
  });
}

export function getFilteredRecipesFromUrl() {
  const params = new URLSearchParams(window.location.search);

  const ingredientFilters = params.getAll("ingredients");
  const utensilFilters = params.getAll("ustensiles");
  const applianceFilters = params.getAll("appareils");
  const searchValue = params.get("search");

  return recipes.filter((r) => {
    // Apply search filter
    if (searchValue && searchValue.trim() !== "") {
      const searchTerm = searchValue.toLowerCase().trim();
      const recipeName = r.name.toLowerCase();
      const recipeDescription = r.description.toLowerCase();
      const recipeIngredients = r.ingredients
        .map((ing) => ing.ingredient.toLowerCase())
        .join(" ");

      const matchesSearch =
        recipeName.includes(searchTerm) ||
        recipeDescription.includes(searchTerm) ||
        recipeIngredients.includes(searchTerm);

      if (!matchesSearch) return false;
    }

    const okIngredients =
      ingredientFilters.length === 0
        ? true
        : ingredientFilters.every((ing) =>
            r.ingredients.some(
              (obj) => obj.ingredient.toLowerCase() === ing.toLowerCase()
            )
          );

    const okUtensils =
      utensilFilters.length === 0
        ? true
        : utensilFilters.every((u) =>
            r.ustensils.some((obj) => obj.toLowerCase() === u.toLowerCase())
          );

    const okAppliances =
      applianceFilters.length === 0
        ? true
        : applianceFilters.every(
            (a) => r.appliance.toLowerCase() === a.toLowerCase()
          );

    return okIngredients && okUtensils && okAppliances;
  });
}

function updateFilters(selectType) {
  const selectCheckedFilters = document.getElementById(
    selectType + "-checked-filters"
  );
  const selectUncheckedFilters = document.getElementById(
    selectType + "-unchecked-filters"
  );

  const params = new URLSearchParams(window.location.search);
  const checkedOptions = params.getAll(selectType);

  selectCheckedFilters.innerHTML = "";
  selectUncheckedFilters.innerHTML = "";

  const allOptions = [];
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

  const sortedOptions = allOptions
    .map(
      (option) => option.charAt(0).toUpperCase() + option.slice(1).toLowerCase()
    )
    .filter((option, index, array) => {
      const normalizedOption = option.toLowerCase().normalize("NFD");

      for (let i = 0; i < index; i++) {
        const normalizedExisting = array[i].toLowerCase().normalize("NFD");

        if (normalizedOption === normalizedExisting) {
          return false;
        }
      }

      if (option.endsWith("s")) {
        const singularForm = option.slice(0, -1);
        if (array.includes(singularForm)) {
          return false;
        }
      }

      const pluralForm = option + "s";
      if (array.includes(pluralForm)) {
        const singularIndex = array.indexOf(option);
        const pluralIndex = array.indexOf(pluralForm);
        return singularIndex <= pluralIndex;
      }

      return true;
    })
    .sort();

  sortedOptions.forEach((option) => {
    const isChecked = checkedOptions.some(
      (checkedOption) => checkedOption.toLowerCase() === option.toLowerCase()
    );
    renderSelectOption(option, isChecked, selectType);
  });

  updateCheckedFiltersContainer(selectType);
}

// Cette fonction ajoute les listeners aux checkboxes
function addCheckboxListeners(selectType) {
  const uncheckedGallery = document.getElementById(
    `${selectType}-unchecked-filters`
  );
  uncheckedGallery.addEventListener("change", onCheckboxToggle);
  document
    .getElementById(`${selectType}-checked-filters`)
    .addEventListener("change", onCheckboxToggle);

  function onCheckboxToggle(e) {
    if (e.target.type !== "checkbox") return;
    const option = e.target.value;

    const searchInput = document.getElementById(selectType + "-search-input");
    const currentSearchValue = searchInput ? searchInput.value : "";

    if (e.target.checked) {
      addUrlParams(selectType, option);
      updateFilters(selectType);
    } else {
      removeUrlParam(selectType, option);
      updateFilters(selectType);
    }

    if (currentSearchValue) {
      filterOptions(currentSearchValue, selectType);
    }

    const updated = getFilteredRecipesFromUrl();
    renderRecipes(updated);
  }
}

// Fonction pour la search bar principale
export function initializeMainSearch() {
  const searchInput = document.getElementById("main-search-input");
  const resetIcon = document.getElementById("main-search-reset");

  if (!searchInput || !resetIcon) return;

  const urlParams = new URLSearchParams(window.location.search);
  const searchValue = urlParams.get("search");
  if (searchValue) {
    searchInput.value = searchValue;
    resetIcon.classList.remove("hidden");
  }

  searchInput.addEventListener("input", (e) => {
    const value = e.target.value;

    if (value.length > 0) {
      resetIcon.classList.remove("hidden");
    } else {
      resetIcon.classList.add("hidden");
    }

    updateSearchUrlParam(value);

    const updated = getFilteredRecipesFromUrl();
    renderRecipes(updated);
  });

  resetIcon.addEventListener("click", () => {
    searchInput.value = "";
    resetIcon.classList.add("hidden");
    updateSearchUrlParam("");

    const updated = getFilteredRecipesFromUrl();
    renderRecipes(updated);
  });
}

function updateSearchUrlParam(searchValue) {
  const url = new URL(window.location.href);

  if (searchValue && searchValue.trim() !== "") {
    url.searchParams.set("search", searchValue.trim());
  } else {
    url.searchParams.delete("search");
  }

  window.history.pushState({}, "", url);

  window.dispatchEvent(
    new CustomEvent("urlChanged", {
      detail: { searchValue },
    })
  );
}

const initialRecipes = getFilteredRecipesFromUrl();
renderRecipes(initialRecipes);
updateSelect("ingredients", recipes);
updateSelect("appareils", recipes);
updateSelect("ustensiles", recipes);
initializeMainSearch();

window.addEventListener("recipesShouldUpdate", (event) => {
  const filteredRecipes = filterRecipes(recipes);
  renderRecipes(filteredRecipes);
});
