import React, { useState, useEffect } from "react";
import API from "../../services/api";

const OrderSummary = ({ orderDetail, fetchStats }) => {
  const [status, setStatus] = useState("");
  const [noOrder, setNoOrder] = useState(false);

  console.log(orderDetail);

  if (!orderDetail || !orderDetail.orders || orderDetail.orders.length === 0) {
    return <p className="text-center text-gray-600">No order details available.</p>;
  }

  const receivedOrders = orderDetail.orders?.filter(order => order.orderStatus === "Order Received") || [];
  const receivedOrdersCount = receivedOrders.length;
  const order = receivedOrders[0] || {}; 

  // ✅ Move state update inside useEffect to prevent infinite loop
  useEffect(() => {
    if (receivedOrders.length === 0) {
      setStatus("Completed");
      setNoOrder(true);
    }
  }, [receivedOrders.length]);

  // Function to handle complete order
  const handleCompleteOrder = async () => {
    try {
      const { id } = order;
      const newStatus = "Preparing";
      const response = await API.put(`/orders/${id}/status`, { status: newStatus });

      if (response.status === 200) {
        alert("Order Accepted!");
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Function to handle cancel order
  const handleCancelOrder = async () => {
    try {
      const { id } = order;
      const newStatus = "Cancelled";
      const response = await API.put(`/orders/${id}/status`, { status: newStatus });

      if (response.status === 200) {
        alert("Order Cancelled!");
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6">
      {status === "Completed" ? (
        <div>No Orders in queue..</div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-black mb-4">Order(s)</h2>
          <p className="text-gray-700 text-md mb-4">
            Orders in queue: <strong>{receivedOrdersCount}</strong>
          </p>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-black">
              Mode: <strong>Delivery</strong>
            </h3>
          </div>

          <h3 className="text-lg font-semibold text-black mt-6">
            Order Summary
          </h3>
          <ul className="divide-y divide-gray-200">
            {order.items?.map((item) => (
              <li key={item.id} className="flex justify-between items-center py-4">
                <div className="flex items-center">
                  <img
                    src={`http://localhost:3000/${item.image}`}
                    alt={item.name}
                    className="w-16 h-16 rounded-md mr-4 object-cover"
                  />
                  <div>
                    <p className="text-black font-medium">{item.name}</p>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-700 font-medium">Qty: {item.quantity}</p>
                  <p className="text-gray-900 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Show total only if items exist */}
          {order?.items?.length > 0 && (
            <div className="border-t border-gray-200 mt-6 pt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>
                $
                {order.items
                  .reduce((total, item) => total + item.price * item.quantity, 0)
                  .toFixed(2)}
              </span>
            </div>
          )}

          {/* Complete Order Button */}
          <button
            onClick={handleCompleteOrder}
            className="w-full bg-green-500 text-white py-3 rounded-md text-lg font-semibold mb-2"
          >
            Accept Order
          </button>

          {/* Cancel Order Button */}
          <button
            onClick={handleCancelOrder}
            className="w-full bg-red-500 text-white py-3 rounded-md text-lg font-semibold mb-2"
          >
            Cancel Order
          </button>
        </>
      )}
    </div>
  );
};

export default OrderSummary;

