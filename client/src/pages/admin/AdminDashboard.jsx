import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import api from '../../api/api';
import Message from '../../components/Message';
import '../style/AdminDashboard.css'; // Assuming you have some styles for this component
// Import Admin Sub-Components
import AdminMenu from './AdminMenu';
import BillHistory from './BillHistory';
import TableBookingAdmin from './TableBookingAdmin';
import EmployeeManagement from './EmployeeManagement';
import AddRole from './AddRole';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('details'); // Default tab
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    useEffect(() => {
        const fetchRestaurant = async () => {
            if (user && user.role === 'admin') {
                try {
                    const res = await api.get(`/restaurants/admin/${user._id}`);
                    setRestaurant(res.data);
                } catch (err) {
                    setError(err.response?.data?.message || err.message);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchRestaurant();
    }, [user]);

    const renderContent = () => {
        if (!restaurant) {
            return <p className="text-center text-yellow-600">No restaurant registered under your admin account. Please register one from your profile page.</p>;
        }

        switch (activeTab) {
            case 'details':
                return (
                    <div className="space-y-4">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Restaurant Details</h3>
                        <p><strong>Name:</strong> {restaurant.name}</p>
                        <p><strong>Address:</strong> {restaurant.address}</p>
                        <p><strong>Phone:</strong> {restaurant.phone}</p>
                        <p><strong>GST:</strong> {restaurant.gst || 'N/A'}</p>
                        {/* Add edit functionality here */}
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300">Edit Details (Coming Soon)</button>
                    </div>
                );
            case 'menu':
                return <AdminMenu restaurantId={restaurant._id} />;
            case 'bill-history':
                return <BillHistory restaurantId={restaurant._id} />;
            case 'table-bookings':
                return <TableBookingAdmin restaurantId={restaurant._id} />;
            case 'employees':
                return <EmployeeManagement restaurantId={restaurant._id} />;
            case 'add-role':
                return <AddRole restaurantId={restaurant._id} />;
            default:
                return null;
        }
    };

    if (loading) return <div className="text-center p-8">Loading admin dashboard...</div>;
    if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

   return (
        <div className="admin-container">
            {/* Left Navigation Bar */}
            <div className="nav-panel">
                <h3 className="nav-heading">Admin Panel</h3>
                <button
                    onClick={() => setActiveTab('details')}
                    className={`nav-button ${activeTab === 'details' ? 'nav-button-active' : ''}`}
                >
                    Restaurant Details
                </button>
                <button
                    onClick={() => setActiveTab('menu')}
                    className={`nav-button ${activeTab === 'menu' ? 'nav-button-active' : ''}`}
                >
                    Menu Management
                </button>
                <button
                    onClick={() => setActiveTab('bill-history')}
                    className={`nav-button ${activeTab === 'bill-history' ? 'nav-button-active' : ''}`}
                >
                    Bill History
                </button>
                <button
                    onClick={() => setActiveTab('table-bookings')}
                    className={`nav-button ${activeTab === 'table-bookings' ? 'nav-button-active' : ''}`}
                >
                    Table Bookings
                </button>
                <button
                    onClick={() => setActiveTab('employees')}
                    className={`nav-button ${activeTab === 'employees' ? 'nav-button-active' : ''}`}
                >
                    Employee Management
                </button>
                <button
                    onClick={() => setActiveTab('add-role')}
                    className={`nav-button ${activeTab === 'add-role' ? 'nav-button-active' : ''}`}
                >
                    Assign Employee Role
                </button>
            </div>

            {/* Content Area */}
            <div className="content-panel">
                {renderContent()}
                <Message type={messageType} message={message} />
            </div>
        </div>
    );
};

export default AdminDashboard;