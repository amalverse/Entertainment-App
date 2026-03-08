import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../services/axiosInstance";

// Handle user login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  },
);

// Register new user (no auto-login)
export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/register", data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  },
);

// Handle Google OAuth flow
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (code, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/google", { code });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Google login failed",
      );
    }
  },
);

// Handle profile updates with file upload
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, thunkAPI) => {
    try {
      const res = await axiosInstance.put("/user/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Sync local storage
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const updatedUser = { ...currentUser, ...res.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  },
);

export const deleteProfile = createAsyncThunk(
  "auth/deleteProfile",
  async (_, thunkAPI) => {
    try {
      await axiosInstance.delete("/user/profile");
      return;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/auth/reset-password/${token}`, {
        password,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token"),
    tmdbSessionId: localStorage.getItem("tmdbSessionId"),
    tmdbAccountId: localStorage.getItem("tmdbAccountId"),
    loading: false,
    error: null,
    success: false, // General success indicator
  },
  reducers: {
    resetError: (state) => {
      state.error = null;
      state.success = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.tmdbSessionId = null;
      state.tmdbAccountId = null;
      localStorage.removeItem("token");
      localStorage.removeItem("tmdbSessionId");
      localStorage.removeItem("tmdbAccountId");
      localStorage.removeItem("user");
    },
    setTmdbAuth: (state, action) => {
      state.tmdbSessionId = action.payload.sessionId;
      state.tmdbAccountId = action.payload.accountId;
      localStorage.setItem("tmdbSessionId", action.payload.sessionId);
      localStorage.setItem("tmdbAccountId", action.payload.accountId);
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    restoreAuth: (state) => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      const tmdbSessionId = localStorage.getItem("tmdbSessionId");
      const tmdbAccountId = localStorage.getItem("tmdbAccountId");

      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
        state.tmdbSessionId = tmdbSessionId;
        state.tmdbAccountId = tmdbAccountId;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Handling
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Registration Handling
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Google Login Handling
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Profile Update Handling
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Profile Deletion
      .addCase(deleteProfile.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { logout, setTmdbAuth, restoreAuth, resetError, setCredentials } =
  authSlice.actions;
export default authSlice.reducer;
