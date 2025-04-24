import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import { CategoryContext } from "./context/CategoryContext";
import '../index.css';



const RestaurantList = () => {
 
  const { selectedCategory } = useContext(CategoryContext);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get("http://localhost:2000/api/restaurants/getRestaurantsDashboard"); // Call API
        const data = response.data;
        console.log(data);
        console.log(selectedCategory);
        if (selectedCategory && data) {

          if(selectedCategory == "All"){
            setRestaurants(data);  
          }else{
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

  
  if (loading) return <p>Loading restaurants...</p>;

  return (
    <div className="container mt-5">
  <h2 className="mb-4 bold-heading">Restaurants Near You</h2>
  <div className="row">
    {restaurants.map((restaurant) => (
      <div key={restaurant.id} className="col-md-4 mb-4">  
        <div className="custom-border"> 
          
        <Link to={`/restaurant/${restaurant.id}`} className="btn">            
          <div className="card">
            <img
              src={process.env.PUBLIC_URL + "/" + restaurant.image}
              alt={restaurant.name}
              className="card-img-top fixed-image" // Added class
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
