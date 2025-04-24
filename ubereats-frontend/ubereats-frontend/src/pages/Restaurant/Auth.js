import React, { useState } from 'react';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card } from 'react-bootstrap';

const RestaurantAuth = ({ isSignup }) => {
    const [restaurant, setRestaurant] = useState({
        name: '',
        email: '',
        password: '',
        city: '',
        description: '' // ✅ Added description field
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            localStorage.removeItem("cart");
            const endpoint = isSignup ? '/restaurants/signup' : '/restaurants/login';
            const { data } = await API.post(endpoint, restaurant);
            console.log(data);
            localStorage.setItem("token", data.token); // Save token for authentication
            localStorage.setItem("restaurantId", data.restaurantId);
            alert(isSignup ? 'Signup successful!' : 'Login successful!');
            navigate(`/restaurant/${data.restaurantId}/orders`);
            window.location.reload();
        } catch (err) {
            setError('Authentication failed. Please try again.');
        }
    };

    return (
        <Container className="mt-4">
            <Card>
                <Card.Body>
                    <h3>{isSignup ? "Restaurant Signup" : "Restaurant Login"}</h3>
                    {error && <p className="text-danger">{error}</p>}
                    <Form onSubmit={handleSubmit}>
                        {isSignup && (
                            <>
                                <Form.Group>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={restaurant.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="city"
                                        value={restaurant.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Description</Form.Label> {/* ✅ Added description */}
                                    <Form.Control
                                        as="textarea"
                                        name="description"
                                        value={restaurant.description}
                                        onChange={handleChange}
                                        rows={3}
                                        required
                                    />
                                </Form.Group>
                            </>
                        )}

                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={restaurant.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={restaurant.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Button type="submit" className="mt-3">
                            {isSignup ? "Sign Up" : "Login"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default RestaurantAuth;
