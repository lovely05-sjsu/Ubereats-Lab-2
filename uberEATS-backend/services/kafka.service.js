const { Kafka } = require('kafkajs');
const mongoose = require('mongoose');

class KafkaService {
    constructor() {
        console.log('Initializing KafkaService...');
        this.kafka = new Kafka({
            clientId: 'order-service',
            brokers: ['kafka:9092']
        });
        
        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({ groupId: 'order-group' });
        console.log('Kafka producer and consumer created');
    }
    
    async init() {
        console.log('Connecting to Kafka...');
        await this.producer.connect();
        await this.consumer.connect();
        console.log('Connected to Kafka');
        
        console.log('Subscribing to order topics...');
        await this.consumer.subscribe({ 
            topics: ['order_created', 'order_status_updated', 'order_status_confirmed'],
            fromBeginning: true 
        });
        console.log('Subscribed to order topics');
        
        console.log('Starting consumer...');
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log('Received message:', message.value.toString());
                const payload = JSON.parse(message.value.toString());
                await this.handleMessage(topic, payload);
            },
        });
        
        console.log('Kafka Service initialized and listening for messages...');
    }
    
    async handleMessage(topic, payload) {
        try {
            switch (topic) {
                case 'order_created':
                    await this.handleOrderCreated(payload);
                    break;
                case 'order_status_updated':
                    await this.handleOrderStatusUpdated(payload);
                    break;
                case 'order_status_confirmed':
                    await this.handleOrderStatusConfirmed(payload);
                    break;
                default:
                    console.warn(`Unknown topic: ${topic}`);
            }
        } catch (error) {
            console.error(`Error handling message from topic ${topic}:`, error);
        }
    }
    
    async publishOrderCreated(order) {
        try {
            // Convert ObjectId to string for Kafka message
            const orderData = {
                ...order.toObject(),
                _id: order._id.toString(),
                user: order.user.toString(),
                restaurant: order.restaurant.toString(),
                restaurantProfile: order.restaurantProfile.toString(),
                items: order.items.map(item => ({
                    ...item.toObject(),
                    _id: item._id.toString(),
                    menuItem: item.menuItem.toString()
                }))
            };
            
            await this.producer.send({
                topic: 'order_created',
                messages: [{ value: JSON.stringify(orderData) }]
            });
            console.log('Order created message published');
        } catch (error) {
            console.error('Error publishing order created:', error);
            throw error;
        }
    }
    
    async publishOrderStatusUpdated(orderId, status) {
        try {
            const message = {
                orderId: orderId.toString(),
                status,
                timestamp: new Date().toISOString()
            };
            
            await this.producer.send({
                topic: 'order_status_updated',
                messages: [{ value: JSON.stringify(message) }]
            });
            console.log('Order status updated message published');
        } catch (error) {
            console.error('Error publishing order status update:', error);
            throw error;
        }
    }
    
    async handleOrderCreated(payload) {
        // Implement order creation handling logic
        console.log('Handling order created:', payload);
    }
    
    async handleOrderStatusUpdated(payload) {
        // Implement order status update handling logic
        console.log('Handling order status updated:', payload);
    }
    
    async handleOrderStatusConfirmed(payload) {
        // Implement order status confirmation handling logic
        console.log('Handling order status confirmed:', payload);
    }
    
    async disconnect() {
        console.log('Disconnecting from Kafka...');
        await this.producer.disconnect();
        await this.consumer.disconnect();
        console.log('Disconnected from Kafka');
    }
}

module.exports = new KafkaService(); 