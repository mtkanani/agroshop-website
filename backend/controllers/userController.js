const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getProfile = async (req, res) => {
  res.json(req.user);
};

exports.updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) user.password = req.body.password;
    await user.save();
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

exports.getCart = async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');
  res.json(user.cart);
};

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const user = await User.findById(req.user._id);
  const item = user.cart.find(i => i.product.toString() === productId);
  if (item) {
    item.quantity += quantity || 1;
  } else {
    user.cart.push({ product: productId, quantity: quantity || 1 });
  }
  await user.save();
  res.json(user.cart);
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter(i => i.product.toString() !== productId);
  await user.save();
  res.json(user.cart);
};

exports.getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json(user.wishlist);
};

exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);
  if (!user.wishlist.includes(productId)) {
    user.wishlist.push(productId);
    await user.save();
  }
  res.json(user.wishlist);
};

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter(p => p.toString() !== productId);
  await user.save();
  res.json(user.wishlist);
};

exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
}; 