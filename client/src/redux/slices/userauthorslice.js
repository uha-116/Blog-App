import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔥 Load saved auth from localStorage
const savedAuth = JSON.parse(localStorage.getItem("authData"));

export const user_author_thunk = createAsyncThunk(
  "user-author-login",
  async (credobj, thunkAPI) => {
    try {
      let endpoint =
        credobj.usertype === "User"
          ? `http://localhost:2000/userapi/${
              credobj.action === "register" ? "newuser" : "login"
            }`
          : `http://localhost:2000/authorapi/${
              credobj.action === "register" ? "newuser" : "login"
            }`;

      let res = await axios.post(endpoint, credobj);

      // 🔥 Use token existence instead of message string
      if (res.data.token) {
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

export const userauthorslice = createSlice({
  name: "user_author_login",

  initialState: {
    isPending: false,
    currentuser: savedAuth?.user || {},
    token: savedAuth?.token || null,
    loginstatus: !!savedAuth?.token,
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

      // 🔥 Clear localStorage on logout
      localStorage.removeItem("authData");
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

        // 🔥 SAVE TO LOCAL STORAGE HERE
        localStorage.setItem(
          "authData",
          JSON.stringify({
            user: action.payload.user,
            token: action.payload.token,
          })
        );
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
