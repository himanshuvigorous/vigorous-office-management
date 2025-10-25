import { apiCall } from "../../../../config/Http";




async function getHrmsSettingsDetails(data) {

  try {
    const response = await apiCall("POST", "master/setting/detail", data);
    return response;
  } catch (error) {
    console.error("leave Type:", error);
    return Promise.reject(error);
  }
}
async function updateHrmsSettings(data) {
  try {
    const response = await apiCall("POST", "master/setting/create", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}

export const hrmsSettingsServices = {
  getHrmsSettingsDetails,
  updateHrmsSettings,
};