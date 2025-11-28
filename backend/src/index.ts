/**
 * Main Server File
 * Entry point for the workspace booking API
 * Updated to use MongoDB
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectMongoDB } from './config/mongodb';
import { seedRooms } from './config/seed';
import { errorHandler } from './middleware/errorHandler';
import bookingsRouter from './routes/bookings';
import analyticsRouter from './routes/analytics';
import roomsRouter from './routes/rooms';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Workspace Booking API is running' });
});

// API Routes
app.use('/api/bookings', bookingsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/rooms', roomsRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server with MongoDB connection
async function startServer() {
  try {
    // Connect to MongoDB
    if (process.env.MONGODB_URI) {
      await connectMongoDB();
      
      // Seed initial data (only if collection is empty)
      await seedRooms();
    } else {
      console.log('⚠️  MONGODB_URI not set. Using in-memory store.');
      console.log('   To use MongoDB, set MONGODB_URI in .env file');
    }

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  if (process.env.MONGODB_URI) {
    const { closeMongoDB } = require('./config/mongodb');
    await closeMongoDB();
  }
  process.exit(0);
});

// Start the server
startServer();
