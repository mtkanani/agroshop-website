const express = require('express');
const { protect, admin } = require('../middleware/auth');
const {
  placeOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const router = express.Router();

router.post('/', protect, placeOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router; 