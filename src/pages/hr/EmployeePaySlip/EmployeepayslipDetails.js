import React from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";

const Payslip = () => {
  const employeeData = {
    employeeName: "John Doe",
    employeeId: "E12345",
    basicSalary: 50000,
    allowances: [
      { title: "Housing Allowance", amount: 5000 },
      { title: "Transport Allowance", amount: 3000 },
    ],
    deductions: [
      { title: "Tax Deduction", amount: 2000 },
      { title: "Insurance", amount: 1000 },
    ],
    payPeriod: "From: 2024-11-01 To: 2024-11-30",
    paymentDate: "2024-12-05",
    netPay: 56000,
  };
  const {
    employeeName,
    employeeId,
    basicSalary,
    allowances,
    deductions,
    payPeriod,
    paymentDate,
    netPay,
  } = employeeData;

  // Calculate total earnings and deductions
  const totalEarnings =
    basicSalary +
    allowances.reduce((sum, allowance) => sum + allowance.amount, 0);
  const totalDeductions = deductions.reduce(
    (sum, deduction) => sum + deduction.amount,
    0
  );

  return (
    <GlobalLayout>
      <div className=" mx-auto p-6 border border-gray-300 rounded-lg shadow-lg">
        <div className="flex justify-between mb-6 border-b">
          <div>
            <img
              src="/images/Logo/ca-logo.png"
              alt="Company Logo"
              className=" w-36 h-12"
            />
            <h2 className="text-2xl font-bold mt-4">Singhal Jain & Co.</h2>
            <p className="text-sm text-gray-600">
              Company Address | Contact Details
            </p>
          </div>

          <div className="text-xl font-semibold text-gray-700">
            PAYSLIP #MZ-00114{" "}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Employee Details</h3>
          <p>
            <strong>Employee Name:</strong> {employeeName}
          </p>
          <p>
            <strong>Employee ID:</strong> {employeeId}
          </p>
          <p>
            <strong>Pay Period:</strong> {payPeriod}
          </p>
          <p>
            <strong>Payment Date:</strong> {paymentDate}
          </p>
        </div>

        {/* Earnings Table */}
        <div className="mb-6">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-header text-white">
                <th className="border-b px-4 py-2 text-left">Earnings</th>
                <th className="border-b px-4 py-2 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b px-4 py-2">Basic Salary</td>
                <td className="border-b px-4 py-2 text-right">{basicSalary}</td>
              </tr>
              {allowances.map((allowance, index) => (
                <tr key={index}>
                  <td className="border-b px-4 py-2">{allowance.title}</td>
                  <td className="border-b px-4 py-2 text-right">
                    {allowance.amount}
                  </td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td className="border-b px-4 py-2">Total Earnings</td>
                <td className="border-b px-4 py-2 text-right">
                  {totalEarnings}
                </td>
              </tr>
            </tbody>
          </table>

          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-header text-white">
                <th className="border-b px-4 py-2 text-left">Deductions</th>
                <th className="border-b px-4 py-2 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              {deductions.map((deduction, index) => (
                <tr key={index}>
                  <td className="border-b px-4 py-2">{deduction.title}</td>
                  <td className="border-b px-4 py-2 text-right">
                    {deduction.amount}
                  </td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td className="border-b px-4 py-2">Total Deductions</td>
                <td className="border-b px-4 py-2 text-right">
                  {totalDeductions}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Net Pay */}
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Net Pay</h3>
          <p className="text-xl font-bold text-green-600">{netPay}</p>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Thank you for your hard work! For any questions, please contact HR.
          </p>
          <p>Company Contact: [Phone Number] | [Email Address] | [Website]</p>
        </div>
      </div>
    </GlobalLayout>
  );
};

export default Payslip;
