require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const { limiter, authLimiter, securityHeaders } = require('./middleware/security');

// Kafka utilities
const { connectKafka, producer, consumer } = require('./utils/kafka'); 

const app = express();

app.set('trust proxy', 1);

// Apply security headers
app.use(securityHeaders);

// Apply rate limiting
app.use(limiter);

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://mongo-db:27017/ubereats_db';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: process.env.NODE_ENV === 'production',
  authSource: 'admin',
  retryWrites: true,
  w: 'majority',
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

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
    maxAge: 600, // 10 minutes
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
      mongoUrl: mongoURI,
      collectionName: 'sessions',
      ttl: 24 * 60 * 60, // 1 day
      autoRemove: 'native',
      crypto: {
        secret: process.env.COOKIE_SECRET || 'your-cookie-secret'
      }
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      domain: process.env.COOKIE_DOMAIN || undefined
    },
    name: 'sessionId'
  })
);

// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const restaurantRoutes = require('./routes/restaurant.routes');
const emailRoutes = require('./routes/email.routes');
const orderRoutes = require('./routes/order.routes');
const favoritesRoutes = require('./routes/favorite.routes');

// Apply auth rate limiting to auth routes
app.use("/api/auth", authLimiter);

app.use("/api/favorites", favoritesRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/orders", orderRoutes);

// Static files for images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Health Check & Debug
app.get('/', (req, res) => res.send('UberEats API is running with Kafka + MongoDB!'));
app.get('/health', (req, res) => res.send('OK'));
app.get('/debug/routes', (req, res) => {
  const routes = app._router.stack
    .filter(r => r.route)
    .map(r => r.route.path);
  res.send(routes);
});

// Test Kafka publish route
app.post('/api/orders/publish-test', async (req, res) => {
  try {
    const orderData = { orderId: Date.now(), restaurantId: 123, userId: 456 };
    await producer.send({
      topic: 'order_created',
      messages: [{ value: JSON.stringify(orderData) }],
    });
    res.send("Order event published to Kafka!");
  } catch (err) {
    console.error("❌ Kafka publish error:", err);
    res.status(500).send("Failed to publish Kafka message");
  }
});

// Start the app
const PORT = process.env.PORT || 2000;

const startServer = async () => {
  try {
    await connectKafka(); // ✅ connect producer and consumer together

    // Subscribe to Kafka topic
    await consumer.subscribe({ topic: 'order_created', fromBeginning: true });

    // Define how to handle incoming Kafka messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const order = JSON.parse(message.value.toString());
        console.log(`📦 [Kafka] Received order:`, order);
        // Here you could: update restaurant queue, notify restaurant, etc.
      },
    });

    app.listen(PORT, () => {
      console.log(`🚀 UberEats server running at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("❌ Startup error:", err);
    process.exit(1); // Crash properly if failed
  }
};

startServer();
