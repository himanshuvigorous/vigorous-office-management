import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { gstTypeServices } from "./_gstType_services";
import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";





export const getGstTypeByIdFunc = createAsyncThunk(
  "getGstTypeList/getGstTypeByIdFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await gstTypeServices.getGstTypeByIdFunc(reqData);
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



export const gstTypeSearch = createAsyncThunk(
  "getGstTypeList/gstTypeSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await gstTypeServices.gstTypeSearch(reqData);
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



export const getGstTypeListFunc = createAsyncThunk(
  "getGstTypeList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await gstTypeServices.getGstTypeList(reqData);
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

export const getRoleList = createAsyncThunk(
  "getRoleList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await gstTypeServices.getRoleList();
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


export const createGstTypeFunc = createAsyncThunk(
  "createGstTypeFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await gstTypeServices.createGstTypeFunc(reqData);
      showNotification({
        message: response?.taskinfo?.message,
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

// export const getGstTypeDetails = createAsyncThunk(
//   "/company/getGstTypeDetails",
//   async (reqData, { rejectWithValue }) => {

//     try {
//       const response = await gstTypeServices.getGstTypeDetails(reqData);
//       return response;
//     } catch (error) {
//       showNotification({
//         message: error?.data?.message,
//         type: 'error',
//       });
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const updateGstTypeFunc = createAsyncThunk(
  "/updateGstTypeFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await gstTypeServices.updateGstTypeFunc(reqData);
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

export const deleteGstTypeFunc = createAsyncThunk(
  "/deleteGstTypeFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await gstTypeServices.deleteGstTypeFunc(reqData);
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

export const statusGstTypeFunc = createAsyncThunk(
  'file/statusGstTypeFunc',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await gstTypeServices.statusGstTypeFunc(formData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const reassignGstTypeFunc = createAsyncThunk(
  'file/reassignGstTypeFunc',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await gstTypeServices.reassignGstTypeFunc(formData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const gstTypeSlice = createSlice({
  name: 'taskManagement',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getGstTypeListFunc.pending, (state, action) => {
        state.loading = true;
        state.gstTypeList = [];
        state.totalGstTypeCount = 0;
      })
      .addCase(getGstTypeListFunc.fulfilled, (state, action) => {
        state.gstTypeList = action.payload?.data?.docs;
        state.totalGstTypeCount = action.payload?.data?.totalDocs;
        state.GstTypeDetailsData = null;
        state.loading = false;
      })
      .addCase(getGstTypeListFunc.rejected, (state, action) => {
        state.loading = false;
        state.gstTypeList = [];
        state.totalGstTypeCount = 0;
      })
      .addCase(gstTypeSearch.pending, (state, action) => {
        state.loading = true;
        state.gstTypeList = [];
        state.totalGstTypeCount = 0;
      })
      .addCase(gstTypeSearch.fulfilled, (state, action) => {
        state.gstTypeList = action.payload?.data?.docs;
        state.totalGstTypeCount = action.payload?.data?.totalDocs;
        state.GstTypeDetailsData = null;
        state.loading = false;
      })
      .addCase(gstTypeSearch.rejected, (state, action) => {
        state.loading = false;
        state.gstTypeList = [];
        state.totalGstTypeCount = 0;
      })
      .addCase(createGstTypeFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGstTypeFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.createGstTypeData = action.payload?.gstTypeinfo?.data;
      })
      .addCase(createGstTypeFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateGstTypeFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateGstTypeFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.hrupdateData = action.payload;
      })
      .addCase(updateGstTypeFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteGstTypeFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteGstTypeFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.userdeleteData = action.payload;
      })
      .addCase(deleteGstTypeFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // .addCase(getGstTypeDetails.pending, (state, action) => {
      //   state.loading = true;
      //   state.gstTypeDetailsData = null;
      // })
      // .addCase(getGstTypeDetails.fulfilled, (state, action) => {
      //   state.GstTypeDetailsData = action.payload?.data;
      //   state.loading = false;
      // })
      // .addCase(getGstTypeDetails.rejected, (state, action) => {
      //   state.loading = false;
      //   state.GstTypeDetailsData = null;
      // })
      .addCase(statusGstTypeFunc.pending, (state, action) => {
        state.loading = true;
        state.GstTypeDetailsData = null;
      })
      .addCase(statusGstTypeFunc.fulfilled, (state, action) => {
        state.statusGstTypeData = action.payload?.data;
        state.loading = false;
      })
      .addCase(statusGstTypeFunc.rejected, (state, action) => {
        state.loading = false;
        state.statusUpdateData = null;
      })



      .addCase(getGstTypeByIdFunc.pending, (state, action) => {
        state.loading = true;
        state.GstTypeDetailsDataById = null;
      })
      .addCase(getGstTypeByIdFunc.fulfilled, (state, action) => {
        state.GstTypeDetailsDataById = action.payload?.data;
        state.loading = false;
      })
      .addCase(getGstTypeByIdFunc.rejected, (state, action) => {
        state.loading = false;
        state.getGstTypeByIdFunc = null;
      })
      
      
  },
});

export default gstTypeSlice.reducer;
