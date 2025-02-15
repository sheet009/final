import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDon.css';

const AdminDon = () => {
    const [donations, setDonations] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/admin/donations/all', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setDonations(response.data);
        } catch (error) {
            console.error('Error fetching donations:', error);
            setError('Failed to fetch donations. Please try again.');
        }
    };

    const handleDeleteDonation = async (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this donation?');
        
        if (isConfirmed) {
            try {
                await axios.delete(`http://localhost:8080/api/admin/donations/${id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                });
                // Reload the page after successful deletion
                window.location.reload();
            } catch (error) {
                console.error('Error deleting donation:', error.response ? error.response.data : error);
                setError('Failed to delete donation. Please try again.');
            }
        } else {
            console.log('Deletion canceled');
        }
    };
    
        

    return (
        <div className="admin-don-container">
            <h3>Donations Management</h3>
            {error && <div className="error-message">{error}</div>}
            <table className="donation-table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Status</th>
                        <th>Donor Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Pickup Address</th>
                        <th>Pickup Time</th>
                        <th>Notes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {donations.length > 0 ? donations.map((donation) => (
                        <tr key={donation.id}>
                            <td>{donation.foodType}</td>
                            <td>{donation.foodName}</td>
                            <td>{donation.quantity}</td>
                            <td>{donation.status}</td>
                            <td>{donation.donorName}</td>
                            <td>{donation.email}</td>
                            <td>{donation.phone}</td>
                            <td>{`${donation.street}, ${donation.city} - ${donation.postalCode}`}</td>
                            <td>{new Date(donation.pickupTime).toLocaleString()}</td>
                            <td>{donation.notes || 'N/A'}</td>
                            <td>
                                <button className="delete-button" onClick={() => handleDeleteDonation(donation.id)}>Delete</button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="11" className="no-data">No donations available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDon;
