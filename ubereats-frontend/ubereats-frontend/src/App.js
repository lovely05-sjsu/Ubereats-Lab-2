import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerProfile from './pages/CustomerProfile';
import RestaurantDashboard from './pages/Restaurant/Dashboard';
import RestaurantMenu from './pages/Restaurant/MenuManagment';
import RestaurantOrders from './pages/Restaurant/OrderManagment';
import RestaurantProfile from './pages/Restaurant/ProfileManagment';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { CartProvider } from './pages/context/CartContext'; 
import RestaurantAuth from './pages/Restaurant/Auth';
import CustomerAuth from './pages/CustomerAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import UserDashboard from './pages/UserDashboard';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { CategoryProvider } from './pages/context/CategoryContext';
import SignOut from './pages/SignOut';
import SidePanel from "./components/SidePanel";
import OrderConfirmation from './pages/OrderConfirmation';
import RestaurantSignOut from './pages/Restaurant/signout';
import Favorites from './pages/Favorites';
import OrdersList from './pages/OrdersList';



const App = () => {
    return (
        <CartProvider>
             <CategoryProvider>
        <Router>
            <Navbar />
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
                {/* Customer Routes */}
                <Route path="/customer/signup" element={<CustomerAuth isSignup={true} />} />
                {/* <Route path="/customer/login" element={<CustomerAuth isSignup={false} />}/> */}
                <Route path="/customer/profile" element={<ProtectedRoute><CustomerProfile /></ProtectedRoute>} />
                <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="UserDashboard" element = {<ProtectedRoute><UserDashboard/></ProtectedRoute>} />
                <Route path="/cart" element= {<ProtectedRoute><Cart/></ProtectedRoute>} />
                <Route path="/signout" element= {<ProtectedRoute><SignOut/></ProtectedRoute>} />
                {/* <Route path="/restaurants" element={<RestaurantList />} />
                <Route path="/restaurant/:id" element={<RestaurantMenu />} /> */}
                {/* <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} /> */}
                <Route path="/customer/:id" element={<CustomerProfile />} /> 
                <Route path="/restaurant/:id" element={<RestaurantDetail/>} />
                <Route path="/checkout" element={<Checkout/>} />
                <Route path="/orderconfirmation" element= {<ProtectedRoute><OrderConfirmation/></ProtectedRoute>} />
                <Route path="/Favorites" element= {<ProtectedRoute><Favorites/></ProtectedRoute>} /> 
                <Route path="/PastOrders" element= {<ProtectedRoute><OrdersList/></ProtectedRoute>} /> 
                {/* Restaurant Routes */}
                <Route path="/restaurant/signout" element={<RestaurantSignOut />} />
                <Route path="/restaurant/signup" element={<RestaurantAuth isSignup={true} />} />
                <Route path="/restaurant/login" element={<RestaurantAuth isSignup={false} />} />
                <Route path="/restaurant/:restaurantId/dashboard" element={<ProtectedRoute><RestaurantDashboard /></ProtectedRoute>} />
                <Route path="/restaurant/:restaurantId/orders" element={<ProtectedRoute><RestaurantOrders /></ProtectedRoute>} />
                <Route path="/restaurant/profile" element={<ProtectedRoute><RestaurantProfile /></ProtectedRoute>} />
                <Route path="/restaurant/:restaurantId/menu" element={<ProtectedRoute><RestaurantMenu /></ProtectedRoute>} />
                
                {/* Default Route */}
                <Route path="*" element={<h2>404 - Page Not Found</h2>} />
            </Routes>             
            <div className="relative">

                <SidePanel />

                </div>    


              <Footer/>
        </Router>
        </CategoryProvider>
        </CartProvider>
    );
};

export default App;
