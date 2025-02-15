import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PasswordResetForm.css";
import backgroundImage from "../images/login.jpg";
import Header from "./Header";
import Footer from "./Footer";

const PasswordResetForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResetPassword, setIsResetPassword] = useState(false);
  const navigate = useNavigate();

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:8080/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `email=${encodeURIComponent(email)}`,
      });

      const data = await response.text();

      if (response.ok) {
        setMessage(data);
        setEmail("");
        setIsResetPassword(true);
      } else {
        setError(data || "Failed to send reset email");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:8080/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `token=${encodeURIComponent(resetToken)}&newPassword=${encodeURIComponent(newPassword)}`,
      });

      const data = await response.text();

      if (response.ok) {
        setMessage(data);
        setResetToken("");
        setNewPassword("");
        setConfirmPassword("");
        navigate("/login");
      } else {
        setError(data || "Failed to reset password");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const backgroundStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(231, 251, 180, 0.5), rgba(255, 255, 255, 0.5)), url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  };

  return (
    <div style={backgroundStyle}>
      {/* Header at the top */}
      <div style={{ width: "100%", margin: "0 auto" }}>
        <Header />
      </div>

      {/* Password reset form in the middle */}
      <div className="password-reset-container">
        <h2>{isResetPassword ? "Reset Your Password" : "Forgot Your Password?"}</h2>

        <p id="random">
          {isResetPassword
            ? "Enter the reset token you received in your email and your new password."
            : "Please enter your email address, and we will send you a reset link."}
        </p>

        <form
          className="password-reset-form"
          onSubmit={isResetPassword ? handleResetPasswordSubmit : handleForgotPasswordSubmit}
        >
          {isResetPassword ? (
            <>
              <input
                type="text"
                placeholder="Enter reset token"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <p id="random">Make sure your password is at least 6 characters long and includes a mix of letters, numbers, and symbols.</p>
            </>
          ) : (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
            </>
          )}

          <button type="submit" className="reset-button" disabled={loading}>
            {loading ? (isResetPassword ? "Resetting..." : "Sending...") : isResetPassword ? "Reset Password" : "Send Reset Email"}
          </button>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
        </form>

        <p id="back">
          <a href="/login">Back to Login</a>
        </p>
      </div>

      {/* Footer at the bottom */}
      <div style={{ width: "100%", margin: "0 auto", textAlign: "center" }}>
        <Footer />
      </div>
    </div>
  );
};

export default PasswordResetForm;
