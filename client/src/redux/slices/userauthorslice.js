import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for user/author login and registration
export const user_author_thunk = createAsyncThunk(
  "user-author-login",
  async (credobj, thunkAPI) => {
    try {
      let endpoint =
        credobj.usertype === "User"
          ? `http://localhost:2000/userapi/${credobj.action === "register" ? "newuser" : "login"}`
          : `http://localhost:2000/authorapi/${credobj.action === "register" ? "newuser" : "login"}`;

      let res = await axios.post(endpoint, credobj);
      console.log("API Response:", res.data); // Debugging log
      if (res.data.mssg === "User loginned" || res.data.mssg === "author loginned") {
        return res.data;
      } else {
        return thunkAPI.rejectWithValue(res.data.mssg);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.message,
        status: error.response?.status,
        data: error.response?.data?.mssg || "Unknown error",
      });
    }
  }
);

// Create user/author slice
export const userauthorslice = createSlice({
  name: "user_author_login",
  initialState: {
    isPending: false,
    currentuser: {},
    loginstatus: false,
    errorOccured: false,
    errMsg: "",
  },
  reducers: {
    reset: (state) => {
      state.isPending = false;
      state.currentuser = {};
      state.loginstatus = false;
      state.errorOccured = false;
      state.errMsg = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(user_author_thunk.pending, (state) => {
        state.isPending = true;
      })
      .addCase(user_author_thunk.fulfilled, (state, action) => {
        state.isPending = false;
        state.loginstatus = true;
        state.currentuser = action.payload;
        state.errorOccured = false;
        state.errMsg = "";
      })
      .addCase(user_author_thunk.rejected, (state, action) => {
        state.isPending = false;
        state.loginstatus = false;
        state.currentuser = {};
        state.errorOccured = true;
        state.errMsg = action.payload;
      });
  },
});

export const { reset } = userauthorslice.actions;
export default userauthorslice.reducer;
