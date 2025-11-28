/**
 * MongoDB Connection and Database Access
 * Handles MongoDB connection and provides collection access
 */

import { MongoClient, Db, Collection } from 'mongodb';
import { Room } from '../models/Room';
import { Booking } from '../models/Booking';

let client: MongoClient;
let db: Db;

/**
 * Connect to MongoDB
 */
export async function connectMongoDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('workspace_booking');
    console.log('✅ Connected to MongoDB');
    
    // Create indexes for better performance
    await createIndexes();
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
}

/**
 * Create database indexes for performance
 */
async function createIndexes(): Promise<void> {
  try {
    const bookingsCollection = getBookingsCollection();
    const roomsCollection = getRoomsCollection();

    // Index on bookingId for fast lookups
    await bookingsCollection.createIndex({ bookingId: 1 }, { unique: true });
    
    // Index on roomId and status for conflict checks
    await bookingsCollection.createIndex({ roomId: 1, status: 1 });
    
    // Index on startTime and endTime for range queries
    await bookingsCollection.createIndex({ startTime: 1, endTime: 1 });
    
    // Index on room id
    await roomsCollection.createIndex({ id: 1 }, { unique: true });

    console.log('✅ MongoDB indexes created');
  } catch (error) {
    console.error('⚠️  Warning: Failed to create indexes:', error);
    // Don't throw - indexes might already exist
  }
}

/**
 * Get rooms collection
 */
export function getRoomsCollection(): Collection {
  if (!db) {
    throw new Error('MongoDB not connected. Call connectMongoDB() first.');
  }
  return db.collection('rooms');
}

/**
 * Get bookings collection
 */
export function getBookingsCollection(): Collection {
  if (!db) {
    throw new Error('MongoDB not connected. Call connectMongoDB() first.');
  }
  return db.collection('bookings');
}

/**
 * Close MongoDB connection
 */
export async function closeMongoDB(): Promise<void> {
  if (client) {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

/**
 * Helper: Convert MongoDB room document to Room model
 */
export function mapRoom(doc: any): Room {
  return {
    id: doc.id,
    name: doc.name,
    baseHourlyRate: typeof doc.baseHourlyRate === 'number' 
      ? doc.baseHourlyRate 
      : parseFloat(doc.baseHourlyRate),
    capacity: doc.capacity
  };
}

/**
 * Helper: Convert MongoDB booking document to Booking model
 */
export function mapBooking(doc: any): Booking {
  return {
    bookingId: doc.bookingId,
    roomId: doc.roomId,
    userName: doc.userName,
    startTime: doc.startTime instanceof Date ? doc.startTime : new Date(doc.startTime),
    endTime: doc.endTime instanceof Date ? doc.endTime : new Date(doc.endTime),
    totalPrice: typeof doc.totalPrice === 'number' 
      ? doc.totalPrice 
      : parseFloat(doc.totalPrice),
    status: doc.status as 'CONFIRMED' | 'CANCELLED',
    createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt)
  };
}

