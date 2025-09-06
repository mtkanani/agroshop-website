const cloudinary = require('./config/cloudinary');

// Replace this path with a real image file path on your computer
const imagePath = 'C:/Users/archa/Desktop/fsd/backend/test.jpg';

cloudinary.uploader.upload(imagePath, function(error, result) {
  if (error) {
    console.error('Cloudinary upload error:', error);
  } else {
    console.log('Cloudinary upload success:', result);
  }
}); 