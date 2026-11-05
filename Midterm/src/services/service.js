import recipesData from "../data/recipes.json";

const STORAGE_KEY = "user_recipes";
const ERROR_CHANCE = 0;

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

function getAllRecipes() {
  return [...recipesData, ...getUserRecipes()];
}

function maybeFail() {
  if (Math.random() < ERROR_CHANCE) {
    throw new Error("Server is temporarily unavailable");
  }
}

function applyFilters(recipes, { search, category, cuisine, maxTime }) {
  let result = recipes;

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.ingredients.some((i) => i.toLowerCase().includes(q))
    );
  }

  if (category) {
    result = result.filter((r) => r.category === category);
  }

  if (cuisine) {
    result = result.filter((r) => r.cuisine === cuisine);
  }

  if (maxTime) {
    result = result.filter((r) => r.time <= Number(maxTime));
  }

  return result;
}

function applySort(recipes, sortBy) {
  const sorted = [...recipes];

  switch (sortBy) {
    case "title-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "title-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "time-asc":
      return sorted.sort((a, b) => a.time - b.time);
    case "time-desc":
      return sorted.sort((a, b) => b.time - a.time);
    case "servings-asc":
      return sorted.sort((a, b) => a.servings - b.servings);
    case "servings-desc":
      return sorted.sort((a, b) => b.servings - a.servings);
    default:
      return sorted;
  }
}

export async function fetchRecipes({
  search = "",
  category = "",
  cuisine = "",
  maxTime = "",
  sortBy = "",
  page = 1,
  perPage = 12,
} = {}) {
  await delay(400 + Math.random() * 400);
  maybeFail();

  const filtered = applyFilters(getAllRecipes(), {
    search,
    category,
    cuisine,
    maxTime,
  });
  const sorted = applySort(filtered, sortBy);

  const totalItems = sorted.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const start = (page - 1) * perPage;

  return {
    recipes: sorted.slice(start, start + perPage),
    totalItems,
    totalPages,
    currentPage: page,
  };
}

export async function fetchRecipeById(id) {
  await delay(300 + Math.random() * 300);
  maybeFail();

  const recipe = getAllRecipes().find((r) => r.id === id);

  if (!recipe) {
    throw new Error("Recipe not found");
  }

  return recipe;
}

export async function createRecipe(newRecipe) {
  await delay(500 + Math.random() * 300);

  const userRecipes = getUserRecipes();
  const maxId = getAllRecipes().reduce((max, r) => Math.max(max, r.id), 0);

  const recipe = { ...newRecipe, id: maxId + 1 };

  userRecipes.push(recipe);
  saveUserRecipes(userRecipes);

  return recipe;
}

export async function fetchFilterOptions() {
  await delay(200);

  const all = getAllRecipes();

  return {
    categories: [...new Set(all.map((r) => r.category))].sort(),
    cuisines: [...new Set(all.map((r) => r.cuisine))].sort(),
  };
}

export async function fetchStats({ category = "" } = {}) {
  await delay(500 + Math.random() * 300);
  maybeFail();

  const all = getAllRecipes();
  const scoped = category ? all.filter((r) => r.category === category) : all;
  const total = scoped.length;

  const avg = (fn) =>
    total ? Math.round((scoped.reduce((s, r) => s + fn(r), 0) / total) * 10) / 10 : 0;

  const countBy = (fn) => {
    const map = {};
    for (const recipe of scoped) {
      const key = fn(recipe);
      map[key] = (map[key] || 0) + 1;
    }
    return Object.entries(map)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  };

  const timeBucket = (time) => {
    if (time <= 15) return "Under 15 min";
    if (time <= 30) return "15-30 min";
    if (time <= 60) return "30-60 min";
    return "Over an hour";
  };

  return {
    totals: {
      recipes: total,
      cuisines: new Set(scoped.map((r) => r.cuisine)).size,
      avgTime: avg((r) => r.time),
      avgServings: avg((r) => r.servings),
      avgIngredients: avg((r) => r.ingredients.length),
    },
    byCategory: countBy((r) => r.category),
    byCuisine: countBy((r) => r.cuisine).slice(0, 8),
    byTime: countBy((r) => timeBucket(r.time)),
    quickest: [...scoped]
      .sort((a, b) => a.time - b.time)
      .slice(0, 5)
      .map((r) => ({ id: r.id, title: r.title, time: r.time })),
  };
}