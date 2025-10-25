import { apiCall } from "../../../../config/Http";


async function getattendanceList(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `employe/attendance/list?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("attendancelist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/attendance/list`);
      return response;
    } catch (error) {
      console.error("companylist:", error);
      return Promise.reject(error);
    }
  }
}

async function attendanceSearch(data) {
  try {
    const response = await apiCall("POST", "employe/attendance/list", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}

async function attendanceCreate(data) {
  try {
    const response = await apiCall("POST", "employe/attendance/create", data);
    if (response) {
      return { companyinfo: response };
    }
  } catch (error) {
    console.error("attendance create error:", error);
    return Promise.reject(error);
  }
}
async function attendanceStatus(data) {
  try {
    const response = await apiCall("POST", "employe/attendance/status", data);
    if (response) {
      return { companyinfo: response };
    }
  } catch (error) {
    console.error("attendance create error:", error);
    return Promise.reject(error);
  }
}

async function getattendanceDetails(data) {
  try {
    const response = await apiCall("POST", "employe/attendance/detail", data);
    return response;
  } catch (error) {
    console.error("getattendanceDetails:", error);
    return Promise.reject(error);
  }
}
async function updateattendance(data) {
  try {
    const response = await apiCall("POST", "employe/attendance/update", data);
    return response;
  } catch (error) {
    console.error("update attendance:", error);
    return Promise.reject(error);
  }
}

async function deleteattendance(data) {
  try {
    const response = await apiCall("POST", "employe/attendance/delete", data);
    return response;
  } catch (error) {
    console.error("deletecompany:", error);
    return Promise.reject(error);
  }
}
async function AllAttendanceRecord(data) {
  try {
    const response = await apiCall("POST", "employe/attendance/workRecords", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}
async function todayCheckinData(data) {
  try {
    const response = await apiCall("POST", "employe/attendance/isCheckin", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}

export const attendanceServices = {
  getattendanceList,
  attendanceSearch,
  attendanceCreate,
  getattendanceDetails,
  updateattendance,
  deleteattendance,
  AllAttendanceRecord,
  todayCheckinData,
  attendanceStatus

};
