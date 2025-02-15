import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Contact from './components/Contact';
import Register from './components/Register';
import Login from './components/Login';
import Homepage from './components/Homepage';
import DonateNow from './components/DonateNow';
import VolunteerPage from './components/VolunteerPage';
import About from './components/About';
import AdminDash from './components/AdminDash';
import Donations from './components/Donations';
import PasswordResetForm from './components/PasswordResetForm';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/header" element={<Header />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/forgot" element={<PasswordResetForm />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/volunteerpage" element={<VolunteerPage />} />
        <Route path="/donate" element={<DonateNow />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admindash/*" element={<AdminDash />} />
        <Route path="/donations" element={<Donations />} />
      </Routes>
    </Router>
  );
}

export default App;
