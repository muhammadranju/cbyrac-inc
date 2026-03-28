import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

// Async thunk to fetch monthly user stats
export const fetchUserFilters = createAsyncThunk(
  "UserFilterSlices/fetchUserFilterSlices",
  async (year, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/user/stats/year?year=${year}`);
      return response.data.data; // array of monthly stats
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user statistics"
      );
    }
  }
);

const UserFilterSliceSlice = createSlice({
  name: "UserFilterSlices",
  initialState: {
    monthlyStats: [], // array of { month, intern, temporary }
    totalInterns: 0,
    totalTemporary: 0,
    loading: false,
    error: null,
  },
  reducers: {
    resetStatistics: (state) => {
      state.monthlyStats = [];
      state.totalInterns = 0;
      state.totalTemporary = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFilters.fulfilled, (state, action) => {
        state.loading = false;

        const rawData = action.payload; // monthly stats array

        // Save the raw monthly data
        state.monthlyStats = rawData;

        // Calculate totals
        state.totalInterns = rawData.reduce(
          (acc, item) => acc + item.intern,
          0
        );
        state.totalTemporary = rawData.reduce(
          (acc, item) => acc + item.temporary,
          0
        );
      })
      .addCase(fetchUserFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetStatistics } = UserFilterSliceSlice.actions;
export default UserFilterSliceSlice.reducer;
