import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, resetError } from "../redux/features/auth/authSlice";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";

// Password recovery request page
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          Forgot Password?
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        {success ? (
          <div className="bg-green-500/10 border border-green-500 text-green-400 p-4 rounded-lg mb-6 text-center">
            <h3 className="font-bold mb-2">Check your email</h3>
            <p className="text-sm">
              We've sent a password reset link to <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-red-500 transition"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="text-gray-400 hover:text-white transition text-sm flex items-center justify-center gap-2"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
