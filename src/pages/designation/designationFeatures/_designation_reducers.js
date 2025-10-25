import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager";
import { designationServices } from "./_designation_services";

export const getDesignationList = createAsyncThunk(
  "user/getDesignationList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await designationServices.getDesignationList(reqData);
      return respose;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const designationSearch = createAsyncThunk(
  "user/designationSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await designationServices.designationSearch(reqData);
      return respose;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const getDesignationDetails = createAsyncThunk(
  "user/getDesignationDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await designationServices.getDesignationDetails(reqData);
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

export const createDesignation = createAsyncThunk(
  "user/createDesignation",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await designationServices.createDesignation(reqData);
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

export const updateDesignation = createAsyncThunk(
  "user/updateDesignation",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await designationServices.updateDesignation(reqData);
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
export const deleteDesignation = createAsyncThunk(
  "user/deleteDesignation",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await designationServices.deleteDesignation(reqData);
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

export const getDesignationRole = createAsyncThunk(
  "user/getDesignationRole",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await designationServices.getDesignationRole(reqData);
      // showNotification({
      //   message: response?.message,
      //   type: 'success',
      // });
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




// designationroles

const designationSlice = createSlice({
  name: 'designation',
  initialState: {
    designationList: [],
    totalDesignationCount: 0,
    designationDetails: {}
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getDesignationList.pending, (state, action) => {
        state.loading = true;
        state.designationList = [];
        state.totalDesignationCount = 0;
      })
      .addCase(getDesignationList.fulfilled, (state, action) => {
        state.designationList = action.payload?.data?.docs;
        state.totalDesignationCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getDesignationList.rejected, (state, action) => {
        state.loading = false;
        state.designationList = [];
        state.totalDesignationCount = 0;
      })
      .addCase(designationSearch.pending, (state, action) => {
        state.loading = true;
        state.designationList = [];
        state.totalDesignationCount = 0;
      })
      .addCase(designationSearch.fulfilled, (state, action) => {
        state.designationList = action.payload?.data?.docs;
        state.totalDesignationCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(designationSearch.rejected, (state, action) => {
        state.loading = false;
        state.designationList = [];
        state.totalDesignationCount = 0;
      })
      .addCase(createDesignation.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDesignation.fulfilled, (state, action) => {
        state.loading = false;
        state.GstTypeCreateData = action.payload;
      })
      .addCase(createDesignation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateDesignation.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDesignation.fulfilled, (state, action) => {
        state.loading = false;
        state.GstTypeUpdateData = action.payload;
      })
      .addCase(updateDesignation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteDesignation.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDesignation.fulfilled, (state, action) => {
        state.loading = false;
        state.GstTypetDeleteData = action.payload;
      })
      .addCase(deleteDesignation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getDesignationDetails.pending, (state) => {
        state.loading = true;
        state.designationDetails = null;
      })
      .addCase(getDesignationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.designationDetails = action.payload?.data;
      })
      .addCase(getDesignationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.designationDetails = null;
      })




      .addCase(getDesignationRole.pending, (state) => {
        state.loading = true;
        state.designationRoleData = null;
      })
      .addCase(getDesignationRole.fulfilled, (state, action) => {
        state.loading = false;
        state.designationRoleData = action.payload?.data;
      })
      .addCase(getDesignationRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.designationRoleData = null;
      })


      
  },
});

export default designationSlice.reducer;
