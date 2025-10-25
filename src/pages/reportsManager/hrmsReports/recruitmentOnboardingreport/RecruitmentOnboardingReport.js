import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { convertMinutesToHoursAndMinutes, domainName, pazeSizeReport, sortByPropertyAlphabetically } from "../../../../constents/global";
import { useEffect, useState } from "react";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { Collapse, Select, Tooltip } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { recruitmentOnboardingReportFunc } from "../../../../redux/_reducers/_reports_reducers";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import * as ExcelJS from "exceljs";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import { reportsServices } from "../../../../redux/_services/_reports_services";
import { timeSlotSearch } from "../../../timeSlot/timeSlotsFeatures/_timeSlots_reducers";
import { MdKeyboardArrowDown } from "react-icons/md";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import ListLoader from "../../../../global_layouts/ListLoader";


function RecruitmentOnboardingReport() {
  const { control, formState: { errors }, setValue } = useForm();
  const dispatch = useDispatch();
  const { recruitmentOnboardingReportList, recruitmentOnboardingReportFunc_loading, totalRecruitmentOnboardingReportCount, } = useSelector((state) => state.reports);
  const { employeList } = useSelector((state) => state.employe);
  const [searchText, setSearchText] = useState("");
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const { timeSlotsListData } = useSelector((state) => state.timeSlots);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedFilterText, setDebouncedFilterText] = useState("");
  const { branchList } = useSelector((state) => state.branch);
  const { departmentListData, loading: depLoading } = useSelector((state) => state.department);
  const CompanyId = useWatch({ control, name: "PDCompanyId", defaultValue: "", });
  const BranchId = useWatch({ control, name: "PDBranchId", defaultValue: "", });
  const designationId = useWatch({ control, name: "PdDesignationId", defaultValue: "", });
  const status = useWatch({ control, name: "status", defaultValue: "", });
  const departmentId = useWatch({ control, name: "departmentId", });
  const startDate = useWatch({ control, name: "startDate", defaultValue: dayjs().subtract(1, "month"), });
  const endDate = useWatch({ control, name: "endDate", defaultValue: dayjs(), });
  const [pageSize, setPageSize] = useState(10);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e));
    setCurrentPage(Number(1))
  };
  useEffect(() => {
    if (
      userInfoglobal?.userType === "company" ||
      userInfoglobal?.userType === "companyDirector"
    ) {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: userInfoglobal?.userType === "admin"
            ? CompanyId
            : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        })
      );
    }
    dispatch(
      deptSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      })
    )
    setValue('startDate', dayjs().subtract(1, "month"));
    setValue('endDate', dayjs());
  }, []);

  useEffect(() => {
    fetchRecruitmentOnboardingListData();
  }, [
    currentPage,
    debouncedFilterText,

    pageSize
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilterText(searchText);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

  const requestPayLoadReturn = (pagination = true) => {
    return {
      currentPage: currentPage,
      pageSize: pageSize,
      reqPayload: {
        "jobpostId": "",
        "offerLatterStatus": "",
        text: debouncedFilterText,
        sort: true,
        isPagination: pagination,
        // startDate: startDate
        //   ? dayjs(startDate).format("YYYY-MM-DD")
        //   : '',
        // endDate: endDate
        //   ? dayjs(endDate).format("YYYY-MM-DD")
        //   : '',
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
        "status": status,
        departmentId: departmentId,
        "departmentIds": [],
        designationId: designationId,
        "designationIds": [],
      },
    };
  }

  const handleEmployeeFocus = () => {
    dispatch(
      employeSearch({
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          ["admin", "company", "companyDirector"].includes(userInfoglobal?.userType)
            ? BranchId
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        departmentId: departmentId ? departmentId : '',
        directorId: "",
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        isBranch: true,
        isDirector: false,
      })
    )
  };

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const fetchRecruitmentOnboardingListData = () => {
    dispatch(recruitmentOnboardingReportFunc(requestPayLoadReturn(true)));
  };

  const onChange = (e) => {
    setSearchText(e);
  }

  const handleSubmit = async () => {
    fetchRecruitmentOnboardingListData()
  }

  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Employee Attendance");

    worksheet.columns = [
      { header: "S.No", key: "sno", width: 6 },
      { header: "Employee Name", key: "fullName", width: 20 },
      { header: "Designation", key: "designation", width: 20 },
      { header: "Department", key: "department", width: 20 },
      { header: "Application Date", key: "applicationDate", width: 22 },
      { header: "Application Status", key: "applicationStatus", width: 22 },
      { header: "Interview Status", key: "interviewStatus", width: 20 },
      { header: "Taken By", key: "takenBy", width: 20 },
      { header: "OnBoarding Date", key: "onboardingDate", width: 20 },
      { header: "OnBoarding Status", key: "onboardingStatus", width: 20 },
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

    const response = await reportsServices?.recruitmentOnboardingReportFunc(requestPayLoadReturn(false));
    if (!recruitmentOnboardingReportList && !response) return;
    const apiData = response?.data?.docs?.map((data, index) => {
      const interviewList = data?.interviewData?.interviewList || [];
      const completedIndex = data?.interviewData?.completedInterviews ?? 0;

      const lastRound = interviewList?.find((_, i) => i + 1 === completedIndex);
      const nextRound = interviewList?.find((_, i) => i === completedIndex);

      return {
        sno: index + 1,

        fullName: data?.fullName || "-",
        designation: data?.jobPostData?.title || "-",
        department: data?.departmentName || "-",
        applicationDate: data?.applicationData
          ? dayjs(data?.applicationData?.createdAt).format("DD-MM-YYYY hh:mm a")
          : "-",
        applicationStatus: data?.applicationData?.status || "-",
        interviewStatus: data?.interviewData?.status || "-",
        takenBy: data?.interviewData?.interviewerName || "-",
        onboardingDate: data?.onboardingData?.createdAt
          ? dayjs(data?.onboardingData?.createdAt).format("DD-MM-YYYY")
          : "-",
        onboardingStatus: data?.onboardingData
          ? data?.onboardingData?.status
            ? "Yes"
            : "No"
          : "-",
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
      if (item.resume?.hyperlink) {
        const resumeCell = row.getCell("resume");
        resumeCell.value = {
          text: item.resume.text,
          hyperlink: item.resume.hyperlink,
        };
        resumeCell.font = { color: { argb: "FF0000FF" }, underline: true };
      }
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
      link.download = "Employee_Recruitment_Onboarding_Report.xlsx";
      link.click();
    });
  };

  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'A2', // Wide enough for many columns
    });

    doc.setFontSize(16);
    doc.text("Employee Recruitment Onboarding Report", 40, 30);

    const headers = [
      "S.No",
      "Employee Name",
      "Designation",
      "Department",
      "Application Date",
      "Application Status",
      "interview Status",
      "Taken By",
      "OnBoarding Date",
      "OnBoarding Status",

    ];

    const response = await reportsServices?.recruitmentOnboardingReportFunc(requestPayLoadReturn(false));
    const docs = response?.data?.docs || [];


    const body = docs.map((data, index) => {
      // const interviewList = data?.interviewData?.interviewList || [];
      // const completedIndex = data?.interviewData?.completedInterviews ?? 0;

      // const lastRound = interviewList?.find((_, i) => i + 1 === completedIndex);
      // const nextRound = interviewList?.find((_, i) => i === completedIndex);

      // const resumeLink = data?.resumeUrl
      //   ? `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${data.resumeUrl}`
      //   : null;

      return [
        index + 1,

        data?.fullName || "-",
        data?.jobPostData?.title || "-",
        data?.departmentName || "-",
        data?.applicationData
          ? dayjs(data.applicationData.createdAt).format("DD-MM-YYYY hh:mm a")
          : "-",
        data?.applicationData?.status || "-",
        data?.interviewData?.status || "-",
        data?.interviewData?.interviewerName || "-",
        data?.onboardingData
          ? dayjs(data.onboardingData.createdAt).format("DD-MM-YYYY hh:mm a")
          : "-",
        data?.onboardingData
          ? data.onboardingData.status
            ? "Yes"
            : "No"
          : "-"
      ];
    });

    autoTable(doc, {
      startY: 40,
      head: [headers],
      body: body,
      margin: { horizontal: 10 },
      styles: {
        cellPadding: 6,
        fontSize: 9,
        valign: 'middle',
        halign: 'left',
      },
      headStyles: {
        fillColor: [210, 210, 210],
        textColor: 0,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      // didDrawCell: (data) => {
      //   if (data.column.index === 6) { // Resume column
      //     const rowIndex = data.row.index;
      //     const resumeUrl = docs?.[rowIndex]?.resumeUrl;
      //     if (resumeUrl) {
      //       const fullLink = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${resumeUrl}`;
      //       doc.textWithLink("View Resume", data.cell.x + 2, data.cell.y + 10, { url: fullLink });
      //     }
      //   }
      // },
    });

    doc.save("Employee_Recruitment_Onboarding_Report.pdf");
  };



  const items = [
    {
      key: "1",
      label: <span className="text-white">Advance Filters</span>,
      children: (
        <div className="bg-[#ececec] space-y-1 gap-1 lg:flex justify-between items-center">
          <div className="sm:flex  grid grid-cols-1 gap-1.5 sm:flex-wrap text-[14px]">
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
                        className={`inputAntdSelectClassNameFilterReport `}
                        placeholder="Select Branch"
                        showSearch
                        filterOption={(input, option) =>
                          String(option?.children)
                            .toLowerCase()
                            .includes(input.toLowerCase())
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
            <div>
              <Controller
                name="departmentId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`inputAntdSelectClassNameFilterReport`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    onFocus={() => {
                      dispatch(
                        deptSearch({
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
                          branchId: [
                            "admin",
                            "company",
                            "companyDirector",
                          ].includes(userInfoglobal?.userType)
                            ? BranchId
                            : userInfoglobal?.userType === "companyBranch"
                              ? userInfoglobal?._id
                              : userInfoglobal?.branchId,
                        })
                      );
                    }}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    placeholder="Select Department"
                  >
                    <Select.Option value="">Select Department</Select.Option>
                    {depLoading ? (
                      <Select.Option disabled>
                        <ListLoader />
                      </Select.Option>
                    ) : (
                      sortByPropertyAlphabetically(departmentListData)?.map(
                        (element) => (
                          <Select.Option key={element?._id} value={element?._id}>
                            {element?.name}
                          </Select.Option>
                        )
                      )
                    )}
                  </Select>
                )}
              />
            </div>
            {/* <div className="">
              <Controller
                name="employeeId"
                control={control}
                render={({ field }) => (
                  <Select
                    mode="multiple"
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      option?.label?.toLowerCase().includes(input.toLowerCase())
                    }
                    className="inputAntdMultiSelectClassNameFilterReport "
                    placeholder="Select Employee"
                    onFocus={handleEmployeeFocus}
                    options={employeList?.map((element) => {
                      return {
                        label: element.fullName,
                        value: element._id,
                      }
                    })}
                    value={field.value || []}
                    onChange={(val) => field.onChange(val)}
                  />


                )}
              />

            </div> */}
            <div>
              <Controller
                name="status"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <Select
                    {...field}
                    // mode="multiple"
                    allowClear
                    className="inputAntdMultiSelectClassNameFilterReport"
                    placeholder="Select Status"
                    options={[
                      { label: 'Applied', value: 'Applied' },
                      { label: 'Hold', value: 'Hold' },
                      { label: 'Shortlisted', value: 'Shortlisted' },
                      { label: 'Rejected', value: 'Rejected' },
                      { label: 'Hired', value: 'Hired' },
                    ]}
                    value={field.value || []}
                    onChange={(val) => field.onChange(val)}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={() => {
                setValue("PDBranchId", "");
                setValue("PdCompanyId", "");
                setValue("departmentId", "");
                setValue("status", "");
                setValue("employeeId", "");
                setValue("daterange", "");
                setValue("shift", "");
                setValue("workType", "");
                setValue("startDate", dayjs().subtract(1, "month"));
                setValue("endDate", dayjs());
                handleSubmit()
              }}
              className="bg-header  py-2 my-0.5 rounded-md flex px-10 justify-center items-center  text-white"
            >
              <span className="text-[12px]">Reset</span>
            </button>
            <button
              onClick={() => {
                handleSubmit()
              }}
              className="bg-header  py-2 my-0.5 rounded-md flex px-10 justify-center items-center  text-white"
            >
              <span className="text-[12px]">Submit</span>
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <GlobalLayout onChange={onChange}>
      <div className="bg-grey-100 w-full p-1">
        <div className="">
          <Collapse
            className="custom-collapse"
            items={items}
            defaultActiveKey={[1]}
            expandIcon={({ isActive }) => (
              <MdKeyboardArrowDown
                size={20}
                style={{
                  color: "white",
                  transform: isActive ? "rotate(-90deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",

                }}
              />
            )}
          >
          </Collapse>
          <div className="space-y-1.5 sm:flex justify-between items-center ">
            <div className="flex items-center gap-2 sm:pt-0 pt-1">
              <span htmlFor="pageSize" className="text-sm font-light text-gray-500">
                Rows per page:
              </span>
              <Select
                id="pageSize"
                value={pageSize}
                onChange={handlePageSizeChange}
                className="text-sm font-light text-gray-700 bg-white border border-gray-200 rounded-md px-3 py-1.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition"
              >
                {pazeSizeReport.map((size) => (
                  <Select.Option key={size} value={size}>
                    {size}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className="flex justify-end items-center gap-2">
              <button
                onClick={() => {
                  generatePDF();
                }}
                className="bg-header  py-2 my-0.5 rounded-md flex px-10 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Export PDF</span>
              </button>
              <button
                onClick={() => {
                  generateExcel();
                }}
                className="bg-header  py-2 my-0.5 rounded-md flex px-10 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Export Excel</span>
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
                {/* <th className="border-none p-2 whitespace-nowrap text-center w-[5%]">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Profile</span>
                  </div>
                </th> */}
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Employee Name
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Designation
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Department
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Application Date
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Application Status
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Interview Status
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  Taken By
                </th>
                <th className="border-none p-2 whitespace-nowrap text-center">
                  onBoarding Date
                </th>
                <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <span>onBoarding Status</span>
                    {/* <div className="flex flex-col -space-y-1.5 cursor-pointer">
                                      <FaAngleUp
                                        onClick={() => handleSort("profileType", "asc")}
                                      />
                                      <FaAngleDown
                                        onClick={() => handleSort("profileType", "desc")}
                                      />
                                    </div> */}
                  </div>
                </th>

              </tr>
            </thead>
            {recruitmentOnboardingReportFunc_loading ? (
              <tr className="bg-white bg-opacity-5 ">
                <td
                  colSpan={15}
                  className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
                >
                  <Loader2 />
                </td>
              </tr>
            ) : (
              <tbody>
                {recruitmentOnboardingReportList &&
                  recruitmentOnboardingReportList?.length > 0 ? (
                  recruitmentOnboardingReportList?.map((element, index) => (
                    <tr
                      className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-[#DDDDDD] text-[#374151] text-[14px]`}
                    >
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {index + 1 + (currentPage - 1) * pageSize}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.fullName || "-"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.jobPostData?.title || "-"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.departmentName || "-"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {dayjs(element?.applicationDate?.createdAt).format('DD-MM-YYYY hh:mm a') || "-"}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.applicationData?.status || '-'}
                      </td>
                      <td className="whitespace-nowrap text-center border-none p-2">
                        {element?.interviewData?.status || '-'}
                      </td>
                      <td className="tableData ">
                        {element?.interviewData?.interviewerName}
                      </td>
                      <td className="tableData ">
                        {element?.onboardingData ? (dayjs(element?.onboardingData?.createdAt).format('DD-MM-YYYY hh:mm a')) : '-'}
                      </td>
                      <td className="tableData ">
                        {element?.onboardingData ? (element?.onboardingData?.status ? 'Yes' : 'No') : '-'}
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
              </tbody>
            )}
          </table>
        </div>
        <CustomPagination
          totalCount={totalRecruitmentOnboardingReportCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
    </GlobalLayout>
  );
}

export default RecruitmentOnboardingReport;