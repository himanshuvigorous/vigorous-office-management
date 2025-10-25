import React from "react";
import HRMSDynamicTable from "./HRMSDynamicTable";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const HRMSAbsentTable = () => {
  const absentData = [
    { name: "John Doe", department: "Sales", date: "2024-12-02", reason: "Sick" },
    { name: "Jane Smith", department: "HR", date: "2024-12-02", reason: "Personal Leave" },
    { name: "James Lee", department: "Engineering", date: "2024-12-02", reason: "Medical Appointment" },
  ];

  const columns = [
    { title: "S.no.", 
      render: (row, rowIndex) => rowIndex + 1,
    },
    { title: "Employee Name", key: "name" },
    { title: "Department", key: "department" },
    { title: "Date", key: "date" },
    { title: "Reason", key: "reason" }
  ];

  return (
    <div className="container mx-auto p-2">
      <h2 className="text-2xl font-semibold text-gray-700 py-2 px-2">
        Absent Today
      </h2>
      <div className="container mx-auto p-2">
        <div className="max-w-full overflow-auto">
          <HRMSDynamicTable
            data={absentData}
            columns={columns}
            rowClassName="border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px]"
            headerClassName="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]"
          />
        </div>
      </div>
    </div>
  );
};

export default HRMSAbsentTable;
