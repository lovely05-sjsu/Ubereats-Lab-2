import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'; // Added useDispatch
import axios from 'axios';
import '../index.css';

const RestaurantList = () => {
  const selectedCategory = useSelector((state) => state.category.selectedCategory); // Access category from Redux
  const dispatch = useDispatch(); // Initialize dispatch
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get("http://localhost:2000/api/restaurants/getRestaurantsDashboard");
        const data = response.data;

        if (selectedCategory && data) {
          if (selectedCategory === "All") {
            setRestaurants(data);
          } else {
            const filtered = data.filter((restaurant) =>
              restaurant.categories.includes(selectedCategory)
            );
            setRestaurants(filtered);
          }
        } else {
          setRestaurants(data);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [selectedCategory]);

  const handleRestaurantClick = (restaurantId) => {
    dispatch({ type: 'SET_SELECTED_RESTAURANT_ID', payload: restaurantId }); // Dispatch restaurantId to Redux
  };

  if (loading) return <p>Loading restaurants...</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 bold-heading">Restaurants Near You</h2>
      <div className="row">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="col-md-4 mb-4">
            <div className="custom-border">
              <Link
                to={`/restaurant/${restaurant.id}`}
                className="btn"
                onClick={() => handleRestaurantClick(restaurant.id)} // Call handleRestaurantClick
              >
                <div className="card">
                  <img
                    src={process.env.PUBLIC_URL + "/" + restaurant.image}
                    alt={restaurant.name}
                    className="card-img-top fixed-image"
                  />
                  <div className="card-body">
                    <h5 className="card-title bold-restaurant">{restaurant.name}</h5>
                    <p className="card-text">
                      ${restaurant.deliveryFee} Delivery Fee <br />
                      {restaurant.rating} ★ ({restaurant.CountRatings}) {restaurant.distance} mins
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
