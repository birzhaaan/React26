import recipesData from "../data/recipes.json";

const STORAGE_KEY = "user_recipes";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getUserRecipes() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveUserRecipes(recipes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

export async function fetchRecipes({ search = "", category = "", sortBy = "", page = 1, perPage = 12 } = {}) {
  await delay(400 + Math.random() * 400);

  const allRecipes = [...recipesData, ...getUserRecipes()];

  let filtered = allRecipes;

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.ingredients.some((i) => i.toLowerCase().includes(q))
    );
  }

  if (category) {
    filtered = filtered.filter((r) => r.category === category);
  }

  if (sortBy === "time-asc") {
    filtered = [...filtered].sort((a, b) => a.time - b.time);
  } else if (sortBy === "time-desc") {
    filtered = [...filtered].sort((a, b) => b.time - a.time);
  } else if (sortBy === "title-asc") {
    filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "title-desc") {
    filtered = [...filtered].sort((a, b) => b.title.localeCompare(a.title));
  } else if (sortBy === "servings-asc") {
    filtered = [...filtered].sort((a, b) => a.servings - b.servings);
  } else if (sortBy === "servings-desc") {
    filtered = [...filtered].sort((a, b) => b.servings - a.servings);
  }

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const start = (page - 1) * perPage;
  const paged = filtered.slice(start, start + perPage);

  return {
    recipes: paged,
    totalItems,
    totalPages,
    currentPage: page,
  };
}

export async function fetchRecipeById(id) {
  await delay(300 + Math.random() * 300);

  const allRecipes = [...recipesData, ...getUserRecipes()];
  const recipe = allRecipes.find((r) => r.id === id);

  if (!recipe) {
    throw new Error("Recipe not found");
  }

  return recipe;
}

export async function createRecipe(newRecipe) {
  await delay(500 + Math.random() * 300);

  const userRecipes = getUserRecipes();
  const allRecipes = [...recipesData, ...userRecipes];
  const maxId = allRecipes.reduce((max, r) => Math.max(max, r.id), 0);

  const recipe = {
    ...newRecipe,
    id: maxId + 1,
  };

  userRecipes.push(recipe);
  saveUserRecipes(userRecipes);

  return recipe;
}