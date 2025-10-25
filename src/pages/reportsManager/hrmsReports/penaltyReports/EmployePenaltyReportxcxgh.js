import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  convertMinutesToHoursAndMinutes,
  domainName,
  inputAntdSelectClassName,
  inputAntdSelectClassNameFilter,
} from "../../../../constents/global";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { Select, Tooltip } from "antd";
import { FaPlus } from "react-icons/fa6";
import moment from "moment";
import dayjs from "dayjs";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { employePenaltyReportFunc } from "../../../../redux/_reducers/_reports_reducers";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import { getpenaltyList, penaltyTypeSearch } from "../../../global/other/interviewRoundName copy/penaltyFeatures/_penalty_reducers";
import * as ExcelJS from 'exceljs';
import jsPDF from "jspdf";
import Loader2 from "../../../../global_layouts/Loader/Loader2";



function EmployePenaltyReport() {
  const {
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { employePenaltyReportList, totalpenaltyReportCount } = useSelector(
    (state) => state.reports
  );
  const { employeList } = useSelector((state) => state.employe);
  const [searchText, setSearchText] = useState("");
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedFilterText, setDebouncedFilterText] = useState("");
  const pageSize = 10;
  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector((state) => state.branch);
  const { penaltyListData, totapenaltyTypeCount, loading } = useSelector((state) => state.penalty);

  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const BranchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: "",
  });
  const Status = useWatch({
    control,
    name: "status",
    defaultValue: "",
  });

  const workType = useWatch({
    control,
    name: "workType",
    defaultValue: "",
  });
  const penalty = useWatch({
    control,
    name: "penalty",
    defaultValue: "",
  });
  // const daterange = useWatch({
  //   control,
  //   name: "daterange",
  //   defaultValue: "",
  // });
  const employeeId = useWatch({
    control,
    name: "employeeId",
    defaultValue: "",
  });
  const startDate = useWatch({
    control,
    name: "startDate",
    defaultValue: "",
  });
  const endDate = useWatch({
    control,
    name: "endDate",
  });

  const dateRange = useWatch({
    control,
    name: "dateRange",
  });

  useEffect(() => {
    getpenalty();
  }, [currentPage, BranchId, CompanyId,]);

  const getpenalty = () => {
    const data = {
      
      reqData: {
        directorId: "",
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            :
            userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? BranchId : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        "text": searchText,
        "sort": true,
        "status": '',
        "isPagination": false,
      }
    };
    dispatch(penaltyTypeSearch(data));
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilterText(searchText);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);
  useEffect(() => {
    if (CompanyId) {
      setValue("PDBranchId", "");
    }
  }, [CompanyId]);

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchpenaltyListData(debouncedFilterText);
  }, [
    currentPage,
    debouncedFilterText,
    CompanyId,
    BranchId,
    searchText,
    Status,
    workType,
    penalty,

    employeeId,
    startDate,
    dateRange
  ]);

  const fetchpenaltyListData = (debouncedFilterText) => {
    let reqData = {
      currentPage: currentPage,
      pageSize: pageSize,
      reqPayload: {
        // "text": "",
        // "sort": true,
        // "isPagination": true,
        // "companyId": "67b30413551ce7595c5c2c96",
        // "directorId": "67b30b81551ce7595c5c2d88",
        // "branchId": "67b30d4c551ce7595c5c2db9",
        // "employeId": "67b342b5e015dc3f3fda234d",
        // "leaveTypeId": "67b486a2e051e6f4a7c0448a",
        // "startDate": "",
        // "endDate": "",
        // "type": "Multiple",
        // "status": "",
        // "startDateBreakDown": "secondHalf",
        // "endDateBreakDown": "fullDay"

        text: debouncedFilterText,
        status: Status,
        sort: true,
        isPagination: true,
        employeId: employeeId,

        workType: workType,
        // startDate: startDate
        //   ? dayjs(startDate).format("DD-MM-YYYY")
        //   : dayjs().subtract(1, "month").format("DD-MM-YYYY"),
        // endDate: endDate
        //   ? dayjs(endDate).format("DD-MM-YYYY")
        //   : dayjs().format("DD-MM-YYYY"),
        // dateRange: daterange,
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "admin" ||
            userInfoglobal?.userType === "companyDirector"
            ? BranchId
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,

        "penaltyId": penalty,
        "issueDate": startDate ? dayjs(startDate).format("DD-MM-YYYY") : '',
        "dateRange": dateRange,


      },
    };
    dispatch(employePenaltyReportFunc(reqData));
  };

  useEffect(() => {
    if (
      CompanyId ||
      userInfoglobal?.userType === "company" ||
      userInfoglobal?.userType === "companyDirector"
    ) {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId:
            userInfoglobal?.userType === "admin"
              ? CompanyId
              : userInfoglobal?.userType === "company"
                ? userInfoglobal?._id
                : userInfoglobal?.companyId,
        })
      );
    }
  }, [CompanyId]);
  useEffect(() => {
    if (userInfoglobal?.userType === "admin") {
      dispatch(
        companySearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
    }
  }, []);

  const onChange = (e) => {
    ;
    setSearchText(e);
  };




  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('API Data');
    const apiData = employePenaltyReportList?.map((element) => {
      return {
        name: element.employeData?.fullName,
        penaltyName: element?.penaltyName,
        issueDate: dayjs(element?.issueDate).format("DD-MM-YYYY"),
        reason: element?.reason || "-",
        status: element?.status
      }
    })


    worksheet.columns = [
      { header: 'Employee Name', key: 'name', width: 50 },
      { header: '	Penalty Name', key: 'penaltyName', width: 30 },
      { header: '	Issue Date', key: 'issueDate', width: 50 },
      { header: 'Reason', key: 'reason', width: 50 },
      { header: 'status', key: 'status', width: 50 },
    ];

        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFB6D7A8' }, // Light green
            };
            cell.font = { bold: true };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

         worksheet.autoFilter = {
            from: 'A1',
            to: 'I1',
        };



    apiData.forEach(item => {
      worksheet.addRow(item);
    });


    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'api_data.xlsx';
      link.click();
    });
  };

  return (
    <GlobalLayout onChange={onChange}>
      <div className="bg-grey-100 w-full p-1">
        <div className="">
          <div className="grid grid-cols-1 justify-between items-center gap-1 space-y-1.5">
            <div className="grid 2xl:grid-cols-6 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 grid-cols-1 gap-2 flex-wrap text-[14px] rounded-md">
              {userInfoglobal?.userType === "admin" && (
                <div className="">
                  <Controller
                    name="PDCompanyId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className={` ${inputAntdSelectClassNameFilter} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"
                          }`}
                        placeholder="Select Company"
                        showSearch
                      >
                        <Select.Option value="">Select Company</Select.Option>
                        {companyList?.map((element) => (
                          <Select.Option value={element?._id}>
                            {" "}
                            {element?.fullName}{" "}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.PDCompanyId && (
                    <p className="text-red-500 text-sm">
                      {errors.PDCompanyId.message}
                    </p>
                  )}
                </div>
              )}
              {(userInfoglobal?.userType === "admin" ||
                userInfoglobal?.userType === "company" ||
                userInfoglobal?.userType === "companyDirector") && (
                  <div className="">
                    <Controller
                      name="PDBranchId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={` ${inputAntdSelectClassNameFilter} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"
                            }`}
                          placeholder="Select Branch"
                           showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                        >
                          <Select.Option value="">Select Branch</Select.Option>
                          {branchList?.map((element) => (
                            <Select.Option value={element?._id}>
                              {" "}
                              {element?.fullName}{" "}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.PDBranchId && (
                      <p className="text-red-500 text-sm">
                        {errors.PDBranchId.message}
                      </p>
                    )}
                  </div>
                )}
              <div className="">
                <Controller
                  name="employeeId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={` ${inputAntdSelectClassNameFilter} ${errors.employeeId ? "border-[1px] " : "border-gray-300"
                        }`}
                      onFocus={() => {
                        const reqPayload = {
                          text: "",
                          status: true,
                          sort: true,
                          isTL: "",
                          isHR: "",
                          isPagination: false,
                          departmentId: "",
                          designationId: "",
                          companyId:
                            userInfoglobal?.userType === "admin"
                              ? CompanyId
                              : userInfoglobal?.userType === "company"
                                ? userInfoglobal?._id
                                : userInfoglobal?.companyId,
                          branchId:
                            userInfoglobal?.userType === "company" ||
                              userInfoglobal?.userType === "admin" ||
                              userInfoglobal?.userType === "companyDirector"
                              ? BranchId
                              : userInfoglobal?.userType === "companyBranch"
                                ? userInfoglobal?._id
                                : userInfoglobal?.branchId,
                        };

                        dispatch(employeSearch(reqPayload));
                      }}
                      placeholder="Select Employee"
                       showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                    >
                      <Select.Option value="">Select Employee</Select.Option>
                      {employeList?.map((element) => (
                        <Select.Option value={element?._id}>
                          {" "}
                          {element?.fullName}{" "}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
                {errors.employeeId && (
                  <p className="text-red-500 text-sm">
                    {errors.employeeId.message}
                  </p>
                )}
              </div>
              <div>
                <Controller
                  name="dateRange"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={` w-32 ${inputAntdSelectClassNameFilter} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Select Date range"
                       showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                    >
                      <Select.Option value="">Select dateRange</Select.Option>

                      <Select.Option value="thisWeek"> This Week </Select.Option>
                      <Select.Option value="lastWeek">
                        {" "}
                        Last Week{" "}
                      </Select.Option>
                      <Select.Option value="lastMonth"> Last Month </Select.Option>
                      <Select.Option value="last3Months"> last 3 Months </Select.Option>
                      <Select.Option value="last6Months"> last 6 Months </Select.Option>
                      <Select.Option value="lastYear">
                        {" "}
                        Last Year {" "}
                      </Select.Option>


                    </Select>
                  )}
                />
              </div>
              <div>
                <Controller
                  name="status"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={` w-32 ${inputAntdSelectClassNameFilter} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Select Status"
                      showSearch
                    >
                      <Select.Option value="">Select Status</Select.Option>

                      <Select.Option value="Pending"> Pending </Select.Option>
                      <Select.Option value="Resolved">
                        {" "}
                        Resolved{" "}
                      </Select.Option>

                    </Select>
                  )}
                />
              </div>
              <div>
                <Controller
                  name="penalty"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`${inputAntdSelectClassNameFilter} ${errors.penalty ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Select Penalty"
                    >
                      <Select.Option value="">Select Penalty</Select.Option>
                      {penaltyListData?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
              </div>
              <div className="-mt-1">
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <CustomDatePicker
                      defaultValue={""}
                      size={"middle"}
                      field={field}
                      errors={errors}
                    />
                  )}
                />
              </div>
            </div>
            {/* <div>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <CustomDatePicker
                      defaultValue={dayjs()}
                      size={"middle"}
                      field={field}
                      errors={errors}
                    />
                  )}
                />
              </div> */}
            <div className="flex justify-end items-center gap-2">
              <button
                onClick={() => {
                  setValue("PDBranchId", "");
                  setValue("PdCompanyId", "");
                  setValue("status", "");
                  setValue("employeeId", "");

                  setValue("shift", "");
                  setValue("penalty", "");

                  setValue("startDate", '');
                  setValue("dateRange", '');

                }}
                className="bg-header  py-2 my-0.5 rounded-md flex px-10 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Reset</span>
              </button>
              <button
                onClick={() => {
                  generateExcel();
                }}
                className="bg-header  py-2 my-0.5 rounded-md flex px-10 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Export</span>
              </button>
            </div>
          </div>
        </div>
        <div className="bg-[#ffffff]  w-full overflow-x-auto mt-1 rounded-xl">
          <table className="w-full max-w-full rounded-xl overflow-x-auto">
            <thead>
              <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                <th className="border-none p-2 whitespace-nowrap text-center w-[5%]">
                  S.No.
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center w-[10%]">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Profile</span>
                  </div>
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Employee Name
                </th>

                <th className="border-none p-2 whitespace-nowrap text-center">
                  Penalty Name
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Issue Date
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Amount
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Reason
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  createdAt
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  createdBy
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  <div className="flex gap-1">Status</div>
                </th>



              </tr>
            </thead>

            {loading ? <tr className="bg-white bg-opacity-5 ">
              <td
                colSpan={10}
                className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
              >
                <Loader2 />
              </td>
            </tr> :
              <tbody>
                {employePenaltyReportList &&
                  employePenaltyReportList?.length > 0 ? (
                  employePenaltyReportList?.map((element, index) => (
                    <tr
                      className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-[#DDDDDD] text-[#374151] text-[14px]`}
                    >
                      
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {index + 1 + ((currentPage - 1) * pageSize)}
                      </td>

                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element.profileImage ? (
                          <img
                            alt=""
                            src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${element.profileImage}`}
                            className="rounded-full min-w-10 min-h-10 w-10 h-10 ring-1 ring-amber-300"
                          />
                        ) : (
                          <img
                            alt=""
                            src={`/images/avatar.jpg`}
                            className="rounded-full min-w-10 min-h-10 w-10 h-10 ring-1 ring-amber-300"
                          />
                        )}
                      </td>

                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element.employeData?.fullName}
                      </td>

                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.penaltyName || "-"}
                      </td>

                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.issueDate
                          ? dayjs(element.issueDate).format("DD-MM-YYYY hh:mm a")
                          : "-"}
                      </td>

                      <td className="whitespace-nowrap text-center  border-none p-2">
                        {element?.amount || "-"}
                      </td>

                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.reason}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') || '-'}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.createdBy}
                      </td>

                      <td className="whitespace-nowrap text-center border-none p-2">
                        <span
                          className={`${element?.status === 'Resolved'
                            ? "bg-[#E0FFBE] border-green-500"
                            : "bg-red-200 border-red-500"
                            } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                        >
                          {element?.status === 'Resolved' ? "Resolved" : "Pending" ?? "-"}
                        </span>
                      </td>




                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={15}
                      className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>}
          </table>
        </div>
        <CustomPagination
          totalCount={totalpenaltyReportCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
    </GlobalLayout>
  );
}

export default EmployePenaltyReport;
