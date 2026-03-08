import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, resetError } from "../redux/features/auth/authSlice";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MdLock } from "react-icons/md";
import { toast } from "react-toastify";

// Password reset entry page
const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.auth);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  // Redirect on success
  useEffect(() => {
    if (success) {
      toast.success("Password reset successful! Please log in.");
      navigate("/login");
    }
  }, [success, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }

    dispatch(resetPassword({ token, password }));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {(error || validationError) && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded text-sm text-center">
              {validationError || error}
            </div>
          )}

          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              New Password
            </label>
            <div className="relative">
              <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-red-500 transition"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">
              Confirm Password
            </label>
            <div className="relative">
              <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-red-500 transition"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-gray-400 hover:text-white transition text-sm"
          >
            Cancel and go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
