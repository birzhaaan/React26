import { configureStore } from "@reduxjs/toolkit";
import recipesReducer from "../features/recipes/recipesSlice";
import recipeDetailReducer from "../features/recipeDetail/recipeDetailSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import filterOptionsReducer from "../features/filterOptions/filterOptionsSlice";

export const store = configureStore({
  reducer: {
    recipes: recipesReducer,
    recipeDetail: recipeDetailReducer,
    dashboard: dashboardReducer,
    filterOptions: filterOptionsReducer,
  },
});