// controllers/order.controller.js

// Import the Mongoose models (make sure these files export your Mongoose models)
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');

/**
 * Create a new order.
 * Note: The req.body must have the appropriate fields as defined in your Order schema.
 */
const createOrder = async (req, res) => {
  try {
    // Mongoose's create() returns a promise which resolves to the saved document.
    const newOrder = await Order.create(req.body);
    res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    console.error("Error in createOrder:", error);
    res.status(500).json({ error: "Failed to place order", details: error.message });
  }
};

/**
 * Get all past orders for a specific customer.
 */
const getPastOrders = async (req, res) => {
  const { customerId } = req.params;
  try {
    // Query orders for the customer and use populate() to include order items.
    // In Mongoose, you can select which fields to return with .select() (or pass a projection to populate).
    const orders = await Order.find({ customerId })
      .populate({ 
        path: 'items', // Assuming your Order model includes an array field called "items" that references OrderItem.
        select: 'menuItemId name description image price quantity -_id' // List the fields; use "-_id" to exclude _id if desired.
      });

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this customer' });
    }
  
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error in getPastOrders:", error);
    res.status(500).json({ message: 'Internal Server Error', details: error.message });
  }
};

/**
 * Save a new order along with its order items using a transaction.
 * (Requires MongoDB replica set for transactions; if using a standalone MongoDB, you may remove transactions.)
 */
const saveOrder = async (req, res) => {
  // Start a Mongoose session for transaction support
  const session = await Order.startSession();
  session.startTransaction();
  try {
    const { address, isDelivery, customerId, restaurantId, restaurantProfileId, orderStatus, items } = req.body;
    
    // Create the order within the transaction. Note that Order.create() in an array form returns an array.
    const [newOrder] = await Order.create(
      [{
        customerId,
        restaurantId,          // In MongoDB, you may store these as ObjectId or string; adjust as needed.
        restaurantProfileId,
        address,
        isDelivery,
        orderStatus,
      }],
      { session }
    );
  
    // Build order items documents
    const orderItems = items.map(item => ({
      orderId: newOrder._id,  // Reference the order ID
      menuItemId: item.id,    // Adjust the field names as per your OrderItem schema
      name: item.name,
      description: item.description,
      image: item.image,
      price: isNaN(parseFloat(item.price)) ? 0.0 : parseFloat(item.price),
      quantity: item.quantity,
    }));
  
    // Bulk insert order items within the transaction
    await OrderItem.insertMany(orderItems, { session });
  
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
  
    res.status(201).json({ 
      message: "Order placed successfully", 
      orderId: newOrder._id, 
      orderDetails: { address, isDelivery, orderStatus, items } 
    });
  } catch (error) {
    // Abort (rollback) transaction if there is an error
    await session.abortTransaction();
    session.endSession();
    console.error("Error saving order:", error);
    res.status(500).json({ error: "Failed to place order", details: error.message });
  }
};

/**
 * Get order details by order ID, with order items populated.
 */
const getOrder = async (req, res) => {
  try {
    const { id } = req.params; // Order ID provided in the route
    // Use findById and populate the 'items' field.
    const order = await Order.findById(id).populate('items'); 
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
  
    // Format the response as needed. For example, mapping order.items fields:
    const formattedOrder = {
      customerId: order.customerId,
      restaurantId: order.restaurantId,
      restaurantProfileId: order.restaurantProfileId,
      address: order.address,
      isDelivery: order.isDelivery,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map(item => ({
        id: item.menuItemId, // or item._id if you want the OrderItem id
        name: item.name,
        description: item.description,
        image: item.image,
        price: item.price.toFixed(2),
        quantity: item.quantity,
      })),
    };
  
    res.json(formattedOrder);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order", details: error.message });
  }
};

/**
 * Get all orders.
 */
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders", details: error.message });
  }
};

/**
 * Get order by order ID.
 */
const getOrderById = async (req, res) => {
  try {
    // findById replaces Sequelize's findByPk.
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ error: "Error fetching order", details: error.message });
  }
};

/**
 * Update an order's status.
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
  
    order.orderStatus = status;
    await order.save();
    res.status(200).json({ message: "Order status updated!", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status", details: error.message });
  }
};

/**
 * Set an order's status to 'Complete'.
 */
const completeOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
  
    order.orderStatus = 'Complete';
    await order.save();
    res.status(200).json({ message: "Order status updated to Complete!", order });
  } catch (error) {
    console.error("Error completing order status:", error);
    res.status(500).json({ error: "Failed to update order status", details: error.message });
  }
};

/**
 * Set an order's status to 'Canceled'.
 */
const cancelOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
  
    order.orderStatus = 'Canceled';
    await order.save();
    res.status(200).json({ message: "Order status updated to Canceled!", order });
  } catch (error) {
    console.error("Error canceling order status:", error);
    res.status(500).json({ error: "Failed to update order status", details: error.message });
  }
};

module.exports = { 
  createOrder, 
  getOrders, 
  getOrderById, 
  updateOrderStatus, 
  getOrder, 
  saveOrder,
  completeOrderStatus,
  cancelOrderStatus,
  getPastOrders
};
