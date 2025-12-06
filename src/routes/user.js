const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const userAuth = require('../middleware/auth');

const userRouter = express.Router();

userRouter.post('/signup', async (req, res) => {
    try {
        const { name, email, password, preferences } = req.body;
        // Input validation
        if (!name || typeof name !== 'string' || name.length < 4) {
            return res.status(400).json({ message: 'Name must be at least 4 characters.' });
        }
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }
        if (!password || typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }
        if (preferences && (!Array.isArray(preferences) || !preferences.every(p => typeof p === 'string'))) {
            return res.status(400).json({ message: 'Preferences must be an array of strings.' });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: passwordHash,
            preferences
        });
        const savedUser = await newUser.save();
        console.log('User saved:', savedUser);
        const userResponse = savedUser.toObject();
        delete userResponse.password;
        const jwt_token = await jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })
        res.status(200).json({
            message: "User registered successfully",
            user: userResponse,
            token: jwt_token
        });
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
});

userRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        res.status(200).json({
            message: "User logged in successfully",
            token: token
        });
    } catch (err) {
        res.status(500).json({
            message: "Login failed",
            error: err.message
        })
    }
});

userRouter.get('/preferences', userAuth, async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            message: "User preferences fetched successfully",
            preferences: user.preferences
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to fetch user preferences",
            error: error.message
        })
    }
})

userRouter.put('/preferences', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const { preferences } = req.body

        const updatedUser = await User.findByIdAndUpdate(userId, {
            preferences: preferences
        }, {
            new: true,
            runValidators: true
        });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            message: "User preferences updated successfully",
            preferences: updatedUser.preferences
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to update user preferences",
            error: error.message
        })
    }
})

module.exports = userRouter;
