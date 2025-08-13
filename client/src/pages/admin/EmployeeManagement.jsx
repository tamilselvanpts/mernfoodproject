import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import Message from '../../components/Message';
import '../style/Employeemange.css'; // Assuming you have some styles for this component
const EmployeeManagement = ({ restaurantId }) => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({ _id: '', name: '', age: '', salary: '', bonus: '', email: '', role: 'waiter', password: '', image: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    useEffect(() => {
        if (restaurantId) {
            fetchEmployees();
        }
    }, [restaurantId]);

    const fetchEmployees = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`/employees/${restaurantId}`);
            setEmployees(res.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm({ ...form, image: reader.result });
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
                await api.put(`/employees/${restaurantId}/${form._id}`, form);
                setMessage('Employee updated successfully!');
                setMessageType('success');
            } else {
                await api.post(`/employees/${restaurantId}/add`, form);
                setMessage('Employee added successfully!');
                setMessageType('success');
            }
            setForm({ _id: '', name: '', age: '', salary: '', bonus: '', email: '', role: 'waiter', password: '', image: '' });
            setIsEditing(false);
            fetchEmployees(); // Refresh list
        } catch (err) {
            setMessage(`Error: ${err.response?.data?.message || err.message}`);
            setMessageType('error');
        }
    };

    const handleEdit = (employee) => {
        setForm({ ...employee, password: '' }); // Don't pre-fill password for security
        setIsEditing(true);
    };

    const handleDelete = async (employeeId) => {
        setMessage('');
        setMessageType('');
        if (window.confirm('Are you sure you want to delete this employee? This will also downgrade their user account to customer role.')) {
            try {
                await api.delete(`/employees/${restaurantId}/${employeeId}`);
                setMessage('Employee deleted successfully!');
                setMessageType('success');
                fetchEmployees(); // Refresh list
            } catch (err) {
                setMessage(`Error: ${err.response?.data?.message || err.message}`);
                setMessageType('error');
            }
        }
    };

    if (loading) return <div className="text-center p-8">Loading employees...</div>;
    if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

   

    return (
        <div className="employee-container">
            <h2 className="form-heading">{isEditing ? 'Edit Employee' : 'Add New Employee'}</h2>
            <form onSubmit={handleSubmit} className="employee-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">Name:</label>
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
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password {isEditing ? '(leave blank to keep current)' : '*'}:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required={!isEditing}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role" className="form-label">Role:</label>
                        <select
                            id="role"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="waiter">Waiter</option>
                            <option value="chef">Chef</option>
                            <option value="cashier">Cashier</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="age" className="form-label">Age:</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={form.age}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="salary" className="form-label">Salary:</label>
                        <input
                            type="number"
                            id="salary"
                            name="salary"
                            value={form.salary}
                            onChange={handleChange}
                            step="0.01"
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bonus" className="form-label">Bonus:</label>
                        <input
                            type="number"
                            id="bonus"
                            name="bonus"
                            value={form.bonus}
                            onChange={handleChange}
                            step="0.01"
                            className="form-input"
                        />
                    </div>
                    <div className="form-group form-group-full">
                        <label htmlFor="image" className="form-label">Image:</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="form-file-input"
                        />
                        {form.image && <img src={form.image} alt="Preview" className="preview-image" />}
                    </div>
                </div>
                <button type="submit" className="submit-button">
                    {isEditing ? 'Update Employee' : 'Add Employee'}
                </button>
                {isEditing && (
                    <button
                        type="button"
                        onClick={() => {
                            setIsEditing(false);
                            setForm({ _id: '', name: '', age: '', salary: '', bonus: '', email: '', role: 'waiter', password: '', image: '' });
                        }}
                        className="cancel-button"
                    >
                        Cancel Edit
                    </button>
                )}
            </form>
            <Message type={messageType} message={message} />

            <h3 className="employee-heading">Current Employees</h3>
            {employees.length === 0 ? (
                <p className="empty-message">No employees added yet.</p>
            ) : (
                <div className="table-container">
                    <table className="employee-table">
                        <thead>
                            <tr className="table-header">
                                <th className="table-cell table-cell-left">Image</th>
                                <th className="table-cell table-cell-left">Name</th>
                                <th className="table-cell table-cell-left">Email</th>
                                <th className="table-cell table-cell-left">Role</th>
                                <th className="table-cell table-cell-left">Salary</th>
                                <th className="table-cell table-cell-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp._id} className="table-row">
                                    <td className="table-cell table-cell-left">
                                        <img
                                            src={emp.image || 'https://placehold.co/50x50/cccccc/ffffff?text=Emp'}
                                            alt={emp.name}
                                            className="employee-image"
                                        />
                                    </td>
                                    <td className="table-cell table-cell-left">{emp.name}</td>
                                    <td className="table-cell table-cell-left">{emp.user?.email || emp.email}</td>
                                    <td className="table-cell table-cell-left capitalize">{emp.role}</td>
                                    <td className="table-cell table-cell-left">${emp.salary?.toFixed(2) || '0.00'}</td>
                                    <td className="table-cell table-cell-center">
                                        <div className="action-buttons">
                                            <button onClick={() => handleEdit(emp)} className="edit-button">Edit</button>
                                            <button onClick={() => handleDelete(emp._id)} className="delete-button">Delete</button>
                                        </div>
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

export default EmployeeManagement;