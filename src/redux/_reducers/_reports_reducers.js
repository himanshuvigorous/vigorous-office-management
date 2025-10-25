import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../global_layouts/CustomNotification/NotificationManager";
import { reportsServices } from "../_services/_reports_services";


const initialState = {

};


export const downloadExcelFunc = createAsyncThunk(
  "dashboard/downloadExcelFunc",
  async (payload, { rejectWithValue }) => {
    try {
      const user = await reportsServices.downloadExcelFunc(payload);
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


export const employeeAttendanceReportFunc = createAsyncThunk(
  "dashboard/employeeAttendanceReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.employeeAttendanceReportFunc(userData);
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


export const clientInvoiceReportFunc = createAsyncThunk(
  "dashboard/clientInvoiceReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.clientInvoiceReportFunc(userData);
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




export const financeAdvanceSummaryReportFunc = createAsyncThunk(
  "dashboard/financeAdvanceSummaryReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.financeAdvanceSummaryReportFunc(userData);
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
export const financeSummaryWiseFunc = createAsyncThunk(
  "dashboard/financeSummaryWiseFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.financeSummaryWiseFunc(userData);
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


export const bankStatementReportFunc = createAsyncThunk(
  "dashboard/bankStatementReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.bankStatementReportFunc(userData);
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


export const balanceSheetReportFunc = createAsyncThunk(
  "dashboard/balanceSheetReport",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.balanceSheetReport(userData);
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




export const recruitmentOnboardingReportFunc = createAsyncThunk(
  "dashboard/recruitmentOnboardingReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.recruitmentOnboardingReportFunc(userData);
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


export const employeeSalaryReportFunc = createAsyncThunk(
  "dashboard/employeeSalaryReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.employeeSalaryReportFunc(userData);
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



export const financeBankListReportFunc = createAsyncThunk(
  "dashboard/financeBankListReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.financeBankListReportFunc(userData);
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



export const employeeAppraisalReportFunc = createAsyncThunk(
  "dashboard/employeeAppraisalReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.employeeAppraisalReportFunc(userData);
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



export const financeAdvanceReportFunc = createAsyncThunk(
  "dashboard/financeAdvanceReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.financeAdvanceReportFunc(userData);
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





export const employeeAttendanceSummaryFunc = createAsyncThunk(
  "dashboard/employeeAttendanceSummaryFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.employeeAttendanceSummaryFunc(userData);
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

export const leaveRequestReportFunc = createAsyncThunk(
  "dashboard/leaveRequestReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.leaveRequestReportFunc(userData);
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


export const cashbookDetailsReportFunc = createAsyncThunk(
  "dashboard/cashbookDetailsReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.cashbookDetailsReportFunc(userData);
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




export const vendorAdvanceReportFunc = createAsyncThunk(
  "dashboard/vendorAdvanceReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.vendorAdvanceReportFunc(userData);
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







export const employeReportFunc = createAsyncThunk(
  "dashboard/employeReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.employeReportFunc(userData);


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



export const employePenaltyReportFunc = createAsyncThunk(
  "dashboard/employePenaltyReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.employePenaltyReportFunc(userData);
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



export const employeSummaryReportFunc = createAsyncThunk(
  "dashboard/employeSummaryReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.employeSummaryReportFunc(userData);
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



export const vendorInvoiceReport = createAsyncThunk(
  "dashboard/vendorInvoiceReport",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.vendorInvoiceReport(userData);
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





export const clientStatementReportFunc = createAsyncThunk(
  "dashboard/clientStatementReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.clientStatementReportFunc(userData);
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



export const clientGroupStatementReportFunc = createAsyncThunk(
  "dashboard/clientGroupStatementReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.clientGroupStatementReportFunc(userData);
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





export const employeePerformanceFunc = createAsyncThunk(
  "dashboard/employeePerformanceFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.employeePerformanceFunc(userData);
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

export const clientReportFunc = createAsyncThunk(
  "dashboard/clientReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.clientReportFunc(userData);


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



export const clientOwnerDetailsReportFunc = createAsyncThunk(
  "dashboard/clientOwnerDetailsReportFunc",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await reportsServices.clientOwnerDetailsReportFunc(userData);


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



export const clientServiceReportFunc = createAsyncThunk(
  "dashboard/clientServiceReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.clientServiceReportFunc(userData);


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






export const clientGrowthRevenueReportFunc = createAsyncThunk(
  "dashboard/clientGrowthRevenueReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.clientGrowthRevenueReportFunc(userData);


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





export const clientIndexReportFunc = createAsyncThunk(
  "dashboard/clientIndexReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.clientIndexReportFunc(userData);


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



export const clientDigitalSignatureReportFunc = createAsyncThunk(
  "dashboard/clientDigitalSignatureReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.clientDigitalSignatureReportFunc(userData);


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



export const AllClientReportFunc = createAsyncThunk(
  "dashboard/AllClientReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.AllClientReportFunc(userData);


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




export const invoiceGstReturnSalesReportFunc = createAsyncThunk(
  "dashboard/invoiceGstReturnSalesReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.invoiceGstReturnSalesReportFunc(userData);


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


export const clientBillingPaymentTrackingReportFunc = createAsyncThunk(
  "dashboard/clientBillingPaymentTrackingReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.clientBillingPaymentTrackingReportFunc(userData);


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


export const invoiceGstReturnPurchaseReportFunc = createAsyncThunk(
  "dashboard/invoiceGstReturnPurchaseReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.invoiceGstReturnPurchaseReportFunc(userData);


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




export const recieptReportFunc = createAsyncThunk(
  "dashboard/recieptReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.recieptReportFunc(userData);


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





export const clientLedgerFunc = createAsyncThunk(
  "dashboard/clientLedgerFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.clientLedgerFunc(userData);


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



export const clientGroupLedgerFunc = createAsyncThunk(
  "dashboard/clientGroupLedgerFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.clientGroupLedgerFunc(userData);


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



export const digitalSignReportFunc = createAsyncThunk(
  "dashboard/digitalSignReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.digitalSignReportFunc(userData);


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


export const taskStatusReportFunc = createAsyncThunk(
  "dashboard/taskStatusReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.taskStatusReportFunc(userData);


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
export const overAllTaskReportFunc = createAsyncThunk(
  "dashboard/overAllTaskReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.overAllTaskReportFunc(userData);


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



export const financePaymentReportFunc = createAsyncThunk(
  "dashboard/financePaymentReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.financePaymentReportFunc(userData);


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









export const taskRatingReportFunc = createAsyncThunk(
  "dashboard/taskRatingReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.taskRatingReportFunc(userData);


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



export const clientLedgerReportFunc = createAsyncThunk(
  "dashboard/clientLedgerReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.clientLedgerReportFunc(userData);


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


export const lastUpdateTaskReportFunc = createAsyncThunk(
  "dashboard/lastUpdateTaskReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.lastUpdateTaskReportFunc(userData);


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


export const overDueTaskReportFunc = createAsyncThunk(
  "dashboard/overDueTaskReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.overDueTaskReportFunc(userData);


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



export const stoppedTaskReportFunc = createAsyncThunk(
  "dashboard/stoppedTaskReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.stoppedTaskReportFunc(userData);


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


export const financialTaskReportFunc = createAsyncThunk(
  "dashboard/financialTaskReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.financialTaskReportFunc(userData);


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




export const workingHourTaskReportFunc = createAsyncThunk(
  "dashboard/workingHourTaskReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.workingHourTaskReportFunc(userData);


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


export const pendingInvoiceReportFunc = createAsyncThunk(
  "dashboard/pendingInvoiceReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.pendingInvoiceReportFunc(userData);


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


export const runningTaskReportFunc = createAsyncThunk(
  "dashboard/runningTaskReportFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.runningTaskReportFunc(userData);


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
export const employeeleaveCountReport = createAsyncThunk(
  "dashboard/employeeleaveCountReport",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.employeeleaveCountReport(userData);


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

export const employeEPBXReport = createAsyncThunk(
  "dashboard/employeEPBXReport",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await reportsServices.employeEPBXReport(userData);


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

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    emptyReportFunc(state) {
      state.balanceSheetReportList= null    
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



      .addCase(employeeAttendanceReportFunc.pending, (state) => {
        state.employeeAttendanceReportFunc_loading = true;
        state.employeeAttendanceReportist = [];
        state.totalemployeeAttendanceReportCount = 0;
      })
      .addCase(employeeAttendanceReportFunc.fulfilled, (state, action) => {
        state.employeeAttendanceReportFunc_loading = false;
        state.employeeAttendanceReportist = action.payload?.data?.docs || [];
        state.totalemployeeAttendanceReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(employeeAttendanceReportFunc.rejected, (state, action) => {
        state.employeeAttendanceReportFunc_loading = false;
        state.employeeAttendanceReportist = [];
        state.totalemployeeAttendanceReportCount = 0;
        state.error = action.payload;
      })


      .addCase(recruitmentOnboardingReportFunc.pending, (state) => {
        state.recruitmentOnboardingReportFunc_loading = true;
        state.recruitmentOnboardingReportList = [];
        state.totalRecruitmentOnboardingReportCount = 0;
      })
      .addCase(recruitmentOnboardingReportFunc.fulfilled, (state, action) => {
        state.recruitmentOnboardingReportFunc_loading = false;
        state.recruitmentOnboardingReportList = action.payload?.data?.docs || [];
        state.totalRecruitmentOnboardingReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(recruitmentOnboardingReportFunc.rejected, (state, action) => {
        state.recruitmentOnboardingReportFunc_loading = false;
        state.recruitmentOnboardingReportList = [];
        state.totalRecruitmentOnboardingReportCount = 0;
        state.error = action.payload;
      })


      .addCase(employeeSalaryReportFunc.pending, (state) => {
        state.employeeSalaryReportFunc_loading = true;
        state.employeeSalaryReportList = [];
        state.totalemployeeSalaryReportCount = 0;
      })
      .addCase(employeeSalaryReportFunc.fulfilled, (state, action) => {
        state.employeeSalaryReportFunc_loading = false;
        state.employeeSalaryReportList = action.payload?.data?.docs || [];
        state.totalemployeeSalaryReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(employeeSalaryReportFunc.rejected, (state, action) => {
        state.employeeSalaryReportFunc_loading = false;
        state.employeeSalaryReportList = [];
        state.totalemployeeSalaryReportCount = 0;
        state.error = action.payload;
      })

      .addCase(employeeAppraisalReportFunc.pending, (state) => {
        state.employeeAppraisalReportFunc_loading = true;
        state.employeeAppraisalReportist = [];
        state.totalemployeeAppraisalReportCount = 0;
      })
      .addCase(employeeAppraisalReportFunc.fulfilled, (state, action) => {
        state.employeeAppraisalReportFunc_loading = false;
        state.employeeAppraisalReportist = action.payload?.data?.docs || [];
        state.totalemployeeAppraisalReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(employeeAppraisalReportFunc.rejected, (state, action) => {
        state.employeeAppraisalReportFunc_loading = false;
        state.employeeAppraisalReportist = [];
        state.totalemployeeAppraisalReportCount = 0;
        state.error = action.payload;
      })


      .addCase(employeeAttendanceSummaryFunc.pending, (state) => {
        state.employeeAttendanceSummaryFunc_loading = true;
        state.employeeAttendanceSummaryReportList = [];
        state.totalemployeeAttendanceSummaryCount = 0;
      })
      .addCase(employeeAttendanceSummaryFunc.fulfilled, (state, action) => {
        state.employeeAttendanceSummaryFunc_loading = false;
        state.employeeAttendanceSummaryReportList = action.payload?.data?.docs || [];
        state.totalemployeeAttendanceSummaryCount = action.payload?.data?.totalDocs;
      })
      .addCase(employeeAttendanceSummaryFunc.rejected, (state, action) => {
        state.employeeAttendanceSummaryFunc_loading = false;
        state.employeeAttendanceSummaryReportList = [];
        state.totalemployeeAttendanceSummaryCount = 0;
        state.error = action.payload;
      })

      .addCase(leaveRequestReportFunc.pending, (state) => {
        state.leaveRequestReportFunc_loading = true;
        state.leaveRequestReportList = [];
        state.totalleaveRequestReportCount = 0;
      })
      .addCase(leaveRequestReportFunc.fulfilled, (state, action) => {
        state.leaveRequestReportFunc_loading = false;
        state.leaveRequestReportList = action.payload?.data?.docs;
        state.totalleaveRequestReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(leaveRequestReportFunc.rejected, (state, action) => {
        state.leaveRequestReportFunc_loading = false;
        state.leaveRequestReportList = [];
        state.totalleaveRequestReportCount = 0;
        state.error = action.payload;
      })

      .addCase(employeReportFunc.pending, (state) => {
        state.employeReportFunc_loading = true;
        state.employeReportList = [];
        state.totalemployeeReportCount = 0;
        state.empoloyeReportListTotalCount = [];
      })
      .addCase(employeReportFunc.fulfilled, (state, action) => {
        state.employeReportFunc_loading = false;
        state.employeReportList = action.payload?.data?.docs;
        state.totalemployeeReportCount = action.payload?.data?.totalDocs;
        state.empoloyeReportListTotalCount = action.payload?.data?.summeryData
      })
      .addCase(employeReportFunc.rejected, (state, action) => {
        state.employeReportFunc_loading = false;
        state.employeReportList = [];
        state.totalemployeeReportCount = 0;
        state.error = action.payload;
        state.empoloyeReportListTotalCount = [];
      })




      .addCase(cashbookDetailsReportFunc.pending, (state) => {
        state.cashbookDetailsReportFunc_loading = true;
        state.cashbookDetailsReportList = [];
        state.cashbookDetailsReportCount = 0;
      })
      .addCase(cashbookDetailsReportFunc.fulfilled, (state, action) => {
        state.cashbookDetailsReportFunc_loading = false;
        state.cashbookDetailsReportList = action.payload?.data?.docs;
        state.cashbookDetailsReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(cashbookDetailsReportFunc.rejected, (state, action) => {
        state.cashbookDetailsReportFunc_loading = false;
        state.cashbookDetailsReportList = [];
        state.cashbookDetailsReportCount = 0;
        state.error = action.payload;
      })




      .addCase(clientLedgerReportFunc.pending, (state) => {
        state.clientLedgerReportFunc_loading = true;
        state.clientLedgerReportList = [];
        state.clientLedgerReportCount = 0;
      })
      .addCase(clientLedgerReportFunc.fulfilled, (state, action) => {
        state.clientLedgerReportFunc_loading = false;
        state.clientLedgerReportList = action.payload?.data?.docs;
        state.clientLedgerReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(clientLedgerReportFunc.rejected, (state, action) => {
        state.clientLedgerReportFunc_loading = false;
        state.clientLedgerReportList = [];
        state.clientLedgerReportCount = 0;
        state.error = action.payload;
      })





      .addCase(employePenaltyReportFunc.pending, (state) => {
        state.employePenaltyReportFunc_loading = true;
        state.employePenaltyReportList = [];
        state.totalpenaltyReportCount = 0;
      })
      .addCase(employePenaltyReportFunc.fulfilled, (state, action) => {
        state.employePenaltyReportFunc_loading = false;
        state.employePenaltyReportList = action.payload?.data?.docs;
        state.totalpenaltyReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(employePenaltyReportFunc.rejected, (state, action) => {
        state.employePenaltyReportFunc_loading = false;
        state.employePenaltyReportList = [];
        state.totalpenaltyReportCount = 0;
        state.error = action.payload;
      })

      .addCase(employeePerformanceFunc.pending, (state) => {
        state.employeePerformance_loading = true;
        state.employeePerformanceList = [];
        state.totalemployeePerformanceReportCount = 0;
      })
      .addCase(employeePerformanceFunc.fulfilled, (state, action) => {
        state.employeePerformance_loading = false;
        state.employeePerformanceList = action.payload?.data?.docs;
        state.totalemployeePerformanceReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(employeePerformanceFunc.rejected, (state, action) => {
        state.employeePerformance_loading = false;
        state.employeePerformanceList = [];
        state.totalemployeePerformanceReportCount = 0;
        state.error = action.payload;
      })


      .addCase(clientReportFunc.pending, (state) => {
        state.clientReportFunc_loading = true;
        state.clientReportList = [];
        state.totalclientReportCount = 0;
      })
      .addCase(clientReportFunc.fulfilled, (state, action) => {
        state.clientReportFunc_loading = false;
        state.clientReportList = action.payload?.data?.docs;
        state.totalclientReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(clientReportFunc.rejected, (state, action) => {
        state.clientReportFunc_loading = false;
        state.clientReportList = [];
        state.totalclientReportCount = 0;
        state.error = action.payload;
      })

      .addCase(clientLedgerFunc.pending, (state) => {
        state.clientLedgerFunc_loading = true;
        state.clientLedgerList = [];
        state.totalledgerReportCount = 0;
      })
      .addCase(clientLedgerFunc.fulfilled, (state, action) => {
        state.clientLedgerFunc_loading = false;
        state.clientLedgerList = action.payload?.data?.docs;
        state.totalledgerReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(clientLedgerFunc.rejected, (state, action) => {
        state.clientLedgerFunc_loading = false;
        state.clientLedgerList = [];
        state.totalledgerReportCount = 0;
        state.error = action.payload;
      })


           .addCase(clientGroupLedgerFunc.pending, (state) => {
        state.clientGroupLedgerFunc_loading = true;
        state.clientGroupLedgerList = [];
        state.totalclientGroupLedgerCount = 0;
        state.totalclientGroupLedgerCountOutstanding = 0;

      })
      .addCase(clientGroupLedgerFunc.fulfilled, (state, action) => {
        state.clientGroupLedgerFunc_loading = false;
        state.clientGroupLedgerList = action.payload?.data?.docs;
        state.totalclientGroupLedgerCount = action.payload?.data?.totalDocs;
        state.totalclientGroupLedgerCountOutstanding = action.payload?.data?.closingBalance;
      })
      .addCase(clientGroupLedgerFunc.rejected, (state, action) => {
        state.clientGroupLedgerFunc_loading = false;
        state.clientGroupLedgerList = [];
        state.totalclientGroupLedgerCount = 0;
        state.error = action.payload;
        state.totalclientGroupLedgerCountOutstanding = 0;
      })

      .addCase(digitalSignReportFunc.pending, (state) => {
        state.digitalSignReportFunc_loading = true;
        state.digitalSignReportList = [];
        state.totalDigitalSignReportCount = 0;
      })
      .addCase(digitalSignReportFunc.fulfilled, (state, action) => {
        state.digitalSignReportFunc_loading = false;
        state.digitalSignReportList = action.payload?.data?.docs;
        state.totalDigitalSignReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(digitalSignReportFunc.rejected, (state, action) => {
        state.digitalSignReportFunc_loading = false;
        state.digitalSignReportList = [];
        state.totalDigitalSignReportCount = 0;
        state.error = action.payload;
      })


      .addCase(clientServiceReportFunc.pending, (state) => {
        state.clientServiceReportFunc_loading = true;
        state.clientServiceReportList = [];
        state.clientServiceReportCount = 0;
      })
      .addCase(clientServiceReportFunc.fulfilled, (state, action) => {
        state.clientServiceReportFunc_loading = false;
        state.clientServiceReportList = action.payload?.data?.docs;
        state.clientServiceReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(clientServiceReportFunc.rejected, (state, action) => {
        state.clientServiceReportFunc_loading = false;
        state.clientServiceReportList = [];
        state.clientServiceReportCount = 0;
        state.error = action.payload;
      })






      .addCase(taskStatusReportFunc.pending, (state) => {
        state.taskStatusReportFunc_loading = true;
        state.taskStatusReportList = [];
        state.totalTaskStatusCount = 0;
      })
      .addCase(taskStatusReportFunc.fulfilled, (state, action) => {
        state.taskStatusReportFunc_loading = false;
        state.taskStatusReportList = action.payload?.data?.docs;
        state.totalTaskStatusCount = action.payload?.data?.totalDocs;
      })
      .addCase(taskStatusReportFunc.rejected, (state, action) => {
        state.taskStatusReportFunc_loading = false;
        state.taskStatusReportList = [];
        state.totalTaskStatusCount = 0;
        state.error = action.payload;
      })
      .addCase(overAllTaskReportFunc.pending, (state) => {
        state.overAllTaskReportFunc_loading = true;
        state.overAllTaskReportList = [];
        state.totaloverAllTaskCount = 0;
      })
      .addCase(overAllTaskReportFunc.fulfilled, (state, action) => {
        state.overAllTaskReportFunc_loading = false;
        state.overAllTaskReportList = action.payload?.data?.docs;
        state.totaloverAllTaskCount = action.payload?.data?.totalDocs;
      })
      .addCase(overAllTaskReportFunc.rejected, (state, action) => {
        state.overAllTaskReportFunc_loading = false;
        state.overAllTaskReportList = [];
        state.totaloverAllTaskCount = 0;
        state.error = action.payload;
      })


      .addCase(stoppedTaskReportFunc.pending, (state) => {
        state.stoppedTaskReportFunc_loading = true;
        state.stoppedTaskReportList = [];
        state.totalstoppedTaskCount = 0;
      })
      .addCase(stoppedTaskReportFunc.fulfilled, (state, action) => {
        state.stoppedTaskReportFunc_loading = false;
        state.stoppedTaskReportList = action.payload?.data?.docs;
        state.totalstoppedTaskCount = action.payload?.data?.totalDocs;
      })
      .addCase(stoppedTaskReportFunc.rejected, (state, action) => {
        state.stoppedTaskReportFunc_loading = false;
        state.stoppedTaskReportList = [];
        state.totalstoppedTaskCount = 0;
        state.error = action.payload;
      })

      .addCase(lastUpdateTaskReportFunc.pending, (state) => {
        state.lastUpdateTaskReportFunc_loading = true;
        state.lastUpdateTaskReportList = [];
        state.totallastUpdateTaskTaskCount = 0;
      })
      .addCase(lastUpdateTaskReportFunc.fulfilled, (state, action) => {
        state.lastUpdateTaskReportFunc_loading = false;
        state.lastUpdateTaskReportList = action.payload?.data?.docs;
        state.totallastUpdateTaskTaskCount = action.payload?.data?.totalDocs;
      })
      .addCase(lastUpdateTaskReportFunc.rejected, (state, action) => {
        state.lastUpdateTaskReportFunc_loading = false;
        state.lastUpdateTaskReportList = [];
        state.totallastUpdateTaskTaskCount = 0;
        state.error = action.payload;
      })

      .addCase(workingHourTaskReportFunc.pending, (state) => {
        state.workingHourTaskReportFunc_loading = true;
        state.workingHourTaskReportList = [];
        state.totalWorkingHourTaskTaskCount = 0;
      })
      .addCase(workingHourTaskReportFunc.fulfilled, (state, action) => {
        state.workingHourTaskReportFunc_loading = false;
        state.workingHourTaskReportList = action.payload?.data?.docs;
        state.totalWorkingHourTaskTaskCount = action.payload?.data?.totalDocs;
      })
      .addCase(workingHourTaskReportFunc.rejected, (state, action) => {
        state.workingHourTaskReportFunc_loading = false;
        state.workingHourTaskReportList = [];
        state.totalWorkingHourTaskTaskCount = 0;
        state.error = action.payload;
      })



      .addCase(taskRatingReportFunc.pending, (state) => {
        state.taskRatingReportFunc_loading = true;
        state.taskRatingReportList = [];
        state.totalRatingTaskTaskCount = 0;
      })
      .addCase(taskRatingReportFunc.fulfilled, (state, action) => {
        state.taskRatingReportFunc_loading = false;
        state.taskRatingReportList = action.payload?.data?.docs;
        state.totalRatingTaskTaskCount = action.payload?.data?.totalDocs;
      })
      .addCase(taskRatingReportFunc.rejected, (state, action) => {
        state.taskRatingReportFunc_loading = false;
        state.taskRatingReportList = [];
        state.totalRatingTaskTaskCount = 0;
        state.error = action.payload;
      })




      .addCase(clientIndexReportFunc.pending, (state) => {
        state.clientIndexReportFunc_loading = true;
        state.clientIndexReportList = [];
        state.totalClientIndexCount = 0;
      })
      .addCase(clientIndexReportFunc.fulfilled, (state, action) => {
        state.clientIndexReportFunc_loading = false;
        state.clientIndexReportList = action.payload?.data?.docs;
        state.totalClientIndexCount = action.payload?.data?.totalDocs;
      })
      .addCase(clientIndexReportFunc.rejected, (state, action) => {
        state.clientIndexReportFunc_loading = false;
        state.clientIndexReportList = [];
        state.totalClientIndexCount = 0;
        state.error = action.payload;
      })


      .addCase(AllClientReportFunc.pending, (state) => {
        state.AllClientReportFunc_loading = true;
        state.allClientReportList = [];
        state.totalAllClientCount = 0;
      })
      .addCase(AllClientReportFunc.fulfilled, (state, action) => {
        state.AllClientReportFunc_loading = false;
        state.allClientReportList = action.payload?.data?.docs;
        state.totalAllClientCount = action.payload?.data?.totalDocs;
      })
      .addCase(AllClientReportFunc.rejected, (state, action) => {
        state.AllClientReportFunc_loading = false;
        state.allClientReportList = [];
        state.totalAllClientCount = 0;
        state.error = action.payload;
      })



      .addCase(clientDigitalSignatureReportFunc.pending, (state) => {
        state.clientDigitalSignatureReportFunc_loading = true;
        state.clientDigitalSignatureReportList = [];
        state.totalDigitalSignatureIndexCount = 0;
      })
      .addCase(clientDigitalSignatureReportFunc.fulfilled, (state, action) => {
        state.clientDigitalSignatureReportFunc_loading = false;
        state.clientDigitalSignatureReportList = action.payload?.data?.docs;
        state.totalDigitalSignatureIndexCount = action.payload?.data?.totalDocs;
      })
      .addCase(clientDigitalSignatureReportFunc.rejected, (state, action) => {
        state.clientDigitalSignatureReportFunc_loading = false;
        state.clientDigitalSignatureReportList = [];
        state.totalDigitalSignatureIndexCount = 0;
        state.error = action.payload;
      })


      .addCase(clientOwnerDetailsReportFunc.pending, (state) => {
        state.clientOwnerDetailsReportFunc_loading = true;
        state.clientOwnerDetailsReportList = [];
        state.clientOwnerDetailsReportCount = 0;
      })
      .addCase(clientOwnerDetailsReportFunc.fulfilled, (state, action) => {
        state.clientOwnerDetailsReportFunc_loading = false;
        state.clientOwnerDetailsReportList = action.payload?.data;
        state.clientOwnerDetailsReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(clientOwnerDetailsReportFunc.rejected, (state, action) => {
        state.clientOwnerDetailsReportFunc_loading = false;
        state.clientOwnerDetailsReportList = [];
        state.clientOwnerDetailsReportCount = 0;
        state.error = action.payload;
      })









      .addCase(financialTaskReportFunc.pending, (state) => {
        state.financialTaskReportFunc_loading = true;
        state.financialTaskReportList = [];
        state.totalfinancialTaskCount = 0;
      })
      .addCase(financialTaskReportFunc.fulfilled, (state, action) => {
        state.financialTaskReportFunc_loading = false;
        state.financialTaskReportList = action.payload?.data?.docs;
        state.totalfinancialTaskCount = action.payload?.data?.totalDocs;
      })
      .addCase(financialTaskReportFunc.rejected, (state, action) => {
        state.financialTaskReportFunc_loading = false;
        state.financialTaskReportList = [];
        state.totalfinancialTaskCount = 0;
        state.error = action.payload;
      })

      .addCase(overDueTaskReportFunc.pending, (state) => {
        state.overDueTaskReportFunc_loading = true;
        state.overDueReportList = [];
        state.totaloverDueTaskCount = 0;
      })
      .addCase(overDueTaskReportFunc.fulfilled, (state, action) => {
        state.overDueTaskReportFunc_loading = false;
        state.overDueReportList = action.payload?.data?.docs;
        state.totaloverDueTaskCount = action.payload?.data?.totalDocs;
      })
      .addCase(overDueTaskReportFunc.rejected, (state, action) => {
        state.overDueTaskReportFunc_loading = false;
        state.overDueReportList = [];
        state.totaloverDueTaskCount = 0;
        state.error = action.payload;
      })


      .addCase(pendingInvoiceReportFunc.pending, (state) => {
        state.pendingInvoiceReportFunc_loading = true;
        state.pendingInvoiceReportList = [];
        state.totalFeePendingInvoiceCount = 0;
        state.totalpendingInvoiceCount = 0;
      })
      .addCase(pendingInvoiceReportFunc.fulfilled, (state, action) => {
        state.pendingInvoiceReportFunc_loading = false;
        state.pendingInvoiceReportList = action.payload?.data?.docs;
        state.totalFeePendingInvoiceCount = action.payload?.data?.totalFee;
        state.totalpendingInvoiceCount = action.payload?.data?.totalDocs;
      })
      .addCase(pendingInvoiceReportFunc.rejected, (state, action) => {
        state.pendingInvoiceReportFunc_loading = false;
        state.pendingInvoiceReportList = [];
        state.totalFeePendingInvoiceCount = 0;
        state.totalpendingInvoiceCount = 0;
        state.error = action.payload;
      })



      .addCase(employeSummaryReportFunc.pending, (state) => {
        state.employeSummaryReportFunc_loading = true;
        state.employeeSummaryReportList = [];
        state.employeSummaryCount = 0;
      })
      .addCase(employeSummaryReportFunc.fulfilled, (state, action) => {
        state.employeSummaryReportFunc_loading = false;
        state.employeeSummaryReportList = action.payload?.data?.docs;
        state.employeSummaryCount = action.payload?.data?.totalDocs;
      })
      .addCase(employeSummaryReportFunc.rejected, (state, action) => {
        state.employeSummaryReportFunc_loading = false;
        state.employeeSummaryReportList = [];
        state.employeSummaryCount = 0;
        state.error = action.payload;
      })




       .addCase(invoiceGstReturnSalesReportFunc.pending, (state) => {
        state.invoiceGstReturnSalesReportFunc_loading = true;
        state.invoiceGstReturnSalesReportList = [];
        state.invoiceGstReturnSalesReportCount = 0;
      })
      .addCase(invoiceGstReturnSalesReportFunc.fulfilled, (state, action) => {
        state.invoiceGstReturnSalesReportFunc_loading = false;
        state.invoiceGstReturnSalesReportList = action.payload?.data?.docs;
        state.invoiceGstReturnSalesReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(invoiceGstReturnSalesReportFunc.rejected, (state, action) => {
        state.invoiceGstReturnSalesReportFunc_loading = false;
        state.invoiceGstReturnSalesReportList = [];
        state.invoiceGstReturnSalesReportCount = 0;
        state.error = action.payload;
      })

      .addCase(clientBillingPaymentTrackingReportFunc.pending, (state) => {
        state.clientBillingPaymentTrackingReportFunc_loading = true;
        state.clientBillingPaymentTrackingReportList = [];
        state.clientBillingPaymentTrackingCount = 0;
      })
      .addCase(clientBillingPaymentTrackingReportFunc.fulfilled, (state, action) => {
        state.clientBillingPaymentTrackingReportFunc_loading = false;
        state.clientBillingPaymentTrackingReportList = action.payload?.data?.docs;
        state.clientBillingPaymentTrackingCount = action.payload?.data?.totalDocs;
      })
      .addCase(clientBillingPaymentTrackingReportFunc.rejected, (state, action) => {
        state.clientBillingPaymentTrackingReportFunc_loading = false;
        state.clientBillingPaymentTrackingReportList = [];
        state.clientBillingPaymentTrackingCount = 0;
        state.error = action.payload;
      })


       .addCase(financeBankListReportFunc.pending, (state) => {
        state.financeBankListReportFunc_loading = true;
        state.financeBankListReportList = [];
        state.financeBankListReportCount = 0;
      })
      .addCase(financeBankListReportFunc.fulfilled, (state, action) => {
        state.financeBankListReportFunc_loading = false;
        state.financeBankListReportList = action.payload?.data?.docs;
        state.financeBankListReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(financeBankListReportFunc.rejected, (state, action) => {
        state.financeBankListReportFunc_loading = false;
        state.financeBankListReportList = [];
        state.financeBankListReportCount = 0;
        state.error = action.payload;
      })




       .addCase(invoiceGstReturnPurchaseReportFunc.pending, (state) => {
        state.invoiceGstReturnPurchaseReport_loading = true;
        state.invoiceGstReturnPurchaseReportList = [];
        state.invoiceGstReturnPurchaseReportCount = 0;
      })
      .addCase(invoiceGstReturnPurchaseReportFunc.fulfilled, (state, action) => {
        state.invoiceGstReturnPurchaseReport_loading = false;
        state.invoiceGstReturnPurchaseReportList = action.payload?.data?.docs;
        state.invoiceGstReturnPurchaseReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(invoiceGstReturnPurchaseReportFunc.rejected, (state, action) => {
        state.invoiceGstReturnPurchaseReport_loading = false;
        state.invoiceGstReturnPurchaseReportList = [];
        state.invoiceGstReturnPurchaseReportCount = 0;
        state.error = action.payload;
      })



      .addCase(recieptReportFunc.pending, (state) => {
        state.recieptReport_loading = true;
        state.recieptReportList = [];
        state.recieptReportCount = 0;
      })
      .addCase(recieptReportFunc.fulfilled, (state, action) => {
        state.recieptReport_loading = false;
        state.recieptReportList = action.payload?.data?.docs;
        state.recieptReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(recieptReportFunc.rejected, (state, action) => {
        state.recieptReport_loading = false;
        state.recieptReportList = [];
        state.recieptReportCount = 0;
        state.error = action.payload;
      })



        .addCase(bankStatementReportFunc.pending, (state) => {
        state.bankStatementReport_loading = true;
        state.bankStatementReportList = [];
        state.bankStatementReportCount = 0;
      })
      .addCase(bankStatementReportFunc.fulfilled, (state, action) => {
        state.bankStatementReport_loading = false;
        state.bankStatementReportList = action.payload?.data;
        state.bankStatementReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(bankStatementReportFunc.rejected, (state, action) => {
        state.bankStatementReport_loading = false;
        state.bankStatementReportList = [];
        state.bankStatementReportCount = 0;
        state.error = action.payload;
      })






        .addCase(clientGrowthRevenueReportFunc.pending, (state) => {
        state.clientGrowthRevenueReportFunc_loading = true;
        state.clientGrowthRevenueReportList = [];
        state.clientGrowthRevenueReportCount = 0;
      })
      .addCase(clientGrowthRevenueReportFunc.fulfilled, (state, action) => {
        state.clientGrowthRevenueReportFunc_loading = false;
        state.clientGrowthRevenueReportList = action.payload?.data?.docs;
        state.clientGrowthRevenueReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(clientGrowthRevenueReportFunc.rejected, (state, action) => {
        state.clientGrowthRevenueReportFunc_loading = false;
        state.clientGrowthRevenueReportList = [];
        state.clientGrowthRevenueReportCount = 0;
        state.error = action.payload;
      })






        .addCase(financePaymentReportFunc.pending, (state) => {
        state.financePaymentReportFunc_loading = true;
        state.financePaymentReportList = [];
        state.financePaymentCount = 0;
      })
      .addCase(financePaymentReportFunc.fulfilled, (state, action) => {
        state.financePaymentReportFunc_loading = false;
        state.financePaymentReportList = action.payload?.data?.docs;
        state.financePaymentCount = action.payload?.data?.totalDocs;
      })
      .addCase(financePaymentReportFunc.rejected, (state, action) => {
        state.financePaymentReportFunc_loading = false;
        state.financePaymentReportList = [];
        state.financePaymentCount = 0;
        state.error = action.payload;
      })









           .addCase(clientStatementReportFunc.pending, (state) => {
        state.clientStatementReportFunc_loading = true;
        state.clientStatementReportList = [];
        state.clientStatementCount = 0;
      })
      .addCase(clientStatementReportFunc.fulfilled, (state, action) => {
        state.clientStatementReportFunc_loading = false;
        state.clientStatementReportList = action.payload?.data;
        state.clientStatementCount = action.payload?.data?.totalDocs;
      })
      .addCase(clientStatementReportFunc.rejected, (state, action) => {
        state.clientStatementReportFunc_loading = false;
        state.clientStatementReportList = [];
        state.clientStatementCount = 0;
        state.error = action.payload;
      })




       .addCase(clientInvoiceReportFunc.pending, (state) => {
        state.clientInvoiceReportFunc_loading = true;
        state.clientInvoiceReportList = [];
        state.clientInvoiceReportCount = 0;
      })
      .addCase(clientInvoiceReportFunc.fulfilled, (state, action) => {
        state.clientInvoiceReportFunc_loading = false;
        state.clientInvoiceReportList = action.payload?.data?.docs;
        state.clientInvoiceReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(clientInvoiceReportFunc.rejected, (state, action) => {
        state.clientInvoiceReportFunc_loading = false;
        state.clientInvoiceReportList = [];
        state.clientInvoiceReportCount = 0;
        state.error = action.payload;
      })




      
       .addCase(vendorInvoiceReport.pending, (state) => {
        state.vendorInvoiceReport_loading = true;
        state.vendorInvoiceReportList = [];
        state.vendorInvoiceReportCount = 0;
      })
      .addCase(vendorInvoiceReport.fulfilled, (state, action) => {
        state.vendorInvoiceReport_loading = false;
        state.vendorInvoiceReportList = action.payload?.data?.docs;
        state.vendorInvoiceReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(vendorInvoiceReport.rejected, (state, action) => {
        state.vendorInvoiceReport_loading = false;
        state.vendorInvoiceReportList = [];
        state.vendorInvoiceReportCount = 0;
        state.error = action.payload;
      })


      


          .addCase(vendorAdvanceReportFunc.pending, (state) => {
        state.vendorAdvanceReportFunc_loading = true;
        state.vendorAdvanceReportList = [];
        state.vendorAdvanceCount = 0;
      })
      .addCase(vendorAdvanceReportFunc.fulfilled, (state, action) => {
        state.vendorAdvanceReportFunc_loading = false;
        state.vendorAdvanceReportList = action.payload?.data?.docs;
        state.vendorAdvanceCount = action.payload?.data?.totalDocs;
      })
      .addCase(vendorAdvanceReportFunc.rejected, (state, action) => {
        state.vendorAdvanceReportFunc_loading = false;
        state.vendorAdvanceReportList = [];
        state.vendorAdvanceCount = 0;
        state.error = action.payload;
      })



       .addCase(financeAdvanceReportFunc.pending, (state) => {
        state.financeAdvanceReportFunc_loading = true;
        state.financeAdvanceReportList = [];
        state.financeAdvanceCount = 0;
      })
      .addCase(financeAdvanceReportFunc.fulfilled, (state, action) => {
        state.financeAdvanceReportFunc_loading = false;
        state.financeAdvanceReportList = action.payload?.data?.docs;
        state.financeAdvanceCount = action.payload?.data?.totalDocs;
      })
      .addCase(financeAdvanceReportFunc.rejected, (state, action) => {
        state.financeAdvanceReportFunc_loading = false;
        state.financeAdvanceReportList = [];
        state.financeAdvanceCount = 0;
        state.error = action.payload;
      })




      
       .addCase(financeAdvanceSummaryReportFunc.pending, (state) => {
        state.financeAdvanceSummaryReportFunc_loading = true;
        state.financeAdvanceSummaryReportList = [];
        state.financeAdvanceSummaryReportCount = 0;
      })
      .addCase(financeAdvanceSummaryReportFunc.fulfilled, (state, action) => {
        state.financeAdvanceSummaryReportFunc_loading = false;
        state.financeAdvanceSummaryReportList = action.payload?.data?.docs;
        state.financeAdvanceSummaryReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(financeAdvanceSummaryReportFunc.rejected, (state, action) => {
        state.financeAdvanceSummaryReportFunc_loading = false;
        state.financeAdvanceSummaryReportList = [];
        state.financeAdvanceSummaryReportCount = 0;
        state.error = action.payload;
      })
       .addCase(financeSummaryWiseFunc.pending, (state) => {
        state.financeSummaryWiseFunc_loading = true;
        state.financeInvoiceSummaryReportList = [];
        state.financeInvoiceSummaryReportSummary = {};
        state.financeInvoiceSummaryReportCount = 0;
      })
      .addCase(financeSummaryWiseFunc.fulfilled, (state, action) => {
        state.financeSummaryWiseFunc_loading = false;
        state.financeInvoiceSummaryReportList = action.payload?.data?.docs;
        state.financeInvoiceSummaryReportSummary = action.payload?.data?.summery || {};
        state.financeInvoiceSummaryReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(financeSummaryWiseFunc.rejected, (state, action) => {
        state.financeSummaryWiseFunc_loading = false;
        state.financeInvoiceSummaryReportList = [];
        state.financeInvoiceSummaryReportSummary = {};
        state.financeInvoiceSummaryReportCount = 0;
        state.error = action.payload;
      })









       .addCase(clientGroupStatementReportFunc.pending, (state) => {
        state.clientGroupStatementReportFunc_loading = true;
        state.clientGroupStatementReportList = [];
        state.clientGroupStatementCount = 0;
      })
      .addCase(clientGroupStatementReportFunc.fulfilled, (state, action) => {
        state.clientGroupStatementReportFunc_loading = false;
        state.clientGroupStatementReportList = action.payload?.data;
        state.clientGroupStatementCount = action.payload?.data?.totalDocs;
      })
      .addCase(clientGroupStatementReportFunc.rejected, (state, action) => {
        state.clientGroupStatementReportFunc_loading = false;
        state.clientGroupStatementReportList = [];
        state.clientGroupStatementCount = 0;
        state.error = action.payload;
      })



        .addCase(balanceSheetReportFunc.pending, (state) => {
        state.balanceSheetReport_loading = true;
        state.balanceSheetReportList = null;
        state.balanceSheetReportCount = 0;
      })
      .addCase(balanceSheetReportFunc.fulfilled, (state, action) => {
        state.balanceSheetReport_loading = false;
        state.balanceSheetReportList = action.payload?.data;
        state.balanceSheetReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(balanceSheetReportFunc.rejected, (state, action) => {
        state.balanceSheetReport_loading = false;
        state.balanceSheetReportList = null;
        state.balanceSheetReportCount = 0;
        state.error = action.payload;
      })









      .addCase(runningTaskReportFunc.pending, (state) => {
        state.runningTaskReportFunc_loading = true;
        state.runningTaskReportList = [];
        state.totalrunningTaskCount = 0;
      })
      .addCase(runningTaskReportFunc.fulfilled, (state, action) => {
        state.runningTaskReportFunc_loading = false;
        state.runningTaskReportList = action.payload?.data?.docs;
        state.totalrunningTaskCount = action.payload?.data?.totalDocs;
      })
      .addCase(runningTaskReportFunc.rejected, (state, action) => {
        state.runningTaskReportFunc_loading = false;
        state.runningTaskReportList = [];
        state.totalrunningTaskCount = 0;
        state.error = action.payload;
      })
      .addCase(employeeleaveCountReport.pending, (state) => {
        state.employeeleaveCountReportFunc_loading = true;
        state.employeeleaveCountReportList = [];
        state.employeeleaveCountReportCount = 0;
      })
      .addCase(employeeleaveCountReport.fulfilled, (state, action) => {
        state.employeeleaveCountReportFunc_loading = false;
        state.employeeleaveCountReportList = action.payload?.data?.docs;
        state.employeeleaveCountReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(employeeleaveCountReport.rejected, (state, action) => {
        state.employeeleaveCountReportFunc_loading = false;
        state.employeeleaveCountReportList = [];
        state.employeeleaveCountReportCount = 0;
        state.error = action.payload;
      })

      .addCase(employeEPBXReport.pending, (state) => {
        state.employeEPBXReportFunc_loading = true;
        state.employeEPBXReportList = [];
        state.employeEPBXReportCount = 0;
      })
      .addCase(employeEPBXReport.fulfilled, (state, action) => {
        state.employeEPBXReportFunc_loading = false;
        state.employeEPBXReportList = action.payload?.data?.docs;
        state.employeEPBXReportCount = action.payload?.data?.totalDocs;
      })
      .addCase(employeEPBXReport.rejected, (state, action) => {
        state.employeEPBXReportFunc_loading = false;
        state.employeEPBXReportList = [];
        state.employeEPBXReportCount = 0;
        state.error = action.payload;
      })

  },
});

export const { emptyReportFunc } = reportSlice.actions;

export default reportSlice.reducer;
