import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import Message from '../../components/Message';
import '../style/TableBooking.css'; // Assuming you have some styles for this component

const TableBookingAdmin = ({ restaurantId }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('upcoming'); // 'upcoming', 'past'
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    useEffect(() => {
        if (restaurantId) {
            fetchBookings();
        }
    }, [restaurantId, filter]);

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`/bookings/restaurant/${restaurantId}?filter=${filter}`);
            setBookings(res.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateBookingStatus = async (bookingId, newStatus) => {
        setMessage('');
        setMessageType('');
        if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) {
            return;
        }
        try {
            await api.put(`/bookings/${bookingId}/update-status`, { status: newStatus });
            setMessage(`Booking status updated to ${newStatus} successfully!`);
            setMessageType('success');
            fetchBookings(); // Refresh list
        } catch (err) {
            setMessage(`Error updating status: ${err.response?.data?.message || err.message}`);
            setMessageType('error');
        }
    };

    if (loading) return <div className="text-center p-8">Loading table bookings...</div>;
    if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Table Bookings</h2>
            <div className="flex flex-wrap gap-4 mb-4">
                <button onClick={() => setFilter('upcoming')} className={`px-4 py-2 rounded-lg transition duration-300 ${filter === 'upcoming' ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>Upcoming</button>
                <button onClick={() => setFilter('past')} className={`px-4 py-2 rounded-lg transition duration-300 ${filter === 'past' ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>Past</button>
            </div>
            <Message type={messageType} message={message} />

            {bookings.length === 0 ? (
                <p className="text-gray-600 text-center">No {filter} bookings found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Customer</th>
                                <th className="py-3 px-6 text-left">Date</th>
                                <th className="py-3 px-6 text-left">Time</th>
                                <th className="py-3 px-6 text-left">Guests</th>
                                <th className="py-3 px-6 text-left">Status</th>
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {bookings.map((booking) => (
                                <tr key={booking._id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left whitespace-nowrap">{booking.customer?.name || 'N/A'}</td>
                                    <td className="py-3 px-6 text-left">{new Date(booking.date).toLocaleDateString()}</td>
                                    <td className="py-3 px-6 text-left">{booking.time}</td>
                                    <td className="py-3 px-6 text-left">{booking.guests}</td>
                                    <td className="py-3 px-6 text-left">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            booking.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                                            booking.status === 'confirmed' ? 'bg-green-200 text-green-800' :
                                            'bg-red-200 text-red-800'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        {filter === 'upcoming' && booking.status === 'pending' && (
                                            <div className="flex justify-center space-x-2">
                                                <button onClick={() => updateBookingStatus(booking._id, 'confirmed')} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs">Confirm</button>
                                                <button onClick={() => updateBookingStatus(booking._id, 'cancelled')} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs">Cancel</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TableBookingAdmin;