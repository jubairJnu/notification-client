const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Subscribe to categories
router.post('/subscribe', auth, async (req, res) => {
    try {
        const { categories } = req.body; // Array of categories
        req.user.subscriptions = categories;
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Get user subscriptions
router.get('/', auth, async (req, res) => {
    res.send(req.user.subscriptions);
});

module.exports = router;
