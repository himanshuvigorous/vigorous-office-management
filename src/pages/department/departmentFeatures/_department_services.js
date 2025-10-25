import { apiCall } from "../../../config/Http";


async function getDepartmentList(data) {
  try {
    const { page, limit, reqPayload } = data;
    const response = await apiCall("POST", `master/department/department/list?page=${page}&&limit=${limit}`, reqPayload);
    return response;
  } catch (error) {
    console.error("departmentList:", error);
    return Promise.reject(error);
  }
}

async function departmentSearch(data) {
  try {
    const response = await apiCall("POST", "master/department/department/list", data);
    return response;
  } catch (error) {
    console.error("departmentList:", error);
    return Promise.reject(error);
  }
}

async function getDepartmentById(data) {
  try {
    const response = await apiCall("POST", "master/department/department/detail", data);
    return response;
  } catch (error) {
    console.error("department:", error);
    return Promise.reject(error);
  }
}

async function DepartmentCreate(data) {
  try {
    const response = await apiCall("POST", "master/department/department/create", data);
    return response;
  } catch (error) {
    console.error("user create error:", error);
    return Promise.reject(error);
  }
}

async function DepartmentUpdate(data) {
  try {
    const response = await apiCall("POST", "master/department/department/update", data);
    return response;
  } catch (error) {
    console.error("user update error:", error);
    return Promise.reject(error);
  }
}

async function DepartmentDelete(data) {
  try {
    const response = await apiCall("POST", "master/department/department/delete", data);
    return response;
  } catch (error) {
    console.error("user update error:", error);
    return Promise.reject(error);
  }
}

export const DepartmentServices = {
  getDepartmentList,
  DepartmentCreate,
  DepartmentUpdate,
  DepartmentDelete,
  getDepartmentById,
  departmentSearch,
};