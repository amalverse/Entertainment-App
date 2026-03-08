import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { toast } from "react-toastify";

/**
 * VERIFY EMAIL PAGE
 *
 * This page handles the email verification link clicked by the user.
 * It sends the token to the backend, and then automatically redirects
 * to the login page with a success or error message.
 */
const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        // Send verification request to backend
        const { data } = await axiosInstance.get(`/auth/verify/${token}`);

        // Show success message from backend or fallback
        toast.success(
          data.message ||
            "Your email has been successfully verified! You can now login.",
        );

        // On success, redirect to login page immediately
        navigate("/login");
      } catch (err) {
        // Get error message from backend if possible
        const errorMessage =
          err.response?.data?.message ||
          "Invalid or expired verification link.";

        // Show error message
        toast.error(errorMessage);

        // Redirect to login page anyway
        navigate("/login");
      }
    };

    if (token) {
      verifyUserEmail();
    } else {
      // No token found, just go to login
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <div>
          <h2 className="text-2xl font-light mb-4 text-gray-300">
            Completing Verification...
          </h2>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-400">
            Please wait a moment while we set things up.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
