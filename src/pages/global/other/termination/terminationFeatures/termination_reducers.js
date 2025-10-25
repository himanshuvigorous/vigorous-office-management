import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";
import { TerminationServices } from "./termination_services";






export const getTerminationList = createAsyncThunk(
  "user/getTerminationList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await TerminationServices.getTerminationList(reqData);
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



export const getEmployeeTerminationList = createAsyncThunk(
  "user/getEmployeeTerminationList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await TerminationServices.getEmployeeTerminationList(reqData);
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

export const TerminationSearch = createAsyncThunk(
  "user/TerminationSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await TerminationServices.TerminationSearch(reqData);
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

export const getTerminationDetails = createAsyncThunk(
  "user/getTerminationDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await TerminationServices.getTerminationDetails(reqData);
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

export const createTerminationFunc = createAsyncThunk(
  "user/createTerminationFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await TerminationServices.createTerminationFunc(reqData);
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

export const updateTerminationFunc = createAsyncThunk(
  "user/updateTerminationFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await TerminationServices.updateTerminationFunc(reqData);
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
export const deleteTerminationFunc = createAsyncThunk(
  "user/deleteTerminationFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await TerminationServices.deleteTerminationFunc(reqData);
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

export const statusTerminationFunc = createAsyncThunk(
  "user/statusTerminationFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await TerminationServices.statusTerminationFunc(reqData);
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

const TerminationSlice = createSlice({
  name: 'Termination',
  initialState: {
    totalTerminationCount: 0,
    TerminationData: []
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTerminationList.pending, (state, action) => {
        state.loading = true;
        state.TerminationData = [];
        state.totalTerminationCount = 0;
      })
      .addCase(getTerminationList.fulfilled, (state, action) => {
        state.TerminationData = action.payload?.data?.docs;
        state.totalTerminationCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getTerminationList.rejected, (state, action) => {
        state.loading = false;
        state.TerminationData = [];
        state.totalTerminationCount = 0;
      })

      .addCase(getEmployeeTerminationList.pending, (state, action) => {
        state.employeeLoading = true;
        state.employeeTerminationData = [];
        state.totalEmployeeTerminationCount = 0;
      })
      .addCase(getEmployeeTerminationList.fulfilled, (state, action) => {
        state.employeeTerminationData = action.payload?.data?.docs;
        state.totalEmployeeTerminationCount = action.payload?.data?.totalDocs;
        state.employeeLoading = false;
      })
      .addCase(getEmployeeTerminationList.rejected, (state, action) => {
        state.employeeLoading = false;
        state.employeeTerminationData = [];
        state.totalEmployeeTerminationCount = 0;
      })
      .addCase(TerminationSearch.pending, (state, action) => {
        state.loading = true;
        state.TerminationData = [];
        state.totalTerminationCount = 0;
      })
      .addCase(TerminationSearch.fulfilled, (state, action) => {
        state.TerminationData = action.payload?.data?.docs;
        state.totalTerminationCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(TerminationSearch.rejected, (state, action) => {
        state.loading = false;
        state.TerminationData = [];
        state.totalTerminationCount = 0;
      })
      .addCase(createTerminationFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTerminationFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.commonEmailCreateData = action.payload;
      })
      .addCase(createTerminationFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTerminationFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTerminationFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.commonEmailUpdateData = action.payload;
      })
      .addCase(updateTerminationFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTerminationFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTerminationFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.commonEmailDeleteData = action.payload;
      })
      .addCase(deleteTerminationFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTerminationDetails.pending, (state) => {
        state.loading = true;
        state.TerminationDetails = null;
      })
      .addCase(getTerminationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.TerminationDetails = action.payload?.data;
      })
      .addCase(getTerminationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.TerminationDetails = null;
      })
      .addCase(statusTerminationFunc.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(statusTerminationFunc.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.statusData = action.payload;
      })
      .addCase(statusTerminationFunc.rejected, (state, action) => {
        state.status = 'failed';
        state.errorMessage = action.payload;
      });
  },
});

export default TerminationSlice.reducer;
