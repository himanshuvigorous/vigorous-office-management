import { apiCall, apiCallForm } from "../../../../config/Http";

async function directorList(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST", `company/director/list?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("directorList:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `company/director/list`);
      return response;
    } catch (error) {
      console.error("directorList:", error);
      return Promise.reject(error);
    }
  }
}

async function directorSearch(data) {
  try {
    const response = await apiCall("POST", "company/director/list", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}

async function deleteDirector(data) {
  try {
    const response = await apiCall("POST", "company/director/delete", data);
    return response;
  } catch (error) {
    console.error("deleteDirector:", error);
    return Promise.reject(error);
  }
}

async function directorCreate(data) {
  try {
    const response = await apiCall("POST", "company/director/create", data);
    return response;
  } catch (error) {
    console.error("company create error:", error);
    return Promise.reject(error);
  }
}

async function getDirectorDetails(data) {
  try {
    const response = await apiCall("POST", "company/director/detail", data);
    return response;
  } catch (error) {
    console.error("Director Details:", error);
    return Promise.reject(error);
  }
}

async function updateDirector(data) {
  try {
    const response = await apiCall("POST", "company/director/update", data);
    return response;
  } catch (error) {
    console.error("Update Director:", error);
    return Promise.reject(error);
  }
}
async function updateDirectorStatus(data) {
  try {
    const response = await apiCall("POST", "company/director/status", data);
    return response;
  } catch (error) {
    console.error("Update Director:", error);
    return Promise.reject(error);
  }
}


export const directorServices = {
  directorList,
  deleteDirector,
  directorCreate,
  getDirectorDetails,
  updateDirector,
  directorSearch,
  updateDirectorStatus
};
