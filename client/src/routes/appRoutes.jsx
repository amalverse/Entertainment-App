import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Home from "../pages/Home";
import Movies from "../pages/Movies";
import MovieDetails from "../pages/MovieDeatils";
import TvSeries from "../pages/TvSeries";
import TVDetails from "../pages/TVDetalis";
import Bookmarks from "../pages/Bookmarks";
import Login from "../pages/Login";
import Register from "../pages/Register";
import SearchResults from "../pages/SearchResults";
import Profile from "../pages/Profile";
import VerifyEmail from "../pages/VerifyEmail";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/movies/:id" element={<MovieDetails />} />
      <Route path="/tv" element={<TvSeries />} />
      <Route path="/tv/:id" element={<TVDetails />} />
      <Route
        path="/bookmarks"
        element={
          <ProtectedRoute>
            <Bookmarks />
          </ProtectedRoute>
        }
      />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
    </Routes>
  );
};

export default AppRoutes;
