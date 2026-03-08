import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tmdb } from "../../../services/tmdbService";

// Fetch trending movies for the day (cached)
export const fetchTrendingMovies = createAsyncThunk(
  "movies/trending",
  async () => {
    const res = await tmdb.get("/trending/movie/day");
    return res.data.results;
  },
);

// Fetch full movie details including credits and recommendations
export const fetchMovieDetails = createAsyncThunk(
  "movies/details",
  async (id) => {
    const res = await tmdb.get(`/movie/${id}`, {
      params: {
        append_to_response: "credits,videos,similar,recommendations",
      },
    });
    return res.data;
  },
);

// Discover movies with complex filtering
export const discoverMovies = createAsyncThunk(
  "movies/discover",
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

    // Filter out low vote-count movies when sorting by rating
    if (sort_by.includes("vote_average")) {
      params["vote_count.gte"] = 200;
    }

    const res = await tmdb.get("/discover/movie", { params });
    // Pass back page to keep state in sync
    return { ...res.data, page };
  },
);

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    trending: [],
    movies: [],
    totalPages: 0,
    currentPage: 1,
    selectedMovie: null,
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
      .addCase(fetchTrendingMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = action.payload;
        state.lastFetchedTrending = Date.now();
        state.error = null;
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch trending movies";
      })

      // Movie Details
      .addCase(fetchMovieDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMovie = action.payload;
        state.error = null;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch movie details";
      })

      // Discover
      .addCase(discoverMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(discoverMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.results;
        state.totalPages = action.payload.total_pages;
        state.currentPage = action.payload.page;
        console.log("Discover Movies Loaded:", action.payload?.results?.length);
        state.lastFetchedDiscover = Date.now();
        state.error = null;
      })
      .addCase(discoverMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch movies";
      });
  },
});

export const { setPage, setFilterParams, clearError } = moviesSlice.actions;

export default moviesSlice.reducer;
