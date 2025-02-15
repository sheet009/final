import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DonateNow.css";
import Header from "./Header";
import Footer from "./Footer";

function DonateNow() {
  const [formData, setFormData] = useState({
    donorName: "",
    email: "",
    phone: "",
    foodType: "",
    foodName: "",
    quantity: "",
    street: "",
    city: "",
    postalCode: "",
    pickupTime: "",
  });

  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const donorName = localStorage.getItem("donorName");
    const email = localStorage.getItem("email");
    const phone = localStorage.getItem("donorPhone");

    if (donorName && email && phone) {
      setFormData((prev) => ({
        ...prev,
        donorName,
        email,
        phone,
      }));
    }
  }, []);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "donorName":
        if (!value) error = "Donor name is required.";
        break;
      case "email":
        if (!value || !/\S+@\S+\.\S+/.test(value)) error = "A valid email is required.";
        break;
      case "phone":
        if (!value || value.length !== 10) error = "Phone number must be 10 digits.";
        break;
      case "foodType":
        if (!value) error = "Food type is required.";
        break;
      case "foodName":
        if (!value) error = "Food name is required.";
        break;
      case "quantity":
        if (!value || value <= 0) error = "Quantity must be greater than 0.";
        break;
      case "street":
        if (!value) error = "Street address is required.";
        break;
      case "city":
        if (!value) error = "City is required.";
        break;
      case "postalCode":
        if (!value || value.length !== 6) error = "Postal code must be 6 digits.";
        break;
      case "pickupTime":
        if (!value) error = "Pickup time is required.";
        break;
      default:
        break;
    }

    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update the form data
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate the field in real-time
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const donationData = {
      ...formData,
      recipientName: "",
      recipientEmail: "",
      recipientPhone: "",
    };

    axios
      .post("http://localhost:8080/api/donations", donationData, {
        withCredentials: true,
      })
      .then((response) => {
        setMessage({
          type: "success",
          text: "Donation submitted successfully!",
        });
        setFormData({
          donorName: "",
          email: "",
          phone: "",
          foodType: "",
          foodName: "",
          quantity: "",
          street: "",
          city: "",
          postalCode: "",
          pickupTime: "",
        });
        setErrors({});
      })
      .catch((error) => {
        setMessage({
          type: "error",
          text: "Failed to submit donation. Try again later.",
        });
      });
  };

  return (
    <div>
      <Header />
      
      <div className="donate-form-container">
        <header>
          <h1 className="form-title">Make a Food Donation</h1>
          <p className="form-description">
            Your contribution can make a difference! Please fill out the form below to donate food.
          </p>
        </header>

        {message && (
          <div
            className={`message ${
              message.type === "success" ? "message-success" : "message-error"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="donation-form">
          <div className="form-section">
            <h3 className="form-section-title">Donor Information</h3>
            <div className="form-group">
              <label htmlFor="donorName">Donor Name:</label>
              <input
                type="text"
                id="donorName"
                name="donorName"
                value={formData.donorName}
                onChange={handleInputChange}
                required
                readOnly
              />
              {errors.donorName && <small className="error-text">{errors.donorName}</small>}
            </div>
            <div className="inline-fields">
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  readOnly
                />
                {errors.email && <small className="error-text">{errors.email}</small>}
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone:</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  readOnly
                />
                {errors.phone && <small className="error-text">{errors.phone}</small>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Food Details</h3>
            <div className="form-group">
              <label htmlFor="foodType">Food Type:</label>
              <select
                id="foodType"
                name="foodType"
                value={formData.foodType}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select food type</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
              </select>
              {errors.foodType && <small className="error-text">{errors.foodType}</small>}
            </div>
            <div className="form-group">
              <label htmlFor="foodName">Food Name:</label>
              <input
                type="text"
                id="foodName"
                name="foodName"
                value={formData.foodName}
                onChange={handleInputChange}
                required
              />
              {errors.foodName && <small className="error-text">{errors.foodName}</small>}
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity (in Portions):</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                min="1"
                step="any"
              />
              {errors.quantity && <small className="error-text">{errors.quantity}</small>}
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Pickup Address</h3>
            <div className="address-row">
              <div className="form-group">
                <label htmlFor="street">Street:</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                />
                {errors.street && <small className="error-text">{errors.street}</small>}
              </div>
              <div className="form-group">
                <label htmlFor="city">City:</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
                {errors.city && <small className="error-text">{errors.city}</small>}
              </div>
              <div className="form-group">
                <label htmlFor="postalCode">Postal Code:</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  required
                />
                {errors.postalCode && <small className="error-text">{errors.postalCode}</small>}
              </div>
            </div>
          </div>

          <div className="form-section">
           
            <div className="form-group">
              <label htmlFor="pickupTime">Pickup Time:</label>
              <input
                type="datetime-local"
                id="pickupTime"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleInputChange}
                required
              />
              {errors.pickupTime && <small className="error-text">{errors.pickupTime}</small>}
            </div>
          </div>

          <button type="submit" className="submit-button">
            Submit Donation
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}

export default DonateNow;
