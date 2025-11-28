# 🎓 Complete Project Guide - For Beginners

## 📚 Table of Contents
1. [Project Overview](#project-overview)
2. [What is TypeScript?](#what-is-typescript)
3. [What is React?](#what-is-react)
4. [What are React Hooks?](#what-are-react-hooks)
5. [Project Architecture](#project-architecture)
6. [Complete Flow: User Books a Room](#complete-flow-user-books-a-room)
7. [Backend Deep Dive](#backend-deep-dive)
8. [Frontend Deep Dive](#frontend-deep-dive)
9. [Function Call Chains](#function-call-chains)
10. [Key Concepts Explained](#key-concepts-explained)

---

# Project Overview

## What We Built
A **Workspace Booking System** where users can:
- View available meeting rooms
- Book rooms by selecting date/time
- Cancel bookings (if >2 hours before start)
- View analytics (admin)

## Tech Stack
- **Backend**: Node.js + TypeScript + Express
- **Frontend**: React + TypeScript
- **Database**: MongoDB (or in-memory for demo)

---

# What is TypeScript?

## Simple Explanation
**TypeScript = JavaScript + Types**

### JavaScript (What you might know)
```javascript
let name = "John";
let age = 25;
```
- Variables can hold any type
- No checking if you use wrong type
- Errors only show at runtime

### TypeScript (Better version)
```typescript
let name: string = "John";  // Must be string
let age: number = 25;      // Must be number
```
- You declare what type each variable is
- Catches errors before running code
- Better IDE support (autocomplete, hints)

## Why Use TypeScript?

### 1. **Catch Errors Early**
```typescript
// JavaScript - Error at runtime
function add(a, b) {
  return a + b;
}
add(5, "hello"); // Returns "5hello" (wrong!)

// TypeScript - Error before running
function add(a: number, b: number): number {
  return a + b;
}
add(5, "hello"); // ❌ Error: "hello" is not a number
```

### 2. **Better Code Completion**
```typescript
interface Room {
  id: string;
  name: string;
  baseHourlyRate: number;
}

const room: Room = { id: "101", name: "Cabin 1", baseHourlyRate: 500 };
room. // IDE shows: id, name, baseHourlyRate (autocomplete!)
```

### 3. **Self-Documenting Code**
```typescript
// You know exactly what this function expects
function createBooking(
  roomId: string,      // Must be string
  userName: string,     // Must be string
  startTime: Date       // Must be Date object
): BookingResponse {   // Returns BookingResponse
  // ...
}
```

## TypeScript in Our Project

### Example: Room Model
```typescript
// backend/src/models/Room.ts
export interface Room {
  id: string;              // Room ID is always a string
  name: string;            // Name is always a string
  baseHourlyRate: number;  // Price is always a number
  capacity: number;        // Capacity is always a number
}
```

**Why this helps:**
- If you try `room.id = 123` (number), TypeScript says "Error! id must be string"
- IDE shows all available properties when you type `room.`
- Prevents bugs before code runs

---

# What is React?

## Simple Explanation
**React = JavaScript library for building user interfaces**

### Traditional HTML/JavaScript
```html
<!-- Old way - mixing HTML and JavaScript -->
<div id="app"></div>
<script>
  document.getElementById("app").innerHTML = "<h1>Hello</h1>";
</script>
```

### React Way
```jsx
// Modern way - components
function App() {
  return <h1>Hello</h1>;
}
```

## Key React Concepts

### 1. **Components** (Building Blocks)
Think of components like LEGO blocks:
- Each component is a reusable piece
- Combine components to build the app

```jsx
// Component = Function that returns JSX (HTML-like code)
function RoomsPage() {
  return <div>List of rooms</div>;
}

function BookingForm() {
  return <form>Booking form</form>;
}

// Combine them
function App() {
  return (
    <div>
      <RoomsPage />
      <BookingForm />
    </div>
  );
}
```

### 2. **JSX** (JavaScript XML)
JSX lets you write HTML inside JavaScript:
```jsx
// This looks like HTML but it's JavaScript
const element = <h1>Hello, World!</h1>;

// You can use variables
const name = "John";
const element = <h1>Hello, {name}!</h1>; // Hello, John!
```

### 3. **Props** (Passing Data)
Props = Properties (data passed to components)
```jsx
// Parent component
function App() {
  const roomName = "Cabin 1";
  return <RoomCard name={roomName} />; // Pass name as prop
}

// Child component receives prop
function RoomCard({ name }) {
  return <div>Room: {name}</div>; // Room: Cabin 1
}
```

---

# What are React Hooks?

## Simple Explanation
**Hooks = Special functions that let you "hook into" React features**

Think of hooks as tools that give your component superpowers:
- `useState`: Remember data (like a memory)
- `useEffect`: Do something after render (like a timer)
- `useContext`: Share data between components

## useState Hook

### What it does
**Stores data that can change, and re-renders component when it changes**

### Simple Example
```jsx
function Counter() {
  // useState returns [value, setter function]
  const [count, setCount] = useState(0);
  // count = current value (0)
  // setCount = function to update count

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

**How it works:**
1. `useState(0)` creates state with initial value 0
2. `count` holds the current value
3. `setCount(newValue)` updates the value
4. When `setCount` is called, React re-renders the component

### In Our Project
```typescript
// BookingForm.tsx
const [formData, setFormData] = useState({
  roomId: '',
  userName: '',
  startTime: '',
  endTime: ''
});

// When user types in input:
<input 
  value={formData.userName}
  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
/>
```

**Flow:**
1. User types "John" in input
2. `onChange` fires → calls `setFormData`
3. `formData.userName` updates to "John"
4. React re-renders → input shows "John"

## useEffect Hook

### What it does
**Runs code after component renders (like "on mount" or "when something changes")**

### Simple Example
```jsx
function RoomsPage() {
  const [rooms, setRooms] = useState([]);

  // Run this code once when component first renders
  useEffect(() => {
    fetch('/api/rooms')
      .then(res => res.json())
      .then(data => setRooms(data));
  }, []); // Empty array = run only once

  return <div>{rooms.map(room => <div>{room.name}</div>)}</div>;
}
```

**How it works:**
1. Component renders
2. `useEffect` runs after render
3. Fetches data from API
4. Updates state with `setRooms`
5. Component re-renders with new data

### In Our Project
```typescript
// BookingForm.tsx
useEffect(() => {
  loadRooms(); // Call function when component mounts
}, []); // Empty array = run only once

const loadRooms = async () => {
  const data = await api.getRooms();
  setRooms(data); // Update rooms state
};
```

**Flow:**
1. BookingForm component mounts (appears on screen)
2. `useEffect` runs → calls `loadRooms()`
3. `loadRooms()` fetches rooms from API
4. `setRooms(data)` updates state
5. Component re-renders → dropdown shows rooms

## Other Common Hooks

### useCallback
Memoizes a function (keeps same function reference)

### useMemo
Memoizes a value (computes only when dependencies change)

### useContext
Accesses context (shared data without props)

---

# Project Architecture

## Folder Structure
```
WorkspaceBokkingPricing/
├── backend/              # Server-side code
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── services/   # Business logic
│   │   ├── models/      # Data structures
│   │   ├── utils/       # Helper functions
│   │   └── config/      # Database setup
│   └── package.json
│
└── frontend/            # Client-side code
    ├── src/
    │   ├── components/  # React components
    │   ├── services/    # API client
    │   └── types/       # TypeScript types
    └── package.json
```

## How Frontend and Backend Communicate

```
User Action (Click Button)
    ↓
Frontend (React)
    ↓
API Call (HTTP Request)
    ↓
Backend (Express Server)
    ↓
Business Logic (Services)
    ↓
Database (MongoDB)
    ↓
Response (JSON)
    ↓
Frontend Updates UI
```

---

# Complete Flow: User Books a Room

## Step-by-Step Journey

### Step 1: User Opens Booking Page

**Frontend: BookingForm.tsx**

```typescript
// Component renders
const BookingForm: React.FC = () => {
  // State initialized
  const [rooms, setRooms] = useState<Room[]>([]);
  const [formData, setFormData] = useState({...});
  
  // useEffect runs when component mounts
  useEffect(() => {
    loadRooms(); // Fetch rooms from API
  }, []);
```

**What happens:**
1. React renders BookingForm component
2. `useState` creates empty arrays/objects
3. `useEffect` runs → calls `loadRooms()`

---

### Step 2: Load Rooms from API

**Function Call Chain:**

```
loadRooms()
  ↓
api.getRooms()
  ↓
HTTP GET /api/rooms
  ↓
Backend: roomsRouter.get('/')
  ↓
roomService.getAllRooms()
  ↓
MongoDB: getRoomsCollection().find({})
  ↓
Returns: Array of rooms
```

**Code Flow:**

**Frontend: services/api.ts**
```typescript
async getRooms(): Promise<Room[]> {
  // Makes HTTP request
  const response = await fetch(`${API_URL}/rooms`);
  return response.json(); // Converts JSON to JavaScript object
}
```

**Backend: routes/rooms.ts**
```typescript
router.get('/', async (req, res) => {
  const rooms = await roomService.getAllRooms(); // Call service
  res.json(rooms); // Send JSON response
});
```

**Backend: services/roomService.ts**
```typescript
async getAllRooms(): Promise<Room[]> {
  const roomsCollection = getRoomsCollection(); // Get MongoDB collection
  const roomsDocs = await roomsCollection.find({}).toArray(); // Query database
  return roomsDocs.map(doc => mapRoom(doc)); // Convert to Room objects
}
```

**Result:**
- Rooms array returned to frontend
- `setRooms(data)` updates state
- Dropdown shows available rooms

---

### Step 3: User Fills Form

**User Actions:**
1. Selects room from dropdown
2. Types name: "Priya"
3. Selects start time: "2025-11-20T10:00"
4. Selects end time: "2025-11-20T12:00"

**What Happens:**

```typescript
// Each input has onChange handler
<input 
  name="userName"
  value={formData.userName}
  onChange={handleChange}  // Called on every keystroke
/>

// handleChange function
const handleChange = (e) => {
  setFormData({
    ...formData,                    // Keep existing values
    [e.target.name]: e.target.value // Update changed field
  });
};
```

**State Updates:**
```
Initial: { roomId: '', userName: '', startTime: '', endTime: '' }
  ↓ User types "P"
{ roomId: '', userName: 'P', startTime: '', endTime: '' }
  ↓ User types "r"
{ roomId: '', userName: 'Pr', startTime: '', endTime: '' }
  ↓ ... continues
Final: { roomId: '101', userName: 'Priya', startTime: '2025-11-20T10:00', endTime: '2025-11-20T12:00' }
```

---

### Step 4: User Clicks "Create Booking"

**Function Call Chain:**

```
User clicks button
  ↓
handleSubmit(e)
  ↓
e.preventDefault() (stops page refresh)
  ↓
setLoading(true) (shows "Booking..." text)
  ↓
api.createBooking(formData)
  ↓
HTTP POST /api/bookings
  ↓
Backend: bookingsRouter.post('/')
  ↓
bookingService.createBooking(request)
  ↓
[Validation, Conflict Check, Price Calculation]
  ↓
MongoDB: insertOne(booking)
  ↓
Returns: BookingResponse
  ↓
Frontend: setResult(booking)
  ↓
UI shows success message
```

**Detailed Code Flow:**

**Frontend: BookingForm.tsx**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault(); // Don't refresh page
  setLoading(true);   // Show loading state
  
  try {
    // Call API
    const booking = await api.createBooking(formData);
    setResult(booking); // Show success message
  } catch (err) {
    setError(err.message); // Show error message
  } finally {
    setLoading(false); // Hide loading
  }
};
```

**Frontend: services/api.ts**
```typescript
async createBooking(request: CreateBookingRequest): Promise<BookingResponse> {
  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request) // Convert object to JSON string
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error); // Throw error if request failed
  }
  
  return response.json(); // Return booking response
}
```

**Backend: routes/bookings.ts**
```typescript
router.post('/', async (req, res, next) => {
  try {
    const request: CreateBookingRequest = req.body; // Get data from request
    
    // Validate required fields
    if (!request.roomId || !request.userName || !request.startTime || !request.endTime) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }
    
    // Call service to create booking
    const booking = await bookingService.createBooking(request);
    res.status(201).json(booking); // Send success response
  } catch (error) {
    next(error); // Pass error to error handler
  }
});
```

**Backend: services/bookingService.ts**
```typescript
async createBooking(request: CreateBookingRequest): Promise<BookingResponse> {
  // 1. Parse dates
  const startTime = new Date(request.startTime);
  const endTime = new Date(request.endTime);
  
  // 2. Validate times
  const validationError = validateBookingTimes(startTime, endTime);
  if (validationError) {
    throw new Error(validationError);
  }
  
  // 3. Check if room exists
  const roomDoc = await roomsCollection.findOne({ id: request.roomId });
  if (!roomDoc) {
    throw new Error('Room not found');
  }
  
  // 4. Check for conflicts
  const existingBookings = await bookingsCollection
    .find({ roomId: request.roomId, status: 'CONFIRMED' })
    .toArray();
  
  const conflict = findConflict(request.roomId, startTime, endTime, existingBookings);
  if (conflict) {
    throw new Error(formatConflictMessage(conflict));
  }
  
  // 5. Calculate price
  const totalPrice = calculateBookingPrice(startTime, endTime, roomDoc.baseHourlyRate);
  
  // 6. Create booking document
  const booking = {
    bookingId: `b${bookingCount + 1}`,
    roomId: request.roomId,
    userName: request.userName,
    startTime,
    endTime,
    totalPrice,
    status: 'CONFIRMED',
    createdAt: new Date()
  };
  
  // 7. Save to MongoDB
  await bookingsCollection.insertOne(booking);
  
  // 8. Return response
  return {
    bookingId: booking.bookingId,
    roomId: booking.roomId,
    userName: booking.userName,
    totalPrice: booking.totalPrice,
    status: booking.status
  };
}
```

---

### Step 5: Price Calculation Logic

**Function: utils/pricing.ts**

```typescript
function calculateBookingPrice(
  startTime: Date,
  endTime: Date,
  baseHourlyRate: number
): number {
  let totalPrice = 0;
  let current = new Date(startTime);
  
  // Break booking into hourly slots
  while (current < endTime) {
    const slotEnd = new Date(current);
    slotEnd.setHours(slotEnd.getHours() + 1, 0, 0, 0);
    
    if (slotEnd > endTime) {
      slotEnd.setTime(endTime.getTime());
    }
    
    // Calculate duration in hours
    const durationHours = (slotEnd.getTime() - current.getTime()) / (1000 * 60 * 60);
    
    // Determine if peak or off-peak
    const rate = isPeakHour(current) ? baseHourlyRate * 1.5 : baseHourlyRate;
    
    // Add to total
    totalPrice += rate * durationHours;
    
    // Move to next hour
    current = new Date(slotEnd);
  }
  
  return Math.round(totalPrice * 100) / 100;
}
```

**Example Calculation:**
```
Booking: 10:00 AM - 12:30 PM (Monday)
Base Rate: ₹500/hour

Slot 1: 10:00-11:00 (1 hour)
  - Peak hour? Yes (10 AM is peak)
  - Rate: ₹500 × 1.5 = ₹750
  - Price: ₹750 × 1 = ₹750

Slot 2: 11:00-12:00 (1 hour)
  - Peak hour? Yes (11 AM is peak)
  - Rate: ₹500 × 1.5 = ₹750
  - Price: ₹750 × 1 = ₹750

Slot 3: 12:00-12:30 (0.5 hours)
  - Peak hour? No (12:30 PM is off-peak)
  - Rate: ₹500 × 1 = ₹500
  - Price: ₹500 × 0.5 = ₹250

Total: ₹750 + ₹750 + ₹250 = ₹1,750
```

---

### Step 6: Conflict Detection Logic

**Function: utils/conflict.ts**

```typescript
function hasTimeOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
  // Overlap exists if: start1 < end2 AND end1 > start2
  return start1 < end2 && end1 > start2;
}

function findConflict(roomId: string, startTime: Date, endTime: Date, existingBookings: Booking[]): Booking | null {
  for (const booking of existingBookings) {
    if (hasTimeOverlap(startTime, endTime, booking.startTime, booking.endTime)) {
      return booking; // Conflict found!
    }
  }
  return null; // No conflict
}
```

**Example:**
```
Existing Booking: 10:00 AM - 11:00 AM
New Booking: 10:30 AM - 11:30 AM

Check overlap:
  start1 (10:30) < end2 (11:00)? Yes ✓
  end1 (11:30) > start2 (10:00)? Yes ✓
  
Result: CONFLICT! ❌
```

---

### Step 7: Response Back to Frontend

**Backend sends:**
```json
{
  "bookingId": "b1",
  "roomId": "101",
  "userName": "Priya",
  "totalPrice": 1750,
  "status": "CONFIRMED"
}
```

**Frontend receives:**
```typescript
const booking = await api.createBooking(formData);
// booking = { bookingId: "b1", roomId: "101", ... }

setResult(booking); // Store in state
```

**UI Updates:**
```jsx
{result && (
  <div className="success-message">
    <h3>Booking Confirmed!</h3>
    <p>Booking ID: {result.bookingId}</p>
    <p>Total Price: ₹{result.totalPrice}</p>
  </div>
)}
```

---

# Backend Deep Dive

## Request Flow

```
HTTP Request
    ↓
Express Middleware (CORS, JSON parser)
    ↓
Route Handler (routes/bookings.ts)
    ↓
Service Layer (services/bookingService.ts)
    ↓
Utils (utils/pricing.ts, utils/conflict.ts)
    ↓
Database (MongoDB)
    ↓
Response
```

## Key Backend Functions

### 1. Express Server Setup

**File: backend/src/index.ts**

```typescript
import express from 'express';
import cors from 'cors';

const app = express();

// Middleware: Parse JSON request bodies
app.use(express.json());

// Middleware: Allow CORS (frontend can call API)
app.use(cors({
  origin: 'http://localhost:3001' // Frontend URL
}));

// Routes
app.use('/api/bookings', bookingsRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/analytics', analyticsRouter);

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

**What each part does:**
- `express()`: Creates Express app
- `app.use(express.json())`: Parses JSON from request body
- `app.use(cors(...))`: Allows frontend to make requests
- `app.use('/api/bookings', ...)`: Maps URL to router
- `app.listen()`: Starts server on port 3000

### 2. Error Handling

**File: backend/src/middleware/errorHandler.ts**

```typescript
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  // Determine status code based on error message
  let statusCode = 500;
  
  if (err.message.includes('not found')) {
    statusCode = 404;
  } else if (err.message.includes('already') || err.message.includes('conflict')) {
    statusCode = 409;
  } else if (err.message.includes('cannot') || err.message.includes('Invalid')) {
    statusCode = 400;
  }
  
  // Send error response
  res.status(statusCode).json({
    error: err.message
  });
}
```

**How it works:**
1. Service throws error: `throw new Error('Room not found')`
2. Route catches it: `catch (error) { next(error) }`
3. Error handler processes it
4. Sends appropriate HTTP status code

---

# Frontend Deep Dive

## Component Lifecycle

```
Component Created
    ↓
Initial Render (JSX returned)
    ↓
useEffect Runs (if dependencies met)
    ↓
State Updates (if any)
    ↓
Re-render (with new state)
    ↓
useEffect Runs Again (if dependencies changed)
```

## Key Frontend Functions

### 1. API Client

**File: frontend/src/services/api.ts**

```typescript
class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Make HTTP request
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    // Check if request failed
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    
    // Return JSON data
    return response.json();
  }
  
  async createBooking(request: CreateBookingRequest): Promise<BookingResponse> {
    return this.request<BookingResponse>('/bookings', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}
```

**What it does:**
- Wraps `fetch` API
- Handles errors consistently
- Converts JSON automatically
- Provides type safety

### 2. React Router

**File: frontend/src/App.tsx**

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoomsPage />} />
        <Route path="/book" element={<BookingForm />} />
        <Route path="/admin" element={<AdminView />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**How it works:**
- `BrowserRouter`: Enables routing
- `Routes`: Container for routes
- `Route`: Maps URL path to component
- When user visits `/book`, React renders `<BookingForm />`

---

# Function Call Chains

## Complete Booking Creation Chain

```
USER ACTION: Clicks "Create Booking"
    ↓
[FRONTEND]
    ↓
BookingForm.handleSubmit()
    ↓
  e.preventDefault()
    ↓
  setLoading(true)
    ↓
  api.createBooking(formData)
    ↓
    ApiClient.request('/bookings', { method: 'POST', body: JSON.stringify(formData) })
    ↓
    fetch('http://localhost:3000/api/bookings', {...})
    ↓
[NETWORK: HTTP POST Request]
    ↓
[BACKEND]
    ↓
Express Middleware: express.json() parses body
    ↓
Express Middleware: cors() allows request
    ↓
routes/bookings.ts: router.post('/')
    ↓
  Validate required fields
    ↓
  bookingService.createBooking(request)
    ↓
    [VALIDATION]
    validateBookingTimes(startTime, endTime)
      ↓
      Check: startTime < endTime? ✓
      Check: duration ≤ 12 hours? ✓
    ↓
    [ROOM CHECK]
    roomsCollection.findOne({ id: roomId })
      ↓
      Room exists? ✓
    ↓
    [CONFLICT CHECK]
    bookingsCollection.find({ roomId, status: 'CONFIRMED' })
      ↓
    findConflict(roomId, startTime, endTime, existingBookings)
      ↓
      Loop through existing bookings
        ↓
        hasTimeOverlap(newBooking, existingBooking)?
          ↓
          No overlap found ✓
    ↓
    [PRICING]
    calculateBookingPrice(startTime, endTime, baseRate)
      ↓
      Break into hourly slots
        ↓
        For each slot:
          isPeakHour(slotTime)?
            ↓
            Yes → rate = baseRate × 1.5
            No → rate = baseRate
          ↓
          totalPrice += rate × duration
      ↓
      Return totalPrice
    ↓
    [CREATE BOOKING]
    Generate bookingId: `b${count + 1}`
    ↓
    Create booking object
    ↓
    bookingsCollection.insertOne(booking)
      ↓
      MongoDB saves document
    ↓
    Return BookingResponse
    ↓
  res.status(201).json(booking)
    ↓
[NETWORK: HTTP Response]
    ↓
[FRONTEND]
    ↓
fetch() resolves with response
    ↓
response.json() converts to object
    ↓
api.createBooking() returns booking
    ↓
setResult(booking)
    ↓
setLoading(false)
    ↓
Component re-renders
    ↓
Success message displayed
```

---

# Key Concepts Explained

## 1. Async/Await

### What is it?
**Way to handle asynchronous operations (things that take time)**

### Without Async/Await (Old Way)
```javascript
fetch('/api/rooms')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### With Async/Await (Modern Way)
```javascript
async function loadRooms() {
  try {
    const response = await fetch('/api/rooms');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

**Why it's better:**
- Easier to read (looks like normal code)
- Easier error handling (try/catch)
- No callback hell

## 2. Promises

### What is it?
**Promise = "I promise to give you a value later"**

```typescript
// Promise that resolves after 2 seconds
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Done!");
  }, 2000);
});

// Use it
promise.then(result => console.log(result)); // "Done!"
```

**In our code:**
```typescript
// fetch() returns a Promise
const response = await fetch('/api/rooms');
// await waits for Promise to resolve
// Then continues with next line
```

## 3. Spread Operator (...)

### What is it?
**Copies all properties from one object to another**

```typescript
const person = { name: "John", age: 25 };
const updated = { ...person, age: 26 };
// updated = { name: "John", age: 26 }
```

**In our code:**
```typescript
setFormData({
  ...formData,           // Copy all existing fields
  userName: "New Name"   // Update only userName
});
```

## 4. Destructuring

### What is it?
**Extract values from objects/arrays**

```typescript
// Object destructuring
const { name, age } = { name: "John", age: 25 };
// name = "John", age = 25

// Array destructuring
const [first, second] = [1, 2];
// first = 1, second = 2

// useState returns array, so we destructure
const [count, setCount] = useState(0);
// count = 0, setCount = function
```

## 5. TypeScript Interfaces

### What is it?
**Defines shape/structure of an object**

```typescript
interface Room {
  id: string;
  name: string;
  baseHourlyRate: number;
}

// Now TypeScript knows what Room looks like
const room: Room = {
  id: "101",
  name: "Cabin 1",
  baseHourlyRate: 500
  // If you add extra property or wrong type, TypeScript complains
};
```

## 6. HTTP Methods

### GET
**Retrieve data**
```typescript
GET /api/rooms
// Returns: List of rooms
```

### POST
**Create new resource**
```typescript
POST /api/bookings
Body: { roomId: "101", userName: "Priya", ... }
// Creates: New booking
```

### PUT/PATCH
**Update existing resource**

### DELETE
**Remove resource**

## 7. RESTful API

### What is it?
**Convention for designing APIs**

- **Resources** = Nouns (rooms, bookings)
- **Actions** = HTTP methods (GET, POST, PUT, DELETE)
- **URLs** = Resource names (`/api/rooms`, `/api/bookings`)

**Examples:**
```
GET    /api/rooms          → Get all rooms
GET    /api/rooms/101      → Get room 101
POST   /api/bookings       → Create booking
POST   /api/bookings/b1/cancel → Cancel booking (action)
GET    /api/analytics      → Get analytics
```

## 8. Middleware

### What is it?
**Functions that run between request and response**

```typescript
// Middleware: Parse JSON
app.use(express.json());

// Middleware: Allow CORS
app.use(cors());

// Middleware: Error handler
app.use(errorHandler);
```

**Flow:**
```
Request → Middleware 1 → Middleware 2 → Route Handler → Response
```

## 9. MongoDB Collections

### What is it?
**Like tables in SQL, but for NoSQL**

```typescript
// Collection = "rooms"
{
  _id: ObjectId("..."),
  id: "101",
  name: "Cabin 1",
  baseHourlyRate: 500
}

// Collection = "bookings"
{
  _id: ObjectId("..."),
  bookingId: "b1",
  roomId: "101",
  userName: "Priya",
  ...
}
```

## 10. Environment Variables

### What is it?
**Configuration values stored outside code**

```typescript
// .env file
MONGODB_URI=mongodb+srv://...
PORT=3000

// In code
const port = process.env.PORT || 3000;
```

**Why use it:**
- Keep secrets out of code
- Different configs for dev/prod
- Don't commit to Git

---

# Summary

## What You Learned

1. **TypeScript**: JavaScript with types for safety
2. **React**: Library for building UIs with components
3. **React Hooks**: `useState` (state), `useEffect` (side effects)
4. **Async/Await**: Handle asynchronous operations
5. **REST API**: Backend endpoints for data operations
6. **MongoDB**: NoSQL database for storing data
7. **Full-Stack Flow**: Frontend → API → Backend → Database

## Project Flow Summary

```
User Action
    ↓
React Component (Frontend)
    ↓
API Call (HTTP Request)
    ↓
Express Route (Backend)
    ↓
Service Layer (Business Logic)
    ↓
Database (MongoDB)
    ↓
Response (JSON)
    ↓
React Updates UI
```

## Key Takeaways

- **TypeScript** catches errors before runtime
- **React Hooks** manage component state and side effects
- **Async/Await** makes async code readable
- **REST APIs** follow conventions for consistency
- **Separation of Concerns**: Routes → Services → Database

---

**Congratulations!** You now understand the complete project flow from user click to database storage! 🎉

