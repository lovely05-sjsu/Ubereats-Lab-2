const { Order, OrderItem, sequelize } = require('../models');
const { producer } = require('../utils/kafka'); // 🟢 Import Kafka producer

// 📌 Place a new order (basic one)
const createOrder = async (req, res) => {
    try {
        const newOrder = await Order.create(req.body);
        res.status(201).json({ message: "Order placed successfully!", order: newOrder });
    } catch (error) {
        res.status(500).json({ error: "Failed to place order" });
    }
};

// 📌 Get past orders for a customer
const getPastOrders = async (req, res) => {
    const { customerId } = req.params;
  
    try {
        const orders = await Order.findAll({
            where: { customerId },
            include: {
                model: OrderItem,
                as: 'items',
                attributes: ['id', 'menuItemId', 'name', 'description', 'image', 'price', 'quantity'],
            },
        });

        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found for this customer' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// 📌 Save order with items + send Kafka message
const saveOrder = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { address, isDelivery, customerId, restaurantId, restaurantProfileId, orderStatus, items } = req.body;

        const parsedRestaurantId = parseInt(restaurantId, 10);
        const parsedRestaurantProfileId = parseInt(restaurantProfileId, 10);

        if (isNaN(parsedRestaurantId) || isNaN(parsedRestaurantProfileId)) {
            return res.status(400).json({ error: "Invalid restaurantId or restaurantProfileId" });
        }

        const newOrder = await Order.create({
            customerId,
            restaurantId: parsedRestaurantId,
            restaurantProfileId: parsedRestaurantProfileId,
            address,
            isDelivery,
            orderStatus,
        }, { transaction: t });

        const orderItems = items.map(item => ({
            orderId: newOrder.id,
            menuItemId: item.id,
            name: item.name,
            description: item.description,
            image: item.image,
            price: parseFloat(item.price),
            quantity: item.quantity,
        }));

        await OrderItem.bulkCreate(orderItems, { transaction: t });

        await t.commit();

        const orderDetails = {
            orderId: newOrder.id,
            address,
            isDelivery,
            customerId,
            restaurantId: parsedRestaurantId,
            orderStatus,
            items,
        };

        // ✅ Send Kafka message
        await producer.send({
            topic: 'order_created',
            messages: [{ value: JSON.stringify(orderDetails) }],
        });

        res.status(201).json({ message: "Order placed successfully", orderId: newOrder.id, orderDetails });
    } catch (error) {
        await t.rollback();
        console.error("Error saving order:", error);
        res.status(500).json({ error: "Failed to place order" });
    }
};

const getOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findByPk(id, {
            include: [{ model: OrderItem, as: "items" }],
        });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        const formattedOrder = {
            customerId: order.customerId,
            restaurantId: order.restaurantId,
            restaurantProfileId: order.restaurantProfileId,
            address: order.address,
            isDelivery: order.isDelivery,
            orderStatus: order.orderStatus,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            items: order.items.map(item => ({
                id: item.menuItemId,
                name: item.name,
                description: item.description,
                image: item.image,
                price: item.price.toFixed(2),
                quantity: item.quantity,
            })),
        };

        res.json(formattedOrder);
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ error: "Failed to fetch order" });
    }
};

// 📌 Get all orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};

// 📌 Get order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: "Error fetching order" });
    }
};

// 📌 Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByPk(req.params.orderId);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        order.orderStatus = status;
        await order.save();
        res.status(200).json({ message: "Order status updated!", order });
    } catch (error) {
        res.status(500).json({ error: "Failed to update order status" });
    }
};

// 📌 Complete order
const completeOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        order.status = 'Complete';
        await order.save();
        res.status(200).json({ message: "Order marked as complete", order });
    } catch (error) {
        res.status(500).json({ error: "Failed to update order status" });
    }
};

// 📌 Cancel order
const cancelOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        order.status = 'Cancelled';
        await order.save();
        res.status(200).json({ message: "Order cancelled", order });
    } catch (error) {
        res.status(500).json({ error: "Failed to update order status" });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    getOrder,
    saveOrder,
    completeOrderStatus,
    cancelOrderStatus,
    getPastOrders
};
