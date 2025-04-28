// components/OrdersList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from "react-bootstrap";

import '../styles/PastOrders.css' ;
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


const OrdersList = ({ }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const customerId = localStorage.getItem('userId');

  useEffect(() => {
    // Fetch orders from the API
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:2000/api/orders/pastOrders/${customerId}`)
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-4">
  <div className="row">
    {orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort orders by createdAt in descending order
      .map((order) => (
        <div key={order.id} className="col-md-6 col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title d-flex justify-content-between">
                <span>Order ID: {order.id}</span>
                <span className={`badge ${order.orderStatus === 'Delivered' ? 'bg-success' : 'bg-warning'}`}>{order.orderStatus}</span>
              </h5>
              <p className="card-text">
                <i className="fas fa-truck"></i> Delivery: {order.isDelivery ? 'Yes' : 'No'}
              </p>
              <p className="card-text">
                <i className="fas fa-map-marker-alt"></i> Address: {order.address || 'No address provided'}
              </p>
              <p className="card-text">
                <i className="fas fa-calendar-day"></i> Order Date: {new Date(order.createdAt).toLocaleString()}
              </p>

              <div className="order-items mt-3">
                <h6 className="mb-2">Items:</h6>
                <ul className="list-unstyled">
                  {order.items.map((item) => (
                    <li key={item.id} className="d-flex align-items-center mb-3">
                      <img src={item.image} alt={item.name} className="img-thumbnail" width={50} />
                      <div className="ms-3">
                        <p className="mb-1 fw-bold">{item.name}</p>
                        <p className="text-muted mb-2">{item.description}</p>
                        <p className="mb-1"><i className="fas fa-dollar-sign"></i> {item.price}</p>
                        <p className="text-muted">Quantity: {item.quantity}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ))}
  </div>
</div>


  );

};

export default OrdersList;
