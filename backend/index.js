import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import db from './config/db.js';
import './config/passport.js';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Routes
import authRoutes from './routes/auth.js';
import customerRoutes from './routes/customer.js';
import orderRoutes from './routes/order.js';
import segmentRoutes from './routes/segment.js';
import campaignRoutes from './routes/campaign.js';
import userRoutes from './routes/user.js';
import communicationLogRoute from './routes/communicationLog.js';
import venderRoute from './routes/vender.js';

dotenv.config();
db();

const app = express();
const PORT = process.env.PORT || 5000; // ✅ Uses .env PORT (default fallback to 5000)

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(passport.initialize()); // ✅ Only use initialize (no session needed)

// API Routes
app.use('/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/campaign', campaignRoutes);
app.use('/api/user', userRoutes);
app.use('/api/communicationLog', communicationLogRoute);
app.use('/api/vender', venderRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: {
            message: 'Route not found',
            status: 404
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    // Optional: Start Kafka consumers
    // try {
    //     await startCustomerConsumer();
    //     await startOrderConsumer();
    //     console.log("✅ Kafka consumers started successfully");
    // } catch (error) {
    //     console.error("❌ Kafka consumer startup failed:", error);
    // }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT. Shutting down...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM. Shutting down...');
    process.exit(0);
});

export default app;
