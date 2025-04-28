const db = require('../models');
const Restaurant = db.Restaurant;
const MenuItem = db.MenuItem;
const Review = db.Review;
const RestaurantProfile = db.RestaurantProfile;
const Order = db.Order;
const OrderItem = db.OrderItem;
const User = db.User;
const Favorite = db.Favorites;

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

    if (!mongoose.Types.ObjectId.isValid(restaurantProfileId)) {
      return res.status(400).json({ message: "Invalid restaurant profile ID" });
    }

    const orders = await Order.find({ restaurantProfileId })
      .sort({ createdAt: -1 }) // descending order
      .populate({
        path: "items", // adjust based on your schema field
        model: OrderItem,
      });

    if (!orders.length) {
      return res.status(200).json({ message: "No orders found" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching latest restaurant orders:", error);
    res.status(500).json({ error: "Failed to retrieve orders" });
  }
};


// Get all restaurants
exports.getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();

    const enrichedRestaurants = await Promise.all(
      restaurants.map(async (restaurant) => {
        const menuItems = await MenuItem.find({ restaurant_id: restaurant._id });
        const reviews = await Review.find({ restaurant_id: restaurant._id });

        return {
          _id: restaurant._id,
          name: restaurant.name,
          category: restaurant.category,
          city: restaurant.city,
          rating: restaurant.rating,
          deliveryFee: restaurant.deliveryFee,
          arrivalTime: restaurant.arrivalTime,
          address: restaurant.address,
          distance: restaurant.distance,
          description: restaurant.description,
          image: restaurant.image,
          email: restaurant.email,
          menuItems,
          reviews,
        };
      })
    );

    res.status(200).json(enrichedRestaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.favoriteRestaurant = async (req, res) => {
  const { restaurantId, customerId } = req.body;

  if (!restaurantId || !customerId) {
    return res.status(400).json({ message: "Restaurant ID and Customer ID are required" });
  }

  try {
    const existingFavorite = await Favorite.findOne({ restaurantId, customerId });

    if (existingFavorite) {
      await Favorite.deleteOne({ _id: existingFavorite._id });
      return res.status(200).json({ message: "Restaurant removed from favorites" });
    } else {
      const newFavorite = await new Favorite({ restaurantId, customerId }).save();
      return res.status(201).json({
        message: "Restaurant added to favorites",
        favoriteId: newFavorite._id,
      });
    }
  } catch (error) {
    console.error("Error processing favorite action:", error);
    return res.status(500).json({
      message: "Error processing favorite action",
      error: error.message,
    });
  }
};

// Get all restaurants for dashboard
exports.getRestaurantsDashboard = async (req, res) => {
  try {
    const restaurants = await Restaurant.find(); // Get all restaurants

    const formattedRestaurants = await Promise.all(
      restaurants.map(async (restaurant) => {
        const menuItems = await MenuItem.find({ restaurant_id: restaurant._id });
        const reviews = await Review.find({ restaurant_id: restaurant._id });

        return {
          _id: restaurant._id,
          name: restaurant.name,
          rating: restaurant.rating,
          CountRatings: reviews.length,
          deliveryFee: parseFloat(restaurant.deliveryFee).toFixed(2),
          distance: restaurant.distance,
          image: restaurant.image,
          categories: restaurant.category,
          menuItems,
          reviews
        };
      })
    );

    res.status(200).json(formattedRestaurants);
  } catch (err) {
    console.error("Dashboard error:", err);
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
      id: restaurant._id,
      name: restaurant.name,
      rating: restaurant.rating,
      deliveryFee: `$${parseFloat(restaurant.deliveryFee).toFixed(2)}`, // Format as currency
      arrivalTime: restaurant.arrivalTime,
      address: restaurant.address,
      image: restaurant.image,
      categories: restaurant.category,
      menu: menuItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        rating: item.rating,
        description: item.description,
        image: item.image,
      })),
      reviews: reviews.map((review) => ({
        id: review._id,
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

exports.getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();

    const enriched = await Promise.all(
      restaurants.map(async (restaurant) => {
        const menuItems = await MenuItem.find({ restaurant_id: restaurant._id });
        const reviews = await Review.find({ restaurant_id: restaurant._id });

        return {
          ...restaurant.toObject(), // include all restaurant fields
          menuItems,
          reviews,
        };
      })
    );

    res.status(200).json(enriched);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
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
    const { restaurantId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ error: "Invalid restaurant ID" });
    }

    // Fetch menu items associated with the restaurant

    const menuItems = await MenuItem.find({ restaurant_id: restaurantId });

    if (!menuItems.length) {
      return res.status(404).json({ message: "No menu items found for this restaurant" });
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

    const restaurantId = req.params.restaurantId; // Convert ID to integer

    const { name, ingredients, price, description, category, rating, image } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ error: "Invalid restaurant ID" });
    }

    if (!name || !price || !rating) {
      return res
        .status(400)
        .json({ error: "Name, price, and rating are required" });
    }

    // Create a new menu item

    const menuItem = await MenuItem.create({
      restaurant_id: new mongoose.Types.ObjectId(restaurantId),
      name,
      ingredients,
      price,
      description,
      category,
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
    const { restaurantProfileId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(restaurantProfileId)) {
      return res.status(400).json({ error: "Invalid restaurant profile ID" });
    }

    // Fetch orders for the given restaurantProfileId
    const orders = await Order.find({ restaurantProfileId })
      .sort({ createdAt: -1 }) // Sort descending by creation date
      .populate({
        path: "customerId", // Adjust this field name based on your schema
        select: "name email", // Only get name and email
        model: User,
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
  const { name, address, categories,city } = req.body;

  if (!mongoose.Types.ObjectId.isValid(restaurantProfileId)) {
    return res.status(400).json({ message: "Invalid restaurant ID" });
  }

  try {
    // Use Mongoose's findById
    const restaurant = await RestaurantProfile.findById(restaurantProfileId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Update fields
    restaurant.name = name || restaurant.name;
    restaurant.address = address || restaurant.address;
    restaurant.category = categories || restaurant.category;
    restaurant.city = city || restaurant.city;

    await restaurant.save();

    res.status(200).json({
      message: "Restaurant profile updated successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Error updating restaurant profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.deleteMenuItem = async (req, res) => {
  const { menuId } = req.params;

  try {
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(menuId)) {
      return res.status(400).json({ message: "Invalid menu item ID" });
    }

    // Find the menu item by ID
    const menuItem = await MenuItem.findById(menuId);

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // Delete the menu item
    await menuItem.deleteOne();

    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateRestaurantMenuItem = async (req, res) => {
  try {
    const editDishId = parseInt(req.params.editDishId, 10); // Extract menu item ID
    const { name, ingredients, price, description, category, rating, image } = req.body;

    if (isNaN(editDishId)) {
      return res.status(400).json({ error: "Invalid dish ID" });
    }

    // Find the menu item by ID
    const menuItem = await MenuItem.findByPk(editDishId);

    if (!menuItem) {
      return res.status(404).json({ error: "dish not found" });
    }

    // Update the menu item
    await menuItem.update({
      name: name || menuItem.name,
      ingredients: ingredients || menuItem.ingredients,
      price: price || menuItem.price,
      description: description || menuItem.description,
      category: category || menuItem.category,
      rating: rating || menuItem.rating,
      image: image || menuItem.image
    });

    res.status(200).json({
      message: "Menu item updated successfully",
      menuItem
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



