import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Donations.css";
import Header from "./Header";
import Footer from "./Footer";

// DonationItem Component
const DonationItem = ({ donation, role, onRequestDonation }) => {
  const [requestQuantity, setRequestQuantity] = useState(1);

  if (!donation || !donation.foodName || donation.quantity <= 0) return null;

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setRequestQuantity(value);
  };

  const handleRequestClick = () => {
    onRequestDonation({ ...donation, selectedQuantity: requestQuantity });
  };

  return (
    <div className="donation-item">
      <h3>{donation.foodName}</h3>
      <p>Type: {donation.foodType}</p>
      <p>Available Quantity: {donation.quantity}</p>
      {role === "RECIPIENT" && donation.quantity > 0 && donation.pickupAddress && (
        <p>Pickup Address: {donation.pickupAddress}</p>
      )}
      {role === "RECIPIENT" && donation.quantity > 0 && (
        <div className="request-controls">
          <input
            type="number"
            min="1"
            max={donation.quantity}
            value={requestQuantity}
            onChange={handleQuantityChange}
            className="quantity-input"
          />
          <button
            onClick={handleRequestClick}
            disabled={requestQuantity <= 0 || requestQuantity > donation.quantity}
            className="request-button"
          >
            Request Donation
          </button>
        </div>
      )}
    </div>
  );
};

// Main Donations Component
const Donations = () => {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donationError, setDonationError] = useState(null);
  const [requestError, setRequestError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:8080/api";

  

  // Fetch donations based on role
  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      setDonationError(null);
      const storedEmail = localStorage.getItem("email");

      try {
        const endpoint = role === "DONOR"
          ? `${API_BASE_URL}/donations/donor/${encodeURIComponent(storedEmail)}`
          : `${API_BASE_URL}/donations/available`;

        const response = await axios.get(endpoint);
        setDonations(response.data || []);
      } catch (err) {
        console.error("Error fetching donations:", err);
        setDonationError(
          err.response?.data?.message || 
          "Failed to fetch donations. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    if (role) fetchDonations();
  }, [role]);

  // Fetch donation requests
  useEffect(() => {
    const fetchRequests = async () => {
      if (!role) return;

      setRequestError(null);
      const userEmail = localStorage.getItem("email");

      if (!userEmail) {
        setRequestError("User email not found");
        return;
      }

      try {
        const endpoint = role === "DONOR"
          ? `${API_BASE_URL}/admin/donations/requests/donor/${encodeURIComponent(userEmail)}`
          : `${API_BASE_URL}/donations/requests/recipient/${encodeURIComponent(userEmail)}`;

        const response = await axios.get(endpoint);
        setRequests(response.data || []);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setRequestError(
          err.response?.data?.message || 
          "Unable to load donation requests. Please try again later."
        );
      }
    };

    fetchRequests();
  }, [role]);

  // Handle donation request
  const handleRequestDonation = async (donation) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const recipientEmail = localStorage.getItem("email");
    const recipientName = localStorage.getItem("recipientName");
    const recipientPhone = localStorage.getItem("recipientPhone");

    if (!recipientEmail || !recipientName || !recipientPhone) {
      alert("Please complete your profile information before requesting donations.");
      setIsSubmitting(false);
      return;
    }

    const requestPayload = {
      recipientEmail,
      recipientName,
      recipientPhone,
      donation: {
        id: donation.id,
        foodName: donation.foodName,
        foodType: donation.foodType,
        quantity: donation.quantity
      },
      quantity: donation.selectedQuantity || 1,
      status: "PENDING",
      requestTime: new Date().toISOString()
    };

    console.log("Request Payload:", requestPayload);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/donations/requests`,
        requestPayload
      );

      if (response.status === 201) {
        alert(`Successfully requested ${donation.selectedQuantity || 1} ${donation.foodName}`);

        const newRequest = {
          ...requestPayload,
          id: response.data.id,
          status: "PENDING",
          requestTime: requestPayload.requestTime,
        };

        setRequests((prevRequests) => [newRequest, ...prevRequests]);
      }
    } catch (err) {
      console.error("Error submitting donation request:", err);
      alert(err.response?.data || "Failed to submit donation request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle request deletion for recipients
  const handleDeleteRequest = async (requestId) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const email = localStorage.getItem("email");

    if (!email) {
      alert("User email is not found. Please log in again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/donations/requests/${requestId}?email=${encodeURIComponent(email)}`
      );

      if (response.status === 200) {
        alert("Request deleted successfully!");
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== requestId)
        );
      }
    } catch (err) {
      console.error("Error deleting request:", err);
      alert(err.response?.data || "Failed to delete request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle request approval/rejection for donors
  const handleApproveRequest = async (requestId, approve) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/donations/requests/${requestId}/${approve ? 'approve' : 'reject'}`
      );

      if (response.status === 200) {
        alert(approve ? "Request approved successfully!" : "Request rejected successfully!");
        setRequests(prevRequests =>
          prevRequests.map(request =>
            request.id === requestId
              ? { ...request, status: approve ? "APPROVED" : "REJECTED" }
              : request
          )
        );
      }
    } catch (err) {
      console.error("Error processing request:", err);
      alert(err.response?.data || "Failed to process the request. Please try again.");
    }
  };

  const handleUpdateRequestStatus = async (requestId, newStatus) => {
    try {
      let response;
      if (newStatus === 'PICKED_UP') {
        response = await axios.put(
          `${API_BASE_URL}/donations/requests/${requestId}/pickup`
        );
      } else if (newStatus === 'DELIVERED') {
        response = await axios.put(
          `${API_BASE_URL}/donations/requests/${requestId}/deliver`
        );
      }
  
      if (response.status === 200) {
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === requestId
              ? { ...request, status: newStatus }
              : request
          )
        );
        alert(`Request status updated to ${newStatus}`);
      }
    } catch (err) {
      console.error("Error updating request status:", err);
      alert("Failed to update request status. Please try again.");
    }
  };
  

  const handleMarkAsPickedUp = async (requestId) => {
    await handleUpdateRequestStatus(requestId, 'PICKED_UP');
  };

  const handleMarkAsDelivered = async (requestId) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/donations/requests/${requestId}/deliver`
      );
  
      if (response.status === 200) {
        // Update the request status in the frontend
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === requestId
              ? { ...request, status: 'DELIVERED' }
              : request
          )
        );
        alert('Donation request marked as delivered');
      }
    } catch (err) {
      console.error("Error marking donation as delivered:", err);
      alert("Failed to mark donation as delivered. Please try again.");
    }
  };
  
  // Handle sign out
  const handleSignOut = () => {
    const confirmSignOut = window.confirm("Are you sure you want to sign out?");
    if (confirmSignOut) {
      localStorage.clear();
      navigate("/");
    }
  };


  return (
    <div className="donations-page">
      <Header/>
      {/* <header className="header">
        <div className="logo" onClick={() => navigate("/")}>
          ServeIt
        </div>
        <nav className="navigation">
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/donations">
      {role === "DONOR" ? "Your Donations" : "Available Donations"}
    </a></li>
          </ul>
        </nav>
        <div className="header-buttons">
          <button class="signout-btn" onClick={handleSignOut}>Sign Out</button>
        </div>
      </header> */}

      <main className="donations-content">
      <section className="donations-header">
  <h2>{role === "DONOR" ? "Your Donations" : "Available Donations"}</h2>
  <p>
    {role === "DONOR"
      ? "Manage your donations and track their status."
      : "Browse available donations and request what you need."}
  </p>
</section>



        {loading && <div className="loading-spinner">Loading...</div>}
        {donationError && <div className="error-message">{donationError}</div>}
        {requestError && <div className="error-message">{requestError}</div>}

        <div className="donations-list">
          {!loading && !donationError && donations.length === 0 ? (
            <div className="empty-state">No donations available at the moment.</div>
          ) : (
            donations.map((donation, index) => (
              <DonationItem
                key={donation.id || index}
                donation={donation}
                role={role}
                onRequestDonation={handleRequestDonation}
              />
            ))
          )}
        </div>

        <section className="requests-section">
  <h2>{role === "DONOR" ? "Received Requests" : "Your Requests"}</h2>
  <div className="requests-list">
    {requests.map((request, index) => (
      <div key={request.id || index} className="request-item">
        {request.donation && (
          <>
            {console.log(request.donation)}
            <h3>{request.donation.foodName}</h3>
            <p>Status: <span className={`status ${request.status.toLowerCase()}`}>{request.status}</span></p>
            <p>Requested Quantity: {request.quantity}</p>

            {/* Show Donor Details for Approved requests (Recipient Role) */}
            {role === "RECIPIENT" && request.status === 'APPROVED' && (
              <div className="donor-details">
                <h4>Contact Details:</h4>
                <p>Name: {request.donation.donorName}</p>
                <p>Email: {request.donation.email}</p>  
                <p>Phone: {request.donation.phone}</p>  
                {request.donation.pickupAddress && (
                  <p>Pickup Address: {request.donation.pickupAddress}</p>
                )}
              </div>
            )}

            {/* Show Recipient Details for Pending requests (Donor Role) */}
            {role === "DONOR" && request.status === 'PENDING' && (
              <div className="recipient-details">
                <h4>Recipient Contact Details:</h4>
                <p>Name: {request.recipientName}</p>
                <p>Email: {request.recipientEmail}</p>
                <p>Phone: {request.recipientPhone}</p>
              </div>
            )}

            {/* Pickup Address for Approved requests (Recipient Role) */}
            {role === "RECIPIENT" && request.status === 'APPROVED' && request.donation.street && request.donation.city && request.donation.postalCode && (
              <div>
                <p>Pickup Address: {`${request.donation.street}, ${request.donation.city}, ${request.donation.postalCode}`}</p>
              </div>
            )}

            {/* Delete Button for Recipients and Pending Requests */}
            {role === "RECIPIENT" && request.status === "PENDING" && (
              <div className="request-actions">
                <button onClick={() => handleDeleteRequest(request.id)} className="delete-button">
                  Delete
                </button>
              </div>
            )}

            {/* Approve/Reject Buttons for Donors */}
            {role === "DONOR" && request.status === "PENDING" && (
              <div className="request-actions">
                <button onClick={() => handleApproveRequest(request.id, true)} className="approve-button">
                  Approve
                </button>
                <button onClick={() => handleApproveRequest(request.id, false)} className="reject-button">
                  Reject
                </button>
              </div>
            )}

            {/* Show Recipient Details after Donor Approval */}
            {role === "DONOR" && request.status === 'APPROVED' && (
              <div className="recipient-details">
                <h4>Recipient Contact Details:</h4>
                <p>Name: {request.recipientName}</p>
                <p>Email: {request.recipientEmail}</p>
                <p>Phone: {request.recipientPhone}</p>
              </div>
            )}

            {/* Mark as Picked Up for Donors */}
            {role === "DONOR" && request.status === "APPROVED" && (
              <div className="request-actions">
                <button onClick={() => handleMarkAsPickedUp(request.id)} className="approve-button">
                  Mark as Picked Up
                </button>
              </div>
            )}

            {/* Mark as Delivered for Recipients */}
            {role === "RECIPIENT" && request.status === "PICKED_UP" && (
              <div className="request-actions">
                <button onClick={() => handleMarkAsDelivered(request.id)} className="approve-button">
                  Mark as Delivered
                </button>
              </div>
            )}
          </>
        )}
      </div>
    ))}
  </div>
</section>

      </main>

      <Footer/>
    </div>
  );
};

export default Donations;

