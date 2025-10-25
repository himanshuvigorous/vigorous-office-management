import React from 'react';
import { useSelector } from 'react-redux';
import { encrypt } from '../../config/Encryption';

// Removed Pending, Rejected, Assigned, re_start, re_assigned, request_rejected
const EXCLUDED_STATUSES = ['Pending', 'Rejected', 'Assigned', 're_start', 're_assigned', 'request_rejected'];

const STATUS_DISPLAY_NAMES = {
  Completed: 'Completed',
  Task_Stop: 'Task Stopped',
  Accepted: 'Accepted',
  reAssign_to_other: 'Reassigned to Other',
  Pending_at_client: 'Pending at Client',
  Pending_at_department: 'Pending at Department',
  Pending_at_colleague: 'Pending at Colleague',
  Pending_at_manager: 'Pending at Manager',
  Work_in_progress: 'Work in Progress',
  Pending_for_fees: 'Pending for Fees',
  Pending_for_approval: 'Pending for Approval',
};

const STATUS_COLORS = {
  Completed: 'bg-green-500',
  Task_Stop: 'bg-red-500',
  Accepted: 'bg-blue-500',
  reAssign_to_other: 'bg-orange-500',
  Pending_at_client: 'bg-teal-500',
  Pending_at_department: 'bg-cyan-500',
  Pending_at_colleague: 'bg-lime-500',
  Pending_at_manager: 'bg-amber-500',
  Work_in_progress: 'bg-sky-500',
  Pending_for_fees: 'bg-rose-500',
  Pending_for_approval: 'bg-purple-500',
};

const STATUS_ICONS = {
  Completed: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Task_Stop: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Accepted: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  reAssign_to_other: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
  Pending_at_client: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Pending_at_department: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-4 0H9m4 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10m4 0h4m-4 0H3m4 0v4" />
    </svg>
  ),
  Pending_at_colleague: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Pending_at_manager: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Work_in_progress: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Pending_for_fees: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Pending_for_approval: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
};

const QuickLinksSectionManager = ({center="manager-task-list"}) => {
  const { sidebarListData } = useSelector((state) => state.dynamicSidebar);
  const managerTaskListId = sidebarListData?.find(data => data?.slug ===center )?._id;

  const quickLinks = Object.keys(STATUS_DISPLAY_NAMES)
    .filter((status) => !EXCLUDED_STATUSES.includes(status))
    .map((status) => ({
      title: STATUS_DISPLAY_NAMES[status],
      icon: STATUS_ICONS[status],
      color: STATUS_COLORS[status] || 'bg-gray-500',
      url: `/admin/${center}/${encrypt(managerTaskListId)}?status=${status}`,
    }));

  return (
    <div className="relative rounded-xl bg-white px-4 py-4 my-2 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-800 text-lg">Quick Task Access</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
        {quickLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            className="flex flex-col items-center p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:shadow-md group border border-gray-100"
          >
            <div className={`p-3 rounded-full ${link.color} bg-opacity-10 group-hover:bg-opacity-20 mb-2 transition-all duration-200`}>
              <div className={`${link.color.replace('bg-', 'text-')}`}>
                {link.icon}
              </div>
            </div>
            <span className="text-xs font-medium text-gray-700 text-center group-hover:text-blue-600 leading-tight">
              {link.title}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuickLinksSectionManager;