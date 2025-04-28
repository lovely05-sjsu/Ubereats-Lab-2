const { Kafka } = require('kafkajs');
const { MongoClient } = require('mongodb');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Start the HTTP server
app.listen(port, () => {
  console.log(`Health check server listening on port ${port}`);
});

// Kafka configuration
const kafka = new Kafka({
    clientId: 'order-status-consumer',
    brokers: ['kafka:9092']
});

// MongoDB configuration
const mongoUrl = 'mongodb://mongo-db:27017';
const dbName = 'ubereats_db';

const consumer = kafka.consumer({ groupId: 'order-status-group' });

async function connectToMongo() {
    const client = new MongoClient(mongoUrl);
    await client.connect();
    return client.db(dbName);
}

async function updateOrderStatus(db, orderId, status) {
    const ordersCollection = db.collection('orders');
    await ordersCollection.updateOne(
        { _id: orderId },
        { $set: { status: status, updatedAt: new Date() } }
    );
    console.log(`Updated order ${orderId} status to ${status}`);
}

async function run() {
    try {
        // Connect to Kafka
        await consumer.connect();
        console.log('Connected to Kafka');

        // Subscribe to order status topics
        await consumer.subscribe({ 
            topics: ['order_created', 'order_status', 'order_status_updated', 'order_status_confirmed'],
            fromBeginning: true 
        });

        // Connect to MongoDB
        const db = await connectToMongo();
        console.log('Connected to MongoDB');

        // Process messages
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const orderData = JSON.parse(message.value.toString());
                    const orderId = orderData.orderId;
                    
                    // Extract status from the message or topic
                    let status;
                    if (topic === 'order_created') {
                        status = 'created';
                    } else if (topic === 'order_status_updated') {
                        status = orderData.status || 'updated';
                    } else if (topic === 'order_status_confirmed') {
                        status = orderData.status || 'confirmed';
                    } else if (topic === 'order_status') {
                        status = orderData.status || 'unknown';
                    }

                    if (status) {
                        await updateOrderStatus(db, orderId, status);
                        console.log(`Processed message from topic ${topic} for order ${orderId} with status ${status}`);
                    } else {
                        console.log(`Received message from topic ${topic} but couldn't determine status`);
                    }
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            },
        });
    } catch (error) {
        console.error('Error in consumer:', error);
    }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    console.log('Received SIGTERM. Performing graceful shutdown...');
    await consumer.disconnect();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('Received SIGINT. Performing graceful shutdown...');
    await consumer.disconnect();
    process.exit(0);
});

run().catch(console.error); 