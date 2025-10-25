import { useNavigate } from "react-router-dom";
import { FaPenToSquare, FaPlus } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import { employeepayslipData } from "./employeepayslipData";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
function EmployeePayslipList() {

  const navigate = useNavigate();
  return (
    <GlobalLayout>
    
        <>
          <div className="w-full">
       
            <div className="sm:flex justify-end items-center md:space-y-0 space-y-2 py-1">
             
              <button
                onClick={() => {
                  navigate("/admin/payslip/create");
                }}
                className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
              >
                <FaPlus />
                <span className="text-[12px]">Add payslip</span>
              </button>
            </div>
          </div>
          <div className="bg-[#ffffff] text-[13px] text-[#676a6c] w-full overflow-x-auto mt-1">
          <table className="w-full max-w-full rounded-xl overflow-hidden">
  <thead>
    <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
      <th className="border-none p-2 whitespace-nowrap w-[10%]">S.no.</th>
      <th className="border-none p-2 whitespace-nowrap">Employee Name</th>
      <th className="border-none p-2 whitespace-nowrap">Basic Salary</th>
      <th className="border-none p-2 whitespace-nowrap">Net Pay</th>
      <th className="border-none p-2 whitespace-nowrap w-[10%]">Actions</th>
    </tr>
  </thead>
  <tbody>
    {employeepayslipData && employeepayslipData.length > 0 ? (
      employeepayslipData.map((element, index) => (
        <tr
          className={`border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"}`}
        >
          <td className="whitespace-nowrap border-none p-2">{index + 1}</td>
          <td className="whitespace-nowrap border-none p-2">{element.employeeName}</td>
          <td className="whitespace-nowrap border-none p-2">₹{element.basicSalary}</td>
          <td className="whitespace-nowrap border-none p-2">₹{element.netPay}</td>
          <td className="whitespace-nowrap border-none p-2">
            <span className="py-1.5 flex justify-start items-center space-x-2">
              <button
                onClick={() => {
                  navigate(`/admin/payslip/detail`)
                }}
                className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                type="button"
              >
                <FaPenToSquare
                  className="hover:text-[#337ab7] text-[#3c8dbc]"
                  size={16}
                />
              </button>
              <button
               
                className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                type="button"
              >
                <RiDeleteBin5Line
                  className="text-red-600 hover:text-red-500"
                  size={16}
                />
              </button>
            </span>
          </td>
        </tr>
      ))
    ) : (
      <tr className="bg-white bg-opacity-5">
        <td
          colSpan={5}
          className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
        >
          Record Not Found
        </td>
      </tr>
    )}
  </tbody>
</table>

          </div>
        </>
      
    </GlobalLayout>
  );
}

export default EmployeePayslipList;
