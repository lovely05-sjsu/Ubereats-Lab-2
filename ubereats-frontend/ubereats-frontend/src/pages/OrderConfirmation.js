import React, { useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useCart } from "./context/CartContext";

const OrderConfirmation = ({ order }) => {
    const userEmail = localStorage.getItem('userEmail');
    const customerEmail = userEmail !== null ? userEmail : "lovely@sjsu.edu";
    const { cart, updateCart } = useCart(); // Get the cart state and updateCart function
    const location = useLocation();
    const orderDetail = location.state?.orderDetail; // Get order details from navigation state
    
    updateCart([{}]);

    useEffect(() => {
    const sendEmail = async () => {
      try {
        await axios.post('http://localhost:2000/api/email/sendOrderConfirmation', {
          email: customerEmail, // Assuming you have user email
          orderDetails: orderDetail
        });
        console.log("Order confirmation email sent successfully.");
        localStorage.removeItem('cart')
        window.location.reload();
        
      } catch (error) {
        console.error("Error sending order confirmation email:", error);
      }
    };

    if (order && order.customerEmail) {
      sendEmail();

    }
  }, [order]);

     // Calculate the subtotal
const calculateSubtotal = () => {
  return orderDetail.orderDetails.items.reduce((total, item) => total + item.quantity * parseFloat(item.price), 0).toFixed(2);
};

// Calculate the tax (20% of subtotal)
const calculateTax = () => {
  return (parseFloat(calculateSubtotal()) * 0.2).toFixed(2);
};

// Calculate total
const calculateTotal = () => {
  return (parseFloat(calculateSubtotal()) + parseFloat(calculateTax())).toFixed(2);
};


  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold text-center text-green-600">
        Thank You for Your Order!
      </h2>
      <p className="text-center text-gray-700 mt-2">
        Your order has been successfully placed. A confirmation email has been
        sent to <span className="font-semibold">{customerEmail}</span>.
      </p>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
          Order Summary
        </h3>
        <ul className="divide-y divide-gray-300 mt-3">
          {orderDetail.orderDetails.items.map((item) => (
            <li key={item.id} className="flex justify-between py-3">
              <div className="flex items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-md mr-4"
                />
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${item.price}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="border-top pt-4 mt-4 text-lg font-semibold">
          <div className="d-flex justify-content-between">
            <strong>Tax:</strong>
            <span>${calculateTax()}</span>
          </div>

          <hr />

          <div className="d-flex justify-content-between">
            <strong>Subtotal:</strong>
            <span>${calculateSubtotal()}</span>
          </div>

          <hr />

          <div className="d-flex justify-content-between fs-5 fw-bold">
            <strong>Total:</strong>
            <span>${calculateTotal()}</span>
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          We appreciate your business! Your delicious meal is on the way. 🚀
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmation;
