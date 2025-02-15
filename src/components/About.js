import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";
import Header from "./Header";
import Footer from "./Footer";

const About = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const handleSignOutClick = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <div className="about">
      <Header/>
      {/* Header Section */}
      {/* <header className="header">
        <div
          className="logo"
          onClick={() => navigate("/")} // Navigate to homepage on click
          style={{ cursor: "pointer" }} // Change cursor to pointer
        >
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
          {role ? (
            <>
              <button onClick={handleSignOutClick}>Sign Out</button>
              {role === "DONOR" && (
                <button class="signout-btn" onClick={() => navigate("/donate")}>Donate Now</button>
              )}
            </>
          ) : (
            <button class="signout-btn" onClick={() => navigate("/login")}>Sign In</button>
          )}
        </div>
      </header> */}

      {/* Main Content Section */}
      <main className="about-content">
        {/* About Section */}
        <section id="about" className="about-section">
          <h2>About Us</h2>
          <p>
            Founded in 2024, ServeIt is dedicated to combating food insecurity and reducing food waste.
            Our mission is to bridge the gap between surplus food and those in need, creating a sustainable and equitable food system.
            By fostering collaboration between food donors and recipients, we aim to build a more compassionate community.
          </p>
          <p>
            We believe that everyone deserves access to nutritious food, and we work tirelessly to ensure that no food goes to waste.
            Our team is passionate about making a difference and is committed to creating innovative solutions to address food insecurity.
          </p>
        </section>

        {/* Mission Section */}
        <section id="mission" className="mission-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to eradicate hunger by connecting surplus food from businesses, organizations, and individuals
            with those who need it most. We strive to ensure no food goes to waste and every meal serves a purpose.
          </p>
          <p>
            We aim to create a network of food donors and recipients that is efficient, transparent, and impactful.
            By leveraging technology and community engagement, we work to streamline the food donation process and maximize our reach.
          </p>
        </section>

        {/* Vision Section */}
        <section id="vision" className="vision-section">
          <h2>Our Vision</h2>
          <p>
            ServeIt envisions a world where food insecurity is a thing of the past, and sustainability is at the core of
            community values. We aim to empower individuals and organizations to make impactful contributions
            to a healthier, greener planet.
          </p>
          <p>
            Our vision includes a future where every community has access to healthy food options, and where food waste is minimized.
            We believe that by working together, we can create a more equitable food system that benefits everyone.
          </p>
        </section>

        {/* History Section */}
        <section id="history" className="history-section">
          <h2>Our History</h2>
          <p>
            ServeIt was established in 2024 with a clear purpose: to address the growing challenges of food waste and hunger.
            Starting as a small initiative, we quickly expanded into a robust platform connecting food donors
            with recipients across the region. Through innovation and community support, ServeIt continues to make
            a significant impact in reshaping the food ecosystem.
          </p>
          <p>
            Over the years, we have partnered with local businesses, schools, and community organizations to create a network
            that facilitates food donations. Our programs have helped thousands of individuals and families access the food they need,
            and we are proud of the positive change we have fostered in our communities.
          </p>
        </section>

        {/* Food Donors Section */}
        <section id="donors" className="donors-section">
          <h2>Food Donors</h2>
          <p>
            We are grateful to our food donors who play a crucial role in our mission. From grocery stores to restaurants,
            farms, and individuals, every contribution counts. By donating surplus food, our partners help us reduce waste
            and provide meals to those in need.
          </p>
          <p>
            If you are interested in becoming a food donor, we invite you to join our network. Together, we can make a difference
            and ensure that no food goes to waste. Your support can help us reach more people and create a lasting impact in our community.
          </p>
        </section>
      </main>

     <Footer/>
    </div>
  );
};

export default About;
