import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import ProgressBar from "../../progressBar/ProgressBar";
import { IoPeopleOutline } from "react-icons/io5";
import { CiCircleCheck } from "react-icons/ci";
import { Eye, Upload, X } from "lucide-react";

const Button = ({ type = "button", className, onClick, children }) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-6 py-2 rounded-md font-medium ${className}`}
  >
    {children}
  </button>
);

const BankAccount = ({ prevStep, step, nextStep, setFormData, preview }) => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [depositType, setDepositType] = useState("");
  const [selectedPercentage, setSelectedPercentage] = useState(0);
  const [files, setFiles] = useState([]); // uploaded files state
  const [selectedPDF, setSelectedPDF] = useState(null); // modal pdf state
  const [isDragOver, setIsDragOver] = useState(false);
  const [accountData, setAccountData] = useState({
    checkingAccount: null,
    savingsAccount: null,
  });

  const totalSteps = 13;

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
    trigger,
  } = useForm({
    defaultValues: {
      name: "",
      ssn: "",
      documents: null,
      bankName: "",
      state: "",
      depositType: "",
      depositPercentage: "",
      transitNo: "",
      accountNo: "",
      secondBankName: "",
      savingsTransitNo: "",
      savingsAccountNo: "",
      signDate: new Date().toISOString().split("T")[0],
    },
  });

  // File upload handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = droppedFiles.filter((file) =>
        ["image/jpeg", "image/png", "application/pdf"].includes(file.type)
      );

      if (validFiles.length > 0) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(validFiles[0]); // Only take the first valid file
        setFiles([validFiles[0]]);
        setValue("documents", dataTransfer.files, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter((file) =>
      ["image/jpeg", "image/png", "application/pdf"].includes(file.type)
    );

    if (validFiles.length > 0) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(validFiles[0]);
      setFiles([validFiles[0]]);
      setValue("documents", dataTransfer.files, { shouldValidate: true });
    }
  };

  const handleRemoveFile = () => {
    setFiles([]);
    setValue("documents", null, { shouldValidate: true });
  };

  // Handle form submission
  const handleNext = async () => {
    const result = await trigger();
    if (result) {
      const allData = getValues();
      let updatedAccountData;

      if (selectedAccount === "checking") {
        updatedAccountData = {
          ...accountData,
          name: allData.name,
          ssn: allData.ssn,
          signatureDate: allData.signDate,
          checkingAccount: {
            accountType: "Checking",
            bankName: allData.bankName,
            state: allData.state,
            depositType: allData.depositType,
            depositPercentage: allData.depositPercentage,
            transitNo: allData.transitNo,
            accountNo: allData.accountNo,
          },
        };
      } else {
        updatedAccountData = {
          ...accountData,
          savingsAccount: {
            accountType: "Savings",
            bankName: allData.secondBankName,
            transitNo: allData.savingsTransitNo,
            accountNo: allData.savingsAccountNo,
            depositPercentage:
              accountData.checkingAccount?.depositType === "full"
                ? 0
                : accountData.checkingAccount?.depositType === "partial"
                ? 100 - Number(accountData.checkingAccount.depositPercentage)
                : "",
          },
        };
      }

      setAccountData(updatedAccountData);

      // Log the updated account data to console
      console.log("Collected Account Data:", updatedAccountData);
      setFiles([]);
      setDepositType("");
      setSelectedPercentage(0);

      // If checking data is collected, allow switching to savings
      if (selectedAccount === "checking") {
        setSelectedAccount("savings");
      } else if (selectedAccount === "savings") {
        // If both checking and savings data are collected, proceed to next step
        if (updatedAccountData.checkingAccount) {
          console.log("Account Data", accountData);
          setFormData((prev) => ({
            ...prev,
            bankForm: updatedAccountData,
            accountFile: allData.documents[0],
          })); // Pass combined data to parent
          nextStep();
        } else {
          setSelectedAccount("checking"); // Go back to checking if not filled
        }
      }
    } else {
      console.log("❌ Validation errors:", errors);
    }
  };

  const inputWrapperClass =
    "rounded-md bg-gradient-to-r from-[#8D6851] to-[#D3BFB2] mt-1 p-[1px]";
  const inputClass =
    "w-full bg-slate-900 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-0";

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
            <img src="/cbyrac-logo.png" alt="" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            Employee Direct Deposit Authorization Agreement
          </h1>
          <p className="text-sm text-gray-300 mb-7">(ACH CREDIT & DEBITS)</p>
          <ProgressBar currentStep={step} totalSteps={totalSteps} />
        </div>

        {/* Account Type Buttons */}
        <p className="text-[40px] font-bold text-center mt-12">
          Select Bank Account Type
        </p>
        <p className="text-red-600 mb-14 text-center text-lg font-medium">
          Select Checking & 100%. Saving option only if needed.
        </p>
        <div className="flex justify-center gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
            <button
              type="button"
              className={`w-[293px] h-[158px] text-white rounded-lg transition-all duration-300 ${
                selectedAccount === "checking"
                  ? "bg-[#9e7c5e] border-3 border-white"
                  : "bg-gradient-to-r from-[#8C6750] to-[#D4BFB2]"
              }`}
              onClick={() => setSelectedAccount("checking")}
            >
              <div className="flex items-center justify-between text-2xl text-white px-10">
                <IoPeopleOutline className="text-3xl" />
                <CiCircleCheck />
              </div>
              <p className="flex justify-start px-10 mt-8 text-2xl font-semibold">
                Checking Account
              </p>
            </button>

            <button
              type="button"
              className={`w-[293px] h-[158px] text-white rounded-lg transition-all duration-300 ${
                selectedAccount === "savings"
                  ? "bg-[#9e7c5e] border-3 border-white"
                  : "bg-gradient-to-r from-[#8C6750] to-[#D4BFB2]"
              }`}
              onClick={() => setSelectedAccount("savings")}
            >
              <div className="flex items-center justify-between text-2xl text-white px-10">
                <IoPeopleOutline className="text-3xl" />
                <CiCircleCheck />
              </div>
              <p className="flex justify-start px-6 mt-8 text-2xl font-semibold">
                Savings Account
              </p>
            </button>
          </div>
        </div>

        {/* Conditionally render form */}
        {selectedAccount && (
          <form className="rounded-2xl max-w-7xl mx-auto mt-10">
            <header className="text-xl text-white font-semibold mt-9">
              {selectedAccount === "checking"
                ? "Checking Account Details"
                : "Savings Account Details"}
            </header>

            {/* === Checking Account Fields === */}
            {selectedAccount === "checking" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 mt-4">
                  <div>
                    <label className="text-white mb-1 block">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <div className={inputWrapperClass}>
                      <input
                        type="text"
                        placeholder="Enter Name"
                        {...register("name", {
                          required: "name is required",
                        })}
                        className={inputClass}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-white mb-1 block">
                      SSN <span className="text-red-500">*</span>
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
                          let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                          if (value.length > 3)
                            value = value.slice(0, 3) + "-" + value.slice(3);
                          if (value.length > 6)
                            value =
                              value.slice(0, 6) + "-" + value.slice(6, 10);
                          e.target.value = value;
                        }}
                      />
                    </div>
                    {errors.ssn && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.ssn.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-white mb-1 block">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <div className={inputWrapperClass}>
                      <input
                        type="text"
                        placeholder="Enter Bank Name"
                        {...register("bankName", {
                          required: "Bank name is required",
                        })}
                        className={inputClass}
                      />
                    </div>
                    {errors.bankName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.bankName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-white mb-1 block">State</label>
                    <div className={inputWrapperClass}>
                      <input
                        type="text"
                        placeholder="Enter State"
                        {...register("state")}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-white mb-1 block">
                      Deposit type <span className="text-red-500">*</span>
                    </label>
                    <div className={inputWrapperClass}>
                      <select
                        {...register("depositType", {
                          required: "Please select a deposit type",
                        })}
                        value={depositType}
                        onChange={(e) => setDepositType(e.target.value)}
                        className={`${inputClass} bg-[#05051A]`}
                      >
                        <option value="">Select</option>
                        <option value="full">Full Pay Check</option>
                        <option value="partial">Partial Pay Check</option>
                      </select>
                    </div>
                    {errors.depositType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.depositType.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-white mb-1 block">
                      Deposit Percentage <span className="text-red-500">*</span>
                    </label>
                    <div className={`${inputWrapperClass} relative`}>
                      {depositType === "full" ? (
                        <input
                          type="number"
                          value={100}
                          readOnly
                          className={`${inputClass} cursor-not-allowed`}
                        />
                      ) : depositType === "partial" ? (
                        <select
                          {...register("depositPercentage", {
                            required:
                              depositType === "partial"
                                ? "Please select deposit percentage"
                                : false,
                          })}
                          value={selectedPercentage}
                          onChange={(e) =>
                            setSelectedPercentage(Number(e.target.value))
                          }
                          className={`${inputClass} bg-[#05051A]`}
                        >
                          <option value="">Select Percentage</option>
                          {Array.from({ length: 21 }, (_, i) => i * 5).map(
                            (val) => (
                              <option key={val} value={val}>
                                {val}%
                              </option>
                            )
                          )}
                        </select>
                      ) : (
                        <input
                          type="number"
                          placeholder="Select deposit type first"
                          readOnly
                          className={`${inputClass} cursor-not-allowed`}
                        />
                      )}
                    </div>
                    {errors.depositPercentage && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.depositPercentage.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-white mb-1 block">
                      Transit/ABA No <span className="text-red-500">*</span>
                    </label>
                    <div className={inputWrapperClass}>
                      <input
                        type="number"
                        placeholder="Enter Transit/ABA No"
                        {...register("transitNo", {
                          required: "Transit/ABA No is required",
                        })}
                        className={inputClass}
                      />
                    </div>
                    {errors.transitNo && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.transitNo.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-white mb-1 block">
                      Account No <span className="text-red-500">*</span>
                    </label>
                    <div className={inputWrapperClass}>
                      <input
                        type="number"
                        placeholder="Enter Account No"
                        {...register("accountNo", {
                          required: "Account No is required",
                        })}
                        className={inputClass}
                      />
                    </div>
                    {errors.accountNo && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.accountNo.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="mb-6">
                  <h2 className="text-lg font-medium mb-2">
                    Add Documents (Direct Deposit Form / Voided Check){" "}
                    <span className="text-red-500">*</span>
                  </h2>

                  <div
                    className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                      isDragOver
                        ? "border-blue-500 bg-blue-50/10"
                        : "border-[#8D6851]"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-8 h-8 text-[#8D6851] mx-auto mb-4" />
                    <p className="mb-4">Drag and drop a file or browse</p>
                    <Button
                      type="button"
                      className="bg-[#8D6851] hover:bg-amber-800 text-white"
                      onClick={() =>
                        document.getElementById("file-input")?.click()
                      }
                    >
                      Choose File
                    </Button>
                    <input
                      id="file-input"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </div>

                  {/* File Preview Section */}
                  {files.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {files.map((file, index) => {
                        const fileURL = URL.createObjectURL(file);
                        const isImage = file.type.startsWith("image/");
                        const isPDF = file.type === "application/pdf";

                        return (
                          <div
                            key={index}
                            className="relative border rounded-md p-2 bg-white shadow-md"
                          >
                            <button
                              type="button"
                              onClick={handleRemoveFile}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                            >
                              <X size={14} />
                            </button>

                            {isImage && (
                              <img
                                src={fileURL}
                                alt={file.name}
                                className="w-full h-32 object-contain rounded-md"
                              />
                            )}

                            {isPDF && (
                              <div
                                className="w-full h-32 border rounded-md relative cursor-pointer hover:bg-gray-50"
                                onClick={() => setSelectedPDF(fileURL)}
                              >
                                <iframe
                                  src={fileURL}
                                  title={file.name}
                                  className="w-full h-full transform scale-90 origin-top-left pointer-events-none"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                  <p className="text-black text-xl font-semibold flex items-center gap-3 bg-gray-300 p-3 rounded-md">
                                    <Eye size={22} /> View PDF
                                  </p>
                                </div>
                              </div>
                            )}

                            <p className="text-xs mt-2 truncate">{file.name}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {errors.documents && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.documents.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* === Savings Account Fields === */}
            {selectedAccount === "savings" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 mt-4">
                  <div>
                    <label className="text-white mb-1 block">
                      Second Bank Name <span className="text-red-500">*</span>
                    </label>
                    <div className={inputWrapperClass}>
                      <input
                        type="text"
                        placeholder="Enter Bank Name"
                        {...register("secondBankName", {
                          required: "Second Bank Name is required",
                        })}
                        className={inputClass}
                      />
                    </div>
                    {errors.secondBankName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.secondBankName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-white mb-1 block">
                      Deposit Percentage remaining{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className={inputWrapperClass}>
                      <input
                        type="number"
                        value={
                          accountData.checkingAccount?.depositType === "full"
                            ? 0
                            : accountData.checkingAccount?.depositType ===
                              "partial"
                            ? 100 -
                              Number(
                                accountData.checkingAccount?.depositPercentage
                              )
                            : ""
                        }
                        readOnly
                        className={`${inputClass} cursor-not-allowed`}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-white mb-1 block">
                      Transit/ABA No <span className="text-red-500">*</span>
                    </label>
                    <div className={inputWrapperClass}>
                      <input
                        type="number"
                        placeholder="Enter Transit/ABA No"
                        {...register("savingsTransitNo", {
                          required: "Transit/ABA No is required",
                        })}
                        className={inputClass}
                      />
                    </div>
                    {errors.savingsTransitNo && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.savingsTransitNo.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-white mb-1 block">
                      Account No <span className="text-red-500">*</span>
                    </label>
                    <div className={inputWrapperClass}>
                      <input
                        type="number"
                        placeholder="Enter Account No"
                        {...register("savingsAccountNo", {
                          required: "Account No is required",
                        })}
                        className={inputClass}
                      />
                    </div>
                    {errors.savingsAccountNo && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.savingsAccountNo.message}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Signature and Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 mb-4">
              <div className="mb-6">
                <label className="text-white block mb-3">
                  Upload Employee Signature{" "}
                  <span className="text-red-500">*</span>
                </label>

                {preview && (
                  <div className="mt-3 relative inline-block">
                    <img
                      src={preview}
                      alt="Signature Preview"
                      className="w-[200px] h-[80px] object-contain border rounded-md"
                    />
                  </div>
                )}

                {errors.employeeSignature && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.employeeSignature.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block">
                  Date <span className="text-red-500">*</span>
                </label>
                <div className={inputWrapperClass}>
                  <input
                    type="date"
                    {...register("signDate", { required: "Date is required" })}
                    className={`${inputClass} py-3.5`}
                  />
                </div>
                {errors.signDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.signDate.message}
                  </p>
                )}
              </div>
            </div>
          </form>
        )}

        {/* PDF Full View Modal */}
        {selectedPDF && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-11/12 h-5/6 rounded-lg shadow-lg relative">
              <button
                onClick={() => setSelectedPDF(null)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
              >
                <X size={18} />
              </button>
              <iframe
                src={selectedPDF}
                title="Full PDF"
                className="w-full h-full rounded-lg"
              ></iframe>
            </div>
          </div>
        )}

        {/* Navigation */}
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
            onClick={handleNext}
            className="px-6 py-2 bg-gradient-to-r from-[#8D6851] to-[#D3BFB2] text-white rounded-md hover:opacity-90"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankAccount;
