const { Kafka } = require('kafkajs');
const assert = require('assert');

describe('Kafka Integration Tests', () => {
    let producer;
    let consumer;
    
    before(async () => {
        const kafka = new Kafka({
            clientId: 'test-client',
            brokers: ['kafka:9092']
        });
        
        producer = kafka.producer();
        consumer = kafka.consumer({ groupId: 'test-group' });
        
        await producer.connect();
        await consumer.connect();
    });
    
    after(async () => {
        await producer.disconnect();
        await consumer.disconnect();
    });
    
    it('should successfully produce and consume messages', async () => {
        const topic = 'test-topic';
        const message = { orderId: '123', status: 'CREATED' };
        
        // Subscribe to the topic
        await consumer.subscribe({ topic, fromBeginning: true });
        
        // Array to store received messages
        const receivedMessages = [];
        
        // Set up the consumer
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                receivedMessages.push(JSON.parse(message.value.toString()));
            },
        });
        
        // Produce a message
        await producer.send({
            topic,
            messages: [
                { value: JSON.stringify(message) },
            ],
        });
        
        // Wait for the message to be consumed
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verify the message was received
        assert.strictEqual(receivedMessages.length, 1);
        assert.deepStrictEqual(receivedMessages[0], message);
    });
    
    it('should handle order status updates', async () => {
        const topic = 'order-status';
        const orderUpdate = {
            orderId: '456',
            status: 'ACCEPTED',
            restaurantId: '789',
            timestamp: new Date().toISOString()
        };
        
        await consumer.subscribe({ topic, fromBeginning: true });
        
        const receivedUpdates = [];
        
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                receivedUpdates.push(JSON.parse(message.value.toString()));
            },
        });
        
        await producer.send({
            topic,
            messages: [
                { value: JSON.stringify(orderUpdate) },
            ],
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        assert.strictEqual(receivedUpdates.length, 1);
        assert.deepStrictEqual(receivedUpdates[0], orderUpdate);
    });
}); 