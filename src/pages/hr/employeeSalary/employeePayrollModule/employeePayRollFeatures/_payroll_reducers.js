import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { payrollServices } from "./_payroll_services";
import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";






export const getPayrollList = createAsyncThunk(
  "user/getPayrollList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await payrollServices.getPayrollList(reqData);
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
export const getPayrollEmployeeList = createAsyncThunk(
  "user/getPayrollEmployeeList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await payrollServices.getPayrollemployeeList(reqData);
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



export const getPayrollDetails = createAsyncThunk(
  "user/getPayrollDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await payrollServices.getPayrollDetails(reqData);
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

export const createPayroll = createAsyncThunk(
  "user/createPayroll",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await payrollServices.createPayroll(reqData);
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

export const deletePayroll = createAsyncThunk(
  "user/deletePayroll",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await payrollServices.deletePayroll(reqData);
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

export const updatePayrollData = createAsyncThunk(
  "user/updatePayrollData",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await payrollServices.updatePayroll(reqData);
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
export const payrollDetailsFullListFunc = createAsyncThunk(
  "user/payrollDetailsFullListFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await payrollServices.payrollDetailsFullListFunc(reqData);
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
export const payrollStatusFunc = createAsyncThunk(
  "user/payrollStatusFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await payrollServices.payrollStatusFunc(reqData);
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

const employeeDocumentSlice = createSlice({
  name: 'employeeDocument',
  initialState: {
    employeeDocumentList: [],
    totalUserDesignationCount: 0,
    employeeDocDetails: {},
    leaveListData: [],

    payrollDetailsData: [],
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getPayrollList.pending, (state, action) => {
        state.loading = true;
        state.payrollRequestData = [];
        state.payrollSummary = null
        state.totalPayrollquestCount = 0;
      })
      .addCase(getPayrollList.fulfilled, (state, action) => {
        state.payrollRequestData = action.payload?.data?.docs;
        state.payrollSummary = action.payload?.data?.summery;
        state.totalPayrollquestCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getPayrollList.rejected, (state, action) => {
        state.loading = false;
        state.payrollRequestData = [];
        
      })
      .addCase(getPayrollEmployeeList.pending, (state, action) => {
        state.loading = true;
        state.payrollEmployeeList = [];
      
      })
      .addCase(getPayrollEmployeeList.fulfilled, (state, action) => {
        state.payrollEmployeeList = action.payload?.data?.docs
        state.loading = false;
      })
      .addCase(getPayrollEmployeeList.rejected, (state, action) => {
        state.loading = false;
        state.payrollEmployeeList = [];
        state.payrollSummary = null
        state.totalPayrollquestCount = 0;
      })
    
      .addCase(createPayroll.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.leaverequestCreateData = action.payload;
      })
      .addCase(createPayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(deletePayroll.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequestDeleteData = action.payload;
      })
      .addCase(deletePayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPayrollDetails.pending, (state) => {
        state.loading = true;
        state.payrollDetailsData = null;
      })
      .addCase(getPayrollDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.payrollDetailsData = action.payload?.data;
      })
      .addCase(getPayrollDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.payrollDetailsData = null;
      })
      .addCase(payrollStatusFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(payrollStatusFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.updatepayrolStatus = action.payload?.data;
      })
      .addCase(payrollStatusFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // state.leaverequestDetails = null;
      })
      .addCase(payrollDetailsFullListFunc.pending, (state) => {
        state.loading = true;
        state.payrolsalaryReportData = null;

      })
      .addCase(payrollDetailsFullListFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.payrolsalaryReportData = action.payload?.data;
        
      })
      .addCase(payrollDetailsFullListFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.payrolsalaryReportData = null;
        // state.leaverequestDetails = null;
      })
      .addCase(updatePayrollData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePayrollData.fulfilled, (state, action) => {
        state.loading = false;
        state.updatedDataPayroll = action.payload?.data;
      })
      .addCase(updatePayrollData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // state.leaverequestDetails = null;
      })
  },
});

export default employeeDocumentSlice.reducer;
