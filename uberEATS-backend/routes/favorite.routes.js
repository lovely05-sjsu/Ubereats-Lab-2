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
    const favoriteRestaurants = await Favorites.findAll({
      where: { customerId },
      include: [
        {
          model: Restaurant,
          as: "restaurant",
          attributes: ["id", "name", "category", "city", "rating", "description", "deliveryFee", "address", "image", "email", "createdAt"],
        },
      ],
    });

    res.status(200).json(favoriteRestaurants.map((fav) => fav.restaurant));
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
