import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  MdMovie,
  MdTv,
  MdBookmark,
  MdCheckCircle,
  MdGridView,
  MdLogout,
  MdPerson,
} from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { logout } from "../../redux/features/auth/authSlice";
import { clearBookmarks } from "../../redux/features/bookmarks/bookmarksSlice";
import { clearWatched } from "../../redux/features/watched/watchedSlice";

// Shared NavLink component for consistent styling
function NavLink({ to, icon, label, active }) {
  const MenuIcon = icon;
  return (
    <Link
      to={to}
      title={label}
      className={`p-3 rounded-lg transition-all duration-300 hover:text-red-500 hover:scale-110 ${
        active ? "text-white" : "text-gray-500"
      }`}
    >
      <MenuIcon className="text-2xl" />
    </Link>
  );
}

// Side navigation bar
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check if link matches current path
  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearBookmarks());
    dispatch(clearWatched());
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <aside className="md:w-24 w-full h-auto md:h-[calc(100vh-40px)] bg-gray-800 md:m-5 rounded-2xl flex md:flex-col items-center justify-between p-6 z-50">
      {/* App Logo */}
      <Link to="/" className="text-red-600 mb-0 md:mb-16">
        <MdMovie className="text-4xl" />
      </Link>

      {/* Navigation Links */}
      <nav className="flex md:flex-col gap-8">
        <NavLink to="/" icon={MdGridView} label="Home" active={isActive("/")} />
        <NavLink
          to="/movies"
          icon={MdMovie}
          label="Movies"
          active={isActive("/movies")}
        />
        <NavLink
          to="/tv"
          icon={MdTv}
          label="TV Series"
          active={isActive("/tv")}
        />
        <NavLink
          to="/bookmarks"
          icon={MdBookmark}
          label="Bookmarks"
          active={isActive("/bookmarks")}
        />
        <NavLink
          to="/watched"
          icon={MdCheckCircle}
          label="Watched"
          active={isActive("/watched")}
        />
      </nav>

      {/* User actions and profile menu */}
      <div className="mt-0 md:mt-auto relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="focus:outline-none group relative"
        >
          {user?.profileImage ? (
            <img
              src={
                user.profileImage &&
                (user.profileImage.startsWith("data:") ||
                  user.profileImage.startsWith("http"))
                  ? user.profileImage
                  : `${(import.meta.env.VITE_API_BASE_URL || "").replace("/api", "")}${user.profileImage}`
              }
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white/20 group-hover:border-red-500 transition-all shadow-lg"
            />
          ) : (
            <FaUserCircle className="text-3xl text-gray-400 group-hover:text-red-500 transition-colors" />
          )}
        </button>

        {/* Floating dropdown menu */}
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute bottom-full md:left-full md:bottom-0 ml-0 md:ml-4 mb-4 md:mb-0 bg-gray-700 border border-gray-600 rounded-xl shadow-2xl p-2 w-48 z-50 overflow-hidden transform transition-all duration-200 ease-out origin-bottom-left">
              <div className="px-3 py-2 border-b border-gray-600 mb-1">
                <p className="text-xs text-gray-400">Signed in as</p>
                <p className="text-sm font-medium truncate text-white">
                  {user?.username || "Guest"}
                </p>
              </div>

              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-600 text-gray-200 hover:text-white transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <MdPerson className="text-lg" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition"
                  >
                    <MdLogout className="text-lg" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-600 text-white transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MdLogout className="text-lg rotate-180" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
