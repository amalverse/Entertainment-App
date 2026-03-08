const User = require("../models/User");

/* Get User Profile */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* Update User Profile */
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.username = req.body.username || user.username;
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      // Ensure password exists before trying to rehash if sent
      if (req.body.password) {
        user.password = req.body.password;
      }

      // Check if file was uploaded
      if (req.file) {
        // Convert buffer to Base64 data URI
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let mime = req.file.mimetype;
        user.profileImage = `data:${mime};base64,${b64}`;
      }

      const updatedUser = await user.save();

      res.json({
        id: updatedUser._id,
        username: updatedUser.username,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* Delete User Profile */
const deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      await User.deleteOne({ _id: user._id });
      res.json({ message: "User removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getUserProfile, updateUserProfile, deleteUserProfile };
