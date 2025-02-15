import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css"; // Make sure this file exists and has your header styles

const Header = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      localStorage.clear();
      navigate("/");
    }
  };

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate("/")}>
        ServeIt
      </div>
      <nav className={`navigation ${!role ? "home-page" : ""}`}>
        <ul>
          <li>
            <a href="/about">About Us</a>
          </li>
          <li>
            <a href="/contact">Contact Us</a>
          </li>
          {role && (
            <li>
              <a href="/donations">
                {role === "DONOR" ? "Your Donations" : "Available Donations"}
              </a>
            </li>
          )}
          {role === "ADMIN" && (
            <li>
              <a href="/admindash">Admin Dashboard</a>
            </li>
          )}
        </ul>
      </nav>
      <div className="header-buttons">
        {role ? (
          <>
            <button className="signout-btn" onClick={handleSignOut}>
              Sign Out
            </button>
            {role === "DONOR" && (
              <button className="signout-btn" onClick={() => navigate("/donate")}>
                Donate Now
              </button>
            )}
            {role === "RECIPIENT" && (
              <button className="signout-btn" onClick={() => navigate("/donations")}>
                Request Now
              </button>
            )}
          </>
        ) : (
          <>
            <button className="header-btn" onClick={() => navigate("/register")}>
              Get Started
            </button>
            <button className="header-btn" onClick={() => navigate("/login")}>
              Sign In
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
