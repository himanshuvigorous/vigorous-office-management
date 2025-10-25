import { apiCall } from "../../config/Http";


async function adminDashboard(data) {

  try {
    const user = await apiCall("POST", "dashboard", data);
    if (user) {
    return user
    }
  } catch (error) {
    console.error("Login error:", error);
    return Promise.reject(error);
  }
}
async function companyDashboard(data) {

  try {
    const user = await apiCall("POST", "company/dahsboard", data);
    if (user) {
    return user
    }
  } catch (error) {
    console.error("Login error:", error);
    return Promise.reject(error);
  }
}
async function hrDashboardFunc(data) {

  try {
    const user = await apiCall("POST", "employe/hrmsDashboard", data);
    if (user) {
    return user
    }
  } catch (error) {
    console.error("Login error:", error);
    return Promise.reject(error);
  }
}
async function employeeDashboardFunc(data) {

  try {
    const user = await apiCall("POST", "employe/dashboard", data);
    if (user) {
    return user
    }
  } catch (error) {
    console.error("Login error:", error);
    return Promise.reject(error);
  }
}



export const dashboardServices = {
  adminDashboard,
  companyDashboard,
  hrDashboardFunc,
  employeeDashboardFunc
};