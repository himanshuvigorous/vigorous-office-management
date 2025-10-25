import { apiCall } from "../../../../../config/Http";


async function getResignationList(data) {

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
async function resignationSearch(data) {

  try {
    const response = await apiCall("POST", "employe/resignation/list", data);
    return response;
  } catch (error) {
    console.error("common Email List:", error);
    return Promise.reject(error);
  }
}

async function getResignationDetails(data) {

  try {
    const response = await apiCall("POST", "employe/resignation/detail", data);
    return response;
  } catch (error) {
    console.error("common Email:", error);
    return Promise.reject(error);
  }
}
async function createResignFunc(data) {
  try {
    const response = await apiCall("POST", "employe/resignation/create", data);
    return response;
  } catch (error) {
    console.error("common Email error:", error);
    return Promise.reject(error);
  }
}
async function updateResignationFunc(data) {

  try {
    const response = await apiCall("POST", "employe/resignation/update", data);
    return response;
  } catch (error) {
    console.error("common Email error:", error);
    return Promise.reject(error);
  }
}
async function deleteResignFunc(data) {

  try {
    const response = await apiCall("POST", "employe/resignation/delete", data);
    return response;
  } catch (error) {
    console.error("common Email error:", error);
    return Promise.reject(error);
  }
}

async function statusResignFunc(data) {

  try {
    const response = await apiCall("POST", "employe/resignation/status", data);
    return response;
  } catch (error) {
    console.error("common Email error:", error);
    return Promise.reject(error);
  }
}

export const resignServices = {
  getResignationList,
  getResignationDetails,
  createResignFunc,
  updateResignationFunc,
  deleteResignFunc,
  resignationSearch,
  statusResignFunc,
};