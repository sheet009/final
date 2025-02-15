import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import backgroundImage from '../images/login.jpg';
import { useNavigate } from 'react-router-dom'; // Updated import
import Header from './Header';
import Footer from './Footer';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');
  const [foodPreferences, setFoodPreferences] = useState('');
  const [role, setRole] = useState('DONOR');
  const [message, setMessage] = useState(null); // Success/error messages
  const [errors, setErrors] = useState({}); // Validation errors

  const navigate = useNavigate(); // Initialize navigate

  // Validation functions
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email); // Basic email regex
  const validatePassword = (password) =>
    password.length >= 6 && /\d/.test(password); // At least 6 characters and 1 digit
  const validateContact = (contact) =>
    /^\d{10}$/.test(contact); // 10-digit phone number
  const validateLocation = (location) =>
    location.trim().length >= 3; // Minimum 3 characters for location

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate before submission
    const newErrors = {};
    if (!validateEmail(email)) newErrors.email = 'Invalid email address.';
    if (!validatePassword(password))
      newErrors.password = 'Password must be at least 6 characters and contain a number.';
    if (!validateContact(contact))
      newErrors.contact = 'Contact must be a 10-digit number.';
    if (!validateLocation(location))
      newErrors.location = 'Location must be at least 3 characters.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const registrationData = {
      name: username,
      email,
      password,
      contact,
      location,
      foodPreferences,
      role,
    };

    axios
      .post('http://localhost:8080/api/registration', registrationData)
      .then((response) => {
        // Save the role to localStorage on successful registration
        localStorage.setItem('role', role);

        setMessage({ type: 'success', text: 'Registration successful!' });

        // Clear form fields
        setUsername('');
        setEmail('');
        setPassword('');
        setContact('');
        setLocation('');
        setFoodPreferences('');
        setRole('DONOR');
        setErrors({});

        // Navigate to login page after successful registration
        setTimeout(() => {
          navigate('/login'); // Ensure navigation happens after message update
        }, 1000); // Delay for 1 second before redirecting to allow message to be seen
      })
      .catch((error) => {
        setMessage({ type: 'error', text: 'Registration failed. Please try again.' });
        console.error('Error:', error);
      });
  };

  const checkEmailExists = (email) => {
    if (!validateEmail(email)) return;
    axios
      .get(`http://localhost:8080/api/check-email?email=${email}`)
      .then((response) => {
        if (response.data.exists) {
          setErrors((prev) => ({
            ...prev,
            email: 'Email already exists. Please use a different email.',
          }));
        } else {
          setErrors((prev) => ({ ...prev, email: null }));
        }
      })
      .catch((error) => {
        console.error('Error checking email:', error);
      });
  };

  const backgroundStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(231, 251, 180, 0.5), rgba(255, 255, 255, 0.5)), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={backgroundStyle}>
      <div style={{ width: '100%', margin: '0 auto' }}>
        <Header />
      </div> {/* Header component added here */}
      <br></br><br></br>
      <header className="App-header">
        <h1 className="register-heading">Register Now and Make a Difference</h1>
        {message && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label htmlFor="username">Name:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  email: validateEmail(e.target.value)
                    ? null
                    : 'Invalid email address.',
                }));
              }}
              onBlur={() => checkEmailExists(email)} // Check email on blur
              required
            />
            {errors.email && <small className="error-text">{errors.email}</small>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  password: validatePassword(e.target.value)
                    ? null
                    : 'Password must be at least 6 characters and contain a number.',
                }));
              }}
              required
            />
            {errors.password && (
              <small className="error-text">{errors.password}</small>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="contact">Contact:</label>
            <input
              type="text"
              id="contact"
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  contact: validateContact(e.target.value)
                    ? null
                    : 'Contact must be a 10-digit number.',
                }));
              }}
              required
            />
            {errors.contact && (
              <small className="error-text">{errors.contact}</small>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  location: validateLocation(e.target.value)
                    ? null
                    : 'Location must be at least 3 characters.',
                }));
              }}
              required
            />
            {errors.location && (
              <small className="error-text">{errors.location}</small>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="DONOR">DONOR</option>
              <option value="RECIPIENT">RECIPIENT</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="foodPreferences">Food Preferences:</label>
            <select
              id="foodPreferences"
              value={foodPreferences}
              onChange={(e) => setFoodPreferences(e.target.value)}
              required
            >
              <option value="" disabled>
                Select your preference
              </option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>
          <button type="submit">Register</button>
        </form>
        <p className="register-container">
          Already an existing user? <a href="/login">Login now</a>
        </p>
      </header>
      <div style={{ width: '100%', margin: '0 auto' }}>
        <Footer />
      </div>
    </div>
   
  );
 
}
 

export default Register;