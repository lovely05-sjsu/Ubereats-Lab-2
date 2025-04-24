import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate instead of useHistory

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate(); // useNavigate hook

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartData);
    updateSubtotal(cartData);
  }, []);

  const updateSubtotal = (cartData) => {
    let total = 0;
    cartData.forEach((item) => {
      total += item.quantity * parseFloat(item.price.replace("$", ""));
    });
    setSubtotal(total);
  };

  const handleIncrement = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateSubtotal(updatedCart);
  };

  const handleDecrement = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateSubtotal(updatedCart);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <div className="container mt-5">
       <h2 className="text-center mb-4 fw-bold text-uppercase border-bottom pb-2">
    <i className="fa fa-shopping-basket me-2 text-success"></i> Your Order
  </h2>
      <div className="row">
        {cart.map((item) => (
          <div key={item.id} className="col-md-4 col-sm-6 mb-4">
            <div className="card shadow-sm border-0">
              <img
                src={process.env.PUBLIC_URL + "/" + item.image}
                alt={item.name}
                className="card-img-top"
                style={{
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "10px 10px 0 0",
                }}
              />
              <div className="card-body text-center">
                <h5 className="card-title">{item.name}</h5>
                <p className="mb-1">
                  <strong>Price:</strong> ${item.price}
                </p>
                <p>
                  <strong>Quantity:</strong> {item.quantity}
                </p>
                <div className="d-flex justify-content-center gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => handleDecrement(item.id)}
                  >
                    -
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => handleIncrement(item.id)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subtotal & Checkout Button */}
      <div className="text-center mt-4">
        <h3 className="fw-bold">Subtotal: ${subtotal.toFixed(2)}</h3>
        <button
          className="btn btn-success btn-lg px-4 mt-2"
          onClick={handleCheckout}
        >
          <i className="fa fa-shopping-cart me-2"></i> Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
