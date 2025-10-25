import { apiCall } from "../../../../config/Http";




async function getprojectCategoryList(data) {
  if (data) {
    const { page, limit, reqPayload } = data;
    try {
      const response = await apiCall("POST", `master/projectCategory/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `master/projectCategory/list`);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  }
}


async function projectCategorySearch(data) {
  try {
    const response = await apiCall("POST", `master/projectCategory/list` , data);
    return response;
  } catch (error) {
    console.error("clientlist:", error);
    return Promise.reject(error);
  }
}


async function getprojectCategoryByIdFunc(data) {
  if (data) {
    const { page, limit, reqPayload } = data;
    try {
      const response = await apiCall("POST", `master/projectCategory/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `master/projectCategory/list`);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  }
}



async function createprojectCategoryFunc(data) {
  try {
    const response = await apiCall("POST", "master/projectCategory/create", data);
    if (response) {
      return { clientinfo: response };
    }
  } catch (error) {
    console.error("create client error:", error);
    return Promise.reject(error);
  }
}

async function getprojectCategoryDetails(data) {


  try {
    const response = await apiCall("POST", "master/projectCategory/detail", data);
    return response;
  } catch (error) {
    console.error("gettaskDetails:", error);
    return Promise.reject(error);
  }
}

async function updateprojectCategoryFunc(data) {
  try {
    const response = await apiCall("POST", "master/projectCategory/update", data);
    return response;
  } catch (error) {
    console.error("updatetask:", error);
    return Promise.reject(error);
  }
}

async function deleteprojectCategoryFunc(data) {
  try {
    const response = await apiCall("POST", "master/projectCategory/delete", data);
    return response;
  } catch (error) {
    console.error("deletetask:", error);
    return Promise.reject(error);
  }
}
async function statusprojectCategoryFunc(data) {
  try {
    const response = await apiCall("POST", "master/projectCategory/status", data);
    return response;
  } catch (error) {
    console.error("deletetask:", error);
    return Promise.reject(error);
  }
}



export const projectCategoryServices = {
  getprojectCategoryList,
  getprojectCategoryByIdFunc,
  createprojectCategoryFunc,
  getprojectCategoryDetails,
  updateprojectCategoryFunc,
  deleteprojectCategoryFunc,
  statusprojectCategoryFunc,
  projectCategorySearch,
};
