import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../services/axiosInstance";

// Fetch user's watched list
export const fetchWatched = createAsyncThunk(
  "watched/get",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/watched");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch watched list",
      );
    }
  },
);

// Add item to watched list
export const addWatched = createAsyncThunk(
  "watched/add",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/watched", data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to mark as watched",
      );
    }
  },
);

// Remove item from watched list
export const removeWatched = createAsyncThunk(
  "watched/remove",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/watched/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to remove from watched list",
      );
    }
  },
);

const watchedSlice = createSlice({
  name: "watched",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWatched: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetching
      .addCase(fetchWatched.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWatched.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWatched.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Adding
      .addCase(addWatched.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addWatched.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addWatched.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Removing
      .addCase(removeWatched.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export const { clearWatched } = watchedSlice.actions;
export default watchedSlice.reducer;
