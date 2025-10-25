import { apiCall } from "../../../../../config/Http";






async function getPayrollList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `employe/payroll/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Plan List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `employe/payroll/list`);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  }
}
async function getPayrollemployeeList(data) {
  try {
      const response = await apiCall("POST", `employe/payroll/list`,data);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
}
async function getPayrollDetails(data) {

  try {
    const response = await apiCall("POST", "employe/payroll/detail", data);
    return response;
  } catch (error) {
    console.error("Payroll:", error);
    return Promise.reject(error);
  }
}

async function createPayroll(data) {
  try {
    const response = await apiCall("POST", "employe/payroll/create", data);
    return response;
  } catch (error) {
    console.error("Payroll error:", error);
    return Promise.reject(error);
  }
}
async function updatePayroll(data) {

  try {
    const response = await apiCall("POST", "employe/payroll/update", data);
    return response;
  } catch (error) {
    console.error("Payroll error:", error);
    return Promise.reject(error);
  }
}
async function deletePayroll(data) {

  try {
    const response = await apiCall("POST", "employe/payroll/delete", data);
    return response;
  } catch (error) {
    console.error("Payroll error:", error);
    return Promise.reject(error);
  }
}
async function payrollDetailsFullListFunc(data) {

  try {
    const response = await apiCall("POST", "employe/payroll/salaryReport", data);
    return response;
  } catch (error) {
    console.error("Payroll error:", error);
    return Promise.reject(error);
  }
}
async function payrollStatusFunc(data) {

  try {
    const response = await apiCall("POST", "employe/payroll/status", data);
    return response;
  } catch (error) {
    console.error("Payroll error:", error);
    return Promise.reject(error);
  }
}


export const payrollServices = {
  getPayrollList,
  createPayroll,
  updatePayroll,
  getPayrollDetails,
  payrollDetailsFullListFunc,
  payrollStatusFunc,
  deletePayroll,
  getPayrollemployeeList
  
};