// src/pages/Home.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddressModal from './AddressModal';

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);    
  const [showModal, setShowModal] = useState(true);
  const [userAddress, setUserAddress] = useState("");
  const userEmail = localStorage.getItem("userEmail");


  return (
    <div
      className="home-page"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/image2.jpg)`, // Replace with your image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden', // Prevent scrolling
        position: 'relative',
      }}
    >
      {/* Hamburger Menu Button (Appears Only on Home Page) */}
      {/* <button
        className="hamburger-menu"
        onClick={() => setMenuOpen(true)}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          fontSize: '30px',
          background: 'transparent',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        ☰
      </button> */}

      {/* Side Panel (Drawer) */}
      {menuOpen && (
        <div
          className="side-menu"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '300px',
            height: '100vh',
            backgroundColor: '#fdf4e3',
            color: 'white',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
          }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '30px',
              textAlign: 'right',
              cursor: 'pointer',
            }}
          >
            ✖
          </button>

          <ul style={{ listStyle: 'none', padding: '10px' }}>
          {!userEmail && (
            <>
            <li><Link to="/signup" className="menu-link">Sign up</Link></li>
            <li><Link to="/login" className="menu-link">Log in</Link></li>
            </>
          )}
          {userEmail && (
            <>
            <li><Link to="/signup" className="menu-link">Favorites</Link></li>
            <li><Link to="/login" className="menu-link">Your Past Orders</Link></li>
            </>
          )}
            <li><Link to="/business" className="menu-link">Create a business account</Link></li>
            <li><Link to="/restaurant" className="menu-link">Add your restaurant</Link></li>
            <li><Link to="/deliver" className="menu-link">Sign up to deliver</Link></li>
            <li><Link to="/" className="menu-link">Uber Eats</Link></li>
            <li style={{ marginTop: '20px' }}>There's more to love in the app.</li>
            <li><a href="#" className="menu-link">iPhone</a></li>
            <li><a href="#" className="menu-link">Android</a></li>
          </ul>
        </div>
      )}

      {/* UberEATS Logo on Image (Top-Left) */}
    {/*} <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '40px',
          fontSize: '2.5rem', // Large size
          fontWeight: 'bold',
          fontFamily: "'Arial', sans-serif",
          color: 'white',
        }}
      >
        UberEATS
      </div>

      {/* Login & Signup Buttons (Top-Right) */}
      {/*<div
        style={{
          position: 'absolute',
          top: '20px',
          right: '40px',
        }}
      >
        <Link to="/login" className="btn btn-primary m-2">
          Login
        </Link>
        <Link to="/signup" className="btn btn-secondary m-2">
          Sign Up
        </Link>
      </div>

      {/* Centered Content */}
      <div
        style={{
          position: 'absolute',
          top: '40%', // Adjusted for better placement
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'black',
        }}
      >
        <h1
          style={{
            fontWeight: 'bold',
            fontSize: '4rem', // Large title font
            fontFamily: "'Arial', sans-serif",
          }}
        >
          Welcome to UberEATS
        </h1>

        <p
          style={{
            fontWeight: 'bold',
            fontSize: '2rem', // Smaller than title
            fontFamily: "'Arial', sans-serif",
            marginBottom: '2rem',
          }}
        >
          Order from the best restaurants near you!
        </p>

        {/* Browse Restaurants Button */}
        <Link to="/restaurants" className="btn btn-success btn-lg m-2">
          Browse Restaurants
        </Link>
        
        <div className="container mt-5">          
          <p><strong>Delivery Address:</strong> {userAddress || "Not set"}</p>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Change Address
        </button>

          {showModal && (
            <AddressModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              onSave={(address) => setUserAddress(address)}
            />
          )}
        </div>

        {/* Sign Up Link beside Browse Restaurants */}
        <p className="mt-4">
        Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#0000FF', fontWeight: 'bold' }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Home;
