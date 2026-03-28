import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

// Async thunk to submit employee form
export const submitEmployeeForm = createAsyncThunk(
  "employee/submitForm",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/internForm/intern", formData);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Form submission failed");
    }
  }
);

// Async thunk to fetch all employees
export const fetchEmployees = createAsyncThunk(
  "employee/fetchEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/internForm/intern");
      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Fetch failed");
    }
  }
);

const initialState = {
  employees: {},
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    resetEmployeeState: (state) => {
      state.employees = {};
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit form
      .addCase(submitEmployeeForm.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitEmployeeForm.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employees = action.payload;
      })
      .addCase(submitEmployeeForm.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch all employees
      .addCase(fetchEmployees.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetEmployeeState } = employeeSlice.actions;
export default employeeSlice.reducer;
