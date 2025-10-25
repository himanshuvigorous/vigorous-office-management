import { apiCall } from "../../../../config/Http";


async function getTaskTypeList(data) {
  try {
    const { page, limit, reqPayload } = data;
    const response = await apiCall("POST", `master/taskType/list?page=${page}&limit=${limit}`, reqPayload);
    return response;
  } catch (error) {
    console.error("taskType List:", error);
    return Promise.reject(error);
  }
}

async function taskTypeSearch(data) {
  try {
    const response = await apiCall("POST", "master/taskType/list", data);
    return response;
  } catch (error) {
    console.error("desgination Type List:", error);
    return Promise.reject(error);
  }
}

async function getTaskTypeDetails(data) {
  try {
    const response = await apiCall("POST", "master/taskType/detail", data);
    return response;
  } catch (error) {
    console.error("taskType:", error);
    return Promise.reject(error);
  }
}

async function createTaskType(data) {
  try {
    const response = await apiCall("POST", "master/taskType/create", data);
    return response;
  } catch (error) {
    console.error("taskType error:", error);
    return Promise.reject(error);
  }
}

async function updateTaskType(data) {
  try {
    const response = await apiCall("POST", "master/taskType/update", data);
    return response;
  } catch (error) {
    console.error("taskType error:", error);
    return Promise.reject(error);
  }
}

async function deleteTaskType(data) {
  try {
    const response = await apiCall("POST", "master/taskType/delete", data);
    return response;
  } catch (error) {
    console.error("taskType error:", error);
    return Promise.reject(error);
  }
}

export const taskTypeServices = {
  getTaskTypeList,
  getTaskTypeDetails,
  createTaskType,
  updateTaskType,
  deleteTaskType,
  taskTypeSearch
};