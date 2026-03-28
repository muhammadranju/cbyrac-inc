import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
} from "../../employeeApi/temporaryApi";

// 🎯 Thunks for async actions
export const getEmployees = createAsyncThunk("employee/fetchAll", async () => {
  return await fetchEmployees();
});

export const addEmployee = createAsyncThunk(
  "employee/add",
  async (formData) => {
    return await createEmployee(formData);
  }
);

export const editEmployee = createAsyncThunk(
  "employee/update",
  async ({ id, updatedData }) => {
    return await updateEmployee({ id, updatedData });
  }
);

// 🧩 Slice
const employeeSlice = createSlice({
  name: "tempEmployee",
  initialState: {
    employees: {},
    loading: false,
    error: null,
  },
  reducers: {
    // 🟢 Set the entire employee list manually
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },

    // 🟢 Add a new employee locally (without calling API)
    addLocalEmployee: (state, action) => {
      state.employees.push(action.payload);
    },

    // 🟢 Update an existing employee locally
    updateLocalEmployee: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.employees.findIndex((emp) => emp.id === id);
      if (index !== -1) {
        state.employees[index] = {
          ...state.employees[index],
          ...updatedData,
        };
      }
    },

    // 🟢 Remove an employee locally
    removeEmployee: (state, action) => {
      state.employees = state.employees.filter(
        (emp) => emp.id !== action.payload
      );
    },
  },

  extraReducers: (builder) => {
    builder
      // 📥 Fetch
      .addCase(getEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.loading = false;
        console.log("data", action.payload);
        state.employees = action.payload;
      })
      .addCase(getEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // 📤 Create
      .addCase(addEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employees = action.payload;
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // ✏️ Update
      .addCase(editEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.employees.findIndex(
          (emp) => emp.id === action.payload.id
        );
        if (index !== -1) state.employees[index] = action.payload;
      })
      .addCase(editEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// ✅ Export reducer actions
export const {
  setEmployees,
  addLocalEmployee,
  updateLocalEmployee,
  removeEmployee,
} = employeeSlice.actions;

export default employeeSlice.reducer;
