import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";
import { allowanceServices } from "./_allowanceList_services";






export const allowanceCreate = createAsyncThunk(
  "allowanceCreate",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await allowanceServices.allowanceCreate(userData);
    
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
export const getAllowanceList = createAsyncThunk(
  "getAllowanceList",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await allowanceServices.getAllowanceList(userData);
    
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
export const allowanceListSearch = createAsyncThunk(
  "allowanceListSearch",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await allowanceServices.allowanceListSearch(userData);
    
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
export const allowanceDetails = createAsyncThunk(
  "allowanceDetails",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await allowanceServices.allowanceDetails(userData);
    
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
export const allowanceUpdate = createAsyncThunk(
  "allowanceUpdate",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await allowanceServices.allowanceUpdate(userData);
    
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
export const allowanceDelete = createAsyncThunk(
  "allowanceDelete",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await allowanceServices.allowanceDelete(userData);
    
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
      .addCase(allowanceCreate.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(allowanceCreate.fulfilled, (state, action) => {
        state.allowanceCreateData = action.payload?.data;
        state.loading = false;
      })
      .addCase(allowanceCreate.rejected, (state, action) => {
        state.loading = false;;
      })
      .addCase(getAllowanceList.pending, (state, action) => {
        state.allowanceListData = [];
        state.allowanceListTotal = 0;
        state.loading = true;
      })
      .addCase(getAllowanceList.fulfilled, (state, action) => {
        state.allowanceListData = action.payload?.data?.docs;
        state.allowanceListTotal = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getAllowanceList.rejected, (state, action) => {
        state.loading = false;
        state.allowanceListData = [];
        state.allowanceListTotal = 0;
      })
      .addCase(allowanceListSearch.pending, (state, action) => {
        state.allowanceListData = [];
        state.allowanceListTotal = 0;
        state.loading = true;
      })
      .addCase(allowanceListSearch.fulfilled, (state, action) => {
        state.allowanceListData = action.payload?.data?.docs;
        state.allowanceListTotal = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(allowanceListSearch.rejected, (state, action) => {
        state.loading = false;
        state.allowanceListData = [];
        state.allowanceListTotal = 0;
      })
      .addCase(allowanceDetails.pending, (state, action) => {
         
        state.loading = true;
        state.allowanceDetailsData = {};
      })
      .addCase(allowanceDetails.fulfilled, (state, action) => {
        state.allowanceDetailsData = action.payload?.data;
        state.loading = false;
      })
      .addCase(allowanceDetails.rejected, (state, action) => {
        state.loading = false;
        state.allowanceDetailsData = {};

      })
      .addCase(allowanceUpdate.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(allowanceUpdate.fulfilled, (state, action) => {
        state.craeteAllowanceData = action.payload?.data;
        state.loading = false;
      })
      .addCase(allowanceUpdate.rejected, (state, action) => {
        state.loading = false;
        state.craeteAllowanceData = {};

      })
      .addCase(allowanceDelete.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(allowanceDelete.fulfilled, (state, action) => {
        state.deleteAllowanceData = action.payload?.data;
        state.loading = false;
      })
      .addCase(allowanceDelete.rejected, (state, action) => {
        state.loading = false;
        state.craeteAllowanceData = {};

      })

      
  },
});
export const {  resetAttendance } = attendancegSlice.actions;
export default attendancegSlice.reducer;
