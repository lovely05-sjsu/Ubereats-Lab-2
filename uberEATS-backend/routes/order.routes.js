const express = require('express');
const { createOrder, getOrder, updateOrderStatus, getPastOrders } = require('../controllers/order.controller');
const { Kafka } = require('kafkajs');

// Kafka Configuration
const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'order-service',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
});

const producer = kafka.producer();

// Connect to Kafka
const connectKafka = async () => {
  try {
    await producer.connect();
    console.log('✅ Kafka producer connected (from order routes)');
  } catch (error) {
    console.error('❌ Kafka connection error (from order routes):', error);
    throw error;
  }
};

// Connect to Kafka when the routes are loaded
connectKafka();

const router = express.Router();

// 🛒 Place a new order
router.post('/createOrder', createOrder);

// 📦 Get a specific order by ID
router.get('/:id', getOrder);

// 🚚 Update order status (e.g., "Preparing", "On the Way", "Delivered")
router.put('/:orderId/status', updateOrderStatus);

// 📜 Get all past orders for a customer
router.get('/pastOrders/:customerId', getPastOrders);

// ✅ 📬 Kafka test route
router.post('/publish-test', async (req, res) => {
  try {
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
