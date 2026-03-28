import axiosInstance from "../../utils/axiosInstance";

export const fetchEmployees = async () => {
  const response = await axiosInstance.get("/temporaryForm/temporary");
  return response.data.data;
};

// ✅ Post (create new)
export const createEmployee = async (formData) => {
  const response = await axiosInstance.post(
    "/temporaryForm/temporary",
    formData
  );
  return response.data.data;
};

// ✅ Update existing employee
export const updateEmployee = async ({ id, updatedData }) => {
  const response = await axiosInstance.put(
    `/temporaryForm/temporary/update/${id}`,
    updatedData
  );
  return response.data;
};

// time Sheet Api call...

export const tempTimeSheetApi = async (formData) => {
  const response = await axiosInstance.post("/temporary/timeSheet", formData);
  const data = response.data.data;
  return data;
};

export const internTimeSheetApi = async (formData) => {
  const response = await axiosInstance.post("/intern/timeSheet", formData);
  const data = response.data.data;
  return data;
};

// get payroll calender ,  from backend..

export const getPayrollCalender = async () => {
  const res = await axiosInstance.get("/calendar");
  return res.data.data;
};
