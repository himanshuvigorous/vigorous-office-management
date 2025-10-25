import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaEye } from "react-icons/fa";
import "react-vertical-timeline-component/style.min.css";
import { Select } from "antd";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { getEmployeList } from "../../employeManagement/employeFeatures/_employe_reducers";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import getUserIds from "../../../constents/getUserIds";
import { inputAntdSelectClassNameFilter } from "../../../constents/global";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import { decrypt, encrypt } from "../../../config/Encryption";
import ListLoader from "../../../global_layouts/ListLoader";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import { getCashbookEmployeeList } from "./cashbookFeature/_cashbook_reducers";
import { cashbookServices } from "./cashbookFeature/_cashbook_services";
import * as ExcelJS from "exceljs";

function EmployeeListViewCashbook() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userCompanyId, userType } = getUserIds();

  const {
    getCashbookEmployeeListData,
    totalCashbookEmployeeListCount,
    getCashbookEmployeeListLoading,
    getCashbookEmployeeSummry,
  } = useSelector((state) => state.cashbook);

  const { sidebarListData } = useSelector((state) => state.dynamicSidebar);
  const { branchList, branchListloading } = useSelector((state) => state.branch);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialLimit = 10;
  const initialBranchId = searchParams.get("branchId") || "";

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [searchText, setSearchText] = useState("");
  const [branchId, setBranchId] = useState(initialBranchId);

  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage);
    if (branchId) params.set("branchId", branchId);
    setSearchParams(params);
  }, [currentPage, limit, branchId, searchText]);

  useEffect(() => {
    fetchEmployeListData();
  }, [currentPage, limit, branchId, searchText]);

  const onChange = (e) => {
    setSearchText(e);
  };

  const onPaginationChange = (page) => setCurrentPage(page);

  const handleBranchChange = (value) => {
    setBranchId(value);
    setCurrentPage(1);
  };

  const fetchEmployeListData = () => {
    const reqData = {
      currentPage,
      pageSize: limit,
      reqData: {
        text: searchText,
        status: true,
        isHR: "",
        isTL: "",
        sort: false,
        isPagination: true,
        departmentId: "",
        designationId: "",
        companyId: userCompanyId,
        branchId: branchId,
      },
    };
    dispatch(getCashbookEmployeeList(reqData));
  };

  useEffect(() => {
    if (userType === "company" || userType === "companyDirector") {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: userCompanyId,
        })
      );
    }
  }, []);

    const generateExcel = async () => {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Employee Attendance");
  
      worksheet.columns = [
        { header: "S.No", key: "sno", width: 10 },
        { header: "Employee Name", key: "name", width: 30 },
        { header: "Employee Code", key: "code", width: 30 },
        { header: "Closing Balance", key: "balance", width: 30 },
        
       
      ];
  
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFB6D7A8" },
        };
        cell.font = { bold: true };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
      const reqData = {
        currentPage,
        pageSize: '',
        reqData: {
          text: '',
          status: true,
          isHR: "",
          isTL: "",
          sort: false,
          isPagination: false,
          departmentId: "",
          designationId: "",
          companyId: userCompanyId,
          branchId: branchId,
        },
      };
  
      const response = await cashbookServices?.getCashbookEmployeeList(reqData);
      if (!response) return;
      const apiData = response?.data?.result?.docs?.map((data, index) => {
        return {
          sno: index + 1,
          name: data?.fullName || "-",
          code: data?.userName || "-",
          balance: data?.summary?.closingBalance || "-",
         
        };
      });
  
  
      // Data row styling
      apiData?.forEach((item) => {
        const row = worksheet.addRow(item);
        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "left" };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });
  
      // Add auto-filter
      worksheet.autoFilter = {
        from: "A1",
        to: "I1",
      };
  
      // Export
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Employee_Attendance_Report.xlsx";
        link.click();
      });
    };

  return (
    <GlobalLayout onChange={onChange}>
      <div className="flex justify-start items-center my-1">
        <button
          onClick={() => {
            navigate(
              `/admin/cashbook/${encrypt(
                sidebarListData?.find((data) => data?.slug === "cashbook")?._id
              )}`
            );
          }}
          className="text-black px-3 py-2 border rounded-l-md flex justify-center items-center space-x-2"
        >
          <span className="text-[12px]">Approval View</span>
        </button>
        <button className="bg-header border-header text-white px-3 py-2 border rounded-l-md flex justify-center items-center space-x-2">
          <span className="text-[12px]">Employee View</span>
        </button>
      </div>

      <div className="bg-grey-100 w-full p-1">
        {/* Filters */}
        <div className="w-full">
          <div className="sm:flex justify-between items-center md:space-y-0 space-y-2 py-1">
            <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-3 sm:gap-3 gap-1">
              {(userType === "admin" ||
                userType === "company" ||
                userType === "companyDirector") && (
                <div className="relative md:flex justify-center items-center space-x-2 text-[14px] rounded-md">
                  <Select
                    value={branchId}
                    onChange={handleBranchChange}
                    defaultValue=""
                    disabled={getCashbookEmployeeListLoading}
                    className={`${inputAntdSelectClassNameFilter}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Branch</Select.Option>
                    {branchListloading ? (
                      <Select.Option disabled>
                        <ListLoader />
                      </Select.Option>
                    ) : (
                      branchList?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.fullName}
                        </Select.Option>
                      ))
                    )}
                  </Select>
                </div>
              )}
            </div>

            <div className="flex justify-end items-center">
              <button
                onClick={() => setBranchId("")}
                className="bg-header py-[6px] rounded-md flex px-5 justify-center items-center text-white"
              >
                <span className="text-[12px]">Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Total Amount UI */}
        <div className="flex justify-between items-center mt-2 mb-1">
          <div className="bg-white shadow-sm px-4 py-2 rounded-md border ">
            <span className="text-[14px] font-semibold ">
              Total Amount:&nbsp;
              {getCashbookEmployeeSummry != null
                ? Number(getCashbookEmployeeSummry).toFixed(2)
                : "0.00"}
            </span>
          </div>
          <button
                onClick={() => {
                  generateExcel();
                }}
                className="bg-header  py-2 my-0.5 rounded-md flex px-10 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Export Excel</span>
              </button>
        </div>

        {/* Table */}
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          <table className="w-full max-w-full rounded-xl overflow-x-auto">
            <thead>
              <tr className="border-b-[1px] border-[#DDDDDD] capitalize bg-header text-white font-[500] h-[40px]">
                <th className="tableHead w-[5%]">S.No.</th>
                <th className="tableHead w-[10%]">Employe Name</th>
                <th className="tableHead w-[10%]">Employe Code</th>
                <th className="tableHead w-[10%]">Closing Balance</th>
                <th className="tableHead w-[5%]">Action</th>
              </tr>
            </thead>

            {getCashbookEmployeeListLoading ? (
              <tr className="bg-white bg-opacity-5">
                <td
                  colSpan={10}
                  className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
                >
                  <Loader2 />
                </td>
              </tr>
            ) : (
              <tbody>
                {getCashbookEmployeeListData &&
                getCashbookEmployeeListData?.length > 0 ? (
                  getCashbookEmployeeListData?.map((element, index) => (
                    <tr
                      key={element?._id}
                      className={`border-b-[1px] ${
                        index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                      } border-[#DDDDDD] text-[#374151]`}
                    >
                      <td className="tableData">
                        {index + 1 + (currentPage - 1) * limit}
                      </td>
                      <td className="tableData">{element?.fullName || "-"}</td>
                      <td className="tableData">{element?.userName || "-"}</td>
                      <td className="tableData">
                        {element?.summary?.closingBalance != null
                          ? Number(element?.summary?.closingBalance).toFixed(2)
                          : "0.00"}
                      </td>
                      <td className="tableData">
                        <button
                          onClick={() => {
                            navigate(
                              `/admin/cashbook/employee/${encrypt(
                                element?.companyId
                              )}/${encrypt(element?.branchId)}/${encrypt(
                                element?._id
                              )}`
                            );
                          }}
                          className="px-2 py-2 text-xs rounded-md bg-transparent text-header border border-muted"
                          type="button"
                        >
                          <FaEye className="hover:text-[#337ab7] text-[#3c8dbc]" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={9}
                      className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>

        {getCashbookEmployeeListData?.length > 0 && (
          <CustomPagination
            totalCount={totalCashbookEmployeeListCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        )}
      </div>
    </GlobalLayout>
  );
}

export default EmployeeListViewCashbook;
