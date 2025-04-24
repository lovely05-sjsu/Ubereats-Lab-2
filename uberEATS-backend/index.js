require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require("path");
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ubereats_db';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'ubereats-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoURI,
    }),
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require("./routes/user.routes");
const restaurantRoutes = require("./routes/restaurant.routes");
const emailRoutes = require("./routes/email.routes");
const orderRoutes = require("./routes/order.routes");
const favoritesRoutes = require("./routes/favorite.routes");

app.use("/api/favorites", favoritesRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/orders", orderRoutes);

app.get('/', (req, res) => {    
  res.send('UberEats API is running!');
});

// Static files for images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Connect Kafka Producer (Order Service)
/*const { connectProducer } = require('./Kafka/orderServiceKafkaProducer');
(async () => {
  try {
    await connectProducer();
    console.log('Kafka producer connected');
  } catch (error) {
    console.error('Could not connect Kafka producer:', error);
  }
})();

// Connect Kafka Consumer for Restaurant Service
const { connectConsumer } = require('./Kafka/restaurantKafkaConsumer');
(async () => {
  try {
    await connectConsumer();
    console.log('Kafka consumer is connected.');
  } catch (error) {
    console.error('Error connecting Kafka consumer:', error);
  }
})(); */

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
