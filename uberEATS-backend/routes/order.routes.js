const express = require('express');
const { createOrder, getOrders, getOrderById, updateOrderStatus,getOrder,saveOrder,completeOrderStatus, cancelOrderStatus,getPastOrders } = require('../controllers/order.controller');

const router = express.Router();
const { sendOrderEvent } = require('../Kafka/orderServiceKafkaProducer');

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

router.post('/saveOrder', saveOrder);

router.get('/pastOrders/:customerId', getPastOrders);

module.exports = router;
