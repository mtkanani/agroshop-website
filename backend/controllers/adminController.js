const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getDashboardStats = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalSales = await Order.aggregate([
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);
  res.json({
    totalUsers,
    totalOrders,
    totalSales: totalSales[0] ? totalSales[0].total : 0,
  });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) res.json(user);
  else res.status(404).json({ message: 'User not found' });
};

exports.updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;
    await user.save();
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

exports.deleteUser = async (req, res) => {
  // Prevent admin from deleting themselves
  if (req.user._id.toString() === req.params.id) {
    return res.status(400).json({ message: "You cannot delete your own admin account." });
  }
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      return res.status(403).json({ message: "You cannot delete another admin." });
    }
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

exports.toggleSuspendUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.isSuspended = !user.isSuspended;
    await user.save();
    res.json({ message: user.isSuspended ? 'User suspended' : 'User unsuspended' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

exports.resetUserPassword = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.password = req.body.password;
    await user.save();
    res.json({ message: 'Password reset successfully' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
}; 