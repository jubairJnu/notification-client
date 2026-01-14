const express = require('express');
const { auth, admin } = require('../middleware/auth');
const Notification = require('../models/Notification');
const User = require('../models/User');

const router = express.Router();

// Create Notification (Admin Only)
router.post('/', auth, admin, async (req, res) => {
    try {
        const notification = new Notification({
            ...req.body,
            createdBy: req.user._id
        });
        await notification.save();

        // Real-time push logic will be triggered from the main server
        // after calling this route, or we can emit here if IO is available.
        // For simplicity, we'll return the notification and handle emission in index.js
        // by attaching io to the request or using a global emitter.
        
        req.app.get('io').to(notification.type).emit('newNotification', notification);

        res.status(201).send(notification);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Get User's Notifications
router.get('/my', auth, async (req, res) => {
    try {
        const notifications = await Notification.find({
            type: { $in: req.user.subscriptions }
        }).sort({ timestamp: -1 });
        res.send(notifications);
    } catch (e) {
        res.status(500).send();
    }
});

// Mark as Read
router.patch('/:id/read', auth, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).send();
        
        if (!notification.readBy.includes(req.user._id)) {
            notification.readBy.push(req.user._id);
            await notification.save();
        }
        res.send(notification);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;
