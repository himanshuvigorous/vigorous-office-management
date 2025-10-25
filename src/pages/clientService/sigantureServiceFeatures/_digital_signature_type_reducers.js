import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager";
import { digitalSignatureTypeService } from "./_digital_signature_type_services";




export const getDigitalSignatureTypeList = createAsyncThunk(
  "user/getDigitalSignatureTypeList",
  async (reqData, { rejectWithValue }) => {

    try {
      const respose = await digitalSignatureTypeService.getDigitalSignatureTypeList(reqData);
      return respose;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'e  rror',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const DigitalSignatureTypeSearch = createAsyncThunk(
  "user/DigitalSignatureTypeSearch",
  async (reqData, { rejectWithValue }) => {

    try {
      const respose = await digitalSignatureTypeService.DigitalSignatureTypeSearch(reqData);
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
export const getDigitalSignatureTypeDetails = createAsyncThunk(
  "user/getDigitalSignatureTypeDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await digitalSignatureTypeService.getDigitalSignatureTypeDetails(reqData);
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

export const createDigitalSignatureType = createAsyncThunk(
  "user/createDigitalSignatureType",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await digitalSignatureTypeService.createDigitalSignatureType(reqData);
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

export const updateDigitalSignatureType = createAsyncThunk(
  "user/updateDigitalSignatureType",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await digitalSignatureTypeService.updateDigitalSignatureType(reqData);
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
export const deleteDigitalSignatureType = createAsyncThunk(
  "user/deleteDigitalSignatureType",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await digitalSignatureTypeService.deleteDigitalSignatureType(reqData);
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

const digitalSignatureTypeSlice = createSlice({
  name: 'DigitalSignatureType',
  initialState: {
    DigitalSignatureTypeList: [],
    totalDigitalSignatureTypeCount: 0,
    clientServiceDetails: [],
    DigitalSignatureTypeDetails:[],
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getDigitalSignatureTypeList.pending, (state, action) => {
        state.loading = true;
        state.DigitalSignatureTypeList = [];
        state.totalDigitalSignatureTypeCount = 0;
      })
      .addCase(getDigitalSignatureTypeList.fulfilled, (state, action) => {
        state.DigitalSignatureTypeList = action.payload?.data;
        state.totalDigitalSignatureTypeCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getDigitalSignatureTypeList.rejected, (state, action) => {
        state.loading = false;
        state.DigitalSignatureTypeList = [];
        state.totalDigitalSignatureTypeCount = 0;
      })
      .addCase(DigitalSignatureTypeSearch.pending, (state, action) => {
        state.loading = true;
        state.DigitalSignatureTypeList = [];
        state.totalDigitalSignatureTypeCount = 0;
      })
      .addCase(DigitalSignatureTypeSearch.fulfilled, (state, action) => {
        state.DigitalSignatureTypeList = action.payload?.data;
        state.totalDigitalSignatureTypeCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(DigitalSignatureTypeSearch.rejected, (state, action) => {
        state.loading = false;
        state.DigitalSignatureTypeList = [];
        state.totalDigitalSignatureTypeCount = 0;
      })
      .addCase(createDigitalSignatureType.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDigitalSignatureType.fulfilled, (state, action) => {
        state.loading = false;
        state.DigitalSignatureTypeCreateData = action.payload;
        
      })
      .addCase(createDigitalSignatureType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateDigitalSignatureType.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDigitalSignatureType.fulfilled, (state, action) => {
        state.loading = false;
        state.DigitalSignatureTypeUpdateData = action.payload;
      })
      .addCase(updateDigitalSignatureType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteDigitalSignatureType.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDigitalSignatureType.fulfilled, (state, action) => {
        state.loading = false;
        state.DigitalSignatureTypeDeleteData = action.payload;
      })
      .addCase(deleteDigitalSignatureType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getDigitalSignatureTypeDetails.pending, (state) => {
        state.loading = true;
        state.DigitalSignatureTypeDetails = null;
      })
      .addCase(getDigitalSignatureTypeDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.DigitalSignatureTypeDetails = action.payload?.data;
      })
      .addCase(getDigitalSignatureTypeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.DigitalSignatureTypeDetails = null;
      })
  },
});

export default digitalSignatureTypeSlice.reducer;