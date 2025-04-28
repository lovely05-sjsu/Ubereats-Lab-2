const express = require("express");
const { Favorites, Restaurant } = require("../models");
const router = express.Router();

// Get all favorited restaurants for a specific customer
router.get("/:customerId", async (req, res) => {
  const { customerId } = req.params;

  if (!customerId) {
    return res.status(400).json({ message: "Customer ID is required" });
  }

  try {
    // Use Mongoose's find() + populate()
    const favoriteRestaurants = await Favorites.find({ customerId }).populate({
      path: "restaurantId", // The field name inside your Favorites schema
      model: "Restaurant",
      select: "name category city rating description deliveryFee address image email createdAt"
    });

    if (!favoriteRestaurants.length) {
      return res.status(404).json({ message: "No favorite restaurants found" });
    }

    // Return restaurant details
    const formatted = favoriteRestaurants.map(fav => ({
      id: fav.restaurantId._id,
      name: fav.restaurantId.name,
      category: fav.restaurantId.category,
      city: fav.restaurantId.city,
      rating: fav.restaurantId.rating,
      description: fav.restaurantId.description,
      deliveryFee: fav.restaurantId.deliveryFee,
      address: fav.restaurantId.address,
      image: fav.restaurantId.image,
      email: fav.restaurantId.email,
      createdAt: fav.restaurantId.createdAt,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
