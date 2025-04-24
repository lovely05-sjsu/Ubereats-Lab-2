const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoritesSchema = new Schema(
  {
    // Reference to the customer (User)
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required']
    },
    // Reference to the Restaurant
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant is required']
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Favorites', favoritesSchema);
