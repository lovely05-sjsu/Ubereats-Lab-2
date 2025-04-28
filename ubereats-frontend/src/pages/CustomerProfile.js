import React, { useState, useEffect } from "react";
import API from "../services/api";
import { Container, Form, Button, Card } from "react-bootstrap";
import axios from 'axios';

const CustomerProfile = () => {
    const [customer, setCustomer] = useState({
        name: "",
        email: "",
        country: "",
        state: "",
        profilePic: "",
        address: ""
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState("");
    const id = localStorage.getItem('userId') || "1";


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await API.get(`users/profile/${id}`);
                setCustomer(data);
            } catch (err) { 
                setError("Failed to load profile");
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const formData = new FormData();
            
            // Append customer fields to formData
            formData.append("name", customer.name);
            formData.append("email", customer.email);
            formData.append("address", customer.address);
            formData.append("country", customer.country);
            formData.append("state", customer.state);
    
            // If a file is selected, append it as well
            if (selectedFile) formData.append("profilePic", selectedFile);
            
            // Send PUT request with formData
            await axios.put(`http://localhost:2000/api/users/profile/${id}`, {
                name: customer.name,
                email: customer.email,
                address: customer.address,
                country: customer.country,
                state: customer.state
            }, {
                headers: {
                    'Content-Type': 'application/json'  // Ensure this header is set correctly
                }
            });
            
    
            alert("Profile updated successfully!");
        } catch (err) {
            setError("Failed to update profile");
        }
    };
    
    return (
        <Container className="mt-4">
            <Card>
                <Card.Body>
                    <h3>Customer Profile</h3>
                    {error && <p className="text-danger">{error}</p>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={customer.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={customer.email}
                                onChange={handleChange}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={customer.address}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>State</Form.Label>
                            <Form.Control
                                type="text"
                                name="state"
                                value={customer.state}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Country</Form.Label>
                            <Form.Select
                                name="country"
                                value={customer.country}
                                onChange={handleChange}
                            >
                                <option value="">Select Country</option>
                                <option value="USA">USA</option>
                                <option value="India">India</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Profile Picture</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                        </Form.Group>
                        <Button type="submit" className="mt-3">
                            Update Profile
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CustomerProfile;
