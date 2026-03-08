import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { restoreAuth } from "./redux/features/auth/authSlice";
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

  // Keep user logged in on refresh
  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

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
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {/* 
        Flex container for the sidebar + main content layout.
        Sidebar hidden on auth pages.
      */}
      <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white overflow-hidden">
        {!isAuthPage && <Sidebar />}

        <main
          ref={scrollRef}
          className="flex-1 overflow-y-auto relative p-6 md:p-8 lg:p-10"
        >
          <AppRoutes />
        </main>

        <ToastContainer position="top-right" autoClose={5000} theme="dark" />
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
