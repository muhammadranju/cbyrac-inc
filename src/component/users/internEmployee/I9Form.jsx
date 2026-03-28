import { Button } from "antd";
import {
  Download,
  Loader2,
  Printer,
  Upload,
  X,
  Eye,
  Image as ImageIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Document, Page, pdfjs } from "react-pdf";
import { internTimeSheetApi } from "../../../redux/employeeApi/temporaryApi";
import { useDispatch, useSelector } from "react-redux";
import { fetchI9Forms } from "../../../redux/feature/adminI9Form/adminI9FormSlice";
import { VITE_BASE_URL } from "../../../config";
import { fetchI9FormsExample } from "../../../redux/feature/adminI9Form/adminI9ExampleForm";

// Set PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const I9Form = ({ prevStep, nextStep, step, setFormData, preview, data }) => {
  const totalSteps = 5;

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [loadingType, setLoadingType] = useState(null);
  const [files, setFiles] = useState([]);
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const dispatch = useDispatch();
  const {
    trigger,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const { forms } = useSelector((state) => state.I9Form);
  const { form } = useSelector((state) => state.I9FormExample);
  console.log("pdf", forms?.image?.[0]);
  const [selectedPDF, setSelectedPDF] = useState(null);
  /* --------------------------------------------------------------- */
  /*                     FILE VALIDATION & PREVIEW                  */
  /* --------------------------------------------------------------- */

  useEffect(() => {
    const loadData = async () => {
      await dispatch(fetchI9Forms());
      await dispatch(fetchI9FormsExample());
    };

    loadData();
  }, []);

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
  const handleRemoveFile = () => {
    setFiles([]);
    setValue("documents", null, { shouldValidate: true });
  };
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

  /* --------------------------------------------------------------- */
  /*                     DOWNLOAD & PRINT HANDLERS                    */
  /* --------------------------------------------------------------- */

  const handleDownload = async () => {
    setLoadingType("download");

    try {
      const response = await fetch(`${VITE_BASE_URL}/${forms?.image?.[0]}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "Timesheet.pdf"; // file name
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download the PDF file!");
    } finally {
      setLoadingType(null);
    }
  };

  const handlePrint = async () => {
    setLoadingType("download");

    try {
      const response = await fetch(`${VITE_BASE_URL}/${form?.image?.[0]}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "Timesheet.pdf"; // file name
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download the PDF file!");
    } finally {
      setLoadingType(null);
    }
  };

  /* --------------------------------------------------------------- */
  /*                     FORM SUBMIT                                 */
  /* --------------------------------------------------------------- */

  const handleNext = async () => {
    const result = await trigger();

    if (!result) return; // stop if validation failed

    const allData = getValues();

    setFormData((prev) => ({
      ...prev,
      i9Form: allData.documents?.[0],
    }));

    nextStep();
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
          {data ? (
            <h1 className="text-2xl font-bold mb-2">
              Employee I9 Form (For {data} Employee)
            </h1>
          ) : (
            <h1 className="text-2xl font-bold mb-2">
              Employee I9 Form (For Intern Employee)
            </h1>
          )}
          <p className="text-lg text-gray-200">
            Submit I9 Form carefully for validation
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6">
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
              {loadingType === "download" ? "Downloading…" : "Download I9 form"}
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
              {loadingType === "print" ? "Downloading" : "Example I9 form"}
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
          </div>

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

          {/* ------------------- SUBMIT ------------------- */}
          <div className="flex justify-center mt-12">
            {/* Navigation */}
            <div className="flex justify-center mt-10 gap-4">
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
        </form>
      </div>
    </div>
  );
};

export default I9Form;
