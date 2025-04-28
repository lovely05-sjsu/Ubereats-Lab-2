import React from 'react';
import RestaurantCard from '../components/RestaurantCard';  


function Dashboard() {
  const restaurants = [
    { name: "7-Eleven", rating: 4.7, deliveryTime: "5 min", distance: "0.3 mi" },
    { name: "Chevron ExtraMile", rating: 4.5, deliveryTime: "5 min", distance: "0.3 mi" },
    // Add more restaurant objects here
  ];

  return (
    <div className="dashboard">
      <h1>Uber Eats Home</h1>
      <div className="restaurants-list">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
    ))}

      </div>
    </div>
  );
}

export default Dashboard;
