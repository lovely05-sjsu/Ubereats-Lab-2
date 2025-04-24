// src/components/RestaurantCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/RestaurantCard.css';

const RestaurantCard = ({ restaurant }) => {
  console.log(restaurant);
  return (
    <div className="restaurant-card">
      {/* <img 
        src={restaurant.image || "McDonalds"} 
        alt={restaurant.name} 
        className="restaurant-img" 
      /> */}
      <div className="restaurant-info">
        <h3>{restaurant.name}</h3>
        <p>{restaurant.cuisine}</p>
        <span className="rating">{restaurant.rating} ⭐</span>
        <Link to={`/restaurants/${restaurant.id}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;
