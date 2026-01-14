const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user || !(await user.comparePassword(req.body.password))) {
            return res.status(400).send({ error: 'Invalid login credentials' });
        }
        const accessToken = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
        res.send({ 
            success: true,
            data: { 
                accessToken, 
                user: {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    subscriptions: user.subscriptions
                } 
            } 
        });
    } catch (e) {
        res.status(500).send();
    }
});

// Get profile
router.get('/me', auth, async (req, res) => {
    res.send(req.user);
});

module.exports = router;
