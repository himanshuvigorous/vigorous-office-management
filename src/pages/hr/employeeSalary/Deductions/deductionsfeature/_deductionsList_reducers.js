import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";
import { deductionsServices } from "./_deductionsList_services";







export const deductionsCreate = createAsyncThunk(
  "deductionsCreate",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await deductionsServices.deductionsCreate(userData);
    
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
export const getdeductionsList = createAsyncThunk(
  "getdeductionsList",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await deductionsServices.getdeductionsList(userData);
    
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
export const deductionsListSearch = createAsyncThunk(
  "deductionsListSearch",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await deductionsServices.deductionsListSearch(userData);
    
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
export const deductionsDetails = createAsyncThunk(
  "deductionsDetails",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await deductionsServices.deductionsDetails(userData);
    
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
export const deductionsUpdate = createAsyncThunk(
  "deductionsUpdate",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await deductionsServices.deductionsUpdate(userData);
    
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
export const deductionsDelete = createAsyncThunk(
  "deductionsDelete",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await deductionsServices.deductionsDelete(userData);
    
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
      .addCase(deductionsCreate.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deductionsCreate.fulfilled, (state, action) => {
        state.deductionsCreateData = action.payload?.data;
        state.loading = false;
      })
      .addCase(deductionsCreate.rejected, (state, action) => {
        state.loading = false;;
      })
      .addCase(getdeductionsList.pending, (state, action) => {
        state.loading = true;
        state.deductionsListData = [];
        state.deductionsListTotal = 0;
      })
      .addCase(getdeductionsList.fulfilled, (state, action) => {
        state.deductionsListData = action.payload?.data?.docs;
        state.deductionsListTotal = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getdeductionsList.rejected, (state, action) => {
        state.loading = false;
        state.deductionsListData = [];
        state.deductionsListTotal = 0;
      })
      .addCase(deductionsListSearch.pending, (state, action) => {
        state.loading = true;
        state.deductionsListData = [];
        state.deductionsListTotal = 0;
      })
      .addCase(deductionsListSearch.fulfilled, (state, action) => {
        state.deductionsListData = action.payload?.data?.docs;
        state.deductionsListTotal = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(deductionsListSearch.rejected, (state, action) => {
        state.loading = false;
        state.deductionsListData = [];
        state.deductionsListTotal = 0;
      })
      .addCase(deductionsDetails.pending, (state, action) => {
        state.loading = true;
        state.deductionsDetailsData = {};

      })
      .addCase(deductionsDetails.fulfilled, (state, action) => {
        state.deductionsDetailsData = action.payload?.data;
        state.loading = false;
      })
      .addCase(deductionsDetails.rejected, (state, action) => {
        state.loading = false;
        state.deductionsDetailsData = {};

      })
      .addCase(deductionsUpdate.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deductionsUpdate.fulfilled, (state, action) => {
        state.craetedeductionsData = action.payload?.data;
        state.loading = false;
      })
      .addCase(deductionsUpdate.rejected, (state, action) => {
        state.loading = false;
        state.craetedeductionsData = {};

      })
      .addCase(deductionsDelete.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deductionsDelete.fulfilled, (state, action) => {
        state.deletedeductionsData = action.payload?.data;
        state.loading = false;
      })
      .addCase(deductionsDelete.rejected, (state, action) => {
        state.loading = false;
        state.craetedeductionsData = {};

      })

      
  },
});
export const {  resetAttendance } = attendancegSlice.actions;
export default attendancegSlice.reducer;
