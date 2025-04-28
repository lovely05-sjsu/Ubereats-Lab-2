const { Kafka } = require('kafkajs');
const Order = require('../models/order');
const mongoose = require('mongoose');

console.log('Starting Order Status Service...');

class OrderStatusService {
    constructor() {
        console.log('Initializing OrderStatusService...');
        this.kafka = new Kafka({
            clientId: 'order-status-service',
            brokers: ['kafka:9092']
        });
        
        this.consumer = this.kafka.consumer({ groupId: 'order-status-group' });
        console.log('Kafka consumer created');
    }
    
    async init() {
        console.log('Connecting to Kafka...');
        await this.consumer.connect();
        console.log('Connected to Kafka');
        
        console.log('Subscribing to order-status topic...');
        await this.consumer.subscribe({ topic: 'order_status', fromBeginning: true });
        console.log('Subscribed to order_status topic');
        
        console.log('Starting consumer...');
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log('Received message:', message.value.toString());
                const payload = JSON.parse(message.value.toString());
                await this.updateOrderStatus(payload);
            },
        });
        
        console.log('Order Status Service initialized and listening for updates...');
    }
    
    async updateOrderStatus(payload) {
        try {
            console.log('Updating order status:', payload);
            const { orderId, status } = payload;
            
            // Convert string ID to ObjectId
            const objectId = new mongoose.Types.ObjectId(orderId);
            
            // Update the order status in the database
            const updatedOrder = await Order.findByIdAndUpdate(
                objectId,
                { 
                    orderStatus: status,
                    updatedAt: new Date()
                },
                { new: true }
            );
            
            if (!updatedOrder) {
                console.error(`Order not found: ${orderId}`);
                return;
            }
            
            console.log(`Order ${orderId} status updated to ${status}`);
            
            // Here you could implement additional logic like:
            // - Notifying the customer about the status change
            // - Updating delivery status
            // - Triggering other business processes
            
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    }
    
    async disconnect() {
        console.log('Disconnecting from Kafka...');
        await this.consumer.disconnect();
        console.log('Disconnected from Kafka');
    }
}

const service = new OrderStatusService();
service.init().catch(error => {
    console.error('Error initializing service:', error);
    process.exit(1);
}); 