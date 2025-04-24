const {
  Restaurant,
  MenuItem,
  Review,
  RestaurantProfile,
  Order,
  OrderItem,
  User,
  Favorite,
} = require("../models");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// Create a new restaurant
exports.createRestaurant = async (req, res) => {
  try {
    console.log("Received Data:", req.body); // Log the request data

    const { name, email, location, description } = req.body;

    if (!name || !email || !location) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the restaurant already exists
    const existingRestaurant = await Restaurant.findOne({ where: { email } });
    if (existingRestaurant) {
      return res
        .status(400)
        .json({ error: "A restaurant with this email already exists" });
    }

    const restaurant = await Restaurant.create({
      name,
      email,
      location,
      description,
    });
    res.status(201).json(restaurant);
  } catch (error) {
    console.error("Error creating restaurant:", error); // Log full error

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Email must be unique" });
    }

    res.status(500).json({
      error: "Internal Server Error",
      details: error.message, // Send back actual error message
    });
  }
};

// Get all restaurantOrderDetails
exports.getRestaurantStats = async (req, res) => {
  try {
    const { restaurantProfileId } = req.params;
    console.log('Reached rest stats');
    // Fetch the latest orders by ordering them by createdAt in descending order
    const latestOrders = await Order.findAll({
      where: { restaurantProfileId: restaurantProfileId },
     
      order: [["createdAt", "DESC"]], // Order by latest createdAt timestamp
      //limit: 1, // Adjust as needed to fetch recent orders
      include: [
        {
          model: OrderItem, // Include related OrderItem data
          as: "items",
        },
      ],
    });

    //const orderStats = await Order.fin

    if (!latestOrders.length) {
      return res.status(200).json({ message: "No orders found" });
    }

    res.status(200).json({ orders: latestOrders });
  } catch (error) {
    console.error("Error fetching latest restaurant orders:", error);
    res.status(500).json({ error: "Failed to retrieve orders" });
  }
};


// Get all restaurants
exports.getRestaurants = async (req, res) => {
  console.log('Inside A');
  try {
    const restaurants = await Restaurant.findAll();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.favoriteRestaurant = async (req, res) => {
  const { restaurantId, customerId } = req.body;

  if (!restaurantId || !customerId) {
    return res.status(400).json({ message: "Restaurant ID and Customer ID are required" });
  }

  try {
    // Check if the favorite already exists
    const existingFavorite = await Favorite.findOne({ where: { restaurantId, customerId } });

    if (existingFavorite) {
      // If found, remove it from favorites
      await existingFavorite.destroy();
      return res.status(200).json({ message: "Restaurant removed from favorites" });
    } else {
      // If not found, add it to favorites
      const newFavorite = await Favorite.create({ restaurantId, customerId });
      return res.status(201).json({ message: "Restaurant added to favorites", favoriteId: newFavorite.id });
    }
  } catch (error) {
    console.error("Error processing favorite action:", error);
    return res.status(500).json({ message: "Error processing favorite action", error: error.message });
  }
};


// Get all restaurants for dashboard
exports.getRestaurantsDashboard = async (req, res) => {
  try {
    console.log('Inside restaurants dashboard');
    const restaurants = await Restaurant.find();

    const formattedRestaurants = restaurants.map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
      rating: restaurant.rating,
      CountRatings: restaurant.reviews.length, // Number of reviews
      deliveryFee: parseFloat(restaurant.deliveryFee).toFixed(2),
      distance: restaurant.distance,
      image: restaurant.image,
      categories: restaurant.category,
    }));

    res.json(formattedRestaurants);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching restaurants");
  }
};

exports.getRestaurantDetail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const menuItems = await MenuItem.find({ restaurant_id: restaurant._id });
    const reviews = await Review.find({ restaurant_id: restaurant._id });

    // Format the response
    const formattedRestaurant = {
      id: restaurant.id,
      name: restaurant.name,
      rating: restaurant.rating,
      deliveryFee: `$${parseFloat(restaurant.deliveryFee).toFixed(2)}`, // Format as currency
      arrivalTime: restaurant.arrivalTime,
      address: restaurant.address,
      image: restaurant.image,
      categories: restaurant.category,
      menu: restaurant.menuItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        rating: item.rating,
        description: item.description,
        image: item.image,
      })),
      reviews: restaurant.reviews.map((review) => ({
        user: review.user,
        rating: review.rating,
        comment: review.comment,
      })),
    };

    res.json(formattedRestaurant);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching restaurant details");
  }
};

exports.getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createRestaurantProfile = async (req, res) => {
  try {
    const { name, email, city, password } = req.body;

    // Check if the email already exists

    const existingRestaurant = await RestaurantProfile.findOne({
      where: { email },
    });

    if (existingRestaurant) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create restaurant profile

    const restaurant = await RestaurantProfile.create({
      name,

      email,

      city,

      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "Restaurant profile created successfully", restaurantId: restaurant.id });
  } catch (error) {
    console.error("Error creating restaurant profile:", error);

    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getRestaurantMenus = async (req, res) => {
  try {
    const restaurantId = parseInt(req.params.restaurantId, 10); // Convert ID to integer

    if (isNaN(restaurantId)) {
      return res.status(400).json({ error: "Invalid restaurant ID" });
    }

    // Fetch menu items associated with the restaurant

    const menuItems = await MenuItem.findAll({
      where: { restaurant_id: restaurantId },
    });

    if (menuItems.length === 0) {
      return res
        .status(404)
        .json({ message: "No menu items found for this restaurant" });
    }

    res.status(200).json(menuItems);
  } catch (error) {
    console.error("Error fetching restaurant menus:", error);

    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createRestaurantMenu = async (req, res) => {
  try {
    console.log(req.body);

    const restaurantId = parseInt(req.params.restaurantId, 10); // Convert ID to integer

    const { name, ingredients, price, description, category, rating, image } =
      req.body;

    if (isNaN(restaurantId)) {
      return res.status(400).json({ error: "Invalid restaurant ID" });
    }

    if (!name || !price || !rating) {
      return res
        .status(400)
        .json({ error: "Name, price, and rating are required" });
    }

    // Create a new menu item

    const menuItem = await MenuItem.create({
      restaurant_id: restaurantId,

      name,

      price,

      description,

      rating,

      image,
    });

    res.status(201).json({
      message: "Menu item created successfully",

      menuItem,
    });
  } catch (error) {
    console.error("Error creating menu item:", error);

    res.status(500).json({ error: "Internal server error" });
  }
};

exports.GetRestaurantOrders = async (req, res) => {
  try {
    const { restaurantProfileId } = req.params; // Change from restaurantId to restaurantProfileId

    if (!restaurantProfileId) {
      return res.status(400).json({ error: "Restaurant Profile ID is required" });
    }

    // Fetch orders with customer details
    const orders = await Order.findAll({
      where: { restaurantProfileId }, // Updated condition

      include: [
        {
          model: User,
          //as: "user", // Ensure the alias matches your association
          attributes: ["id", "name", "email"], // Fetch only necessary fields
        },
      ],

      order: [["createdAt", "DESC"]], // Optional: Sort by latest orders
    });

    if (!orders.length) {
      return res.status(200).json({ message: "No orders found for this restaurant profile" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching restaurant orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.updateRestaurantProfile = async (req, res) => {
  const { restaurantProfileId } = req.params;
  const { name, address, categories } = req.body;

  try {
      // Find the restaurant profile by ID
      const restaurant = await Restaurant.findOne({ where: { id: restaurantProfileId } });

      if (!restaurant) {
          return res.status(404).json({ message: 'Restaurant not found' });
      }

      // Update fields
      restaurant.name = name || restaurant.name;
      restaurant.address = address || restaurant.address;
      restaurant.category = categories || restaurant.categories;

      await restaurant.save(); // Save updated record

      res.status(200).json({ message: 'Restaurant profile updated successfully', restaurant });
  } catch (error) {
      console.error('Error updating restaurant profile:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteMenuItem = async (req, res) => {
  const { menuId } = req.params;

  try {
      // Find the menu item by ID
      const menuItem = await MenuItem.findByPk(menuId);

      if (!menuItem) {
          return res.status(404).json({ message: 'Menu item not found' });
      }

      // Delete the menu item
      await menuItem.destroy();

      res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
      console.error('Error deleting menu item:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

