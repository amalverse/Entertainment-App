const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        // Password is required only for local authentication
        return this.authProvider === "local";
      },
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
      sparse: true,
    },
    profileImage: {
      type: String,
    },
    // TMDB Integration (Future features)
    tmdbSessionId: {
      type: String,
    },
    tmdbAccountId: {
      type: String,
    },
    bookmarks: [
      {
        tmdbId: { type: Number },
        type: { type: String }, // "movie" or "tv"
        title: { type: String },
        poster: { type: String },
      },
    ],
    isVerified: {
      type: Boolean,
      default: function () {
        // OAuth users are auto-verified
        return this.authProvider !== "local";
      },
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpires: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving if modified
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with stored hash
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
