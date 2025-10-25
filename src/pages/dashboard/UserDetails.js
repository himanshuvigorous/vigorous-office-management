// UserDetails.jsx
import { Empty, Tooltip, Button, Space, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { domainName } from "../../constents/global";
import { useDispatch, useSelector } from "react-redux";
import { getTodayCheckinData } from "../hr/attendance/AttendanceFeatures/_attendance_reducers";
import moment from "moment";
import { CiLogin, CiLogout } from "react-icons/ci";
import { MdWorkHistory } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import AttendanceModal from "./AttendnaceSystem";

const { Text } = Typography;

const UserDetails = ({ leaveList, birthdaydata, inActiveUserToday, todayWfhRequstData }) => {
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { todayAttendanceData, loading: attendanceLoading } = useSelector((state) => state.attendance);
  const dispatch = useDispatch();
  const [currentTime, setCurrentTime] = useState(moment());
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [workingTime, setWorkingTime] = useState("00:00:00");
  const [attendanceModalVisible, setAttendanceModalVisible] = useState(false);
  const [attendanceAction, setAttendanceAction] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (todayAttendanceData) {
      setCheckInTime(
        todayAttendanceData?.checkInTime
          ? moment(todayAttendanceData.checkInTime)
          : null
      );
      setCheckOutTime(
        todayAttendanceData?.checkOutTime
          ? moment(todayAttendanceData.checkOutTime)
          : null
      );
    }
  }, [todayAttendanceData]);

  useEffect(() => {
    if (checkInTime && !checkOutTime) {
      const interval = setInterval(() => {
        const duration = moment.duration(moment().diff(checkInTime));
        const hours = String(duration.hours()).padStart(2, "0");
        const minutes = String(duration.minutes()).padStart(2, "0");
        const seconds = String(duration.seconds()).padStart(2, "0");
        setWorkingTime(`${hours}:${minutes}:${seconds}`);
      }, 1000);
      return () => clearInterval(interval);
    } else if (checkInTime && checkOutTime) {
      const duration = moment.duration(checkOutTime.diff(checkInTime));
      const hours = String(duration.hours()).padStart(2, "0");
      const minutes = String(duration.minutes()).padStart(2, "0");
      const seconds = String(duration.seconds()).padStart(2, "0");
      setWorkingTime(`${hours}:${minutes}:${seconds}`);
    }
  }, [checkInTime, checkOutTime]);

  useEffect(() => {
    if (userInfoglobal?.userType === "employee") {
      getTodayCheckinDataFunc();
    }
  }, []);

  const getTodayCheckinDataFunc = () => {
    dispatch(
      getTodayCheckinData({
        employeId:
          userInfoglobal?.userType === "employee" ? userInfoglobal?._id : null,
      })
    );
  };

  const handleAttendanceAction = (action) => {
    setAttendanceAction(action);
    setAttendanceModalVisible(true);
  };

  const handleAttendanceSuccess = () => {
    getTodayCheckinDataFunc();
  };

  const renderAttendanceButton = () => {
    if (!checkInTime && !attendanceLoading) {
      return (
        <Button
          className="w-full"
          color="cyan"
          type="button"
          variant="solid"
          onClick={() => handleAttendanceAction("checkIn")}
          icon={<FaMapMarkerAlt />}
        >
          Check In
        </Button>
      );
    } else if (checkInTime && !checkOutTime && !attendanceLoading) {
      return (
        <Button
          className="w-full"
          type="button"
          color="danger"
          variant="solid"
          onClick={() => handleAttendanceAction("checkOut")}
          icon={<FaMapMarkerAlt />}
        >
          Check Out
        </Button>
      );
    } else {
      return (!attendanceLoading && <Text type="secondary">You've checked out for today</Text>)
    }
  };
  console.log(todayWfhRequstData, leaveList)
  return (
    <div className="w-full bg-[#ffff] rounded-md py-[10px] px-3 space-y-3 my-2">
      <div className="3xl:text-[20px] xl:text-[12px] lg:text-[14px] md:text-[18px] font-[500] text-header text-ellipsis">
        Hello, {userInfoglobal?.fullName}
      </div>

      <div className="flex justify-between items-start xl:pr4">
        <div className="3xl:text-[20px] xl:text-[12px] lg:text-[14px] md:text-[18px] font-[500] text-header">
          <div>{currentTime.format("DD MMM YYYY")}</div>
          <div className=""> {currentTime.format("hh:mm:ss A")}</div>
        </div>
        <div className="bg-gray-100 px-2 py-1 rounded-md text-[14px] font-[500] text-header space-y-1">
          <div className="text-nowrap">On Leave: {leaveList?.length ?? 0}</div>
        </div>
      </div>

      {userInfoglobal?.userType == "employee" && (
        <div className="p-2 bg-gray-200 shadow-sm shadow-black rounded-md">
          <div className="gap-2 items-center p-2">
            <div className="flex justify-between items-center">
              {checkInTime && (
                <div className="text-[14px] flex items-center gap-2 font-medium text-header">
                  <CiLogin /> {checkInTime.format("hh:mm:ss A")}
                </div>
              )}
              {checkOutTime && (
                <div className="text-[14px] flex items-center gap-2 font-medium text-header">
                  <CiLogout /> {checkOutTime.format("hh:mm:ss A")}
                </div>
              )}
            </div>

            <div className="text-[18px] font-medium text-header text-center my-1 md:text-left flex justify-center items-center gap-2">
              <MdWorkHistory />
              <span className="font-semibold">{workingTime}</span>
            </div>

            {renderAttendanceButton()}
          </div>
        </div>
      )}

      {/* Leave List Section */}
      {leaveList?.length > 0 ? (
        <div>
          <div className="3xl:text-[19px] xl:text-[16px] font-[500] text-header">
            On Leave Today
          </div>
          <div className="w-full overflow-x-auto py-2 scrollable-x">
            <div className="w-full flex justify-start items-center space-x-3">
              {leaveList?.map((element, index) => (
                <Tooltip placement="topLeft" key={index} title={element?.tooltip}>
                  <div className="flex flex-col cursor-pointer">
                    <div className="w-[50px] h-[50px] text-center m-auto">
                      <img
                        src={element?.imgUrl}
                        alt=""
                        className="w-full h-full rounded-full"
                      />
                    </div>
                    <span className="text-[14px] text-nowrap py-1">
                      {element?.name}
                    </span>
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="3xl:text-[19px] xl:text-[16px] font-[500] text-header">
            On Leave Today
          </div>
          <div className="w-full overflow-x-auto py-2 scrollable-x">
            <Empty
              image="/images/empty.svg"
              styles={{
                image: {
                  height: 40,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
              }}
              description="No One Is On Leave Today"
            />
          </div>
        </div>
      )}

      {todayWfhRequstData?.length > 0 ? (
        <div>
          <div className="3xl:text-[19px] xl:text-[16px] font-[500] text-header">
            On WFH Today
          </div>
          <div className="w-full overflow-x-auto py-2 scrollable-x">
            <div className="w-full flex justify-start items-center space-x-3">
              {todayWfhRequstData?.map((element, index) => (

                <div key={index} className="flex flex-col cursor-pointer relative">

                  {/* Attendance Badge with Tooltip */}
                  <Tooltip
                    title={
                      element?.hasAttendanceMarked
                        ? "✅ Attendance Marked"
                        : "❌ Attendance Not Marked"
                    }
                  >
                    <div
                      className="absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                      style={{
                        backgroundColor: element?.hasAttendanceMarked ? '#4CAF50' : '#F44336',
                      }}
                    />
                  </Tooltip>

                  {/* Profile Image */}
                  <Tooltip placement="topLeft" title={element?.tooltip}>
                    <div className="w-[50px] h-[50px] text-center m-auto">
                      <img
                        src={element?.imgUrl}
                        alt=""
                        className="w-full h-full rounded-full"
                      />
                    </div>
                  </Tooltip>
                  {/* Name */}
                  <span className="text-[14px] text-nowrap py-1">
                    {element?.name}
                  </span>
                </div>

              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="3xl:text-[19px] xl:text-[16px] font-[500] text-header">
            On WFH Today
          </div>
          <div className="w-full overflow-x-auto py-2 scrollable-x">
            <Empty
              image="/images/empty.svg"
              styles={{
                image: {
                  height: 40,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
              }}
              description="No One Is On WFH Today"
            />
          </div>
        </div>
      )}


      {/* Birthday Section */}
      {birthdaydata?.length > 0 ? (
        <div>
          <div className="3xl:text-[19px] xl:text-[16px] font-[500] text-header">
            Birthdays Today
          </div>
          <div className="w-full overflow-x-auto py-2 scrollable-x">
            <div className="w-full flex justify-start items-center space-x-3">
              {birthdaydata?.map((element, index) => (
                <Tooltip placement="topLeft" key={index} title={element?.tooltip}>
                  <div className="flex flex-col">
                    <div className="w-[50px] h-[50px]">
                      <img
                        src={element?.imgUrl}
                        alt=""
                        className="w-full h-full rounded-full"
                      />
                    </div>
                    <span className="text-[14px] py-1">{element?.name}</span>
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="3xl:text-[19px] xl:text-[16px] font-[500] text-header">
            Birthdays Today
          </div>
          <div className="w-full overflow-x-auto py-2">
            <Empty
              image="/images/empty.svg"
              styles={{
                image: {
                  height: 40,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
              }}
              description="No Birthdays Today"
            />
          </div>
        </div>
      )}

      {/* In-Active User Today Section */}
      {(userInfoglobal?.userType !== "employee" ||
        ((userInfoglobal?.userType === "employee" && userInfoglobal?.roleKey == "hr") ||
          (userInfoglobal?.userType === "employee" && userInfoglobal?.roleKey == "manager"))) &&
        (inActiveUserToday?.length > 0 ? (
          <div>
            <div className="3xl:text-[19px] xl:text-[16px] font-[500] text-header">
              In-Active User Today
            </div>
            <div className="w-full overflow-x-auto py-2 scrollable-x">
              <div className="w-full flex justify-start items-center space-x-3">
                {inActiveUserToday?.map((element, index) => (
                  <Tooltip placement="topLeft" key={index} title={element?.tooltip}>
                    <div key={index} className="flex flex-col">
                      <div className="w-[50px] h-[50px]">
                        <img
                          src={element?.imgUrl}
                          alt=""
                          className="w-full h-full rounded-full"
                        />
                      </div>
                      <span className="text-[14px] py-1">{element?.name}</span>
                    </div>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="3xl:text-[19px] xl:text-[16px] font-[500] text-header">
              In-Active User Today
            </div>
            <div className="w-full overflow-x-auto py-2 scrollable-x">
              <Empty
                image="/images/empty.svg"
                styles={{
                  image: {
                    height: 40,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                }}
                description="No Inactive Users Today"
              />
            </div>
          </div>
        ))
      }

      {/* Attendance Modal */}
      <AttendanceModal
        visible={attendanceModalVisible}
        onClose={() => setAttendanceModalVisible(false)}
        actionType={attendanceAction}
        todayAttendanceData={todayAttendanceData}
        userInfoglobal={userInfoglobal}
        onSuccess={handleAttendanceSuccess}
      />
    </div>
  );
};

export default UserDetails;