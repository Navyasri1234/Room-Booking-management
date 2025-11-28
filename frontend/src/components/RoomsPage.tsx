/**
 * Rooms Page Component
 * Displays list of all available rooms
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Room } from '../types';
import './RoomsPage.css';

const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await api.getRooms();
      setRooms(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Loading rooms...</div>;
  }

  if (error) {
    return <div className="container error">Error: {error}</div>;
  }

  return (
    <div className="container">
      <header>
        <h1>Available Workspaces</h1>
        <nav>
          <Link to="/book">Book a Room</Link>
          <Link to="/admin">Admin View</Link>
        </nav>
      </header>

      <div className="rooms-grid">
        {rooms.map(room => (
          <div key={room.id} className="room-card">
            <h2>{room.name}</h2>
            <div className="room-details">
              <p><strong>Room ID:</strong> {room.id}</p>
              <p><strong>Base Rate:</strong> ₹{room.baseHourlyRate}/hour</p>
              <p><strong>Capacity:</strong> {room.capacity} people</p>
            </div>
            <Link to="/book" className="book-button">
              Book Now
            </Link>
          </div>
        ))}
      </div>

      <div className="info-box">
        <h3>Pricing Information</h3>
        <p><strong>Peak Hours</strong> (10 AM - 1 PM, 4 PM - 7 PM, Mon-Fri): 1.5× base rate</p>
        <p><strong>Off-Peak Hours:</strong> Base rate</p>
      </div>
    </div>
  );
};

export default RoomsPage;

