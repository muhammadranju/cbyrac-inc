import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

// POST — Upload W4 form
export const uploadW4Form = createAsyncThunk(
  "/w4-form",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/pdf/w4form", formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to upload W4 form");
    }
  }
);

// GET — Fetch all W4 forms
export const fetchW4Forms = createAsyncThunk(
  "/w4-form/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/pdf/w4form");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch W4 forms");
    }
  }
);

const w4FormSlice = createSlice({
  name: "w4Form",
  initialState: {
    forms: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetW4Form: (state) => {
      state.forms = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // POST
      .addCase(uploadW4Form.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadW4Form.fulfilled, (state, action) => {
        state.loading = false;
        state.forms.push(action.payload);
      })
      .addCase(uploadW4Form.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to upload W4 form";
      })

      // GET
      .addCase(fetchW4Forms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchW4Forms.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = action.payload; // Replace list with fetched data
      })
      .addCase(fetchW4Forms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch W4 forms";
      });
  },
});

export const { resetW4Form } = w4FormSlice.actions;
export default w4FormSlice.reducer;
