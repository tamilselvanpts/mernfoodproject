import React, { useState, useContext } from 'react';
import api from '../../api/api';
import AuthContext from '../../context/AuthContext';
import Message from '../../components/Message';
import '../style/AddRole.css'; // Assuming you have some styles for this component

const AddRole = ({ restaurantId }) => {
    const { user } = useContext(AuthContext); // Current admin user
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('waiter');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setMessageType('');
        if (!restaurantId) {
            setMessage('Admin must have a registered restaurant to assign roles.');
            setMessageType('error');
            return;
        }
        try {
            await api.put('/users/update-role', { email, newRole: role, restaurantId });
            setMessage(`Role for ${email} updated to ${role} successfully!`);
            setMessageType('success');
            setEmail('');
        } catch (err) {
            setMessage(`Error: ${err.response?.data?.message || err.message}`);
            setMessageType('error');
        }
    };

  return (
        <div className="role-container">
            <h2 className="role-heading">Assign Role to Existing User</h2>
            <form onSubmit={handleSubmit} className="role-form">
                <div className="input-group">
                    <label htmlFor="userEmail" className="input-label">User Email:</label>
                    <input
                        type="email"
                        id="userEmail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input-field"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="newRole" className="input-label">Assign Role:</label>
                    <select
                        id="newRole"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="select-field"
                    >
                        <option value="waiter">Waiter</option>
                        <option value="chef">Chef</option>
                        <option value="cashier">Cashier</option>
                        <option value="customer">Customer (Remove role)</option>
                    </select>
                </div>
                <button type="submit" className="submit-btn">
                    Assign Role
                </button>
            </form>
            <Message type={messageType} message={message} />
        </div>
    );
};

export default AddRole;