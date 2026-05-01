const { registerUser, loginUser, forgotPassword: forgotPasswordService, resetPassword: resetPasswordService, changePassword: changePasswordService } = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { User } = require('../models');

// @desc    Register new user
// @route   POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { fullName, username, email, phone, password } = req.body;
    const result = await registerUser({ fullName, username, email, phone, password });
    sendSuccess(res, result, 'Account created successfully', 201);
  } catch (error) {
    sendError(res, error.message, 400);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    sendSuccess(res, result, 'Login successful');
  } catch (error) {
    sendError(res, error.message, 401);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });
    sendSuccess(res, { user }, 'User fetched');
  } catch (error) {
    sendError(res, error.message);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
const logout = async (req, res) => {
  sendSuccess(res, null, 'Logged out successfully');
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const resetToken = await forgotPasswordService(email);
    // Since we don't have an email service right now, we return the token directly for testing.
    sendSuccess(res, { resetToken }, 'Password reset token generated (Demo mode)');
  } catch (error) {
    sendError(res, error.message, 404);
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    await resetPasswordService(req.params.token, password);
    sendSuccess(res, null, 'Password reset successfully');
  } catch (error) {
    sendError(res, error.message, 400);
  }
};

// @desc    Change Password
// @route   PUT /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return sendError(res, 'Please provide both current and new passwords', 400);
    }
    await changePasswordService(req.user.id, currentPassword, newPassword);
    sendSuccess(res, null, 'Password changed successfully');
  } catch (error) {
    sendError(res, error.message, 400);
  }
};

module.exports = { signup, login, getMe, logout, forgotPassword, resetPassword, changePassword };
