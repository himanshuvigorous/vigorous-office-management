import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager";

import { applicationServices } from "./_application_services";

export const getApplicationList = createAsyncThunk(
  "getApplicationList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await applicationServices.getApplicationList(reqData);
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


export const applicationSearch = createAsyncThunk(
  "user/applicationSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await applicationServices.applicationSearch(reqData);
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

export const createApplication = createAsyncThunk(
  "createApplication",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await applicationServices.createApplication(reqData);
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


export const updateApplicationFunc = createAsyncThunk(
  "updateApplicationFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await applicationServices.updateApplicationFunc(reqData);
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

export const getApplicationDetails = createAsyncThunk(
  "getApplicationDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await applicationServices.getApplicationDetails(reqData);
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


export const deleteApplication = createAsyncThunk(
  "/deleteApplication",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await applicationServices.deleteApplication(reqData);
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

export const uploadDocFile = createAsyncThunk(
  'file/upload',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await applicationServices.uploadDocFile(formData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const statusApplication = createAsyncThunk(
  "statusApplication",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await applicationServices.statusApplication(reqData);
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


const applicationSlice = createSlice({
  name: 'applicationManagement',
  initialState: {
    applicationDetails: {},
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getApplicationList.pending, (state, action) => {
        state.loading = true;
        state.applicationList = [];
        state.totalApplicationCount = 0;
        
      })
      .addCase(getApplicationList.fulfilled, (state, action) => {
        state.applicationList = action.payload?.data?.docs;
        state.totalApplicationCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getApplicationList.rejected, (state, action) => {
        state.loading = false;
        state.applicationList = [];
        state.totalApplicationCount = 0;
      })
      .addCase(getApplicationDetails.pending, (state, action) => {
        state.loading = true;
        state.applicationDetails = [];
        state.totalApplicationCount = 0;
      })
      .addCase(getApplicationDetails.fulfilled, (state, action) => {

        state.applicationDetails = action.payload?.data;
        state.totalApplicationCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getApplicationDetails.rejected, (state, action) => {
        state.loading = false;
        state.applicationDetails = [];
        state.totalApplicationCount = 0;
      })
      .addCase(applicationSearch.pending, (state, action) => {
        state.loading = true;
        state.applicationList = [];
        state.totalEmployeCount = 0;
      })
      .addCase(applicationSearch.fulfilled, (state, action) => {
        state.applicationList = action.payload?.data?.docs;
        state.totalEmployeCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(applicationSearch.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(createApplication.pending, (state) => {
        state.loading = true;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.createApplicationData = action.payload;
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateApplicationFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateApplicationFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.hrupdateData = action.payload;
      })
      .addCase(updateApplicationFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteApplication.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.userdeleteData = action.payload;
      })
      .addCase(deleteApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(statusApplication.pending, (state) => {
        state.loading = true;
      })
      .addCase(statusApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.statusData = action.payload;
      })
      .addCase(statusApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export default applicationSlice.reducer;
