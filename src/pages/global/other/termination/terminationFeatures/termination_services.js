import { apiCall } from "../../../../../config/Http";


async function getTerminationList(data) {

  if (data) {
    const { currentPage, pageSize, reqData } = data
    try {
      const response = await apiCall("POST", `employe/resignation/list?page=${currentPage}&limit=${pageSize}`, reqData);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/resignation/list`);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  }
}


async function getEmployeeTerminationList(data) {

  if (data) {
    const { currentPage, pageSize, reqData } = data
    try {
      const response = await apiCall("POST", `employe/resignation/list?page=${currentPage}&limit=${pageSize}`, reqData);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/resignation/list`);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  }
}
async function TerminationSearch(data) {

  try {
    const response = await apiCall("POST", "employe/resignation/list", data);
    return response;
  } catch (error) {
    console.error("common Email List:", error);
    return Promise.reject(error);
  }
}

async function getTerminationDetails(data) {

  try {
    const response = await apiCall("POST", "employe/resignation/detail", data);
    return response;
  } catch (error) {
    console.error("common Email:", error);
    return Promise.reject(error);
  }
}
async function createTerminationFunc(data) {
  try {
    const response = await apiCall("POST", "employe/resignation/create", data);
    return response;
  } catch (error) {
    console.error("common Email error:", error);
    return Promise.reject(error);
  }
}
async function updateTerminationFunc(data) {

  try {
    const response = await apiCall("POST", "employe/resignation/update", data);
    return response;
  } catch (error) {
    console.error("common Email error:", error);
    return Promise.reject(error);
  }
}
async function deleteTerminationFunc(data) {

  try {
    const response = await apiCall("POST", "employe/resignation/delete", data);
    return response;
  } catch (error) {
    console.error("common Email error:", error);
    return Promise.reject(error);
  }
}

async function statusTerminationFunc(data) {

  try {
    const response = await apiCall("POST", "employe/resignation/status", data);
    return response;
  } catch (error) {
    console.error("common Email error:", error);
    return Promise.reject(error);
  }
}

export const TerminationServices = {
  getTerminationList,
  getTerminationDetails,
  createTerminationFunc,
  updateTerminationFunc,
  deleteTerminationFunc,
  TerminationSearch,
  statusTerminationFunc,
  getEmployeeTerminationList
};