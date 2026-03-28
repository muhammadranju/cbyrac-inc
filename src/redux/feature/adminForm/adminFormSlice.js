import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

// ----------------- Async Thunks -----------------
export const createAdminForm = createAsyncThunk(
  "adminForm/create",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/admin/job", formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create form"
      );
    }
  }
);

export const fetchAdminForms = createAsyncThunk(
  "adminForm/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/job");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch forms"
      );
    }
  }
);

// ----------------- Slice -----------------
const adminFormSlice = createSlice({
  name: "adminForm",
  initialState: {
    forms: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetAdminForms: (state) => {
      state.forms = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create
    builder.addCase(createAdminForm.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createAdminForm.fulfilled, (state, action) => {
      state.loading = false;
      state.forms.push(action.payload);
    });
    builder.addCase(createAdminForm.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch All
    builder.addCase(fetchAdminForms.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAdminForms.fulfilled, (state, action) => {
      state.loading = false;
      state.forms = action.payload;
    });
    builder.addCase(fetchAdminForms.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { resetAdminForms } = adminFormSlice.actions;
export default adminFormSlice.reducer;
