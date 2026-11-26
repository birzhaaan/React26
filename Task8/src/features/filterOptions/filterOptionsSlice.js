import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchFilterOptions } from "../../services/service";
import { createRecipeEntry } from "../recipes/recipesSlice";

const initialState = {
  categories: [],
  cuisines: [],
  status: "idle",
  error: null,
};

export const fetchFilterOptionsList = createAsyncThunk(
  "filterOptions/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchFilterOptions();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().filterOptions;
      return status !== "loading" && status !== "succeeded";
    },
  }
);

const filterOptionsSlice = createSlice({
  name: "filterOptions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilterOptionsList.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFilterOptionsList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload.categories;
        state.cuisines = action.payload.cuisines;
      })
      .addCase(fetchFilterOptionsList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message;
      })
      .addCase(createRecipeEntry.fulfilled, (state) => {
        state.status = "idle";
      });
  },
});

export const selectCategories = (state) => state.filterOptions.categories;
export const selectCuisines = (state) => state.filterOptions.cuisines;
export const selectFilterOptionsStatus = (state) => state.filterOptions.status;

export default filterOptionsSlice.reducer;