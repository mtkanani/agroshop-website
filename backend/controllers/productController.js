const Product = require('../models/Product');
const Category = require('../models/Category');
const cloudinary = require('../config/cloudinary');

exports.getProducts = async (req, res) => {
  const { category, search } = req.query;
  let filter = {};
  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: 'i' };
  const products = await Product.find(filter).populate('category');
  res.json(products);
};

exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category');
  if (product) res.json(product);
  else res.status(404).json({ message: 'Product not found' });
};

exports.createProduct = async (req, res) => {
  const { name, description, price, category, stock, images, rating } = req.body;
  const product = new Product({
    name,
    description,
    price,
    category,
    stock,
    images,
    rating: rating !== undefined ? Number(rating) : 0,
  });
  await product.save();
  res.status(201).json(product);
};

exports.updateProduct = async (req, res) => {
  console.log('Update product body:', req.body); // Debug log
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price !== undefined ? Number(req.body.price) : product.price;
    product.category = req.body.category || product.category;
    product.stock = req.body.stock !== undefined ? Number(req.body.stock) : product.stock;
    product.images = req.body.images || product.images;
    product.rating = req.body.rating !== undefined ? Number(req.body.rating) : product.rating;
    await product.save();
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (product) {
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) return res.status(400).json({ message: 'Product already reviewed' });
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.numReviews;
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

exports.uploadProductImage = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (!req.file) return res.status(400).json({ message: 'No image file' });
  const result = await cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (error, result) => {
    if (error) return res.status(500).json({ message: 'Cloudinary error' });
    product.images.push(result.secure_url);
    await product.save();
    res.json({ image: result.secure_url });
  });
  result.end(req.file.buffer);
}; 