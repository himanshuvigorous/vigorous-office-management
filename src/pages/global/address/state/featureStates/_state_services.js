import { apiCall } from "../../../../../config/Http";



async function getStateList(data) {

  if (data) {
    const { page, limit, reqPayload } = data
    try {
      const response = await apiCall("POST", `master/others/state/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("Country List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `master/others/state/list`);
      return response;
    } catch (error) {
      console.error("Country List:", error);
      return Promise.reject(error);
    }
  }
}



async function stateSearch(data) {
  try {
    const response = await apiCall("POST", `master/others/state/list`, data);
    return response;
  } catch (error) {
    console.error("state Type List:", error);
    return Promise.reject(error);
  }
}


async function getStateById(data) {
  try {
    const response = await apiCall("POST", "master/others/state/detail", data);
    return response;
  } catch (error) {
    console.error("State Type:", error);
    return Promise.reject(error);
  }
}

async function createStateFunc(data) {
  try {
    const response = await apiCall("POST", "master/others/state/create", data);
    return response;
  } catch (error) {
    console.error("state Type error:", error);
    return Promise.reject(error);
  }
}

async function updateStateData(data) {
  try {
    const response = await apiCall("POST", "master/others/state/update", data);
    return response;
  } catch (error) {
    console.error("GST Type error:", error);
    return Promise.reject(error);
  }
}

async function deleteStateFunc(data) {
  try {
    const response = await apiCall("POST", "master/others/state/delete", data);
    return response;
  } catch (error) {
    console.error("state Type error:", error);
    return Promise.reject(error);
  }
}

export const stateServices = {
  getStateList,
  getStateById,
  updateStateData,
  createStateFunc,
  deleteStateFunc,
  stateSearch,
};