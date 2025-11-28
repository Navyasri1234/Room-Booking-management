/**
 * Room Service
 * Handles room-related operations
 * Updated to use MongoDB
 */

import { getRoomsCollection, mapRoom } from '../config/mongodb';
import { Room } from '../models/Room';

export class RoomService {
  /**
   * Get all rooms
   */
  async getAllRooms(): Promise<Room[]> {
    const roomsCollection = getRoomsCollection();
    const roomsDocs = await roomsCollection.find({}).toArray();
    return roomsDocs.map(doc => mapRoom(doc));
  }

  /**
   * Get room by ID
   */
  async getRoomById(roomId: string): Promise<Room | undefined> {
    const roomsCollection = getRoomsCollection();
    const roomDoc = await roomsCollection.findOne({ id: roomId });
    if (!roomDoc) return undefined;
    return mapRoom(roomDoc);
  }
}

export const roomService = new RoomService();
