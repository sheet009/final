import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminReq.css';

const AdminReq = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/admin/donations/requests", {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setRequests(response.data);
        } catch (error) {
            console.error("Error fetching requests: ", error);
            setError('Failed to fetch donation requests. Please try again.');
        }
    };

    return (
        <div className="admin-requests-container">
            <h3>Donation Requests</h3>
            {error && <div className="error-message">{error}</div>}
            <div className="requests-list">
                {requests.length > 0 ? (
                    requests.map((request) => (
                        <div key={request.id} className="request-item">
                            <div className="request-details">
                                <p><strong>Recipient Name:</strong> {request.recipientName}</p>
                                <p><strong>Status:</strong> {request.status}</p>
                                <p><strong>Quantity Requested:</strong> {request.quantity}</p>
                               
                                <p><strong>Request Time:</strong> {new Date(request.requestTime).toLocaleString()}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No donation requests available</p>
                )}
            </div>
        </div>
    );
};

export default AdminReq;
