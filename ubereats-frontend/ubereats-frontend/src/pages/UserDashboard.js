import React, { useState, useEffect } from 'react';

import { Container, Card, Row, Col } from 'react-bootstrap';
import UserDashboard_TopBar from './UserDashboard_TopBar';
import RestaurantList from './RestaurantList';

const UserDashboard = () => {
        return (
            <>
            
            <UserDashboard_TopBar/>
            <RestaurantList/>
            </>
    
    );
};

export default UserDashboard;
