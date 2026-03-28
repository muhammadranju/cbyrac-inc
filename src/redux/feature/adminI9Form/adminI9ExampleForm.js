import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

// Async thunk for uploading an I9 form (POST)
export const uploadI9FormExample = createAsyncThunk(
  "/i9-form/upload",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/example/i9", formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to upload I9 form");
    }
  }
);

// Async thunk to GET all I9 forms
export const fetchI9FormsExample = createAsyncThunk(
  "/i9-form/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/example/i9");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch I9 forms");
    }
  }
);

const i9FormSlice = createSlice({
  name: "i9FormExample",
  initialState: {
    form: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetI9Form: (state) => {
      state.form = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload I9
      .addCase(uploadI9FormExample.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadI9FormExample.fulfilled, (state, action) => {
        state.loading = false;
        state.form.push(action.payload);
      })
      .addCase(uploadI9FormExample.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch all I9 forms
      .addCase(fetchI9FormsExample.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchI9FormsExample.fulfilled, (state, action) => {
        state.loading = false;
        state.form = action.payload; // Replace the list with fetched results
      })
      .addCase(fetchI9FormsExample.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetI9Form } = i9FormSlice.actions;
export default i9FormSlice.reducer;
