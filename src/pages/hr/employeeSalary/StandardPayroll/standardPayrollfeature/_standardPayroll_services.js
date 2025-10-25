import { apiCall } from "../../../../../config/Http";

async function getstandardPayrollList(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `employe/payroll/standerd/list?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("attendancelist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/payroll/standerd/list`);
      return response;
    } catch (error) {
      console.error("companylist:", error);
      return Promise.reject(error);
    }
  }
}

async function standardPayrollListSearch(data) {
  try {
    const response = await apiCall("POST", "employe/payroll/standerd/list", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}

async function standardPayrollCreate(data) {
  try {
    const response = await apiCall("POST", "employe/payroll/standerd/create", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}
async function standardPayrollDetails(data) {
  try {
    const response = await apiCall("POST", "employe/payroll/standerd/detail", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}
async function standardPayrollUpdate(data) {
  try {
    const response = await apiCall("POST", "employe/payroll/standerd/update", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}
async function standardPayrollDelete(data) {
  try {
    const response = await apiCall("POST", "employe/payroll/standerd/delete", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}
async function standardPayrollStatus(data) {
  try {
    const response = await apiCall("POST", "employe/payroll/standerd/status", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}



export const standardPayrollServices = {
  getstandardPayrollList,
  standardPayrollListSearch,
  standardPayrollCreate,
  standardPayrollDetails,
  standardPayrollUpdate,
  standardPayrollDelete,
  standardPayrollStatus,


};
