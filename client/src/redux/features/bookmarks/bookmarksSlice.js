import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../services/axiosInstance";

// Fetch user's bookmarks
export const fetchBookmarks = createAsyncThunk(
  "bookmarks/get",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/bookmarks");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookmarks",
      );
    }
  },
);

// Save item to bookmarks
export const addBookmark = createAsyncThunk(
  "bookmarks/add",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/bookmarks", data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add bookmark",
      );
    }
  },
);

// Remove item from bookmarks
export const removeBookmark = createAsyncThunk(
  "bookmarks/remove",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/bookmarks/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to remove bookmark",
      );
    }
  },
);

const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetching
      .addCase(fetchBookmarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Adding
      .addCase(addBookmark.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addBookmark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Removing
      .addCase(removeBookmark.fulfilled, (state, action) => {
        // Optimistic update
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export default bookmarksSlice.reducer;
