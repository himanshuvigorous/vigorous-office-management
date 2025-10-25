import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { projetpurchaseExpenceServices } from "./_projectpurchseFeature_services";







export const getprojetpurchaseExpenceList = createAsyncThunk(
  "user/getprojetpurchaseExpenceList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await projetpurchaseExpenceServices.getprojetpurchaseExpenceList(reqData);
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

export const projetpurchaseExpenceSearch = createAsyncThunk(
  "user/projetpurchaseExpenceSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await projetpurchaseExpenceServices.projetpurchaseExpenceSearch(reqData);
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

export const getprojetpurchaseExpenceDetails = createAsyncThunk(
  "user/getprojetpurchaseExpenceDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projetpurchaseExpenceServices.getprojetpurchaseExpenceDetails(reqData);
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

export const createprojetpurchaseExpence = createAsyncThunk(
  "user/createprojetpurchaseExpence",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projetpurchaseExpenceServices.createprojetpurchaseExpence(reqData);
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

export const updateprojetpurchaseExpence = createAsyncThunk(
  "user/updateprojetpurchaseExpence",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projetpurchaseExpenceServices.updateprojetpurchaseExpence(reqData);
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
export const deleteprojetpurchaseExpence = createAsyncThunk(
  "user/deleteprojetpurchaseExpence",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await projetpurchaseExpenceServices.deleteprojetpurchaseExpence(reqData);
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

const projectpurchaseExpenceSlice = createSlice({
  name: 'projectpurchaseExpenceSlice',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getprojetpurchaseExpenceList.pending, (state, action) => {
        state.loading = true;
        state.projectpurchaseExpenceListData = [];
        state.totalprojectpurchaseExpenceListCount = 0;
      })
      .addCase(getprojetpurchaseExpenceList.fulfilled, (state, action) => {
        state.projectpurchaseExpenceListData = action.payload?.data?.docs;
        state.totalprojectpurchaseExpenceListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getprojetpurchaseExpenceList.rejected, (state, action) => {
        state.loading = false;
        state.projectpurchaseExpenceListData = [];
        state.totalprojectpurchaseExpenceListCount = 0;
      })
      .addCase(projetpurchaseExpenceSearch.pending, (state, action) => {
        state.loading = true;
        state.projectpurchaseExpenceListData = [];
        state.totalprojectpurchaseExpenceListCount = 0;
      })
      .addCase(projetpurchaseExpenceSearch.fulfilled, (state, action) => {
        state.projectpurchaseExpenceListData = action.payload?.data?.docs;
        state.totalprojectpurchaseExpenceListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(projetpurchaseExpenceSearch.rejected, (state, action) => {
        state.loading = false;
        state.projectpurchaseExpenceListData = [];
        state.totalprojectpurchaseExpenceListCount = 0;
      })
      .addCase(createprojetpurchaseExpence.pending, (state) => {
        state.loading = true;
      })
      .addCase(createprojetpurchaseExpence.fulfilled, (state, action) => {
        state.loading = false;
        state.projectpurchaseExpenceCreateData = action.payload;
      })
      .addCase(createprojetpurchaseExpence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateprojetpurchaseExpence.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateprojetpurchaseExpence.fulfilled, (state, action) => {
        state.loading = false;
        state.projectpurchaseExpenceUpdateData = action.payload;
      })
      .addCase(updateprojetpurchaseExpence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteprojetpurchaseExpence.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteprojetpurchaseExpence.fulfilled, (state, action) => {
        state.loading = false;
        state.projectpurchaseExpenceDeleteData = action.payload;
      })
      .addCase(deleteprojetpurchaseExpence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getprojetpurchaseExpenceDetails.pending, (state) => {
        state.loading = true;
        state.projectpurchaseExpenceDetails = null;
      })
      .addCase(getprojetpurchaseExpenceDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.projectpurchaseExpenceDetails = action.payload?.data;
      })
      .addCase(getprojetpurchaseExpenceDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.projectpurchaseExpenceDetails = null;

      })
  },
});

export default projectpurchaseExpenceSlice.reducer;
