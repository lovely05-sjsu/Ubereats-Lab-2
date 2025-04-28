import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../services/api';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import OrderSummary from './OrderSummary';

const RestaurantDashboard = () => {
    const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, cancelled: 0 });
    const [error, setError] = useState('');
    const [orderDetail, setOrderDetail] = useState({});
    const { restaurantId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await API.get(`/restaurants/${restaurantId}/getRestaurantStats`);
    
            // Initialize counters for each status
            let total = data.orders ? data.orders.length : 0;
            let pending = 0;
            let completed = 0;
            let cancelled = 0;
    
            // Iterate through the data list and count each status
            if(data?.orders?.length > 0) {
                data.orders.forEach(order => {
                    if (order.orderStatus === 'Order Received' || order.orderStatus === 'Preparing' || order.orderStatus === 'On the Way' || order.orderStatus === 'Pick-up Ready') {
                        pending++;
                    } else if (order.orderStatus === 'Delivered' || order.orderStatus === 'Picked Up') {
                        completed++;
                    } else if (order.orderStatus === 'Cancelled') {
                        cancelled++;
                    }
                });
            setOrderDetail(data);
            }
            
    
            // Update state
            setStats({ total, pending, completed, cancelled });
        } catch (err) {
            setError('Failed to load stats');
        }
    };
    

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center">
                <h3>Restaurant Dashboard</h3>
                <div>
                    <Button variant="primary" className="mx-2" onClick={() => navigate(`/restaurant/${restaurantId}/orders`)}>
                        Manage Orders
                    </Button>
                    <Button variant="secondary" onClick={() => navigate(`/restaurant/${restaurantId}/menu`)}>
                        Manage Menu
                    </Button>
                </div>
            </div>

            {error && <p className="text-danger">{error}</p>}

            <Row className="mt-3">
                <Col md={3}>
                    <Card className="text-center p-3">
                        <h5>Total Orders</h5>
                        <h2>{stats.total}</h2>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center p-3 text-warning">
                        <h5>Pending Orders</h5>
                        <h2>{stats.pending}</h2>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center p-3 text-success">
                        <h5>Completed Orders</h5>
                        <h2>{stats.completed}</h2>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center p-3 text-danger">
                        <h5>Cancelled Orders</h5>
                        <h2>{stats.cancelled}</h2>
                    </Card>
                </Col>
            </Row>

            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                {Object.keys(orderDetail).length === 0 ? (
                    <p>No Orders for this restaurant......</p>
                ) : (
                    <OrderSummary orderDetail={orderDetail}  fetchStats={fetchStats}/>
                    
                )}
            </div>
        </Container>
    );
};

export default RestaurantDashboard;
