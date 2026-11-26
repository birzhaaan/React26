import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchRecipeById, fetchRecipes } from "../../services/service";

const initialState = {
  recipe: null,
  related: [],
  status: "idle",
  error: null,
  currentRequestId: null,
};

export const fetchRecipeDetail = createAsyncThunk(
  "recipeDetail/fetch",
  async (id, { rejectWithValue }) => {
    try {
      const recipe = await fetchRecipeById(id);

      let related = [];
      try {
        const list = await fetchRecipes({
          category: recipe.category,
          perPage: 4,
        });
        related = list.recipes
          .filter((item) => item.id !== recipe.id)
          .slice(0, 3);
      } catch {
        related = [];
      }

      return { recipe, related };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const recipeDetailSlice = createSlice({
  name: "recipeDetail",
  initialState,
  reducers: {
    detailCleared() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipeDetail.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.recipe = null;
        state.related = [];
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchRecipeDetail.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;

        state.status = "succeeded";
        state.recipe = action.payload.recipe;
        state.related = action.payload.related;
        state.currentRequestId = null;
      })
      .addCase(fetchRecipeDetail.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;

        state.status = "failed";
        state.error = action.payload ?? action.error.message;
        state.currentRequestId = null;
      });
  },
});

export const { detailCleared } = recipeDetailSlice.actions;

export const selectRecipe = (state) => state.recipeDetail.recipe;
export const selectRelatedRecipes = (state) => state.recipeDetail.related;
export const selectDetailStatus = (state) => state.recipeDetail.status;
export const selectDetailError = (state) => state.recipeDetail.error;

export default recipeDetailSlice.reducer;