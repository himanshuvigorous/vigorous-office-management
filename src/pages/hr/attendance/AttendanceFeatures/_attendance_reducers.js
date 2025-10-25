import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { attendanceServices } from "./_attendance_services";




export const getattendancegList = createAsyncThunk(
  "getattendancegList",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await attendanceServices.getattendanceList(userData);
    
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
export const getattendanceListForEmployee = createAsyncThunk(
  "getattendancegListForEmployee",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await attendanceServices.getattendanceList(userData);
    
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


export const attendancegSearch = createAsyncThunk(
  "user/attendancegSearch",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await attendanceServices.attendanceSearch(userData);
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

export const attendancegCreate = createAsyncThunk(
  "attendancegCreate",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await attendanceServices.attendanceCreate(userData);
      showNotification({
        message: user?.companyinfo?.message,
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
export const getattendancegDetails = createAsyncThunk(
  "/company/getattendancegDetails",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await attendanceServices.getattendanceDetails(userData);
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



export const updateattendanceg = createAsyncThunk(
  "/updateattendanceg",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await attendanceServices.updateattendance(userData);
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
export const deleteattendanceg = createAsyncThunk(
  "/deleteattendanceg",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await attendanceServices.deleteattendance(userData);
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
export const attendanceStatus = createAsyncThunk(
  "/attendanceStatus",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await attendanceServices.attendanceStatus(userData);
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
export const getAllAttendanceRecord = createAsyncThunk(
  "/AllAttendanceRecord",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await attendanceServices.AllAttendanceRecord(userData);
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
export const getTodayCheckinData = createAsyncThunk(
  "/todayCheckinData",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await attendanceServices.todayCheckinData(userData);
      // showNotification({
      //   message: user?.message,
      //   type: 'success',
      // });
      return user;
    } catch (error) {
      // showNotification({
      //   message: error?.data?.message,
      //   type: 'error',
      // });
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
      .addCase(getattendancegList.pending, (state, action) => {
        state.attendanceList = []
        state.totalattendancegCount = 0;
        state.loading = true;
      })
      .addCase(getattendancegList.fulfilled, (state, action) => {
        state.attendanceList = action.payload?.data?.docs;
        state.totalattendancegCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getattendancegList.rejected, (state, action) => {
        state.loading = false;
        state.attendancegList = [];
        state.totalattendancegCount = 0;
      })
      .addCase(getattendanceListForEmployee.pending, (state, action) => {
        state.attendanceListForEmployee = []
        state.totalattendancegCountForEmployee = 0;
        state.loading = true;
      })
      .addCase(getattendanceListForEmployee.fulfilled, (state, action) => {
        state.attendanceListForEmployee = action.payload?.data?.docs;
        state.totalattendancegCountForEmployee = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getattendanceListForEmployee.rejected, (state, action) => {
        state.loading = false;
        state.attendanceListForEmployee = [];
        state.totalattendancegCountForEmployee = 0;
      })
      .addCase(attendancegSearch.pending, (state, action) => {
        state.attendanceList = [];
        state.totalattendancegCount = 0;
        state.loading = true;
      })
      .addCase(attendancegSearch.fulfilled, (state, action) => {
        state.attendanceList = action.payload?.data?.docs;
        state.totalattendancegCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(attendancegSearch.rejected, (state, action) => {
        state.loading = false;
        state.attendancegList = [];
        state.totalattendancegCount = 0;
      })
      .addCase(attendancegCreate.pending, (state) => {
        state.loading = true;
      })
      .addCase(attendancegCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.attendancegCreateData = action.payload;
      })
      .addCase(attendancegCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateattendanceg.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateattendanceg.fulfilled, (state, action) => {
        state.loading = false;
        state.attendancegupdateData = action.payload;
      })
      .addCase(updateattendanceg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteattendanceg.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteattendanceg.fulfilled, (state, action) => {
        state.loading = false;
        state.userdeleteData = action.payload;
      })
      .addCase(deleteattendanceg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(attendanceStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(attendanceStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.userstatusAata = action.payload;
      })
      .addCase(attendanceStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getattendancegDetails.pending, (state, action) => {
        state.attendancegDetailsData = null;
        state.loading = true;
      })
      .addCase(getattendancegDetails.fulfilled, (state, action) => {
        state.attendancegDetailsData = action.payload?.data;
        state.loading = false;
      })
      .addCase(getattendancegDetails.rejected, (state, action) => {
        state.loading = false;
        state.attendancegDetailsData = null;

      })
      .addCase(getAllAttendanceRecord.pending, (state, action) => {
        state.AllAttendanceRecordData = null;
        state.loading = true;
      })
      .addCase(getAllAttendanceRecord.fulfilled, (state, action) => {
        state.AllAttendanceRecordData = action.payload?.data;
        state.loading = false;
      })
      .addCase(getAllAttendanceRecord.rejected, (state, action) => {
        state.loading = false;
        state.attendancegDetailsData = null;

      })
    .addCase(getTodayCheckinData.pending, (state, action) => {
      state.todayAttendanceData  = {};
        state.loading = true;
      })
      .addCase(getTodayCheckinData.fulfilled, (state, action) => {
        state.todayAttendanceData  = action.payload?.data;
        state.loading = false;
      })
      .addCase(getTodayCheckinData.rejected, (state, action) => {
        state.loading = false;
        state.todayAttendanceData = {};

      })
      
  },
});
export const {  resetAttendance } = attendancegSlice.actions;
export default attendancegSlice.reducer;
