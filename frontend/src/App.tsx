/**
 * Main App Component
 * Sets up routing and global styles
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoomsPage from './components/RoomsPage';
import BookingForm from './components/BookingForm';
import AdminView from './components/AdminView';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<RoomsPage />} />
          <Route path="/book" element={<BookingForm />} />
          <Route path="/admin" element={<AdminView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

