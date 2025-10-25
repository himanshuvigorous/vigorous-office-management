import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { getPayrollList } from "./employeePayRollFeatures/_payroll_reducers";
import { domainName, formatNumber } from "../../../../constents/global";
import moment from "moment";
import getUserIds from "../../../../constents/getUserIds";
import { getstandardPayrollList } from "../StandardPayroll/standardPayrollfeature/_standardPayroll_reducers";
import { Tooltip } from "antd";
import { encrypt } from "../../../../config/Encryption";
import { FaEye } from "react-icons/fa";
import Loader2 from "../../../../global_layouts/Loader/Loader2";

function PayrollList() {
  const { userCompanyId, userBranchId, userType, userEmployeId } = getUserIds();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { payrollRequestData, loading } = useSelector((state) => state.payrollReducer);
  const { standardPayrollListData } = useSelector(
    (state) => state.standardPayroll
  );
  const [activeTab, setActivetab] = useState(1)
  const [searchText, setSearchText] = useState("");
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  useEffect(() => {
  if(userInfoglobal?.userType === "employee"){  getPayrollFunc();
    getchstandardPayrollData();}
  }, []);

  const getPayrollFunc = () => {
    const data = {
      currentPage: "",
      pageSize: "",
      reqData: {
        companyId: userCompanyId,
        branchId: userBranchId,
        text: searchText,
        sort: true,
        status: 'Approved',
        isPagination: false,
        directorId: "",
        employeId: userEmployeId,
      },
    };
    dispatch(getPayrollList(data));
  };
  const getchstandardPayrollData = () => {
    let reqData = {
      currentPage: "",
      pageSize: "",
      reqPayload: {
        text: searchText,
        sort: true,
        status: 'Active',
        isPagination: false,
        directorId: "",
        companyId: userCompanyId,
        branchId: userBranchId,
        employeId: userEmployeId,
      },
    };
    dispatch(getstandardPayrollList(reqData));
  };

  const onChange = (e) => {
    setSearchText(e);
  };
    if (userInfoglobal?.userType !== "employee") {
      return (
        <GlobalLayout>
          <div className="bg-red-100 text-red-800 p-4 rounded-md mt-2">
            <p className="text-center font-semibold">
              You are not an employee. This page is viewable for employees only.
            </p>
          </div>
        </GlobalLayout>
      )
    }
  return (
    <GlobalLayout onChange={onChange}>
      <>
        <div className="flex justify-start items-center  my-1">
          <button
            onClick={() => setActivetab(1)}
            className={`${activeTab === 1 ? "bg-header border-header text-white" : "text-black"} px-3 py-2 border  rounded-l-md flex justify-center items-center space-x-2 `}
          >
            <span className="text-[12px]">Standard payroll</span>
          </button>
          <button
            onClick={() => setActivetab(2)}
            className={`${activeTab === 2 ? "bg-header border-header text-white" : "text-black"} px-3 py-2 border  rounded-r-md flex justify-center items-center space-x-2 `}
          >
            <span className="text-[12px]">Actual Payslip</span>
          </button>
        </div>
        {activeTab === 1 && <table className="w-full max-w-full rounded-xl overflow-x-auto">
          <thead>
            <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
              <th className="border-none p-2 whitespace-nowrap w-[5%]">
                S.No.
              </th>
              <th className="border-none p-2 whitespace-nowrap">Name</th>

              <th className="border-none p-2 whitespace-nowrap">
                Created By
              </th>
              <th className="border-none p-2 whitespace-nowrap">
                Base Salary
              </th>
              <th className="border-none p-2 whitespace-nowrap">
                CTC
              </th>
              <th className="border-none p-2 whitespace-nowrap">
                Status
              </th>

            </tr>
          </thead>
          {loading ? <tr className="bg-white bg-opacity-5 ">
            <td
              colSpan={10}
              className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
            >
              <Loader2 />
            </td>
          </tr> :
            <tbody>
              {standardPayrollListData && standardPayrollListData.length > 0 ? (
                standardPayrollListData.map((element, index) => (
                  <tr
                    className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                      } border-[#DDDDDD] text-[#374151] text-[14px]`}
                  >
                    <td className="whitespace-nowrap border-none p-2">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap border-none p-2">
                      {element.employeName}
                    </td>

                    <td className="whitespace-nowrap border-none p-2">
                      {element.createdBy}
                    </td>
                    <td className="whitespace-nowrap border-none p-2">
                      {element.baseSalary}
                    </td>
                    <td className="whitespace-nowrap border-none p-2">
                      {element.ctc}
                    </td>

                    <td className="whitespace-nowrap border-none p-2">

                      {element?.status}


                    </td>

                  </tr>
                ))
              ) : (
                <tr className="bg-white bg-opacity-5">
                  <td
                    colSpan={15}
                    className="px-6 py-2 whitespace-nowrap font-[600] text-center text-sm text-gray-500"
                  >
                    Record Not Found
                  </td>
                </tr>
              )}
            </tbody>}
        </table>}
        {activeTab === 2 && <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">

          <table className="w-full max-w-full rounded-xl overflow-x-auto ">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[12px] text-[#ffff] font-[500] h-[40px]">
                <th className="p-2 whitespace-nowrap w-[10%]">S.No.</th>
                <th className="p-2 whitespace-nowrap w-[10%]">Employee Name</th>
                <th className="p-2 whitespace-nowrap">Start date</th>
                <th className="p-2 whitespace-nowrap">End date</th>
                <th className="p-2 whitespace-nowrap">Basic Salary</th>
                <th className="p-2 whitespace-nowrap">Gross Salary</th>
                <th className="p-2 whitespace-nowrap">Net Salary</th>
                <th className="p-2 whitespace-nowrap">Status</th>
                <th className="p-2 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            {loading ? <tr className="bg-white bg-opacity-5 ">
              <td
                colSpan={10}
                className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
              >
                <Loader2 />
              </td>
            </tr> :
              <tbody>
                {payrollRequestData && payrollRequestData.length > 0 ? (
                  payrollRequestData.map((element, index) => (
                    <tr
                      key={element?._id}
                      className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } text-[14px] border-b-[1px] border-[#DDDDDD]`}
                    >
                      <td className="whitespace-nowrap p-2">{index + 1}</td>
                      <td className="whitespace-nowrap p-2">
                        {element?.employeName}
                      </td>
                      <td className="whitespace-nowrap p-2">
                        {moment(element?.startDate).format("DD-MM-YYYY")}
                      </td>
                      <td className="whitespace-nowrap p-2">
                        {moment(element?.endDate).format("DD-MM-YYYY")}
                      </td>
                      <td className="whitespace-nowrap p-2">
                        {formatNumber(element?.basicSalary).toFixed(2)} ₹
                      </td>
                      <td className="whitespace-nowrap p-2">
                        {formatNumber(element?.grossSalary).toFixed(2)} ₹
                      </td>
                      <td className="whitespace-nowrap p-2">
                        {formatNumber(element?.netSalary).toFixed(2)} ₹
                      </td>
                      <td className="whitespace-nowrap border-none p-2">
                        {element?.status}
                      </td>
                      <td>
                        <Tooltip placement="topLeft" title="View">
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/employee-paySlipData/${encrypt(element?._id)}`
                              )
                            }
                            className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                            type="button"
                          >
                            <FaEye
                              className={` ${"text-sky-600 hover:text-sky-500"}`}
                              size={16}
                            />
                          </button>
                        </Tooltip>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={12}
                      className="px-6 py-2 whitespace-nowrap font-[600] text-center text-sm text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>}
          </table>
        </div>}
      </>
    </GlobalLayout>
  );
}
export default PayrollList;
