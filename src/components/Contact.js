import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Contact.css";
import Header from "./Header";
import Footer from "./Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [contactMessages, setContactMessages] = useState([]);
  const [errors, setErrors] = useState({});
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    // Autofill based on role
    if (storedRole === "RECIPIENT") {
      setFormData((prevData) => ({
        ...prevData,
        name: localStorage.getItem("recipientName") || "",
        email: localStorage.getItem("email") || "",
      }));
    } else if (storedRole === "DONOR") {
      setFormData((prevData) => ({
        ...prevData,
        name: localStorage.getItem("donorName") || "",
        email: localStorage.getItem("email") || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value) error = "Full Name is required.";
        break;
      case "email":
        if (!value || !/\S+@\S+\.\S+/.test(value)) error = "A valid email is required.";
        break;
      case "message":
        if (!value) error = "Message is required.";
        break;
      default:
        break;
    }
    return error;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) validationErrors[field] = error;
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    axios.post("http://localhost:8080/api/contact", formData)

    .then(() => {
      alert("Thank you for contacting us!");
      setFormData({ name: "", email: "", message: "" });
      fetchContactMessages();
    })
    .catch((error) => {
      console.error("There was an error submitting the form!", error);
    });
  
  };

  const fetchContactMessages = () => {
    axios
      .get("/api/admin/contact")
      .then((response) => {
        setContactMessages(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching contact messages!", error);
      });
  };

  const handleUpdate = (id, updatedMessage) => {
    axios
      .put(`/api/admin/contact/${id}`, { message: updatedMessage })
      .then(() => {
        alert("Message updated successfully!");
        fetchContactMessages();
      })
      .catch((error) => {
        console.error("There was an error updating the message!", error);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`/api/admin/contact/${id}`)
      .then(() => {
        alert("Message deleted successfully!");
        fetchContactMessages();
      })
      .catch((error) => {
        console.error("There was an error deleting the message!", error);
      });
  };

  const handleSignOutClick = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <div className="contact">
      <Header/>
      {/* <header className="header">
        <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          ServeIt
        </div>
        <nav className="navigation">
          <ul>
            <li><a href="./about">About Us</a></li>
            <li><a href="./contact">Contact Us</a></li>
            {role && (
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/donations");
                  }}
                >
                  {role === "DONOR" ? "Your Donations" : "Available Donations"}
                </a>
              </li>
            )}
          </ul>
        </nav>
        <div className="header-buttons">
          {role && (
            <>
              <button class="signout-btn" onClick={handleSignOutClick}>Sign Out</button>
              {role === "DONOR" && (
                <button  class="signout-btn" onClick={() => navigate("/donate")}>Donate Now</button>
              )}
            </>
          )}
        </div>
      </header> */}

      <main className="contact-content">
        <section id="about" className="about-section">
          <h2>Contact Us</h2>
          <p>
            We are always happy to hear from you! Whether you have a question, need assistance, or want to collaborate,
            feel free to get in touch. Your feedback is invaluable to us, and we are here to help you in any way we can.
          </p>
          <p>For any inquiries, you can reach us at the following:</p>
        </section>

        <section id="contact-form" className="contact-form-section">
          <h2>Get in Touch</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                readOnly
              />
              {errors.name && <small className="error-text">{errors.name}</small>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                readOnly
              />
              {errors.email && <small className="error-text">{errors.email}</small>}
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                required
              />
              {errors.message && <small className="error-text">{errors.message}</small>}
            </div>
            <button type="submit" className="submit-button">
              Send Message
            </button>
          </form>
        </section>

        {localStorage.getItem("role") === "ADMIN" && (
          <section id="contact-messages" className="contact-messages-section">
            <h2>Contact Messages</h2>
            <ul>
              {contactMessages.map((message) => (
                <li key={message.id}>
                  <p><strong>{message.name}</strong></p>
                  <p>Email: {message.email}</p>
                  <p>Message: {message.message}</p>
                  <button onClick={() => handleUpdate(message.id, "Updated message")}>Update</button>
                  <button onClick={() => handleDelete(message.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
<Footer/>
     
    </div>
  );
};

export default Contact;
