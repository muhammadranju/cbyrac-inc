import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

// Async thunk to simulate uploading a calendar entry
export const uploadCalendarEntry = createAsyncThunk(
  "calendar/uploadCalendarEntry",
  async (formData, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axiosInstance.post("/calendar", formData);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to upload calendar entry"
      );
    }
  }
);

const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    entries: [], // all uploaded calendar entries
    loading: false,
    error: null,
  },
  reducers: {
    resetCalendar: (state) => {
      state.entries = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadCalendarEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadCalendarEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries.push(action.payload);
      })
      .addCase(uploadCalendarEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to upload";
      });
  },
});

export const { resetCalendar } = calendarSlice.actions;
export default calendarSlice.reducer;
