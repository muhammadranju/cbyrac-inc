import { createBrowserRouter } from "react-router-dom";

import ApplyJobs from "../component/users/internEmployee/ApplyJobs";
import TimeSheet from "../component/users/internEmployee/TimeSheet";
import TestInput from "../component/users/internEmployee/TestInput";
import RoleSelector from "../component/authentication/roleSelector/RoleSelector";
import InternRegister from "../component/authentication/internRegister/InternRegister";
import SignIn from "../component/authentication/signIn/SignIn";
import PasswordRecovery from "../component/authentication/signIn/PasswordRecovery";
import ResetPassword from "../component/authentication/signIn/ResetPassword";
import BankAccount from "../component/users/internEmployee/BankAccount";
import TempMainLayout from "../component/layouts/tempEmployeeLayout/TempMainLayout";
import TempApplyJob from "../component/users/temporaryEmployee/TempApplyJob";
import AdminMainLayout from "../component/layouts/adminLayout/AdminMainLayout";
import Overview from "../component/users/admin/Overview";
import RequestList from "../component/users/admin/RequestList";
// import AdminCalender from "../component/users/admin/adminCalender/AdminCalender";
import TimeSheetTemp from "../component/users/temporaryEmployee/TimeSheetTemp";
import PayrollCalender from "../component/users/internEmployee/PayrollCalender";
import InternMainLayout from "../component/layouts/internUsersLayout/InternMainLayout";
import Otp from "../component/authentication/signIn/Otp";
import AdminForm from "../component/users/admin/adminForm/AdminForm";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "../component/layouts/UnauthorizePage";
import AdminCalender from "../component/users/admin/adminCalender/AdminCalender";
import TempPayrollCalender from "../component/users/temporaryEmployee/TempPayrollCalender";
import PdfViewer from "../component/users/temporaryEmployee/TemporaryPdf";
import InternPdfViewer from "../component/users/internEmployee/InternPdf";
import AdminTimeSheetUp from "../component/users/admin/adminTimeSheetUp/AdminTimeSheetUp";
import AdminI9Form from "../component/users/admin/adminI9Form/AdminI9Form";
import Adminw4Form from "../component/users/admin/adminW4Form/AdminW4Form";
import AdminI9FormExample from "../component/users/admin/adminI9Form/AdminI9formExamole";
import AdminW4FormExample from "../component/users/admin/adminW4Form/AdminW4FormExamaple";

const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/register",
    element: <InternRegister />,
  },
  {
    path: "/role-selector",
    element: <RoleSelector />,
  },
  {
    path: "/password-recovery",
    element: <PasswordRecovery />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/otp",
    element: <Otp />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },

  // Protected routes for Fit2Lead ..
  {
    element: <ProtectedRoute allowedRoles={["Fit2Lead Intern"]} />,
    children: [
      {
        path: "/",
        element: <InternMainLayout />,
        children: [
          { index: true, element: <ApplyJobs /> },
          { path: "time-sheet", element: <TimeSheet /> },
          { path: "payroll-calendar", element: <PayrollCalender /> },

          // { path: "test-input", element: <TestInput /> },
          // { path: "bank-details", element: <BankAccount /> },
        ],
      },
    ],
  },
  //Temporary Emploiyee route..
  {
    element: <ProtectedRoute allowedRoles={["Temporary Employee"]} />,
    children: [
      {
        path: "/temporary-employee",
        element: <TempMainLayout />,
        children: [
          { index: true, element: <TempApplyJob /> },
          { path: "time-sheet-temp", element: <TimeSheetTemp /> },
          { path: "payroll-calendar", element: <TempPayrollCalender /> },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={["Temporary Employee"]} />,
    children: [{ path: "/view-pdf", element: <PdfViewer /> }],
  },
  { path: "/view-intern-pdf", element: <InternPdfViewer /> },

  //Protected Admin route,,,
  {
    element: <ProtectedRoute allowedRoles={["Administrator"]} />,
    children: [
      {
        path: "/admin",
        element: <AdminMainLayout />,
        children: [
          { index: true, element: <Overview /> },
          { path: "request-list", element: <RequestList /> },
          { path: "admin-calender", element: <AdminCalender /> },
          { path: "time-sheet-form", element: <AdminTimeSheetUp /> },
          { path: "i9-form", element: <AdminI9Form /> },
          { path: "w4-form", element: <Adminw4Form /> },
          { path: "i9-form-example", element: <AdminI9FormExample /> },
          { path: "w4-form-example", element: <AdminW4FormExample /> },
        ],
      },
    ],
  },
]);

export default router;
