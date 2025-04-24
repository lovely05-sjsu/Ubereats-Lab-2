const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'ubereats-app',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'restaurant-group' });

const connectKafka = async () => {
  try {
    if (!producer.isConnected()) {
      await producer.connect();
      console.log("✅ Kafka producer connected (from utils)");
    }

    if (!consumer.isConnected()) {
      await consumer.connect();
      console.log("✅ Kafka consumer connected (from utils)");
    }
  } catch (err) {
    console.error("❌ Kafka connection error (from utils):", err);
  }
};

// Call it immediately
connectKafka();

module.exports = {
  kafka,
  producer,
  consumer,
  connectKafka,
};
