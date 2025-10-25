import { apiCall, apiCallForm } from "../../../config/Http";


async function getApplicationList(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall("POST", `employe/recruitment/application/list?page=${currentPage}&limit=${pageSize}`, reqPayload);
      return response;
    } catch (error) {
      console.error("Employelist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/recruitment/application/list`);
      return response;
    } catch (error) {
      console.error("companylist:", error);
      return Promise.reject(error);
    }
  }
}

async function getRoleList() {
  try {
    const response = await apiCall("POST", `roles/list`);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}

async function applicationSearch(data) {
  try {
    const response = await apiCall("POST", "employe/recruitment/application/list", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}

async function createApplication(data) {
  try {
    const response = await apiCall("POST", "employe/recruitment/application/create", data);
    return response;
  } catch (error) {
    console.error("branch create error:", error);
    return Promise.reject(error);
  }
}

async function statusApplication(data) {
  try {
    const response = await apiCall("POST", "employe/recruitment/application/status", data);
    return response;
  } catch (error) {
    console.error("branch create error:", error);
    return Promise.reject(error);
  }
}

async function updateApplicationFunc(data) {
  try {
    const response = await apiCall("POST", "employe/recruitment/application/update", data);
    return response;
  } catch (error) {
    console.error("branch create error:", error);
    return Promise.reject(error);
  }
}

async function getApplicationDetails(data) {


  try {
    const response = await apiCall("POST", "employe/recruitment/application/detail", data);
    return response;
  } catch (error) {
    console.error("getApplicationDetails:", error);
    return Promise.reject(error);
  }
}

async function getEmployeDetails(data) {


  try {
    const response = await apiCall("POST", "employe/detail", data);
    return response;
  } catch (error) {
    console.error("getbranchDetails:", error);
    return Promise.reject(error);
  }
}

async function updateEmploye(data) {
  try {
    const response = await apiCall("POST", "employe/update", data);
    return response;
  } catch (error) {
    console.error("update branch:", error);
    return Promise.reject(error);
  }
}

async function deleteApplication(data) {
  try {
    const response = await apiCall("POST", "employe/recruitment/application/delete", data);
    return response;
  } catch (error) {
    console.error("deletecompany:", error);
    return Promise.reject(error);
  }
}

export const applicationServices = {
  getApplicationList,
  getRoleList,
  applicationSearch,
  createApplication,
  getEmployeDetails,
  updateEmploye,
  deleteApplication,
  updateApplicationFunc,
  getApplicationDetails,
  statusApplication,
};
