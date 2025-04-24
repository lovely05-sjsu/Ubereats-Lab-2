import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Container, Form, Button, Card } from 'react-bootstrap';

const CustomerAuth = ({ isSignup }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isSignup ? '/signup' : '/login';
            const { data } = await API.post(endpoint, formData);
            localStorage.setItem('customer', JSON.stringify(data));
            navigate('/dashboard');
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: '400px' }}>
                <Card.Body>
                    <h3 className="text-center">{isSignup ? 'Sign Up' : 'Login'}</h3>
                    {error && <p className="text-danger">{error}</p>}
                    <Form onSubmit={handleSubmit}>
                        {isSignup && (
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </Form.Group>
                        )}
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
                        </Form.Group>
                        <Button type="submit" className="mt-3 w-100">{isSignup ? 'Sign Up' : 'Login'}</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CustomerAuth;
