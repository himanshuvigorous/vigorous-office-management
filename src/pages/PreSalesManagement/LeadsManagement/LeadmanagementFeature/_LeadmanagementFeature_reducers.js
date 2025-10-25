import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LeadmanagementFeatureServices } from "./_LeadmanagementFeature_services";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";


export const getLeadmanagementFeatureList = createAsyncThunk(
  "user/LeadmanagementFeatureList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await LeadmanagementFeatureServices.getLeadmanagementFeatureList(reqData);
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



export const getLeadmanagementFeatureById = createAsyncThunk(
  "user/getLeadmanagementFeatureById",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await LeadmanagementFeatureServices.getLeadmanagementFeatureById(userData);
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

export const createLeadmanagementFeatureFunc = createAsyncThunk(
  "user/createLeadmanagementFeatureFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await LeadmanagementFeatureServices.LeadmanagementFeatureCreate(userData);
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

export const updateLeadmanagementFeatureFunc = createAsyncThunk(
  "user/updateLeadmanagementFeatureFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await LeadmanagementFeatureServices.LeadmanagementFeatureUpdate(userData);
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

export const deleteLeadmanagementFeatureFunc = createAsyncThunk(
  "user/deleteLeadmanagementFeatureFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await LeadmanagementFeatureServices.LeadmanagementFeatureDelete(userData);
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
export const LeadmanagementFeatureStatus = createAsyncThunk(
  "user/LeadmanagementFeatureStatus",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await LeadmanagementFeatureServices.LeadmanagementFeatureStatus(userData);
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
export const LeadmanagementFollowupcommentCreate = createAsyncThunk(
  "user/LeadmanagementFollowupcommentCreate",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await LeadmanagementFeatureServices.LeadmanagementFollowupcommentCreate(userData);
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
export const LeadmanagementFollowupcommentListFunc = createAsyncThunk(
  "user/LeadmanagementFollowupcommentListFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await LeadmanagementFeatureServices.LeadmanagementFollowupcommentListFunc(userData);
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

export const getLeadmanagementtransferList = createAsyncThunk(
  "user/getLeadmanagementtransferList",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await LeadmanagementFeatureServices.getLeadmanagementtransferList(userData);
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
export const LeadmanagementTransferListCreate = createAsyncThunk(
  "user/LeadmanagementTransferListCreate",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await LeadmanagementFeatureServices.LeadmanagementTransferListCreate(userData);
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
export const LeadmanagementTransferListUpdate = createAsyncThunk(
  "user/LeadmanagementTransferListUpdate",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await LeadmanagementFeatureServices.LeadmanagementTransferListUpdate(userData);
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
export const LeadmanagementTransferListDelete = createAsyncThunk(
  "user/LeadmanagementTransferListDelete",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await LeadmanagementFeatureServices.LeadmanagementTransferListDelete(userData);
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
export const LeadmanagementTransferListStatus = createAsyncThunk(
  "user/LeadmanagementTransferListStatus",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await LeadmanagementFeatureServices.LeadmanagementTransferListStatus(userData);
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
export const LeadManagementReport = createAsyncThunk(
  "user/LeadManagementReport",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await LeadmanagementFeatureServices.LeadManagementReport(userData);
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

const LeadmanagementFeatureSlice = createSlice({
  name: 'LeadmanagementFeature',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getLeadmanagementFeatureList.pending, (state, action) => {
        state.loading = true;
        state.LeadmanagementFeatureListData = [];
        state.totalLeadmanagementFeatureCount = 0;
      })
      .addCase(getLeadmanagementFeatureList.fulfilled, (state, action) => {
        state.LeadmanagementFeatureListData = action.payload?.data?.docs;
        state.totalLeadmanagementFeatureCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getLeadmanagementFeatureList.rejected, (state, action) => {
        state.loading = false;
        state.LeadmanagementFeatureListData = [];
        state.totalLeadmanagementFeatureCount = 0;
      })
      .addCase(createLeadmanagementFeatureFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createLeadmanagementFeatureFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.LeadmanagementFeatureCreateData = action.payload;
      })
      .addCase(createLeadmanagementFeatureFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateLeadmanagementFeatureFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateLeadmanagementFeatureFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.LeadmanagementFeatureUpdateData = action.payload;
      })
      .addCase(updateLeadmanagementFeatureFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteLeadmanagementFeatureFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteLeadmanagementFeatureFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.LeadmanagementFeatureDeleteData = action.payload;
      })
      .addCase(deleteLeadmanagementFeatureFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(LeadmanagementFeatureStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(LeadmanagementFeatureStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.LeadmanagementFeatureStatusData = action.payload;
      })
      .addCase(LeadmanagementFeatureStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getLeadmanagementFeatureById.pending, (state) => {
        state.loading = true;
        state.LeadmanagementFeatureByIdData = null;
      })

      .addCase(getLeadmanagementFeatureById.fulfilled, (state, action) => {
        state.loading = false;
        state.LeadmanagementFeatureByIdData = action.payload?.data;
      })
      .addCase(getLeadmanagementFeatureById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.LeadmanagementFeatureByIdData = null;
      })
      .addCase(LeadmanagementFollowupcommentCreate.pending, (state) => {
        state.loading = true;
        state.LeadmanagementFollowupCreate = null;
      })

      .addCase(LeadmanagementFollowupcommentCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.LeadmanagementFollowupCreate = action.payload?.data;
      })
      .addCase(LeadmanagementFollowupcommentCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.LeadmanagementFollowupCreate = null;
      })
      .addCase(LeadmanagementFollowupcommentListFunc.pending, (state, action) => {
        state.loading = true;
        state.LeadmanagementFoolowupList = [];
        state.totalLeadmanagementFollowUpList = 0;
      })
      .addCase(LeadmanagementFollowupcommentListFunc.fulfilled, (state, action) => {
        state.LeadmanagementFoolowupList = action.payload?.data?.docs;
        state.totalLeadmanagementFollowUpList = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(LeadmanagementFollowupcommentListFunc.rejected, (state, action) => {
        state.loading = false;
        state.LeadmanagementFoolowupList = [];
        state.totalLeadmanagementFollowUpList = 0;
      })
      .addCase(getLeadmanagementtransferList.pending, (state, action) => {
        state.loading = true;
        state.LeadmanagementTransferList = [];
        state.totalLeadmanagementTransferList = 0;
      })
      .addCase(getLeadmanagementtransferList.fulfilled, (state, action) => {
        state.LeadmanagementTransferList = action.payload?.data?.docs;
        state.totalLeadmanagementTransferList = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getLeadmanagementtransferList.rejected, (state, action) => {
        state.loading = false;
        state.LeadmanagementTransferList = [];
        state.totalLeadmanagementTransferList = 0;
      })
      .addCase(LeadmanagementTransferListDelete.pending, (state) => {
        state.loading = true;
      })
      .addCase(LeadmanagementTransferListDelete.fulfilled, (state, action) => {
        state.loading = false;
        state.LeadmanagementFeatureDeleteData = action.payload;
      })
      .addCase(LeadmanagementTransferListDelete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(LeadmanagementTransferListCreate.pending, (state) => {
        state.loading = true;
      })
      .addCase(LeadmanagementTransferListCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.LeadmanagementFeatureCreateData = action.payload;
      })
      .addCase(LeadmanagementTransferListCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(LeadmanagementTransferListUpdate.pending, (state) => {
        state.loading = true;
      })
      .addCase(LeadmanagementTransferListUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.LeadmanagementFeatureCreateData = action.payload;
      })
      .addCase(LeadmanagementTransferListUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(LeadmanagementTransferListStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(LeadmanagementTransferListStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.LeadmanagementFeatureCreateData = action.payload;
      })
      .addCase(LeadmanagementTransferListStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(LeadManagementReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(LeadManagementReport.fulfilled, (state, action) => {
        state.loading = false;
        state.LeadmanagementReportdata = action.payload?.data;
      })
      .addCase(LeadManagementReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default LeadmanagementFeatureSlice.reducer;
