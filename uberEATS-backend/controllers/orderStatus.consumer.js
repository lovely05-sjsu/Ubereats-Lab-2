const { Kafka } = require('kafkajs');
const mongoose = require('mongoose');
const Order = require('../models/order');
const express = require('express');
const app = express();
require('dotenv').config();

// Kafka Configuration
const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'order-service',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID || 'order-service-group' });

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://mongo-db:27017/ubereats_db';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: false,
  authSource: 'admin',
  retryWrites: true,
  w: 'majority',
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    kafka: consumer.isConnected ? 'connected' : 'disconnected',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
  res.status(200).json(health);
});

const consumeOrderUpdates = async () => {
  try {
    await producer.connect();
    await consumer.connect();
    console.log("✅ Kafka Consumer (Order Status) connected");

    // Subscribe to multiple topics for different order events
    await consumer.subscribe({ 
      topics: ['order_created', 'order_status_updated'],
      fromBeginning: false 
    });
    console.log("📬 Subscribed to order topics");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const event = JSON.parse(message.value.toString());
          console.log(`📩 Received ${topic} event:`, event);

          const { orderId, restaurantId, orderStatus } = event;

          // Convert orderId to MongoDB ObjectId
          const orderObjectId = new mongoose.Types.ObjectId(orderId);

          // Find the order in MongoDB
          const order = await Order.findById(orderObjectId);

          if (!order) {
            console.error(`❌ Order with ID ${orderId} not found in the database.`);
            return;
          }

          console.log(`✅ Order found: ${orderId}. Current status: ${order.orderStatus}`);

          // Update the order status based on the event type
          if (topic === 'order_created') {
            order.orderStatus = 'received';
          } else if (topic === 'order_status_updated') {
            order.orderStatus = orderStatus;
          }

          await order.save();
          console.log(`✅ Order ${orderId} status updated to "${order.orderStatus}"`);

          // Publish status update confirmation
          await producer.send({
            topic: 'order_status_confirmed',
            messages: [
              {
                key: orderId.toString(),
                value: JSON.stringify({
                  orderId,
                  status: order.orderStatus,
                  timestamp: new Date().toISOString()
                })
              }
            ]
          });

        } catch (err) {
          console.error("❌ Error processing Kafka message:", err);
        }
      },
    });
  } catch (err) {
    console.error("❌ Kafka Consumer connection error:", err);
    process.exit(1); // Exit if we can't connect to Kafka
  }
};

// Handle graceful shutdown
const shutdown = async () => {
  try {
    await consumer.disconnect();
    await producer.disconnect();
    console.log('✅ Kafka consumer disconnected');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error disconnecting Kafka consumer:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Order Status Consumer running on port ${PORT}`);
  consumeOrderUpdates();
});
