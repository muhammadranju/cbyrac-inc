import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

// Async thunk for uploading an I9 form (POST)
export const uploadI9Form = createAsyncThunk(
  "/i9-form/upload",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/pdf/i9form", formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to upload I9 form");
    }
  }
);

// Async thunk to GET all I9 forms
export const fetchI9Forms = createAsyncThunk(
  "/i9-form/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/pdf/i9form");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch I9 forms");
    }
  }
);

const i9FormSlice = createSlice({
  name: "i9Form",
  initialState: {
    forms: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetI9Form: (state) => {
      state.forms = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload I9
      .addCase(uploadI9Form.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadI9Form.fulfilled, (state, action) => {
        state.loading = false;
        state.forms.push(action.payload);
      })
      .addCase(uploadI9Form.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch all I9 forms
      .addCase(fetchI9Forms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchI9Forms.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = action.payload; // Replace the list with fetched results
      })
      .addCase(fetchI9Forms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetI9Form } = i9FormSlice.actions;
export default i9FormSlice.reducer;
