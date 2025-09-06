const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

exports.createCategory = async (req, res) => {
  const { name, description } = req.body;
  const exists = await Category.findOne({ name });
  if (exists) return res.status(400).json({ message: 'Category already exists' });
  const category = new Category({ name, description });
  await category.save();
  res.status(201).json(category);
};

exports.createAgricultureCategories = async (req, res) => {
  try {
    const agricultureCategories = [
      {
        name: 'Seeds',
        description: 'Quality seeds for better yield and crop production'
      },
      {
        name: 'Fertilizers',
        description: 'Organic and chemical fertilizers for soil nutrition'
      },
      {
        name: 'Sprayers',
        description: 'Professional spraying equipment for crop protection'
      },
      {
        name: 'Pesticides',
        description: 'Crop protection products for pest control'
      }
    ];

    const createdCategories = [];
    const existingCategories = [];

    for (const categoryData of agricultureCategories) {
      const exists = await Category.findOne({ name: categoryData.name });
      if (exists) {
        existingCategories.push(categoryData.name);
      } else {
        const category = new Category(categoryData);
        await category.save();
        createdCategories.push(category);
      }
    }

    res.status(201).json({
      message: 'Agriculture categories processed',
      created: createdCategories,
      existing: existingCategories
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating categories', error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    category.name = req.body.name || category.name;
    category.description = req.body.description || category.description;
    await category.save();
    res.json(category);
  } else {
    res.status(404).json({ message: 'Category not found' });
  }
};

exports.deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    await category.remove();
    res.json({ message: 'Category removed' });
  } else {
    res.status(404).json({ message: 'Category not found' });
  }
}; 