const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  getCart,
  addToCart,
  removeFromCart,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getUserOrders
} = require('../controllers/userController');
const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

router.get('/cart', protect, getCart);
router.post('/cart', protect, addToCart);
router.delete('/cart/:productId', protect, removeFromCart);

router.get('/wishlist', protect, getWishlist);
router.post('/wishlist', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);

router.get('/orders', protect, getUserOrders);

module.exports = router; 