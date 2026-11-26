import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchRecipes, createRecipe } from "../../services/service";

const initialState = {
  items: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 1,
  fromCache: false,
  dataSource: "unknown",
  status: "idle",
  error: null,
  currentRequestId: null,
  lastQuery: null,
  createStatus: "idle",
  createError: null,
};

export const fetchRecipesList = createAsyncThunk(
  "recipes/fetchList",
  async (query = {}, { rejectWithValue }) => {
    try {
      return await fetchRecipes(query);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createRecipeEntry = createAsyncThunk(
  "recipes/create",
  async (recipe, { dispatch, getState, rejectWithValue }) => {
    try {
      const created = await createRecipe(recipe);
      const lastQuery = getState().recipes.lastQuery ?? {};
      await dispatch(fetchRecipesList(lastQuery));
      return created;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    createStateReset(state) {
      state.createStatus = "idle";
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipesList.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.currentRequestId = action.meta.requestId;
        state.lastQuery = action.meta.arg ?? {};
      })
      .addCase(fetchRecipesList.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;

        state.status = "succeeded";
        state.items = action.payload.recipes;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.fromCache = action.payload.fromCache;
        state.dataSource = action.payload.dataSource;
        state.currentRequestId = null;
      })
      .addCase(fetchRecipesList.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;

        state.status = "failed";
        state.error = action.payload ?? action.error.message;
        state.currentRequestId = null;
      })
      .addCase(createRecipeEntry.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createRecipeEntry.fulfilled, (state) => {
        state.createStatus = "succeeded";
      })
      .addCase(createRecipeEntry.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload ?? action.error.message;
      });
  },
});

export const { createStateReset } = recipesSlice.actions;

export const selectRecipeItems = (state) => state.recipes.items;
export const selectRecipesStatus = (state) => state.recipes.status;
export const selectRecipesError = (state) => state.recipes.error;
export const selectRecipesFromCache = (state) => state.recipes.fromCache;
export const selectCreateStatus = (state) => state.recipes.createStatus;
export const selectCreateError = (state) => state.recipes.createError;

export default recipesSlice.reducer;