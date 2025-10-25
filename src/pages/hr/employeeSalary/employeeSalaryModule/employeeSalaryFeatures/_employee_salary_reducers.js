import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";
import { employeeSalaryServices } from "./_employee_salary_services";



export const createEmployeeSalaryDetails = createAsyncThunk(
  "createEmployeeSalaryDetails",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await employeeSalaryServices.createEmployeeSalaryDetails(userData);
      showNotification({
        message: user?.message,
        type: 'success',
      });
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


export const getEmployeeSalaryDetailsList = createAsyncThunk(
  "getEmployeeSalaryDetailsList",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await employeeSalaryServices.getEmployeeSalaryDetailsList(userData);
    
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
export const getDetailsEmployeeSalaryDetails = createAsyncThunk(
  "getDetailsEmployeeSalaryDetails",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await employeeSalaryServices.getDetailsEmployeeSalaryDetails(userData);
    
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
export const updateEmployeeSalaryDetails = createAsyncThunk(
  "updateEmployeeSalaryDetails",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await employeeSalaryServices.updateEmployeeSalaryDetails(userData);
      showNotification({
        message: user?.message,
        type: 'success',
      });
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
export const deleteEmployeeSalaryDetails = createAsyncThunk(
  "deleteEmployeeSalaryDetails",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await employeeSalaryServices.deleteEmployeeSalaryDetails(userData);
      showNotification({
        message: user?.message,
        type: 'success',
      });
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
export const createSalaryIncrement = createAsyncThunk(
  "createSalaryIncrement",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await employeeSalaryServices.createSalaryIncrement(userData);
      showNotification({
        message: user?.message,
        type: 'success',
      });
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
export const incrementList = createAsyncThunk(
  "incrementList",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await employeeSalaryServices.incrementList(userData);
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
export const incrementStatusUpdate = createAsyncThunk(
  "incrementStatusUpdate",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await employeeSalaryServices.incrementStatusUpdate(userData);
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





const attendancegSlice = createSlice({
  name: 'user',
  initialState: {
  
  },
  reducers: {
    resetAttendance: (state) => {
      state.attendanceList = [];
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(createEmployeeSalaryDetails.pending, (state, action) => {
        state.loading = true;
        state.employeeSalaryDetailsCreate = {};
      })
      .addCase(createEmployeeSalaryDetails.fulfilled, (state, action) => {
        state.employeeSalaryDetailsCreate = action.payload?.data;

        state.loading = false;
      })
      .addCase(createEmployeeSalaryDetails.rejected, (state, action) => {
        state.loading = false;
        state.employeeSalaryDetailsCreate = {};

      })
      .addCase(getEmployeeSalaryDetailsList.pending, (state, action) => {
        state.loading = true;
        state.employeeSalaryList = [];
        state.employeeSalaryCount = 0;
      })
      .addCase(getEmployeeSalaryDetailsList.fulfilled, (state, action) => {
        state.employeeSalaryList = action.payload?.data?.docs;
        state.employeeSalaryCount = action.payload?.data?.totalDocs;

        state.loading = false;
      })
      .addCase(getEmployeeSalaryDetailsList.rejected, (state, action) => {
        state.loading = false;
        state.employeeSalaryList = [];
        state.employeeSalaryCount = 0;

      })
      .addCase(getDetailsEmployeeSalaryDetails.pending, (state, action) => {
        state.loading = true;
        state.employeeSalaryDetails = {};
      })
      .addCase(getDetailsEmployeeSalaryDetails.fulfilled, (state, action) => {
        state.employeeSalaryDetails = action.payload?.data;

        state.loading = false;
      })
      .addCase(getDetailsEmployeeSalaryDetails.rejected, (state, action) => {
        state.loading = false;
        state.employeeSalaryDetails = {};

      })
      .addCase(updateEmployeeSalaryDetails.pending, (state, action) => {
        state.loading = true;
        state.employeeSalaryDetailsUpdate = {};
      })
      .addCase(updateEmployeeSalaryDetails.fulfilled, (state, action) => {
        state.employeeSalaryDetailsUpdate = action.payload?.data;

        state.loading = false;
      })
      .addCase(updateEmployeeSalaryDetails.rejected, (state, action) => {
        state.loading = false;
        state.employeeSalaryDetailsUpdate = {};

      })
      .addCase(deleteEmployeeSalaryDetails.pending, (state, action) => {
        state.loading = true;
        state.employeeSalaryDetailsdelete = {};
      })
      .addCase(deleteEmployeeSalaryDetails.fulfilled, (state, action) => {
        state.employeeSalaryDetailsdelete = action.payload?.data;

        state.loading = false;
      })
      .addCase(deleteEmployeeSalaryDetails.rejected, (state, action) => {
        state.loading = false;
        state.employeeSalaryDetailsdelete = {};

      })
      .addCase(createSalaryIncrement.pending, (state, action) => {
        state.loading = true;
        state.createIncrementdata = {};
      })
      .addCase(createSalaryIncrement.fulfilled, (state, action) => {
        state.createIncrementdata = action.payload?.data;

        state.loading = false;
      })
      .addCase(createSalaryIncrement.rejected, (state, action) => {
        state.loading = false;
        state.createIncrementdata = {};

      })
      .addCase(incrementList.pending, (state, action) => {
        state.loading = true;
        state.incrementListData = {};
      })
      .addCase(incrementList.fulfilled, (state, action) => {
        state.incrementListData = action.payload?.data;
        state.loading = false;
      })
      .addCase(incrementList.rejected, (state, action) => {
        state.loading = false;
        state.incrementListData = {};
      })
      .addCase(incrementStatusUpdate.pending, (state, action) => {
        state.loading = true;
        state.incrementStatusUpdateData = {};
      })
      .addCase(incrementStatusUpdate.fulfilled, (state, action) => {
        state.incrementStatusUpdateData = action.payload?.data;
        state.loading = false;
      })
      .addCase(incrementStatusUpdate.rejected, (state, action) => {
        state.loading = false;
        state.incrementStatusUpdateData = {};

      })
      
  },
});

export default attendancegSlice.reducer;
