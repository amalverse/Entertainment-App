import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import moviesReducer from "./features/movies/moviesSlice";
import tvReducer from "./features/tv/tvSlice";
import bookmarksReducer from "./features/bookmarks/bookmarksSlice";
import searchReducer from "./features/search/searchSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: moviesReducer,
    tv: tvReducer,
    bookmarks: bookmarksReducer,
    search: searchReducer,
  },
});
