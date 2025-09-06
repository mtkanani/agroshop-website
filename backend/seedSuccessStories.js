const mongoose = require('mongoose');
const SuccessStory = require('./models/SuccessStory');
require('dotenv').config();

const sampleStories = [
  {
    name: 'Rajesh Kumar',
    location: 'Punjab',
    crop: 'Wheat',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    beforeImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop',
    testimonial: 'Using Agro Shop\'s quality seeds and fertilizers increased my wheat yield by 40% compared to last year. The expert advice helped me optimize my farming practices.',
    yieldIncrease: 40,
    profitIncrease: 250000,
    timeSaved: 30,
    productsUsed: ['Seeds', 'Fertilizers'],
    isApproved: true,
    approvedAt: new Date()
  },
  {
    name: 'Lakshmi Devi',
    location: 'Karnataka',
    crop: 'Paddy',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    beforeImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop',
    testimonial: 'The organic fertilizers from Agro Shop transformed my paddy field. My crop quality improved significantly and I earned 35% more profit this season.',
    yieldIncrease: 35,
    profitIncrease: 180000,
    timeSaved: 25,
    productsUsed: ['Fertilizers', 'Pesticides'],
    isApproved: true,
    approvedAt: new Date()
  },
  {
    name: 'Amrit Singh',
    location: 'Haryana',
    crop: 'Cotton',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    beforeImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop',
    testimonial: 'Professional sprayers and pesticides from Agro Shop helped me protect my cotton crop from pests. My yield increased by 50% with better quality.',
    yieldIncrease: 50,
    profitIncrease: 320000,
    timeSaved: 40,
    productsUsed: ['Sprayers', 'Pesticides'],
    isApproved: true,
    approvedAt: new Date()
  }
];

const seedSuccessStories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing stories
    await SuccessStory.deleteMany({});
    console.log('Cleared existing success stories');

    // Insert sample stories
    const insertedStories = await SuccessStory.insertMany(sampleStories);
    console.log(`Inserted ${insertedStories.length} success stories`);

    console.log('Success stories seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding success stories:', error);
    process.exit(1);
  }
};

seedSuccessStories(); 