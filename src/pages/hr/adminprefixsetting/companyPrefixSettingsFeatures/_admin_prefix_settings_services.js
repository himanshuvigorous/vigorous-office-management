import { apiCall } from "../../../../config/Http";




async function getAdminPrefixDetails(data) {

  try {
    const response = await apiCall("POST", "master/admin/setting/detail", data);
    return response;
  } catch (error) {
    console.error("leave Type:", error);
    return Promise.reject(error);
  }
}
async function updateAdminPrefix(data) {
  try {
    const response = await apiCall("POST", "master/admin/setting/create", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}

export const AdminPrefixServices = {
  getAdminPrefixDetails,
  updateAdminPrefix,
};