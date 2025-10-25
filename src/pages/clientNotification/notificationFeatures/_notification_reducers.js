import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { notificationServices } from "./_notification_services";
import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager";

export const getNotificationList = createAsyncThunk(
  "notification/notificationList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await notificationServices.getNotificationList(reqData);
      return response;
    } catch (error) {
      showNotification({
        message: error?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const notificationSearch = createAsyncThunk(
  "notification/notificationSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await notificationServices.notificationSearch(reqData);
      return response;
    } catch (error) {
      showNotification({
        message: error?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const createNotification = createAsyncThunk(
  "notification/createNotification",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await notificationServices.createNotification(reqData);
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const getNotificationDetails = createAsyncThunk(
  "notification/getNotificationDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await notificationServices.getNotificationDetails(reqData);
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const updateNotification = createAsyncThunk(
  "notification/updateNotification",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await notificationServices.updateNotification(reqData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notification/deleteNotification",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await notificationServices.deleteNotification(reqData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notificationList: [],
    loading: false,
    totalNotificationCount: 0
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNotificationList.pending, (state, action) => {
        state.loading = true;
        state.notificationList = [];
        state.totalNotificationCount = 0;
      })
      .addCase(getNotificationList.fulfilled, (state, action) => {
        state.notificationList = action.payload?.data?.docs;
        state.totalNotificationCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getNotificationList.rejected, (state, action) => {
        state.loading = false;
        state.notificationList = [];
        state.totalNotificationCount = 0;
      })
      .addCase(notificationSearch.pending, (state, action) => {
        state.loading = true;
        state.notificationList = [];
        state.totalNotificationCount = 0;
      })
      .addCase(notificationSearch.fulfilled, (state, action) => {
        state.notificationList = action.payload?.data?.docs;
        state.totalNotificationCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(notificationSearch.rejected, (state, action) => {
        state.loading = false;
        state.notificationList = [];
        state.totalNotificationCount = 0;
      })
      .addCase(createNotification.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.notificationList = action.payload?.data?.list;
        state.totalNotificationCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.loading = false;
        state.notificationList = [];
        state.totalNotificationCount = 0;
      })
      .addCase(getNotificationDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getNotificationDetails.fulfilled, (state, action) => {
        state.visitorDetails = action.payload?.data;
        state.loading = false;
      })
      .addCase(getNotificationDetails.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export default notificationSlice.reducer;
