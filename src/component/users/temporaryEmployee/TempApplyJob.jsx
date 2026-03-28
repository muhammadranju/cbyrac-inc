import React, { useState } from "react";

// import ProgressBar from "../../progressBar/ProgressBar";
import { useForm } from "react-hook-form";

import ProgressBar from "../../progressBar/ProgressBar";
import WorkExperienceForm from "./WorkExperienceForm";
import References from "./References";
import DrivingInfoForm from "./DrivingInfoForm";
import TermsText from "./TermsText";
import CertificationText from "./CertificationText";
import InjuriesProcedures from "./InjuriesProcedures";
import AllPolicy from "./AllPolicy";
import TempBankAccount from "./TempBankAccount";
import I9Form from "../internEmployee/I9Form";
import W4Form from "../internEmployee/W4Form";
import TempSelectCitizenShip from "./TempSelectCitizenShip";
import { X, XIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import axiosInstance from "../../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { appendFormData } from "../../../utils/appendFormData";
import { addEmployee } from "../../../redux/feature/tempEmployee/tempEmployeeSlice";

const TempApplyJob = () => {
  const [step, setStep] = useState(1); // track current step
  const [preview, setPreview] = useState(null); // For Signature preview
  const totalSteps = 12; // total number of steps for progress bar
  const [formData, setFormData] = useState({
    generalInfo: {},
    employeeInfo: {},
    drivingLicenceInfo: {},
    applicantCartification: {},
    applicationCarification: {},
    accidentProcedure: {},
    submittalPolicy: {},
    bankForm: {},
    i9Form: null,
    w4Form: null,
    citizenShipForm: "",
    signature: null,
    photoId: null,
    accountFile: null,
    residentCard: null,
    socialSecurityCard: null,
    workAuthorizationDocument: null,
  });
  const navigate = useNavigate();

  //previous and next button logic
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    trigger, // <-- important for step-wise validation
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data Submitted:", data);
  };
  console.log("form Data", formData);
  // Step-wise Next button validation
  const nextStepHandler = async () => {
    // Trigger validation for all fields
    const result = await trigger();
    if (result) {
      const allData = getValues();
      if (step === 1) {
        setFormData((prev) => ({
          ...prev,
          generalInfo: {
            firstName: allData.firstName,
            middleName: allData.middleName,
            lastName: allData.lastName,
            ssn: allData.ssn,
            dateOfBirth: allData.dob,
            applicationDate: allData.applicationDate,
            email: allData.email,
            telephoneNumber: allData.telephone,
            address: allData.address,
            emergencyContact: {
              name: allData.emergencyName,
              relationship: allData.emergencyRelation,
              phone: allData.emergencyTelephone,
            },
            desiredEmploymentType: allData.employmentType,
            desiredSalary: allData.desiredSalary
              ? Number(allData.desiredSalary)
              : undefined,
            hourlyRate: allData.hourlyRate
              ? Number(allData.hourlyRate)
              : undefined,
            appliedPosition: "Intern",
            department: "Fit2Lead",
            overtime: "No",
            startDate: allData.startDate,
            previouslyApplied: allData.previousApplication === "yes",
            previousApplicationDate: allData.applicationDetails,
            previouslyEmployed: allData.previousEmployment === "yes",
            previousSeparationReason: allData.employmentDetails,
            // ✅ EDUCATION array mapped exactly from your table
            education: [
              {
                level: "High School",
                name: allData.highSchoolName,
                major: allData.highSchoolMajor,
                graduationStatus: allData.highSchoolGraduationStatus,
                yearsCompleted: allData.highSchoolYears
                  ? Number(allData.highSchoolYears)
                  : undefined,
                honorsReceived: allData.highSchoolHonors || "",
              },
              {
                level: "College",
                name: allData.collegeName,
                major: allData.collegeMajor,
                graduationStatus: allData.collegeGraduationStatus,
                yearsCompleted: allData.collegeYears
                  ? Number(allData.collegeYears)
                  : undefined,
                honorsReceived: allData.collegeHonors || "",
              },
              {
                level: "Graduate / Professional",
                name: allData.graduateSchoolName,
                major: allData.graduateMajor,
                graduationStatus: allData.graduateGraduationStatus,
                yearsCompleted: allData.graduateYears
                  ? Number(allData.graduateYears)
                  : undefined,
                honorsReceived: allData.graduateHonors || "",
              },
              {
                level: "Trade / Correspondence",
                name: allData.tradeSchoolName,
                major: allData.tradeMajor,
                graduationStatus: allData.tradeGraduationStatus,
                yearsCompleted: allData.tradeYears
                  ? Number(allData.tradeYears)
                  : undefined,
                honorsReceived: allData.tradeHonors || "",
              },
            ].filter(
              (edu) =>
                edu.name ||
                edu.major ||
                edu.graduationStatus ||
                edu.yearsCompleted ||
                edu.honorsReceived
            ),
            specialSkills: allData.skills,
          },
          signature: allData.employeeSignature[0],
        }));
      }

      setStep((prev) => prev + 1);
    } else {
      // Errors exist, stay on current step
      console.log("Validation errors:", errors);
    }
  };

  const handleFinalSubmit = async (updatedData) => {
    try {
      console.log("Form Data", updatedData);
      const fd = new FormData();
      appendFormData(fd, updatedData);
      for (const [key, value] of fd.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      }
      dispatch(addEmployee(fd));
      alert("Temprart Data Submit Successfully !");
      setPreview(null);
      reset();
      setStep(1);
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    }
  };
  // Signature preview handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };
  // For removing the selected image
  const handleRemoveImage = () => {
    setPreview(null);
  };

  const inputWrapperClass =
    "rounded-md bg-gradient-to-r from-[#8D6851] to-[#D3BFB2] mt-1 p-[1px]";
  const inputClass =
    "w-full bg-slate-900 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-0";
  return (
    <div>
      {step === 1 && (
        <div className="text-white ">
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
                <img src="/cbyrac-logo.png" alt="" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">
                Employment Application
              </h1>
              <p className="text-sm text-gray-300 mb-7">
                Please fill all forms, signatures are not a substitute for a
                completed application
              </p>
              {/* progressbar */}
              <ProgressBar currentStep={step} totalSteps={totalSteps} />
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-2xl  max-w-7xl mx-auto"
            >
              {/* General Information */}
              <h2 className="text-xl font-bold text-white mb-4">
                General Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-white mb-1 block">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className={inputWrapperClass}>
                    <input
                      type="text"
                      placeholder="Enter First Name"
                      {...register("firstName", {
                        required: "First Name is required",
                      })}
                      className={inputClass}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-white mb-1 block">Middle Name</label>
                  <div className={inputWrapperClass}>
                    <input
                      type="text"
                      placeholder="Enter Middle Name"
                      {...register("middleName")}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white mb-1 block">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className={inputWrapperClass}>
                    <input
                      type="text"
                      placeholder="Enter Last Name"
                      {...register("lastName", {
                        required: "Last Name is required",
                      })}
                      className={inputClass}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* SSN, DOB, Application Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-white mb-1 block">
                    {" "}
                    Social Security Number (SSN){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className={inputWrapperClass}>
                    <input
                      type="text"
                      placeholder="333-22-4444"
                      {...register("ssn", {
                        required: "SSN is required",
                        pattern: {
                          value: /^\d{3}-\d{2}-\d{4}$/,
                          message: "Invalid SSN format. Use XXX-XX-XXXX",
                        },
                      })}
                      className={inputClass}
                      maxLength={11}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");
                        if (value.length > 3)
                          value = value.slice(0, 3) + "-" + value.slice(3);
                        if (value.length > 6)
                          value = value.slice(0, 6) + "-" + value.slice(6, 10);
                        e.target.value = value;
                      }}
                    />
                  </div>
                  {errors.ssn && (
                    <p className="text-red-500 text-sm">{errors.ssn.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-white mb-1 block">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className={inputWrapperClass}>
                    <input
                      type="date"
                      {...register("dob", {
                        required: "Date of Birth is required",
                      })}
                      className={inputClass}
                    />
                  </div>
                  {errors.dob && (
                    <p className="text-red-500 text-sm">{errors.dob.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-white mb-1 block">
                    Application Date <span className="text-red-500">*</span>
                  </label>
                  <div className={inputWrapperClass}>
                    <input
                      type="date"
                      {...register("applicationDate", {
                        required: "Application Date is required",
                      })}
                      className={inputClass}
                    />
                  </div>
                  {errors.applicationDate && (
                    <p className="text-red-500 text-sm">
                      {errors.applicationDate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Additional General Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-white mb-1 block">
                    Telephone Number <span className="text-red-500">*</span>
                  </label>
                  <div className={inputWrapperClass}>
                    <input
                      type="text"
                      placeholder="Enter Telephone Number"
                      {...register("telephone")}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white mb-1 block">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className={inputWrapperClass}>
                    <input
                      type="email"
                      placeholder="Enter Email Address"
                      {...register("email")}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-white mb-1 block">
                  Address <span className="text-red-500">*</span>
                </label>
                <div className={inputWrapperClass}>
                  <input
                    type="text"
                    placeholder="Street/Apartment/City/State/ZIP"
                    {...register("address")}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Emergency Contact */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 mt-4">
                <div>
                  <label className="text-white mb-3 block">
                    Emergency Contact Person Name{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className={inputWrapperClass}>
                    <input
                      type="text"
                      placeholder="Enter Name"
                      {...register("emergencyName", { required: "Required" })}
                      className={inputClass}
                    />
                  </div>
                  {errors.emergencyName && (
                    <p className="text-red-500 text-sm">
                      {errors.emergencyName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-white mb-3  block">
                    Relation With Emergency Contact Person{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className={inputWrapperClass}>
                    <input
                      type="text"
                      placeholder="Relation"
                      {...register("emergencyRelation", {
                        required: "Required",
                      })}
                      className={inputClass}
                    />
                  </div>
                  {errors.emergencyRelation && (
                    <p className="text-red-500 text-sm">
                      {errors.emergencyRelation.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-white mb-3  block">
                    Emergency Contact Person’s Telephone{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className={inputWrapperClass}>
                    <input
                      type="text"
                      placeholder="Telephone"
                      {...register("emergencyTelephone", {
                        required: "Required",
                      })}
                      className={inputClass}
                    />
                  </div>
                  {errors.emergencyTelephone && (
                    <p className="text-red-500 text-sm">
                      {errors.emergencyTelephone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-white mb-1 block">
                    Type of Employment Desired{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className={inputWrapperClass}>
                    <select
                      {...register("employmentType")}
                      className={inputClass}
                    >
                      <option value="">Select</option>
                      <option value="Intern">Intern</option>
                      <option value="Temporary">Temp Employee</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-white mb-1 block">
                    Desired Salary
                  </label>
                  <div className={inputWrapperClass}>
                    <input
                      type="text"
                      placeholder="Enter Desired Salary"
                      {...register("desiredSalary")}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white mb-1 block">
                    Hourly Rate (Optional)
                  </label>
                  <div className={inputWrapperClass}>
                    <input
                      type="text"
                      placeholder="Enter Hourly Rate"
                      {...register("hourlyRate")}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Position & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-white mb-1 block">
                    Position Applied For
                  </label>
                  <div className={inputWrapperClass}>
                    <input
                      type="text"
                      value="Temporary"
                      readOnly
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white mb-1 block">Department</label>
                  <div className={inputWrapperClass}>
                    <input
                      type="text"
                      placeholder="Enter Department"
                      {...register("department")}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white mb-1 block">Overtime</label>
                  <div className={inputWrapperClass}>
                    <select {...register("overtime")} className={inputClass}>
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="text-white mb-1 block">
                  Date On Which You Can Start Work If Hired
                </label>
                <div className={inputWrapperClass}>
                  <input
                    type="date"
                    {...register("startDate")}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Previous Application */}

              <div className="mt-4">
                <label className="text-white mb-1 block">
                  Have You Previously Applied For Employment With This Company?
                </label>
                <div className={inputWrapperClass}>
                  <select
                    {...register("previousApplication")}
                    className={inputClass}
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-white mb-1 block">
                  If Yes, When and Where Did You Apply
                </label>
                <div className={inputWrapperClass}>
                  <input
                    type="text"
                    placeholder="Enter details"
                    {...register("applicationDetails")}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-white mb-1 block">
                  Have You Ever Been Employed By This Company?
                </label>
                <div className={inputWrapperClass}>
                  <select
                    {...register("previousEmployment")}
                    className={inputClass}
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-white mb-1 block">
                  If Yes, Provide Dates, Location and Reason For Separation
                </label>
                <div className={inputWrapperClass}>
                  <textarea
                    placeholder="Provide details"
                    {...register("employmentDetails")}
                    className={inputClass + " h-24"}
                  />
                </div>
              </div>
              {/* Educational Information */}
              <h2 className="text-xl font-bold text-white my-4">
                Educational Information
              </h2>

              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-[#8D6851] text-white rounded-lg">
                  <thead>
                    <tr className="bg-slate-900 text-left">
                      <th className="border border-[#8D6851] px-4 py-2 w-34">
                        Education
                      </th>
                      <th className="border border-[#8D6851] px-4 py-2">
                        School Name
                      </th>
                      <th className="border border-[#8D6851] px-4 py-2">
                        Study / Major
                      </th>
                      <th className="border border-[#8D6851] px-4 py-2">
                        Graduation Status
                      </th>
                      <th className="border border-[#8D6851] px-4 py-2">
                        # Of Years Completed
                      </th>
                      <th className="border border-[#8D6851] px-4 py-2">
                        Honors Received
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* High School Row */}
                    <tr>
                      <td className="border w-51 border-[#8D6851] px-4 py-2">
                        High School
                      </td>
                      <td className="border border-[#8D6851] px-4 py-2">
                        <input
                          type="text"
                          placeholder="Enter School Name"
                          {...register("highSchoolName")}
                          className="w-full bg-slate-900 text-white px-2 py-1 rounded focus:outline-none"
                        />
                      </td>
                      <td className="border border-[#8D6851] px-4 py-2">
                        <input
                          type="text"
                          placeholder="Study / Major"
                          {...register("highSchoolMajor")}
                          className="w-full bg-slate-900 text-white px-2 py-1 rounded focus:outline-none"
                        />
                      </td>
                      <td className="border border-[#8D6851] px-4 py-2">
                        <select
                          {...register("highSchoolGraduationStatus")}
                          className="w-full bg-slate-900 text-white px-2 py-1 rounded focus:outline-none"
                        >
                          <option value="">Select</option>
                          <option value="Graduated">Graduated</option>
                          <option value="Not Graduate">Not Graduated</option>
                        </select>
                      </td>
                      <td className="border border-[#8D6851] px-4 py-2">
                        <input
                          type="number"
                          placeholder="Years"
                          {...register("highSchoolYears")}
                          className="w-full bg-slate-900 text-white px-2 py-1 rounded focus:outline-none"
                        />
                      </td>
                      <td className="border border-[#8D6851] px-4 py-2">
                        <input
                          type="text"
                          placeholder="Honors"
                          {...register("highSchoolHonors")}
                          className="w-full bg-slate-900 text-white px-2 py-1 rounded focus:outline-none"
                        />
                      </td>
                    </tr>

                    {/* College Row */}
                    <tr>
                      <td className="border border-[#8D6851] px-4 py-2">
                        College
                      </td>
                      <td className="border border-[#8D6851] px-4 py-2">
                        <input
                          type="text"
                          placeholder="Enter College Name"
                          {...register("collegeName")}
                          className="w-full bg-slate-900 text-white px-2 py-1 rounded focus:outline-none"
                        />
                      </td>
                      <td className="border border-[#8D6851] px-4 py-2">
                        <input
                          type="text"
                          placeholder="Study / Major"
                          {...register("collegeMajor")}
                          className="w-full bg-slate-900 text-white px-2 py-1 rounded focus:outline-none"
                        />
                      </td>
                      <td className="border border-[#8D6851] px-4 py-2">
                        <select
                          {...register("collegeGraduationStatus")}
                          className="w-full bg-slate-900 text-white px-2 py-1 rounded focus:outline-none"
                        >
                          <option value="">Select</option>
                          <option value="Graduated">Graduated</option>
                          <option value="Not Graduate">Not Graduated</option>
                        </select>
                      </td>
                      <td className="border border-[#8D6851] px-4 py-2">
                        <input
                          type="number"
                          placeholder="Years"
                          {...register("collegeYears")}
                          className="w-full bg-slate-900 text-white px-2 py-1 rounded focus:outline-none"
                        />
                      </td>
                      <td className="border border-[#8D6851] px-4 py-2">
                        <input
                          type="text"
                          placeholder="Honors"
                          {...register("collegeHonors")}
                          className="w-full bg-slate-900 text-white px-2 py-1 rounded focus:outline-none"
                        />
                      </td>
                    </tr>

                    {/* Graduate / Professional Row */}
                    <tr>
                      <td className="border border-[#8D6851] px-4 py-2">
                        Graduate / Professional
                      </td>
                      <td className="border border-[#8D6851] px-4 py-2">
                        <input
                          type="text"
                          placeholder="Enter School Name"
                          {...register("graduateSchoolName")}
                          className="w-full bg-slate-900 text-white px-2 py-1 rounded focus:outline-none"
                        />
                      </td>
                      <td className="border border-[#8D6851] px-4 py-2">
                        <input
                          type="text"
                          placeholder="Study / Major"
                          {...register("graduateMajor")}
                          className="w-full bg-slate-900 text-white px-2 py-1 rounded focus:outline-none"
                        />
                      </td>
                      <td className="border border-[#8D6851] px-4 py-2">
                        <select
                          {...register("graduateGraduationStatus")}
                          className="w-full bg-slate-900 text-white px-2 py-1 rounded focus:outline-none"
                        >
                          <option value="">Select</option>
                          <option value="Graduated">Graduated</option>
                          <option value="Not Graduate">Not Graduated</option>
                        </select>
                      </td>
                      <td className="border border-[#8D6851] px-4 py-2">
                        <input
                          type="number"
                          placeholder="Years"
                          {...register("graduateYears")}
                          className="w-full bg-slate-900 text-white px-2 py-1 rounded focus:outline-none"
                        />
                      </td>
                      <td className="border border-[#8D6851] px-4 py-2">
                        <input
                          type="text"
                          placeholder="Honors"
                          {...register("graduateHonors")}
                          className="w-full bg-slate-900 text-white px-2 py-1 rounded focus:outline-none"
                        />
                      </td>
                    </tr>

                    {/* Trade or Correspondence Row */}
                    <tr>
                      <td className="border border-[#8D6851] px-4 py-2">
                        Trade / Correspondence
                      </td>
                      <td className="border border-[#8D6851] px-4 py-2">
                        <input
                          type="text"
                          placeholder="Enter School Name"
                          {...register("tradeSchoolName")}
                          className="w-full bg-slate-900 text-white px-2 py-1 rounded focus:outline-none"
                        />
                      </td>
                      <td className="border border-[#8D6851] px-4 py-2">
                        <input
                          type="text"
                          placeholder="Study / Major"
                          {...register("tradeMajor")}
                          className="w-full bg-slate-900 text-white px-2 py-1 rounded focus:outline-none"
                        />
                      </td>
                      <td className="border border-[#8D6851] px-4 py-2">
                        <select
                          {...register("tradeGraduationStatus")}
                          className="w-full bg-slate-900 text-white px-2 py-1 rounded focus:outline-none"
                        >
                          <option value="">Select</option>
                          <option value="Graduated">Graduated</option>
                          <option value="Not Graduate">Not Graduated</option>
                        </select>
                      </td>
                      <td className="border border-[#8D6851] px-4 py-2">
                        <input
                          type="number"
                          placeholder="Years"
                          {...register("tradeYears")}
                          className="w-full bg-slate-900 text-white px-2 py-1 rounded focus:outline-none"
                        />
                      </td>
                      <td className="border border-[#8D6851] px-4 py-2">
                        <input
                          type="text"
                          placeholder="Honors"
                          {...register("tradeHonors")}
                          className="w-full bg-slate-900 text-white px-2 py-1 rounded focus:outline-none"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Special Skills or Qualifications */}
              <div className="mb-6">
                <label className="text-xl font-bold text-white">
                  Special Skills or Qualifications
                </label>
                <div className={inputWrapperClass}>
                  <textarea
                    placeholder="Describe your special skills or qualifications"
                    {...register("skills")}
                    className={inputClass + " h-24"}
                  />
                </div>
              </div>

              {/* Employee Signature */}

              <div className="mb-6">
                <label className="text-white block mb-3">
                  Employee Signature <span className="text-red-500">*</span>{" "}
                  (Take a Picture of your signature For Upload)
                </label>

                {/* Upload Button Hide যদি preview থাকে */}
                {!preview && (
                  <div className="w-[350px] h-[50px] bg-gradient-to-l from-[#D4BFB2] to-[#8D6851] rounded-md mt-1 flex items-center justify-center">
                    <label className="w-full h-full flex items-center justify-center text-white cursor-pointer">
                      <span className="text-center">Upload Signature</span>
                      <input
                        type="file"
                        accept="image/*"
                        {...register("employeeSignature", {
                          required: "Signature is required",
                          onChange: handleFileChange,
                        })}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {/* Image Preview with Cross */}
                {preview && (
                  <div className="mt-3 relative inline-block">
                    <img
                      src={preview}
                      alt="Signature Preview"
                      className="w-[200px] h-[80px] object-contain border rounded-md"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {errors.employeeSignature && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.employeeSignature.message}
                  </p>
                )}
              </div>
              {/* <button>submit</button> */}
            </form>
            <div className="flex justify-center mt-6 gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Previous
              </button>

              <button
                type="button"
                onClick={nextStepHandler}
                className="px-6 py-2 bg-gradient-to-r from-[#8D6851] to-[#D3BFB2] text-white rounded-md hover:opacity-90"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Future steps can be added here */}
      {step === 2 && (
        <div>
          <WorkExperienceForm
            prevStep={prevStep}
            nextStep={nextStep}
            register={register}
            step={step}
            errors={errors}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            trigger={trigger}
          ></WorkExperienceForm>
        </div>
      )}
      {step === 3 && (
        <References
          register={register}
          errors={errors}
          prevStep={prevStep}
          nextStep={nextStep}
          step={step}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
        />
      )}
      {step === 4 && (
        <DrivingInfoForm
          register={register}
          errors={errors}
          prevStep={prevStep}
          nextStep={nextStep}
          step={step}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
        />
      )}
      {step === 5 && (
        <TermsText
          register={register}
          errors={errors}
          prevStep={prevStep}
          nextStep={nextStep}
          setFormData={setFormData}
          step={step}
          preview={preview}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
        />
      )}
      {step === 6 && (
        <CertificationText
          register={register}
          errors={errors}
          prevStep={prevStep}
          nextStep={nextStep}
          setFormData={setFormData}
          step={step}
          preview={preview}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
        />
      )}
      {step === 7 && (
        <InjuriesProcedures
          register={register}
          errors={errors}
          prevStep={prevStep}
          nextStep={nextStep}
          setFormData={setFormData}
          preview={preview}
          step={step}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
        />
      )}
      {step === 8 && (
        <AllPolicy
          register={register}
          errors={errors}
          prevStep={prevStep}
          nextStep={nextStep}
          setFormData={setFormData}
          step={step}
          preview={preview}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
        />
      )}
      {step === 9 && (
        <TempBankAccount
          register={register}
          errors={errors}
          prevStep={prevStep}
          nextStep={nextStep}
          setFormData={setFormData}
          step={step}
          preview={preview}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
        />
      )}
      {step === 10 && (
        <I9Form
          data="Temporary"
          register={register}
          errors={errors}
          prevStep={prevStep}
          setFormData={setFormData}
          nextStep={nextStep}
          step={step}
          preview={preview}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
        />
      )}
      {step === 11 && (
        <W4Form
          data="Temporary"
          register={register}
          errors={errors}
          prevStep={prevStep}
          nextStep={nextStep}
          setFormData={setFormData}
          step={step}
          preview={preview}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
        />
      )}

      {step === 12 && (
        <TempSelectCitizenShip
          register={register}
          errors={errors}
          prevStep={prevStep}
          nextStep={nextStep}
          setFormData={setFormData}
          step={step}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          handleFinalSubmit={handleFinalSubmit}
        />
      )}
    </div>
  );
};

export default TempApplyJob;
