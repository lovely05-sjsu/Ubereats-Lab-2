const { kafka } = require('../utils/kafka');
const { Sequelize } = require('sequelize'); // Assuming you use Sequelize ORM
require('dotenv').config();

const consumer = kafka.consumer({ groupId: 'restaurant-group' });

const consumeOrderUpdates = async () => {
  try {
    await consumer.connect();
    console.log("✅ Kafka Consumer (Order Status) connected");

    await consumer.subscribe({ topic: 'order_created', fromBeginning: false });
    console.log("📬 Subscribed to topic: order_created");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          // Parse the Kafka message
          const event = JSON.parse(message.value.toString());
          console.log('📩 Received order event:', event);

          // Assuming you have a model for Order and Sequelize ORM configured
          const { orderId, restaurantId, userId } = event;

          // Find the order in your DB using Sequelize (assuming an Order model)
          const order = await Order.findOne({ where: { orderId, restaurantId } });

          if (!order) {
            console.error(`❌ Order with ID ${orderId} not found in the database.`);
            return;
          }

          console.log(`✅ Order found: ${orderId}. Updating status...`);

          // Update the order status or perform any other action
          order.status = 'received';  // Example: Mark order as received
          await order.save();
          console.log(`✅ Order ${orderId} status updated to "received"`);
        } catch (err) {
          console.error("❌ Error processing Kafka message:", err);
        }
      },
    });
  } catch (err) {
    console.error("❌ Kafka Consumer connection error:", err);
  }
};

consumeOrderUpdates();
