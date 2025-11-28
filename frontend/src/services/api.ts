/**
 * API Client
 * Handles all API calls to the backend
 */

import { Room, Booking, CreateBookingRequest, BookingResponse, RoomAnalytics } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'An error occurred');
    }

    return response.json();
  }

  // Room endpoints
  async getRooms(): Promise<Room[]> {
    return this.request<Room[]>('/rooms');
  }

  // Booking endpoints
  async createBooking(request: CreateBookingRequest): Promise<BookingResponse> {
    return this.request<BookingResponse>('/bookings', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async cancelBooking(bookingId: string): Promise<{ bookingId: string; status: string; message: string }> {
    return this.request(`/bookings/${bookingId}/cancel`, {
      method: 'POST',
    });
  }

  async getAllBookings(): Promise<Booking[]> {
    return this.request<Booking[]>('/bookings');
  }

  // Analytics endpoints
  async getAnalytics(from: string, to: string): Promise<RoomAnalytics[]> {
    return this.request<RoomAnalytics[]>(`/analytics?from=${from}&to=${to}`);
  }
}

export const api = new ApiClient();

