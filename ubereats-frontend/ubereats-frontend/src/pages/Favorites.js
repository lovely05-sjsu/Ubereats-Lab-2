import React, { useEffect, useState } from "react";
import axios from "axios";

const Favorites = ({ }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const customerId = localStorage.getItem('userId');

  useEffect(() => {
    if (!customerId) return;

    axios
      .get(`http://localhost:2000/api/favorites/${customerId}`)
      .then((response) => {
        setFavorites(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching favorites:", error);
        setLoading(false);
      });
  }, [customerId]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 fw-bold border-bottom pb-2 bg-light rounded shadow-sm p-3">
  <span className="text-primary fs-1">
    <i className="fas fa-utensils me-2"></i>Your Favorite Restaurants
  </span>
</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : favorites.length > 0 ? (
        <div className="row">
          {favorites.map((restaurant) => (
            <div key={restaurant.id} className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <img
                  src={restaurant.image}
                  className="card-img-top"
                  alt={restaurant.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{restaurant.name}</h5>
                  <p className="text-muted">{restaurant.category} - {restaurant.city}</p>
                  <p className="card-text">{restaurant.description}</p>
                  <p className="fw-bold">
                    Rating: <span className="text-warning">{restaurant.rating} ⭐</span>
                  </p>
                  <p className="text-muted">Delivery Fee: ${restaurant.deliveryFee}</p>
                  <p className="text-muted">
                    <i className="bi bi-geo-alt-fill"></i> {restaurant.address}
                  </p>
                  <a href={`mailto:${restaurant.email}`} className="btn btn-primary">
                    Contact Restaurant
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted">No favorite restaurants added yet.</p>
      )}
    </div>
  );
};

export default Favorites;
