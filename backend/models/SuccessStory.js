const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  crop: {
    type: String,
    required: true,
    trim: true
  },
  yieldIncrease: {
    type: Number,
    required: true,
    min: 0
  },
  profitIncrease: {
    type: Number,
    required: true,
    min: 0
  },
  timeSaved: {
    type: Number,
    required: true,
    min: 0
  },
  testimonial: {
    type: String,
    required: true,
    trim: true
  },
  productsUsed: [{
    type: String,
    required: true,
    enum: ['Seeds', 'Fertilizers', 'Sprayers', 'Pesticides']
  }],
  isApproved: {
    type: Boolean,
    default: false
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SuccessStory', successStorySchema); 