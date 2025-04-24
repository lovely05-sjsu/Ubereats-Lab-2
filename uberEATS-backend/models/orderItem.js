const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = new Schema(
  {
    // Reference to the parent Order document
    orderId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Order',
      required: true
    },
    // Reference to a MenuItem document (if you plan to populate it)
    menuItemId: { 
      type: Schema.Types.ObjectId, 
      ref: 'MenuItem',
      required: true
    },
    name: { 
      type: String, 
      required: [true, 'Name is required'] 
    },
    description: { 
      type: String 
    },
    image: { 
      type: String 
    },
    price: { 
      type: Number, 
      required: [true, 'Price is required'] 
    },
    quantity: { 
      type: Number, 
      required: [true, 'Quantity is required'] 
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

module.exports = mongoose.model('OrderItem', orderItemSchema);
