require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const authRouter = require('./routes/auth');
const notificationRouter = require('./routes/notifications');
const subscriptionRouter = require('./routes/subscriptions');
const userRouter = require('./routes/users');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // In production, specify the frontend URL
        methods: ["GET", "POST", "PATCH"]
    }
});

app.use(cors());
app.use(express.json());

// Attach io to app to use in routes
app.set('io', io);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/subscriptions', subscriptionRouter);
app.use('/api/users', userRouter);

// Socket.IO Connection Handling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join', async (userId) => {
        try {
            const user = await User.findById(userId);
            if (user) {
                // Join rooms based on subscriptions
                user.subscriptions.forEach(sub => {
                    socket.join(sub);
                    console.log(`User ${userId} joined room: ${sub}`);
                });
            }
        } catch (err) {
            console.error('Socket join error:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
