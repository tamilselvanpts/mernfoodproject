import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import AuthContext from '../../context/AuthContext';
import Message from '../../components/Message';
import '../style/RegisterRestaurant.css'; // Assuming you have some styles for this component

const RegisterRestaurant = () => {
    const { user, setUser: updateUserInContext } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', address: '', phone: '', gst: '', menuItems: [] });
    const [menuItemData, setMenuItemData] = useState({ name: '', photo: '', description: '', price: '' });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleRestaurantChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleMenuItemChange = (e) => {
        setMenuItemData({ ...menuItemData, [e.target.name]: e.target.value });
    };

    const handleMenuItemPhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setMenuItemData({ ...menuItemData, photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const addMenuItem = () => {
        setMessage('');
        setMessageType('');
        if (menuItemData.name && menuItemData.price) {
            setFormData({
                ...formData,
                menuItems: [...formData.menuItems, { ...menuItemData, price: parseFloat(menuItemData.price) }],
            });
            setMenuItemData({ name: '', photo: '', description: '', price: '' }); // Clear item form
        } else {
            setMessage('Menu item name and price are required.');
            setMessageType('error');
        }
    };

    const removeMenuItem = (index) => {
        const updatedMenuItems = formData.menuItems.filter((_, i) => i !== index);
        setFormData({ ...formData, menuItems: updatedMenuItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setMessageType('');
        if (!user) {
            setMessage('You must be logged in to register a restaurant.');
            setMessageType('error');
            return;
        }

        try {
            const res = await api.post('/restaurants/register', { ...formData, owner: user._id });
            // Update user role to admin in frontend context and localStorage
            updateUserInContext(res.data.user);
            setMessage('Restaurant registered and your role updated to Admin successfully!');
            setMessageType('success');
            setFormData({ name: '', address: '', phone: '', gst: '', menuItems: [] }); // Clear form
            navigate('/admin'); // Navigate to admin dashboard
        } catch (err) {
            setMessage(`Error registering restaurant: ${err.response?.data?.message || err.message}`);
            setMessageType('error');
        }
    };

    if (user && user.role === 'admin') {
        return <div className="text-center p-8 text-green-600">You are already an Admin and own a restaurant.</div>;
    }

    return (
        <div className="register-container">
            <div className="form-card">
                <h2 className="form-heading">Register Your Restaurant</h2>
                <form onSubmit={handleSubmit} className="register-form">
                    {/* <div className="form-grid">
                        <div>
                            <label htmlFor="name" className="form-label">Restaurant Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleRestaurantChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="form-label">Address:</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleRestaurantChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="form-label">Phone Number:</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleRestaurantChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <div>
                            <label htmlFor="gst" className="form-label">GST Number:</label>
                            <input
                                type="text"
                                id="gst"
                                name="gst"
                                value={formData.gst}
                                onChange={handleRestaurantChange}
                                className="form-input"
                            />
                        </div>
                    </div> */}

                    <div className="menu-items-section">
                        <h3 className="menu-items-heading">Add Menu Items</h3>
                        <div className="form-grid menu-items-grid">
                            <div>
                                <label htmlFor="menuItemName" className="form-label">Item Name:</label>
                                <input
                                    type="text"
                                    id="menuItemName"
                                    name="name"
                                    value={menuItemData.name}
                                    onChange={handleMenuItemChange}
                                    className="form-input"
                                />
                            </div>
                            <div>
                                <label htmlFor="menuItemPrice" className="form-label">Price:</label>
                                <input
                                    type="number"
                                    id="menuItemPrice"
                                    name="price"
                                    value={menuItemData.price}
                                    onChange={handleMenuItemChange}
                                    step="0.01"
                                    className="form-input"
                                />
                            </div>
                            <div className="full-width">
                                <label htmlFor="menuItemDescription" className="form-label">Description:</label>
                                <textarea
                                    id="menuItemDescription"
                                    name="description"
                                    value={menuItemData.description}
                                    onChange={handleMenuItemChange}
                                    rows="2"
                                    className="form-textarea"
                                ></textarea>
                            </div>
                            <div className="full-width">
                                <label htmlFor="menuItemPhoto" className="form-label">Photo:</label>
                                <input
                                    type="file"
                                    id="menuItemPhoto"
                                    accept="image/*"
                                    onChange={handleMenuItemPhotoChange}
                                    className="form-file-input"
                                />
                                {menuItemData.photo && (
                                    <img src={menuItemData.photo} alt="Preview" className="preview-image" />
                                )}
                            </div>
                        </div>
                        <button type="button" onClick={addMenuItem} className="add-item-button">
                            Add Menu Item
                        </button>

                        {formData.menuItems.length > 0 && (
                            <div className="current-items-section">
                                <h4 className="current-items-heading">Current Menu Items:</h4>
                                <ul className="menu-item-list">
                                    {formData.menuItems.map((item, index) => (
                                        <li key={index} className="menu-item">
                                            <span>{item.name} - ${item.price.toFixed(2)}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeMenuItem(index)}
                                                className="remove-button"
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <button type="submit" className="submit-button">
                        Register Restaurant
                    </button>
                </form>
                <Message type={messageType} message={message} />
            </div>
        </div>
    );
};

export default RegisterRestaurant;