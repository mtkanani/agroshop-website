const mongoose = require('mongoose');
const Category = require('./models/Category');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Agriculture categories to add
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

// Function to add categories
const addCategories = async () => {
  try {
    console.log('Starting to add agriculture categories...');
    
    for (const category of agricultureCategories) {
      // Check if category already exists
      const existingCategory = await Category.findOne({ name: category.name });
      
      if (existingCategory) {
        console.log(`Category "${category.name}" already exists, skipping...`);
      } else {
        const newCategory = new Category(category);
        await newCategory.save();
        console.log(`✅ Added category: ${category.name}`);
      }
    }
    
    console.log('\n🎉 All categories processed successfully!');
    
    // Display all categories
    const allCategories = await Category.find();
    console.log('\n📋 Current categories in database:');
    allCategories.forEach(cat => {
      console.log(`- ${cat.name}: ${cat.description}`);
    });
    
  } catch (error) {
    console.error('Error adding categories:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the script
connectDB().then(() => {
  addCategories();
}); 