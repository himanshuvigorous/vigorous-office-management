import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { ClientDocumentServices } from "./_client_document_services";


export const getClientDocumentList = createAsyncThunk(
  "user/getClientDocumentList",
  async (reqData, { rejectWithValue }) => {

    try {
      const respose = await ClientDocumentServices.getClientDocumentList(reqData);
      return respose;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);





export const updateClientDocument = createAsyncThunk(
  "user/updateClientDocument",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await ClientDocumentServices.updateClientDocument(reqData);
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
export const deleteClientDocument = createAsyncThunk(
  "user/deleteClientDocument",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await ClientDocumentServices.deleteClientDocument(reqData);
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

const clientDocumentSlice = createSlice({
  name: 'ClientDocument',
  initialState: {
    ClientDocumentList: [],
    totalClientDocumentCount: 0,
    ClientDocumentDetails: [],
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getClientDocumentList.pending, (state, action) => {
        state.loading = true;
        state.ClientDocumentList = [];
        state.totalClientDocumentCount = 0;
      })
      .addCase(getClientDocumentList.fulfilled, (state, action) => {
        state.ClientDocumentList = action.payload?.data?.docs;
        state.totalClientDocumentCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getClientDocumentList.rejected, (state, action) => {
        state.loading = false;
        state.ClientDocumentList = [];
        state.totalClientDocumentCount = 0;
      })
      .addCase(updateClientDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateClientDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.GstTypeUpdateData = action.payload;
      })
      .addCase(updateClientDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteClientDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteClientDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.ClientDocumentDeleteData = action.payload;
      })
      .addCase(deleteClientDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
 
  },
});

export default clientDocumentSlice.reducer;