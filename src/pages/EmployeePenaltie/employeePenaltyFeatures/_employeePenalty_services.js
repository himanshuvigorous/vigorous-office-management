import { apiCall } from "../../../config/Http";



async function getEmployeePenaltyTypeList(data) {

  if (data) {
    const { currentPage, pageSize, reqData } = data
    try {
      const response = await apiCall("POST", `employe/penalty/list?page=${currentPage}&limit=${pageSize}`, reqData);
      return response;
    } catch (error) {
      console.error("Work Type List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/penalty/list`);
      return response;
    } catch (error) {
      console.error("Work Type List:", error);
      return Promise.reject(error);
    }
  }
}

async function getPenaltyList(data) {

  if (data) {
    const { currentPage, pageSize, reqData } = data
    try {
      const response = await apiCall("POST", `employe/penalty/list?page=${currentPage}&limit=${pageSize}`, reqData);
      return response;
    } catch (error) {
      console.error("Work Type List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/penalty/list`);
      return response;
    } catch (error) {
      console.error("Work Type List:", error);
      return Promise.reject(error);
    }
  }
}

async function employeePenaltyTypeSearch(data) {

  try {
    const response = await apiCall("POST", "employe/penalty/list", data);
    return response;
  } catch (error) {
    console.error("Work Type List:", error);
    return Promise.reject(error);
  }
}

async function getEmployeePenaltyTypeDetails(data) {

  try {
    const response = await apiCall("POST", "employe/penalty/detail", data);
    return response;
  } catch (error) {
    console.error("Work Type:", error);
    return Promise.reject(error);
  }
}
async function createEmployeePenaltyType(data) {
  try {
    const response = await apiCall("POST", "employe/penalty/create", data);
    return response;
  } catch (error) {
    console.error("Penalty Type error:", error);
    return Promise.reject(error);
  }
}
async function updateEmployeePenaltyType(data) {

  try {
    const response = await apiCall("POST", "employe/penalty/update", data);
    return response;
  } catch (error) {
    console.error("Work Type error:", error);
    return Promise.reject(error);
  }
}
async function deleteEmployeePenaltyType(data) {

  try {
    const response = await apiCall("POST", "employe/penalty/delete", data);
    return response;
  } catch (error) {
    console.error("Work Type error:", error);
    return Promise.reject(error);
  }
}
async function statusEmployeePenaltyType(data) {

  try {
    const response = await apiCall("POST", "employe/penalty/status", data);
    return response;
  } catch (error) {
    console.error("Work Type error:", error);
    return Promise.reject(error);
  }
}

export const employeePenaltyTypeServices = {
  getEmployeePenaltyTypeList,
  getEmployeePenaltyTypeDetails,
  createEmployeePenaltyType,
  updateEmployeePenaltyType,
  deleteEmployeePenaltyType,
  statusEmployeePenaltyType,
  employeePenaltyTypeSearch,
  getPenaltyList

};