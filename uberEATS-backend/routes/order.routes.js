const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getOrder,
  saveOrder,
  completeOrderStatus,
  cancelOrderStatus,
  getPastOrders,
} = require('../controllers/order.controller');

const { producer } = require('../utils/kafka'); // ✅ Import Kafka producer

const router = express.Router();

// 🛒 Place a new order
router.post('/createOrder', createOrder);

// 📜 Get all orders (for customers & restaurants)
router.get('/', getOrders);

// 📦 Get a specific order by ID
router.get('/:orderId', getOrderById);
router.get('/getOrder/:id', getOrder);

// 🚚 Update order status (e.g., "Preparing", "On the Way", "Delivered")
router.put('/:orderId/status', updateOrderStatus);
router.put('/:orderId/complete', completeOrderStatus);
router.put('/:orderId/cancel', cancelOrderStatus);

// 💾 Save a new order
router.post('/saveOrder', saveOrder);

// 📚 Past orders
router.get('/pastOrders/:customerId', getPastOrders);

// ✅ 📬 Kafka test route
router.post('/publish-test', async (req, res) => {
  try {
    // Attempt to connect; KafkaJS will safely skip if already connected
    await producer.connect();  // <-- no .isConnected check

    const orderData = {
      orderId: Date.now(),
      restaurantId: 123,
      userId: 456,
    };

    await producer.send({
      topic: 'order_created',
      messages: [{ value: JSON.stringify(orderData) }],
    });

    res.send("✅ Order event published to Kafka!");
  } catch (err) {
    console.error("Kafka publish error:", err);
    res.status(500).send("❌ Failed to publish Kafka message");
  }
});


module.exports = router;
