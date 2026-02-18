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
      if (res.data.mssg === "Login successful") {
        return { user: res.data.user, token: res.data.token };
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
    token: null,
    loginstatus: false,
    errorOccured: false,
    errMsg: "",
  },
  reducers: {
    setAuthError: (state, action) => {
      state.errorOccured = true;
      state.errMsg = action.payload;
    },
    reset: (state) => {
      state.isPending = false;
      state.currentuser = {};
      state.token = null;
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
        state.currentuser = action.payload.user;
        state.token = action.payload.token;
        state.loginstatus = true;
        state.errorOccured = false;
        state.errMsg = "";
      })
      .addCase(user_author_thunk.rejected, (state, action) => {
        state.isPending = false;
        state.loginstatus = false;
        state.currentuser = {};
        state.token = null;
        state.errorOccured = true;
        state.errMsg = action.payload;
      });
  },
});

export const { setAuthError, reset } = userauthorslice.actions;
export default userauthorslice.reducer;
