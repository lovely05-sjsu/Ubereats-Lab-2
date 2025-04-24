// src/components/Navbar.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCart } from '../pages/context/CartContext'; // Import useCart hook

import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0); // State for cart item count
  const { getCartQuantity } = useCart(); // Get the cart quantity function
  const [cartQuantity, setCartQuantity] = useState(0);
  const userType = localStorage.getItem("userType");
const isRestaurantPage = userType ? userType === "restaurant" : true;
// Set true if userType is 'restaurant', otherwise false


    // Update cart quantity when cart changes
    useEffect(() => {
      setCartQuantity(getCartQuantity());
    }, [getCartQuantity]);
  

  // Close the menu when clicking outside of the side menu
  useEffect(() => {
    // Function to handle the click event
    const handleClickOutside = (event) => {
      if (
        event.target.closest(".side-menu") === null &&
        !event.target.closest(".hamburger-menu")
      ) {
        setMenuOpen(false);
      }
    };


    // Add the event listener when the component mounts
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Check if userId is present in localStorage
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId); // Set the userId state if available in localStorage
    }  
    if(localStorage.getItem("restaurantId")){
      setRestaurantId(localStorage.getItem("restaurantId"));
    }
  }, []);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="container">
        {/* UberEATS Logo (bold) */}
        <Link to="/UserDashboard"
          style={{
            position: "absolute",
            top: "5px",
            left: "60px",
            fontSize: "2.5rem", // Large size
            fontWeight: "bold",
            fontFamily: "'Arial', sans-serif",
            color: "black",
          }}
        >
          Uber EATS
        </Link>
        {/* Hamburger Menu Button (Appears Only on Home Page) */}
        <button
          className="hamburger-menu"
          onClick={() => setMenuOpen(true)}
          style={{
            position: "absolute",
            top: "5px",
            left: "20px",
            fontSize: "30px",
            background: "transparent",
            border: "none",
            color: "black",
            cursor: "pointer",
          }}
        >
          ☰
        </button>

        {/* Cart Icon */}

        {!isRestaurantPage &&
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "270px", // Adjust the positioning as needed
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <Link to="/cart" className="position-relative">
            <FontAwesomeIcon
              icon={faCartShopping}
              style={{ fontSize: "30px", color: "black" }}
            />

            {cartQuantity > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "12px" }}
              >
                {cartQuantity}
              </span>
            )}
          </Link>
        </div>
}
        {/* Side Panel (Drawer) */}
        {menuOpen && (
          <div
            className="side-menu"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "300px",
              height: "100vh",
              backgroundColor: "#FFFFFF",
              color: "black",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              zIndex: 1000,
            }}
          >
            <button
              onClick={() => setMenuOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "black",
                fontSize: "30px",
                textAlign: "right",
                cursor: "pointer",
              }}
            ></button>

            <ul style={{ listStyle: "none", padding: "10px" }}>
              {(userId || restaurantId) ? (
                <li>
                  <Link
      to={location.pathname.includes("/restaurant") ? "/restaurant/profile" : "/customer/profile"}
      className="btn btn-primary m-2"
    >
                    Profile
                  </Link>
                </li> // Show Profile link if logged in
              ) : (
                <>
                  <Link to="/login" className="btn btn-primary m-2">
                    Login
                  </Link>
                  <Link to="/signup" className="btn btn-secondary m-2">
                    Sign Up
                  </Link>
                </>
              )}
              <li>
                <Link to="/business" className="menu-link">
                  Create a business account
                </Link>
              </li>
              <li>
                <Link to="/restaurant" className="menu-link">
                  Add your restaurant
                </Link>
              </li>
              <li>
                <Link to="/deliver" className="menu-link">
                  Sign up to deliver
                </Link>
              </li>
              <li>
                <Link to="/" className="menu-link">
                  Uber Eats
                </Link>
              </li>
              <li style={{ marginTop: "20px" }}>
                There's more to love in the app.
              </li>
              <li>
                <a href="#" className="menu-link">
                  iPhone
                </a>
              </li>
              <li>
                <a href="#" className="menu-link">
                  Android
                </a>
              </li>
            </ul>
          </div>
        )}

        {/* Hamburger Menu for Mobile */}
        {/*<button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Login & Signup Buttons (Top-Right) */}
        <div
          style={{
            position: "absolute",
            top: "5px",
            right: "40px",
          }}
        >
          {(userId || restaurantId) ? (
            <>
            
            <Link
      to={location.pathname.includes("/restaurant") ? "/restaurant/profile" : "/customer/profile"}
      className="btn btn-primary m-2"
    >
              Profile
            </Link> 
            <Link
      to={location.pathname.includes("/restaurant") ? "/restaurant/signout" : "/signout"}
      className="btn btn-primary m-2"
    >
            Sign Out
          </Link> 
          </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary m-2">
                Login
              </Link>
              <Link to="/signup" className="btn btn-secondary m-2">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {( userId || restaurantId) ? (
              <>
              <li className="nav-item">
              <Link
      to={location.pathname.includes("/restaurant") ? "/restaurant/profile" : "/customer/profile"}
      className="btn btn-primary m-2"
    >
                  Profile
                </Link>{" "}
                // Show Profile link if logged in
              </li>
              <li className="nav-item">
              <Link className="nav-link" to="/signout">
              Sign Out
              </Link>{" "}
              
            </li>
            </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
