// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../feature/user/userSlice";
import userStatisticReducer from "../feature/overview/userStatisticSlice";
import userFilterReducer from "../feature/overview/userFilterSlice";
import employeeFilterReducer from "../feature/overview/employeeSlice";
import adminFormReducer from "../feature/adminForm/adminFormSlice";
import calendarReducer from "../feature/calendar/calendarSlice";
import tempEmployeeReducer from "../feature/tempEmployee/tempEmployeeSlice";
import internEmployeeReducer from "../feature/Internemployee/internSlice";
import w4FormReducer from "../feature/adminW4Form/W4FormSlice";
import i9FormReducer from "../feature/adminI9Form/adminI9FormSlice";
import i9FormExampleReducer from "../feature/adminI9Form/adminI9ExampleForm";
import w4FormExampleReducer from "../feature/adminW4Form/W4FprmExampleSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    userStatistics: userStatisticReducer,
    userFilters: userFilterReducer,
    employeeFilter: employeeFilterReducer,
    adminForm: adminFormReducer,
    calendar: calendarReducer,
    tempEmployee: tempEmployeeReducer,
    internEmployee: internEmployeeReducer,
    W4Form: w4FormReducer,
    I9Form: i9FormReducer,
    I9FormExample: i9FormExampleReducer,
    W4FormExample: w4FormExampleReducer,
  },
  devTools: import.meta.env.NODE_ENV !== "production",
});
