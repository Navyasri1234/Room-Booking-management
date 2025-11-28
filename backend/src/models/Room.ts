/**
 * Room Model
 * Represents a workspace/meeting room
 */
export interface Room {
  id: string;
  name: string;
  baseHourlyRate: number;
  capacity: number;
}

