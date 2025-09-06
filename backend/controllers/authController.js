const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, cityOrVillage, contactNumber } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });
  const user = await User.create({ firstName, lastName, email, password, cityOrVillage, contactNumber });
  // Send welcome email
  await sendEmail(email, 'Welcome to Agro Shop', `<h1>Welcome, ${firstName}!</h1><p>Thank you for registering.</p>`);
  res.status(201).json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isAdmin: user.isAdmin,
    cityOrVillage: user.cityOrVillage,
    contactNumber: user.contactNumber,
    token: generateToken(user._id),
  });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      cityOrVillage: user.cityOrVillage,
      contactNumber: user.contactNumber,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'No user with that email' });
  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 30; // 30 minutes
  await user.save();
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${token}`;
  await sendEmail(
    user.email,
    'Password Reset Request',
    `<h2>Password Reset</h2><p>Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 30 minutes.</p>`
  );
  res.json({ message: 'Password reset link sent to your email.' });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.json({ message: 'Password reset successful. You can now log in.' });
}; 