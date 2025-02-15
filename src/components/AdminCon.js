import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminCon.css'; // Scoped CSS file

const AdminCon = () => {
  const [messages, setMessages] = useState([]);
  const [responseText, setResponseText] = useState({});
  const [successMessage, setSuccessMessage] = useState(''); // Success message state

  useEffect(() => {
    fetchMessages();
  }, []);

  // Fetch all contact messages
  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/contact');
      console.log('Fetched Messages:', response.data);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
    }
  };

  // Handle message response
  const handleResponseChange = (id, value) => {
    setResponseText(prev => ({ ...prev, [id]: value }));
  };

  const sendResponse = async (messageId) => {
    try {
      await axios.post(`http://localhost:8080/api/contact/${messageId}/response`, {  
        response: responseText[messageId]  
      });

      setSuccessMessage('Response sent successfully!'); // Show success message

      // Delete message from the database
      await axios.delete(`http://localhost:8080/api/contact/${messageId}`);

      // Refresh page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Error sending response:', error);
      setSuccessMessage('Failed to send response.');

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  return (
    <div className="admin-contact-container">
      <h2>Contact Messages</h2>

      {/* Success Message Popup */}
      {successMessage && (
        <div className="popup-box">
          <p>{successMessage}</p>
        </div>
      )}

      <div className="messages-grid">
        {messages.map(message => (
          <div key={message.id} className="message-card">
            <h3>{message.subject}</h3>
            <p><strong>From:</strong> {message.name} ({message.email})</p>
            <p>{message.message}</p>
            <textarea
              value={responseText[message.id] || ''}
              onChange={(e) => handleResponseChange(message.id, e.target.value)}
              placeholder="Write your response here..."
              className="response-textarea"
            ></textarea>
            <button
              onClick={() => sendResponse(message.id)}
              className="response-button"
            >
              Send Response
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCon;
