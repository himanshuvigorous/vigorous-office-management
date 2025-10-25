import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { stateServices } from "./_state_services";
import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";

export const getStateList = createAsyncThunk(
  "user/getStateList",
  async (stateReqData, { rejectWithValue }) => {
    try {
      const response = await stateServices.getStateList(stateReqData);
      return response;
    } catch (error) {
      // showNotification({
      //   message: error?.data?.message,
      //   type: 'error',
      // });
      return rejectWithValue(error.message);
    }
  }
);

export const stateSearch = createAsyncThunk(
  "user/stateSearch",
  async (userData, { rejectWithValue }) => {

    try {
      const response = await stateServices.stateSearch(userData);
      return response;
    } catch (error) {
      // showNotification({
      //   message: error?.data?.message,
      //   type: 'error',
      // });
      return rejectWithValue(error.message);
    }
  }
);

export const secStateSearch = createAsyncThunk(
  "user/secStateSearch",
  async (userData, { rejectWithValue }) => {

    try {
      const response = await stateServices.stateSearch(userData);
      return response;
    } catch (error) {
      // showNotification({
      //   message: error?.data?.message,
      //   type: 'error',
      // });
      return rejectWithValue(error.message);
    }
  }
);


export const getStateById = createAsyncThunk(
  "user/getStateById",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await stateServices.getStateById(userData);

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
export const createStateFunc = createAsyncThunk(
  "user/createStateFunc",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await stateServices.createStateFunc(userData);
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
export const updateStateData = createAsyncThunk(
  "user/updateStateData",
  async (userData, { rejectWithValue }) => {

    try {

      const response = await stateServices.updateStateData(userData);
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
export const deleteStateFunc = createAsyncThunk(
  "user/deleteStateFunc",
  async (userData, { rejectWithValue }) => {

    try {

      const user = await stateServices.deleteStateFunc(userData);
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

const StateSlice = createSlice({
  name: 'stateData',
  initialState: {
    stateListData: [],
    stateByIdData: {},
    totalStateCount: 0,
    secStateList: []
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getStateList.pending, (state, action) => {
        state.loading = true;
        state.stateListData = [];
        state.totalStateCount = 0;
      })
      .addCase(getStateList.fulfilled, (state, action) => {
        state.stateListData = action.payload?.data;
        state.totalStateCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getStateList.rejected, (state, action) => {
        state.loading = false;
        state.stateListData = [];
        state.totalStateCount = 0;
      })
      .addCase(stateSearch.pending, (state, action) => {
        state.loading = true;
        state.stateListData = [];
        state.totalStateCount = 0;
      })
      .addCase(stateSearch.fulfilled, (state, action) => {
        state.stateListData = action.payload?.data;
        state.totalStateCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(stateSearch.rejected, (state, action) => {
        state.loading = false;
        state.stateListData = [];
        state.totalStateCount = 0;
      })
      .addCase(secStateSearch.pending, (state, action) => {
        state.loading = true;
        state.secStateList = [];
        state.totalStateCount = 0;
      })
      .addCase(secStateSearch.fulfilled, (state, action) => {
        state.secStateList = action.payload?.data;
        state.totalStateCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(secStateSearch.rejected, (state, action) => {
        state.loading = false;
        state.secStateList = [];
        state.totalStateCount = 0;
      })
      .addCase(createStateFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createStateFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.GstTypeCreateData = action.payload;
      })
      .addCase(createStateFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateStateData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateStateData.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateStateData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteStateFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteStateFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.GstTypetDeleteData = action.payload;
      })
      .addCase(deleteStateFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getStateById.pending, (state) => {
        state.loading = true;
        state.stateByIdData = null;
      })
      .addCase(getStateById.fulfilled, (state, action) => {
        state.loading = false;
        state.stateByIdData = action.payload?.data;
      })
      .addCase(getStateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.stateByIdData = null;
      })
  },
});

export default StateSlice.reducer;
