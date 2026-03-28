import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

export const fetchUserStatistics = createAsyncThunk(
  "userStatistics/fetchUserStatistics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/stats");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user statistics"
      );
    }
  }
);

const userStatisticSlice = createSlice({
  name: "userStatistics",
  initialState: {
    stats: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetStatistics: (state) => {
      state.stats = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStatistics.fulfilled, (state, action) => {
        state.loading = false;
        const rawData = action.payload; // array from API
        const transformed = [];

        rawData.forEach((item) => {
          if (item.totalUsers !== undefined) {
            transformed.push({
              title: "Total Users",
              value: item.totalUsers,
              change: `${item.totalUsersPercentage}%`,
            });
          }
          if (item.totalIntern !== undefined) {
            transformed.push({
              title: "Total Interns",
              value: item.totalIntern,
              change: `${item.internUsersPercentage}%`,
            });
          }
          if (item.totalTemporary !== undefined) {
            transformed.push({
              title: "Total Temporary Employees",
              value: item.totalTemporary,
              change: `${item.temporaryUsersPercentage}%`,
            });
          }
        });

        state.stats = transformed;
      })
      .addCase(fetchUserStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetStatistics } = userStatisticSlice.actions;
export default userStatisticSlice.reducer;
