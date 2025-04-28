require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const { limiter, authLimiter, securityHeaders } = require('../middleware/security');
const KafkaService = require('../utils/kafka.service');

const app = express();

// Apply security headers
app.use(securityHeaders);

// Apply rate limiting
app.use(limiter);

// Initialize Kafka service
const kafkaService = new KafkaService('restaurant-service');

// Connect to MongoDB
const connectToMongo = async () => {
  try {
    const mongoUrl = process.env.MONGO_URI || 'mongodb://mongo-db:27017/ubereats_db';
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
    
    // Initialize Kafka service which will set up subscriptions
    await kafkaService.init();
    
    console.log('✅ Kafka Producer connected');
  } catch (error) {
    console.error('❌ Kafka connection error:', error);
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
const restaurantRoutes = require('../routes/restaurant.routes');

app.use("/api/restaurants", restaurantRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`🚀 Restaurant Service running on port ${PORT}`);
  
  // Connect to MongoDB and Kafka
  await connectToMongo();
  await connectToKafka();
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