const Order = require('../models/Order');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const generatePaytmQR = require('../utils/paytmQR');

exports.placeOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
  if (!orderItems || orderItems.length === 0) return res.status(400).json({ message: 'No order items' });
  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });
  await order.save();
  // Add order to user
  const user = await User.findById(req.user._id);
  user.orders.push(order._id);
  user.cart = [];
  await user.save();
  // Send invoice email
  await sendEmail(user.email, 'Order Placed', `<h1>Order #${order._id}</h1><p>Thank you for your purchase!</p>`);
  // Generate Paytm QR if online
  let qr = null;
  if (paymentMethod === 'Online') {
    qr = generatePaytmQR(order._id, totalPrice, user.email);
  }
  res.status(201).json({ order, qr });
};

exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) res.json(order);
  else res.status(404).json({ message: 'Order not found' });
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email');
  res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.status = req.body.status || order.status;
    if (order.status === 'Delivered') order.isDelivered = true;
    await order.save();
    // Send status update email
    const user = await User.findById(order.user);
    await sendEmail(user.email, 'Order Status Update', `<h1>Order #${order._id}</h1><p>Status: ${order.status}</p>`);
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
}; 