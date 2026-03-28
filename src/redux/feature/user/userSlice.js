import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

// register User
export const registerUser = createAsyncThunk(
  "user/register",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("Payload in userSlice:", payload);
      const response = await axiosInstance.post("/user", payload);
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);
// 🔹 Login User
export const loginUser = createAsyncThunk(
  "user/login",
  async (payload, { rejectWithValue }) => {
    try {
      console.log("Login Payload:", payload);
      const response = await axiosInstance.post(`/auth/login`, payload);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// 🔹 Forgot Password
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/auth/forget-password`, data);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Forgot password failed");
    }
  }
);

// 🔹 Verify OTP
export const verifyOtp = createAsyncThunk(
  "user/verifyOtp",
  async (payload, { rejectWithValue }) => {
    try {
      console.log(payload);
      const response = await axiosInstance.post(`/auth/verify-email`, payload);
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "OTP verification failed");
    }
  }
);

// 🔹 Reset Password
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ payload, token }, { rejectWithValue }) => {
    try {
      console.log("Reset Payload:", payload, token);
      const response = await axiosInstance.post(
        `/auth/reset-password`,
        payload,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Password reset failed");
    }
  }
);

// 🔹 Slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
  },
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      state.isSuccess = false;
    },
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // 🟢 REGISTER
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // 🟢 LOGIN
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        console.log(action.payload.role);
        state.userInfo = {
          token: action.payload.data,
          role: action.payload.role,
        };

        localStorage.setItem("token", action.payload.data);
        localStorage.setItem("role", action.payload.role);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // 🟢 FORGOT PASSWORD
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // 🟢 VERIFY OTP
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // 🟢 RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { logout, clearState } = userSlice.actions;
export default userSlice.reducer;
