import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/api';
import AuthContext from '../../context/AuthContext';
import Message from '../../components/Message';
import '../style/TableBooking.css';

const TableBooking = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({ date: '', time: '', guests: '', restaurantId: '' });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const res = await api.get('/restaurants');
                setRestaurants(res.data);
            } catch (err) {
                setMessage(`Error fetching restaurants: ${err.response?.data?.message || err.message}`);
                setMessageType('error');
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setMessageType('');

        // if (!user) {
        //     setMessage('Please log in to book a table.');
        //     setMessageType('error');
        //     return;
        // }

        try {
            await api.post('/bookings', { ...formData, customerId: user._id });
            setMessage('Table booked successfully!');
            setMessageType('success');
            setFormData({ date: '', time: '', guests: '', restaurantId: '' });
        } catch (err) {
            setMessage(`Error booking table: ${err.response?.data?.message || err.message}`);
            setMessageType('error');
        }
    };

    if (loading) return <div className="loading">Loading restaurants...</div>;

    return (
        <div className="table-booking-container">
            <div className="table-booking-card">
                <h2 className="booking-title">Book a Table</h2>

                <form onSubmit={handleSubmit} className="booking-form">
                    {/* Restaurant */}
                    <div>
                        <label htmlFor="restaurantId" className="form-label">
                            Select Restaurant:
                        </label>
                        <select
                            id="restaurantId"
                            name="restaurantId"
                            value={formData.restaurantId}
                            onChange={handleChange}
                            required
                            className="form-select"
                        >
                            <option value="">-- Select a Restaurant --</option>
                            {restaurants.map(res => (
                                <option key={res._id} value={res._id}>{res.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Date */}
                    <div>
                        <label htmlFor="date" className="form-label">
                            Date:
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    {/* Time */}
                    <div>
                        <label htmlFor="time" className="form-label">
                            Time:
                        </label>
                        <input
                            type="time"
                            id="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    {/* Guests */}
                    <div>
                        <label htmlFor="guests" className="form-label">
                            Number of Guests:
                        </label>
                        <input
                            type="number"
                            id="guests"
                            name="guests"
                            value={formData.guests}
                            onChange={handleChange}
                            min="1"
                            required
                            className="form-input"
                        />
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="submit-button">
                        Book Now
                    </button>
                </form>

                {/* Messages */}
                <div className="message-container">
                    <Message type={messageType} message={message} />
                </div>
            </div>
        </div>
    );
};

export default TableBooking;
