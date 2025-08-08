import { recipes } from "../../data/recipes.js";
import { addUrlParams, filterRecipes, removeUrlParam } from "../api/api.js";

// Cette fonction affiche toutes les recettes dans la galerie en partant d'un array
export function renderRecipes(recipes) {
  const recipesGallery = document.getElementById("recipes-gallery");
  if (!recipesGallery) return;

  // Efface la galerie d'abord, quel que soit le nombre de recettes
  recipesGallery.innerHTML = "";

  if (!recipes || recipes.length === 0) {
    updateRecipesCounter([]);
    return;
  }

  recipes.forEach((recipe) => {
    renderRecipe(recipe);
  });

  updateRecipesCounter(recipes);
}

// Cette fonction retourne le HTML pour une recette
export function renderRecipe(recipe) {
  if (!recipe) return;

  const recipesGallery = document.getElementById("recipes-gallery");
  if (!recipesGallery) return;

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
            ${recipe.ingredients.map(renderIngredient).join("")}
          </div>
        </div>
      </div>
    </article>
  `;

  recipesGallery.insertAdjacentHTML("beforeend", recipeElement);
}

// Cette fonction retourne le HTML pour un ingrédient
function renderIngredient(ingredient) {
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
}

// Cette fonction met à jour le compteur de recettes
export function updateRecipesCounter(recipes) {
  const recipesCounter = document.getElementById("recipes-counter");
  if (!recipesCounter) return;

  recipesCounter.innerText = `${recipes.length} recettes`;
}

// Cette fonction retourne le HTML pour une option de filtre (checked / unchecked)
function renderSelectOption(option, checked, selectType) {
  if (!option || !selectType) return;

  const targetGallery = checked
    ? document.getElementById(selectType + "-checked-filters")
    : document.getElementById(selectType + "-unchecked-filters");

  if (!targetGallery) return;

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
  if (!option) return "";

  return `
    <div class="flex items-center justify-between bg-secondary py-[17px] px-[18px] rounded-[10px] cursor-pointer">
      <span class="text-primary font-manrope text-[14px] font-[400] leading-[100%]">${option}</span>
      <svg class="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" fill="none">
        <path d="M12 11.5L7 6.5M7 6.5L2 1.5M7 6.5L12 1.5M7 6.5L2 11.5" stroke="#1B1B1B" stroke-width="2.16667" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  `;
}

// Cette fonction gère le clic sur l'icône de fermeture d'une option
function handleCloseIconClick(selectType, option) {
  removeUrlParam(selectType, option);
  updateFilters(selectType);
  updateCheckedFiltersContainer(selectType);

  const updated = getFilteredRecipesFromUrl();
  renderRecipes(updated);
}

// Cette fonction met à jour le conteneur de filtres cochés avec une option et ajoute le listener de filtration
function updateCheckedFiltersContainer(selectType) {
  if (!selectType) return;

  const container = document.getElementById(
    selectType + "-checked-filters-container"
  );
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const checkedOptions = params.getAll(selectType);

  container.innerHTML = "";

  checkedOptions.forEach((option) => {
    const optionElement = document.createElement("div");
    optionElement.innerHTML = renderCheckedOption(option, selectType);

    const closeIcon = optionElement.querySelector("svg");
    if (!closeIcon) return;

    closeIcon.addEventListener("click", () =>
      handleCloseIconClick(selectType, option)
    );

    container.appendChild(optionElement.firstElementChild);
  });
}

// Cette fonction gère le clic sur le label du select
function handleSelectLabelClick(selectType) {
  const selectContent = document.getElementById(
    selectType + "-dropdown-content"
  );
  const select = document.getElementById(selectType + "-dropdown");
  const dropdownIcon = document.getElementById(selectType + "-dropdown-icn");

  selectContent.classList.toggle("h-[324px]");
  select.classList.toggle("h-[192px]");
  selectContent.classList.toggle("overflow-y-scroll");
  selectContent.classList.toggle("mb-[20px]");
  dropdownIcon.classList.toggle("rotate-180");
}

// Cette fonction met à jour le select avec les options
export function updateSelect(selectType, recipes) {
  if (!selectType || !recipes) return;

  const select = document.getElementById(selectType + "-dropdown");
  const selectLabel = document.getElementById(selectType + "-dropdown-label");
  const selectContent = document.getElementById(
    selectType + "-dropdown-content"
  );

  if (!select || !selectLabel || !selectContent) return;

  const newSelectLabel = selectLabel.cloneNode(true);
  selectLabel.parentNode.replaceChild(newSelectLabel, selectLabel);

  newSelectLabel.addEventListener("click", () =>
    handleSelectLabelClick(selectType)
  );

  updateFilters(selectType);

  addCheckboxListeners(selectType);
  addSearchInputListeners(selectType);
}

// Cette fonction vérifie si une option doit être affichée
function shouldShowOption(optionText, allSearchInputs) {
  return allSearchInputs.every((input) =>
    optionText.includes(input.toLowerCase())
  );
}

// Cette fonction filtre les options du select en fonction de la recherche
function filterOptions(searchInput, selectType) {
  if (!selectType) return;

  const uncheckedGallery = document.getElementById(
    selectType + "-unchecked-filters"
  );
  if (!uncheckedGallery) return;

  const allSearchInputs = searchInput ? searchInput.split(" ") : [];

  uncheckedGallery.querySelectorAll("div").forEach((option) => {
    const label = option.querySelector("label");
    if (!label) return;

    const optionText = label.textContent.toLowerCase();
    const shouldShow = shouldShowOption(optionText, allSearchInputs);
    option.style.display = shouldShow ? "flex" : "none";
  });
}

// Cette fonction gère l'input de recherche dans le select
function handleSearchInput(selectType, value, closeIcon) {
  filterOptions(value, selectType);

  if (value.length > 0) {
    closeIcon.classList.remove("hidden");
  } else {
    closeIcon.classList.add("hidden");
  }
}

// Cette fonction gère le clic sur l'icône de fermeture de la recherche
function handleSearchCloseIcon(selectType, searchInput, closeIcon) {
  searchInput.value = "";
  searchInput.focus();
  closeIcon.classList.add("hidden");
  filterOptions("", selectType);
}

// Cette fonction ajoute les listeners à la search bar du select
function addSearchInputListeners(selectType) {
  if (!selectType) return;

  const searchInput = document.getElementById(selectType + "-search-input");
  if (!searchInput) return;

  const closeIcon = searchInput.parentElement?.querySelector('svg[width="8"]');
  if (!closeIcon) return;

  searchInput.addEventListener("input", (e) => {
    const value = e.target.value;
    handleSearchInput(selectType, value, closeIcon);
  });

  closeIcon.addEventListener("click", () => {
    handleSearchCloseIcon(selectType, searchInput, closeIcon);
  });
}

// Cette fonction vérifie si une recette correspond à la recherche
function matchesSearch(recipe, searchTerm) {
  const recipeName = recipe.name.toLowerCase();
  const recipeDescription = recipe.description.toLowerCase();
  const recipeIngredients = recipe.ingredients
    .map((ing) => ing.ingredient.toLowerCase())
    .join(" ");

  // Sépare la recherche en mots et filtre les mots vides
  const searchWords = searchTerm
    .split(" ")
    .filter((word) => word.trim() !== "");

  // Si aucun mot de recherche, retourne true (pas de filtre de recherche)
  if (searchWords.length === 0) return true;

  // Vérifie si TOUS les mots de recherche sont présents dans le contenu de la recette
  return searchWords.every(
    (word) =>
      recipeName.includes(word) ||
      recipeDescription.includes(word) ||
      recipeIngredients.includes(word)
  );
}

// Cette fonction vérifie si une recette correspond aux filtres d'ingrédients
function matchesIngredientFilters(recipe, ingredientFilters) {
  if (ingredientFilters.length === 0) return true;

  return ingredientFilters.every((ing) =>
    recipe.ingredients.some(
      (obj) => obj.ingredient.toLowerCase() === ing.toLowerCase()
    )
  );
}

// Cette fonction vérifie si une recette correspond aux filtres d'ustensiles
function matchesUtensilFilters(recipe, utensilFilters) {
  if (utensilFilters.length === 0) return true;

  return utensilFilters.every((u) =>
    recipe.ustensils.some((obj) => obj.toLowerCase() === u.toLowerCase())
  );
}

// Cette fonction vérifie si une recette correspond aux filtres d'appareils
function matchesApplianceFilters(recipe, applianceFilters) {
  if (applianceFilters.length === 0) return true;

  return applianceFilters.every(
    (a) => recipe.appliance.toLowerCase() === a.toLowerCase()
  );
}

// Cette fonction filtre les recettes selon la recherche principale (version filter)
function filterRecipesBySearch(recipes, searchValue) {
  if (!searchValue || searchValue.trim() === "") {
    return recipes;
  }

  const searchTerm = searchValue.toLowerCase().trim();

  return recipes.filter((recipe) => matchesSearch(recipe, searchTerm));
}

// Cette fonction filtre les recettes selon la recherche principale (version boucle for)
function filterRecipesBySearchForLoop(recipes, searchValue) {
  if (!searchValue || searchValue.trim() === "") {
    return recipes;
  }

  const searchTerm = searchValue.toLowerCase().trim();
  const filteredRecipes = [];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    if (matchesSearch(recipe, searchTerm)) {
      filteredRecipes.push(recipe);
    }
  }

  return filteredRecipes;
}

// Cette fonction filtre les recettes selon les filtres de sélection
function filterRecipesBySelects(
  recipes,
  ingredientFilters,
  utensilFilters,
  applianceFilters
) {
  return recipes.filter((recipe) => {
    const okIngredients = matchesIngredientFilters(recipe, ingredientFilters);
    const okUtensils = matchesUtensilFilters(recipe, utensilFilters);
    const okAppliances = matchesApplianceFilters(recipe, applianceFilters);

    return okIngredients && okUtensils && okAppliances;
  });
}

// Cette fonction obtient les recettes filtrées par la recherche principale
export function getSearchFilteredRecipes() {
  if (!recipes || recipes.length === 0) return [];

  const params = new URLSearchParams(window.location.search);
  const searchValue = params.get("search");

  // Deux versions de la fonction de filtrage principale :
  return filterRecipesBySearch(recipes, searchValue); // Version programmation fonctionnelle (filter)
  // return filterRecipesBySearchForLoop(recipes, searchValue); // Version programmation native (boucle for)
}

// Cette fonction filtre les recettes en fonction des paramètres de l'URL
export function getFilteredRecipesFromUrl() {
  if (!recipes || recipes.length === 0) return [];

  const params = new URLSearchParams(window.location.search);

  const ingredientFilters = params.getAll("ingredients");
  const utensilFilters = params.getAll("ustensiles");
  const applianceFilters = params.getAll("appareils");

  // Applique les filtres de la recherche principale
  const searchFilteredRecipes = getSearchFilteredRecipes();

  // Applique les filtres de sélection
  return filterRecipesBySelects(
    searchFilteredRecipes,
    ingredientFilters,
    utensilFilters,
    applianceFilters
  );
}

// Cette fonction normalise une option pour la comparaison
function normalizeOption(option) {
  return option.toLowerCase().normalize("NFD");
}

// Cette fonction vérifie si une option est un doublon
function isDuplicateOption(option, index, array) {
  const normalizedOption = normalizeOption(option);

  for (let i = 0; i < index; i++) {
    const normalizedExisting = normalizeOption(array[i]);
    if (normalizedOption === normalizedExisting) {
      return true;
    }
  }

  if (option.endsWith("s")) {
    const singularForm = option.slice(0, -1);
    if (array.includes(singularForm)) {
      return true;
    }
  }

  const pluralForm = option + "s";
  if (array.includes(pluralForm)) {
    const singularIndex = array.indexOf(option);
    const pluralIndex = array.indexOf(pluralForm);
    return singularIndex > pluralIndex;
  }

  return false;
}

// Cette fonction met à jour les filtres en fonction des paramètres de l'URL
function updateFilters(selectType) {
  if (!selectType) return;

  const selectCheckedFilters = document.getElementById(
    selectType + "-checked-filters"
  );
  const selectUncheckedFilters = document.getElementById(
    selectType + "-unchecked-filters"
  );

  if (!selectCheckedFilters || !selectUncheckedFilters) return;

  const params = new URLSearchParams(window.location.search);
  const checkedOptions = params.getAll(selectType);

  selectCheckedFilters.innerHTML = "";
  selectUncheckedFilters.innerHTML = "";

  // Always use all recipes for select options, regardless of search
  const recipesToUse = recipes;

  const allOptions = [];
  recipesToUse.forEach((recipe) => {
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
    .filter((option, index, array) => !isDuplicateOption(option, index, array))
    .sort();

  sortedOptions.forEach((option) => {
    const isChecked = checkedOptions.some(
      (checkedOption) => checkedOption.toLowerCase() === option.toLowerCase()
    );
    renderSelectOption(option, isChecked, selectType);
  });

  updateCheckedFiltersContainer(selectType);
}

// Cette fonction gère le toggle d'une checkbox
function onCheckboxToggle(e, selectType) {
  if (e.target.type !== "checkbox") return;

  const option = e.target.value;
  if (!option) return;

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

// Cette fonction ajoute les listeners aux checkboxes
function addCheckboxListeners(selectType) {
  if (!selectType) return;

  const uncheckedGallery = document.getElementById(
    `${selectType}-unchecked-filters`
  );
  const checkedGallery = document.getElementById(
    `${selectType}-checked-filters`
  );

  if (!uncheckedGallery || !checkedGallery) return;

  uncheckedGallery.addEventListener("change", (e) =>
    onCheckboxToggle(e, selectType)
  );
  checkedGallery.addEventListener("change", (e) =>
    onCheckboxToggle(e, selectType)
  );
}

// Cette fonction gère l'input de la recherche principale
function handleMainSearchInput(value, resetIcon) {
  if (value.length > 0) {
    resetIcon.classList.remove("hidden");
  } else {
    resetIcon.classList.add("hidden");
  }

  updateSearchUrlParam(value);

  updateSelect("ingredients", recipes);
  updateSelect("appareils", recipes);
  updateSelect("ustensiles", recipes);

  const updated = getFilteredRecipesFromUrl();
  renderRecipes(updated);
}

// Cette fonction gère le clic sur l'icône de reset de la recherche principale
function handleMainSearchReset(searchInput, resetIcon) {
  searchInput.value = "";
  resetIcon.classList.add("hidden");
  updateSearchUrlParam("");

  updateSelect("ingredients", recipes);
  updateSelect("appareils", recipes);
  updateSelect("ustensiles", recipes);

  const updated = getFilteredRecipesFromUrl();
  renderRecipes(updated);
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
    handleMainSearchInput(value, resetIcon);
  });

  resetIcon.addEventListener("click", () => {
    handleMainSearchReset(searchInput, resetIcon);
  });
}

// Cette fonction met à jour l'URL avec la recherche
function updateSearchUrlParam(searchValue) {
  if (!searchValue) {
    searchValue = "";
  }

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

// Cette fonction initialise la page
const initialRecipes = getFilteredRecipesFromUrl();
renderRecipes(initialRecipes);
updateSelect("ingredients", recipes);
updateSelect("appareils", recipes);
updateSelect("ustensiles", recipes);
initializeMainSearch();

window.addEventListener("recipesShouldUpdate", () => {
  const filteredRecipes = filterRecipes(recipes);
  renderRecipes(filteredRecipes);
});
