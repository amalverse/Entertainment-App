import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  resetError,
  googleLogin,
} from "../redux/features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

// User registration page
const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => dispatch(googleLogin(codeResponse.code)),
    flow: "auth-code",
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await dispatch(registerUser({ username, email, password })).unwrap();
      setSuccess(true);
      toast.success("Please check your email to verify your account!", {
        theme: "dark",
      });
      // Do not clear the email state so it can be displayed in the success view
    } catch {
      // Error handled by redux
    }
  };

  useEffect(() => {
    dispatch(resetError());
    if (user) {
      navigate("/");
    }
  }, [user, navigate, dispatch]);

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-96 text-center">
          <h2 className="text-2xl font-bold text-green-500 mb-4">
            Registration Successful!
          </h2>
          <div className="text-gray-300 mb-6">
            <p>We have sent a verification email to:</p>
            <p className="font-semibold text-white my-2">{email}</p>
            <p className="text-sm">
              Please check your inbox (and spam folder) and click the
              verification link to activate your account.
            </p>
          </div>
          <Link
            to="/login"
            className="inline-block bg-red-600 px-6 py-2 rounded hover:bg-red-700 transition text-white"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={submitHandler}
        className="bg-gray-800 p-6 rounded-lg w-96"
      >
        <h2 className="text-white text-2xl mb-4 text-center">Sign Up</h2>

        {error && <p className="text-red-400 mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-red-600 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-600"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-600"></div>
        </div>

        <button
          type="button"
          onClick={() => handleGoogleLogin()}
          className="w-full bg-white text-gray-800 p-2 rounded flex items-center justify-center gap-2 hover:bg-gray-100 transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="text-gray-400 text-sm mt-3 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-red-500">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
