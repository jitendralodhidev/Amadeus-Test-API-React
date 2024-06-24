import React from 'react';
import Cookies from 'js-cookie';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Navbar from './components/Navbar';
import Home from './components/Index';

import HotelBookingForm from './components/hotel/HotelBooking';
import TicketBookingForm from './components/flights/TicketBooking';

import './App.css';

function App() {
  const token = Cookies.get('token');
  if (!token) {
    return <Login />
  }
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/flight-booking' element={<TicketBookingForm />} />
        <Route path="/hotel-booking" element={< HotelBookingForm />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
