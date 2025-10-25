import { apiCall } from "../../../config/Http";


async function getSupportList(data) {
  if (data) {
    const { page, limit } = data;
    try {
      const response = await apiCall("POST", `master/others/support/list?page=${page}&limit=${limit}`, data);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `master/others/support/list`);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  }
}

async function SupportSearch(data) {
  try {
    const response = await apiCall("POST", `master/others/support/list`,data);
    return response;
  } catch (error) {
    console.error("create client error:", error);
    return Promise.reject(error);
  }
}
async function createSupportModalFunc(data) {
  try {
    const response = await apiCall("POST", "master/others/support/create", data);
    if (response) {
      return { clientinfo: response };
    }
  } catch (error) {
    console.error("create client error:", error);
    return Promise.reject(error);
  }
}

async function getSupportDetails(data) {


  try {
    const response = await apiCall("POST", "master/others/support/detail", data);
    return response;
  } catch (error) {
    console.error("getSupportDetails:", error);
    return Promise.reject(error);
  }
}

async function updateSupportFunc(data) {
  try {
    const response = await apiCall("POST", "master/others/support/update", data);
    return response;
  } catch (error) {
    console.error("updateSupport:", error);
    return Promise.reject(error);
  }
}

async function deleteSupportFunc(data) {
  try {
    const response = await apiCall("POST", "master/others/support/delete", data);
    return response;
  } catch (error) {
    console.error("deleteSupport:", error);
    return Promise.reject(error);
  }
}
async function statusupdateSupportFunc(data) {
  try {
    const response = await apiCall("POST", "master/others/support/status", data);
    return response;
  } catch (error) {
    console.error("deleteSupport:", error);
    return Promise.reject(error);
  }
}



export const SupportServices = {
  getSupportList,
  createSupportModalFunc,
  getSupportDetails,
  updateSupportFunc,
  deleteSupportFunc,
  statusupdateSupportFunc,
  SupportSearch
};
