import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminUser.css';

const AdminUser = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this user?');
        
        if (isConfirmed) {
            try {
                await axios.delete(`http://localhost:8080/api/registration/${userId}`);
                fetchUsers(); // Refresh the user list after deletion
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        } else {
            console.log('Deletion canceled');
        }
    };

    return (
        <div className="admin-users-container">
            <h3>Registered Users</h3>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact</th>
                        <th>Location</th>
                        <th>Food Preferences</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.contact}</td>
                            <td>{user.location}</td>
                            <td>{user.foodPreferences}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => handleDeleteUser(user.id)} className="delete-button">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUser;
