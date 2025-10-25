import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons

const LeaveDataModuleDashboard = ({ leaveDashboardData }) => {
  const [expandedBranchIndex, setExpandedBranchIndex] = useState(null);
  const [expandedEmployeeIndex, setExpandedEmployeeIndex] = useState(null);

  const toggleBranch = (index) => {
    setExpandedBranchIndex(expandedBranchIndex === index ? null : index);
  };

  const toggleEmployee = (index) => {
    setExpandedEmployeeIndex(expandedEmployeeIndex === index ? null : index);
  };

  // Function to get background color based on status
  const getStatusBgColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-teal-500 text-white';  // Teal offers a fresh and professional green tone
      case 'Rejected':
        return 'bg-red-600 text-white';   // A deeper red gives a serious tone for rejection
      case 'Pending':
        return 'bg-amber-500 text-white'; // Amber is a warmer, more neutral yellow for pending
      case 'Cancelled':
        return 'bg-slate-500 text-white'; // Slate gray is a bit softer than basic gray for cancellation
      default:
        return 'bg-zinc-200 text-zinc-800'; // Light zinc gray for unclassified statuses
    }
  };

  return (
    <div className="p-4 max-w-full mx-auto">
      <div className='my-4 font-semibold text-center text-lg'>Leave Requests</div>
      {leaveDashboardData?.leaveReq?.map((branch, branchIndex) => (
        <div className="mb-6 bg-white shadow-sm rounded-lg text-xs overflow-hidden" key={branchIndex}>
          <div className="overflow-x-auto">
            {/* Branch Header */}
            <div className="grid grid-cols-8 gap-4 bg-header text-white p-2">
              <div className="col-span-1 text-center">Branch</div>
              <div className="col-span-1 text-center">Total</div>
              <div className="col-span-1 text-center">Pending</div>
              <div className="col-span-1 text-center">Approved</div>
              <div className="col-span-1 text-center">Rejected</div>
              <div className="col-span-1 text-center">Cancelled</div>
              <div className="col-span-1 text-center">Employees</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            {/* Branch Row */}
            <div className="grid grid-cols-8 gap-4 border-b cursor-pointer hover:bg-gray-100 p-2" onClick={() => toggleBranch(branchIndex)}>
              <div className="col-span-1 text-left pl-4">{branch.branchName}</div>
              <div className="col-span-1 text-center">{branch.totalRequests}</div>
              <div className="col-span-1 text-center">{branch.pendingRequests}</div>
              <div className="col-span-1 text-center">{branch.approvedRequests}</div>
              <div className="col-span-1 text-center">{branch.rejectedRequests}</div>
              <div className="col-span-1 text-center">{branch.cancelledRequests}</div>
              <div className="col-span-1 text-center">{branch.totalEmployees}</div>
              <div className="col-span-1 text-center">
                <button
                  className="text-xs py-1 px-2 bg-header text-white rounded-sm hover:bg-header transition duration-200"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row toggle
                    toggleBranch(branchIndex);
                  }}
                >
                  {expandedBranchIndex === branchIndex ? (
                    <FaChevronUp size={12} />
                  ) : (
                    <FaChevronDown size={12} />
                  )}
                </button>
              </div>
            </div>

            {/* Nested Employee Data */}
            {expandedBranchIndex === branchIndex &&
              branch.employeData.map((employee, employeeIndex) => (
                <React.Fragment key={employeeIndex}>
                  {/* Employee Header */}
                  <div className="grid grid-cols-8 gap-4 bg-gray-200 p-2">
                    <div className="col-span-1 text-center">Employee</div>
                    <div className="col-span-1 text-center">Total</div>
                    <div className="col-span-1 text-center">Pending</div>
                    <div className="col-span-1 text-center">Approved</div>
                    <div className="col-span-1 text-center">Rejected</div>
                    <div className="col-span-1 text-center">Cancelled</div>
                    <div className="col-span-1 text-center">Employees</div>
                    <div className="col-span-1 text-center">Action</div>
                  </div>
                  
                  {/* Employee Row */}
                  <div className="grid grid-cols-8 gap-4 border-b cursor-pointer hover:bg-gray-100 p-2" onClick={() => toggleEmployee(employeeIndex)}>
                    <div className="col-span-1 text-center">{employee.employeName}</div>
                    <div className="col-span-1 text-center">{employee.totalRequests}</div>
                    <div className="col-span-1 text-center">{employee.pendingRequests}</div>
                    <div className="col-span-1 text-center">{employee.approvedRequests}</div>
                    <div className="col-span-1 text-center">{employee.rejectedRequests}</div>
                    <div className="col-span-1 text-center">{employee.cancelledRequests}</div>
                    <div className="col-span-1 text-center"></div>
                    <div className="col-span-1 text-center">
                      <button
                        className="text-xs py-1 px-2 bg-green-500 text-white rounded-sm hover:bg-green-700 transition duration-200"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row toggle
                          toggleEmployee(employeeIndex);
                        }}
                      >
                        {expandedEmployeeIndex === employeeIndex ? (
                          <FaEyeSlash size={12} />
                        ) : (
                          <FaEye size={12} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Nested Employee Requests - New Grid Layout */}
                  {expandedEmployeeIndex === employeeIndex && (
                    <div className="grid grid-cols-4 gap-4 bg-gray-100 p-2">
                      <div className="col-span-1 text-center">Start Date</div>
                      <div className="col-span-1 text-center">End Date</div>
                      <div className="col-span-1 text-center">Reason</div>
                      <div className="col-span-1 text-center">Status</div>
                    </div>
                  )}

                  {/* Request Details */}
                  {expandedEmployeeIndex === employeeIndex &&
                    employee.requests.map((request, requestIndex) => (
                      <div
                        key={requestIndex}
                        className={`grid grid-cols-4 gap-4 p-2 ${getStatusBgColor(request.status)} hover:bg-opacity-80`}
                      >
                        <div className="col-span-1 text-center">
                          {new Date(request.startDate).toLocaleDateString()}
                        </div>
                        <div className="col-span-1 text-center">
                          {new Date(request.endDate).toLocaleDateString()}
                        </div>
                        <div className="col-span-1 text-center">{request.reason}</div>
                        <div className="col-span-1 text-center">{request.status}</div>
                      </div>
                    ))}
                </React.Fragment>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaveDataModuleDashboard;
