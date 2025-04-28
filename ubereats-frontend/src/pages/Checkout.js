import React, { useState, useEffect } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector
import { clearCart } from '../redux/slices/cartSlice'; // Import clearCart action

const notifyOrder = () => toast('Order successfully placed!');

const Checkout = () => {
  const [address, setAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [isDelivery, setIsDelivery] = useState(true);
  const userId = JSON.parse(localStorage.getItem('userId')) || 0;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch cart data from Redux store
  const cartItems = useSelector(state => state.cart.items);
  const totalAmount = useSelector(state => state.cart.totalAmount);
  const restaurantId = useSelector(state => state.restaurant.id);

  // Calculate the tax (20% of subtotal)
  const calculateTax = () => {
    return (totalAmount * 0.2).toFixed(2);
  };

  // Handle placing an order
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast("Cart is empty. Please add items before placing an order.");
      return;
    }

    const order = {
      restaurantId: restaurantId,
      restaurantProfileId: restaurantId,
      customerId: userId,
      orderStatus: 'Order Received',
      items: cartItems,
      address,
      deliveryInstructions,
      isDelivery      
    };

    try {
      const response = await axios.post('http://localhost:2000/api/orders/saveOrder', order);
      
      if (response.status === 201) {
        notifyOrder();
        console.log('Order Placed Successfully:', response.data);

        // Clear the cart in Redux state
        dispatch(clearCart());

        // Redirect to OrderConfirmation and pass order details as state
        navigate('/OrderConfirmation', { state: { orderDetail: response.data } });     
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Left Section */}
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h3 className="mb-4">Delivery / Pickup Information</h3>

            {/* Delivery / Pickup Toggle */}
            <div className="mb-3 d-flex align-items-center">
              <label className="me-2 fw-bold">Choose Delivery Type:</label>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="deliveryToggle"
                  checked={isDelivery}
                  onChange={() => setIsDelivery(!isDelivery)}
                />
                <label className="form-check-label ms-2" htmlFor="deliveryToggle">
                  <i className={`fa ${isDelivery ? "fa-truck" : "fa-store"} me-1`}></i>
                  {isDelivery ? "Delivery" : "Pickup"}
                </label>
              </div>
            </div>

            {/* Address Section */}
            {isDelivery && (
              <div className="mb-3">
                <label className="fw-bold">Address:</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter delivery address"
                  />
                  <button className="btn btn-outline-secondary" onClick={() => setAddress("")}>
                    <i className="fa fa-edit"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Delivery Instructions Section */}
            {isDelivery && (
              <div className="mb-3">
                <label className="fw-bold">Delivery Instructions:</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="Any special instructions?"
                ></textarea>
                <button className="btn btn-outline-secondary mt-2" onClick={() => setDeliveryInstructions("")}>
                  <i className="fa fa-edit"></i> Edit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Order Summary */}
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h3 className="mb-4">Order Summary</h3>
            <ul className="list-group mb-3">
              {cartItems.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{item.name} x {item.quantity}</span>
                  <span className="fw-bold">${(item.quantity * parseFloat(item.price)).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="d-flex justify-content-between">
              <strong>Tax:</strong>
              <span>${calculateTax()}</span>
            </div>

            <div className="d-flex justify-content-between">
              <strong>Subtotal:</strong>
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between fs-5 fw-bold">
              <strong>Total:</strong>
              <span>${(parseFloat(totalAmount) + parseFloat(calculateTax())).toFixed(2)}</span>
            </div>

            <button className="btn btn-primary w-100 mt-3" onClick={handlePlaceOrder}>
              <i className="fa fa-shopping-cart me-2"></i> Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
