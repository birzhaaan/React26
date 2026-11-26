import { createSelector } from "@reduxjs/toolkit";
import { selectRecipeItems } from "../features/recipes/recipesSlice";
import { selectStats } from "../features/dashboard/dashboardSlice";
import {
  selectCategories,
  selectCuisines,
} from "../features/filterOptions/filterOptionsSlice";
import { getDifficulty, capitalize } from "../utils/recipe";

export const selectRecipeListView = createSelector(
  [selectRecipeItems],
  (items) =>
    items.map((recipe) => ({
      ...recipe,
      difficulty: getDifficulty(recipe),
      ingredientCount: recipe.ingredients.length,
    }))
);

export const selectFilterOptionsView = createSelector(
  [selectCategories, selectCuisines],
  (categories, cuisines) => ({
    categories: categories.map((value) => ({ value, label: capitalize(value) })),
    cuisines: cuisines.map((value) => ({ value, label: capitalize(value) })),
  })
);

export const selectDashboardHighlights = createSelector(
  [selectStats],
  (stats) => {
    if (!stats) return null;

    const total = stats.totals.recipes || 1;

    return {
      topCategory: stats.byCategory[0]?.label ?? null,
      categoryShares: stats.byCategory.map((row) => ({
        ...row,
        share: Math.round((row.count / total) * 100),
      })),
    };
  }
);

export const selectPagination = createSelector(
  [
    (state) => state.recipes.currentPage,
    (state) => state.recipes.totalPages,
    (state) => state.recipes.totalItems,
  ],
  (currentPage, totalPages, totalItems) => ({
    currentPage,
    totalPages,
    totalItems,
  })
);