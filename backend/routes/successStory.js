const express = require('express');
const router = express.Router();
const {
  submitSuccessStory,
  getApprovedStories,
  getAllStories,
  approveStory,
  rejectStory,
  deleteStory
} = require('../controllers/successStoryController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.post('/', submitSuccessStory);
router.get('/', getApprovedStories);

// Admin routes
router.get('/admin', protect, admin, getAllStories);
router.put('/:id/approve', protect, admin, approveStory);
router.put('/:id/reject', protect, admin, rejectStory);
router.delete('/:id', protect, admin, deleteStory);

module.exports = router; 