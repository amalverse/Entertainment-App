import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tmdb } from "../../../services/tmdbService";

export const searchMulti = createAsyncThunk("search/multi", async (query) => {
  const res = await tmdb.get("/search/multi", {
    params: { query },
  });
  return res.data.results;
});

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    results: [],
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(searchMulti.fulfilled, (state, action) => {
      state.results = action.payload;
    });
  },
});

export const { setQuery } = searchSlice.actions;
export default searchSlice.reducer;
