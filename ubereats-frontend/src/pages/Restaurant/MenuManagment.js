import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Remove useParams
import { useSelector } from 'react-redux'; // Import useSelector
import API from '../../services/api';
import { Container, Form, Button, Card, Table } from 'react-bootstrap';

const RestaurantMenu = () => {
    const { restaurantId } = useParams();
    //const restaurantId = useSelector((state) => state.restaurant?.name || null); // Use Redux to get restaurant ID
    const navigate = useNavigate(); // Hook for navigation
    const [editDishId, setEditDishId] = useState(null);
    const [dishes, setDishes] = useState([]);
    const [newDish, setNewDish] = useState({
        name: '',
        ingredients: '',
        price: '',
        description: '',
        category: '',
        image: null
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (restaurantId) {
            fetchDishes();
        }
    }, [restaurantId]); // Add restaurantId as a dependency

    const fetchDishes = async () => {
        try {
            const { data } = await API.get(`/restaurants/${restaurantId}/menu`);
            setDishes(data);
        } catch (err) {
            setError('Failed to fetch menu');
        }
    };

    const handleChange = (e) => {
        setNewDish({ ...newDish, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setNewDish({ ...newDish, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const requestBody = {
                name: newDish.name,
                ingredients: newDish.ingredients,
                price: newDish.price,
                description: newDish.description,
                //category: newDish.category,
                image: 'images/pizzaguys/cheese_pizza.jpeg',
                rating: 5
            };

            if (editDishId) {
                await API.put(`/restaurants/menu/${editDishId}`, requestBody, {
                    headers: { 'Content-Type': 'application/json' }
                });

                alert('Dish updated successfully!');
            } else {
                await API.post(`/restaurants/${restaurantId}/menu`, requestBody, {
                    headers: { 'Content-Type': 'application/json' }
                });
                alert('Dish added successfully!');
            }

            fetchDishes();
            setNewDish({ name: '', ingredients: '', price: '', description: '', category: '', image: null });
            setEditDishId(null);
        } catch (err) {
            setError('Failed to add dish');
        }
    };

    const handleEdit = (dish) => {
        setEditDishId(dish.id);
        setNewDish({
            name: dish.name,
            ingredients: dish.ingredients,
            price: dish.price,
            description: dish.description,
            category: dish.category || '',
            image: null
        });
    };

    return (
        <Container className="mt-4">
            {/* Back to Dashboard Button */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Manage Menu</h1>
                <Button variant="dark" onClick={() => navigate(`/restaurant/${restaurantId}/dashboard`)}>
                    Back to Dashboard
                </Button>
            </div>

            {error && <p className="text-danger">{error}</p>}

            <Card>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Dish Name</Form.Label>
                            <Form.Control type="text" name="name" value={newDish.name} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Ingredients</Form.Label>
                            <Form.Control as="textarea" name="ingredients" value={newDish.ingredients} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" name="price" value={newDish.price} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" name="description" value={newDish.description} onChange={handleChange} required />
                        </Form.Group>
                        {/* <Form.Group>
                            <Form.Label>Category</Form.Label>
                            <Form.Select name="category" value={newDish.category} onChange={handleChange} required>
                                <option value="">Select Category</option>
                                <option value="Appetizer">Appetizer</option>
                                <option value="Salad">Salad</option>
                                <option value="Main Course">Main Course</option>
                                <option value="Dessert">Dessert</option>
                            </Form.Select>
                        </Form.Group> */}
                        <Form.Group>
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                        </Form.Group>
                        <Button type="submit" className="mt-3">
                            {editDishId ? 'Update Dish' : 'Add Dish'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            <Card className="mt-4">
                <Card.Body>
                    <h3>Menu Items</h3>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Dish</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dishes.map((dish) => (
                                <tr key={dish.id}>
                                    <td>{dish.name}</td>
                                    <td>{dish.description}</td>
                                    <td>${dish.price}</td>
                                    <td>
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(dish)}>
                                            Edit
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={async () => {
                                            try {
                                                await API.delete(`/restaurants/menu/${dish.id}`);
                                                fetchDishes();
                                            } catch {
                                                setError('Failed to delete dish');
                                            }
                                        }}>Delete</Button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default RestaurantMenu;
