import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import Swal from "sweetalert2";
import { FaPlus, FaEdit, FaInfoCircle } from "react-icons/fa";
import { HiOutlineFilter } from "react-icons/hi";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import Loader from "../../../global_layouts/Loader/Loader";
import { encrypt } from "../../../config/Encryption";
import {
  deleteHolidayCalander,
  getHolidayCalanderList,
} from "./holidayCalanderFeatures/_holiday_calander_reducers";
import {
  domainName,
  handleSortLogic,
  inputAntdSelectClassNameFilter,
  inputCalanderClassName,
} from "../../../constents/global";
import { DatePicker, Select, Tooltip, Modal, Tag, Divider } from "antd";
import dayjs from "dayjs";
import { Controller, useForm, useWatch } from "react-hook-form";
import usePermissions from "../../../config/usePermissions";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./HolidayCalendar.css"; // Custom CSS file for additional styling

const localizer = momentLocalizer(moment);

function HolidayCalanderList() {
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(dayjs());
  const { holidayCalanderData, totalholidayCalanderCount, loading } =
    useSelector((state) => state.holidayCalander);

  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  const status = useWatch({
    control,
    name: 'status',
    defaultValue: ''
  });

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    getHolidayCalanderRequest(selectedYear);
  }, [selectedYear, currentPage, status, searchText]);

  const getHolidayCalanderRequest = (selectedSearch) => {
    const data = {
      currentPage: currentPage,
      pageSize: 100,
      reqData: {
        text: searchText,
        status: status === 'true' ? true : status === 'false' ? false : '',
        sort: true,
        isPagination: true,
        year: dayjs(selectedYear)?.format("YYYY"),
      },
    };
    dispatch(getHolidayCalanderList(data));
  };

  const handleDelete = (id) => {
    let reqData = {
      _id: id,
    };
    Swal.fire({
      title: "Warning",
      text: "Are you sure you want to delete!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteHolidayCalander(reqData)).then((data) => {
          getHolidayCalanderRequest();
        });
      }
    });
  };

  const onChange = (e) => {
    setSearchText(e);
  };

  // Format holiday data for calendar
  const events = holidayCalanderData?.map(holiday => ({
    id: holiday._id,
    title: holiday.name,
    start: new Date(holiday.date),
    end: new Date(holiday.date),
    allDay: true,
    description: holiday.description,
    status: holiday.status,
    rawData: holiday // Store the original data for modal
  })) || [];

  const eventStyleGetter = (event) => {
    let backgroundColor = event.status ? '#06b6d4' : '#ef4444'; // Cyan for active, red for inactive
    let borderColor = event.status ? '#0891b2' : '#dc2626';
    let style = {
      backgroundColor,
      borderRadius: '6px',
      opacity: 0.9,
      color: 'white',
      border: `2px solid ${borderColor}`,
      display: 'block',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      fontSize: '0.85rem',
      padding: '2px 4px'
    };
    return {
      style
    };
  };

  const onNavigate = (newDate) => {
    setDate(newDate);
    const newYear = moment(newDate).year();
    if (moment(selectedYear).year() !== newYear) {
      setSelectedYear(dayjs(newDate));
    }
  };

  const CustomEvent = ({ event }) => {
    return (
      <div className="p-1 h-full overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="font-medium truncate">{event.title}</span>
          {event.status ? (
            <span className="inline-block w-2 h-2 rounded-full bg-teal-400 ml-1"></span>
          ) : (
            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 ml-1"></span>
          )}
        </div>
      </div>
    );
  };

  const CustomMonthEvent = ({ event }) => {
    return (
      <div className="p-1 h-full">
        <div className="flex items-center">
          <span className="font-medium truncate text-xs">{event.title}</span>
        </div>
      </div>
    );
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedEvent(null);
  };

  const handleEdit = (id) => {
    navigate(`/admin/holiday-calander/edit/${encrypt(id)}`);
  };

  return (
    <GlobalLayout onChange={onChange}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className={`w-36 ${inputAntdSelectClassNameFilter}`}
                        placeholder="Filter by status"
                        showSearch
                      >
                        <Select.Option value="">All Status</Select.Option>
                        <Select.Option value="true">Active</Select.Option>
                        <Select.Option value="false">Inactive</Select.Option>
                      </Select>
                    )}
                  />
                  <DatePicker
                    className={`${inputCalanderClassName}`}
                    showYearPicker
                    popupClassName={"!z-[1580]"}
                    value={selectedYear}
                    onChange={(date) => setSelectedYear(date)}
                    picker="year"
                  />
                </div>
                <button
                  onClick={() => {
                    setValue('status', '');
                    setSelectedYear(dayjs());
                    setDate(new Date());
                  }}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md flex items-center text-gray-800 transition-colors"
                >
                  <span className="text-sm">Reset</span>
                </button>
              </div>
              {(canRead && canCreate) && (
                <button
                  onClick={() => navigate("/admin/holiday-calander/create")}
                  className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md flex items-center gap-2 text-white transition-colors w-full sm:w-auto justify-center"
                >
                  <FaPlus />
                  <span className="text-sm">Add Holiday</span>
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {canRead && (
              <div className="h-[70vh] min-h-[500px]">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: "100%" }}
                  defaultView={view}
                  view={view}
                  onView={setView}
                  date={date}
                  onNavigate={onNavigate}
                  eventPropGetter={eventStyleGetter}
                  components={{
                    event: view === Views.MONTH ? CustomMonthEvent : CustomEvent,
                  }}
                  onSelectEvent={handleSelectEvent}
                  popup={true}
                  doShowMoreDrillDown={false}
                  toolbar={(toolbar) => (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toolbar.onNavigate('PREV')}
                          className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors"
                        >
                          ◀
                        </button>
                        <button
                          onClick={() => toolbar.onNavigate('TODAY')}
                          className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors"
                        >
                          Today
                        </button>
                        <button
                          onClick={() => toolbar.onNavigate('NEXT')}
                          className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors"
                        >
                          ▶
                        </button>
                        <h2 className="text-lg font-semibold ml-2">
                          {toolbar.label}
                        </h2>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toolbar.onView(Views.MONTH)}
                          className={`px-3 py-1 rounded-md ${view === Views.MONTH ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                        >
                          Month
                        </button>
                        <button
                          onClick={() => toolbar.onView(Views.WEEK)}
                          className={`px-3 py-1 rounded-md ${view === Views.WEEK ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                        >
                          Week
                        </button>
                        <button
                          onClick={() => toolbar.onView(Views.DAY)}
                          className={`px-3 py-1 rounded-md ${view === Views.DAY ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                        >
                          Day
                        </button>
                        <button
                          onClick={() => toolbar.onView(Views.AGENDA)}
                          className={`px-3 py-1 rounded-md ${view === Views.AGENDA ? 'bg-teal-600 text-white' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                        >
                          List
                        </button>
                      </div>
                    </div>
                  )}
                />
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-teal-500"></div>
              <span className="text-sm">Active Holiday</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-rose-500"></div>
              <span className="text-sm">Inactive Holiday</span>
            </div>
          </div>

          {/* Event Details Modal */}
          <Modal
            title="Holiday Details"
            open={isModalVisible}
            
            onCancel={handleModalClose}
            
            footer={[
              <button
                key="close"
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              >
                Close
              </button>,
              canUpdate && (
                <button
                  key="edit"
                  onClick={() => handleEdit(selectedEvent?.id)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md flex items-center gap-2 transition-colors"
                >
                  <FaEdit />
                  Edit
                </button>
              ),
              canDelete && (
                <button
                  key="delete"
                  onClick={() => handleDelete(selectedEvent?.id)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md transition-colors"
                >
                  Delete
                </button>
              )
            ].filter(Boolean)}
            className="holiday-modal antmodalclassName"
          >
            {selectedEvent && (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold">{selectedEvent.title}</h3>
                  <Tag color={selectedEvent.status ? "cyan" : "red"}>
                    {selectedEvent.status ? "Active" : "Inactive"}
                  </Tag>
                </div>
                <Divider className="my-2" />
                <div>
                  <h4 className="font-medium text-gray-700">Date</h4>
                  <p>{moment(selectedEvent.start).format("MMMM Do, YYYY")}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Description</h4>
                  <p className="text-gray-800">
                    {selectedEvent.description || "No description available"}
                  </p>
                </div>
              </div>
            )}
          </Modal>
        </>
      )}
    </GlobalLayout>
  );
}

export default HolidayCalanderList;