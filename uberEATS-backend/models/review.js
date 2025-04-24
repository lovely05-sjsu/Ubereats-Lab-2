const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the review schema.
const reviewSchema = new Schema(
  {
    // No need for an explicit "id" field because MongoDB provides _id automatically.
    user: {
      type: String,
      required: [true, 'User is required.'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required.'],
    },
    comment: {
      type: String,
    },
    // Instead of Sequelize associations, add a reference field
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'A restaurant reference is required.'],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt.
  }
);

module.exports = mongoose.model('Review', reviewSchema);
