const User = require("../models/User");
const generateToken = require("../config/jwt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { OAuth2Client } = require("google-auth-library");

/*
 * Register a new user.
 * Validates input, checks for existing user, creates unverified account,
 * and sends verification email.
 */
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Generate verification token (expires in 24h)
  const verificationToken = crypto.randomBytes(20).toString("hex");

  const user = await User.create({
    username,
    email,
    password,
    verificationToken,
    verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
  });

  const frontendVerifyUrl = `http://localhost:5173/verify-email/${verificationToken}`;

  const htmlMessage = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h1 style="color: #e50914;">Welcome to Entertainment App!</h1>
      <p>Thank you for signing up. Please verify your email address to get started:</p>
      <a href="${frontendVerifyUrl}" style="display: inline-block; padding: 10px 20px; background-color: #e50914; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Verify My Email</a>
      <p>Or copy this link: <br/> ${frontendVerifyUrl}</p>
      <p>This link will expire in 24 hours.</p>
    </div>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Entertainment App - Email Verification",
      message: htmlMessage,
    });

    res.status(201).json({
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Email Error:", error);
    // Rollback user creation if email fails
    await User.deleteOne({ _id: user._id });
    res.status(500).json({
      message: "Registration failed: Could not send verification email.",
    });
  }
};

/*
 * Verify email address using token from URL.
 */
const verifyEmail = async (req, res) => {
  const token = req.params.token;

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Invalid or expired verification link." });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  res.status(200).json({
    message: "Your email has been successfully verified! You can now login.",
  });
};

/*
 * Authenticate user and get token.
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "Account not verified. Please check your email." });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
      },
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

/*
 * Google OAuth login handler.
 * Verifies Google ID token and creates/updates user.
 */
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage",
);

const googleLogin = async (req, res) => {
  const { code } = req.body;

  try {
    const { tokens } = await client.getToken(code);
    const idToken = tokens.id_token;

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (user) {
      // Link Google account to existing email user if not already linked
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (!user.profileImage) {
        user.profileImage = picture;
      }
      user.isVerified = true;
      await user.save();
    } else {
      // Create new user with random password
      const randomPassword = crypto.randomBytes(16).toString("hex");

      user = await User.create({
        username: name,
        email,
        password: randomPassword,
        googleId,
        profileImage: picture,
        isVerified: true,
        authProvider: "google",
      });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(400).json({
      message: "Google authentication failed",
      error: error.message,
    });
  }
};

/*
 * Handle forgot password request.
 * Generates token and sends reset email.
 */
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Retrieve user and update reset fields
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h1 style="color: #e50914;">Password Reset Request</h1>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #e50914; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
        <p>Or copy this link: <br/> ${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: "Entertainment App - Password Reset",
      message: htmlMessage,
    });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Email sent failed" });
  }
};

/*
 * Validates reset token and sets new password.
 */
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  googleLogin,
  forgotPassword,
  resetPassword,
};
