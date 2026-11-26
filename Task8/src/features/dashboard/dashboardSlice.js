import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchStats } from "../../services/service";
import { createRecipeEntry } from "../recipes/recipesSlice";

const initialState = {
  stats: null,
  category: "",
  status: "idle",
  error: null,
  currentRequestId: null,
};

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (category = "", { rejectWithValue }) => {
    try {
      return await fetchStats({ category });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.currentRequestId = action.meta.requestId;
        state.category = action.meta.arg ?? "";
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;

        state.status = "succeeded";
        state.stats = action.payload;
        state.currentRequestId = null;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;

        state.status = "failed";
        state.error = action.payload ?? action.error.message;
        state.currentRequestId = null;
      })
      // A new recipe changes every statistic, so the cached ones are dropped.
      .addCase(createRecipeEntry.fulfilled, (state) => {
        state.status = "idle";
        state.stats = null;
      });
  },
});

export const selectStats = (state) => state.dashboard.stats;
export const selectDashboardStatus = (state) => state.dashboard.status;
export const selectDashboardError = (state) => state.dashboard.error;

export default dashboardSlice.reducer;