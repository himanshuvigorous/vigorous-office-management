// import React, { useState, useEffect, useRef } from 'react';
// import { ImArrowUpRight2 } from "react-icons/im";
// import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
// import dayjs from 'dayjs';
// import { Modal, Card, Tag, Divider, Empty, Avatar, Space, Typography, Badge, Tooltip, Button } from 'antd';
// import {
//   CalendarOutlined,
//   TeamOutlined,
//   EnvironmentOutlined,
//   TrophyOutlined,
//   UserOutlined,
//   CloseOutlined,
//   PlusOutlined
// } from '@ant-design/icons';

// const { Text, Title } = Typography;

// const Calendar2 = ({ combinedData, currentDate, prevMonth, nextMonth, companyDashboardData, onAddEvent }) => {

//   const [selectedDate, setSelectedDate] = useState('');
//   const [hoveredDate, setHoveredDate] = useState(null);
//   const [isScrolling, setIsScrolling] = useState(false);
//   const modalRef = useRef(null);
//   const calendarRef = useRef(null);

//   // Get calendar date calculations
//   const year = currentDate?.getFullYear();
//   const month = currentDate?.getMonth();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const firstDayOfMonth = new Date(year, month, 1).getDay();
//   const prevMonthDays = new Date(year, month, 0).getDate();
  
//   // Calculate days to display
//   const prevMonthVisibleDays = Array.from({ length: firstDayOfMonth }, (_, i) => prevMonthDays - firstDayOfMonth + i + 1);
//   const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
//   const nextMonthVisibleDays = Array.from({ length: 42 - (prevMonthVisibleDays.length + currentMonthDays.length) }, (_, i) => i + 1);

//   // Handle date selection
//   const handleDateClick = (day, isCurrentMonth = true) => {
//     if (!isCurrentMonth) return;
    
//     const date = dayjs(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`).format('YYYY-MM-DD');
//     setSelectedDate(date);
//   };


//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         setSelectedDate('');
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);


//   useEffect(() => {
//     if (selectedDate) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'auto';
//     }
//     return () => {
//       document.body.style.overflow = 'auto';
//     };
//   }, [selectedDate]);


//   const hasEvents = (day) => {
//     const date = dayjs(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`).format('YYYY-MM-DD');
//     return combinedData.some(item => item.date === date);
//   };


//   // const eventCount = companyDashboardData?.calender?.eventData?.length ?? companyDashboardData?.eventData?.length ?? 0;
//   // const holidayCount = companyDashboardData?.calender?.holidayData?.length ?? companyDashboardData?.holidayData?.length ?? 0;
// const formattedMonth = String(month + 1).padStart(2, '0');
// const formattedYear = String(year);

// // Flatten data source
// // const calendarData = companyDashboardData?.calender || companyDashboardData || {};
//   const eventCount = (companyDashboardData?.eventData || []).filter(event => {
//   const eventDate = dayjs(event.startDate);
//   return eventDate.format('YYYY') === formattedYear && eventDate.format('MM') === formattedMonth;
// }).length;

// // Filter holidays for the current month
// const holidayCount = (companyDashboardData?.holidayData || []).filter(holiday => {
//   const holidayDate = dayjs(holiday.date);
//   return holidayDate.format('YYYY') === formattedYear && holidayDate.format('MM') === formattedMonth;
// }).length;

//   return (
//     <div className="w-full h-full relative bg-white rounded-xl p-4 shadow-sm" ref={calendarRef}>

//       <div className="flex justify-between items-center mb-4">
//         <Title level={4} className="!text-header !mb-0">Calendar</Title>
//         <div className="flex items-center gap-2">
//           <Text className="text-base font-medium text-gray-800">
//             {currentDate?.toLocaleString('default', { month: 'long' })} {year}
//           </Text>
//           <div className="flex gap-1">
//             <Tooltip placement="topLeft"  title="Previous month">
//               <Button 
//                 shape="circle" 
//                 icon={<FaAngleLeft size={14} />} 
//                 onClick={prevMonth} 
//                 size="small"
//                 className="flex items-center justify-center"
//               />
//             </Tooltip>
//             <Tooltip placement="topLeft"  title="Next month">
//               <Button 
//                 shape="circle" 
//                 icon={<FaAngleRight size={14} />} 
//                 onClick={nextMonth} 
//                 size="small"
//                 className="flex items-center justify-center"
//               />
//             </Tooltip>
//           </div>
//         </div>
//       </div>

 
//       <div className="grid grid-cols-7 gap-1 mb-4">

//         {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
//           <div key={day} className="text-center font-medium text-sm text-gray-500 py-1">
//             {day}
//           </div>
//         ))}


//         {prevMonthVisibleDays.map(day => (
//           <div 
//             key={`prev-${day}`} 
//             className="h-10 w-10 flex items-center justify-center text-sm text-gray-300 cursor-default"
//           >
//             {day}
//           </div>
//         ))}

  
//         {currentMonthDays.map(day => {
//           const date = dayjs(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`).format('YYYY-MM-DD');
//           const isToday = date === dayjs().format('YYYY-MM-DD');
//           const hasData = combinedData.some(item => item.date === date);
          
//           return (
//             <Tooltip placement="topLeft"  
//               key={day} 
//               title={hasData ? `${combinedData.find(d => d.date === date)?.events?.length || 0} events, ${combinedData.find(d => d.date === date)?.holidays?.length || 0} holidays` : null}
//             >
//               <div 
//                 className={`relative h-8 w-8 mx-auto flex items-center justify-center text-sm rounded-full transition-all duration-200
//                   ${isToday ? 'border-2 border-blue-500' : ''}
//                   ${hasData ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}
//                   ${hoveredDate === date ? 'scale-110 shadow-md' : 'hover:bg-gray-100 cursor-pointer'}
//                 `}
//                 onClick={() => handleDateClick(day)}
//                 onMouseEnter={() => setHoveredDate(date)}
//                 onMouseLeave={() => setHoveredDate(null)}
//               >
//                 {day}
//                 {hasData && (
//                   <div className="absolute -bottom-1 flex gap-1">
//                     {combinedData.find(d => d.date === date)?.events?.length > 0 && (
//                       <span className="w-1 h-1 rounded-full bg-blue-500"></span>
//                     )}
//                     {combinedData.find(d => d.date === date)?.holidays?.length > 0 && (
//                       <span className="w-1 h-1 rounded-full bg-yellow-500"></span>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </Tooltip>
//           );
//         })}

//         {/* Next month days */}
//         {nextMonthVisibleDays.map(day => (
//           <div 
//             key={`next-${day}`} 
//             className="h-10 w-10 flex items-center justify-center text-sm text-gray-300 cursor-default"
//           >
//             {day}
//           </div>
//         ))}
//       </div>

//       {/* Stats Section */}
//       <div className="grid grid-cols-2 gap-3 mt-4">
//         <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="w-3 h-3 rounded-full bg-blue-500"></div>
//             <Text className="text-sm">Events</Text>
//           </div>
//           <Text strong className="text-sm">{eventCount}</Text>
//         </div>
//         <div className="bg-yellow-50 rounded-sm p-3 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
//             <Text className="text-sm">Holidays</Text>
//           </div>
//           <Text strong className="text-sm">{holidayCount}</Text>
//         </div>
//       </div>

//       {/* Event/Holiday Modal */}
//       <Modal
//         title={null}
//         open={!!selectedDate}
//         onCancel={() => setSelectedDate('')}
//         footer={null}
//         width={800}
//         closeIcon={<CloseOutlined className="text-gray-500" />}
//         className="calendar-modal"
//         bodyStyle={{ padding: 0 }}
//       >
//         <div ref={modalRef} className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <Title level={4} className="!mb-0">
//               {dayjs(selectedDate).format('MMMM D, YYYY')}
//             </Title>
            
//           </div>

//           {combinedData?.find(data => data?.date === selectedDate) ? (
//             <div className="space-y-6">
//               {/* Events Section */}
//               <div>
//                 <Divider orientation="left" className="!text-base !font-medium !mb-4">
//                   <Space>
//                     <CalendarOutlined style={{ color: '#1890ff' }} />
//                     <Text>Events</Text>
//                     <Badge 
//                       count={combinedData.find(data => data.date === selectedDate)?.events?.length || 0} 
//                       color="#1890ff" 
//                       className="ml-2" 
//                     />
//                   </Space>
//                 </Divider>

//                 {combinedData.find(data => data.date === selectedDate)?.events?.length > 0 ? (
//                   <div className="grid grid-cols-1 gap-3">
//                     {combinedData.find(data => data.date === selectedDate).events.map((event) => (
//                       <Card
//                         key={event.id}
//                         className="hover:shadow-md transition-shadow"
//                         size="small"
//                       >
//                         <div className="space-y-2">
//                           <div className="flex justify-between items-start">
//                             <Text strong className="text-base">{event.title}</Text>
//                             {event.time && (
//                               <Tag color="blue">{event.time}</Tag>
//                             )}
//                           </div>
                          
//                           {event.description && (
//                             <Text type="secondary" className="block">
//                               {event.description}
//                             </Text>
//                           )}
                          
//                           {event.location && (
//                             <div className="flex items-center text-sm text-gray-600">
//                               <EnvironmentOutlined className="mr-1" />
//                               <Text>{event.location}</Text>
//                             </div>
//                           )}
                          
//                           {event.attendees?.length > 0 && (
//                             <>
//                               <Divider dashed className="!my-2" />
//                               <div className="space-y-2">
//                                 <Text type="secondary" className="flex items-center text-sm">
//                                   <TeamOutlined className="mr-1" />
//                                   Attendees ({event.attendees.length})
//                                 </Text>
//                                 <div className="flex flex-wrap gap-2">
//                                   {event.attendees.map(attendee => (
//                                     <Tooltip placement="topLeft"  
//                                       key={attendee.email} 
//                                       title={`${attendee.name} (${attendee.status})`}
//                                     >
//                                       <Badge 
//                                         dot 
//                                         color={attendee.status === 'confirmed' ? 'green' : 'orange'}
//                                         offset={[-5, 5]}
//                                       >
//                                         <Avatar 
//                                           size="small" 
//                                           src={attendee.avatar} 
//                                           icon={<UserOutlined />}
//                                           className="cursor-pointer"
//                                         />
//                                       </Badge>
//                                     </Tooltip>
//                                   ))}
//                                 </div>
//                               </div>
//                             </>
//                           )}
//                         </div>
//                       </Card>
//                     ))}
//                   </div>
//                 ) : (
//                   <Empty
//                     image={Empty.PRESENTED_IMAGE_SIMPLE}
//                     description="No events scheduled"
//                     className="py-8"
//                   />
//                 )}
//               </div>

//               {/* Holidays Section */}
//               <div>
//                 <Divider orientation="left" className="!text-base !font-medium !mb-4">
//                   <Space>
//                     <TrophyOutlined style={{ color: '#faad14' }} />
//                     <Text>Holidays</Text>
//                     <Badge 
//                       count={combinedData.find(data => data.date === selectedDate)?.holidays?.length || 0} 
//                       color="#faad14" 
//                       className="ml-2" 
//                     />
//                   </Space>
//                 </Divider>

//                 {combinedData.find(data => data.date === selectedDate)?.holidays?.length > 0 ? (
//                   <div className="grid grid-cols-1 gap-3">
//                     {combinedData.find(data => data.date === selectedDate).holidays.map((holiday) => (
//                       <Card
//                         key={holiday.id}
//                         className="border-l-4 border-yellow-400 hover:shadow-md transition-shadow"
//                         size="small"
//                       >
//                         <div className="flex items-start gap-3">
//                           <Avatar 
//                             icon={<TrophyOutlined />} 
//                             style={{ backgroundColor: '#faad14' }} 
//                             className="mt-1"
//                           />
//                           <div>
//                             <Text strong className="block">{holiday.name}</Text>
//                             {holiday.description && (
//                               <Text type="secondary" className="text-sm">
//                                 {holiday.description}
//                               </Text>
//                             )}
//                           </div>
//                         </div>
//                       </Card>
//                     ))}
//                   </div>
//                 ) : (
//                   <Empty
//                     image={Empty.PRESENTED_IMAGE_SIMPLE}
//                     description="No holidays"
//                     className="py-8"
//                   />
//                 )}
//               </div>
//             </div>
//           ) : (
//             <Empty
//               description={
//                 <div className="space-y-4 py-8">
//                   <Text className="block">No events or holidays on this day</Text>
                 
//                 </div>
//               }
//             />
//           )}
//         </div>
//       </Modal>

//       {/* Custom Styles */}
//       <style jsx global>{`
//         .calendar-modal .ant-modal-content {
//           border-radius: 12px;
//           overflow: hidden;
//         }
        
//         .calendar-modal .ant-modal-header {
//           border-bottom: none;
//           padding-bottom: 0;
//         }
        
//         .calendar-modal .ant-modal-body {
//           padding: 0;
//         }
        
//         .calendar-modal .ant-card {
//           border-radius: 8px;
//         }
        
//         .calendar-modal .ant-card-small > .ant-card-body {
//           padding: 12px 16px;
//         }
        
//         @media (max-width: 768px) {
//           .calendar-modal {
//             width: 95% !important;
//             max-width: 100%;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Calendar2;


import React, { useState, useEffect, useRef } from 'react';
import { ImArrowUpRight2 } from "react-icons/im";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import dayjs from 'dayjs';
import { Modal, Card, Tag, Divider, Empty, Avatar, Space, Typography, Badge, Tooltip, Button } from 'antd';
import {
  CalendarOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
  UserOutlined,
  CloseOutlined,
  PlusOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

const Calendar2 = ({ combinedData, currentDate, prevMonth, nextMonth, companyDashboardData, onAddEvent }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [hoveredDate, setHoveredDate] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const modalRef = useRef(null);
  const calendarRef = useRef(null);

  // Array to mark specific Saturdays (1-5) as off days
  const offSaturdays = [2, 4]; // This can be made dynamic later

  // Get calendar date calculations
  const year = currentDate?.getFullYear();
  const month = currentDate?.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const prevMonthDays = new Date(year, month, 0).getDate();
  
  // Calculate days to display
  const prevMonthVisibleDays = Array.from({ length: firstDayOfMonth }, (_, i) => prevMonthDays - firstDayOfMonth + i + 1);
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const nextMonthVisibleDays = Array.from({ length: 42 - (prevMonthVisibleDays.length + currentMonthDays.length) }, (_, i) => i + 1);

  // Check if a date is a Sunday
  const isSunday = (day) => {
    const date = new Date(year, month, day);
    return date.getDay() === 0;
  };

  // Check if a date is a Saturday marked as off day
  const isOffSaturday = (day) => {
    const date = new Date(year, month, day);
    // if (date.getDay() === 6) { // Saturday
    //   const weekOfMonth = Math.ceil(day / 7);
    //   return offSaturdays.includes(weekOfMonth);
    // }
    return false;
  };

  // Handle date selection
  const handleDateClick = (day, isCurrentMonth = true) => {
    if (!isCurrentMonth) return;
    
    const date = dayjs(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`).format('YYYY-MM-DD');
    setSelectedDate(date);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSelectedDate('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedDate]);

  const hasEvents = (day) => {
    const date = dayjs(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`).format('YYYY-MM-DD');
    return combinedData.some(item => item.date === date);
  };

  const formattedMonth = String(month + 1).padStart(2, '0');
  const formattedYear = String(year);

  const eventCount = (companyDashboardData?.eventData || []).filter(event => {
    const eventDate = dayjs(event.startDate);
    return eventDate.format('YYYY') === formattedYear && eventDate.format('MM') === formattedMonth;
  }).length;

  const holidayCount = (companyDashboardData?.holidayData || []).filter(holiday => {
    const holidayDate = dayjs(holiday.date);
    return holidayDate.format('YYYY') === formattedYear && holidayDate.format('MM') === formattedMonth;
  }).length;

  return (
    <div className="w-full h-full relative bg-white rounded-xl p-4 shadow-sm" ref={calendarRef}>
      <div className="flex justify-between items-center mb-4">
        <Title level={4} className="!text-header !mb-0">Calendar</Title>
        <div className="flex items-center gap-2">
          <Text className="text-base font-medium text-gray-800">
            {currentDate?.toLocaleString('default', { month: 'long' })} {year}
          </Text>
          <div className="flex gap-1">
            <Tooltip placement="topLeft" title="Previous month">
              <Button 
                shape="circle" 
                icon={<FaAngleLeft size={14} />} 
                onClick={prevMonth} 
                size="small"
                className="flex items-center justify-center"
              />
            </Tooltip>
            <Tooltip placement="topLeft" title="Next month">
              <Button 
                shape="circle" 
                icon={<FaAngleRight size={14} />} 
                onClick={nextMonth} 
                size="small"
                className="flex items-center justify-center"
              />
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="text-center font-medium text-sm text-gray-500 py-1">
            {day}
          </div>
        ))}

        {prevMonthVisibleDays.map(day => (
          <div 
            key={`prev-${day}`} 
            className="h-10 w-10 flex items-center justify-center text-sm text-gray-300 cursor-default"
          >
            {day}
          </div>
        ))}

        {currentMonthDays.map(day => {
          const date = dayjs(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`).format('YYYY-MM-DD');
          const isToday = date === dayjs().format('YYYY-MM-DD');
          const hasData = combinedData.some(item => item.date === date);
          const sunday = isSunday(day);
          const offSaturday = isOffSaturday(day);
          
          return (
            <Tooltip 
              placement="topLeft"  
              key={day} 
              title={
                sunday ? "Sunday" : 
                offSaturday ? "Off Saturday" : 
                hasData ? `${combinedData.find(d => d.date === date)?.events?.length || 0} events, ${combinedData.find(d => d.date === date)?.holidays?.length || 0} holidays` : null
              }
            >
              <div 
                className={`relative h-8 w-8 mx-auto flex items-center justify-center text-sm rounded-full transition-all duration-200
                  ${isToday ? 'border-2 border-blue-500' : ''}
                  ${hasData ? 'bg-blue-50 text-blue-600 font-medium' : ''}
                  ${sunday ? 'bg-red-50 text-red-500' : ''}
                  ${offSaturday ? 'bg-orange-50 text-orange-500' : ''}
                  ${!hasData && !sunday && !offSaturday ? 'text-gray-700' : ''}
                  ${hoveredDate === date ? 'scale-110 shadow-md' : 'hover:bg-gray-100 cursor-pointer'}
                `}
                onClick={() => handleDateClick(day)}
                onMouseEnter={() => setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                {day}
                {/* {hasData && (
                  <div className="absolute -bottom-1 flex gap-1">
                    {combinedData.find(d => d.date === date)?.events?.length > 0 && (
                      <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                    )}
                    {combinedData.find(d => d.date === date)?.holidays?.length > 0 && (
                      <span className="w-1 h-1 rounded-full bg-yellow-500"></span>
                    )}
                  </div>
                )}
                {(sunday || offSaturday) && !hasData && (
                  <div className="absolute -bottom-1 flex gap-1">
                    <span className={`w-1 h-1 rounded-full ${sunday ? 'bg-red-500' : 'bg-orange-500'}`}></span>
                  </div>
                )} */}
              </div>
            </Tooltip>
          );
        })}

        {nextMonthVisibleDays.map(day => (
          <div 
            key={`next-${day}`} 
            className="h-10 w-10 flex items-center justify-center text-sm text-gray-300 cursor-default"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <Text className="text-sm">Events</Text>
          </div>
          <Text strong className="text-sm">{eventCount}</Text>
        </div>
        <div className="bg-yellow-50 rounded-sm p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <Text className="text-sm">Holidays</Text>
          </div>
          <Text strong className="text-sm">{holidayCount}</Text>
        </div>
      </div>

      {/* Legend Section */}
      {/* <div className="mt-4 flex flex-wrap gap-2">
        <div className="flex items-center gap-1 text-xs">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span>Sunday</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <span className="w-3 h-3 rounded-full bg-orange-500"></span>
          <span>Off Saturday</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          <span>Event</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span>Holiday</span>
        </div>
      </div> */}

      {/* Event/Holiday Modal */}
        {/* Event/Holiday Modal */}
        <Modal
        title={null}
        open={!!selectedDate}
        onCancel={() => setSelectedDate('')}
        footer={null}
        width={800}
        closeIcon={<CloseOutlined className="text-gray-500" />}
        className="calendar-modal"
        bodyStyle={{ padding: 0 }}
      >
        <div ref={modalRef} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Title level={4} className="!mb-0">
              {dayjs(selectedDate).format('MMMM D, YYYY')}
            </Title>
            
          </div>

          {combinedData?.find(data => data?.date === selectedDate) ? (
            <div className="space-y-6">
              {/* Events Section */}
              <div>
                <Divider orientation="left" className="!text-base !font-medium !mb-4">
                  <Space>
                    <CalendarOutlined style={{ color: '#1890ff' }} />
                    <Text>Events</Text>
                    <Badge 
                      count={combinedData.find(data => data.date === selectedDate)?.events?.length || 0} 
                      color="#1890ff" 
                      className="ml-2" 
                    />
                  </Space>
                </Divider>

                {combinedData.find(data => data.date === selectedDate)?.events?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {combinedData.find(data => data.date === selectedDate).events.map((event) => (
                      <Card
                        key={event.id}
                        className="hover:shadow-md transition-shadow"
                        size="small"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <Text strong className="text-base">{event.title}</Text>
                            {event.time && (
                              <Tag color="blue">{event.time}</Tag>
                            )}
                          </div>
                          
                          {event.description && (
                            <Text type="secondary" className="block">
                              {event.description}
                            </Text>
                          )}
                          
                          {event.location && (
                            <div className="flex items-center text-sm text-gray-600">
                              <EnvironmentOutlined className="mr-1" />
                              <Text>{event.location}</Text>
                            </div>
                          )}
                          
                          {event.attendees?.length > 0 && (
                            <>
                              <Divider dashed className="!my-2" />
                              <div className="space-y-2">
                                <Text type="secondary" className="flex items-center text-sm">
                                  <TeamOutlined className="mr-1" />
                                  Attendees ({event.attendees.length})
                                </Text>
                                <div className="flex flex-wrap gap-2">
                                  {event.attendees.map(attendee => (
                                    <Tooltip placement="topLeft"  
                                      key={attendee.email} 
                                      title={`${attendee.name} (${attendee.status})`}
                                    >
                                      <Badge 
                                        dot 
                                        color={attendee.status === 'confirmed' ? 'green' : 'orange'}
                                        offset={[-5, 5]}
                                      >
                                        <Avatar 
                                          size="small" 
                                          src={attendee.avatar} 
                                          icon={<UserOutlined />}
                                          className="cursor-pointer"
                                        />
                                      </Badge>
                                    </Tooltip>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No events scheduled"
                    className="py-8"
                  />
                )}
              </div>

              {/* Holidays Section */}
              <div>
                <Divider orientation="left" className="!text-base !font-medium !mb-4">
                  <Space>
                    <TrophyOutlined style={{ color: '#faad14' }} />
                    <Text>Holidays</Text>
                    <Badge 
                      count={combinedData.find(data => data.date === selectedDate)?.holidays?.length || 0} 
                      color="#faad14" 
                      className="ml-2" 
                    />
                  </Space>
                </Divider>

                {combinedData.find(data => data.date === selectedDate)?.holidays?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {combinedData.find(data => data.date === selectedDate).holidays.map((holiday) => (
                      <Card
                        key={holiday.id}
                        className="border-l-4 border-yellow-400 hover:shadow-md transition-shadow"
                        size="small"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar 
                            icon={<TrophyOutlined />} 
                            style={{ backgroundColor: '#faad14' }} 
                            className="mt-1"
                          />
                          <div>
                            <Text strong className="block">{holiday.name}</Text>
                            {holiday.description && (
                              <Text type="secondary" className="text-sm">
                                {holiday.description}
                              </Text>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No holidays"
                    className="py-8"
                  />
                )}
              </div>
            </div>
          ) : (
            <Empty
              description={
                <div className="space-y-4 py-8">
                  <Text className="block">No events or holidays on this day</Text>
                 
                </div>
              }
            />
          )}
        </div>
      </Modal>

      {/* Custom Styles */}
      <style jsx global>{`
        .calendar-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }
        
        .calendar-modal .ant-modal-header {
          border-bottom: none;
          padding-bottom: 0;
        }
        
        .calendar-modal .ant-modal-body {
          padding: 0;
        }
        
        .calendar-modal .ant-card {
          border-radius: 8px;
        }
        
        .calendar-modal .ant-card-small > .ant-card-body {
          padding: 12px 16px;
        }
        
        @media (max-width: 768px) {
          .calendar-modal {
            width: 95% !important;
            max-width: 100%;
          }
        }
      `}</style>
      {/* ... (keep the existing modal code unchanged) ... */}
    </div>
  );
};

export default Calendar2;