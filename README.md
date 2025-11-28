# 🚀 Workspace Booking & Pricing System

A full-stack application for booking meeting rooms by the hour with dynamic pricing, conflict detection, and analytics.

## 📋 Features

- **Room Management**: View available workspaces with base rates
- **Smart Booking**: Create bookings with automatic conflict detection
- **Dynamic Pricing**: Peak hours (10 AM-1 PM, 4 PM-7 PM, Mon-Fri) cost 1.5× base rate
- **Cancellation Policy**: Cancel bookings if >2 hours before start time
- **Admin Analytics**: Track utilization and revenue per room

## 🛠️ Tech Stack

### Backend
- Node.js + TypeScript
- Express.js
- In-memory data store (easily replaceable with database)

### Frontend
- React + TypeScript
- React Router
- CSS3

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WorkspaceBokkingPricing
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running Locally

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:3000`

2. **Start the frontend (in a new terminal)**
   ```bash
   cd frontend
   npm start
   ```
   Frontend will run on `http://localhost:3001`

3. **Access the application**
   - Open `http://localhost:3001` in your browser
   - Navigate between:
     - **Rooms Page** (`/`) - View available rooms
     - **Booking Form** (`/book`) - Create new bookings
     - **Admin View** (`/admin`) - Manage bookings and view analytics

## 📡 API Documentation

Base URL: `http://localhost:3000/api`

### 1. Get All Rooms

**GET** `/rooms`

**Response:**
```json
[
  {
    "id": "101",
    "name": "Cabin 1",
    "baseHourlyRate": 500,
    "capacity": 4
  }
]
```

### 2. Create Booking

**POST** `/bookings`

**Request Body:**
```json
{
  "roomId": "101",
  "userName": "Priya",
  "startTime": "2025-11-20T10:00:00.000Z",
  "endTime": "2025-11-20T12:30:00.000Z"
}
```

**Success Response (201):**
```json
{
  "bookingId": "b1",
  "roomId": "101",
  "userName": "Priya",
  "totalPrice": 1750,
  "status": "CONFIRMED"
}
```

**Error Responses:**
- `400` - Validation error (e.g., duration > 12 hours, start time in past)
- `409` - Conflict (room already booked)
- `404` - Room not found

### 3. Cancel Booking

**POST** `/bookings/:id/cancel`

**Success Response (200):**
```json
{
  "bookingId": "b1",
  "status": "CANCELLED",
  "message": "Booking cancelled successfully"
}
```

**Error Responses:**
- `400` - Too late to cancel (<2 hours before start) or already cancelled
- `404` - Booking not found

### 4. Get All Bookings

**GET** `/bookings`

**Response:**
```json
[
  {
    "bookingId": "b1",
    "roomId": "101",
    "userName": "Priya",
    "startTime": "2025-11-20T10:00:00.000Z",
    "endTime": "2025-11-20T12:30:00.000Z",
    "totalPrice": 1750,
    "status": "CONFIRMED",
    "createdAt": "2025-11-19T10:00:00.000Z"
  }
]
```

### 5. Get Analytics

**GET** `/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD`

**Example:**
```
GET /api/analytics?from=2025-11-01&to=2025-11-30
```

**Response:**
```json
[
  {
    "roomId": "101",
    "roomName": "Cabin 1",
    "totalHours": 15.5,
    "totalRevenue": 5250
  }
]
```

**Note:** Only includes CONFIRMED bookings (excludes CANCELLED)

## 💰 Pricing Logic

- **Peak Hours** (1.5× base rate):
  - 10:00 AM - 1:00 PM (Monday-Friday)
  - 4:00 PM - 7:00 PM (Monday-Friday)

- **Off-Peak Hours** (1× base rate):
  - All other times (including weekends)

**Example Calculation:**
- Booking: 10:00 AM - 12:30 PM (Monday)
- Base rate: ₹500/hour
- 10:00-11:00: Peak (₹500 × 1.5 = ₹750)
- 11:00-12:00: Peak (₹500 × 1.5 = ₹750)
- 12:00-12:30: Off-peak (₹500 × 0.5 = ₹250)
- **Total: ₹1,750**

## ✅ Validation Rules

### Booking Creation
- Start time must be before end time
- Duration cannot exceed 12 hours
- Start time cannot be in the past
- No overlap with existing CONFIRMED bookings
- Room must exist

### Cancellation
- Must be >2 hours before start time
- Booking must be CONFIRMED (not already cancelled)

### Analytics
- Date range: `from` ≤ `to`
- Date format: `YYYY-MM-DD`

## 🏗️ Project Structure

```
WorkspaceBokkingPricing/
├── backend/
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── models/          # Data models
│   │   ├── utils/           # Helpers (pricing, conflict, validation)
│   │   ├── middleware/      # Error handling
│   │   └── config/          # Store & seed data
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API client
│   │   └── types/           # TypeScript types
│   ├── package.json
│   └── tsconfig.json
│
├── README.md
└── ARCHITECTURE.md
```

## 🌐 Deployment

### Backend Deployment (Render/Railway/Cyclic)

1. Push code to GitHub
2. Connect repository to deployment platform
3. Set environment variables:
   - `PORT` (usually auto-assigned)
   - `NODE_ENV=production`
   - `FRONTEND_URL=<your-frontend-url>`
4. Build command: `npm run build`
5. Start command: `npm start`

### Frontend Deployment (Netlify/Vercel)

1. Push code to GitHub
2. Connect repository to deployment platform
3. Set environment variables:
   - `REACT_APP_API_URL=<your-backend-url>/api`
4. Build command: `npm run build`
5. Publish directory: `build`

## 🔧 Environment Variables

### Backend (.env)
```
PORT=3000
NODE_ENV=development
TIMEZONE=Asia/Kolkata
FRONTEND_URL=http://localhost:3001
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3000/api
```

## 📝 Notes

- **Timezone**: All times are handled in Asia/Kolkata timezone
- **Partial Hours**: Pricing is calculated by breaking bookings into hourly slots and prorating partial hours
- **Conflict Detection**: If a booking ends exactly when another starts (e.g., 11:00 AM end, 11:00 AM start), it's **allowed** (no conflict)
- **Data Persistence**: Currently uses in-memory store. For production, replace with a database (PostgreSQL, MongoDB, etc.)

## 🧪 Testing

You can test the API using curl or Postman:

```bash
# Get rooms
curl http://localhost:3000/api/rooms

# Create booking
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "101",
    "userName": "Test User",
    "startTime": "2025-11-20T10:00:00.000Z",
    "endTime": "2025-11-20T12:00:00.000Z"
  }'

# Get analytics
curl "http://localhost:3000/api/analytics?from=2025-11-01&to=2025-11-30"
```

## 📚 Additional Documentation

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed design decisions, data models, and scaling considerations.

## 👤 Author

Built as a software engineering assignment.

## 📄 License

ISC

