import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

// ------------------------------------
// POST — Upload W4 Form (Example)
// ------------------------------------
export const uploadW4FormExample = createAsyncThunk(
  "w4FormExample/upload",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/example/w4", formData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload W4 form"
      );
    }
  }
);

// ------------------------------------
// GET — Fetch All W4 Forms (Example)
// ------------------------------------
export const fetchW4FormsExample = createAsyncThunk(
  "w4FormExample/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/example/w4");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch W4 forms"
      );
    }
  }
);

const w4FormExampleSlice = createSlice({
  name: "w4FormExample",
  initialState: {
    form: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetW4FormExample: (state) => {
      state.form = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---------------- POST W4 ----------------
      .addCase(uploadW4FormExample.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadW4FormExample.fulfilled, (state, action) => {
        state.loading = false;
        state.form.push(action.payload);
      })
      .addCase(uploadW4FormExample.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------- GET W4 ----------------
      .addCase(fetchW4FormsExample.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchW4FormsExample.fulfilled, (state, action) => {
        state.loading = false;
        state.form = action.payload; // replace list
      })
      .addCase(fetchW4FormsExample.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetW4FormExample } = w4FormExampleSlice.actions;
export default w4FormExampleSlice.reducer;
