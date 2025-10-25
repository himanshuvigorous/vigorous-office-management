import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  convertIntoAmount,
  domainName,
  inputAntdSelectClassNameFilter,
  pazeSizeReport,
  sortByPropertyAlphabetically,
} from "../../../../constents/global";
import { useEffect, useState, useCallback, useRef } from "react";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { Collapse, Descriptions, Select, Tooltip } from "antd";
import dayjs from "dayjs";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import * as ExcelJS from "exceljs";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import { reportsServices } from "../../../../redux/_services/_reports_services";
import { MdKeyboardArrowDown } from "react-icons/md";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { financeSummaryWiseFunc } from "../../../../redux/_reducers/_reports_reducers";
import { officeAddressSearch } from "../../../global/other/officeAddressManagement/officeAddressFeature/_office_address_reducers";
import ListLoader from "../../../../global_layouts/ListLoader";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import moment from "moment";
import usePermissions from "../../../../config/usePermissions";
import { encrypt } from "../../../../config/Encryption";
import { FaEye } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";

function InvoiceStatusWiseSummary() {
  const {
    control,
    formState: { errors },
    setValue,
    handleSubmit: rhfHandleSubmit,
    getValues,
  } = useForm();

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [debouncedFilterText, setDebouncedFilterText] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [filterTrigger, setFilterTrigger] = useState(0);

  const { canRead } = usePermissions();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    financeInvoiceSummaryReportList,
    financeInvoiceSummaryReportSummary,
    financeSummaryWiseFunc_loading,
    financeInvoiceSummaryReportCount,
  } = useSelector((state) => state.reports);
  const { branchList } = useSelector((state) => state.branch);
  const { departmentListData, loading: depLoading } = useSelector(
    (state) => state.department
  );
  const { officeAddressListData, loading: officeAddressLoading } = useSelector(
    (state) => state.officeAddress
  );

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const BranchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: "",
  });
  const department = useWatch({
    control,
    name: "department",
    defaultValue: "",
  });
  // Get initial values from URL params or defaults
  const initialStatus = searchParams.get("status") || "";
  const initialLayoutId = searchParams.get("layoutId") || "";
  const initialStartDate = searchParams.get("startDate") || dayjs().startOf('month').format("YYYY-MM-DD");
  const initialEndDate = searchParams.get("endDate") || dayjs().format("YYYY-MM-DD");
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialBranchId = searchParams.get("PDBranchId") || "";
  const initialDepartmentId = searchParams.get("department") || "";

  // Initialize form with URL params
  useEffect(() => {
    setValue("status", initialStatus);
    setValue("layoutId", initialLayoutId);
    setValue("startDate", initialStartDate ? dayjs(initialStartDate) : dayjs().startOf('month'));
    setValue("endDate", initialEndDate ? dayjs(initialEndDate) : dayjs());
    setValue("PDBranchId", initialBranchId);
    setValue("department", initialDepartmentId);
    setCurrentPage(initialPage);

    // Check if we have any initial filters
    const hasInitialFilters = !!(initialStatus || initialLayoutId ||
      initialStartDate !== dayjs().startOf('month').format("YYYY-MM-DD") ||
      initialEndDate !== dayjs().format("YYYY-MM-DD"));
    setFiltersApplied(hasInitialFilters);

    // Mark initial load as complete after a short delay to allow form values to be set
    const timer = setTimeout(() => {
      setInitialLoadComplete(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [setValue, initialStatus, initialLayoutId, initialStartDate, initialEndDate, initialPage, initialBranchId, initialDepartmentId]);

  // Debounce search text
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilterText(searchText);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  // Update URL params when filters change
  const updateUrlParams = useCallback((newParams) => {
    const params = new URLSearchParams();

    // Always include current filters
    if (newParams.status !== undefined) {
      newParams.status ? params.set("status", newParams.status) : params.delete("status");
    } else if (searchParams.get("status")) {
      params.set("status", searchParams.get("status"));
    }

    if (newParams.layoutId !== undefined) {
      newParams.layoutId ? params.set("layoutId", newParams.layoutId) : params.delete("layoutId");
    } else if (searchParams.get("layoutId")) {
      params.set("layoutId", searchParams.get("layoutId"));
    }

    if (newParams.startDate !== undefined) {
      newParams.startDate ? params.set("startDate", newParams.startDate) : params.delete("startDate");
    } else if (searchParams.get("startDate")) {
      params.set("startDate", searchParams.get("startDate"));
    }

    if (newParams.endDate !== undefined) {
      newParams.endDate ? params.set("endDate", newParams.endDate) : params.delete("endDate");
    } else if (searchParams.get("endDate")) {
      params.set("endDate", searchParams.get("endDate"));
    }

    if (newParams.page !== undefined) {
      newParams.page > 1 ? params.set("page", newParams.page) : params.delete("page");
    } else if (searchParams.get("page")) {
      params.set("page", searchParams.get("page"));
    }

    if (newParams.PDBranchId !== undefined) {
      newParams.PDBranchId ? params.set("PDBranchId", newParams.PDBranchId) : params.delete("PDBranchId");
    } else if (searchParams.get("PDBranchId")) {
      params.set("PDBranchId", searchParams.get("PDBranchId"));
    }

    if (newParams.department !== undefined) {
      newParams.department ? params.set("department", newParams.department) : params.delete("department");
    } else if (searchParams.get("department")) {
      params.set("department", searchParams.get("department"));
    }

    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const requestPayLoadReturn = (pagination = true) => {
    const status = getValues("status") || "";
    const layoutId = getValues("layoutId") || "";
    const startDate = getValues("startDate");
    const endDate = getValues("endDate");
    const department = getValues("department") || "";
    const branchId = getValues("PDBranchId") || "";

    const formattedStartDate = startDate ? dayjs(startDate).format("YYYY-MM-DD") : dayjs().startOf('month').format("YYYY-MM-DD");
    const formattedEndDate = endDate ? dayjs(endDate).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD");

    return {
      currentPage: currentPage,
      pageSize: pageSize,
      reqPayload: {
        text: debouncedFilterText,
        sort: true,
        isPagination: pagination,
        companyId:
          userInfoglobal?.userType === "admin"
            ? "" // Will be set from form if needed
            : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        directorId: "",
        branchId:
          userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "admin" ||
            userInfoglobal?.userType === "companyDirector"
            ? "" // Will be set from form if needed
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        invoiceLayoutId: layoutId,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        status: status,
        branchId: branchId,
        departmentId: department
      },
    };
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
          companyId: userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        })
      );
      dispatch(
        deptSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: userInfoglobal?.userType === "company"
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
    }
    // setValue("startDate", dayjs().subtract(1, "month"));
    // setValue("endDate", dayjs());
  }, []);
  const officeAddresFunction = () => {
    dispatch(
      officeAddressSearch({
        companyId:
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        directorId: "",
        text: "",
        sort: true,
        status: true,
        type: "invoice",
        isPagination: false,
        bankAccountId: "",
        isGSTEnabled: "",
      })
    );
  };

  const getInvoiceReport = () => {
    dispatch(financeSummaryWiseFunc(requestPayLoadReturn(true)));
  };

  // Fetch data on initial load if we have URL params or when filters are applied
  useEffect(() => {
    if (initialLoadComplete && (filtersApplied || searchParams.toString())) {
      getInvoiceReport();
    }
  }, [currentPage, debouncedFilterText, pageSize, filtersApplied, initialLoadComplete, filterTrigger]);

  useEffect(() => {
    officeAddresFunction();
  }, []);

  const handleFormSubmit = (data) => {
    // Update URL with new filter values
    updateUrlParams({
      status: data.status || "",
      layoutId: data.layoutId || "",
      startDate: data.startDate ? dayjs(data.startDate).format("YYYY-MM-DD") : dayjs().startOf('month').format("YYYY-MM-DD"),
      endDate: data.endDate ? dayjs(data.endDate).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
      page: 1, // Reset to first page when filters change
      PDBranchId: data.PDBranchId || "",
      department: data.department || "",
    });

    // Also update current page state and set filters as applied
    setCurrentPage(1);
    setFiltersApplied(true);
    // Trigger API call by updating filterTrigger
    setFilterTrigger(prev => prev + 1);
  };

  const handleResetFilters = () => {
    // Clear all filters and update URL
    updateUrlParams({
      status: "",
      layoutId: "",
      startDate: dayjs().startOf('month').format("YYYY-MM-DD"),
      endDate: dayjs().format("YYYY-MM-DD"),
      page: 1,
      PDBranchId: "",
      department: "",
    });

    // Reset form values
    setValue("status", "");
    setValue("layoutId", "");
    setValue("startDate", dayjs().startOf('month'));
    setValue("endDate", dayjs());
    setValue("PDBranchId", "");
    setValue("department", "");

    setCurrentPage(1);
    setSearchText("");
    setFiltersApplied(false);
    // Trigger API call by updating filterTrigger
    setFilterTrigger(prev => prev + 1);
  };

  const onPaginationChange = (page) => {
    setCurrentPage(page);
    updateUrlParams({ page });
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e));
    setCurrentPage(1);
    updateUrlParams({ page: 1 });
  };

  const onChangeSearch = (e) => {
    setSearchText(e);
  };

  // Date validation function
  const validateDates = (startDate, endDate) => {
    if (startDate && endDate && dayjs(startDate).isAfter(dayjs(endDate))) {
      return "Start date cannot be after end date";
    }
    return true;
  };

  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Invoice Summary Report");

    worksheet.columns = [
      { header: "S.No.", key: "sno", width: 10 },
      { header: "Date", key: "date", width: 20 },
      { header: "Invoice Number", key: "invoiceNumber", width: 20 },
      { header: "Client Name", key: "fullName", width: 25 },
      { header: "Gross Amount", key: "invoiceBilled", width: 30 },
      { header: "GST Charged", key: "gstCharged", width: 20 },
      { header: "Grand Total", key: "grandTotal", width: 15 },
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

    const response = await reportsServices?.financeSummaryWiseFunc(
      requestPayLoadReturn(false)
    );

    if (!response || !response?.data) return;

    let totalGross = 0;
    let totalGST = 0;
    let totalGrand = 0;

    const body = response?.data?.docs?.map((data, index) => {
      const gross = Number(data?.invoiceBilled || 0);
      const gst = Number(data?.gstCharged || 0);
      const grand = Number(data?.grandTotal || 0);

      // Accumulate totals
      totalGross += gross;
      totalGST += gst;
      totalGrand += grand;

      return {
        sno: index + 1,
        date: data?.createdAt ? dayjs(data?.createdAt).format("DD-MM-YYYY") : "-",
        invoiceBilled: convertIntoAmount(gross),
        invoiceNumber: data?.invoiceNumber,
        fullName: data?.clientData?.fullName,
        gstCharged: convertIntoAmount(gst),
        grandTotal: convertIntoAmount(grand),
      };
    });

    body?.forEach((item) => {
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

    // Add Total Row
    const totalRow = worksheet.addRow({
      sno: "",
      date: "",
      invoiceNumber: "",
      fullName: "Total",
      invoiceBilled: convertIntoAmount(totalGross),
      gstCharged: convertIntoAmount(totalGST),
      grandTotal: convertIntoAmount(totalGrand),
    });

    // Style the total row
    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: "middle", horizontal: colNumber >= 5 ? "right" : "left" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      if (colNumber >= 5) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFE6E6E6" }, // Light grey
        };
      }
    });

    worksheet.autoFilter = {
      from: "A1",
      to: "G1",
    };

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "invoiceSummaryReport.xlsx";
      link.click();
    });
  };

  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
    });

    doc.setFontSize(16);

    const headers = [
      "S.no",
      "Date",
      "Invoice Number",
      "Client Name",
      "Gross Amount",
      "Gst Charged",
      "Grand Total",
    ];

    const response = await reportsServices?.financeSummaryWiseFunc(
      requestPayLoadReturn(false)
    );

    if (!response || !response?.data?.docs) return;

    let totalGross = 0;
    let totalGST = 0;
    let totalGrand = 0;

    const body = response?.data?.docs?.map((data, index) => {
      const gross = Number(data?.invoiceBilled || 0);
      const gst = Number(data?.gstCharged || 0);
      const grand = Number(data?.grandTotal || 0);

      totalGross += gross;
      totalGST += gst;
      totalGrand += grand;

      return [
        index + 1,
        data?.createdAt ? dayjs(data?.createdAt).format("DD-MM-YYYY") : "-",
        data?.invoiceNumber,
        data?.clientData?.fullName,
        convertIntoAmount(gross),
        convertIntoAmount(gst),
        convertIntoAmount(grand),
      ];
    });

    // Add total row
    const totalRow = [
      "", "", "", "Total",
      convertIntoAmount(totalGross),
      convertIntoAmount(totalGST),
      convertIntoAmount(totalGrand),
    ];

    body.push(totalRow); // Append at the end

    autoTable(doc, {
      startY: 40,
      head: [headers],
      body: body,
      margin: { horizontal: 10 },
      styles: {
        cellPadding: 8,
        fontSize: 10,
        valign: "middle",
        halign: "left",
      },
      headStyles: {
        fillColor: [211, 211, 211],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      didDrawCell: (data) => {
        const { row, column, cell } = data;
        const isTotalRow = row.index === body.length - 1;
        if (isTotalRow) {
          doc.setFont(undefined, "bold");
        }
      },
    });

    doc.save(`InvoiceSummaryReport.pdf`);
  };

  const items = [
    {
      key: "1",
      label: <span className="text-white">Advance Filters</span>,
      children: (
        <div className="bg-[#ececec] space-y-1 sm:flex justify-between items-center">

          <div className="flex gap-2 flex-wrap items-center">
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
                name="department"
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
            <Controller
              name="layoutId"
              control={control}
              defaultValue={initialLayoutId}
              render={({ field }) => (
                <Select
                  {...field}
                  className={`${inputAntdSelectClassNameFilter}`}
                  placeholder="Select Layout"
                >
                  <Select.Option value="">Select Layout</Select.Option>
                  {officeAddressLoading ? (
                    <Select.Option disabled>
                      <ListLoader />
                    </Select.Option>
                  ) : (
                    sortByPropertyAlphabetically(officeAddressListData, "firmName")?.map(
                      (element) => (
                        <Select.Option key={element?._id} value={element?._id}>
                          {element?.firmName}
                        </Select.Option>
                      )
                    )
                  )}
                </Select>
              )}
            />

            <Controller
              name="status"
              control={control}
              defaultValue={initialStatus}
              render={({ field }) => (
                <Select
                  {...field}
                  className={`${inputAntdSelectClassNameFilter}`}
                  placeholder="Select Status"
                >
                  <Select.Option value="">Select status</Select.Option>
                  <Select.Option value="PendingPayment">
                    Pending Payment
                  </Select.Option>
                  <Select.Option value="Paid">Paid</Select.Option>
                </Select>
              )}
            />

            <Controller
              name="startDate"
              control={control}
              defaultValue={initialStartDate ? dayjs(initialStartDate) : dayjs().startOf('month')}
              render={({ field }) => (
                <CustomDatePicker
                  field={field}
                  report={true}
                  errors={errors}
                  picker="date"
                  format="DD/MM/YYYY"
                  placeholder="Start Date"
                  disabledDate={(current) => {
                    const endDate = getValues("endDate");
                    if (endDate && current) {
                      return current.isAfter(dayjs(endDate), 'day');
                    }
                    return current && current.isAfter(moment().endOf("day"), "day");
                  }}
                />
              )}
            />

            <Controller
              name="endDate"
              control={control}
              defaultValue={initialEndDate ? dayjs(initialEndDate) : dayjs()}
              render={({ field }) => (
                <CustomDatePicker
                  field={field}
                  report={true}
                  errors={errors}
                  picker="date"
                  format="DD/MM/YYYY"
                  placeholder="End Date"
                  disabledDate={(current) => {
                    const startDate = getValues("startDate");
                    if (startDate && current) {
                      return current.isBefore(dayjs(startDate), 'day') || current.isAfter(moment().endOf("day"), "day");
                    }
                    return current && current.isAfter(moment().endOf("day"), "day");
                  }}
                />
              )}
            />
          </div>
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={handleResetFilters}
              className="bg-header py-2 my-0.5 rounded-md flex px-10 justify-center items-center text-white"
            >
              <span className="text-[12px]">Reset</span>
            </button>
            <button
              onClick={rhfHandleSubmit(handleFormSubmit)}
              className="bg-header py-2 my-0.5 rounded-md flex px-10 justify-center items-center text-white"
            >
              <span className="text-[12px]">Apply Filters</span>
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <GlobalLayout onChange={onChangeSearch}>
      <div className="bg-grey-100 w-full p-1">
        <div className="">
          <Collapse
            className="custom-collapse"
            items={items}
            defaultActiveKey={["1"]}
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
          />
          <Descriptions
            bordered
            column={1}
            size="small"
            className="mt-1 bg-white rounded-xl"
          >
            <Descriptions.Item label="Gross Amount">

              {convertIntoAmount(financeInvoiceSummaryReportSummary?.invoiceBilled || 0)}

            </Descriptions.Item>

            <Descriptions.Item label="GST Charged">

              {convertIntoAmount(financeInvoiceSummaryReportSummary?.gstCharged || 0)}

            </Descriptions.Item>

            <Descriptions.Item label="Grand Total">

              {convertIntoAmount(financeInvoiceSummaryReportSummary?.totalBilled || 0)}

            </Descriptions.Item>
          </Descriptions>

          <div className="space-y-1.5 sm:flex grid grid-cols-1 py-1 justify-between flex-col sm:flex-row items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-light text-gray-500">
                Rows per page:
              </span>
              <Select
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
                onClick={generatePDF}
                className="bg-header py-2 my-0.5 rounded-md flex px-10 justify-center items-center text-white"
              >
                <span className="text-[12px]">Export PDF</span>
              </button>
              <button
                onClick={generateExcel}
                className="bg-header py-2 my-0.5 rounded-md flex px-10 justify-center items-center text-white"
              >
                <span className="text-[12px]">Export Excel</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          <table className="w-full max-w-full rounded-xl overflow-x-auto">
            <thead>
              <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                <th className="border-none p-2 whitespace-nowrap w-[5%]">
                  S.No.
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  Date
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  Invoice Number
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  Client Name
                </th>
                <th className="border-none p-2 whitespace-nowrap text-right">
                  Gross Amount
                </th>
                <th className="border-none p-2 whitespace-nowrap text-right">
                  GST Charged
                </th>
                <th className="border-none p-2 whitespace-nowrap text-right">
                  Grand Total
                </th>
                <th className="border-none p-2 whitespace-nowrap">View</th>
              </tr>
            </thead>

            {financeSummaryWiseFunc_loading ? (
              <tbody>
                <tr className="bg-white bg-opacity-5">
                  <td
                    colSpan={8}
                    className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                  >
                    <Loader2 />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {financeInvoiceSummaryReportList &&
                  financeInvoiceSummaryReportList.length > 0 ? (
                  financeInvoiceSummaryReportList.map((element, index) => (
                    <tr
                      key={element._id}
                      className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-[#DDDDDD] text-[#374151] text-[14px]`}
                    >
                      <td className="whitespace-nowrap border-none p-2">
                        {index + 1 + (currentPage - 1) * pageSize}
                      </td>
                      <td className="whitespace-nowrap border-none p-2">
                        {element?.createdAt ? dayjs(element?.createdAt).format("DD-MM-YYYY") : "-"}
                      </td>
                      <td className="whitespace-nowrap border-none p-2">
                        {element?.invoiceNumber || "-"}
                      </td>

                      <td className="whitespace-nowrap border-none p-2">
                        {element?.clientData?.fullName || "-"}
                      </td>
                      <td className="whitespace-nowrap text-right border-none p-2">
                        {convertIntoAmount(element?.invoiceBilled) || "-"}
                      </td>
                      <td className="whitespace-nowrap text-right border-none p-2">
                        {convertIntoAmount(element?.gstCharged)}
                      </td>
                      <td className="whitespace-nowrap text-right border-none p-2">
                        {convertIntoAmount(element?.grandTotal)}
                      </td>
                      <td className="tableData">
                        <span className="py-1.5 flex justify-start items-center space-x-2.5">
                          <Tooltip placement="topLeft" title="View Invoice">
                            {canRead && (
                              <button
                                onClick={() =>
                                  navigate(
                                    `/admin/viewInvoice?invoiceId=${encrypt(
                                      element?._id
                                    )}&type=invoice&downloadPdfPath=${element?.invoicePDFPath
                                      ? encrypt(element?.invoicePDFPath)
                                      : ""
                                    }`
                                  )
                                }
                                className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                type="button"
                              >
                                <FaEye
                                  className="hover:text-header text-header"
                                  size={15}
                                />
                              </button>
                            )}
                          </Tooltip>
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={8}
                      className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                    >
                      {filtersApplied || searchParams.toString()
                        ? "No records found with current filters"
                        : "Apply filters to see results"}
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>

        {financeInvoiceSummaryReportCount > 0 && (
          <CustomPagination
            totalCount={financeInvoiceSummaryReportCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        )}
      </div>
    </GlobalLayout>
  );
}

export default InvoiceStatusWiseSummary;