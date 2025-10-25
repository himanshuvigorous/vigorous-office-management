import { apiCall } from "../../../../config/Http";


async function getProjectTaskList(data) {

  if (data) {
    const { page, limit, reqPayload } = data
    try {
      const response = await apiCall("POST", `project/task/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("Project Task List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `project/task/list`);
      return response;
    } catch (error) {
      console.error("Project Task List:", error);
      return Promise.reject(error);
    }
  }
}

async function projectTaskSearch(data) {

  try {
    const response = await apiCall("POST", "project/task/list", data);
    return response;
  } catch (error) {
    console.error("Project Task List:", error);
    return Promise.reject(error);
  }
}
async function getProjectTaskDetails(data) {

  try {
    const response = await apiCall("POST", "project/task/detail", data);
    return response;
  } catch (error) {
    console.error("Project Task:", error);
    return Promise.reject(error);
  }
}
async function createProjectTaskFunc(data) {

  try {
    const response = await apiCall("POST", "project/task/create", data);
    return response;
  } catch (error) {
    console.error("Project Task error:", error);
    return Promise.reject(error);
  }
}
async function updateProjectTaskFunc(data) {

  try {
    const response = await apiCall("POST", "project/task/update", data);
    return response;
  } catch (error) {
    console.error("Project Task error:", error);
    return Promise.reject(error);
  }
}
async function deleteProjectTaskFunc(data) {

  try {
    const response = await apiCall("POST", "project/task/delete", data);
    return response;
  } catch (error) {
    console.error("Project Task error:", error);
    return Promise.reject(error);
  }
}
async function statusProjectTaskFunc(data) {

  try {
    const response = await apiCall("POST", "project/task/status", data);
    return response;
  } catch (error) {
    console.error("Project Task error:", error);
    return Promise.reject(error);
  }
}
async function logsofProjectTaskFunc(data) {

  try {
    const response = await apiCall("POST", "project/task/log/update", data);
    return response;
  } catch (error) {
    console.error("Project Task error:", error);
    return Promise.reject(error);
  }
}
async function diretorProjectDashboardFunc (data) {

  try {
    const response = await apiCall("POST", "project/task/dashboard", data);
    return response;
  } catch (error) {
    console.error("Project Task error:", error);
    return Promise.reject(error);
  }
}
async function employeeProjectdashbord (data) {

  try {
    const response = await apiCall("POST", "project/task/report", data);
    return response;
  } catch (error) {
    console.error("Project Task error:", error);
    return Promise.reject(error);
  }
}

export const projectTaskServices = {
  getProjectTaskList,
  getProjectTaskDetails,
  createProjectTaskFunc,
  updateProjectTaskFunc,
  deleteProjectTaskFunc,
  projectTaskSearch,
  statusProjectTaskFunc,
  logsofProjectTaskFunc,
  diretorProjectDashboardFunc,
  employeeProjectdashbord

};