import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../api/api';
import Message from '../../components/Message';

const CashierPage = ({ restaurantId }) => {
    const location = useLocation();
    const { orderItems, tableNumber: initialTableNumber, customerName: initialCustomerName, totalAmount: initialTotalAmount, orderId: initialOrderId } = location.state || {};

    const [tableNumber, setTableNumber] = useState(initialTableNumber || '');
    const [customerName, setCustomerName] = useState(initialCustomerName || '');
    const [items, setItems] = useState(orderItems || []);
    const [gstPercentage, setGstPercentage] = useState(18); // Default GST
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState(initialOrderId || '');
    const [availableOrders, setAvailableOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        const fetchAvailableOrders = async () => {
            if (!restaurantId) {
                setMessage('Restaurant ID not available. Please ensure you are logged in as an employee of a registered restaurant.');
                setMessageType('error');
                setLoadingOrders(false);
                return;
            }
            try {
                // Fetch orders that are 'ready' or 'served' but not yet billed
                const res = await api.get(`/orders/${restaurantId}?status=ready`); // Assuming only 'ready' orders can be billed
                setAvailableOrders(res.data);
            } catch (err) {
                setMessage(`Error fetching available orders: ${err.response?.data?.message || err.message}`);
                setMessageType('error');
            } finally {
                setLoadingOrders(false);
            }
        };
        fetchAvailableOrders();
    }, [restaurantId]);

    useEffect(() => {
        if (selectedOrderId) {
            const order = availableOrders.find(o => o._id === selectedOrderId);
            if (order) {
                setTableNumber(order.tableNumber);
                setCustomerName(order.customerName);
                setItems(order.items.map(item => ({
                    menuItem: item.menuItem, // This will be the populated MenuItem object
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })));
            }
        } else if (!initialOrderId) { // Only clear if not coming from an order link
            setTableNumber('');
            setCustomerName('');
            setItems([]);
        }
    }, [selectedOrderId, availableOrders, initialOrderId]);


    const calculateSubtotal = () => {
        return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    };

    const calculateTotalWithTax = () => {
        const subtotal = calculateSubtotal();
        const taxAmount = subtotal * (gstPercentage / 100);
        return subtotal + taxAmount;
    };

    const handleGenerateBill = async () => {
        setMessage('');
        setMessageType('');
        if (!tableNumber || !customerName || items.length === 0) {
            setMessage('Please ensure table number, customer name, and items are filled.');
            setMessageType('error');
            return;
        }

        try {
            const billData = {
                tableNumber,
                customerName,
                items: items.map(item => ({
                    menuItem: item.menuItem._id, // Send only ID for DB
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                totalWithoutTax: calculateSubtotal(),
                gstPercentage,
                totalAmount: calculateTotalWithTax(),
                orderId: selectedOrderId || null // Link to order if generated from one
            };

            const res = await api.post(`/bills/generate-from-order/${selectedOrderId || 'manual'}`, billData); // Use orderId or 'manual'
            setMessage('Bill generated successfully!');
            setMessageType('success');
            // Clear form after successful bill generation
            setTableNumber('');
            setCustomerName('');
            setItems([]);
            setGstPercentage(18);
            setSelectedOrderId('');
            fetchAvailableOrders(); // Refresh available orders
        } catch (err) {
            setMessage(`Error generating bill: ${err.response?.data?.message || err.message}`);
            setMessageType('error');
        }
    };

    if (loadingOrders) return <div className="text-center p-8">Loading available orders...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-start">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl mt-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Generate Bill</h2>
                <Message type={messageType} message={message} />

                <div className="mb-6">
                    <label htmlFor="selectOrder" className="block text-gray-700 text-sm font-bold mb-2">Select an Order (Optional):</label>
                    <select
                        id="selectOrder"
                        value={selectedOrderId}
                        onChange={(e) => setSelectedOrderId(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                    >
                        <option value="">-- Manual Bill / Select Order --</option>
                        {availableOrders.map(order => (
                            <option key={order._id} value={order._id}>
                                Table {order.tableNumber} - {order.customerName} (Order ID: {order._id.substring(0, 8)}...)
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label htmlFor="tableNumber" className="block text-gray-700 text-sm font-bold mb-2">Table Number:</label>
                        <input
                            type="text"
                            id="tableNumber"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="customerName" className="block text-gray-700 text-sm font-bold mb-2">Customer Name:</label>
                        <input
                            type="text"
                            id="customerName"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                            required
                        />
                    </div>
                </div>

                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Items:</h3>
                {items.length === 0 ? (
                    <p className="text-gray-600 text-center mb-4">No items added to bill.</p>
                ) : (
                    <div className="overflow-x-auto mb-6">
                        <table className="min-w-full bg-white rounded-lg shadow-md">
                            <thead>
                                <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">Item</th>
                                    <th className="py-3 px-6 text-right">Price</th>
                                    <th className="py-3 px-6 text-center">Qty</th>
                                    <th className="py-3 px-6 text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {items.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-6 text-left">{item.name}</td>
                                        <td className="py-3 px-6 text-right">${item.price.toFixed(2)}</td>
                                        <td className="py-3 px-6 text-center">{item.quantity}</td>
                                        <td className="py-3 px-6 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="space-y-2 text-right mb-6">
                    <p className="text-lg text-gray-700">Subtotal: <span className="font-bold">${calculateSubtotal().toFixed(2)}</span></p>
                    <div className="flex justify-end items-center">
                        <label htmlFor="gst" className="text-lg text-gray-700 mr-2">GST (%):</label>
                        <input
                            type="number"
                            id="gst"
                            value={gstPercentage}
                            onChange={(e) => setGstPercentage(parseFloat(e.target.value))}
                            min="0"
                            max="100"
                            step="0.01"
                            className="shadow appearance-none border rounded py-1 px-2 w-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 text-right"
                        />
                    </div>
                    <p className="text-2xl font-bold text-green-700 border-t pt-4 mt-4">Total Amount: ${calculateTotalWithTax().toFixed(2)}</p>
                </div>

                <button
                    onClick={handleGenerateBill}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg w-full transition duration-300"
                >
                    Generate Bill
                </button>
            </div>
        </div>
    );
};

export default CashierPage;