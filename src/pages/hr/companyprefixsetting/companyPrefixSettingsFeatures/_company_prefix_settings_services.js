import { apiCall } from "../../../../config/Http";




async function updateCompanyPrefix(data) {

  try {
    const response = await apiCall("POST", "master/company/setting/create", data);
    return response;
  } catch (error) {
    console.error("leave Type:", error);
    return Promise.reject(error);
  }
}
async function getCompanyPrefixDetails(data) {
  try {
    const response = await apiCall("POST", "master/company/setting/detail", data);
    return response;
  } catch (error) {
    console.error("leave Type error:", error);
    return Promise.reject(error);
  }
}

export const CompanyPrefixServices = {
  getCompanyPrefixDetails,
  updateCompanyPrefix,
};