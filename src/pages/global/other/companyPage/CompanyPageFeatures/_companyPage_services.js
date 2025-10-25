import { apiCall } from "../../../../../config/Http";





async function getCompanyPageList(payload) {

  if(payload){
    const {currentPage , pageSize,data} = payload
  try {
    const response = await apiCall("POST", `page/list?page=${currentPage}&limit=${pageSize}`,data);
    return response;
  } catch (error) {
    console.error("Page List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `page/list`);
      return response;
    } catch (error) {
      console.error("Page List:", error);
      return Promise.reject(error);
    }
  }
}




// async function countrySearch(data) {
//   try {
//     const response = await apiCall("POST", "/searchCountry", data);
//     return response;
//   } catch (error) {
//     console.error("Country List:", error);
//     return Promise.reject(error);
//   }
// }

async function getCompanyPageById(data) {

  try {
    const response = await apiCall("POST", "page/detail", data);
    return response;
  } catch (error) {
    console.error("Page:", error);
    return Promise.reject(error);
  }
}
async function companyPageCreate(data) {

  try {
    const response = await apiCall("POST", "page/create", data);
    if (response) {

      return { userinfo: response };
    }
  } catch (error) {
    console.error("Country error:", error);
    return Promise.reject(error);
  }
}
async function companyPageUpdate(data) {

  try {
    const response = await apiCall("POST", "page/update", data);
    if (response) {

      return { userinfo: response };
    }
  } catch (error) {
    console.error("Country error:", error);
    return Promise.reject(error);
  }
}
async function companyPageDelete(data) {

  try {
    const response = await apiCall("POST", "page/delete", data);
    if (response) {

      return { userinfo: response };
    }
  } catch (error) {
    console.error("Country error:", error);
    return Promise.reject(error);
  }
}

export const companyPageServices = {
  getCompanyPageList,
  getCompanyPageById,
  companyPageCreate,
  companyPageUpdate,
  companyPageDelete,
  // countrySearch,
};