import { apiCall } from "../../../../../config/Http";

async function getEmployeeSalaryDetailsList(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `employe/salaryDetails/list?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("attendancelist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/salaryDetails/list`);
      return response;
    } catch (error) {
      console.error("companylist:", error);
      return Promise.reject(error);
    }
  }
}

async function createEmployeeSalaryDetails(data) {
  try {
    const response = await apiCall("POST", "employe/salaryDetails/create", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}
async function getDetailsEmployeeSalaryDetails(data) {
  try {
    const response = await apiCall("POST", "employe/salaryDetails/detail", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}
async function updateEmployeeSalaryDetails(data) {
  try {
    const response = await apiCall("POST", "employe/salaryDetails/update", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}
async function deleteEmployeeSalaryDetails(data) {
  try {
    const response = await apiCall("POST", "employe/salaryDetails/delete", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}
async function createSalaryIncrement(data) {
  try {
    const response = await apiCall("POST", "employe/salaryDetails/increment", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}
async function incrementList(data) {
  try {
    const response = await apiCall("POST", "employe/salaryDetails/incrementlist", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}

async function incrementStatusUpdate(data) {
  try {
    const response = await apiCall("POST", "employe/salaryDetails/incrementStatus", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}


export const employeeSalaryServices = {
  createEmployeeSalaryDetails,
  getEmployeeSalaryDetailsList,
  getDetailsEmployeeSalaryDetails,
  updateEmployeeSalaryDetails,
  deleteEmployeeSalaryDetails,
  createSalaryIncrement,
  incrementList,
  incrementStatusUpdate
};
