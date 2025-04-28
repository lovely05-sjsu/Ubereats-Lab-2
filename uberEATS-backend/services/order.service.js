require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const { limiter, authLimiter, securityHeaders } = require('../middleware/security');
const { Kafka } = require('kafkajs');
const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const KafkaService = require('../utils/kafka.service');

const app = express();

// Apply security headers
app.use(securityHeaders);

// Apply rate limiting
app.use(limiter);

// Kafka Configuration
const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'order-service',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID || 'order-service-group' });

// Initialize Kafka service
const kafkaService = new KafkaService('order-service');

// Connect to MongoDB
const connectToMongo = async () => {
  try {
    const mongoUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/ubereats_db';
    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to Kafka and subscribe to topics
const connectToKafka = async () => {
  try {
    await kafkaService.connect();
    await kafkaService.createConsumer('order-service-group');
    
    // Subscribe to order status update events
    await kafkaService.subscribeToTopics(['order_status_updated'], async (topic, message) => {
      try {
        console.log('📦 Order status updated:', message);
        
        // Update order status in database
        const order = await Order.findById(message.orderId);
        if (order) {
          order.orderStatus = message.status;
          await order.save();
          console.log('✅ Updated order status in database:', order._id);
        } else {
          console.error('❌ Order not found:', message.orderId);
        }
      } catch (error) {
        console.error('❌ Error processing status update:', error);
      }
    });
    
  } catch (error) {
    console.error('❌ Kafka connection error:', error);
    process.exit(1);
  }
};

// Middlewares
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 600,
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'ubereats-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
      mongoUrl: process.env.MONGO_URI || 'mongodb://mongo-db:27017/ubereats_db',
      collectionName: 'sessions',
      ttl: 24 * 60 * 60,
      autoRemove: 'native',
      crypto: {
        secret: process.env.COOKIE_SECRET || 'your-cookie-secret'
      }
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
      domain: process.env.COOKIE_DOMAIN || undefined
    },
    name: 'sessionId'
  })
);

// Routes
const orderRoutes = require('../routes/order.routes');

app.use("/api/orders", orderRoutes);

// Create a new order
app.post('/api/orders', async (req, res) => {
  console.log('Received order creation request:', req.body);
  try {
    const orderData = req.body;
    
    // Create the order in the database
    const order = new Order(orderData);
    await order.save();
    console.log('Order saved to database:', order);
    
    // Publish order created event to Kafka
    await kafkaService.publishMessage('order_created', {
      orderId: order._id.toString(),
      customerId: order.customerId.toString(),
      restaurantId: order.restaurantId.toString(),
      restaurantProfileId: order.restaurantProfileId.toString(),
      items: order.items,
      orderStatus: order.orderStatus || 'Pending',
      isDelivery: order.isDelivery,
      address: order.address,
      createdAt: order.createdAt
    });
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
  console.log('Received request to fetch all orders');
  try {
    const orders = await Order.find()
      .populate('customerId', 'name email')
      .populate('restaurantId', 'name')
      .populate('restaurantProfileId')
      .populate('items');
    
    console.log(`Found ${orders.length} orders`);
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// Get order by ID
app.get('/api/orders/:id', async (req, res) => {
  console.log('Received request to fetch order:', req.params.id);
  try {
    const order = await Order.findById(req.params.id)
      .populate('customerId', 'name email')
      .populate('restaurantId', 'name')
      .populate('restaurantProfileId')
      .populate('items');
    
    if (!order) {
      console.log('Order not found:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    console.log('Found order:', order);
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
});

// Update order status
app.patch('/api/orders/:id/status', async (req, res) => {
  console.log('Received request to update order status:', req.params.id, req.body);
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      console.log('Order not found:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Update order status
    order.orderStatus = status;
    await order.save();
    console.log('Order status updated:', order);
    
    // Publish order status updated event to Kafka
    await kafkaService.publishMessage('order_status_updated', {
      orderId: order._id.toString(),
      status: order.orderStatus,
      updatedAt: new Date()
    });
    
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('❌ Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Start the server
const PORT = process.env.PORT || 2003;
app.listen(PORT, async () => {
  console.log(`🚀 Order Service running on port ${PORT}`);
  
  // Connect to MongoDB and Kafka
  await connectToMongo();
  await connectToKafka();
  
  // Create Kafka consumer for status updates
  await kafkaService.createConsumer('order-service-group');
  await kafkaService.subscribeToTopics(['order_status_updated'], async (topic, message) => {
    try {
      console.log('Received status update:', message);
      const order = await Order.findById(message.orderId);
      if (order) {
        order.orderStatus = message.status;
        await order.save();
        console.log('Updated order status:', order);
      }
    } catch (error) {
      console.error('Error processing status update:', error);
    }
  });
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM. Performing graceful shutdown...');
  await kafkaService.disconnect();
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT. Performing graceful shutdown...');
  await kafkaService.disconnect();
  await mongoose.connection.close();
  process.exit(0);
}); 