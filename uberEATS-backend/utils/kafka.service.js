const { Kafka } = require('kafkajs');
const Order = require('../models/order');

class KafkaService {
  constructor(clientId, brokers = ['kafka:9092']) {
    this.kafka = new Kafka({
      clientId,
      brokers
    });
    this.producer = this.kafka.producer();
    this.consumer = null;
  }

  async connect() {
    try {
      await this.producer.connect();
      console.log('✅ Kafka Producer connected');
    } catch (error) {
      console.error('❌ Error connecting to Kafka Producer:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.producer.disconnect();
      console.log('✅ Kafka Producer disconnected');
    } catch (error) {
      console.error('❌ Error disconnecting from Kafka Producer:', error);
    }
  }

  async publishMessage(topic, message) {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }]
      });
      console.log(`✅ Published message to topic ${topic}:`, message);
    } catch (error) {
      console.error(`❌ Error publishing message to topic ${topic}:`, error);
      throw error;
    }
  }

  async createConsumer(groupId) {
    this.consumer = this.kafka.consumer({ groupId });
    try {
      await this.consumer.connect();
      console.log('✅ Kafka Consumer connected');
    } catch (error) {
      console.error('❌ Error connecting to Kafka Consumer:', error);
      throw error;
    }
  }

  async subscribeToTopics(topics, messageHandler) {
    if (!this.consumer) {
      throw new Error('Consumer not initialized. Call createConsumer first.');
    }

    try {
      await this.consumer.subscribe({ topics, fromBeginning: true });
      console.log(`✅ Subscribed to topics: ${topics.join(', ')}`);

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const value = JSON.parse(message.value.toString());
            console.log(`📬 Received message from topic ${topic}:`, value);
            await messageHandler(topic, value);
          } catch (error) {
            console.error(`❌ Error processing message from topic ${topic}:`, error);
          }
        }
      });
    } catch (error) {
      console.error('❌ Error subscribing to topics:', error);
      throw error;
    }
  }

  async disconnectConsumer() {
    if (this.consumer) {
      try {
        await this.consumer.disconnect();
        console.log('✅ Kafka Consumer disconnected');
      } catch (error) {
        console.error('❌ Error disconnecting from Kafka Consumer:', error);
      }
    }
  }
}

module.exports = KafkaService; 