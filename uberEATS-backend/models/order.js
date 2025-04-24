const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    // Reference to the User who placed the order
    customerId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    // Reference to the Restaurant
    restaurantId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Restaurant', 
      required: true 
    },
    // Reference to the RestaurantProfile document
    restaurantProfileId: { 
      type: Schema.Types.ObjectId, 
      ref: 'RestaurantProfile', 
      required: true 
    },
    address: { 
      type: String, 
      required: [true, 'Address is required'] 
    },
    isDelivery: { 
      type: Boolean, 
      required: [true, 'isDelivery flag is required'] 
    },
    orderStatus: { 
      type: String, 
      default: 'Pending' 
    },
    // Optionally, store order items as an array of OrderItem ObjectIds
    items: [{
      type: Schema.Types.ObjectId,
      ref: 'OrderItem'
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
