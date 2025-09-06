const express = require('express');
const { protect, admin } = require('../middleware/auth');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createAgricultureCategories
} = require('../controllers/categoryController');
const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, admin, createCategory);
router.post('/setup-agriculture', protect, admin, createAgricultureCategories);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router; 