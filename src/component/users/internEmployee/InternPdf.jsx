import { Download, Printer } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { fetchEmployees } from "../../../redux/feature/Internemployee/internSlice";
import { VITE_BASE_URL } from "../../../config";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const InternPdfViewer = () => {
  const dispatch = useDispatch();

  const { employees, status } = useSelector((state) => state.internEmployee);
  const targetRef = useRef(null);
  useEffect(() => {
    dispatch(fetchEmployees());
  }, []);
  console.log(employees);
  const handlePrint = () => {
    window.print();
  };
  const downloadPdf = () => {
    const input = targetRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = (pdfHeight - imgHeight * ratio) / 2;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("downloaded-component.pdf");
    });
  };
  // Send PDF automatically when data is ready
  // useEffect(() => {
  //   const sendPDF = async () => {
  //     if (!employees) return; // wait until employees data is loaded

  //     // generate PDF blob
  //     const pdfBlob = await toPDF();
  //     console.log(pdfBlob);

  //     // prepare FormData to send to backend
  //     const formData = new FormData();
  //     formData.append("pdf", pdfBlob, "employee.pdf");
  //     formData.append("email", import.meta.env.EMAIL);

  //     // send to backend API
  //     await fetch("https://your-backend.com/api/send-pdf", {
  //       method: "POST",
  //       body: formData,
  //     });
  //   };

  //   sendPDF();
  // }, [employees]);

  const formatedDate = (isoDate) => {
    const date = new Date(isoDate).toLocaleDateString("en-GB");
    return date;
  };

  if (!employees && status == "loading") {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-600 font-medium">Loading employees...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="p-4 print:hidden flex justify-end">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Printer size={20} />
          Print Form
        </button>
        <button
          onClick={downloadPdf}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Download size={20} />
          Download Form
        </button>
      </div>

      <div
        ref={targetRef}
        className="min-h-screen bg-gray-50 p-4 print:p-0 print:bg-white"
      >
        <div className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none">
          {/* Print Button - Hidden when printing */}
          {/* Page 1 */}
          <div className="p-8 print:p-12 page-break">
            <div className="flex justify-between">
              {/* Header */}
              <div className=" pb-4 mb-6">
                <h1 className="text-xl font-bold">CBYRAC, INC</h1>
                <p className="text-sm mt-1">633 NE 167TH STREET, SUITE 709</p>
                <p className="text-sm font-medium">
                  NORTH MIAMI BEACH, FL. 33162
                </p>
                <p className="text-sm font-medium">PH:786-403-5043</p>
                <p className="text-sm font-medium">
                  E-MAIL: cbyracinc@gmail.com
                </p>
              </div>
              <div>
                <img
                  className="w-48 h-22 object-contain"
                  src="/cbyrac-logo.png"
                  alt="CBYRAC Logo"
                />
              </div>
            </div>
            <h2 className="bg-black text-white text-center text-lg font-bold mb-4">
              APPLICATION FOR EMPLOYMENT
            </h2>

            <p className=" font-bold text-center mb-4">
              Please Answer All Questions. Resumes Are Not A Substitute For A
              Completed Application.
            </p>

            <div className="flex mb-4 justify-end font-medium">
              <span>Date: </span>
              <span className="border-b border-black min-w-[70px] text-right">
                {"  "}
                {formatedDate(employees?.createdAt) || "\u00A0"}
              </span>
            </div>

            <p className="text-[13px] mb-3 leading-relaxed font-medium">
              We are an equal opportunity employer. Applicants are considered
              for positions without regard to veteran status, uniformed
              servicemember status, race color, religion, sex, national origin,
              age, physical or mental disability, genetic information or any
              other category protected by applicable federal, state, or local
              laws.
            </p>

            <p className="text-smmb-4 leading-relaxed font-semibold">
              THIS COMPANY IS AN AT-WILL EMPLOYER AS ALLOWED BY APPLICABLE STATE
              LAW. THIS MEANS THAT REGARDLESS OF ANY PROVISION IN THIS
              APPLICATION, IF HIRED, THE COMPANY OR I MAY TERMINATE THE
              EMPLOYMENT RELATIONSHIP AT ANY TIME, FOR ANY REASON, WITH OR
              WITHOUT CAUSE OR NOTICE.
            </p>

            {/* Personal Information */}
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Last Name:</span>
                  <span className="border-b border-black flex-1 min-w-[180px]">
                    {employees?.generalInfo?.lastName || "\u00A0"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">First Name:</span>
                  <span className="text-sm font-medium border-b border-black flex-1 min-w-[180px]">
                    {employees?.generalInfo?.firstName || "\u00A0"}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Middle Name:</span>
                  <span className="text-sm font-medium border-b border-black flex-1 min-w-[150px]">
                    {employees?.generalInfo?.middleName || "\u00A0"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium whitespace-nowrap">
                    Social Security Number:
                  </span>
                  <span className="text-sm font-medium border-b border-black flex-1 min-w-0">
                    {employees?.generalInfo?.ssn || "\u00A0"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium whitespace-nowrap">
                    DOB:
                  </span>
                  <span className="text-sm font-medium border-b border-black flex-1 min-w-0">
                    {employees?.generalInfo?.dateOfBirth || "\u00A0"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium whitespace-nowrap">
                    Telephone Number:
                  </span>
                  <span className="text-sm font-medium border-b border-black flex-1 min-w-0">
                    {employees?.generalInfo?.telephoneNumber || "\u00A0"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium whitespace-nowrap">
                    Email Address:
                  </span>
                  <span className="text-sm font-medium border-b border-black flex-1 min-w-0">
                    {employees?.generalInfo?.email || "\u00A0"}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium whitespace-nowrap">
                    Address:
                  </span>
                  <span className="text-sm font-medium border-b border-black flex-1 min-w-0">
                    {employees?.generalInfo?.address || "\u00A0"}
                  </span>
                </div>
                <p className="text-sm italic ml-16">
                  Street/Apartment/City/State/Zip
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium whitespace-nowrap">
                    Address:
                  </span>
                  <span className="border-b border-black flex-1">
                    {employees?.generalInfo?.address || "\u00A0"}
                  </span>
                </div>
                <p className="text-xs italic ml-16">
                  Street/Apartment/City/State/Zip
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium whitespace-nowrap">
                    Emergency Contact Person:
                  </span>
                  <span className="border-b border-black flex-1">
                    <span className="inline-flex justify-between w-full px-2">
                      <span>
                        {employees?.generalInfo?.emergencyContact?.name ||
                          "\u00A0"}
                      </span>
                      <span>
                        {employees?.generalInfo?.emergencyContact
                          ?.relationship || "\u00A0"}
                      </span>
                      <span>
                        {employees?.generalInfo?.emergencyContact?.phone ||
                          "\u00A0"}
                      </span>
                    </span>
                  </span>
                </div>
                <p className="text-xs italic ml-48">
                  Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Relation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Telephone
                </p>
              </div>
            </div>

            {/* Employment Type */}
            {/* Employment Type */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="font-medium whitespace-nowrap">
                  Type of employment desired?{"   "}
                  {employees?.generalInfo?.appliedPosition === "Intern"
                    ? `Intern [✅]`
                    : `Temporary [✅]`}
                  {"     . "}
                  Desired Salary/Hourly Rate
                </span>
                <span className="border-b border-black flex-1">
                  Desired Salary:{" "}
                  {employees?.generalInfo?.desiredSalary || "\u00A0"} / Hourly
                  rate: {employees?.generalInfo?.hourlyRate || "\u00A0"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium whitespace-nowrap">
                    Position Applied For:
                  </span>
                  <span className="border-b border-black flex-1">
                    {employees?.generalInfo?.appliedPosition || "\u00A0"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium whitespace-nowrap">Dept.:</span>
                  <span className="border-b border-black flex-1">
                    {employees?.generalInfo?.department || "\u00A0"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium whitespace-nowrap">
                  Are you willing to work overtime?{"  "}
                  {employees?.generalInfo?.overtime === "Yes"
                    ? `Yes [✅ ]`
                    : `No [❌]`}
                  {"     . "}
                  Date on which you can start work if hired
                </span>
                <span className="border-b border-black flex-1">
                  {employees?.generalInfo?.startDate || "\u00A0"}
                </span>
              </div>
            </div>

            {/* Previous Employment Questions */}
            <div className="space-y-2 mb-6">
              <div>
                <span className="font-medium">
                  Have you previously applied for employment with this company?
                  {"  "}
                  {employees?.generalInfo?.previouslyApplied
                    ? `Yes [✅ ]`
                    : `No [❌]`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium whitespace-nowrap">
                  If yes, when and where did you apply?
                </span>
                <span className="border-b border-black flex-1">
                  {employees?.generalInfo?.previousApplicationDate || "\u00A0"}
                </span>
              </div>

              <div>
                <span className="font-medium">
                  Have you ever been employed by this Company?{"  "}
                  {employees?.generalInfo?.previouslyEmployed
                    ? `Yes [✅ ]`
                    : `No [❌]`}
                  {"     . "}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium whitespace-nowrap">
                  If yes, provide dates of employment, location and reason for
                  separation from employment.
                </span>
                <span className="border-b border-black flex-1">
                  {employees?.generalInfo?.previousSeparationReason || "\u00A0"}
                </span>
              </div>
            </div>

            {/* Education Section */}
            <h3 className="text-sm font-bold mb-2">Education</h3>
            <table className="w-full border border-black mb-4">
              <thead>
                <tr className="border-b border-black">
                  <th className="border-r border-black p-1 text-left font-medium">
                    School Name
                    <br />
                    (Address, City, State)
                  </th>
                  <th className="border-r border-black p-1 text-left font-medium">
                    Course of
                    <br />
                    Study or Major
                  </th>
                  <th className="border-r border-black p-1 text-left font-medium">
                    Graduate?
                    <br />Y or N
                  </th>
                  <th className="border-r border-black p-1 text-left font-medium">
                    # of Years
                    <br />
                    Completed
                  </th>
                  <th className="p-1 text-left font-medium">
                    Honors
                    <br />
                    Received
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-black">
                  <td className="border-r border-black p-1 font-medium">
                    High School
                  </td>
                  <td className="border-r border-black p-1">
                    {employees?.generalInfo?.education?.major || "\u00A0"}
                  </td>
                  <td className="border-r border-black p-1">
                    {employees?.generalInfo?.education?.graduationStatus ||
                      "\u00A0"}
                  </td>
                  <td className="border-r border-black p-1">
                    {employees?.generalInfo?.education?.yearsCompleted ||
                      "\u00A0"}
                  </td>
                  <td className="p-1">
                    {employees?.generalInfo?.education?.honorsReceived
                      ? "Yes"
                      : "No" || "\u00A0"}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Work Experience Header */}
            <h3 className="font-bold mb-2">WORK EXPERIENCE</h3>
            <p className="text-sm font-semibold mb-3 leading-relaxed">
              Please list the names of your present and/or previous employers in
              chronological order with present or most recent employer listed
              first. Provide information for at least the most recent ten (10)
              year period. Attach additional sheets if needed. If self-employed,
              supply firm name and business references. You may include any
              verifiable work performed on a volunteer basis, internships, or
              military service. Your failure to completely respond to each
              inquiry may disqualify you for consideration from employment. Do
              not answer "see resume."
            </p>
          </div>

          {/* Page 2 */}
          <div className="p-8 print:p-12 page-break">
            <div className="text-right text-sm mb-4">2</div>

            <h2 className="text-xl font-medium text-center">
              EMPLOYEE DIRECT DEPOSIT AUTHORIZATION AGREEMENT
            </h2>
            <div className="border-b-2 border-black w-[580px] flex items-center mx-auto mb-2"></div>

            <h3 className="text-xl text-center mb-7">(ACH CREDIT & DEBITS)</h3>

            <div className="flex items-center gap-10 mb-6">
              <span className="text-sm font-medium whitespace-nowrap">
                New Payroll Deposit:
              </span>
              <input
                type="checkbox"
                className="text-sm font-medium border-b border-black inline-block w-10 h-5"
                checked={employees?.newPayrollDeposit || false}
                readOnly
              />
              <span className="text-sm font-medium whitespace-nowrap ml-4">
                Change Deposit Information:
              </span>
              <input
                type="checkbox"
                className="text-sm font-medium border-b border-black inline-block w-10 h-5"
                checked={employees?.changeDepositInfo || false}
                readOnly
              />
              <span className="text-sm font-medium whitespace-nowrap ">
                Revoke Authorization:
              </span>
              <input
                type="checkbox"
                className="text-sm font-medium border-b border-black inline-block w-10 h-5"
                checked={employees?.revokeAuthorization || false}
                readOnly
              />
            </div>
            <div className="mb-10">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-sm font-medium whitespace-nowrap">
                  Date:
                </span>
                <span className="text-sm font-medium border-b border-black inline-block w-40 ml-2">
                  {formatedDate(employees?.createdAt) || "\u00A0"}
                </span>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg whitespace-nowrap">Name:</span>
                <span className="font-medium border-b border-black inline-block w-40 ml-2">
                  {employees?.bankForm?.name || "\u00A0"}
                </span>
                <span className="text-lg whitespace-nowrap ml-4">SSN:</span>
                <span className="font-medium border-b border-black inline-block w-40 ml-2">
                  {employees?.bankForm?.ssn || "\u00A0"}
                </span>
              </div>
            </div>

            <p className="text-sm mb-6 font-medium leading-relaxed">
              I authorize my employer or a payroll processor on my employer's
              behalf to deposit any amounts owned to me by initiating credit
              entries to my account at the financial institution (BANK) indicted
              below. Further, I authorize Bank to accept and credit entries
              indicated by Cbyrac, Inc. to my ☐ Checking ☐ Saving account
              (select one). I acknowledge the deposit of any amount is an
              advance of funds on behalf of my employer and the responsibility
              of my employer. I also authorize my employer, if any, to debit my
              account in the event of a credit which should not have been made
              for an amount not to exceed the original amount of the erroneous
              credit.
            </p>

            <p className="text-lg font-bold text-center">
              Complete Sections 1 or 2 as applicable
            </p>
            <div className="border-b-2 border-black w-82 flex items-center mx-auto mb-6"></div>
            <h3 className="text-xl text-center">
              <span className="font-medium">SECTION 1 CHECKING ACCOUNT;</span>{" "}
              Attach a Voided Check
            </h3>
            <div className="border-b-2 border-black w-[530px] flex items-center mx-auto mb-10"></div>
            {/* Section 1 */}
            <div className="p-3 mb-4">
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg whitespace-nowrap">Bank Name:</span>
                  <span className="text-sm font-medium border-b border-black inline-block w-48 ml-2">
                    {employees?.bankForm?.checkingAccount?.bankName || "\u00A0"}
                  </span>
                  <span className="text-lg whitespace-nowrap ml-4">State:</span>
                  <span className="text-sm font-medium border-b border-black inline-block w-20 ml-2">
                    {employees?.bankForm?.checkingAccount?.state || "\u00A0"}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 justify-center">
                  <span className=" whitespace-nowrap">I wish to deposit:</span>
                  <span className="text-sm font-medium border-b border-black inline-block w-24 ml-2">
                    {employees?.bankForm?.checkingAccount?.depositPercentage ==
                    100
                      ? "Full"
                      : "Partial" || "\u00A0"}
                  </span>
                  <span className=" whitespace-nowrap ml-4">or:</span>
                  <span className="text-sm font-medium border-b border-black inline-block w-24 ml-2">
                    {employees?.bankForm?.checkingAccount?.depositPercentage
                      ? `${employees?.bankForm?.checkingAccount?.depositPercentage}% Net Pay`
                      : "\u00A0"}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-lg whitespace-nowrap">
                    Transit/ABA No.:
                  </span>
                  <span className="text-lg border-b border-black inline-block w-32 ml-2">
                    {employees?.bankForm?.checkingAccount?.transitNo ||
                      "\u00A0"}
                  </span>
                  <span className="text-lg whitespace-nowrap ml-4">
                    Account No.:
                  </span>
                  <span className="text-sm font-medium border-b border-black inline-block w-40 ml-2">
                    {employees?.bankForm?.checkingAccount?.accountNo ||
                      "\u00A0"}
                  </span>
                </div>
              </div>

              <div className="border border-gray-400 p-8 text-center bg-gray-50">
                <p className="font-bold mb-2">ATTACH VOIDED CHECK HERE</p>
                <p className="text-xs">
                  The numbers on the bottom of your voided check are used
                </p>
                <p className="text-xs">
                  To make the electronic funds transfer directly to you account.
                </p>
                <a
                  href={`${VITE_BASE_URL}/image${employees?.accountFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Open PDF in New Tab
                </a>
              </div>
            </div>

            <p className="text-center text-xl font-medium">
              *****************************************************************************************
            </p>

            {/* Section 2 */}
            <div className="p-3 mb-6">
              <h3 className="text-xl text-center">
                <span className="font-medium">SECTION 2 SAVINGS ACCOUNT;</span>{" "}
                Call Your Bank To Obtain the Following Information:
              </h3>

              <div className="border-b-2 border-black flex items-center mx-auto mb-7"></div>

              <div className="mb-4">
                <span className="text-lg whitespace-nowrap">Bank Name:</span>
                <span className="text-sm font-medium border-b border-black inline-block w-48 ml-2">
                  {employees?.bankForm?.savingsAccount?.bankName || "\u00A0"}
                </span>
                <span className="text-lg whitespace-nowrap ml-4">State:</span>
                <span className="text-sm font-medium border-b border-black inline-block w-96 ml-2">
                  {employees?.bankForm?.checkingAccount?.state || "\u00A0"}
                </span>
              </div>
              <div className="mb-4 text-center">
                <span className=" whitespace-nowrap">I wish to deposit:</span>
                <span className="text-sm font-medium border-b border-black inline-block w-24 ml-2">
                  {employees?.bankForm?.checkingAccount?.depositPercentage ==
                  100
                    ? "Full"
                    : "Partial" || "\u00A0"}
                </span>
                <span className=" whitespace-nowrap ml-4">or:</span>
                <span className="text-sm font-medium border-b border-black inline-block w-24 ml-2">
                  {employees?.bankForm?.savingsAccount?.depositPercentage
                    ? `${employees?.bankForm?.savingsAccount?.depositPercentage}% Net Pay`
                    : "\u00A0"}
                </span>
              </div>
              <div className="flex items-center gap-2 font-medium mb-4">
                <span className="text-md">
                  SAVINGS BANK/ROUTING OR TRANSIT NUMBER:
                </span>
                <span className="border-b border-black flex-1 min-w-[220px]">
                  {/* Replace with actual value if available */}
                  {employees?.bankForm?.savingsAccount?.transitNo || "\u00A0"}
                </span>
                <span className="text-sm ml-2">(This Must Be 9 Digits)</span>
              </div>

              {/* Employee Savings Account Number */}
              <div className="flex items-center gap-2">
                <span className="text-md">
                  EMPLOYEE SAVINGS ACCOUNT NUMBER:
                </span>
                <span className="border-b border-black flex-1 min-w-[220px]">
                  {employees?.bankForm?.savingsAccount?.accountNo || "\u00A0"}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-6">
              {/* Signature Section */}
              <div className="flex items-center gap-2 flex-1">
                <span className="text-md whitespace-nowrap">
                  EMPLOYEE SIGNATURE:
                </span>
                <span className="border-b border-black flex-1 min-w-[160px] h-10 flex items-center justify-center">
                  {employees?.signature ? (
                    <img
                      src={`${VITE_BASE_URL}/image${employees?.signature}`}
                      alt="Employee Signature"
                      className="h-8 w-28 object-contain"
                    />
                  ) : (
                    <span className="text-transparent">_</span> // keeps the border height consistent
                  )}
                </span>
              </div>

              {/* Date Section */}
              <div className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-md">DATE:</span>
                <span className="border-b border-black w-40 inline-block">
                  {formatedDate(employees?.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Page 4 */}
          <div>
            <div className="p-8 print:p-12 page-break">
              {/* Header */}
              <div className="flex justify-between items-start mb-4 border-b-2 border-black pb-2">
                <div className="w-20 h-20 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-4 border-black flex items-center justify-center">
                    <div className="text-center text-sm font-bold">
                      <div>DHS</div>
                      <div className="text-[6px]">
                        DEPT OF
                        <br />
                        HOMELAND
                        <br />
                        SECURITY
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <h1 className="text-lg font-bold">
                    Employment Eligibility Verification
                  </h1>
                  <p className="text-xs font-semibold">
                    Department of Homeland Security
                  </p>
                  <p className="text-xs">
                    U.S. Citizenship and Immigration Services
                  </p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-bold">USCIS</p>
                  <p className="font-bold">Form I-9</p>
                  <p>OMB No.1615-0047</p>
                  <p>Expires 10/31/2027</p>
                </div>
              </div>

              {/* START HERE Notice */}
              <div className="bg-gray-100 border border-black p-2 mb-3 text-sm">
                <p>
                  <span className="font-bold">START HERE:</span> Employers must
                  ensure the form instructions are available to employees when
                  completing this form. Employers are liable for failing to
                  comply with the requirements for completing this form. See
                  below and the{" "}
                  <span className="font-bold underline">Instructions</span>.
                </p>
              </div>

              {/* Anti-Discrimination Notice */}
              <div className="bg-gray-100 border border-black p-2 mb-3  text-sm">
                <p>
                  <span className="font-bold">ANTI-DISCRIMINATION NOTICE:</span>{" "}
                  All employers and others who complete or use this form must
                  present Form I-9. Employers cannot ask employees for
                  documentation to verify information in Section 1, or specify
                  which acceptable documentation employees must present for
                  Section 2 or Supplement B, Reverification and Rehire. Treating
                  employees differently based on their citizenship, immigration
                  status, or national origin may be illegal.
                </p>
              </div>

              {/* Section 1 Header */}
              <div className="bg-gray-300 text-black p-1 mb-4 text-xs font-bold">
                Section 1. Employee Information and Attestation: Employees must
                complete and sign Section 1 of Form I-9 no later than the first
                day of employment, but not before accepting a job offer.
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="flex flex-col">
                  <label className="text-sm mb-1">Last name</label>
                  <div className="border border-black px-1 py-2 text-sm h-8">
                    <p>{employees?.i9Form?.lastName}</p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm mb-1">First name</label>
                  <div className="border border-black px-1 py-2 text-sm h-8">
                    <p>{employees?.i9Form?.firstName}</p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm mb-1">
                    Middle Initial (if any)
                  </label>
                  <div className="border border-black px-1 py-2 text-sm h-8">
                    <p>{employees?.i9Form?.middleName}</p>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="text-sm mb-1 block">
                  Other Last Names Used (if any)
                </label>
                <div className="border border-black px-1 py-2 text-xs h-8 w-full">
                  {employees?.i9Form?.otherNames}
                </div>
              </div>

              {/* Address */}
              <div className="grid grid-cols-12 gap-2 mb-3">
                <div className="col-span-6 flex flex-col">
                  <label className="text-sm mb-1">
                    Address (Street Number and Name)
                  </label>
                  <div className="border border-black px-1 py-2 text-xs h-8">
                    {employees?.i9Form?.address}
                  </div>
                </div>
                <div className="col-span-2 flex flex-col">
                  <label className="text-sm mb-1">Apt. Number (if any)</label>
                  <div className="border border-black px-1 py-2 text-xs h-8"></div>
                </div>
                <div className="col-span-2 flex flex-col">
                  <label className="text-sm mb-1">City or Town</label>
                  <div className="border border-black px-1 py-2 text-xs h-8"></div>
                </div>
                <div className="col-span-1 flex flex-col">
                  <label className="text-sm mb-1">State</label>
                  <div className="border border-black px-1 py-2 text-xs h-8"></div>
                </div>
                <div className="col-span-1 flex flex-col">
                  <label className="text-sm mb-1">ZIP Code</label>
                  <div className="border border-black px-1 py-2 text-xs h-8"></div>
                </div>
              </div>

              {/* Date of Birth, SSN, Email */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="flex flex-col">
                  <label className="text-sm mb-1">
                    Date of Birth (mm/dd/yyyy)
                  </label>
                  <div className="border border-black px-1 py-2 text-xs h-8">
                    {employees?.i9Form?.dateOfBirth}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm mb-1">
                    U.S. Social Security Number
                  </label>
                  <div className="border border-black px-1 py-2 text-xs h-8">
                    {employees?.i9Form?.ssn}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm mb-1">
                    Employee's Email Address
                  </label>
                  <div className="border border-black px-1 py-2 text-xs h-8">
                    {employees?.i9Form?.email}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="text-sm mb-1 block">
                  Employee's Telephone Number
                </label>
                <div className="border border-black px-1 py-2 text-xs h-8 w-full">
                  {employees?.i9Form?.phone}
                </div>
              </div>

              {/* Citizenship Attestation */}
              <div className="border border-black p-3 mb-3">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-3 border-r p-2 text-sm">
                    <p className="font-medium">
                      I am aware that federal law provides for imprisonment
                      and/or fines for false statements, or the use of false
                      documents, in connection with the completion of this form.
                      I attest, under penalty of perjury, that this information,
                      including my selection of the box attesting to my
                      citizenship or immigration status, is true and correct.
                    </p>
                  </div>
                  <div className="col-span-9">
                    <p className="text-sm mb-2">
                      Check one of the following boxes to attest to your
                      citizenship or immigration status (See page 2 and 3 of the
                      instructions):
                    </p>
                    <div className="space-y-1 text-sm">
                      {/* 1. US Citizen */}
                      <label className="flex items-start gap-2">
                        <div className="w-3 h-3 border border-black mt-0.5 flex items-center justify-center">
                          {employees?.i9Form?.status === "US Citizen" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="black"
                              className="w-3 h-3"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0l-3.25-3.25a1 1 0 1 1 1.414-1.414L8.5 11.086l6.543-6.543a1 1 0 0 1 1.664.75z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <span>1. A citizen of the United States</span>
                      </label>

                      {/* 2. Noncitizen National */}
                      <label className="flex items-start gap-2">
                        <div className="w-3 h-3 border border-black mt-0.5 flex items-center justify-center">
                          {employees?.i9Form?.status ===
                            "Noncitizen National" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="black"
                              className="w-3 h-3"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0l-3.25-3.25a1 1 0 1 1 1.414-1.414L8.5 11.086l6.543-6.543a1 1 0 0 1 1.664.75z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <span>
                          2. A noncitizen national of the United States (See
                          instructions.)
                        </span>
                      </label>

                      {/* 3. Lawful Permanent Resident */}
                      <label className="flex items-start gap-2">
                        <div className="w-3 h-3 border border-black mt-0.5 flex items-center justify-center">
                          {employees?.i9Form?.status ===
                            "Lawful Permanent Resident" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="black"
                              className="w-3 h-3"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0l-3.25-3.25a1 1 0 1 1 1.414-1.414L8.5 11.086l6.543-6.543a1 1 0 0 1 1.664.75z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <span>
                          3. A lawful permanent resident (Enter USCIS or
                          A-Number.)
                        </span>
                      </label>

                      {/* 4. Other Noncitizen */}
                      <label className="flex items-start gap-2">
                        <div className="w-3 h-3 border border-black mt-0.5 flex items-center justify-center">
                          {employees?.i9Form?.status === "Other Noncitizen" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="black"
                              className="w-3 h-3"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0l-3.25-3.25a1 1 0 1 1 1.414-1.414L8.5 11.086l6.543-6.543a1 1 0 0 1 1.664.75z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <span>
                          4. A noncitizen (Other than item Numbers 2 and 3,
                          above) authorized to work until (exp. date, if any)
                        </span>
                      </label>
                    </div>

                    <p className="text-sm mt-2 font-semibold">
                      If you check Item Number 4, enter one of these:
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex flex-col">
                        <label className="text-sm mb-1">USCIS A-Number</label>
                        <div className="border border-black px-1 py-1 text-xs h-6">
                          {employees?.i9Form?.uscisNumber}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm mb-1">
                          Form I-94 Admission Number
                        </label>
                        <div className="border border-black px-1 py-1 text-xs h-6">
                          {employees?.i9Form?.admissionNumber}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex flex-col">
                        <label className="text-sm mb-1">
                          Foreign Passport Number and Country of Issuance
                        </label>
                        <div className="border border-black px-1 py-1 text-xs h-6">
                          {employees?.i9Form?.foreignPassportNumber}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm mb-1">
                          Country of Issuance
                        </label>
                        <div className="border border-black px-1 py-1 text-xs h-6"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-black">
                  <div className="flex flex-col">
                    <label className="text-sm mb-1">
                      Signature of Employee
                    </label>
                    <div className="border-b-2 border-black px-1 py-2 text-xs h-8 bg-transparent">
                      {employees?.signature ? (
                        <img
                          src={`${VITE_BASE_URL}/image${employees?.signature}`}
                          alt="Employee Signature"
                          className="h-8 w-28 object-contain"
                        />
                      ) : (
                        <span className="text-transparent">_</span> // keeps the border height consistent
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm mb-1">
                      Today's Date (mm/dd/yyyy)
                    </label>
                    <div className="border-b-2 border-black px-1 py-2 text-xs h-8 bg-transparent">
                      {formatedDate(employees?.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Preparer/Translator Notice */}
              <div className="bg-gray-100 border border-black p-2 mb-3 text-sm">
                <p className="font-medium">
                  If a preparer and/or translator assisted you in completing
                  Section 1, that person MUST complete the Preparer and/or
                  Translator Certification on Page 3.
                </p>
              </div>

              {/* Section 2 Header */}
              <div className="bg-gray-300 text-black p-1 mb-5 text-xs font-bold">
                Section 2. Employer Review and Verification: Employers or their
                authorized representative must complete and sign Section 2
                within three business days after the employee's first day of
                employment, and must physically examine, or examine consistent
                with an alternative procedure authorized by the Secretary of
                DHS, documentation from List A OR a combination of documentation
                from List B and List C. Enter any additional documentation in
                the Additional Information box; see instructions.
              </div>

              {/* List A, B, C Table */}
              <div className="grid grid-cols-3 gap-0 mb-3 border border-black">
                <div className="border-r border-black">
                  <div className="bg-gray-200 p-1 text-center font-bold text-sm border-b border-black">
                    List A
                  </div>
                  <div className="p-2 space-y-2">
                    <div>
                      <label className="text-sm block mb-1">
                        Document Title 1:
                      </label>
                      <div className="border border-gray-400 px-1 py-1 text-sm w-full h-6"></div>
                    </div>
                    <div>
                      <label className="text-sm block mb-1">
                        Issuing Authority:
                      </label>
                      <div className="border border-gray-400 px-1 py-1 text-sm w-full h-6"></div>
                    </div>
                    <div>
                      <label className="text-sm block mb-1">
                        Document Number (if any):
                      </label>
                      <div className="border border-gray-400 px-1 py-1 text-sm w-full h-6"></div>
                    </div>
                    <div>
                      <label className="text-sm block mb-1">
                        Expiration Date (if any):
                      </label>
                      <div className="border border-gray-400 px-1 py-1 text-sm w-full h-6"></div>
                    </div>
                    <div className="pt-2 border-t border-gray-400">
                      <label className="text-sm block mb-1">
                        Document Title 2 (if any):
                      </label>
                      <div className="border border-gray-400 px-1 py-1 text-sm w-full h-6"></div>
                    </div>
                    <div>
                      <label className="text-sm block mb-1">
                        Issuing Authority:
                      </label>
                      <div className="border border-gray-400 px-1 py-1 text-sm w-full h-6"></div>
                    </div>
                    <div>
                      <label className="text-sm block mb-1">
                        Document Number (if any):
                      </label>
                      <div className="border border-gray-400 px-1 py-1 text-sm w-full h-6"></div>
                    </div>
                    <div>
                      <label className="text-sm block mb-1">
                        Expiration Date (if any):
                      </label>
                      <div className="border border-gray-400 px-1 py-1 text-sm w-full h-6"></div>
                    </div>
                    <div className="pt-2 border-t border-gray-400">
                      <label className="text-sm block mb-1">
                        Document Title 3 (if any):
                      </label>
                      <div className="border border-gray-400 px-1 py-1 text-sm w-full h-6"></div>
                    </div>
                    <div>
                      <label className="text-sm block mb-1">
                        Issuing Authority:
                      </label>
                      <div className="border border-gray-400 px-1 py-1 text-sm w-full h-6"></div>
                    </div>
                    <div>
                      <label className="text-sm block mb-1">
                        Document Number (if any):
                      </label>
                      <div className="border border-gray-400 px-1 py-1 text-sm w-full h-6"></div>
                    </div>
                    <div>
                      <label className="text-sm block mb-1">
                        Expiration Date (if any):
                      </label>
                      <div className="border border-gray-400 px-1 py-1 text-sm w-full h-6"></div>
                    </div>
                  </div>
                </div>
                <div className="border-r border-black">
                  <div className="bg-gray-200 p-1 text-center font-bold text-sm border-b border-black">
                    List B<br />
                    <span className="font-normal text-sm">AND</span>
                  </div>
                  <div className="p-2">
                    <div className="mb-2">
                      <label className="text-sm block mb-1">
                        Document Title:
                      </label>
                      <div className="border border-gray-400 px-1 py-1 text-sm w-full h-6"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-gray-200 p-1 text-center font-bold text-sm border-b border-black">
                    List C
                  </div>
                  <div className="p-2">
                    <div className="mb-2">
                      <label className="text-sm block mb-1">
                        Document Title:
                      </label>
                      <div className="border border-gray-400 px-1 py-1 text-sm w-full h-6"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="border border-black p-2 mb-3">
                <label className="text-sm font-semibold block mb-1">
                  Additional Information
                </label>
                <div className="border border-gray-400 px-1 py-1 text-xs w-full h-16"></div>
                <div className="flex items-start gap-2 mt-2">
                  <div className="w-3 h-3 border border-black mt-1"></div>
                  <span className="text-sm">
                    Check here if you used an alternative procedure authorized
                    by DHS to examine documents.
                  </span>
                </div>
              </div>
              {/* certification Text */}
              <div className="border border-black p-2 mb-3">
                <p className="text-sm mb-2 font-medium">
                  Certification: I attest, under penalty of perjury, that (1) I
                  have examined the documentation presented by the above-named
                  employee, (2) the above-listed documentation appears to be
                  genuine and to relate to the employee named, and (3) to the
                  best of my knowledge, the employee is authorized to work in
                  the United States.
                </p>
              </div>
              {/* Certification */}
              <div className="border border-black p-2 mb-3">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="flex flex-col">
                    <label className="text-sm mb-1">
                      First Day of Employment (mm/dd/yyyy):
                    </label>
                    <div className="border border-black px-1 py-2 text-xs h-7"></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="flex flex-col">
                    <label className="text-sm mb-1">
                      Last Name, First Name and Title of Employer or Authorized
                      Representative
                    </label>
                    <div className="border border-black px-1 py-2 text-xs h-7"></div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm mb-1">
                      Signature of Employer or Authorized Representative
                    </label>
                    <div className="border-b-2 border-black px-1 py-2 text-xs h-7 bg-transparent"></div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm mb-1">
                      Today's Date (mm/dd/yyyy)
                    </label>
                    <div className="border border-black px-1 py-2 text-xs h-7"></div>
                  </div>
                </div>
                <div className="border-t border-black pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <label className="text-sm mb-6">
                        Employer's Business or Organization Name
                      </label>
                      <div className="border border-black px-1 py-2 text-xs h-7"></div>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm mb-1">
                        Employer's Business or Organization Address, City or
                        Town, State, ZIP Code
                      </label>
                      <div className="border border-black px-1 py-2 text-xs h-7"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page 5 */}
          <div className="p-8 leading-tight print:p-12 page-break">
            {/* Header */}
            <div className="">
              <div className="flex items-start border-b-2 border-black">
                <div className="w-40 border-r-2 border-black p-3">
                  <div className="text-5xl font-medium leading-none">W-4</div>
                  <div className="text-sm mt-1 leading-tight">Form</div>
                  <div className="text-sm leading-tight">
                    Department of the Treasury
                  </div>
                  <div className="text-sm leading-tight">
                    Internal Revenue Service
                  </div>
                </div>
                <div className="flex-1 p-4 text-center">
                  <div className="text-2xl font-bold mb-2">
                    Employee's Withholding Certificate
                  </div>
                  <div className="text-sm leading-tight font-semibold">
                    <span className="font-semibold">Complete Form W-4</span> so
                    that your employer can withhold the correct federal income
                    tax from your pay.
                  </div>
                  <div className="text-sm font-semibold mt-1">
                    Give Form W-4 to your employer.
                  </div>
                  <div className="text-sm mt-1 font-semibold">
                    Your withholding is subject to review by the IRS.
                  </div>
                </div>
                <div className="w-40 border-l-2 border-black p-3 text-right">
                  <div className="text-sm">OMB No. 1545-0074</div>
                  <div className="text-5xl font-medium text-center my-1">
                    2025
                  </div>
                </div>
              </div>

              {/* Step 1: Enter Personal Information */}
              <div className="border-b-2 border-black">
                <div className="flex">
                  <div className="w-32 border-r-2 border-black p-3">
                    <div className="font-bold text-sm leading-tight">
                      Step 1:
                    </div>
                    <div className="font-bold text-sm leading-tight">Enter</div>
                    <div className="font-bold text-sm leading-tight">
                      Personal
                    </div>
                    <div className="font-bold text-sm leading-tight">
                      Information
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex border-b border-black">
                      <div className="flex-1 border-r border-black p-2">
                        <div className="mb-1">
                          (a){" "}
                          <span className="text-sm ml-1">
                            First name and middle initial
                          </span>
                        </div>
                        <div className="font-medium">
                          <p>
                            {employees?.w4Form?.firstName}{" "}
                            {employees?.w4Form?.middleName}
                          </p>
                        </div>
                      </div>
                      <div className="flex-1 border-r border-black p-2">
                        <div className="text-sm ml-1">Last name</div>
                        <div className="font-medium">
                          <p>{employees?.w4Form?.lastName}</p>
                        </div>
                      </div>
                      <div className="w-56 p-2">
                        <div className="text-sm mb-1">
                          (b){" "}
                          <span className="ml-1">Social security number</span>
                        </div>
                        <div className="font-medium">
                          <p>{employees?.w4Form?.ssn}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex border-b border-black">
                      <div className="flex-1 border-r border-black p-2">
                        <div className="text-sm mb-1">Address</div>
                        <div className="font-medium">
                          <p>{employees?.w4Form?.address}</p>
                        </div>
                      </div>
                      <div className="w-56 p-2 text-sm leading-tight">
                        <div className="mb-0.5">Does your name match the</div>
                        <div className="mb-0.5">
                          name on your social security
                        </div>
                        <div className="mb-0.5">
                          card? If not, to ensure you get
                        </div>
                        <div className="mb-0.5">credit for your earnings,</div>
                        <div className="mb-0.5">
                          contact SSA at 800-772-1213
                        </div>
                        <div>
                          or go to{" "}
                          <span className="font-semibold">www.ssa.gov</span>.
                        </div>
                      </div>
                    </div>

                    <div className="border-b border-black p-2">
                      <div className="text-sm mb-1">
                        City or town, state, and ZIP code
                      </div>
                      <div className="font-medium">
                        <p></p>
                      </div>
                    </div>

                    <div className="p-2">
                      <div className="text-sm mb-2">(c)</div>
                      <label className="flex items-start mb-1.5">
                        <div className="w-4 h-4 border border-black mt-0.5 mr-2 flex items-center justify-center">
                          <div className="w-2 h-2 bg-black"></div>
                        </div>
                        <span className="text-sm">
                          Single or Married filing separately
                        </span>
                      </label>
                      <label className="flex items-start mb-1.5">
                        <div className="w-4 h-4 border border-black mt-0.5 mr-2"></div>
                        <span className="text-sm">
                          Married filing jointly or Qualifying surviving spouse
                        </span>
                      </label>
                      <label className="flex items-start">
                        <div className="w-4 h-4 border border-black mt-0.5 mr-2"></div>
                        <span className="text-sm">
                          Head of household (Check only if you're unmarried and
                          pay more than half the costs of keeping up a home for
                          yourself and a qualifying individual.)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* TIP Section */}
              <div className="p-3 text-sm leading-relaxed">
                <p className="mb-2">
                  <span className="font-bold">TIP:</span> Consider using the
                  estimator at <span className="italic">www.irs.gov/W4App</span>{" "}
                  to determine the most accurate withholding for the rest of the
                  year if: you are completing this form after the beginning of
                  the year; expect to work only part of the year; or have
                  changes during the year in your marital status, number of jobs
                  for you (and/or your spouse if married filing jointly),
                  dependents, other income (not from jobs), deductions, or
                  credits. Even if you use the estimator, you still need to
                  complete and submit Form W-4 to your employer. At the
                  beginning of next year, use the estimator again to recheck
                  your withholding.
                </p>
                <p>
                  <span className="font-bold">
                    Complete Steps 2–4(b) on Form W-4 for only ONE of these
                    jobs.
                  </span>{" "}
                  Leave those steps blank for the other jobs. (Your withholding
                  will be most accurate if you complete Steps 2–4(b) on the Form
                  W-4 for the highest paying job.){" "}
                  <span className="font-bold">Skip to Step 5.</span> See page 2
                  for more information on each step, who can claim exemption
                  from withholding, and when to use the estimator at{" "}
                  <span className="italic">www.irs.gov/W4App</span>.
                </p>
              </div>

              {/* Step 2 */}
              <div className="border-t-2 border-black">
                <div className="flex">
                  <div className="w-32 border-black p-3">
                    <div className="font-bold text-sm leading-tight">
                      Step 2:
                    </div>
                    <div className="font-bold text-sm leading-tight">
                      Multiple Jobs
                    </div>
                    <div className="font-bold text-sm leading-tight">
                      or Spouse
                    </div>
                    <div className="font-bold text-sm leading-tight">Works</div>
                  </div>
                  <div className="flex-1 p-3 text-sm font-medium leading-relaxed">
                    <p className="mb-2">
                      <span className="font-semibold">
                        Complete this step if you (1) hold more than one job at
                        a time, or (2) are married filing jointly and your
                        spouse also works.
                      </span>{" "}
                      The correct amount of withholding depends on income earned
                      from all of these jobs.
                    </p>
                    <p className="mb-2">
                      <span className="font-semibold">
                        Do only one of the following.
                      </span>
                    </p>
                    <p className="mb-1">
                      <span className="font-semibold">(a)</span> Use the
                      estimator at{" "}
                      <span className="italic">www.irs.gov/W4App</span> for the
                      most accurate withholding for this step (and Steps 3–4).
                      If you or your spouse have self-employment income, use
                      this option; or
                    </p>
                    <p className="mb-1">
                      <span className="font-semibold">(b)</span> Use the
                      Multiple Jobs Worksheet on page 3 and enter the result in
                      Step 4(c) below; or
                    </p>
                    <p className="mb-2">
                      <span className="font-semibold">(c)</span> If there are
                      only two jobs total, you may check this box. Do the same
                      on Form W-4 for the other job. This option is generally
                      more accurate than (b) if pay at the lower paying job is
                      more than half of the pay at the higher paying job.
                      Otherwise, (b) is more accurate . . . . . . . . . . . . .
                      . .
                      <span className="inline-flex items-center ml-2 border border-black w-4 h-4"></span>
                    </p>
                  </div>
                </div>
                <p className="font-medium text-sm italic">
                  Complete Steps 3–4(b) on Form W-4 for only ONE of these jobs.
                  Leave those steps blank for the other jobs. (Your withholding
                  will be most accurate if you complete Steps 3–4(b) on the Form
                  W-4 for the highest paying job.)
                </p>
              </div>

              {/* Step 3 */}
              <div className="border-t-2 border-black">
                <div className="flex">
                  <div className="w-32 p-3">
                    <div className="font-bold text-sm leading-tight">
                      Step 3:
                    </div>
                    <div className="font-bold text-sm leading-tight">Claim</div>
                    <div className="font-bold text-sm leading-tight">
                      Dependent
                    </div>
                    <div className="font-bold text-sm leading-tight">
                      and Other
                    </div>
                    <div className="font-bold text-sm leading-tight">
                      Credits
                    </div>
                  </div>
                  <div className="flex-1 p-3">
                    <p className="text-sm mb-3 leading-relaxed">
                      If your total income will be $200,000 or less ($400,000 or
                      less if married filing jointly):
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <span className="mr-2">
                          Multiply the number of qualifying children under age
                          17 by $2,000
                        </span>
                        <span className="mr-2 font-bold">$</span>
                        <div className="w-32 border-b border-black px-1 font-medium">
                          <p>
                            {employees?.w4Form?.childrenNo} {" / $"}
                            {Number(employees?.w4Form?.childrenNo) * 2000}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="mr-2">
                          Multiply the number of other dependents by $500 . . .
                        </span>
                        <span className="mr-2 font-bold">$</span>
                        <div className="w-32 border-b border-black px-1  font-medium">
                          <p>
                            {employees?.w4Form?.childrenDepencyNo} {" / $"}
                            {Number(employees?.w4Form?.childrenDepencyNo) * 500}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm border-t border-black pt-2">
                        <span className="mr-2 flex-1">
                          Add the amounts above for qualifying children and
                          other dependents. You may add to this the amount of
                          any other credits. Enter the total here . . . . . . .
                          . . .
                        </span>
                        <span className="mr-2 font-bold">3</span>
                        <span className="mr-2 font-bold">$</span>
                        <div className="w-32 border-b-2 border-black px-1  font-medium">
                          <p>{employees?.w4Form?.TotalDependencyAmount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-48 border-l-2 border-black p-3 text-xs leading-tight">
                    <div className="font-semibold mb-1">
                      $0 if no dependents
                    </div>
                    <div>
                      <span className="font-bold">
                        {(Number(employees?.w4Form?.childrenDepencyNo) || 0) *
                          500}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="border-t-2 border-black">
                <div className="flex">
                  <div className="w-32 border-black p-3 ">
                    <div className="font-bold text-sm leading-tight">
                      Step 4
                    </div>
                    <div className="font-bold text-sm leading-tight">
                      (optional):
                    </div>
                    <div className="font-bold text-sm leading-tight">Other</div>
                    <div className="font-bold text-sm leading-tight">
                      Adjustments
                    </div>
                  </div>
                  <div className="flex-1 p-3">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start">
                        <span className="font-semibold mr-2">(a)</span>
                        <div className="flex-1">
                          <p className="mb-2 leading-relaxed">
                            <span className="font-semibold">
                              Other income (not from jobs).
                            </span>{" "}
                            If you want tax withheld for other income you expect
                            this year that won't have withholding, enter the
                            amount of other income here. This may include
                            interest, dividends, and retirement income . . . . .
                            . . .
                          </p>
                          <div className="flex items-center">
                            <span className="mr-2 font-bold">4(a)</span>
                            <span className="mr-2 font-bold">$</span>
                            <div className="w-32 border-b border-black px-1">
                              {employees?.w4Form?.withHoldAmount}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start border-t border-gray-300 pt-3">
                        <span className="font-semibold mr-2">(b)</span>
                        <div className="flex-1">
                          <p className="mb-2 leading-relaxed">
                            <span className="font-semibold">Deductions.</span>{" "}
                            If you expect to claim deductions other than the
                            standard deduction and want to reduce your
                            withholding, use the Deductions Worksheet on page 3
                            and enter the result here . . . . . . . . . . . . .
                            . . . . . . . . . . . . .
                          </p>
                          <div className="flex items-center">
                            <span className="mr-2 font-bold">4(b)</span>
                            <span className="mr-2 font-bold">$</span>
                            <div className="w-32 border-b border-black px-1">
                              {employees?.w4Form?.deductedAmount}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start border-t border-gray-300 pt-3">
                        <span className="font-semibold mr-2">(c)</span>
                        <div className="flex-1">
                          <p className="mb-2 leading-relaxed">
                            <span className="font-semibold">
                              Extra withholding.
                            </span>{" "}
                            Enter any additional tax you want withheld each pay
                            period . . .
                          </p>
                          <div className="flex items-center">
                            <span className="mr-2 font-bold">4(c)</span>
                            <span className="mr-2 font-bold">$</span>
                            <div className="w-32 border-b border-black px-1">
                              {employees?.w4Form?.extraWithHoldingAmount}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="border-t-2 border-black">
                <div className="flex">
                  <div className="w-32  border-black p-3 ">
                    <div className="font-bold text-sm leading-tight">
                      Step 5:
                    </div>
                    <div className="font-bold text-sm leading-tight">Sign</div>
                    <div className="font-bold text-sm leading-tight">Here</div>
                  </div>
                  <div className="flex-1 p-3">
                    <p className="text-xs mb-8 leading-relaxed">
                      Under penalties of perjury, I declare that this
                      certificate, to the best of my knowledge and belief, is
                      true, correct, and complete.
                    </p>
                    <div className="flex gap-4 items-end mb-3">
                      <div className="flex-1">
                        <div className="border-b-2 border-black pb-1 font-medium italic px-1">
                          <span className="flex-1 min-w-[100px] h-10 flex">
                            {employees?.signature ? (
                              <img
                                src={`${VITE_BASE_URL}/image${employees?.signature}`}
                                alt="Employee Signature"
                                className="h-8 w-28 object-contain"
                              />
                            ) : (
                              <span className="text-transparent">_</span>
                            )}
                          </span>
                        </div>
                        <div className="text-sm mt-1">
                          <span className="font-semibold">
                            Employee's signature
                          </span>{" "}
                          (This form is not valid unless you sign it.)
                        </div>
                      </div>
                      <div className="w-40">
                        <div className="border-b-2 border-black pb-1 font-medium px-1">
                          <p>{formatedDate(employees?.createdAt)}</p>
                        </div>
                        <div className="text-sm mt-1 font-semibold">Date</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employers Only */}
              <div className="border-t-2 border-black">
                <div className="flex">
                  <div className="w-32 border-r-2 border-black p-3 ">
                    <div className="font-bold text-sm leading-tight">
                      Employers
                    </div>
                    <div className="font-bold text-sm leading-tight">Only</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex border-b border-black">
                      <div className="flex-1 border-r border-black p-2">
                        <div className="text-sm mb-1">
                          Employer's name and address
                        </div>
                        <p></p>
                      </div>
                      <div className="w-48 border-r border-black p-2">
                        <div className="text-sm mb-1">First date of</div>
                        <div className="text-sm mb-5">employment</div>
                        <p></p>
                      </div>
                      <div className="w-48 p-2">
                        <div className="text-sm mb-1">
                          Employer identification
                        </div>
                        <div className="text-sm mb-1">
                          <p></p>
                        </div>
                        <div className="font-medium mt-2">
                          <p></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-black p-2 text-sm flex justify-between items-center">
                <span>
                  For Privacy Act and Paperwork Reduction Act Notice, see page
                  3.
                </span>
                <span>Cat. No. 10220Q</span>
                <span className="font-bold">Form W-4 (2025)</span>
              </div>
            </div>
          </div>
        </div>

        <style>{`
        @media print {
          .page-break {
            page-break-after: always;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
      </div>
    </div>
  );
};

export default InternPdfViewer;
