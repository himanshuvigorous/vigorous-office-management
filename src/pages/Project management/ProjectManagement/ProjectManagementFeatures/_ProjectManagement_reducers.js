import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { projectmanagementServices } from "./_ProjectManagement_services";










export const projectmanagementSearch = createAsyncThunk(
  "getprojectmanagementList/projectmanagementSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectmanagementServices.projectmanagementSearch(reqData);
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
export const projectmanagementdashboard = createAsyncThunk(
  "getprojectmanagementList/projectmanagementdashboard",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectmanagementServices.projectmanagementdashboard(reqData);
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



export const getprojectmanagementListFunc = createAsyncThunk(
  "getprojectmanagementList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectmanagementServices.getprojectmanagementList(reqData);
   
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




export const createprojectmanagementFunc = createAsyncThunk(
  "createprojectmanagementFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await projectmanagementServices.createprojectmanagementFunc(reqData);
      showNotification({
        message: response?.taskinfo?.message,
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

export const getprojectmanagementDetails = createAsyncThunk(
  "/company/getprojectmanagementDetails",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await projectmanagementServices.getprojectmanagementDetails(reqData);
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

export const updateprojectmanagementFunc = createAsyncThunk(
  "/updateprojectmanagementFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectmanagementServices.updateprojectmanagementFunc(reqData);
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

export const deleteprojectmanagementFunc = createAsyncThunk(
  "/deleteprojectmanagementFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectmanagementServices.deleteprojectmanagementFunc(reqData);
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
export const statusprojectmanagementFunc = createAsyncThunk(
  "/statusprojectmanagementFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectmanagementServices.statusprojectmanagementFunc(reqData);
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




const projectmanagementSlice = createSlice({
  name: 'taskManagement',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getprojectmanagementListFunc.pending, (state, action) => {
        state.loading = true;
        state.projectmanagementList = [];
        state.totalprojectmanagementCount = 0;
      })
      .addCase(getprojectmanagementListFunc.fulfilled, (state, action) => {
        state.projectmanagementList = action.payload?.data?.docs;
        state.totalprojectmanagementCount = action.payload?.data?.totalDocs;
        state.projectmanagementDetailsData = null;
        state.loading = false;
      })
      .addCase(getprojectmanagementListFunc.rejected, (state, action) => {
        state.loading = false;
        state.projectmanagementList = [];
        state.totalprojectmanagementCount = 0;
      })
      .addCase(createprojectmanagementFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createprojectmanagementFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.createprojectmanagementData = action.payload?.projectmanagementinfo?.data;
      })
      .addCase(createprojectmanagementFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateprojectmanagementFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateprojectmanagementFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.hrupdateData = action.payload;
      })
      .addCase(updateprojectmanagementFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteprojectmanagementFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteprojectmanagementFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.userdeleteData = action.payload;
      })
      .addCase(deleteprojectmanagementFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(statusprojectmanagementFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(statusprojectmanagementFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.usersttatusData = action.payload;
      })
      .addCase(statusprojectmanagementFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getprojectmanagementDetails.pending, (state, action) => {
        state.loading = true;
        state.projectmanagementDetailsData = null;
      })
      .addCase(getprojectmanagementDetails.fulfilled, (state, action) => {
        state.projectmanagementDetailsData = action.payload?.data;
        state.loading = false;
      })
      .addCase(getprojectmanagementDetails.rejected, (state, action) => {
        state.loading = false;
        state.projectmanagementDetailsData = null;
      })
      .addCase(projectmanagementdashboard.pending, (state, action) => {
        state.loading = true;
        state.projectmanagementdashboardData = null;
      })
      .addCase(projectmanagementdashboard.fulfilled, (state, action) => {
        state.projectmanagementdashboardData = action.payload?.data;
        state.loading = false;
      })
      .addCase(projectmanagementdashboard.rejected, (state, action) => {
        state.loading = false;
        state.projectmanagementdashboardData = null;
      })




    

      .addCase(projectmanagementSearch.pending, (state, action) => {
        state.loading = true;
        state.gstTypeSearch = null;
      })
      .addCase(projectmanagementSearch.fulfilled, (state, action) => {
        state.projectmanagementList = action.payload?.data?.docs;
        state.totalprojectmanagementCount = action.payload?.data?.totalDocs;
        state.projectmanagementDetailsData = null;
        state.loading = false;
      })
      .addCase(projectmanagementSearch.rejected, (state, action) => {
        state.loading = false;
        state.projectmanagementList = [];
        state.totalprojectmanagementCount = 0;
      })
      
  },
});

export default projectmanagementSlice.reducer;
