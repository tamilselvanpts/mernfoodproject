import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import api from '../../api/api';
import Message from '../../components/Message';
import '../style/Profile.css';

const Profile = () => {
    const { user, setUser: updateUserInContext } = useContext(AuthContext);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [profileData, setProfileData] = useState({ name: '', email: '', phone: '', profilePicture: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('details');

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                profilePicture: user.profilePicture || 'https://placehold.co/100x100/aabbcc/ffffff?text=PP'
            });
            fetchBookings();
        }
    }, [user]);

    const fetchBookings = async () => {
        if (!user) return;
        try {
            const res = await api.get(`/bookings/customer/${user._id}`);
            setBookings(res.data);
        } catch (err) {
            setMessage(`Error fetching bookings: ${err.response?.data?.message || err.message}`);
            setMessageType('error');
        }
    };

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData({ ...profileData, profilePicture: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage('');
        setMessageType('');
        try {
            const res = await api.put(`/users/profile`, profileData);
            updateUserInContext(res.data);
            setMessage('Profile updated successfully!');
            setMessageType('success');
            setIsEditing(false);
        } catch (err) {
            setMessage(`Error updating profile: ${err.response?.data?.message || err.message}`);
            setMessageType('error');
        }
    };

    if (!user) {
        return <div className="not-logged-in">Please log in to view your profile.</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2 className="profile-title">Your Profile</h2>

                {user.role === 'customer' && (
                    <div className="register-link">
                        <Link to="/register-restaurant" className="register-button">
                            Register Restaurant (Become Admin)
                        </Link>
                    </div>
                )}

                <div className="tab-switch">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
                    >
                        Profile Details
                    </button>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
                    >
                        Table Booking History
                    </button>
                </div>

                {activeTab === 'details' && (
                    <div className="details-tab">
                        <div className="profile-image-section">
                            <img src={profileData.profilePicture} alt="Profile" className="profile-picture" />
                            {isEditing && <input type="file" accept="image/*" onChange={handleProfilePictureChange} />}
                        </div>
                        <form onSubmit={handleUpdateProfile} className="profile-form">
                            <div>
                                <label htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={profileData.name}
                                    onChange={handleProfileChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={profileData.email}
                                    disabled
                                />
                            </div>
                            <div>
                                <label htmlFor="phone">Phone Number:</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleProfileChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            {isEditing ? (
                                <div className="edit-action-buttons">
                                    <button type="submit" className="save-button">Save Changes</button>
                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button type="button" className="edit-button" onClick={() => setIsEditing(true)}>
                                    Edit Profile
                                </button>
                            )}
                        </form>
                    </div>
                )}

                {activeTab === 'bookings' && (
                    <div className="bookings-tab">
                        <h3 className="profile-title">Your Table Bookings</h3>
                        {bookings.length === 0 ? (
                            <p className="no-bookings">No table bookings found.</p>
                        ) : (
                            <div className="bookings-table-wrapper">
                                <table className="bookings-table">
                                    <thead>
                                        <tr>
                                            <th>Restaurant</th>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Guests</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map((booking) => (
                                            <tr key={booking._id}>
                                                <td>{booking.restaurant?.name || 'N/A'}</td>
                                                <td>{new Date(booking.date).toLocaleDateString()}</td>
                                                <td>{booking.time}</td>
                                                <td>{booking.guests}</td>
                                                <td>
                                                    <span className={`status ${booking.status}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                <Message type={messageType} message={message} />
            </div>
        </div>
    );
};

export default Profile;
