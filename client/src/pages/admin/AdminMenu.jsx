import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import Message from '../../components/Message';
import '../style/AdminMenu.css'; // Assuming you have some styles for this component

const AdminMenu = ({ restaurantId }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({ _id: '', name: '', photo: '', description: '', price: '', review: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    useEffect(() => {
        if (restaurantId) {
            fetchMenuItems();
        }
    }, [restaurantId]);

    const fetchMenuItems = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`/menu/${restaurantId}`);
            setMenuItems(res.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm({ ...form, photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setMessageType('');
        try {
            if (isEditing) {
                await api.put(`/menu/${restaurantId}/${form._id}`, { ...form, price: parseFloat(form.price) });
                setMessage('Menu item updated successfully!');
                setMessageType('success');
            } else {
                await api.post(`/menu/${restaurantId}/add`, { ...form, price: parseFloat(form.price) });
                setMessage('Menu item added successfully!');
                setMessageType('success');
            }
            setForm({ _id: '', name: '', photo: '', description: '', price: '', review: '' });
            setIsEditing(false);
            fetchMenuItems(); // Refresh list
        } catch (err) {
            setMessage(`Error: ${err.response?.data?.message || err.message}`);
            setMessageType('error');
        }
    };

    const handleEdit = (item) => {
        setForm(item);
        setIsEditing(true);
    };

    const handleDelete = async (itemId) => {
        setMessage('');
        setMessageType('');
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.delete(`/menu/${restaurantId}/${itemId}`);
                setMessage('Menu item deleted successfully!');
                setMessageType('success');
                fetchMenuItems(); // Refresh list
            } catch (err) {
                setMessage(`Error: ${err.response?.data?.message || err.message}`);
                setMessageType('error');
            }
        }
    };

    if (loading) return <div className="text-center p-8">Loading menu management...</div>;
    if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

   return (
        <div className="menu-container">
            <h2 className="form-heading">{isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
            <form onSubmit={handleSubmit} className="menu-form">
                <div className="form-group">
                    <label htmlFor="name" className="form-label">Item Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="price" className="form-label">Price:</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        step="0.01"
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description" className="form-label">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows="3"
                        className="form-textarea"
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="review" className="form-label">Review:</label>
                    <input
                        type="text"
                        id="review"
                        name="review"
                        value={form.review}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="photo" className="form-label">Photo:</label>
                    <input
                        type="file"
                        id="photo"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="form-file-input"
                    />
                    {form.photo && <img src={form.photo} alt="Preview" className="preview-image" />}
                </div>
                <button type="submit" className="submit-button">
                    {isEditing ? 'Update Item' : 'Add Item'}
                </button>
                {isEditing && (
                    <button
                        type="button"
                        onClick={() => {
                            setIsEditing(false);
                            setForm({ _id: '', name: '', photo: '', description: '', price: '', review: '' });
                        }}
                        className="cancel-button"
                    >
                        Cancel Edit
                    </button>
                )}
            </form>
            <Message type={messageType} message={message} />

            <h3 className="menu-heading">Current Menu</h3>
            {menuItems.length === 0 ? (
                <p className="empty-message">No menu items added yet.</p>
            ) : (
                <div className="menu-grid">
                    {menuItems.map((item) => (
                        <div key={item._id} className="menu-card">
                            {item.photo && <img src={item.photo} alt={item.name} className="menu-image" />}
                            <div className="menu-content">
                                <h4 className="menu-item-title">{item.name}</h4>
                                <p className="menu-item-description">{item.description}</p>
                                <p className="menu-item-price">₹{item.price.toFixed(2)}</p>
                                <div className="menu-item-actions">
                                    <button onClick={() => handleEdit(item)} className="edit-button">Edit</button>
                                    <button onClick={() => handleDelete(item._id)} className="delete-button">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminMenu;