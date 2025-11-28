/**
 * Booking Form Component
 * Allows users to create new bookings
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Room, BookingResponse } from '../types';
import './BookingForm.css';

const BookingForm: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [formData, setFormData] = useState({
    roomId: '',
    userName: '',
    startTime: '',
    endTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BookingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await api.getRooms();
      setRooms(data);
      if (data.length > 0 && !formData.roomId) {
        setFormData(prev => ({ ...prev, roomId: data[0].id }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rooms');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const booking = await api.createBooking(formData);
      setResult(booking);
      // Reset form
      setFormData({
        roomId: formData.roomId,
        userName: '',
        startTime: '',
        endTime: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container">
      <header>
        <h1>Book a Workspace</h1>
        <nav>
          <Link to="/">View Rooms</Link>
          <Link to="/admin">Admin View</Link>
        </nav>
      </header>

      <div className="booking-form-container">
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="roomId">Room *</label>
            <select
              id="roomId"
              name="roomId"
              value={formData.roomId}
              onChange={handleChange}
              required
            >
              <option value="">Select a room</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.name} (₹{room.baseHourlyRate}/hr)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="userName">Your Name *</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="startTime">Start Time *</label>
            <input
              type="datetime-local"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endTime">End Time *</label>
            <input
              type="datetime-local"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Booking...' : 'Create Booking'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="success-message">
            <h3>Booking Confirmed!</h3>
            <div className="booking-details">
              <p><strong>Booking ID:</strong> {result.bookingId}</p>
              <p><strong>Room ID:</strong> {result.roomId}</p>
              <p><strong>User:</strong> {result.userName}</p>
              <p><strong>Total Price:</strong> ₹{result.totalPrice}</p>
              <p><strong>Status:</strong> {result.status}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;

