import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import backgroundImage from "../images/login.jpg";
import Header from "./Header";
import Footer from "./Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in when the login page is loaded
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      navigate("/homepage", { replace: true });
      return; // Exit early to avoid rendering login UI
    }

    // If session is being checked, avoid rendering UI until done
    setIsCheckingSession(false);

    // Sync session state across tabs
    const handleStorageChange = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (isLoggedIn === "true") {
        navigate("/homepage", { replace: true });
      }
    };

    // Listen to storage changes to sync session across tabs
    window.addEventListener("storage", handleStorageChange);

    // Cleanup event listener when component unmounts
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const handleLogin = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!validateEmail(email)) newErrors.email = "Invalid email address.";
    if (!validatePassword(password))
      newErrors.password = "Password must be at least 6 characters.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const loginData = { email, password };
    axios
      .post("http://localhost:8080/api/login", loginData)
      .then((response) => {
        setMessage({ type: "success", text: response.data.message });

        // Save session data in localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("email", response.data.email);

        // Save recipient or donor details
        if (response.data.role === "RECIPIENT") {
          localStorage.setItem("recipientName", response.data.name); // Save recipient's name
          localStorage.setItem("recipientPhone", response.data.phone); // Save recipient's phone number
        } else if (response.data.role === "DONOR") {
          localStorage.setItem("donorName", response.data.name); // Save donor's name
          localStorage.setItem("donorPhone", response.data.phone); // Save donor's phone number
        }

        // Redirect based on the role
        if (response.data.role === "ADMIN") {
          navigate("/admindash", { replace: true }); // Admin dashboard
        } else {
          navigate("/homepage", { replace: true }); // Donor/Recipient homepage
        }
      })
      .catch((error) => {
        setMessage({ type: "error", text: "Login failed: Invalid email or password." });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (isCheckingSession) {
    return null; // Don't render anything until session check is done
  }

  const backgroundStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(231, 251, 180, 0.5), rgba(255, 255, 255, 0.5)), url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // Space between header, content, and footer
    alignItems: "center",
  };

  return (
    <div style={backgroundStyle}>
      {/* Header at the top */}
      <div style={{ width: "100%", margin: "0 auto" }}>
        <Header />
      </div>

      {/* Login form in the middle */}
      <div className="login-container">
        <h1>Login Now!</h1>
        {message && <p className={`message ${message.type}`}>{message.text}</p>}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <small className="error-text">{errors.password}</small>}
          </div>
          <button type="submit" className="logbutton" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="register-redirect">
          Don't have an account? <a href="/register">Register here</a>.
        </p>
        <p className="forgot-password">
          <a href="/forgot">Forgot Password?</a>
        </p>
      </div>

      {/* Footer at the bottom */}
      <div style={{ width: "100%", margin: "0 auto" }}>
        <Footer />
      </div>
    </div>
  );
};

export default Login;