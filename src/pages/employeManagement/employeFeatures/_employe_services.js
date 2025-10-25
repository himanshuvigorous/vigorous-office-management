import { apiCall, apiCallForm } from "../../../config/Http";


async function getEmployeList(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall("POST", `employe/list?page=${currentPage}&limit=${pageSize}`, reqPayload);
      return response;
    } catch (error) {
      console.error("Employelist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `employe/list`);
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

async function employeSearch(data) {
  try {
    const response = await apiCall("POST", "employe/list", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}

async function employeeTrailing(data) {
  try {
    const response = await apiCall("POST", "employe/profileChange", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}

async function createEmploye(data) {
  try {
    const response = await apiCall("POST", "employe/create", data);
    if (response) {
      return { companyinfo: response };
    }
  } catch (error) {
    console.error("branch create error:", error);
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

async function deleteEmploye(data) {
  try {
    const response = await apiCall("POST", "employe/delete", data);
    return response;
  } catch (error) {
    console.error("deletecompany:", error);
    return Promise.reject(error);
  }
}
async function statusEmployefunc(data) {
  try {
    const response = await apiCall("POST", "employe/status", data);
    return response;
  } catch (error) {
    console.error("deletecompany:", error);
    return Promise.reject(error);
  }
}

export const employeServices = {
  getEmployeList,
  getRoleList,
  employeSearch,
  createEmploye,
  getEmployeDetails,
  updateEmploye,
  deleteEmploye,
  statusEmployefunc,
  employeeTrailing
};
