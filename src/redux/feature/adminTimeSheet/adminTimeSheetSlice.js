import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

// Async thunk to simulate uploading a calendar entry
export const uploadAdminTimeSheet = createAsyncThunk(
  "/time-sheet",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/time-sheet", formData);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to upload Admin time sheet entry"
      );
    }
  }
);

const adminTimeSheetSlice = createSlice({
  name: "adminTimeSheet",
  initialState: {
    entries: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetTimeSheet: (state) => {
      state.entries = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadAdminTimeSheet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadAdminTimeSheet.fulfilled, (state, action) => {
        state.loading = false;
        state.entries.push(action.payload);
      })
      .addCase(uploadAdminTimeSheet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to upload";
      });
  },
});

export const { resetTimeSheet } = adminTimeSheetSlice.actions;
export default adminTimeSheetSlice.reducer;
