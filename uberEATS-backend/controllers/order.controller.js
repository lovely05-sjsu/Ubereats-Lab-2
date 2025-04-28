// controllers/order.controller.js

// Import the Mongoose models (make sure these files export your Mongoose models)
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const KafkaService = require('../utils/kafka.service');
const OrderStatus = require('../constants/orderStatus');

// Initialize Kafka service
const kafkaService = new KafkaService('order-controller');

/**
 * Create a new order.
 * Note: The req.body must have the appropriate fields as defined in your Order schema.
 */
const createOrder = async (req, res) => {
  try {
    const { restaurantId, items, customerId, address, isDelivery, restaurantProfileId } = req.body;
    
    // Create the order
    const order = await Order.create({
      customerId,
      restaurantId,
      restaurantProfileId,
      items,
      address,
      isDelivery,
      orderStatus: OrderStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Publish order created event to Kafka
    await kafkaService.publishMessage('order_created', {
      orderId: order._id.toString(),
      customerId: order.customerId.toString(),
      restaurantId: order.restaurantId.toString(),
      restaurantProfileId: order.restaurantProfileId.toString(),
      items: order.items,
      orderStatus: order.orderStatus,
      isDelivery: order.isDelivery,
      address: order.address,
      createdAt: order.createdAt
    });
    
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating order'
    });
  }
};

/**
 * Get all past orders for a specific customer.
 */
const getPastOrders = async (req, res) => {
  const { customerId } = req.params;
  try {
    const orders = await Order.find({ customerId })
      .populate('items')
      .populate('restaurantId', 'name')
      .populate('restaurantProfileId');

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
 * Get order details by order ID
 */
const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId)
      .populate('items')
      .populate('restaurantId', 'name')
      .populate('restaurantProfileId');
      
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching order'
    });
  }
};

/**
 * Update order status
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order status'
      });
    }
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    order.orderStatus = status;
    await order.save();
    
    // Publish order status updated event to Kafka
    await kafkaService.publishMessage('order_status_updated', {
      orderId: order._id.toString(),
      status: order.orderStatus,
      updatedAt: new Date()
    });
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating order status'
    });
  }
};

module.exports = {
  createOrder,
  getPastOrders,
  getOrder,
  updateOrderStatus
};
