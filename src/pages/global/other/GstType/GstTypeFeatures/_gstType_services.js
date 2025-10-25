import { apiCall } from "../../../../../config/Http";



async function getGstTypeList(data) {
  if (data) {
    
    const { page, limit, reqPayload } = data;

    try {
      const response = await apiCall("POST", `master/finance/gstType/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `master/finance/gstType/list`);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  }
}




async function gstTypeSearch(data) {
  try {
    const response = await apiCall("POST", "master/finance/gstType/list", data);
    if (response) {
      return response;
    }
  } catch (error) {
    console.error("create client error:", error);
    return Promise.reject(error);
  }
}
async function createGstTypeFunc(data) {
  try {
    const response = await apiCall("POST", "master/finance/gstType/create", data);
    if (response) {
      return { clientinfo: response };
    }
  } catch (error) {
    console.error("create client error:", error);
    return Promise.reject(error);
  }
}

async function getGstTypeByIdFunc(data) {


  try {
    const response = await apiCall("POST", "master/finance/gstType/detail", data);
    return response;
  } catch (error) {
    console.error("gettaskDetails:", error);
    return Promise.reject(error);
  }
}

async function updateGstTypeFunc(data) {
  try {
    const response = await apiCall("POST", "master/finance/gstType/update", data);
    return response;
  } catch (error) {
    console.error("updatetask:", error);
    return Promise.reject(error);
  }
}

async function deleteGstTypeFunc(data) {
  try {
    const response = await apiCall("POST", "master/finance/gstType/delete", data);
    return response;
  } catch (error) {
    console.error("deletetask:", error);
    return Promise.reject(error);
  }
}
async function statusGstTypeFunc(data) {
  try {
    const response = await apiCall("POST", "master/finance/gstType/status", data);
    return response;
  } catch (error) {
    console.error("deletetask:", error);
    return Promise.reject(error);
  }
}
async function reassignGstTypeFunc(data) {
  try {
    const response = await apiCall("POST", "master/finance/gstType/comment", data);
    return response;
  } catch (error) {
    console.error("deletetask:", error);
    return Promise.reject(error);
  }
}



export const gstTypeServices = {
  getGstTypeList,
  gstTypeSearch,
  createGstTypeFunc,
  getGstTypeByIdFunc,
  updateGstTypeFunc,
  deleteGstTypeFunc,
  statusGstTypeFunc,
  reassignGstTypeFunc,
};
