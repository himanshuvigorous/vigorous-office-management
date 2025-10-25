import axios from "axios";
import { showNotification } from "../global_layouts/CustomNotification/NotificationManager";
import { decrypt, decryptObject, encryptObject } from "./Encryption";


export const baseUrl = {
    // BACKEND_URL: 'https://secondapi.cric365day1.com/v1/api',
    // BACKEND_URL: `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/api/v1/admin/`,
    BACKEND_URL: `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/api/v1/admin/`,
    // BACKEND_URL: `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/api/v1/admin/`,
    //  https://secondapi.cric365day1.com/public
    //
};

function authHeader() {
    const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null;
    if (token) {
        return { 'Authorization': 'Bearer ' + token };
    } else {
        return {};
    }
}

export const apiCall = async (method, path, payload) => {

    try {
        const response = await axios({
            method,
            url: baseUrl.BACKEND_URL + path,
            data: payload,
            headers: {
                'Content-Type': 'application/json',
                ...authHeader(),
            },
        });
        return response.data;
    } catch (error) {

        if (Number(error?.response?.data?.code) === 3 || Number(error?.response?.status) === 401) {
            localStorage.clear();
            window.location.href = '/login';
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'LOGOUT' }));
            }
            // showNotification({
            //     message: 'No response received from the server',
            //     type: 'error',
            // });
            throw error.response
        } else if (Number(error?.response?.status) === 413) {

            !error?.response?.data?.message && showNotification({
                message: 'Size Too large',
                type: 'error',
            });
            throw error.response

        }

        else if (error.response) {
            throw error.response;
        } else if (error.request) {
            showNotification({
                message: 'No response received from the server',
                type: 'error',
            });
            throw error.request;
        } else {
            console.error(error, "Error occurred during request setup");
            throw new Error(error.message);
        }
    }
};

export const apiCallForm = async (method, path, payload) => {

    try {
        const response = await axios({
            method,
            url: baseUrl.BACKEND_URL + path,
            data: payload,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...authHeader(),
            },
        })


        return response.data;
    } catch (error) {
        if (Number(error?.response?.data?.code) === 3 || Number(error?.response?.status) === 401) {
            localStorage.clear();
            window.location.href = '/login';
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'LOGOUT' }));
            }
            throw error.response
        } else if (Number(error?.response?.status) === 413) {

            !error?.response?.data?.message && showNotification({
                message: 'Size Too large',
                type: 'error',
            });
            throw error.response

        } else if (error.response) {
            throw error.response;
        } else if (error.request) {
            throw new Error('No response received from the server');
        } else {
            console.error(error, "Error occurred during request setup");
            throw new Error(error.message);
        }
    }
};
