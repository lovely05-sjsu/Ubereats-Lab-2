// orderServiceKafkaProducer.js
//const { Kafka } = require('kafkajs');

// Configure Kafka client using the Kafka service name (as deployed in Kubernetes)
/*const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['kafka:9092']
});*/

/*const producer = kafka.producer();

async function connectProducer() {
  await producer.connect();
  console.log('Kafka producer connected');
}*/

/*async function sendOrderEvent(order) {
  try {
    await producer.send({
      topic: 'order-events',
      messages: [
        { value: JSON.stringify(order) },
      ]
    });
    console.log('Order event sent:', order);
  } catch (error) {
    console.error('Error sending order event:', error);
  }
}

module.exports = {  }; */
