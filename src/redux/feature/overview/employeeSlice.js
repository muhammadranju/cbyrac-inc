// employeeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

// Fetch employees by role/search
export const fetchEmployeesByRole = createAsyncThunk(
  "employee/fetchEmployees",
  async (
    { employee_role, page = 1, limit = 10, search = "" },
    { rejectWithValue }
  ) => {
    try {
      const params = {
        page,
        limit,
        employee_role: employee_role || "Fit2Lead Intern",
      };
      if (search) params.firstName = search;

      const url = search ? "/user/search" : "/user/filter";
      const response = await axiosInstance.get(url, { params });
      return response.data; // expect { data: [...], pagination: {...} }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch employees"
      );
    }
  }
);

// Update employee status
export const updateEmployeeStatus = createAsyncThunk(
  "employee/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/user/${id}/status`, {
        status,
      });
      // return full employee object if backend provides it, else return id & status
      return response.data.data || { _id: id, employee_status: status };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    employees: [],
    pagination: {},
    loading: false,
    error: null,
    activeRole: "Fit2Lead Intern",
    searchText: "",
    pendingStatusUpdate: {},
  },
  reducers: {
    setActiveRole: (state, action) => {
      state.activeRole = action.payload;
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    updateStatusLocally: (state, action) => {
      const { id, status } = action.payload;
      const index = state.employees.findIndex((e) => e._id === id);
      if (index !== -1) state.employees[index].employee_status = status;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Employees
      .addCase(fetchEmployeesByRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeesByRole.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.data;
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchEmployeesByRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Employee Status
      .addCase(updateEmployeeStatus.pending, (state, action) => {
        state.loading = true;
        const id = action.meta.arg.id;
        state.pendingStatusUpdate[id] = true;
      })
      .addCase(updateEmployeeStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedEmployee = action.payload;
        const index = state.employees.findIndex(
          (e) => e._id === updatedEmployee._id
        );
        if (index !== -1)
          state.employees[index] = {
            ...state.employees[index],
            ...updatedEmployee,
          };
        delete state.pendingStatusUpdate[updatedEmployee._id];
      })
      .addCase(updateEmployeeStatus.rejected, (state, action) => {
        state.loading = false;
        const id = action.meta.arg.id;
        delete state.pendingStatusUpdate[id];
      });
  },
});

export const { setActiveRole, setSearchText, updateStatusLocally } =
  employeeSlice.actions;
export default employeeSlice.reducer;
