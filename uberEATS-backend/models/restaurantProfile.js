const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantProfileSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.']
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required.']
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    // If you want to automatically store createdAt, you can use timestamps.
  },
  {
    timestamps: { createdAt: true, updatedAt: false } // Only createdAt is automatically maintained.
  }
);

module.exports = mongoose.model('RestaurantProfile', restaurantProfileSchema);
