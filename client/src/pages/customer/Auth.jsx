import React, { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import Message from '../../components/Message';
import '../style/Auth.css'; // Assuming you have some styles for this component

const Auth = () => {
    const { login, register } = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setMessageType('');
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                setMessage('Logged in successfully!');
                setMessageType('success');
            } else {
                await register(formData.name, formData.email, formData.password, formData.phone);
                setMessage('Registered successfully! Please log in.');
                setMessageType('success');
                setIsLogin(true); // Switch to login after successful registration
            }
        } catch (err) {
            setMessage(`Error: ${err.response?.data?.message || err.message}`);
            setMessageType('error');
        }
    };

    return (
    <div className="auth-wrapper">
        <div className="auth-card">
            <h2 className="auth-title">{isLogin ? 'Login' : 'Register'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div>
                        <label htmlFor="name" className="auth-label">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="auth-input"
                        />
                    </div>
                )}
                <div>
                    <label htmlFor="email" className="auth-label">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="auth-input"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="auth-label">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="auth-input"
                    />
                </div>
                {!isLogin && (
                    <div>
                        <label htmlFor="phone" className="auth-label">Phone Number:</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="auth-input"
                        />
                    </div>
                )}
                <button type="submit" className="auth-button">
                    {isLogin ? 'Login' : 'Register'}
                </button>
            </form>
            <Message type={messageType} message={message} />
            <p className="auth-switch">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Register here' : 'Login here'}
                </button>
            </p>
        </div>
    </div>
);

};

export default Auth;