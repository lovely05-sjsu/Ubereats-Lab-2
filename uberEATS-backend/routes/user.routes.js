const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const { User } = require("../models");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password, type } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, type });
  res.json(user);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne( { email } );
  const isPasswordValid = await bcrypt.compare(password, user.password);
  //if (user && isPasswordValid) {
    if (user) {
    req.session.user = user;
    res.json({ message: "Login successful" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// GET customer details by ID
router.get("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await User.findById(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// PUT customer details by ID
router.put("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, country, state } = req.body; // Extract data from req.body

    // Log to verify what you're receiving
    console.log(req.params);
    console.log(req.body);  // Should show the data sent in the PUT request

    const updateData = {
      name,
      email,
      address,
      country,
      state,
    };

    // Find the customer by ID and update their details
    const customer = await User.findByIdAndUpdate(id, updateData, { new: true });
    //const customer = await User.findById(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Update customer details with the data from the request body
    //await customer.update(updateData);

    // Return the updated customer details
    res.json({ message: "Customer updated successfully", customer });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
