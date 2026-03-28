import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  createAdminForm,
  resetAdminForms,
} from "../../../../redux/feature/adminForm/adminFormSlice";
import { useState } from "react";
export const CHECK_ONE = {
  NEW_HIRED: "newHire",
  REHIRED: "rehire",
};

export const JOB_STATUS = {
  FULL_TIME: "fullTime",
  PART_TIME: "partTime",
};

export const PAY_RATE = {
  HOURLY: "hourly",
  OT_EXEMPT: "o.t_exempt",
  OT_NON_EXEMPT: "o.t_non_exempt",
};
export function mapAdminForm(rawData) {
  return {
    checkOne: CHECK_ONE[rawData.checkOne.toUpperCase()] || rawData.checkOne,
    jobStatus: JOB_STATUS[rawData.jobStatus.toUpperCase()] || rawData.jobStatus,
    jobDescription: rawData.jobDescription,
    wcCode: rawData.wcCode,
    hireDate: new Date(rawData.hireDate).toISOString().split("T")[0],
    terminateDate: rawData.terminateDate
      ? new Date(rawData.terminateDate).toISOString().split("T")[0]
      : undefined,
    payRate: PAY_RATE[rawData.payRate.toUpperCase()] || rawData.payRate,
    salaryAmount: Number(rawData.salaryAmount),
    regularRateSalary: rawData.regularRateSalary
      ? Number(rawData.regularRateSalary)
      : undefined,
    otRate: rawData.otRate ? Number(rawData.otRate) : undefined,
    workHoursPerPeriod: rawData.workHoursPerPeriod
      ? Number(rawData.workHoursPerPeriod)
      : undefined,
    image: rawData.receivedBy?.[0].name || "",
    receivedDate: new Date(rawData.receivedDate).toISOString().split("T")[0],
  };
}
const AdminForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { loading } = useSelector((state) => state.adminForm);
  const [formKey, setFormKey] = useState(Date.now());
  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    const structuredData = mapAdminForm(data);
    const resultAction = await dispatch(createAdminForm(structuredData));

    if (createAdminForm.fulfilled.match(resultAction)) {
      reset();
      setFormKey(Date.now());
    }
  };

  const inputWrapperClass =
    "rounded-md bg-gradient-to-r from-[#8D6851] to-[#D3BFB2] mt-1 p-[1px]";
  const inputClass =
    "w-full bg-slate-900 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-0";

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex space-x-96 mb-4">
          <div className="text-sm">
            <div className="font-bold text-lg mb-2">CBYRAC, INC</div>
            <div>123 MAIN STREET SUITE 100</div>
            <div>ANYTOWN, STATE 12345</div>
            <div>PHONE: 555-555-5555</div>
            <div>EMAIL: info@cbyrac.com</div>
          </div>
          <div className="w-24 h-24 bg-white rounded justify-center">
            <img src="/cbyrac-logo.png" alt="Logo" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Employment Application</h1>
          <p className="text-sm text-gray-300 mb-7">
            Please fill all forms. Resumes are not a substitute for a completed
            application
          </p>
        </div>

        <p className="text-2xl font-medium mt-8 text-center">
          CBYRAC, INC. Use Only
        </p>

        <form
          key={formKey}
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl max-w-7xl mx-auto"
        >
          {/* Check One */}
          <div>
            <label className="text-white mb-2 block">Check One</label>
            <div className={inputWrapperClass}>
              <select
                {...register("checkOne", {
                  required: "This field is required",
                })}
                className={inputClass}
              >
                <option value="">Select</option>
                <option value="newHire">New Hire</option>
                <option value="rehire">Re-Hire</option>
              </select>
            </div>
            {errors.checkOne && (
              <p className="text-red-500 text-sm">{errors.checkOne.message}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="text-white mb-2 mt-4 block">Status</label>
            <div className={inputWrapperClass}>
              <select
                {...register("jobStatus", {
                  required: "This field is required",
                })}
                className={inputClass}
              >
                <option value="">Select</option>
                <option value="fullTime">Full Time</option>
                <option value="partTime">Part Time</option>
              </select>
            </div>
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>

          {/* Job Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 mt-4">
            <div>
              <label className="text-white mb-2 block">Job Description</label>
              <div className={inputWrapperClass}>
                <input
                  type="text"
                  placeholder="Enter Job Description"
                  {...register("jobDescription")}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="text-white mb-2 block">W/C Code</label>
              <div className={inputWrapperClass}>
                <input
                  type="text"
                  placeholder="Enter W/C Code"
                  {...register("wcCode")}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="text-white mb-2 block">Hire Date</label>
              <div className={inputWrapperClass}>
                <input
                  type="date"
                  {...register("hireDate")}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Termination & Pay */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-white mb-2 block">Termination</label>
              <div className={inputWrapperClass}>
                <input
                  type="date"
                  {...register("terminateDate")}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="text-white mb-2 block">Pay Rate</label>
              <div className={inputWrapperClass}>
                <select {...register("payRate")} className={inputClass}>
                  <option value="">Select</option>
                  <option value="hourly">Hourly</option>
                  <option value="salaryExempt">Salary (O.T Exempt)</option>
                  <option value="salaryNonExempt">
                    Salary (O.T Non-Exempt)
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Salary Amount */}
          <div className="mb-4">
            <label className="text-white mb-2 block">Salary Amount</label>
            <div className={inputWrapperClass}>
              <input
                type="number"
                placeholder="Enter Salary Amount"
                {...register("salaryAmount")}
                className={inputClass}
              />
            </div>
          </div>

          <li className="text-3xl font-medium mb-7">
            If salary O.T. non-exempt, what is the special breakdown of rates to
            be included in salary?
          </li>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-white mb-2 block">
                Regular rate (1st 40 hours)
              </label>
              <div className={inputWrapperClass}>
                <input
                  type="number"
                  placeholder="Enter Salary Amount"
                  {...register("regularRateSalary")}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="text-white mb-2 block">O.T. Rate</label>
              <div className={inputWrapperClass}>
                <input
                  type="number"
                  placeholder="Enter O.T Amount"
                  {...register("otRate")}
                  className={inputClass}
                />
              </div>
              {errors.mayWeContact && (
                <p className="text-red-500 text-sm">
                  {errors.mayWeContact.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-white mb-2 block">
                Work Hours per pay period
              </label>
              <div className={inputWrapperClass}>
                <input
                  type="number"
                  placeholder="Enter hour per pay day"
                  {...register("workHoursPerPeriod")}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-white mb-2 block">Received By *</label>
              <div className={inputWrapperClass}>
                <input
                  type="file"
                  accept="image/*"
                  placeholder="Enter your signature"
                  {...register("receivedBy")}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="text-white mb-2 block">Date *</label>
              <div className={inputWrapperClass}>
                <input
                  type="date"
                  placeholder="MM-DD-YYYY"
                  {...register("receivedDate")}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <div className="max-w-4xl mx-auto">
            <button
              type="submit"
              className="mt-6 px-6 py-2 bg-gradient-to-r from-[#8D6851] to-[#D3BFB2] text-white rounded-md hover:opacity-90"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminForm;
