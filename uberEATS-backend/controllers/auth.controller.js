const { User, Restaurant } = require('../models');
const bcrypt = require('bcryptjs'); // Updated to bcryptjs
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.SESSION_SECRET || 'your_secret_key';

// Signup Function

const signup = async (req, res) => {
    try {
        const { name, email, password, country, state, type, address } = req.body;

        if (!name || !email || !password || !type) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = await User.create({ 
            name, 
            email, 
            password: hashedPassword, 
            type ,
            address,
            country, 
            state
        });
        if(type == "restaurant") {
            id = newUser.id
            const newRestaurant = await Restaurant.create({ id, name, email });
        }
        
        res.status(201).json({ message: 'User registered successfully!', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Signup failed', error: error.message });
    }
};

// Login Function
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find user by email
        const user = await User.findOne( { email } );

        // If user doesn't exist or password doesn't match
        // if (!user || !(await bcrypt.compare(password, user.password))) {
        //     return res.status(401).json({ error: 'Invalid credentials' });
        // }

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

        // Generate JWT Token
        const token = jwt.sign({ id: user.id, type: user.type }, JWT_SECRET, { expiresIn: '7d' });

        // Send token in HTTP-only cookie
        res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 });

        // Set session for the logged-in user
        //req.session.user = user;

        res.json({ message: 'Login successful', token , userType: user.type, userId: user.id, userEmail: user.email});

        //res.json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
};

// Logout Function
const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie('token'); // Clear session cookie
        res.status(200).json({ message: "Logged out successfully" });
    });
};

module.exports = { signup, login, logout };
