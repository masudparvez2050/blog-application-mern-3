const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto");
const { sendEmail, logEmailInDevelopment } = require("../utils/sendEmail");

// Create Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "your_jwt_secret", {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Hash the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // Set token expiry (24 hours)
    const verificationTokenExpires = Date.now() + 86400000;

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=random`,
      verificationToken: hashedToken,
      verificationTokenExpires,
      isVerified: false,
    });

    if (user) {
      // Create verification URL
      const verificationUrl = `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/verify-email/${verificationToken}`;

      // Create email message
      const message = `
        <h1>Verify Your Email Address</h1>
        <p>Thank you for registering! Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" clicktracking=off>${verificationUrl}</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not request this, please ignore this email.</p>
      `;

      try {
        // // Check if we're in development mode or missing email credentials
        // if (
        //   process.env.NODE_ENV === "development" ||
        //   !process.env.EMAIL_SERVER_USER ||
        //   !process.env.EMAIL_SERVER_PASSWORD
        // ) {
        //   // Use logEmailInDevelopment function for development
        //   logEmailInDevelopment(
        //     {
        //       to: user.email,
        //       subject: "Please verify your email address",
        //       html: message,
        //     },
        //     {
        //       verificationToken,
        //       verificationUrl,
        //     }
        //   );
        // } else {
        //   // Use sendEmail function for production
        //   await sendEmail({
        //     to: user.email,
        //     subject: "Please verify your email address",
        //     html: message,
        //   });
        // }

        // Use sendEmail function for production
        await sendEmail({
          to: user.email,
          subject: "Please verify your email address",
          html: message,
        });

        // Return user data and token
        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture,
            isVerified: user.isVerified,
          },
          token: generateToken(user._id),
          message:
            "Registration successful! Please check your email to verify your account.",
        });
      } catch (error) {
        console.error("Email sending error:", error);

        // Return success but with email error notification
        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture,
            isVerified: user.isVerified,
          },
          token: generateToken(user._id),
          message:
            "Registration successful! We couldn't send a verification email. Please contact support.",
        });
      }
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Verify email with token
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Hash the token to compare with stored token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with matching token and valid expiry
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        valid: false,
        message: "Invalid or expired verification token",
      });
    }

    // Set user as verified and clear verification token
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    // Return success response
    res.status(200).json({
      valid: true,
      message: "Email successfully verified",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      valid: false,
      message: "An error occurred while verifying email",
      error: error.message,
    });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Private
exports.resendVerification = async (req, res) => {
  try {
    // Get user from middleware
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Hash the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // Set token expiry (24 hours)
    const verificationTokenExpires = Date.now() + 86400000;

    // Update user with new token
    user.verificationToken = hashedToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    // Create verification URL
    const verificationUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/verify-email/${verificationToken}`;

    // Create email message
    const message = `
      <h1>Verify Your Email Address</h1>
      <p>You requested a new verification link. Please click below to verify your email address:</p>
      <a href="${verificationUrl}" clicktracking=off>${verificationUrl}</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    try {
      // Check if we're in development mode or missing email credentials
      // if (
      //   process.env.NODE_ENV === "development" ||
      //   !process.env.EMAIL_SERVER_USER ||
      //   !process.env.EMAIL_SERVER_PASSWORD
      // ) {
      //   // Use logEmailInDevelopment function for development
      //   logEmailInDevelopment(
      //     {
      //       to: user.email,
      //       subject: "Verify Your Email Address",
      //       html: message,
      //     },
      //     {
      //       verificationToken,
      //       verificationUrl,
      //     }
      //   );

      //   return res.status(200).json({
      //     message: "Verification email has been sent",
      //     // Include the token in development mode for testing
      //     ...(process.env.NODE_ENV === "development" && {
      //       devInfo: {
      //         verificationToken,
      //         verificationUrl,
      //       },
      //     }),
      //   });
      // }

      // Use sendEmail function for production
      await sendEmail({
        to: user.email,
        subject: "Verify Your Email Address",
        html: message,
      });

      res.status(200).json({ message: "Verification email has been sent" });
    } catch (error) {
      console.error("Email sending error:", error);

      // Log the verification URL in case of email error for development
      console.log("\n--- EMAIL ERROR: Verification Email Fallback ---");
      console.log(
        "Verification token (due to email error):",
        verificationToken
      );
      console.log("Verification URL:", verificationUrl);
      console.log("--------------------------------\n");

      res.status(500).json({
        message: "Could not send verification email. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      message: "An error occurred while processing your request.",
      error: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password is correct
    if (user && (await user.comparePassword(password))) {
      // Check if user is active
      if (!user.isActive) {
        return res
          .status(401)
          .json({ message: "Your account has been suspended" });
      }

      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
          isVerified: user.isVerified,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Google OAuth login/register
// @route   POST /api/auth/oauth/google
// @access  Public
exports.googleAuth = async (req, res) => {
  try {
    const { accessToken } = req.body;

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: accessToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name,
        email,
        password: bcrypt.hashSync(Math.random().toString(36).slice(-10), 10),
        profilePicture:
          picture ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name
          )}&background=random`,
        googleId,
        isVerified: true, // Auto-verify OAuth users
      });
    } else {
      // Update Google ID if it doesn't exist
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = true;
        await user.save();
      }
    }

    // Check if user is active
    if (!user.isActive) {
      return res
        .status(401)
        .json({ message: "Your account has been suspended" });
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res
      .status(500)
      .json({ message: "Google authentication failed", error: error.message });
  }
};

// @desc    Facebook OAuth login/register
// @route   POST /api/auth/oauth/facebook
// @access  Public
exports.facebookAuth = async (req, res) => {
  try {
    const { accessToken } = req.body;

    // Fetch user data from Facebook using the token
    const response = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message || "Failed to authenticate with Facebook"
      );
    }

    const { id: facebookId, name, email, picture } = data;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required but not provided by Facebook" });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name,
        email,
        password: bcrypt.hashSync(Math.random().toString(36).slice(-10), 10),
        profilePicture:
          picture?.data?.url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name
          )}&background=random`,
        facebookId,
        isVerified: true, // Auto-verify OAuth users
      });
    } else {
      // Update Facebook ID if it doesn't exist
      if (!user.facebookId) {
        user.facebookId = facebookId;
        user.isVerified = true;
        await user.save();
      }
    }

    // Check if user is active
    if (!user.isActive) {
      return res
        .status(401)
        .json({ message: "Your account has been suspended" });
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Facebook auth error:", error);
    res.status(500).json({
      message: "Facebook authentication failed",
      error: error.message,
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.bio = req.body.bio || user.bio;

      if (req.body.profilePicture) {
        user.profilePicture = req.body.profilePicture;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePicture,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Request password reset - sends email with reset token
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, still respond with success even if email doesn't exist
      return res.status(200).json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token and set expiry (1 hour)
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now

    await user.save();

    // Create reset URL
    const resetUrl = `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/reset-password/${resetToken}`;

    // Create email message
    const message = `
      <h1>You requested a password reset</h1>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    try {
      // Check if we're in development mode or missing email credentials
      // if (
      //   process.env.NODE_ENV === "development" ||
      //   !process.env.EMAIL_SERVER_USER ||
      //   !process.env.EMAIL_SERVER_PASSWORD
      // ) {
      //   // Use logEmailInDevelopment function for development
      //   logEmailInDevelopment(
      //     {
      //       to: user.email,
      //       subject: "Password Reset Request",
      //       html: message,
      //     },
      //     {
      //       resetToken,
      //       resetUrl,
      //     }
      //   );

      //   // Return success response
      //   return res.status(200).json({
      //     message:
      //       "If an account with that email exists, a password reset link has been sent.",
      //     // Include the token in development mode for testing
      //     ...(process.env.NODE_ENV === "development" && {
      //       devInfo: {
      //         resetToken,
      //         resetUrl,
      //       },
      //     }),
      //   });
      // }

      // Use sendEmail function for production
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        html: message,
      });

      res.status(200).json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    } catch (error) {
      console.error("Email sending error:", error);

      // Log the reset URL in case of email error
      console.log("\n--- EMAIL ERROR: Password Reset Fallback ---");
      console.log("Reset token (due to email error):", resetToken);
      console.log("Reset URL:", resetUrl);
      console.log("--------------------------------\n");

      // Don't clean up token so user can still use it
      return res.status(200).json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
        // Include the token when there's an email error in development
        ...(process.env.NODE_ENV === "development" && {
          devInfo: {
            resetToken,
            resetUrl,
            error: "Email could not be sent, but token is still valid",
          },
        }),
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      message: "An error occurred while processing your request.",
      error: error.message,
    });
  }
};

// @desc    Verify reset token and reset password
// @route   POST /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    // Hash the token to compare with stored token
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Find user with matching token and valid expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Update user password and clear reset token fields
    user.password = password; // Password will be hashed in the pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    // Issue a new auth token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Password has been reset successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message: "An error occurred while resetting password",
      error: error.message,
    });
  }
};

// @desc    Verify if a reset token is valid
// @route   GET /api/auth/verify-reset-token/:resetToken
// @access  Public
exports.verifyResetToken = async (req, res) => {
  try {
    const { resetToken } = req.params;

    // Hash the token to compare with stored token
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Find user with matching token and valid expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ valid: false, message: "Invalid or expired reset token" });
    }

    res.status(200).json({ valid: true, message: "Reset token is valid" });
  } catch (error) {
    console.error("Verify reset token error:", error);
    res.status(500).json({
      valid: false,
      message: "An error occurred while verifying token",
      error: error.message,
    });
  }
};
