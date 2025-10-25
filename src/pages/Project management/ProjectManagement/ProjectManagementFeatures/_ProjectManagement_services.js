import { apiCall } from "../../../../config/Http";




async function getprojectmanagementList(data) {
  if (data) {
    const { page, limit, reqPayload } = data;
    try {
      const response = await apiCall("POST", `project/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `project/list`);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  }
}


async function projectmanagementSearch(data) {
  try {
    const response = await apiCall("POST", `project/list` , data);
    return response;
  } catch (error) {
    console.error("clientlist:", error);
    return Promise.reject(error);
  }
}
async function projectmanagementdashboard(data) {
  try {
    const response = await apiCall("POST", `project/dashboard` , data);
    return response;
  } catch (error) {
    console.error("clientlist:", error);
    return Promise.reject(error);
  }
}


async function getprojectmanagementByIdFunc(data) {
  if (data) {
    const { page, limit, reqPayload } = data;
    try {
      const response = await apiCall("POST", `project/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `project/list`);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  }
}



async function createprojectmanagementFunc(data) {
  try {
    const response = await apiCall("POST", "project/create", data);
    if (response) {
      return { clientinfo: response };
    }
  } catch (error) {
    console.error("create client error:", error);
    return Promise.reject(error);
  }
}

async function getprojectmanagementDetails(data) {


  try {
    const response = await apiCall("POST", "project/detail", data);
    return response;
  } catch (error) {
    console.error("gettaskDetails:", error);
    return Promise.reject(error);
  }
}

async function updateprojectmanagementFunc(data) {
  try {
    const response = await apiCall("POST", "project/update", data);
    return response;
  } catch (error) {
    console.error("updatetask:", error);
    return Promise.reject(error);
  }
}

async function deleteprojectmanagementFunc(data) {
  try {
    const response = await apiCall("POST", "project/delete", data);
    return response;
  } catch (error) {
    console.error("deletetask:", error);
    return Promise.reject(error);
  }
}
async function statusprojectmanagementFunc(data) {
  try {
    const response = await apiCall("POST", "project/status", data);
    return response;
  } catch (error) {
    console.error("deletetask:", error);
    return Promise.reject(error);
  }
}



export const projectmanagementServices = {
  getprojectmanagementList,
  getprojectmanagementByIdFunc,
  createprojectmanagementFunc,
  getprojectmanagementDetails,
  updateprojectmanagementFunc,
  deleteprojectmanagementFunc,
  statusprojectmanagementFunc,
  projectmanagementSearch,
  projectmanagementdashboard
};
