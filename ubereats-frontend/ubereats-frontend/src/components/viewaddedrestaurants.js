import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const RestaurantListDetail = () => {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:2000/api/restaurants")
            .then(response => {
                console.log("Fetched Restaurants:", response.data); // Debugging
                setRestaurants(response.data);
            })
            .catch(error => {
                console.error("Error fetching restaurants:", error);
            });
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Restaurants</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {restaurants.map((restaurant) => (
                    <Link to={`/restaurants/${restaurant.id}`} key={restaurant.id} className="bg-white shadow-lg rounded-xl p-4 hover:scale-105 transition transform">
                        <img 
                            src={`http://localhost:2000${restaurant.image}`} 
                            alt={restaurant.name} 
                            className="w-full h-40 object-cover rounded-lg mb-2" 
                        />
                        <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                        <p className="text-gray-600">{restaurant.location}</p>
                        <p className="text-sm text-gray-500">{restaurant.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RestaurantListDetail;
