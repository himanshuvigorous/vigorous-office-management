import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { projectCategoryServices } from "./_projectCategory_services";









export const projectCategorySearch = createAsyncThunk(
  "getprojectCategoryList/projectCategorySearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectCategoryServices.projectCategorySearch(reqData);
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



export const getprojectCategoryListFunc = createAsyncThunk(
  "getprojectCategoryList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectCategoryServices.getprojectCategoryList(reqData);
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




export const createprojectCategoryFunc = createAsyncThunk(
  "createprojectCategoryFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await projectCategoryServices.createprojectCategoryFunc(reqData);
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

export const getprojectCategoryDetails = createAsyncThunk(
  "/company/getprojectCategoryDetails",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await projectCategoryServices.getprojectCategoryDetails(reqData);
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

export const updateprojectCategoryFunc = createAsyncThunk(
  "/updateprojectCategoryFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectCategoryServices.updateprojectCategoryFunc(reqData);
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

export const deleteprojectCategoryFunc = createAsyncThunk(
  "/deleteprojectCategoryFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectCategoryServices.deleteprojectCategoryFunc(reqData);
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




const projectCategorySlice = createSlice({
  name: 'taskManagement',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getprojectCategoryListFunc.pending, (state, action) => {
        state.loading = true;
        state.projectCategoryList = [];
        state.totalprojectCategoryCount = 0;
      })
      .addCase(getprojectCategoryListFunc.fulfilled, (state, action) => {
        state.projectCategoryList = action.payload?.data?.docs;
        state.totalprojectCategoryCount = action.payload?.data?.totalDocs;
        state.projectCategoryDetailsData = null;
        state.loading = false;
      })
      .addCase(getprojectCategoryListFunc.rejected, (state, action) => {
        state.loading = false;
        state.projectCategoryList = [];
        state.totalprojectCategoryCount = 0;
      })
      .addCase(createprojectCategoryFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createprojectCategoryFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.createprojectCategoryData = action.payload?.projectCategoryinfo?.data;
      })
      .addCase(createprojectCategoryFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateprojectCategoryFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateprojectCategoryFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.hrupdateData = action.payload;
      })
      .addCase(updateprojectCategoryFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteprojectCategoryFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteprojectCategoryFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.userdeleteData = action.payload;
      })
      .addCase(deleteprojectCategoryFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getprojectCategoryDetails.pending, (state, action) => {
        state.loading = true;
        state.projectCategoryDetailsData = null;
      })
      .addCase(getprojectCategoryDetails.fulfilled, (state, action) => {
        state.projectCategoryDetailsData = action.payload?.data;
        state.loading = false;
      })
      .addCase(getprojectCategoryDetails.rejected, (state, action) => {
        state.loading = false;
        state.projectCategoryDetailsData = null;
      })




    

      .addCase(projectCategorySearch.pending, (state, action) => {
        state.loading = true;
        state.gstTypeSearch = null;
      })
      .addCase(projectCategorySearch.fulfilled, (state, action) => {
        state.projectCategoryList = action.payload?.data?.docs;
        state.totalprojectCategoryCount = action.payload?.data?.totalDocs;
        state.projectCategoryDetailsData = null;
        state.loading = false;
      })
      .addCase(projectCategorySearch.rejected, (state, action) => {
        state.loading = false;
        state.projectCategoryList = [];
        state.totalprojectCategoryCount = 0;
      })
      
  },
});

export default projectCategorySlice.reducer;
