const express = require('express');
const { protect, admin } = require('../middleware/auth');
const {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createAdmin, // if you have a createAdmin controller
  toggleSuspendUser,
  resetUserPassword
} = require('../controllers/adminController');
const router = express.Router();

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getAllUsers);
router.get('/users/:id', protect, admin, getUserById);
router.put('/users/:id', protect, admin, updateUser);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/users/:id/suspend', protect, admin, toggleSuspendUser);
router.put('/users/:id/reset-password', protect, admin, resetUserPassword);
// router.post('/create-admin', protect, admin, createAdmin); // if you want to allow admin to create admins

module.exports = router; 