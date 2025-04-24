import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { Container, Form, Button, Card } from 'react-bootstrap';

const RestaurantProfile = () => {
    const navigate = useNavigate(); // Hook for navigation
    const [restaurantId, setRestaurantId] = useState(localStorage.getItem("restaurantId"));
    
    const [restaurant, setRestaurant] = useState({
        name: '',
        address: '',
        categories: '',
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            if (!restaurantId) {
                setError("Restaurant ID not found!");
                return;
            }
            try {
                const { data } = await API.get(`/restaurants/${restaurantId}`);
                setRestaurant(data);
            } catch (err) {
                setError('Failed to load profile');
            }
        };
        fetchProfile();
    }, [restaurantId]);

    const handleChange = (e) => {
        setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: restaurant.name,
                address: restaurant.address,
                categories: restaurant.categories,
            };
    
            await API.put(`/restaurants/${restaurantId}/profile`, payload, {
                headers: { 'Content-Type': 'application/json' }
            });
    
            alert('Profile updated successfully!');
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    return (
        <Container className="mt-4">
            
            <Button variant="primary" onClick={() => navigate(`/restaurant/${restaurantId}/dashboard`)} className="mb-3">
                Go to Dashboard
            </Button>

            <Card>
                <Card.Body>
                    <h3>Restaurant Profile</h3>
                    {error && <p className="text-danger">{error}</p>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" value={restaurant.name} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Location</Form.Label>
                            <Form.Control type="text" name="address" value={restaurant.address} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" name="categories" value={restaurant.categories} onChange={handleChange} required />
                        </Form.Group>
                        <Button type="submit" className="mt-3">Update Profile</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default RestaurantProfile;
