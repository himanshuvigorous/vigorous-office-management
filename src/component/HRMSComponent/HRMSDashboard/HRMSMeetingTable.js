import React from "react";
import HRMSDynamicTable from "./HRMSDynamicTable";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const MeetingTable = () => {
  const meetingData = [
    { title: "Team Sync", date: "2024-12-05", time: "10:00 AM" },
    { title: "Project Discussion", date: "2024-12-01", time: "3:00 PM" },
    { title: "Client Call", date: "2024-12-03", time: "11:00 AM" },
    { title: "Sprint Planning", date: "2024-12-07", time: "9:00 AM" },
    { title: "Budget Review", date: "2024-12-02", time: "1:00 PM" },
  ];


  const columns = [
    { title: "S.no.", 
         render: (row,rowIndex) => (
        rowIndex + 1
      ), },
    { title: "Meeting Title", key: "title" },
    { title: "Meeting Date", key: "date" },
    { title: "Meeting Time", key: "time" },
    {
        title: "Actions",
        render: (row) => (
          <div>
            <button
              className="text-blue-500 hover:text-blue-700 mr-2"
            >
              <FaEdit />
            </button>
            <button
              className="text-red-500 hover:text-red-700"
            >
              <MdDelete />
            </button>
          </div>
        ),
      },
  ];

  return (
    <div className="container mx-auto p-2">
      <h2 className="text-2xl font-semibold text-gray-700 py-2 px-2">
        Meetings
      </h2>
      <div className="container mx-auto p-2">
        <div className="max-w-full overflow-auto">
          <HRMSDynamicTable
            data={meetingData}
            columns={columns}
            rowClassName="border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px]"
            headerClassName="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]"
          />
        </div>
      </div>
    </div>
  );
};

export default MeetingTable;
