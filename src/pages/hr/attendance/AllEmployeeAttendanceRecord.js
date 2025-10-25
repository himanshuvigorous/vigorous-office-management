import React, { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllAttendanceRecord } from "./AttendanceFeatures/_attendance_reducers";
import { domainName, inputLabelClassName } from "../../../constents/global";
import moment from "moment";
import ManualAttendanceModal from "./ManualAttendanceModal";
import AttendanceDataModal from "./AttendanceDataModal";
import { Controller, useForm, useWatch } from "react-hook-form";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import usePermissions from "../../../config/usePermissions";

import { Tooltip, Table, Tag, Card, Statistic, Row, Col } from "antd";

const getCurrentMonth = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");

  return `${year}-${month}-01`;
};

function generateAttendanceReport(data) {
  const moment = require('moment');
  const report = [];
  const dailyStatus = data.dailyStatus || [];

  const currentMonth = moment().month();
  const currentYear = moment().year();
  const daysInMonth = moment().daysInMonth();

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = moment({ year: currentYear, month: currentMonth, day: day }).startOf('day');
    const formattedDate = currentDate.toISOString();

    const dayData = dailyStatus.find((entry) => entry.day === day);

    if (dayData) {
      report.push({
        day: day,
        date: formattedDate,
        isPresentDay: dayData.isPresentDay || "-",
        checkInTime: dayData.checkInTime || "-",
        checkOutTime: dayData.checkOutTime || "-",
        workedHRS: dayData.workedHRS || "-",
      });
    } else {
      report.push({
        day: day,
        date: formattedDate,
        isPresentDay: "-",
        checkInTime: "-",
        checkOutTime: "-",
        workedHRS: "-",
      });
    }
  }

  return report;
}

const statusData = [
  { label: "H", description: "Half Day", bgColor: "bg-yellow-100", color: "gold" },
  { label: "P", description: "Present", bgColor: "bg-green-700 text-white", color: "green" },
  { label: "L", description: "Leave", bgColor: "bg-orange-100", color: "orange" },
  { label: "A", description: "Absent", bgColor: "bg-red-700 text-white", color: "red" },
  { label: "W", description: "Weekend", bgColor: "bg-orange-700 text-white", color: "volcano" },
  { label: "D", description: "holiday", bgColor: "bg-blue-700 text-white", color: "blue" },
];

const AllEmployeeAttendanceRecord = () => {
  const dispatch = useDispatch();
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { AllAttendanceRecordData, loading } = useSelector((state) => state.attendance);
  const [allmonthattendaceData, setallmonthattendaceData] = useState([]);
  const date = moment();
  const day = date.format("D");
  const monthName = date.format("MMMM");
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [monthlySummary, setMonthlySummary] = useState({});
  const [todaySummary, setTodaySummary] = useState({});
  const selectedDate = useWatch({
    control,
    name: "date",
    defaultValue: "",
  });

  const openModal = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  useEffect(() => {
    if (selectedDate) {
      dispatch(
        getAllAttendanceRecord({
          companyId:
            userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
          branchId:
            userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
          employeId: null,
          currentMonth: selectedDate,
        })
      );
    }
  }, [selectedDate]);

  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();

  useEffect(() => {
    fetchattendanceListData();
  }, []);

  const fetchattendanceListData = () => {
    dispatch(
      getAllAttendanceRecord({
        companyId:
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        employeId: null,
        currentMonth: getCurrentMonth(),
      })
    );
  };

  // Function to calculate attendance summary for all employees
  const calculateAllSummary = (data) => {
    const monthlySummary = {
      P: 0, // Present
      H: 0, // Half day
      L: 0, // Leave
      A: 0, // Absent
      W: 0, // Weekend
      D: 0, // Holiday
    };

    const todaySummary = {
      P: 0,
      H: 0,
      L: 0,
      A: 0,
      W: 0,
      D: 0,
    };

    const today = moment().date();

    data?.forEach(employee => {
      employee.dailyStatus?.forEach(day => {
        switch (day?.isPresentDay) {
          case "firstHalf":
          case "secondHalf":
            monthlySummary.H++;
            if (day.day === today) todaySummary.H++;
            break;
          case "present":
            monthlySummary.P++;
            if (day.day === today) todaySummary.P++;
            break;
          case "leave":
            monthlySummary.L++;
            if (day.day === today) todaySummary.L++;
            break;
          case "absent":
            monthlySummary.A++;
            if (day.day === today) todaySummary.A++;
            break;
          case "off":
            monthlySummary.W++;
            if (day.day === today) todaySummary.W++;
            break;
          case "holiday":
            monthlySummary.D++;
            if (day.day === today) todaySummary.D++;
            break;
        }
      });
    });

    return { monthlySummary, todaySummary };
  };

  useEffect(() => {
    setallmonthattendaceData([]);
    const employeeateendenceData = AllAttendanceRecordData?.map((data) => {
      return {
        ...data,
        dailyStatus: generateAttendanceReport(data),
      };
    });

    const { monthlySummary, todaySummary } = calculateAllSummary(employeeateendenceData);
    setMonthlySummary(monthlySummary);
    setTodaySummary(todaySummary);
    setallmonthattendaceData(employeeateendenceData);
  }, [AllAttendanceRecordData]);

  // Function to calculate attendance summary for an employee
  const calculateAttendanceSummary = (dailyStatus) => {
    const summary = {
      P: 0, // Present
      H: 0, // Half day
      L: 0, // Leave
      A: 0, // Absent
      W: 0, // Weekend
      D: 0, // Holiday
    };

    dailyStatus.forEach(day => {
      switch (day?.isPresentDay) {
        case "firstHalf":
        case "secondHalf":
          summary.H++;
          break;
        case "present":
          summary.P++;
          break;
        case "leave":
          summary.L++;
          break;
        case "absent":
          summary.A++;
          break;
        case "off":
          summary.W++;
          break;
        case "holiday":
          summary.D++;
          break;
      }
    });

    return summary;
  };

  // Prepare columns for Ant Design Table
  const prepareColumns = () => {
    const dayColumns = Array.from({ length: moment().daysInMonth() }, (_, i) => {
      const dayNumber = i + 1;
      return {
        title: (
          <span className={`${Number(day) === dayNumber ? "bg-yellow-600 rounded-full px-1.5 py-1" : ""}`}>
            {dayNumber}
          </span>
        ),
        dataIndex: `day_${dayNumber}`,
        key: `day_${dayNumber}`,
        width: 50,
        align: 'center',
        onCell: (record) => {
          const status = record.dailyStatus.find(s => s.day === dayNumber);
          let bgColor = '';

          switch (status?.isPresentDay) {
            case "firstHalf":
            case "secondHalf":
              bgColor = "bg-yellow-100";
              break;
            case "present":
              bgColor = "bg-green-700";
              break;
            case "leave":
              bgColor = "bg-orange-100";
              break;
            case "absent":
              bgColor = "bg-red-700";
              break;
            case "off":
              bgColor = "bg-orange-700";
              break;
            case "holiday":
              bgColor = "bg-blue-700";
              break;
            default:
              bgColor = "bg-violet-100";
              break;
          }

          return {
            className: `${bgColor} ${['bg-green-700', 'bg-red-700', 'bg-orange-700', 'bg-blue-700'].includes(bgColor) ? 'text-white' : ''}`,
            onClick: () => openModal({ DayData: status, employee: record })
          };
        },
        render: (_, record) => {
          const status = record.dailyStatus.find(s => s.day === dayNumber);
          let label = '-';

          switch (status?.isPresentDay) {
            case "firstHalf":
            case "secondHalf":
              label = "H";
              break;
            case "present":
              label = "P";
              break;
            case "leave":
              label = "L";
              break;
            case "absent":
              label = "A";
              break;
            case "off":
              label = "W";
              break;
            case "holiday":
              label = "D";
              break;
          }

          return (
            <span className="cursor-pointer">
              {label}
            </span>
          );
        }
      };
    });

    return [
      {
        title: 'S.No',
        dataIndex: 'sno',
        key: 'sno',
        fixed: 'left',
        width: 60,
        render: (_, __, index) => index + 1,
      },
      {
        title: 'Employee',
        dataIndex: 'employeeName',
        key: 'employeeName',
       
        width: 150,
      },
      {
        title: 'Summary',
        key: 'summary',
      
        width: 200,
        render: (_, record) => {
          const summary = calculateAttendanceSummary(record.dailyStatus);
          return (
            <div className="flex flex-wrap gap-1">
              {Object.entries(summary).map(([key, value]) => {
                if (value > 0) {
                  const status = statusData.find(s => s.label === key);
                  return (
                    <Tag
                      key={key}
                      color={status?.color || 'default'}
                      className="flex items-center"
                    >
                      {key}: {value}
                    </Tag>
                  );
                }
                return null;
              })}
            </div>
          );
        },
      },
      ...dayColumns
    ];
  };

  // Prepare data for Ant Design Table
  const prepareTableData = () => {
    return allmonthattendaceData?.map((employee, index) => {
      const rowData = {
        key: employee._id || index,
        ...employee,
        sno: index + 1
      };

      // Add day status to row data
      employee.dailyStatus.forEach(day => {
        rowData[`day_${day.day}`] = day;
      });

      return rowData;
    });
  };

  return (
    <GlobalLayout className="p-4">
      <form autoComplete="off">
        <div>
          <label className={`${inputLabelClassName}`}>Date</label>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <CustomDatePicker
                field={field}
                errors={errors}
                picker="month"
                format="MM/YYYY"
                disabledDate={(current) => {
                  return (
                    current && current.isAfter(moment().endOf("day"), "day")
                  );
                }}
              />
            )}
          />
          {errors.date && (
            <p className="text-red-500 text-sm">Date is required</p>
          )}
        </div>
      </form>


      <Row gutter={[16, 16]} className="my-4">
        <Col xs={24} md={12}>
          <Card
            title="Monthly Summary"
            bordered={false}
            headStyle={{ fontSize: '0.9rem', padding: '8px 16px' }}
            bodyStyle={{ padding: '12px' }}
          >
            <Row gutter={[8, 8]}>
              {Object.entries(monthlySummary).map(([key, value]) => {
                const status = statusData.find(s => s.label === key);
                return (
                  <Col xs={12} sm={8} key={key}>
                    <Card
                      size="small"
                      bodyStyle={{ padding: '8px' }}
                    >
                      <Statistic
                        title={
                          <span
                            className={`${status?.bgColor} px-1 py-0.5 rounded text-xs`}
                            style={{ display: 'inline-block' }}
                          >
                            {key}: {status?.description}
                          </span>
                        }
                        value={value}
                        valueStyle={{
                          color: status?.color,
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}
                        prefix={value > 0 ? '+' : ''}
                      />
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title={`Today's Summary (Day ${day})`}
            bordered={false}
            headStyle={{ fontSize: '0.9rem', padding: '8px 16px' }}
            bodyStyle={{ padding: '12px' }}
          >
            <Row gutter={[8, 8]}>
              {Object.entries(todaySummary).map(([key, value]) => {
                const status = statusData.find(s => s.label === key);
                return (
                  <Col xs={12} sm={8} key={key}>
                    <Card
                      size="small"
                      bodyStyle={{ padding: '8px' }}
                    >
                      <Statistic
                        title={
                          <span
                            className={`${status?.bgColor} px-1 py-0.5 rounded text-xs`}
                            style={{ display: 'inline-block' }}
                          >
                            {key}: {status?.description}
                          </span>
                        }
                        value={value}
                        valueStyle={{
                          color: status?.color,
                          fontWeight: 'bold',
                          fontSize: '0.9rem'
                        }}
                        prefix={value > 0 ? '+' : ''}
                      />
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Card>
        </Col>
      </Row>

      <div className="">
        <div className="flex justify-between items-center mt-4 mb-2">
          <div>Attendance Report - {monthName}</div>
          {canCreate && canRead && (
            <Tooltip placement="topLeft"  title='Add Manual Attendance'>
              <button
                onClick={() => setIsManualModalOpen(true)}
                className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
              >
                <FaPlus />
                <span className="text-[12px]">Manual Attendance</span>
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusData.map((status, i) => (
          <div
            key={i}
            className={`flex items-center ${status.bgColor} rounded px-2 py-1 sm:text-sm text-xs font-semibold mb-2`}
          >
            <span className="mr-2">{status.label}</span>
            <span>{`> ${status.description}`}</span>
          </div>
        ))}
      </div>

      {canRead && (
        <div className="w-full overflow-hidden bg-white shadow-xl">
          <Table
            columns={prepareColumns()}
            dataSource={prepareTableData()}
            loading={loading}
            scroll={{ x: 'max-content', y: 'calc(100vh - 400px)' }}
            bordered
            size="small"
            pagination={false}
            rowHoverable={false}
            components={{
              body: {
                cell: (props) => (
                  <td
                    {...props}
                    style={{
                      padding: '4px 8px',
                      ...props.style
                    }}
                  />
                )
              }
            }}
            locale={{
              emptyText: (
                <div className="px-4 py-2 text-center bg-gray-200">
                  No data available
                </div>
              )
            }}
          />

          {isManualModalOpen && (
            <ManualAttendanceModal
              isOpen={true}
              onClose={() => setIsManualModalOpen(false)}
              fetchattendanceListData={fetchattendanceListData}
            />
          )}
          {isModalOpen && (
            <AttendanceDataModal
              isOpen={true}
              onClose={() => setIsModalOpen(false)}
              modalData={modalData}
            />
          )}
        </div>
      )}
    </GlobalLayout>
  );
};

export default AllEmployeeAttendanceRecord;