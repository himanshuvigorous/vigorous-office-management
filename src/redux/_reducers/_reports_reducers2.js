import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../global_layouts/CustomNotification/NotificationManager";

import { reportsServices2 } from "../_services/_reports_services2";


const initialState = {

};


export const downloadExcelFunc = createAsyncThunk(
  "dashboard/downloadExcelFunc",
  async (payload, { rejectWithValue }) => {
    try {      
      const user = await reportsServices2.downloadExcelFunc(payload);
      return user;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const employeeAttendanceSummaryReportFunc = createAsyncThunk(
  "dashboard/employeeAttendanceSummaryReportFunc",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await reportsServices2.employeeAttendanceSummaryReportFunc(userData);


      return user;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const financeProfitLossFunc = createAsyncThunk(
  "dashboard/financeProfitLossFunc",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await reportsServices2.financeProfitLossFunc(userData);
      return user;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);



const reportSlice2 = createSlice({
  name: "report2",
  initialState,
  reducers: {
    resetFieldsReports2(state) {
      state.downloadExcelFuncList = [];
      state.profitLossReportData = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(downloadExcelFunc.pending, (state) => {
        state.downloadExcelFunc_loading = true;
        state.downloadExcelFuncList = [];
        state.downloadExcelFuncCount = 0;
      })
      .addCase(downloadExcelFunc.fulfilled, (state, action) => {
        state.downloadExcelFunc_loading = false;
        state.downloadExcelFuncList = action.payload?.data?.docs;
        state.downloadExcelFuncCount = action.payload?.data?.totalDocs;
      })
      .addCase(downloadExcelFunc.rejected, (state, action) => {
        state.downloadExcelFunc_loading = false;
        state.downloadExcelFuncList = [];
        state.downloadExcelFuncCount = 0;
        state.error = action.payload;
      })

       .addCase(employeeAttendanceSummaryReportFunc.pending, (state) => {
        state.employeeAttendanceSummaryReport_loading = true;
        state.employeeAttendanceSummaryReportList = [];
        state.employeeAttendanceSummaryReportCount = 0;
      })
      .addCase(employeeAttendanceSummaryReportFunc.fulfilled, (state, action) => {
        state.employeeAttendanceSummaryReport_loading = false;
        state.employeeAttendanceSummaryReportList = action.payload?.data?.docs;
        state.employeeAttendanceSummaryReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(employeeAttendanceSummaryReportFunc.rejected, (state, action) => {
        state.employeeAttendanceSummaryReport_loading = false;
        state.employeeAttendanceSummaryReportList = [];
        state.employeeAttendanceSummaryReportCount = 0;
        state.error = action.payload;
      })
       .addCase(financeProfitLossFunc.pending, (state) => {
        state.profitLossReportLoading = true;
        state.profitLossReportData = {};
       
      })
      .addCase(financeProfitLossFunc.fulfilled, (state, action) => {
        state.profitLossReportLoading = false;
        state.profitLossReportData = action.payload?.data;

      })
      .addCase(financeProfitLossFunc.rejected, (state, action) => {
        state.profitLossReportLoading = false;
        state.profitLossReportData = [];
        state.error = action.payload;
      })



  },
});

export const { resetFieldsReports2 } = reportSlice2.actions;

export default reportSlice2.reducer;
