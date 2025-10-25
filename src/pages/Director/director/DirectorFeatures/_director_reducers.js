import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { directorServices } from "./_director_services";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";


export const directorList = createAsyncThunk(
  "director/directorList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await directorServices.directorList(reqData);
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

export const deleteDirector = createAsyncThunk(
  "director/deleteDirector",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await directorServices.deleteDirector(reqData);
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

export const directorCreate = createAsyncThunk(
  "director/directorCreate",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await directorServices.directorCreate(reqData);
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

export const getDirectorDetails = createAsyncThunk(
  "director/getDirectorDetails",
  async (reqData, { rejectWithValue }) => {
    try {

      const response = await directorServices.getDirectorDetails(reqData);
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

export const updateDirector = createAsyncThunk(
  "director/updateDirector",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await directorServices.updateDirector(reqData);
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

export const directorSearch = createAsyncThunk(
  "director/directorSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await directorServices.directorSearch(reqData);
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
export const updateDirectorStatus = createAsyncThunk(
  "director/updateDirectorStatus",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await directorServices.updateDirectorStatus(reqData);
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

const directorSlice = createSlice({
  name: 'director',
  initialState: {
    directorLists: [],
    directorCreateData: {},
    directorDetailsData: {},
    totalDirectorCount: 0,
    loading: false
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(directorList.pending, (state, action) => {
        state.loading = true;
        state.directorLists = [];
        state.totalDirectorCount = 0;
      })
      .addCase(directorList.fulfilled, (state, action) => {
        state.directorLists = action.payload?.data;
        state.totalDirectorCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(directorList.rejected, (state, action) => {
        state.loading = false;
        state.directorLists = [];
        state.totalDirectorCount = 0;
      })
      .addCase(directorCreate.pending, (state) => {
        state.loading = true;
      })
      .addCase(directorCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.directorCreateData = action.payload;
      })
      .addCase(directorCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getDirectorDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDirectorDetails.fulfilled, (state, action) => {
        state.directorDetailsData = action.payload;
        state.loading = false;
      })
      .addCase(getDirectorDetails.rejected, (state, action) => {
        state.loading = false;
        state.directorDetailsData = null;
      })
      .addCase(directorSearch.pending, (state, action) => {
        state.loading = true;
        state.directorLists = [];
        state.totalDirectorCount = 0;
      })
      .addCase(directorSearch.fulfilled, (state, action) => {
        state.directorLists = action.payload?.data?.docs;
        state.totalDirectorCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(directorSearch.rejected, (state, action) => {
        state.loading = false;
        state.directorLists = [];
        state.totalDirectorCount = 0;
      })
      .addCase(updateDirectorStatus.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateDirectorStatus.fulfilled, (state, action) => {
        state.directorListsUpdateStatus = action.payload?.data;
     
        state.loading = false;
      })
      .addCase(updateDirectorStatus.rejected, (state, action) => {
        state.loading = false;
        state.directorListsUpdateStatus = null;

      });
  },
});
export default directorSlice.reducer;
