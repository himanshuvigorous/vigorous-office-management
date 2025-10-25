import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";
import { resignServices } from "./resignation_services";





export const getResignationList = createAsyncThunk(
  "user/getResignationList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await resignServices.getResignationList(reqData);
      return respose;
    } catch (error) {
      // showNotification({
      //   message: error?.data?.message,
      //   type: 'error',
      // });
      return rejectWithValue(error.message);
    }
  }
);

export const resignationSearch = createAsyncThunk(
  "user/resignationSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await resignServices.resignationSearch(reqData);
      return respose;
    } catch (error) {
      // showNotification({
      //   message: error?.data?.message,
      //   type: 'error',
      // });
      return rejectWithValue(error.message);
    }
  }
);

export const getResignationDetails = createAsyncThunk(
  "user/getResignationDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await resignServices.getResignationDetails(reqData);
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

export const createResignFunc = createAsyncThunk(
  "user/createResignFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await resignServices.createResignFunc(reqData);
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

export const updateResignationFunc = createAsyncThunk(
  "user/updateResignationFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await resignServices.updateResignationFunc(reqData);
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
export const deleteResignFunc = createAsyncThunk(
  "user/deleteResignFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await resignServices.deleteResignFunc(reqData);
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

export const statusResignFunc = createAsyncThunk(
  "user/statusResignFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await resignServices.statusResignFunc(reqData);
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

const resignSlice = createSlice({
  name: 'resignation',
  initialState: {
    totalresignCount: 0,
    resignationData: []
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getResignationList.pending, (state, action) => {
        state.loading = true;
        state.resignationData = [];
        state.totalresignCount = 0;
      })
      .addCase(getResignationList.fulfilled, (state, action) => {
        state.resignationData = action.payload?.data?.docs;
        state.totalresignCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getResignationList.rejected, (state, action) => {
        state.loading = false;
        state.resignationData = [];
        state.totalresignCount = 0;
      })
      .addCase(resignationSearch.pending, (state, action) => {
        state.loading = true;
        state.resignationData = [];
        state.totalresignCount = 0;
      })
      .addCase(resignationSearch.fulfilled, (state, action) => {
        state.resignationData = action.payload?.data?.docs;
        state.totalresignCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(resignationSearch.rejected, (state, action) => {
        state.loading = false;
        state.resignationData = [];
        state.totalresignCount = 0;
      })
      .addCase(createResignFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createResignFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.commonEmailCreateData = action.payload;
      })
      .addCase(createResignFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateResignationFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateResignationFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.commonEmailUpdateData = action.payload;
      })
      .addCase(updateResignationFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteResignFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteResignFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.commonEmailDeleteData = action.payload;
      })
      .addCase(deleteResignFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getResignationDetails.pending, (state) => {
        state.loading = true;
        state.resignationDetails = null;
      })
      .addCase(getResignationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.resignationDetails = action.payload?.data;
      })
      .addCase(getResignationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.resignationDetails = null;
      })
      .addCase(statusResignFunc.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(statusResignFunc.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.statusData = action.payload;
      })
      .addCase(statusResignFunc.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.payload;
      });
  },
});

export default resignSlice.reducer;
