import React from 'react';
import { Modal } from 'antd';
import { convertMinutesToHoursAndMinutes } from '../../../constents/global';
import dayjs from 'dayjs';
import moment from 'moment';

const AttendanceDataModal = ({ isOpen, onClose, modalData }) => {
  if (!isOpen || !modalData) return null;

  const dayData = modalData.DayData;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      title={
        <div className="text-sm md:text-lg font-semibold text-header">
          Attendance Details - ({moment(dayData?.date)?.format("MMMM")})
        </div>
      }
      width={800}
      bodyStyle={{ maxHeight: '60vh', overflowY: 'auto', padding: '16px' }}
      centered
    >
      {/* Employee Information Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-header mb-3">Employee Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div><strong>Name:</strong> {modalData.employee.employeeName}</div>
          <div><strong>Total Present Days:</strong> {modalData.employee.totalPresent}</div>
          <div><strong>Total Absent Days:</strong> {modalData.employee.totalAbsent}</div>
          <div><strong>Total Leaves:</strong> {modalData.employee.totalLeaves}</div>
          <div><strong>First Half Days:</strong> {modalData.employee.firstHalfDay}</div>
          <div><strong>Second Half Days:</strong> {modalData.employee.secondHalfDay}</div>
        </div>
      </div>

      {/* Day Data Section */}
      <div>
        <h3 className="text-lg font-semibold text-header mb-3">
          Day {dayData.day} - {moment(dayData?.date).format("DD/MM/YYYY")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="capitalize"><strong>Status:</strong> {dayData.isPresentDay}</div>
          <div>
            <strong>Check-in Time:</strong> {
              (dayData?.checkInTime && dayData?.checkInTime !== "-")
                ? dayjs(dayData?.checkInTime).format('hh:mm A')
                : "-"
            }
          </div>
          <div>
            <strong>Check-out Time:</strong> {
              (dayData?.checkOutTime && dayData?.checkOutTime !== "-")
                ? dayjs(dayData?.checkOutTime).format('hh:mm A')
                : "-"
            }
          </div>
          <div>
            <strong>Worked Hours:</strong> {
              dayData?.workedHRS ? convertMinutesToHoursAndMinutes(dayData?.workedHRS ?? 0) : "-"
            }
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AttendanceDataModal;
