const { Order, OrderItem, MenuItem, Restaurant } = require("../models");


exports.getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params; // Get order ID from request

    const order = await Order.findOne({
      where: { id },
      include: [
        {
          model: Restaurant,
          attributes: ["id", "name"],
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: MenuItem,
              attributes: ["id", "name", "price", "image", "description"],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const formattedOrder = {
      customerId: order.customerId,
      restaurantId: order.restaurantId,
      restaurantProfileId: order.restaurantProfileId || null,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map((item) => ({
        id: item.MenuItem.id,
        name: item.MenuItem.name,
        price: item.MenuItem.price,
        image: item.MenuItem.image,
        description: item.MenuItem.description,
        quantity: item.quantity,
      })),
    };

    res.json(formattedOrder);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createOrder = async (req, res) => {
    try {
      const { customerId, restaurantId, restaurantProfileId, status, items } = req.body;
  
      // Validate request
      if (!customerId || !restaurantId || !items || !items.length) {
        return res.status(400).json({ message: "Invalid request. Provide customerId, restaurantId, and items." });
      }
  
      // Create order
      const order = await Order.create({
        customerId,
        restaurantId,
        restaurantProfileId,
        status: status || "Pending", // Default to "Pending" if status is not provided
      });
  
      // Create order items
      const orderItems = await Promise.all(
        items.map(async (item) => {
          const menuItem = await MenuItem.findByPk(item.id);
          if (!menuItem) {
            throw new Error(`MenuItem with id ${item.id} not found`);
          }
  
          return OrderItem.create({
            orderId: order.id,
            menuItemId: item.id,
            quantity: item.quantity,
          });
        })
      );
  
      res.status(201).json({
        message: "Order created successfully",
        order: {
          id: order.id,
          customerId: order.customerId,
          restaurantId: order.restaurantId,
          restaurantProfileId: order.restaurantProfileId,
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          items: orderItems.map((orderItem) => ({
            menuItemId: orderItem.menuItemId,
            quantity: orderItem.quantity,
          })),
        },
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };