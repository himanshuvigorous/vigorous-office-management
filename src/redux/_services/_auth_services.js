import { encryptObject } from "../../config/Encryption";
import { apiCall } from "../../config/Http";
import { domainName } from "../../constents/global";
import { showNotification } from "../../global_layouts/CustomNotification/NotificationManager";


async function login(data) {
  try {
    const user = await apiCall("POST", "login", data);
    if (user) {
      localStorage.setItem(`user_info_${domainName}`, JSON.stringify(user?.data));
      localStorage.setItem(`user_Profile`, JSON.stringify({
        profileImage: user?.data?.profileImage ,
        fullName : user?.data?.fullName,
        _id : user?.data?._id,
        companyProfileImg : user?.data?.companyProfileImg
      }));
      localStorage.setItem("token", JSON.stringify(user?.token))
      return  user 
    }
  } catch (error) {
    console.error("Login error:", error);
    return Promise.reject(error);
  }
}

async function logoutUser(data) {
  try {
    const user = await apiCall("POST", `logout`, data);
     return user
  } catch (error) {
    console.error("Login error:", error);
    return Promise.reject(error);
  }
}


async function reload(data) {
  try {
    const user = await apiCall("POST", `clear-cache`, data);
     return user
  } catch (error) {
    console.error("reload error:", error);
    return Promise.reject(error);
  }
}


async function authToken(data) {
  try {
    const user = await apiCall("POST", "authtoken/verify", data);
    if (user) {
      localStorage.setItem(`user_info_${domainName}`, JSON.stringify(user?.data));
      localStorage.setItem(`user_Profile`, JSON.stringify({
        profileImage: user?.data?.profileImage ,
        fullName : user?.data?.fullName,
        _id : user?.data?._id
      }));
      localStorage.setItem("token", JSON.stringify(user?.token))
      return { userinfo: user };
    }
  } catch (error) {
    console.error("Login error:", error);
    return Promise.reject(error);
  }
}
async function getAuthData(data) {
  try {
    const user = await apiCall("POST", "authUser", data);
    if (user) {
      localStorage.setItem(`user_Profile`, JSON.stringify({
        profileImage: user?.data?.profileImage ,
        fullName : user?.data?.fullName,
        _id : user?.data?._id,
        companyProfileImg: user?.data?.companyData?.profileImage
      }));
      return { userinfo: user };
    }
  } catch (error) {
    console.error("authData error:", error);
    return Promise.reject(error);
  }
}
async function getUserDetailsForLogin(data) {
  try {
    const user = await apiCall("POST", "user/detail", data);
    if (user) {
      return { userinfo: user };
    }
  } catch (error) {
    console.error("authData error:", error);
    return Promise.reject(error);
  }
}
async function ProfileImageUpdate(data) {

  try {
    const user = await apiCall("POST", "profileImage/update", data);
    if (user) {
      return { userinfo: user };
    }
  } catch (error) {
    console.error("Login error:", error);
    return Promise.reject(error);
  }
}
async function changePasswordFunc(data) {

  try {


    const user = await apiCall("POST", "common/changePassword", data);


    if (user) {

      return user
    }
  } catch (error) {
    console.error("Login error:", error);
    return Promise.reject(error);
  }
}
async function sendOtpFunc(data) {

  try {


    const user = await apiCall("POST", "auth/forgot/sendotp", data);


    if (user) {

      return user
    }
  } catch (error) {
    console.error("Login error:", error);
    return Promise.reject(error);
  }
}
async function verifyOtpFunc(data) {

  try {


    const user = await apiCall("POST", "auth/forgot/verifyotp", data);


    if (user) {

      return user
    }
  } catch (error) {
    console.error("Login error:", error);
    return Promise.reject(error);
  }
}
async function restPassowrdFunc(data) {

  try {


    const user = await apiCall("POST", "auth/forgot/resetPassword", data);


    if (user) {

      return user
    }
  } catch (error) {
    console.error("Login error:", error);
    return Promise.reject(error);
  }
}

function logout() {
  showNotification({
    message: "SuccessFully Logout",
  })
  localStorage.clear();
  window.location.href("/login")
    if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'LOGOUT' }));
      }
}


export const authServices = {
  login,
  logout,
  changePasswordFunc,
  sendOtpFunc,
  verifyOtpFunc,
  restPassowrdFunc,
  ProfileImageUpdate,
  getAuthData,
  authToken,
  getUserDetailsForLogin,
  logoutUser,
  reload,
};