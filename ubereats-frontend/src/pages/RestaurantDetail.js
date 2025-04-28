import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faHeart, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { addItem } from '../redux/slices/cartSlice';
import axios from 'axios';
import "../index.css";

const notifyAdd = () => toast('🛒 Added to order!');

const notifyClear = () => toast('🔥 All items cleared as new item is from a different restaurant!');

const RestaurantDetail = () => {
  const { id } = useParams(); // Get the restaurant ID from URL params
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDelivery, setIsDelivery] = useState(true); // Toggle for delivery/pickup
  const [isFavorite, setIsFavorite] = useState(false);
  const customerId = localStorage.getItem('userId');
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`http://localhost:2000/api/restaurants/getRestaurantDetails/${id}`); // Call API
        setRestaurant(response.data); // Store response in state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [id]);

  if (loading) return <p>Loading restaurants...</p>;

  const handleFavorite = () => {
    const restaurantId = id;
    setIsFavorite((prev) => !prev);
    axios.post('http://localhost:2000/api/restaurants/favoriteRestaurant', { restaurantId, customerId })
      .then(response => {

      })
      .catch(error => {
        console.error("Error during favoriting restaurant:", error);
      })
      .finally(() => toast.success(isFavorite ? "Removed from favorites" : "Added to favorites"));
  };

  const handleAddToCart = (item) => {
    dispatch(addItem(item));
    notifyAdd();
  };

  if (!restaurant) return <div>Loading...</div>; // Display loading until restaurant data is fetched

  return (
    <div className="container mt-5">
      {/* Header Section */}
      <div className="header-section mb-4">
        <img
          src={process.env.PUBLIC_URL + "/" + restaurant.image}
          alt={restaurant.name}
          className="img-fluid"
        />
        <div className="info-section">
          <div>
            <h1 className="restaurant-name">{restaurant.name}</h1>
            <div>
              <strong>Rating:</strong> {restaurant.rating} <span role="img" aria-label="star">⭐</span>
            </div>
            <div>
              <strong>Address:</strong> {restaurant.address}
            </div>
          </div>

          <div className="py-4">
            <button
              className={`btn ${isFavorite ? "btn-danger" : "btn-outline-danger"} ms-auto`}
              onClick={handleFavorite}
            >
              <FontAwesomeIcon icon={faHeart} className="me-1" />
              {isFavorite ? " Favorited" : " Favorite"}
            </button>

          </div>


          {/* Delivery / Pickup Switch */}
          <div>
            <label htmlFor="deliverySwitch" className="mr-2">
              {isDelivery ? "Delivery" : "Pickup"}
            </label>
            <input
              type="checkbox"
              id="deliverySwitch"
              checked={isDelivery}
              onChange={() => setIsDelivery(!isDelivery)}
            />
          </div>
        </div>
      </div>

      {/* Info Section (Delivery fee and Arrival time) */}
      <div className="d-flex justify-content-between mb-4 p-3 bg-white shadow-sm rounded">
        <div>
          <strong>Delivery Fee:</strong> {restaurant.deliveryFee}
        </div>
        <div>
          <strong>Arrival Time:</strong> {restaurant.arrivalTime} mins
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-center" autoClose={5000} theme="dark" transition={Bounce} />

      {/* Menu Section */}
      <h2 className="text-center fw-bold text-uppercase border-bottom pb-2 mb-4">
        <FontAwesomeIcon icon={faUtensils} className="me-2 text-primary" /> Menu
      </h2>

      <div className="row">
        {restaurant.menu.map((item, index) => (
          <div key={index} className="col-md-4 col-sm-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <img
                src={process.env.PUBLIC_URL + "/" + item.image}
                alt={item.name}
                className="card-img-top rounded-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">{item.name}</h5>
                <p className="mb-1"><strong>Price:</strong> ${item.price}</p>
                <p className="mb-1"><strong>Rating:</strong> {item.rating} ⭐</p>
                <p className="text-muted flex-grow-1">{item.description}</p>
                <button className="btn btn-primary w-100 mt-2" onClick={() => handleAddToCart(item)}>
                  <FontAwesomeIcon icon={faCartPlus} className="me-1" /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantDetail;
