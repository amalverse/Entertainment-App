import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { restoreAuth } from "./redux/features/auth/authSlice";
import { fetchWatched } from "./redux/features/watched/watchedSlice";
import { fetchBookmarks } from "./redux/features/bookmarks/bookmarksSlice";
import AppRoutes from "./routes/appRoutes";
import Sidebar from "./components/layout/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Main layout component
const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const scrollRef = useRef(null);

  const { user, token } = useSelector((state) => state.auth);

  // Sync auth state and fetch user data on load or login
  useEffect(() => {
    // 1. If not in Redux yet, try to restore from localStorage
    if (!token) {
      dispatch(restoreAuth());
    }
    
    // 2. If we have authentication, fetch user data
    if (token) {
      dispatch(fetchWatched());
      dispatch(fetchBookmarks());
    }
  }, [dispatch, token]);

  // Reset scroll to top when changing pages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname]);

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname.startsWith("/reset-password") ||
    location.pathname.startsWith("/verify-email");

  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "fallback_client_id"}
    >
      {/* 
        Flex container for the sidebar + main content layout.
        Sidebar hidden on auth pages.
      */}
      <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white overflow-hidden">
        {!isAuthPage && <Sidebar />}

        <main
          ref={scrollRef}
          className={`flex-1 overflow-y-auto relative ${
            isAuthPage ? "" : "p-6 md:p-8 lg:p-10"
          }`}
        >
          <AppRoutes />
        </main>

        <ToastContainer position="top-right" autoClose={5000} theme="dark" />
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
