const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'order-service',
  brokers: (process.env.KAFKA_BROKERS || 'kafka:9092').split(','),
});

const producer = kafka.producer();
const consumer = kafka.consumer({ 
  groupId: process.env.KAFKA_GROUP_ID || 'order-service-group' 
});

const connectKafka = async () => {
  try {
    await producer.connect();
    await consumer.connect();
    console.log('✅ Kafka producer and consumer connected successfully');
  } catch (error) {
    console.error('❌ Kafka connection error:', error);
    throw error;
  }
};

module.exports = {
  kafka,
  producer,
  consumer,
  connectKafka,
}; 