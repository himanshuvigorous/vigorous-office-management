import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../global_layouts/CustomNotification/NotificationManager";
import { dashboardServices } from "../_services/_dashboard_services";

const initialState = {
  
};


export const adminDashboard = createAsyncThunk(
  "dashboard/adminDashboard",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await dashboardServices.adminDashboard(userData);
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
export const companyDashboard = createAsyncThunk(
  "dashboard/companyDashboard",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await dashboardServices.companyDashboard(userData);
      
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
export const hrDashboardFunc = createAsyncThunk(
  "dashboard/hrDashboardFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await dashboardServices.hrDashboardFunc(userData);
      
     
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
export const employeeDashboardFunc = createAsyncThunk(
  "dashboard/employeeDashboardFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await dashboardServices.employeeDashboardFunc(userData)
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



const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    logout(state) {
      state.loggedIn = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminDashboard.pending, (state) => {
        state.adminDashboard_loading = true;
      })
      .addCase(adminDashboard.fulfilled, (state, action) => {
        state.adminDashboard_loading = false;
        state.adminDashboardData = action.payload?.data;
      })
      .addCase(adminDashboard.rejected, (state, action) => {
        state.adminDashboard_loading = false;
        state.error = action.payload;
      })
      .addCase(companyDashboard.pending, (state) => {
        state.companyDashboard_loading = true;
      })
      .addCase(companyDashboard.fulfilled, (state, action) => {
        state.companyDashboard_loading = false;
        state.companyDashboardData = action.payload?.data;
      })
      .addCase(companyDashboard.rejected, (state, action) => {
        state.companyDashboard_loading = false;
        state.error = action.payload;
      })
      .addCase(hrDashboardFunc.pending, (state) => {
        state.hrDashboardFunc_loading = true;
      })
      .addCase(hrDashboardFunc.fulfilled, (state, action) => {
        state.hrDashboard_loading = false;
        state.hrDashboardData = action.payload?.data;
      })
      .addCase(hrDashboardFunc.rejected, (state, action) => {
        state.hrDashboard_loading = false;
        state.error = action.payload;
      })
      .addCase(employeeDashboardFunc.pending, (state) => {
        state.employeeDashboardFunc_loading = true;
      })
      .addCase(employeeDashboardFunc.fulfilled, (state, action) => {
        state.employeeDashboardFunc_loading = false;
        state.employeeDashboardData = action.payload?.data;
      })
      .addCase(employeeDashboardFunc.rejected, (state, action) => {
        state.employeeDashboardFunc_loading = false;
        state.error = action.payload;
      })
      
  },
});


export const { logout } = dashboardSlice.actions;

export default dashboardSlice.reducer;
