import { Download, Loader2, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getPayrollCalender } from "../../../redux/employeeApi/temporaryApi";
import { VITE_BASE_URL } from "../../../config";

const PayrollCalender = () => {
  const [loadingType, setLoadingType] = useState(null);
  const [payrollData, setPayrollData] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [error, setError] = useState("");

  const {
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        const response = await getPayrollCalender();
        if (response && response.image && response.image.length > 0) {
          const fetchedUrl = response.image[0];
          const fullUrl = fetchedUrl.startsWith("http")
            ? fetchedUrl
            : `${VITE_BASE_URL}${fetchedUrl}`;
          setFileUrl(fullUrl);

          const ext = fetchedUrl.split(".").pop().toLowerCase();
          if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
            setFileType("image");
          } else if (ext === "pdf") {
            setFileType("pdf");
          } else {
            setFileType("unknown");
          }

          setPayrollData(response);
        } else {
          setError("No Payroll Calendar found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load payroll calendar.");
      }
    };

    fetchPayrollData();
  }, []);

  const handleDownload = async () => {
    if (!fileUrl) return alert("File not available for download.");
    setLoadingType("download");
    try {
      const res = await fetch(fileUrl);
      if (!res.ok) throw new Error("Failed to fetch file");
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "PAYROLL_CALENDAR";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
      alert("Failed to download the file!");
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="text-white min-h-screen bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto">
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
        <p className="text-3xl font-semibold text-center mb-14">
          CBYRAC, Inc Payroll Calendar
        </p>

        {/* File Preview */}
        <div className="flex justify-center mb-10">
          {error ? (
            <div className="text-red-500 text-center p-8 bg-red-900/20 rounded-lg">
              {error}
            </div>
          ) : !payrollData ? (
            <div className="flex flex-col items-center gap-4 p-12">
              <Loader2 className="animate-spin w-10 h-10 text-amber-600" />
              <p>Loading payroll calendar...</p>
            </div>
          ) : (
            <div className="border border-gray-700 rounded-lg bg-white shadow-xl max-w-3xl w-full overflow-hidden flex justify-center items-center">
              {fileType === "image" ? (
                <img
                  src={fileUrl}
                  alt="Payroll Calendar"
                  className="w-full h-auto max-h-[800px] object-contain"
                />
              ) : fileType === "pdf" ? (
                <iframe
                  src={fileUrl}
                  title="Payroll Calendar PDF"
                  className="w-full h-[800px]"
                ></iframe>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <ImageIcon className="w-16 h-16 text-gray-700" />
                  <p className="text-gray-700 font-medium">
                    Unsupported File Type
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Download Button */}
        <div className="flex justify-center mt-10">
          <button
            type="button"
            onClick={handleDownload}
            disabled={loadingType === "download" || !fileUrl}
            className="flex items-center gap-2 px-12 py-3 bg-[#946344] text-white text-lg font-medium rounded-md hover:opacity-90 disabled:opacity-70 transition"
          >
            {loadingType === "download" ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {loadingType === "download"
              ? "Downloading..."
              : "Download Payroll Calendar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayrollCalender;
