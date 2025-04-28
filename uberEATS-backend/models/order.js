const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OrderStatus = require('../constants/orderStatus');

const orderSchema = new Schema(
  {
    // Reference to the User who placed the order
    customerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    // Reference to the Restaurant
    restaurantId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Restaurant', 
      required: true 
    },
    // Reference to the RestaurantProfile document
    restaurantProfileId: { 
      type: mongoose.Schema.Types.ObjectId, 
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
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING 
    },
    // Optionally, store order items as an array of OrderItem ObjectIds
    items: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderItem'
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
