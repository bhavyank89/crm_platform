import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import db from './config/db.js';
import './config/passport.js';
import startCustomerConsumer from './kafka/consumers/customerConsumer.js';
import startOrderConsumer from './kafka/consumers/orderConsumer.js';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import customerRoutes from './routes/customer.js';
import orderRoutes from './routes/order.js';
import segmentRoutes from './routes/segment.js';
import campaignRoutes from './routes/campaign.js';
import userRoutes from './routes/user.js';
import communicationLogRoute from './routes/communicationLog.js'
import venderRoute from './routes/vender.js'

dotenv.config();
db();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: false
}));

app.use(express.json());
app.use(passport.initialize()); // ✅ Only initialize passport, no session

// ✅ DO NOT include express-session or passport.session()

// Routes
app.use('/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/campaign', campaignRoutes);
app.use('/api/user', userRoutes);
app.use('/api/communicationLog', communicationLogRoute);
app.use('/api/vender', venderRoute);

// Start server and Kafka consumers
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    try {
        await startCustomerConsumer();
        await startOrderConsumer();
        console.log("✅ Kafka consumers started successfully");
    } catch (error) {
        console.error("❌ Failed to start Kafka consumers:", error);
    }
});

process.on('SIGINT', () => {
    console.log('Received SIGINT. Shutting down gracefully...');
    process.exit();
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Shutting down gracefully...');
    process.exit();
});

export default app;
