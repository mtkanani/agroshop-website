const express = require('express');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  uploadProductImage
} = require('../controllers/productController');
const cloudinary = require('../config/cloudinary');
const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/:id/review', protect, addReview);
router.post('/:id/image', protect, admin, upload.single('image'), uploadProductImage);

// Standalone image upload endpoint
router.post('/upload-image', protect, admin, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No image file' });
  cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
    if (error) {
      console.error('Cloudinary upload error:', error); // Log the real error
      return res.status(500).json({ message: error.message || 'Cloudinary error', error }); // Return real error
    }
    res.json({ image: result.secure_url });
  }).end(req.file.buffer);
});

module.exports = router; 