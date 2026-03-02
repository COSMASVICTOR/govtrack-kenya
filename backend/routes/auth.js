const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Generate JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @route   POST /api/auth/register
// @desc    Register a new citizen
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, phone, nationalId, password } = req.body;

  if (!name || !email || !phone || !nationalId || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { nationalId }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Email or National ID already registered.' });
    }

    const user = await User.create({ name, email, phone, nationalId, password });
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        nationalId: user.nationalId,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed.', error: err.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login and get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        nationalId: user.nationalId,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed.', error: err.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Protected
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});
// @route   PATCH /api/auth/profile
// @desc    Update name and phone
// @access  Protected
router.patch('/profile', protect, async (req, res) => {
  const { name, phone } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true }
    );
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Update failed.', error: err.message });
  }
});

// @route   PATCH /api/auth/change-password
// @desc    Change password
// @access  Protected
router.patch('/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed.', error: err.message });
  }
});
// @route   POST /api/auth/forgot-password
// @desc    Reset password using email + nationalId verification
// @access  Public
router.post('/forgot-password', async (req, res) => {
  const { email, nationalId, newPassword } = req.body;

  if (!email || !nationalId || !newPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  try {
    const user = await User.findOne({ email, nationalId });
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email and National ID combination.' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Reset failed.', error: err.message });
  }
});
module.exports = router;
