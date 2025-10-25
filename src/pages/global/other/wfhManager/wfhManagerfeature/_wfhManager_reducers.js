import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";
import { wfhManagerServices } from "./_wfhManager_services";








export const wfhManagerCreate = createAsyncThunk(
  "wfhManagerCreate",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await wfhManagerServices.wfhManagerCreate(userData);
    
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
export const getwfhManagerList = createAsyncThunk(
  "getwfhManagerList",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await wfhManagerServices.getwfhManagerList(userData);
    
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
export const wfhManagerListSearch = createAsyncThunk(
  "wfhManagerListSearch",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await wfhManagerServices.wfhManagerListSearch(userData);
    
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
export const wfhManagerDetails = createAsyncThunk(
  "wfhManagerDetails",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await wfhManagerServices.wfhManagerDetails(userData);
    
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
export const wfhManagerUpdate = createAsyncThunk(
  "wfhManagerUpdate",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await wfhManagerServices.wfhManagerUpdate(userData);
    
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
export const wfhManagerDelete = createAsyncThunk(
  "wfhManagerDelete",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await wfhManagerServices.wfhManagerDelete(userData);
    
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
      .addCase(wfhManagerCreate.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(wfhManagerCreate.fulfilled, (state, action) => {
        state.wfhManagerCreateData = action.payload?.data;
        state.loading = false;
      })
      .addCase(wfhManagerCreate.rejected, (state, action) => {
        state.loading = false;;
      })
      .addCase(getwfhManagerList.pending, (state, action) => {
        state.loading = true;
        state.wfhManagerListData = [];
        state.wfhManagerListTotal = 0;
      })
      .addCase(getwfhManagerList.fulfilled, (state, action) => {
        state.wfhManagerListData = action.payload?.data?.docs;
        state.wfhManagerListTotal = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getwfhManagerList.rejected, (state, action) => {
        state.loading = false;
        state.wfhManagerListData = [];
        state.wfhManagerListTotal = 0;
      })
      .addCase(wfhManagerListSearch.pending, (state, action) => {
        state.loading = true;
        state.wfhManagerListData = [];
        state.wfhManagerListTotal = 0;
      })
      .addCase(wfhManagerListSearch.fulfilled, (state, action) => {
        state.wfhManagerListData = action.payload?.data?.docs;
        state.wfhManagerListTotal = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(wfhManagerListSearch.rejected, (state, action) => {
        state.loading = false;
        state.wfhManagerListData = [];
        state.wfhManagerListTotal = 0;
      })
      .addCase(wfhManagerDetails.pending, (state, action) => {
        state.loading = true;
        state.wfhManagerDetailsData = {};

      })
      .addCase(wfhManagerDetails.fulfilled, (state, action) => {
        state.wfhManagerDetailsData = action.payload?.data;
        state.loading = false;
      })
      .addCase(wfhManagerDetails.rejected, (state, action) => {
        state.loading = false;
        state.wfhManagerDetailsData = {};

      })
      .addCase(wfhManagerUpdate.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(wfhManagerUpdate.fulfilled, (state, action) => {
        state.craetewfhManagerData = action.payload?.data;
        state.loading = false;
      })
      .addCase(wfhManagerUpdate.rejected, (state, action) => {
        state.loading = false;
        state.craetewfhManagerData = {};

      })
      .addCase(wfhManagerDelete.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(wfhManagerDelete.fulfilled, (state, action) => {
        state.deletewfhManagerData = action.payload?.data;
        state.loading = false;
      })
      .addCase(wfhManagerDelete.rejected, (state, action) => {
        state.loading = false;
        state.craetewfhManagerData = {};

      })

      
  },
});
export const {  resetAttendance } = attendancegSlice.actions;
export default attendancegSlice.reducer;
