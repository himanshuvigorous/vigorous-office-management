import { apiCall } from "../../../../config/Http";




async function getprojectservicesList(data) {
  if (data) {
    const { page, limit, reqPayload } = data;
    try {
      const response = await apiCall("POST", `master/projectExpense/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `master/projectExpense/list`);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  }
}


async function projectservicesSearch(data) {
  try {
    const response = await apiCall("POST", `master/projectExpense/list` , data);
    return response;
  } catch (error) {
    console.error("clientlist:", error);
    return Promise.reject(error);
  }
}


async function getprojectservicesByIdFunc(data) {
  if (data) {
    const { page, limit, reqPayload } = data;
    try {
      const response = await apiCall("POST", `master/projectExpense/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `master/projectExpense/list`);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  }
}



async function createprojectservicesFunc(data) {
  try {
    const response = await apiCall("POST", "master/projectExpense/create", data);
    if (response) {
      return { clientinfo: response };
    }
  } catch (error) {
    console.error("create client error:", error);
    return Promise.reject(error);
  }
}

async function getprojectservicesDetails(data) {


  try {
    const response = await apiCall("POST", "master/projectExpense/detail", data);
    return response;
  } catch (error) {
    console.error("gettaskDetails:", error);
    return Promise.reject(error);
  }
}

async function updateprojectservicesFunc(data) {
  try {
    const response = await apiCall("POST", "master/projectExpense/update", data);
    return response;
  } catch (error) {
    console.error("updatetask:", error);
    return Promise.reject(error);
  }
}

async function deleteprojectservicesFunc(data) {
  try {
    const response = await apiCall("POST", "master/projectExpense/delete", data);
    return response;
  } catch (error) {
    console.error("deletetask:", error);
    return Promise.reject(error);
  }
}
async function statusprojectservicesFunc(data) {
  try {
    const response = await apiCall("POST", "master/projectExpense/status", data);
    return response;
  } catch (error) {
    console.error("deletetask:", error);
    return Promise.reject(error);
  }
}



export const projectservicesServices = {
  getprojectservicesList,
  getprojectservicesByIdFunc,
  createprojectservicesFunc,
  getprojectservicesDetails,
  updateprojectservicesFunc,
  deleteprojectservicesFunc,
  statusprojectservicesFunc,
  projectservicesSearch,
};
