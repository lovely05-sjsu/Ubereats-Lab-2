const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuItemSchema = new Schema(
  {
    name: { 
      type: String,
      required: [true, 'Menu item name is required']
    },
    price: { 
      type: Number,
      required: [true, 'Price is required'] 
    },
    description: { 
      type: String 
    },
    rating: { 
      type: Number, 
      required: [true, 'Rating is required'], 
      default: 0 
    },
    image: { 
      type: String 
    },
    // Reference to the parent Restaurant document
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
