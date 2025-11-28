/**
 * Seed Data
 * Initializes the database with sample rooms
 * Updated to use MongoDB
 */

import { getRoomsCollection } from './mongodb';
import { Room } from '../models/Room';

export async function seedRooms(): Promise<void> {
  const roomsCollection = getRoomsCollection();
  
  const rooms: Room[] = [
    {
      id: '101',
      name: 'Cabin 1',
      baseHourlyRate: 500,
      capacity: 4
    },
    {
      id: '102',
      name: 'Cabin 2',
      baseHourlyRate: 600,
      capacity: 6
    },
    {
      id: '103',
      name: 'Conference Room A',
      baseHourlyRate: 800,
      capacity: 10
    },
    {
      id: '104',
      name: 'Conference Room B',
      baseHourlyRate: 1000,
      capacity: 15
    },
    {
      id: '105',
      name: 'Meeting Pod',
      baseHourlyRate: 300,
      capacity: 2
    }
  ];

  // Check if rooms already exist
  const existingCount = await roomsCollection.countDocuments();
  
  if (existingCount === 0) {
    // Insert rooms if collection is empty
    await roomsCollection.insertMany(rooms);
    console.log(`✅ Seeded ${rooms.length} rooms`);
  } else {
    console.log(`ℹ️  Rooms already exist (${existingCount} rooms). Skipping seed.`);
  }
}
