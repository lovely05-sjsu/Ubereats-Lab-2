// restaurantKafkaConsumer.js
/*const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'restaurant-service',
  brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'restaurant-group' });*/

/*async function connectConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-events', fromBeginning: false });
  console.log('Kafka consumer connected and subscribed to order-events');

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const order = JSON.parse(message.value.toString());
      console.log('Received order event:', order);
      // TODO: Implement status updates or other logic here
      await processOrderEvent(order);
    }
  });
}

async function processOrderEvent(order) {
  // Example: update order status or perform other business logic
  console.log(`Processing order event for orderId: ${order.orderId}`);
  // Implement your logic, e.g., update order status in database
}

module.exports = { connectConsumer }; */
