import React, { useEffect } from 'react';
import { Modal, Table, Select, Button, Tooltip } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { payrollDetailsFullListFunc } from '../employeePayrollModule/employeePayRollFeatures/_payroll_reducers';
import dayjs from 'dayjs';

const PayrollDatafullList = ({ isOpen, onClose, element }) => {
  const dispatch = useDispatch()
  const { loading, payrolsalaryReportData } = useSelector(
    (state) => state.payrollReducer
  );
  const calculateTotals = () => {
    const data = payrolsalaryReportData?.jsonData?.employeDayWiseReport || [];
    const totals = {
      presentDays: 0,
      holidayDays: 0,
      workingDays: 0,
      sandwichDays: 0,
      perDayTargetMin: 0,
      totalEmployeWorkingMin: 0,
      perDayEmployminMinutes: 0,
      perDayEmployPendingMin: 0,
      perDayEmployOvertimeMin: 0,
      employePerDaySalary: 0,
      perDaySalary: 0,
      employePerExtraDaySalary: 0,
      totalDiffrence :0,
      totalSalary: 0
    };

    data.forEach(item => {
      totals.perDayTargetMin += item.perDayTargetMin || 0;
      totals.totalEmployeWorkingMin += item.totalEmployeWorkingMin || 0;
      totals.perDayEmployminMinutes += item.perDayEmployminMinutes || 0;
      totals.perDayEmployPendingMin += item.perDayEmployPendingMin || 0;
      totals.perDayEmployOvertimeMin += item.perDayEmployOvertimeMin || 0;

      if (item.isPresent) totals.presentDays++;
      if (item.isHoliday) totals.holidayDays++;
      if (item.isWorkingDay) totals.workingDays++;
      if (item.assignedShiftDetail?.isApplySandwich) totals.sandwichDays++;

      if (item.salary) {
        totals.employePerDaySalary += item.salary.employePerDaySalary || 0;
        totals.perDaySalary += item.salary.perDaySalary || 0;
        totals.employePerExtraDaySalary += item.salary.employePerExtraDaySalary || 0;
        totals.totalSalary += (item.salary.employePerDaySalary || 0) + (item.salary.employePerExtraDaySalary || 0);
        totals.totalDiffrence = totals.totalSalary - totals.perDaySalary;
      }
    });

    return totals;
  };
  const totals = calculateTotals();
  const footer = () => {
    return (
      <Table.Summary fixed>
        <Table.Summary.Row style={{ fontWeight: 'bold', background: '#f0f0f0' }}>
          <Table.Summary.Cell index={0} colSpan={3}>Total</Table.Summary.Cell>
          <Table.Summary.Cell index={4}>{totals.perDayTargetMin ?
            Math.floor(totals.perDayTargetMin / 60).toString().padStart(2, '0') + ':' +
            (totals.perDayTargetMin % 60).toString().padStart(2, '0')
            : '-'} hrs</Table.Summary.Cell>
          <Table.Summary.Cell index={5}>{totals.totalEmployeWorkingMin ?
            Math.floor(totals.totalEmployeWorkingMin / 60).toString().padStart(2, '0') + ':' +
            (totals.totalEmployeWorkingMin % 60).toString().padStart(2, '0')
            : '-'} hrs</Table.Summary.Cell>
          <Table.Summary.Cell index={6}>{totals.perDayEmployPendingMin ?
            Math.floor(totals.perDayEmployPendingMin / 60).toString().padStart(2, '0') + ':' +
            (totals.perDayEmployPendingMin % 60).toString().padStart(2, '0')
            : '-'} hrs</Table.Summary.Cell>
          <Table.Summary.Cell index={9}>{totals.perDayEmployOvertimeMin ?
            Math.floor(totals.perDayEmployOvertimeMin / 60).toString().padStart(2, '0') + ':' +
            (totals.perDayEmployOvertimeMin % 60).toString().padStart(2, '0')
            : '-'} hrs</Table.Summary.Cell>
          <Table.Summary.Cell index={10}>{(totals?.perDaySalary)?.toFixed(2)}</Table.Summary.Cell>
          <Table.Summary.Cell index={10}>-</Table.Summary.Cell>
          <Table.Summary.Cell index={12}>{totals.totalSalary?.toFixed(2)}</Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  };
  useEffect(() => {
    dispatch(payrollDetailsFullListFunc({
      _id: element
    }))
  }, [element])


  const columns = [
    {
      title: (
        <Tooltip placement="topLeft" title="Date">
          <span style={{ fontSize: '12px' }}>Date</span>
        </Tooltip>
      ),
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: (
        <Tooltip placement="topLeft" title="Day of Week">
          <span style={{ fontSize: '12px' }}>Day</span>
        </Tooltip>
      ),
      dataIndex: 'dayOfWeek',
      key: 'dayOfWeek',
    },

        {
      title: (
        <Tooltip placement="topLeft" title="Day of Week">
          <span style={{ fontSize: '12px' }}>Is WFH</span>
        </Tooltip>
      ),
      dataIndex: 'iswfh',
      key: 'iswfh',
       render: (text, data) => (
        <div>
          {data.attendanceData ? (
          
              data.attendanceData?.wfhReqData ? "Yes" : "No"
           
          ) : (
            '-'
          )}
        </div>)
    },

    {
      title: (
        <Tooltip placement="topLeft" title="Per Day Target (Hours)">
          <span style={{ fontSize: '12px' }}>Office Timing</span>
        </Tooltip>
      ),
      dataIndex: 'perDayTargetMinwe',
      key: 'perDayTargetMinwe',
      render: (text, data) => (
        <div>
          {data.assignedShiftDetail ? (
            <>
              {data.assignedShiftDetail?.openingTime} -
              {data.assignedShiftDetail?.closingTime}
            </>
          ) : (
            '-'
          )}
        </div>)
    },
    {
      title: (
        <Tooltip placement="topLeft" title="Per Day Target (Hours)">
          <span style={{ fontSize: '12px' }}>Target (Hours)</span>
        </Tooltip>
      ),
      dataIndex: 'perDayTargetMin',
      key: 'perDayTargetMin',
      render: (text) => (text ?
        Math.floor(text / 60).toString().padStart(2, '0') + ':' +
        (text % 60).toString().padStart(2, '0')
        : '-'),
    },
    {
      title: (
        <Tooltip placement="topLeft" title="Total Employee Working (Hours)">
          <span style={{ fontSize: '12px' }}>Worked Hours</span>
        </Tooltip>
      ),
      dataIndex: 'totalEmployeWorkingMin',
      key: 'totalEmployeWorkingMin',
      render: (text) => (text ?
        Math.floor(text / 60).toString().padStart(2, '0') + ':' +
        (text % 60).toString().padStart(2, '0')
        : '-'),
    },

    {
      title: (
        <Tooltip placement="topLeft" title="Per Day Employee Pending (Hours)">
          <span style={{ fontSize: '12px' }}>Pending (Hours)</span>
        </Tooltip>
      ),
      dataIndex: 'perDayEmployPendingMin',
      key: 'perDayEmployPendingMin',
      render: (text) => (text ?
        Math.floor(text / 60).toString().padStart(2, '0') + ':' +
        (text % 60).toString().padStart(2, '0')
        : '-'),
    },
    {
      title: (
        <Tooltip placement="topLeft" title="Per Day Employee Overtime (Hours)">
          <span style={{ fontSize: '12px' }}>Overtime (Hours)</span>
        </Tooltip>
      ),
      dataIndex: 'perDayEmployOvertimeMin',
      key: 'perDayEmployOvertimeMin',
      render: (text) => (text ?
        Math.floor(text / 60).toString().padStart(2, '0') + ':' +
        (text % 60).toString().padStart(2, '0')
        : '-'),
    },
    {
      title: (
        <Tooltip placement="topLeft" title="Employee Per Day Salary">
          <span style={{ fontSize: '12px' }}>Per Day Salary</span>
        </Tooltip>
      ),
      dataIndex: 'salary.perDaySalary',
      render: (text, record) => (
        <div>{record.salary.perDaySalary !== null && record.salary.perDaySalary !== undefined
          ? record.salary.perDaySalary?.toFixed(2)
          : '-'}</div>
      ),
      key: 'salary.perDaySalary',
    },
   
    {
  title: (
    <Tooltip placement="topLeft" title="Difference between Total and Calculated Salary">
      <span style={{ fontSize: '12px' }}>Salary diffrence</span>
    </Tooltip>
  ),
  key: 'salaryDifference',
  render: (text, record) => {
   const employePerDaySalary = record.salary.perDaySalary;
   const perDaySalary = record.salary.employePerExtraDaySalary + record.salary.employePerDaySalary  

    if (
      employePerDaySalary !== null &&
      employePerDaySalary !== undefined &&
      perDaySalary !== null &&
      perDaySalary !== undefined&&
      perDaySalary !== 0  
    ) {
      const diff = perDaySalary - employePerDaySalary;
      const sign = diff > 0 ? '+' : diff < 0 ? '-' : '';
      return <div>{sign + Math.abs(diff).toFixed(2)}</div>;
    } else {
      return <div>-</div>;
    }
  },
},
    {
      title: (
        <Tooltip placement="topLeft" title="Total Per Day Salary">
          <span style={{ fontSize: '12px' }}>Total Salary</span>
        </Tooltip>
      ),
      dataIndex: 'salary.totalperDaySalary',
      key: 'salary.totalperDaySalary',
      render: (text, record) => (
        <div>{(record.salary.employePerExtraDaySalary + record.salary.employePerDaySalary)?.toFixed(2)}</div>
      ),
    },
  ];

  if (!isOpen) return null;
  return (
    <Modal
      title={`Payroll Data - ${payrolsalaryReportData?.employeId?.fullName} / ${dayjs(payrolsalaryReportData?.jsonData?.employeDayWiseReport?.date).format("MMMM")} / ${payrolsalaryReportData?.employeId?.email} `}
      visible={isOpen}
      onCancel={onClose}
      footer={null}
      className="antmodalclassName"
      width={1400}
    >
      <Table
        columns={columns}
        dataSource={payrolsalaryReportData?.jsonData?.employeDayWiseReport || []}
        rowKey="_id"
        pagination={false}
        size='small'
        bordered
        scroll={{ x: 'max-content' }}
        locale={{
          emptyText: 'Record Not Found',
        }}
        rowClassName={(record, index) => (index % 2 === 0 ? 'bg-[#e9ecef]/80' : 'bg-white')}
        summary={footer}
      />

    </Modal>
  );
};

export default PayrollDatafullList;
