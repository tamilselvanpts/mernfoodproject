import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import Message from '../../components/Message';

const ChefPage = ({ restaurantId }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    useEffect(() => {
        if (restaurantId) {
            fetchOrders();
            // Optional: Set up an interval to refresh orders periodically
            const interval = setInterval(fetchOrders, 30000); // Refresh every 30 seconds
            return () => clearInterval(interval);
        }
    }, [restaurantId]);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            // Chef typically sees pending and preparing orders
            const pendingOrders = await api.get(`/orders/${restaurantId}?status=pending`);
            const preparingOrders = await api.get(`/orders/${restaurantId}?status=preparing`);
            setOrders([...pendingOrders.data, ...preparingOrders.data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        setMessage('');
        setMessageType('');
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            setMessage(`Order ${orderId.substring(0, 8)}... status updated to ${newStatus}!`);
            setMessageType('success');
            fetchOrders(); // Refresh orders after update
        } catch (err) {
            setMessage(`Error updating order status: ${err.response?.data?.message || err.message}`);
            setMessageType('error');
        }
    };

    if (loading) return <div className="text-center p-8">Loading orders for chef...</div>;
    if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Chef's Order Board</h2>
            <Message type={messageType} message={message} />

            {orders.length === 0 ? (
                <p className="text-center text-gray-600">No pending or preparing orders.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Table: {order.tableNumber} - {order.customerName}</h3>
                                <p className="text-sm text-gray-600 mb-4">Order ID: {order._id.substring(0, 8)}... | Placed: {new Date(order.createdAt).toLocaleTimeString()}</p>
                                <div className="border-b border-gray-300 pb-4 mb-4">
                                    <h4 className="text-xl font-semibold text-gray-700 mb-2">Items:</h4>
                                    <ul className="space-y-2">
                                        {order.items.map((item, idx) => (
                                            <li key={idx} className="flex justify-between items-center text-gray-600 text-sm">
                                                <span>{item.name}</span>
                                                <span className="font-medium">x{item.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className={`text-lg font-bold capitalize mb-4 ${
                                    order.status === 'pending' ? 'text-red-600' :
                                    order.status === 'preparing' ? 'text-yellow-600' :
                                    'text-green-600'
                                }`}>
                                    Status: {order.status}
                                </p>
                                <div className="flex space-x-2">
                                    {order.status === 'pending' && (
                                        <button onClick={() => updateOrderStatus(order._id, 'preparing')} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition duration-300 flex-1">
                                            Start Preparing
                                        </button>
                                    )}
                                    {order.status === 'preparing' && (
                                        <button onClick={() => updateOrderStatus(order._id, 'ready')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-300 flex-1">
                                            Mark as Ready
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChefPage;