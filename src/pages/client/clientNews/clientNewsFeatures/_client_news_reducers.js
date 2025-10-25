import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { clientNewzServices } from "./_client_news_services";


export const getClientNewsList = createAsyncThunk(
  "user/getClientNewsList",
  async (reqData, { rejectWithValue }) => {

    try {
      const respose = await clientNewzServices.getClientNewsList(reqData);
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
export const clientNewsSearch = createAsyncThunk(
  "user/clientNewsSearch",
  async (reqData, { rejectWithValue }) => {

    try {
      const respose = await clientNewzServices.clientNewsSearch(reqData);
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
export const getClientNewsDetails = createAsyncThunk(
  "user/getClientNewsDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await clientNewzServices.getClientNewsDetails(reqData);
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

export const createClientNews = createAsyncThunk(
  "user/createClientNews",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await clientNewzServices.createClientNews(reqData);
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

export const updateClientNews = createAsyncThunk(
  "user/updateClientNews",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await clientNewzServices.updateClientNews(reqData);
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
export const deleteClientNews = createAsyncThunk(
  "user/deleteClientNews",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await clientNewzServices.deleteClientNews(reqData);
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

const clientNewsSlice = createSlice({
  name: 'clientNews',
  initialState: {
    clientNewsList: [],
    totalNewzCount: 0,
    clientNewsDetails: [],
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getClientNewsList.pending, (state, action) => {
        state.loading = true;
        state.clientNewsList = [];
        state.totalNewzCount = 0;
      })
      .addCase(getClientNewsList.fulfilled, (state, action) => {
        state.clientNewsList = action.payload?.data?.docs;
     
        state.totalNewzCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getClientNewsList.rejected, (state, action) => {
        state.loading = false;
        state.clientNewsList = [];
        state.totalNewzCount = 0;
      })
      .addCase(clientNewsSearch.pending, (state, action) => {
        state.loading = true;
        state.clientNewsList = [];
        state.totalNewzCount = 0;
      })
      .addCase(clientNewsSearch.fulfilled, (state, action) => {
        state.clientNewsList = action.payload?.data?.docs;
        state.totalNewzCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(clientNewsSearch.rejected, (state, action) => {
        state.loading = false;
        state.clientNewsList = [];
        state.totalNewzCount = 0;
      })
      .addCase(createClientNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(createClientNews.fulfilled, (state, action) => {
        state.loading = false;
        state.proposalCreateData = action.payload;
      })
      .addCase(createClientNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateClientNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateClientNews.fulfilled, (state, action) => {
        state.loading = false;
        state.proposalUpdateData = action.payload;
      })
      .addCase(updateClientNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteClientNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteClientNews.fulfilled, (state, action) => {
        state.loading = false;
        state.proposalDeleteData = action.payload;
      })
      .addCase(deleteClientNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getClientNewsDetails.pending, (state) => {
        state.loading = true;
        state.clientNewsDetails = null;
      })
      .addCase(getClientNewsDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.clientNewsDetails = action.payload?.data;
      })
      .addCase(getClientNewsDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.clientNewsDetails = null;
      })
  },
});

export default clientNewsSlice.reducer;