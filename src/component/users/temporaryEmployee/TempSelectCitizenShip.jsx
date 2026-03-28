import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import ProgressBar from "../../progressBar/ProgressBar";
import { FaHome } from "react-icons/fa";
import { CiCircleCheck, CiCircleInfo } from "react-icons/ci";
import { Upload } from "lucide-react";

// Button Component
const Button = ({ type = "button", className, onClick, children }) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-6 py-2 rounded-md font-medium ${className}`}
  >
    {children}
  </button>
);

// UploadField Component
const UploadField = ({ label, name, setValue }) => {
  const [previews, setPreviews] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const {
    register,
    formState: { errors },
  } = useForm();

  // Clean up URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  const handleFileChange = (files) => {
    if (files && files.length > 0) {
      console.log(
        `${name} files:`,
        Array.from(files).map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
        }))
      );
      setValue(name, files, { shouldValidate: true });
      const newPreviews = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        type: file.type,
      }));
      setPreviews(newPreviews);
    } else {
      console.log(`${name}: No files selected`);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div className="mt-6">
      <h1 className="text-lg font-medium text-white mb-2">
        {label} <span className="text-red-500">*</span>
      </h1>
      <div
        className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          isDragOver ? "border-[#8D6851] bg-gray-100" : "border-[#8D6851]"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          const files = e.dataTransfer.files;
          handleFileChange(files);
        }}
      >
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto bg-[#201925] rounded-lg flex items-center justify-center">
            <Upload className="w-8 h-8 text-[#8D6851]" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-white mb-3">
          Upload Documents
        </h2>
        <p className="text-gray-400 mb-6">
          Drag and drop files here, or browse
        </p>
        <Button
          type="button"
          className="bg-[#8D6851] text-white"
          onClick={() => document.getElementById(name)?.click()}
        >
          Choose File
        </Button>
        <input
          id={name}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
          {...register(name, {
            required: `${label} is required`,
            validate: (files) => files?.length > 0 || `${label} is required`,
          })}
          onChange={(e) => handleFileChange(e.target.files)}
        />
        <p className="text-sm text-gray-400 mt-2">
          Supports JPG, PNG, PDF up to 10MB
        </p>
      </div>
      {errors[name] && (
        <p className="text-red-500 text-sm mt-2">{errors[name].message}</p>
      )}
      {previews.length > 0 && (
        <div className="mt-4">
          <h3 className="text-white mb-2">Previews:</h3>
          {previews.map((preview, index) => (
            <div key={index} className="mb-4">
              {preview.type === "application/pdf" ? (
                <iframe
                  src={preview.url}
                  width="100%"
                  height="300"
                  title={`PDF Preview ${index + 1}`}
                />
              ) : (
                <img
                  src={preview.url}
                  alt={`Preview ${index + 1}`}
                  className="max-w-full h-auto"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SelectCitizenShip = ({
  prevStep,
  nextStep,
  step,
  setFormData,
  handleFinalSubmit,
}) => {
  const [selectedJobType, setSelectedJobType] = useState("");
  const totalSteps = 12;

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      citizenship: "",
    },
  });

  const [isDragOver, setIsDragOver] = useState(false);

  // Handle citizenship selection and update form value
  const handleSelection = useCallback(
    (type) => {
      setSelectedJobType(type);
      setValue("citizenship", type, { shouldValidate: true });
      setValue("photoId", null, { shouldValidate: true });
      setValue("ssn", null, { shouldValidate: true });
      setValue("residentCard", null, { shouldValidate: true });
      setValue("workAuth", null, { shouldValidate: true });
    },
    [setValue, getValues]
  );

  // Handle form submission
  const onSubmit = (data) => {
    let citizenshipData;
    let updatedData;

    switch (data.citizenship) {
      case "Citizen":
        setFormData((prev) => {
          updatedData = {
            ...prev,
            citizenShipForm: "citizen",
            photoId: data.photoId?.[0],
            socialSecurityCard: data.ssn?.[0],
          };
        });
        break;

      case "Resident":
        setFormData((prev) => {
          updatedData = {
            ...prev,
            citizenShipForm: "resident",
            photoId: data.photoId?.[0],
            socialSecurityCard: data.ssn?.[0],
            residentCard: data.residentCard?.[0],
          };
        });
        break;

      case "WorkAuth":
        setFormData((prev) => {
          updatedData = {
            ...prev,
            citizenShipForm: "workauth",
            photoId: data.photoId?.[0],
            socialSecurityCard: data.ssn?.[0],
            workAuthorizationDocument: data.workAuth,
          };
        });
        break;

      default:
        console.warn("Invalid citizenship type");
    }
    handleFinalSubmit(updatedData);
  };

  // Render upload fields based on citizenship selection
  const renderUploadFields = () => {
    if (selectedJobType === "Citizen") {
      return (
        <>
          <UploadField
            label="Photo I.D. (Driver's License, Passport)"
            name="photoId"
            setValue={setValue}
          />
          <UploadField
            label="Social Security Card"
            name="ssn"
            setValue={setValue}
          />
        </>
      );
    }
    if (selectedJobType === "Resident") {
      return (
        <>
          <UploadField
            label="Photo I.D. (Driver's License, Passport)"
            name="photoId"
            setValue={setValue}
          />
          <UploadField
            label="Social Security Card"
            name="ssn"
            setValue={setValue}
          />
          <UploadField
            label="Resident Card"
            name="residentCard"
            setValue={setValue}
          />
        </>
      );
    }
    if (selectedJobType === "WorkAuth") {
      return (
        <>
          <UploadField
            label="Photo I.D. (Driver's License, Passport)"
            name="photoId"
            setValue={setValue}
          />
          <UploadField
            label="Social Security Card"
            name="ssn"
            setValue={setValue}
          />
          <UploadField
            label="Work Authorization Card/Document"
            name="workAuth"
            setValue={setValue}
          />
        </>
      );
    }
    return null;
  };

  return (
    <div className="text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex space-x-96 mb-4">
          <div>
            <div className="font-bold text-lg mb-2">CBYRAC, INC</div>
            <div>123 MAIN STREET SUITE 100</div>
            <div>ANYTOWN, STATE 12345</div>
            <div>PHONE: 555-555-5555</div>
            <div>EMAIL: info@cbyrac.com</div>
          </div>
          <div className="w-24 h-24 bg-white rounded">
            <img src="/cbyrac-logo.png" alt="Company Logo" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Employment Application</h1>
          <p className="text-sm text-gray-300 mb-7">
            Please fill all forms, signatures are not a substitute for a
            completed application
          </p>
          <ProgressBar currentStep={step} totalSteps={totalSteps} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="text-[40px] font-bold text-center mt-12 mb-14">
            Select Your Citizenship <span className="text-red-500">*</span>
          </p>

          {/* Citizenship buttons */}
          <div className="flex justify-center gap-6">
            <button
              type="button"
              className={`w-[250px] text-2xl h-[140px] rounded-lg ${
                selectedJobType === "Citizen"
                  ? "bg-[#9e7c5e] border-2 border-white"
                  : "bg-gradient-to-r from-[#8C6750] to-[#D4BFB2]"
              }`}
              onClick={() => handleSelection("Citizen")}
            >
              <div className="flex items-center justify-between text-2xl text-white px-6">
                <div className="text-3xl">
                  <FaHome />
                </div>
                <CiCircleCheck />
              </div>
              <p className="text-start px-6 mt-8">Citizen</p>
            </button>
            <button
              type="button"
              className={`w-[250px] text-2xl h-[140px] rounded-lg ${
                selectedJobType === "Resident"
                  ? "bg-[#9e7c5e] border-2 border-white"
                  : "bg-gradient-to-r from-[#8C6750] to-[#D4BFB2]"
              }`}
              onClick={() => handleSelection("Resident")}
            >
              <div className="flex items-center justify-between text-2xl text-white px-6">
                <div className="text-3xl">
                  <FaHome />
                </div>
                <CiCircleCheck />
              </div>
              <p className="text-start px-6 mt-8">Resident</p>
            </button>
            <button
              type="button"
              className={`w-[250px] text-2xl h-[140px] rounded-lg ${
                selectedJobType === "WorkAuth"
                  ? "bg-[#9e7c5e] border-2 border-white"
                  : "bg-gradient-to-r from-[#8C6750] to-[#D4BFB2]"
              }`}
              onClick={() => handleSelection("WorkAuth")}
            >
              <div className="flex items-center justify-between text-2xl text-white px-6">
                <div className="text-3xl">
                  <FaHome />
                </div>
                <CiCircleCheck />
              </div>
              <p className="text-start px-4 mt-8">Work Authorization</p>
            </button>
          </div>
          {errors.citizenship && (
            <p className="text-red-500 text-sm text-center mt-4">
              {errors.citizenship.message}
            </p>
          )}

          {/* Hidden input for citizenship validation */}
          <input
            type="hidden"
            {...register("citizenship", {
              required: "Citizenship selection is required",
            })}
          />

          {/* Dynamic Upload Fields */}
          <div className="max-w-2xl mx-auto mt-8">{renderUploadFields()}</div>

          <div className="mt-9 flex justify-center">
            <button
              type="submit"
              className="w-80 py-3.5 bg-[#8D6851] text-white rounded-md font-medium hover:bg-[#9e7c5e] transition-colors"
            >
              Submit Application
            </button>
          </div>

          <div className="flex items-center max-w-2xl mx-auto gap-2 mt-8 text-gray-300">
            <CiCircleInfo className="text-3xl text-[#F4E53D]" />
            <div>
              <p className="text-sm mt-3.5">
                You will need to review your application carefully, and if you
                agree with everything, click on 'Submit Application' to proceed.
              </p>
              <p className="text-sm text-center">
                Only then will you be able to submit your application.
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-6 gap-4">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Previous
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SelectCitizenShip;
