/**
 * Admin View Component
 * Displays all bookings and analytics
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Booking, RoomAnalytics } from '../types';
import './AdminView.css';

const AdminView: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [analytics, setAnalytics] = useState<RoomAnalytics[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await api.getAllBookings();
      setBookings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await api.cancelBooking(bookingId);
      await loadBookings(); // Reload bookings
      if (analytics.length > 0) {
        await loadAnalytics(); // Reload analytics if already loaded
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to cancel booking');
    }
  };

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await api.getAnalytics(dateRange.from, dateRange.to);
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container">
      <header>
        <h1>Admin Dashboard</h1>
        <nav>
          <Link to="/">View Rooms</Link>
          <Link to="/book">Book a Room</Link>
        </nav>
      </header>

      {error && <div className="error-message">Error: {error}</div>}

      <section className="admin-section">
        <h2>All Bookings</h2>
        {loading ? (
          <p>Loading...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="table-container">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Room ID</th>
                  <th>User</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.bookingId}>
                    <td>{booking.bookingId}</td>
                    <td>{booking.roomId}</td>
                    <td>{booking.userName}</td>
                    <td>{formatDate(booking.startTime)}</td>
                    <td>{formatDate(booking.endTime)}</td>
                    <td>₹{booking.totalPrice}</td>
                    <td>
                      <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      {booking.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleCancel(booking.bookingId)}
                          className="cancel-button"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-section">
        <h2>Analytics</h2>
        <div className="analytics-controls">
          <div className="date-inputs">
            <div>
              <label htmlFor="from">From:</label>
              <input
                type="date"
                id="from"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="to">To:</label>
              <input
                type="date"
                id="to"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              />
            </div>
            <button onClick={loadAnalytics} className="fetch-button">
              Fetch Analytics
            </button>
          </div>
        </div>

        {analytics.length > 0 ? (
          <div className="table-container">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Room ID</th>
                  <th>Room Name</th>
                  <th>Total Hours</th>
                  <th>Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analytics.map(room => (
                  <tr key={room.roomId}>
                    <td>{room.roomId}</td>
                    <td>{room.roomName}</td>
                    <td>{room.totalHours}</td>
                    <td>₹{room.totalRevenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="info-text">Select a date range and click "Fetch Analytics" to view data.</p>
        )}
      </section>
    </div>
  );
};

export default AdminView;

