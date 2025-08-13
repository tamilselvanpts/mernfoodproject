import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import Message from '../../components/Message';

const OrderPage = ({ restaurantId }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [currentOrder, setCurrentOrder] = useState([]);
    const [tableNumber, setTableNumber] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenu = async () => {
            if (!restaurantId) {
                setMessage('Restaurant ID not available. Please ensure you are logged in as an employee of a registered restaurant.');
                setMessageType('error');
                setLoading(false);
                return;
            }
            try {
                const res = await api.get(`/menu/${restaurantId}`);
                setMenuItems(res.data);
            } catch (err) {
                setMessage(`Error fetching menu: ${err.response?.data?.message || err.message}`);
                setMessageType('error');
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, [restaurantId]);

    const addToCart = (item) => {
        const existingItemIndex = currentOrder.findIndex(orderItem => orderItem.menuItem._id === item._id);
        if (existingItemIndex > -1) {
            const updatedOrder = [...currentOrder];
            updatedOrder[existingItemIndex].quantity += 1;
            setCurrentOrder(updatedOrder);
        } else {
            setCurrentOrder([...currentOrder, { menuItem: item, quantity: 1 }]);
        }
    };

    const updateQuantity = (index, delta) => {
        const updatedOrder = [...currentOrder];
        updatedOrder[index].quantity += delta;
        if (updatedOrder[index].quantity <= 0) {
            updatedOrder.splice(index, 1); // Remove if quantity is 0 or less
        }
        setCurrentOrder(updatedOrder);
    };

    const removeFromCart = (index) => {
        const updatedOrder = [...currentOrder];
        updatedOrder.splice(index, 1);
        setCurrentOrder(updatedOrder);
    };

    const sendOrderToChef = async () => {
        setMessage('');
        setMessageType('');
        if (!tableNumber || !customerName || currentOrder.length === 0) {
            setMessage('Please enter table number, customer name, and add items to the order.');
            setMessageType('error');
            return;
        }

        const itemsToSend = currentOrder.map(item => ({
            menuItem: item.menuItem._id,
            quantity: item.quantity,
        }));

        const totalAmount = currentOrder.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);

        try {
            await api.post(`/orders/${restaurantId}`, {
                tableNumber,
                customerName,
                items: itemsToSend,
                totalAmount,
            });
            setMessage('Order sent to chef successfully!');
            setMessageType('success');
            setCurrentOrder([]); // Clear cart
            setTableNumber('');
            setCustomerName('');
        } catch (err) {
            setMessage(`Error sending order: ${err.response?.data?.message || err.message}`);
            setMessageType('error');
        }
    };

    const calculateSubtotal = () => {
        return currentOrder.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
    };

    if (loading) return <div className="text-center p-8">Loading menu...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-4 flex flex-col lg:flex-row gap-4">
            {/* Menu Section */}
            <div className="flex-1 bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Restaurant Menu</h2>
                {error && <Message type="error" message={error} />}
                {menuItems.length === 0 ? (
                    <p className="text-center text-gray-600">No menu items available.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {menuItems.map((item) => (
                            <div key={item._id} className="bg-gray-50 rounded-xl shadow-md overflow-hidden">
                                {item.photo && <img src={item.photo} alt={item.name} className="w-full h-32 object-cover rounded-t-xl" />}
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{item.name}</h3>
                                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-green-600 font-bold text-lg">${item.price.toFixed(2)}</span>
                                        <button onClick={() => addToCart(item)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition duration-300">Add</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Current Order Section */}
            <div className="w-full lg:w-96 bg-white p-6 rounded-xl shadow-lg flex flex-col">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Current Order</h2>
                <div className="mb-4 space-y-3">
                    <div>
                        <label htmlFor="tableNumber" className="block text-gray-700 text-sm font-bold mb-1">Table Number:</label>
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
                        <label htmlFor="customerName" className="block text-gray-700 text-sm font-bold mb-1">Customer Name:</label>
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

                <div className="flex-1 overflow-y-auto border border-dashed border-gray-400 p-4 rounded-md mb-4">
                    {currentOrder.length === 0 ? (
                        <p className="text-center text-gray-600">No items in order yet.</p>
                    ) : (
                        <ul className="space-y-3">
                            {currentOrder.map((item, index) => (
                                <li key={item.menuItem._id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md shadow-sm">
                                    <div>
                                        <p className="font-semibold text-gray-800">{item.menuItem.name}</p>
                                        <p className="text-sm text-gray-600">${item.menuItem.price.toFixed(2)} x {item.quantity}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => updateQuantity(index, -1)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-sm">-</button>
                                        <span className="font-bold">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(index, 1)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md text-sm">+</button>
                                        <button onClick={() => removeFromCart(index)} className="bg-red-700 hover:bg-red-800 text-white px-2 py-1 rounded-md text-sm ml-2">Remove</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xl font-bold text-gray-800">Subtotal:</span>
                        <span className="text-xl font-bold text-green-700">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <button
                        onClick={sendOrderToChef}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg w-full transition duration-300"
                    >
                        Send Order to Chef
                    </button>
                    {currentOrder.length > 0 && (
                        <Link to="/cashier" state={{ orderItems: currentOrder, tableNumber, customerName, restaurantId, totalAmount: calculateSubtotal() }}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg w-full text-center block mt-2 transition duration-300">
                            Go to Bill (Cashier)
                        </Link>
                    )}
                </div>
                <Message type={messageType} message={message} />
            </div>
        </div>
    );
};

export default OrderPage;