import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Welcome to UberEats Clone</h2>
            <Row className="justify-content-center">
                {/* Customer Section */}
                <Col md={5}>
                    <Card className="mb-4">
                        <Card.Body className="text-center">
                            <h4>Customer</h4>
                            <p>Order food from your favorite restaurants.</p>
                            <Button variant="primary" onClick={() => navigate("/login")} className="me-2">
                                Login
                            </Button>
                            <Button variant="success" onClick={() => navigate("/signup")}>
                                Sign Up
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Restaurant Section */}
                <Col md={5}>
                    <Card>
                        <Card.Body className="text-center">
                            <h4>Restaurant</h4>
                            <p>Manage your restaurant and receive orders.</p>
                            <Button variant="primary" onClick={() => navigate("/restaurants/login")} className="me-2">
                                Login
                            </Button>
                            <Button variant="success" onClick={() => navigate("/restaurants/signup")}>
                                Sign Up
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;
