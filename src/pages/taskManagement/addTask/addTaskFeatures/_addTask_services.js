import { apiCall } from "../../../../config/Http";


async function getTaskList(data) {
  if (data) {
    const { page, limit, reqPayload } = data;
    try {
      const response = await apiCall("POST", `task/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `task/list`);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  }
}



async function dashboardTaskReq(data) {

    try {
      const response = await apiCall("POST", `task/reqUpdate`, data);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  
}


async function taskSearch(data) {
  try {
    const response = await apiCall("POST", `task/list`,data);
    return response;
  } catch (error) {
    console.error("create client error:", error);
    return Promise.reject(error);
  }
}
async function createTaskFunc(data) {
  try {
    const response = await apiCall("POST", "task/create", data);
    if (response) {
      return { clientinfo: response };
    }
  } catch (error) {
    console.error("create client error:", error);
    return Promise.reject(error);
  }
}

async function gettaskDetails(data) {


  try {
    const response = await apiCall("POST", "task/detail", data);
    return response;
  } catch (error) {
    console.error("gettaskDetails:", error);
    return Promise.reject(error);
  }
}

async function updatetaskFunc(data) {
  try {
    const response = await apiCall("POST", "task/update", data);
    return response;
  } catch (error) {
    console.error("updatetask:", error);
    return Promise.reject(error);
  }
}

async function deletetaskFunc(data) {
  try {
    const response = await apiCall("POST", "task/delete", data);
    return response;
  } catch (error) {
    console.error("deletetask:", error);
    return Promise.reject(error);
  }
}
async function statusupdatetaskFunc(data) {
  try {
    const response = await apiCall("POST", "task/status", data);
    return response;
  } catch (error) {
    console.error("deletetask:", error);
    return Promise.reject(error);
  }
}



export const taskServices = {
  getTaskList,
  createTaskFunc,
  gettaskDetails,
  updatetaskFunc,
  deletetaskFunc,
  statusupdatetaskFunc,
  taskSearch,
  dashboardTaskReq
};
