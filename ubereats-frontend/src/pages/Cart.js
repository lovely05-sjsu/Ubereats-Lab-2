import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem } from '../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize navigate
    const cartItems = useSelector(state => state.cart.items);
    const totalAmount = useSelector(state => state.cart.totalAmount);

    const handleAddItem = (item) => {
        dispatch(addItem(item));
    };

    const handleRemoveItem = (item) => {
        dispatch(removeItem({ id: item.id }));
    };

    const handleCheckout = () => {
        navigate('/checkout'); // Redirect to the checkout page
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 fw-bold text-uppercase border-bottom pb-2">
                <i className="fa fa-shopping-basket me-2 text-success"></i> Your Order
            </h2>
            <div className="row">
                {cartItems.map((item) => (
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
                                        onClick={() => handleRemoveItem(item)}
                                    >
                                        -
                                    </button>
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() => handleAddItem(item)}
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
                <h3 className="fw-bold">Subtotal: ${Number(totalAmount).toFixed(2)}</h3>
                <button
                    className="btn btn-success btn-lg px-4 mt-2"
                    onClick={handleCheckout} // Redirect to checkout
                >
                    <i className="fa fa-shopping-cart me-2"></i> Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;
