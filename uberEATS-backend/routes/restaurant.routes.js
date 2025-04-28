const express = require('express');
const { deleteMenuItem, updateRestaurantProfile,GetRestaurantOrders, createRestaurantMenu,createRestaurant, getRestaurants, getRestaurantsDashboard,getRestaurantDetail,createRestaurantProfile, getRestaurantMenus,getRestaurantStats,favoriteRestaurant,updateRestaurantMenuItem } = require('../controllers/restaurant.controller');
const RestaurantProfile = require('../models/restaurantProfile');
const router = express.Router();
/*const mysql = require('mysql2/promise')*/
const bcrypt = require('bcryptjs'); 

/*const pool = mysql.createPool({
  host: 'mysql-db',
  user: 'root',
  password: 'Bhaishashank',
  database: 'ubereats_db',
});*/

// router.post("/", createRestaurant);
router.get("/getRestaurantsDashboard", getRestaurantsDashboard);
router.get("/getRestaurantDetails/:id", getRestaurantDetail);
router.get('/restaurants', getRestaurants);
router.get("/:id", getRestaurantDetail);
//router.get("/getRestaurantDetails/:id", getRestaurantDetail);
router.post('/favoriteRestaurant',favoriteRestaurant);

// router.get('/:restaurantId', getRestaurants);
router.post("/signup", createRestaurantProfile);


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt for email:", email);

  try {
    // Find a restaurant document by email
    const restaurant = await RestaurantProfile.findOne({ email: email });
    
    if (restaurant) {
      // Compare the provided password with the hashed password in the DB
      if (await bcrypt.compare(password, restaurant.password)) {
        // Save the restaurant ID in the session (assuming you have session middleware set up)
        req.session.restaurant = restaurant._id;
        res.json({ message: "Login successful", restaurantId: restaurant._id });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//   console.log(RestaurantProfile);
 // res.json({ message: "Login successful" , restaurantId: });

 /*const [rows] = await pool.execute('SELECT * FROM restaurantProfile WHERE email = ?', [email]);
    // rows.length ? rows[0] : null; 
    if(rows.length )
    {
      if ( (await bcrypt.compare(password, rows[0].password)))
      {
        req.session.restaurant = rows[0].id;
      res.json({ message: "Login successful" , restaurantId: rows[0].id});
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    }*/

  //  const restaurant = await RestaurantProfile.findOne({ where: { email } });
  //   if (restaurant && (await bcrypt.compare(password, restaurant.password))) {
  //     req.session.restaurant = restaurant;
  //     res.json({ message: "Login successful" , restaurantId: restaurant.id});
  //   } else {
  //     res.status(401).json({ error: "Invalid credentials" });
  //   }
//   const restaurant = await RestaurantProfile.findOne({ where: {email: email } });
//   if (restaurant ) {
//     req.session.restaurant = restaurant;
//     res.json({ message: "Login successful" });
//   } else {
//     res.status(401).json({ error: "Invalid credentials" });
//   }



// router.get('/', getRestaurants);
router.get('/:restaurantId/menu', getRestaurantMenus);
router.post('/:restaurantId/menu', createRestaurantMenu);
router.get('/:restaurantProfileId/orders', GetRestaurantOrders);
router.get('/:restaurantProfileId/getRestaurantStats', getRestaurantStats);
router.put("/:restaurantProfileId/profile", updateRestaurantProfile);
router.delete("/menu/:menuId",deleteMenuItem );
router.put("/menu/:editDishId", updateRestaurantMenuItem )
module.exports = router;