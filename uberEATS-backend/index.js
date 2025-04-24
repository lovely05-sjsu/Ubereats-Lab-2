require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require("path");
const { sequelize } = require('./models');
const db = require('./models');
const { Restaurant, MenuItem, Review, Favorite } = require('./models/index');

// Kafka utilities
const { kafka } = require('./utils/kafka'); // We'll create this file
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'restaurant-group' }); // One group per consumer service

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
}));

app.use(session({
    secret: "ubereats-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: "lax",
    },
}));

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

// Static file serving
app.use('/images', express.static(path.join(__dirname, 'images')));

// DEBUG: List all routes
app.get('/debug/routes', (req, res) => {
    const routePaths = app._router.stack
        .filter(r => r.route)
        .map(r => r.route.path);
    res.send(routePaths);
});

// Root routes
app.get('/', async (req, res) => {
    res.send('UberEats API is running with Kafka integration!');
});

app.get('/sync', async (req, res) => {
    try {
        await db.sequelize.sync({ force: true });
        res.send('Tables synced successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error syncing tables');
    }
});
app.get('/health', (req, res) => {
    res.send('OK');
  });
// Kafka test route (optional)
app.post('/api/orders/publish-test', async (req, res) => {
    try {
        const orderData = { orderId: Date.now(), restaurantId: 123, userId: 456 };
        await producer.send({
            topic: 'order_created',
            messages: [{ value: JSON.stringify(orderData) }],
        });
        res.send("Order event published to Kafka!");
    } catch (err) {
        console.error("Kafka publish error:", err);
        res.status(500).send("Failed to publish Kafka message");
    }
});


// Start the app
const PORT = process.env.PORT || 2000;

const startServer = async () => {
    try {
        await sequelize.sync();

        await producer.connect();
        console.log("✅ Kafka Producer connected");

        await consumer.connect();
        console.log("✅ Kafka Consumer connected");

        // Subscribe to order events
        await consumer.subscribe({ topic: 'order_created', fromBeginning: true });

        // Define consumer behavior
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const order = JSON.parse(message.value.toString());
                console.log(`📦 [Kafka] Received order:`, order);
                // Here you could: update restaurant queue, notify staff, etc.
            },
        });

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error("Startup error:", err);
    }
};
 
startServer();
