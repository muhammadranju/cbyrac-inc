import { Button } from "antd";
import {
  Download,
  Loader2,
  Printer,
  Upload,
  X,
  FileText,
  File,
  Image as ImageIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Document, Page, pdfjs } from "react-pdf";
import { internTimeSheetApi } from "../../../redux/employeeApi/temporaryApi";

// Set PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const TimeSheet = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [loadingType, setLoadingType] = useState(null);

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const pdfUrl = "/Cbyrac_ Inc F2L timesheet (Fillable).pdf";

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  /* --------------------------------------------------------------- */
  /*                     FILE VALIDATION & PREVIEW                  */
  /* --------------------------------------------------------------- */
  const getFileType = (file) => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type === "application/pdf") return "pdf";
    return "other";
  };

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Invalid file type. Allowed: JPG, PNG, PDF");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 10 MB limit");
      return false;
    }
    setError("");
    return true;
  };

  const createPreview = (file, type) => {
    return new Promise((resolve) => {
      if (type === "image") {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      } else {
        resolve("");
      }
    });
  };

  const handleFiles = async (files) => {
    if (!files) return;

    const newFiles = [];

    for (const file of Array.from(files)) {
      if (validateFile(file)) {
        const type = getFileType(file);
        const preview = type === "image" ? await createPreview(file, type) : "";

        newFiles.push({ file, preview, type });
      }
    }

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  /* --------------------------------------------------------------- */
  /*                     DRAG & DROP HANDLERS                        */
  /* --------------------------------------------------------------- */
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };
  const handleFileSelect = (e) => handleFiles(e.target.files);

  const removeFile = (index) =>
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));

  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-6 h-6" />;
      case "pdf":
        return <FileText className="w-6 h-6" />;
      default:
        return <File className="w-6 h-6" />;
    }
  };

  /* --------------------------------------------------------------- */
  /*                     DOWNLOAD & PRINT HANDLERS                    */
  /* --------------------------------------------------------------- */
  const handleDownload = async () => {
    setLoadingType("download");
    try {
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = "Timesheet.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download the PDF file!");
    } finally {
      setLoadingType(null);
    }
  };

  const handlePrint = async () => {
    setLoadingType("print");
    const win = window.open(pdfUrl, "_blank");
    if (win) {
      win.onload = () => win.print();
    } else {
      alert("Please allow pop-ups to print the timesheet.");
    }
    await new Promise((r) => setTimeout(r, 800));
    setLoadingType(null);
  };

  /* --------------------------------------------------------------- */
  /*                     FORM SUBMIT                                 */
  /* --------------------------------------------------------------- */
  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (
        value &&
        typeof value === "object" &&
        value.name &&
        value.size !== undefined
      ) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    });

    uploadedFiles.forEach((item, idx) => {
      formData.append(`timeSheetPdfOrImage`, item.file);
    });
    for (const [key, value] of formData.entries()) {
      if (value instanceof Blob) {
        console.log(
          key,
          `(File: ${value.name}, ${(value.size / 1024).toFixed(1)} KB)`
        );
      } else {
        console.log(key, value);
      }
    }

    const response = await internTimeSheetApi(formData);
    console.log("Data post successfully", response);
    reset();
    setUploadedFiles([]);
  };
  /* --------------------------------------------------------------- */
  /*                     UI STYLES                                   */
  /* --------------------------------------------------------------- */
  const inputWrapperClass =
    "rounded-md bg-gradient-to-r from-[#8D6851] to-[#D3BFB2] mt-1 p-[1px]";
  const inputClass =
    "w-full bg-slate-900 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-0";

  return (
    <div className="text-white min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="text-sm">
            <div className="font-bold text-lg mb-2">CBYRAC, INC</div>
            <div>123 MAIN STREET SUITE 100</div>
            <div>ANYTOWN, STATE 12345</div>
            <div>PHONE: 555-555-5555</div>
            <div>EMAIL: info@cbyrac.com</div>
          </div>
          <div className="w-24 h-24 bg-white rounded flex items-center justify-center overflow-hidden">
            <img src="/cbyrac-logo.png" alt="Logo" className="object-contain" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            Employee Weekly Time Sheet (For Intern Employee)
          </h1>
          <p className="text-lg text-gray-200">
            Submit Timesheet to Payroll@Cbyracinc.com
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* General Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block">
                Employee First Name <span className="text-red-500">*</span>
              </label>
              <div className={inputWrapperClass}>
                <input
                  type="text"
                  placeholder="Enter First Name"
                  {...register("firstName", {
                    required: "First name is required",
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
              <label className="mb-1 block">
                Employee Last Name <span className="text-red-500">*</span>
              </label>
              <div className={inputWrapperClass}>
                <input
                  type="text"
                  placeholder="Enter Last Name"
                  {...register("lastName", {
                    required: "Last name is required",
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

          {/* Department & Job Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block">
                Department Name <span className="text-red-500">*</span>
              </label>
              <div className={inputWrapperClass}>
                <input
                  type="text"
                  placeholder="Enter Department"
                  {...register("departmentName", {
                    required: "Department is required",
                  })}
                  className={inputClass}
                />
              </div>
              {errors.department && (
                <p className="text-red-500 text-sm">
                  {errors.department.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block">
                Job Title <span className="text-red-500">*</span>
              </label>
              <div className={inputWrapperClass}>
                <input
                  type="text"
                  placeholder="Enter Job Title"
                  {...register("jobTitle", {
                    required: "Job title is required",
                  })}
                  className={inputClass}
                />
              </div>
              {errors.jobTitle && (
                <p className="text-red-500 text-sm">
                  {errors.jobTitle.message}
                </p>
              )}
            </div>
          </div>

          {/* Address & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block">
                Address <span className="text-red-500">*</span>
              </label>
              <div className={inputWrapperClass}>
                <input
                  type="text"
                  placeholder="Enter Address"
                  {...register("address", { required: "Address is required" })}
                  className={inputClass}
                />
              </div>
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className={inputWrapperClass}>
                <input
                  type="tel"
                  placeholder="Enter Phone"
                  {...register("phoneNumber", {
                    required: "Phone number is required",
                  })}
                  className={inputClass}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Supervisor Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block">
                Supervisor’s Email <span className="text-red-500">*</span>
              </label>
              <div className={inputWrapperClass}>
                <input
                  type="email"
                  placeholder="Enter Email"
                  {...register("supervisorEmail", {
                    required: "Email is required",
                  })}
                  className={inputClass}
                />
              </div>
              {errors.supervisorEmail && (
                <p className="text-red-500 text-sm">
                  {errors.supervisorEmail.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block">
                Supervisor’s Phone <span className="text-red-500">*</span>
              </label>
              <div className={inputWrapperClass}>
                <input
                  type="tel"
                  placeholder="Enter Phone"
                  {...register("supervisorPhone", {
                    required: "Phone is required",
                  })}
                  className={inputClass}
                />
              </div>
              {errors.supervisorPhone && (
                <p className="text-red-500 text-sm">
                  {errors.supervisorPhone.message}
                </p>
              )}
            </div>
          </div>

          {/* Download / Print Buttons */}
          <div className="flex justify-center gap-6 my-10">
            <button
              type="button"
              onClick={handleDownload}
              disabled={loadingType === "download"}
              className="flex items-center gap-2 px-12 py-3 bg-[#946344] text-white text-lg font-medium rounded-md hover:opacity-90 disabled:opacity-70 transition"
            >
              {loadingType === "download" ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {loadingType === "download"
                ? "Downloading…"
                : "Download Timesheet"}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={loadingType === "print"}
              className="flex items-center gap-2 px-12 py-3 bg-[#946344] text-white text-lg font-medium rounded-md hover:opacity-90 disabled:opacity-70 transition"
            >
              {loadingType === "print" ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <Printer className="w-5 h-5" />
              )}
              {loadingType === "print" ? "Printing…" : "Print Timesheet"}
            </button>
          </div>

          {/* ------------------- FILE UPLOAD AREA ------------------- */}
          <div className="mt-12">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-3 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging
                  ? "border-amber-600 bg-amber-500/5"
                  : "border-amber-500/40"
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center">
                  <Upload className="w-10 h-10 text-amber-600" />
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    Upload Documents
                  </h2>
                  <p className="text-gray-400 mb-6">
                    Drag & drop files here, or click to browse
                  </p>
                </div>

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="!bg-[#946344] hover:bg-amber-700 !text-white !px-9 !py-5 rounded-lg font-semibold"
                >
                  Choose File
                </Button>

                <p className="text-sm text-gray-400">
                  Supports JPG, PNG, PDF – max 10 MB
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Global upload error */}
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Uploaded files preview */}
            {uploadedFiles.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">
                  Uploaded Files ({uploadedFiles.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uploadedFiles.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative border border-gray-700 rounded-lg overflow-hidden bg-slate-800 hover:shadow-lg transition-shadow"
                    >
                      {/* Image preview */}
                      {item.type === "image" && item.preview && (
                        <div className="h-48 bg-gray-900">
                          <img
                            src={item.preview}
                            alt={item.file.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}

                      {/* PDF preview (react-pdf) */}
                      {item.type === "pdf" && (
                        <div className="h-48 bg-gray-900 flex items-center justify-center p-2">
                          <Document
                            file={item.file}
                            onLoadError={console.error}
                            loading={
                              <FileText className="w-12 h-12 text-gray-500" />
                            }
                          >
                            <Page pageNumber={1} width={180} />
                          </Document>
                        </div>
                      )}

                      {/* Fallback for other types */}
                      {item.type === "other" && (
                        <div className="h-48 bg-gray-900 flex items-center justify-center">
                          {getFileIcon(item.type)}
                        </div>
                      )}

                      {/* File info */}
                      <div className="p-3 border-t border-gray-700">
                        <p className="text-sm font-medium truncate">
                          {item.file.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {(item.file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => removeFile(idx)}
                        className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 rounded-full text-white transition"
                        aria-label="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ------------------- SIGNATURE ------------------- */}
          <div className="mt-8">
            <label className="block mb-2">
              Employee Signature <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="employeeSignature1"
              rules={{ required: "Signature is required" }}
              render={({ field }) => (
                <div className="w-[350px] h-[50px] bg-gradient-to-l from-[#D4BFB2] to-[#8D6851] rounded-md flex items-center justify-center cursor-pointer overflow-hidden">
                  <label className="w-full h-full flex items-center justify-center text-white">
                    {field.value ? (
                      <img
                        src={URL.createObjectURL(field.value)}
                        alt="Signature"
                        className="max-h-full"
                      />
                    ) : (
                      "Upload Signature"
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) field.onChange(file);
                      }}
                    />
                  </label>
                </div>
              )}
            />
            {errors.employeeSignature && (
              <p className="text-red-500 text-sm">
                {errors.employeeSignature.message}
              </p>
            )}
          </div>

          {/* ------------------- SUBMIT ------------------- */}
          <div className="flex justify-center mt-12">
            <button
              type="submit"
              className="px-20 py-4 bg-[#946344] text-white text-lg font-medium rounded-md hover:opacity-90 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimeSheet;
