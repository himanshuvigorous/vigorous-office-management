import React, { useState, useEffect, useRef } from 'react';
import { ImArrowUpRight2 } from "react-icons/im";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import dayjs from 'dayjs';
import { Modal, Card, Tag, Divider, Empty, Avatar, Space, Typography } from 'antd';
import {
  CalendarOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const Calendar = ({ combinedData, currentDate, prevMonth, nextMonth, companyDashboardData }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();
  const year = currentDate?.getFullYear();
  const month = currentDate?.getMonth();
  const daysInMonth = getDaysInMonth(month, year);
  const firstDayOfMonth = getFirstDayOfMonth(month, year);

  const prevMonthDays = getDaysInMonth(month - 1, year);
  const prevMonthVisibleDays = Array.from({ length: firstDayOfMonth }, (_, i) => prevMonthDays - firstDayOfMonth + i + 1);
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const nextMonthVisibleDays = Array.from({ length: 42 - (prevMonthVisibleDays.length + currentMonthDays.length) }, (_, i) => i + 1);




  const handleDateClick = (day) => {
    const date = dayjs(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`).format('YYYY-MM-DD');
    setSelectedDate(date);
  };



  return (
    <div className="w-full h-full relative bg-[#FFFFFF] rounded-xl px-3 py-2.5">
      <p className="text-left text-[20px] font-[500] text-header"> Calendar</p>
      <div className="flex justify-between items-center pr-4 mb-2">
        <div className="xl:text-[16px] font-[400] text-sm text-black">{currentDate?.toLocaleString('default', { month: 'long' })} {year}</div>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1 rounded bg-gray-200"><FaAngleLeft /></button>
          <button onClick={nextMonth} className="p-1 rounded bg-gray-200"><FaAngleRight /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-left font-[400] text-[12px] text-[#87888A]">
            {day}
          </div>
        ))}

        {prevMonthVisibleDays.map(day => (
          <div key={`prev-${day}`} className="h-8 w-8 p-1 flex items-center justify-center text-[12px] text-[#C3C4C4]">
            {day}
          </div>
        ))}

        {currentMonthDays.map(day => {
          const date = dayjs(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`).format('YYYY-MM-DD');
          return (
            <div key={day} className={`h-auto w-[38px] p-1 flex items-center ${combinedData.some(item => item.date === date) && "bg-header text-white"} justify-center text-[13px] rounded `} onClick={() => handleDateClick(day)}>
              <span >{day}</span>
            </div>
          );
        })}

        {nextMonthVisibleDays.map(day => (
          <div key={`next-${day}`} className="h-auto w-[38px] p-1 flex items-center justify-center text-[12px] text-[#C3C4C4]">
            {day}
          </div>
        ))}
      </div>
      <Modal
        title={`Events & Holidays - ${selectedDate}`}
        open={!!selectedDate}
        onCancel={() => setSelectedDate('')}
        footer={null}
        width={800}

        style={{ padding: '16px 24px' }}
        className="events-holidays-modal antmodalclassName"
      >
        {combinedData?.find(data => data?.date === selectedDate) ? (
          <div className="modal-content-container">
            {/* Events Section */}
            <div className="section-container">
              <Divider orientation="left" className="section-divider">
                <Space>
                  <CalendarOutlined style={{ color: '#1890ff' }} />
                  <Text strong style={{ fontSize: '16px' }}>Events</Text>
                </Space>
              </Divider>

              {combinedData.find(data => data.date === selectedDate)?.events?.length > 0 ? (
                <div className="events-grid">
                  {combinedData.find(data => data.date === selectedDate).events.map((event) => (
                    <Card
                      key={event.id}
                      className="event-card"
                      hoverable
                      size="small"
                    >
                      <div className="card-content">
                        <div className="main-content">
                          <Text strong className="event-title">{event.title}</Text>
                          {event.description && (
                            <Text type="secondary" className="event-description">
                              {event.description}
                            </Text>
                          )}
                          {event.location && (
                            <div className="event-location">
                              <EnvironmentOutlined />
                              <Text type="secondary">{event.location}</Text>
                            </div>
                          )}
                        </div>

                        {event.attendees?.length > 0 && (
                          <div className="attendees-section">
                            <Divider dashed className="attendees-divider" />
                            <Text type="secondary" className="attendees-title">
                              <TeamOutlined /> Attendees ({event.attendees.length})
                            </Text>
                            <div className="attendees-list">
                              {event.attendees.map(attendee => (
                                <div key={attendee.email} className="attendee-item">
                                  <Avatar
                                    size="small"
                                    icon={<UserOutlined />}
                                    className={`attendee-avatar ${attendee.status}`}
                                  />
                                  <Text className="attendee-name">{attendee.name}</Text>
                                  <Tag
                                    size="small"
                                    color={attendee.status === 'confirmed' ? 'green' : 'orange'}
                                    className="status-tag"
                                  >
                                    {attendee.status}
                                  </Tag>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No events scheduled for this day"
                  className="empty-state"
                />
              )}
            </div>

            {/* Holidays Section */}
            <div className="section-container">
              <Divider orientation="left" className="section-divider">
                <Space>
                  <TrophyOutlined style={{ color: '#faad14' }} />
                  <Text strong style={{ fontSize: '16px' }}>Holidays</Text>
                </Space>
              </Divider>

              {combinedData.find(data => data.date === selectedDate)?.holidays?.length > 0 ? (
                <div className="holidays-grid">
                  {combinedData.find(data => data.date === selectedDate).holidays.map((holiday) => (
                    <Card
                      key={holiday.id}
                      className="holiday-card"
                      size="small"
                    >
                      <Space>
                        <Avatar icon={<TrophyOutlined />} style={{ backgroundColor: '#faad14' }} />
                        <div>
                          <Text strong>{holiday.name}</Text>
                          {holiday.description && (
                            <div>
                              <Text type="secondary">{holiday.description}</Text>
                            </div>
                          )}
                        </div>
                      </Space>
                    </Card>
                  ))}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No holidays on this day"
                  className="empty-state"
                />
              )}
            </div>
          </div>
        ) : (
          <Empty description="No data available for this date" className="empty-state" />
        )}
      </Modal>

      <style jsx global>{`
  .events-holidays-modal {
    border-radius: 8px;
  }

  .ant-modal-content {
    background-color: #f9f9f9;
  }

  .modal-content-container {
    padding: 16px 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    background-color: #f9f9f9;
  }

  .section-divider {
    margin: 8px 0 16px 0;
  }

  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }

  .holidays-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 12px;
  }

  .event-card {
    border-radius: 8px;
    border: 1px solid #f0f0f0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  }

  .event-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  }

  .holiday-card {
    border-radius: 8px;
    border-left: 3px solid #faad14;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  }

  .card-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .event-title {
    font-size: 15px;
    display: block;
    margin-bottom: 4px;
  }

  .event-description {
    font-size: 13px;
    display: block;
  }

  .event-location {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
    font-size: 13px;
  }

  .attendees-section {
    margin-top: 8px;
  }

  .attendees-divider {
    margin: 8px 0;
  }

  .attendees-title {
    font-size: 12px;
    display: block;
    margin-bottom: 6px;
  }

  .attendees-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .attendee-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .attendee-avatar {
    background-color: #1890ff;
  }

  .attendee-avatar.confirmed {
    background-color: #52c41a;
  }

  .attendee-avatar.declined {
    background-color: #ff4d4f;
  }

  .attendee-name {
    font-size: 13px;
    flex-grow: 1;
  }

  .status-tag {
    font-size: 11px;
    padding: 0 6px;
    margin-left: auto;
  }

  .empty-state {
    padding: 16px 0;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .events-grid, .holidays-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .modal-content-container {
      padding: 16px;
    }

    .section-divider {
      font-size: 14px;
    }

    .event-title, .attendees-title {
      font-size: 14px;
    }

    .event-description, .attendee-name, .status-tag {
      font-size: 12px;
    }

    .attendee-item {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  @media (max-width: 480px) {
    .event-title {
      font-size: 13px;
    }

    .event-description {
      font-size: 12px;
    }

    .attendee-name {
      font-size: 11px;
    }
  }
`}</style>

      <div className="w-full grid grid-cols-2 md:grid-cols-2 2xl:grid-cols-3 gap-4 py-2 pr-3">

        <div className="w-full  border-[1px] rounded-lg px-2 py-[2px]">
          <div className="flex justify-start gap-1 items-center">
            <span className={`lg:w-3 lg:h-3 w-[10px] h-[10px] rounded flex-none bg-green-500`}></span>
            <span className="lg:text-[12px] text-[10px] font-[400]">Events</span>
          </div>
          <div className="ml-auto text-sm font-bold">{companyDashboardData?.calender?.eventData?.length ?? companyDashboardData?.eventData?.length ?? 0}</div>
        </div>
        <div className="w-full  border-[1px] rounded-lg px-2 py-[2px]">
          <div className="flex  justify-start gap-1 items-center">
            <span className={`lg:w-3 lg:h-3 w-[10px] h-[10px] rounded flex-none bg-yellow-500`}></span>
            <span className="lg:text-[12px] text-[10px] font-[400]">Holidays</span>
          </div>
          <div className="ml-auto text-sm font-bold">{companyDashboardData?.calender?.holidayData?.length ?? companyDashboardData?.holidayData?.length ?? 0}</div>
        </div>
      </div>


    </div>
  );
};

export default Calendar;
