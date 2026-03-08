import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile, deleteProfile } from "../redux/features/auth/authSlice";
import { FaCamera, FaUser, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [username, setUsername] = useState(user?.username || "");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Determine image source (Base64 or external URL)
  const profileImageUrl =
    user?.profileImage &&
    (user.profileImage.startsWith("data:") ||
      user.profileImage.startsWith("http"))
      ? user.profileImage
      : user?.profileImage
        ? `http://localhost:5000${user.profileImage}`
        : null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("name", name);
    formData.append("email", email);
    if (password) {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      formData.append("password", password);
    }
    if (selectedFile) {
      formData.append("profileImage", selectedFile);
    }

    try {
      await dispatch(updateProfile(formData)).unwrap();
      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-start pt-20">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-700">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
          My Profile
        </h2>

        {successMessage && (
          <div className="bg-green-600/20 border border-green-500 text-green-400 px-4 py-3 rounded mb-6 text-center">
            {successMessage}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Profile Image Section */}
          <div className="relative group">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-700 shadow-xl relative">
              {previewImage || profileImageUrl ? (
                <img
                  src={previewImage || profileImageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <span className="text-4xl text-gray-500">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {isEditing && (
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-2 right-2 bg-red-600 p-3 rounded-full hover:bg-red-700 transition shadow-lg cursor-pointer z-10"
                title="Change Photo"
              >
                <FaCamera className="text-white" />
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
          </div>

          {/* Profile Details Section */}
          <div className="flex-1 w-full space-y-6">
            {!isEditing ? (
              // View Mode
              <div className="space-y-6">
                <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                  <label className="text-gray-400 text-sm flex items-center gap-2 mb-1">
                    <FaUser /> Username
                  </label>
                  <p className="text-xl font-medium">{user?.username}</p>
                </div>

                <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                  <label className="text-gray-400 text-sm flex items-center gap-2 mb-1">
                    <FaUser /> Full Name
                  </label>
                  <p className="text-xl font-medium">
                    {user?.name || (
                      <span className="text-gray-500 italic">Not set</span>
                    )}
                  </p>
                </div>

                <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
                  <label className="text-gray-400 text-sm flex items-center gap-2 mb-1">
                    <FaEnvelope /> Email Address
                  </label>
                  <p className="text-xl font-medium">{user?.email}</p>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition shadow-lg"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition"
                  />
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <h4 className="text-lg font-medium mb-4 text-red-500">
                    Change Password{" "}
                    <span className="text-xs text-gray-500">(Optional)</span>
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave blank to keep current"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setPreviewImage(null);
                      setSelectedFile(null);
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700">
          <h3 className="text-xl font-bold text-red-500 mb-4">Danger Zone</h3>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-red-400">Delete Account</p>
              <p className="text-gray-400 text-sm">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
            </div>
            <button
              onClick={() => {
                toast.warn(
                  ({ closeToast }) => (
                    <div>
                      <h4 className="font-bold text-lg mb-2">
                        Delete Account?
                      </h4>
                      <p className="text-sm mb-4 text-gray-200">
                        This action is permanent and cannot be undone.
                      </p>
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={closeToast}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-sm font-medium transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            dispatch(deleteProfile());
                            closeToast();
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm font-medium transition"
                        >
                          Yes, Delete
                        </button>
                      </div>
                    </div>
                  ),
                  {
                    position: "top-center",
                    autoClose: false,
                    closeOnClick: false,
                    draggable: false,
                    closeButton: false,
                    icon: false,
                    style: { backgroundColor: "#1f2937", color: "white" },
                  },
                );
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
