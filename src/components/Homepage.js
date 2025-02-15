import React, { useState, useEffect } from "react";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";
// import homesecImage from "../images/homesec.jpg";
import homesecVideo from "../images/homesec2.mp4"; // Adjust the file extension if needed
import first from "../images/first.png";
import second from "../images/second.png";
import third from "../images/third.png";
import Header from "./Header";
import Footer from "./Footer";


const Homepage = () => {
  const [role, setRole] = useState(null);
  const [donorName, setDonorName] = useState(null);
  const [recipientName, setRecipientName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and role is stored
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";  // Check for exactly "true"
    const storedRole = localStorage.getItem("role");
  
    if (isLoggedIn && storedRole) {
      setRole(storedRole);
  
      if (storedRole === "DONOR") {
        setDonorName(localStorage.getItem("donorName"));
      } else if (storedRole === "RECIPIENT") {
        setRecipientName(localStorage.getItem("recipientName"));
      }
    } else {
      setRole(null);
    }
  }, []);
  
  const handleSignOutClick = () => {
    // Clear session and local storage
    localStorage.clear();
    sessionStorage.clear();
  
    // Clear any session cookies
    document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
    // Navigate to the homepage and force reload
    navigate("/", { replace: true });
    window.location.reload(); // Ensures a fresh homepage load
  };
  
  // Scroll actions
  useEffect(() => {
    const scrollToSection = (buttonId, targetId) => {
      const button = document.getElementById(buttonId);
      const target = document.getElementById(targetId);

      if (button && target) {
        button.addEventListener("click", function (e) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        });
      }
    };

    scrollToSection("hero-button", "how-it-works");
    scrollToSection("impact-button", "impact-reach");
    scrollToSection("cta-button", "cta");
  }, []);

  return (
    <div className="homepage">
      <Header />
      {/* <header className="header">
        <div className="logo">ServeIt</div>
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
          {!role ? (
            <>
              <button  onClick={() => navigate("/register")}>
                Get Started
              </button>
              <button  onClick={() => navigate("/login")}>
                Sign In
              </button>
            </>
          ) : (
            <>
              <button  onClick={handleSignOutClick}>
                Sign Out
              </button>
              {role === "DONOR" && (
                <button  onClick={() => navigate("/donate")}>
                  Donate Now
                </button>
              )}
            </>
          )}
        </div>
      </header> */}

<section className="hero">
  <div className="hero-video">
    <video autoPlay loop muted playsInline>
      <source src={homesecVideo} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
  <div className="hero-content">
    <h1>"Be the Change You Want to See"</h1>
    <button id="hero-button" onClick={() => navigate("/about")}>Learn More</button>
  </div>
</section>

      

      {role && (
  <div className="welcome-banner">
    <h1>
      Good {new Date().getHours() < 12 ? "Morning" : "Afternoon"}!
    </h1>
    <p>
      {role === "DONOR"
        ? `Thank you for helping us reduce food waste and serve those in need, ${donorName || "Donor"}!`
        : `Welcome, ${recipientName || "Recipient"}! Browse available donations and enjoy nutritious meals.`}
    </p>
  </div>
)}



<div className="how-it-works" id="how-it-works">
  <h2>How It Works</h2>
  <div className="how-it-works-steps">
    <div className="how-it-works-step">
      <img src={first} alt="Step 1 Icon" />
      <h3>Step 1: Sign Up</h3>
      <p>Create an account to get started. Whether you're donating or receiving, signing up is quick and easy.</p>
    </div>
    <div className="how-it-works-step">
      <img src={second} alt="Step 2 Icon" />
      <h3>Step 2: Choose Your Role</h3>
      <p>Register as a donor to share food or as a recipient to receive donations. Each role helps create a more sustainable community.</p>
    </div>
    <div className="how-it-works-step">
      <img src={third} alt="Step 3 Icon" />
      <h3>Step 3: Make an Impact</h3>
      <p>Start sharing or receiving donations, track your impact, and be part of the solution to food waste and hunger.</p>
    </div>
  </div>
</div>


<div className="impact-reach" id="impact-reach">
  <h2>Our Impact & Reach</h2>
  <div className="facts">
    <div className="fact-card">
      <h3>Fighting Hunger</h3>
      <p>Over 820 million people worldwide are undernourished. Every donation counts in the fight against hunger.</p>
    </div>
    <div className="fact-card">
      <h3>Reducing Food Waste</h3>
      <p>Nearly one-third of all food produced globally is wasted. By donating, you help reduce food waste and make a lasting impact.</p>
    </div>
    <div className="fact-card">
      <h3>Building Communities</h3>
      <p>By sharing meals, we create stronger communities, one donation at a time. Every act of kindness helps build a better future.</p>
    </div>
  </div>

  {/* Integrated CTA Section */}
  <div className="cta">
    <h2>Ready to Make a Difference?</h2>
    <p>Join our community of donors and recipients making a positive impact.</p>
    <button
      onClick={() => {
        if (!role) {
          navigate("/register");
        } else if (role === "DONOR") {
          navigate("/donate");
        } else {
          navigate("/donations");
        }
      }}
    >
      {!role ? "Get Started Now" : role === "DONOR" ? "Donate Now" : "Browse Donations"}
    </button>
  </div>
</div>

     <Footer/>
    </div>
  );
};

export default Homepage;