import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tmdb } from "../../../services/tmdbService";

// Fetch trending TV shows for the day
export const fetchTrendingTV = createAsyncThunk("tv/trending", async () => {
  const res = await tmdb.get("/trending/tv/day");
  // Returns array of show objects
  return res.data.results;
});

// Fetch full details for a specific show
export const fetchTVDetails = createAsyncThunk("tv/details", async (id) => {
  const res = await tmdb.get(`/tv/${id}`, {
    params: {
      // Get credits, videos, and recommendations in one go
      append_to_response: "credits,videos,similar,recommendations",
    },
  });
  return res.data;
});

// Discover shows with filters (pagination, sort, genres)
export const discoverTV = createAsyncThunk(
  "tv/discover",
  async ({
    page = 1,
    sort_by = "popularity.desc",
    with_genres = "",
    with_original_language = "",
  } = {}) => {
    const params = {
      page,
      sort_by,
    };

    if (with_genres) params.with_genres = with_genres;
    if (with_original_language)
      params.with_original_language = with_original_language;

    // Filter out shows with few votes when sorting by rating
    if (sort_by.includes("vote_average")) {
      params["vote_count.gte"] = 200;
    }

    const res = await tmdb.get("/discover/tv", { params });
    // Include page number in response
    return { ...res.data, page };
  },
);

const tvSlice = createSlice({
  name: "tv",
  initialState: {
    trending: [],
    tvSeries: [],
    totalPages: 0,
    currentPage: 1,
    selectedTV: null,
    loading: false,
    error: null,
    lastFetchedTrending: null,
    lastFetchedDiscover: null,
    filterParams: {
      sort_by: "popularity.desc",
      with_genres: "",
      with_original_language: "",
    },
  },

  reducers: {
    // Handle pagination
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },

    // Update active filters
    setFilterParams: (state, action) => {
      state.filterParams = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Trending
      .addCase(fetchTrendingTV.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingTV.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = action.payload;
        state.lastFetchedTrending = Date.now();
        state.error = null;
      })
      .addCase(fetchTrendingTV.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch trending TV shows";
      })

      // Show Details
      .addCase(fetchTVDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTVDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTV = action.payload;
        state.error = null;
      })
      .addCase(fetchTVDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch TV details";
      })

      // Discover
      .addCase(discoverTV.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(discoverTV.fulfilled, (state, action) => {
        state.loading = false;
        state.tvSeries = action.payload.results;
        state.totalPages = action.payload.total_pages;
        state.currentPage = action.payload.page;
        state.lastFetchedDiscover = Date.now();
        state.error = null;
      })
      .addCase(discoverTV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch TV shows";
      });
  },
});

export const { setPage, setFilterParams, clearError } = tvSlice.actions;

export default tvSlice.reducer;
