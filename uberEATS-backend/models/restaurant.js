const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required.']
    },
    category: {
      type: String,
      required: [true, 'Category is required.']
    },
    city: {
      type: String,
    },
    rating: {
      type: Number,
      required: true,
      default: 0
    },
    deliveryFee: {
      type: Number,
      required: true,
      default: 1.5
    },
    arrivalTime: {
      type: Number,
      required: true,
      default: 30
    },
    address: {
      type: String,
    },
    distance: {
      type: Number,
      required: true,
      default: 0
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    // Depending on your use case, you could maintain arrays of references to related documents:
    menuItems: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem'
    }],
    reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
