require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const { limiter, authLimiter, securityHeaders } = require('../middleware/security');

const app = express();

// Apply security headers
app.use(securityHeaders);

// Apply rate limiting
app.use(limiter);

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
      mongoUrl: mongoURI,
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
const authRoutes = require('../routes/auth.routes');
const userRoutes = require('../routes/user.routes');

// Apply auth rate limiting to auth routes
app.use("/api/auth", authLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Health Check
app.get('/health', (req, res) => res.send('OK'));

const PORT = process.env.PORT || 2001;

app.listen(PORT, () => {
  console.log(`🚀 User service running at http://localhost:${PORT}`);
}); 