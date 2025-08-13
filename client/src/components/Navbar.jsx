import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../pages/style/Navbar.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <img src="./logo.png" alt="Annam FOOD " className="navbar-logo" />
                <Link to="/" className="navbar-text">Annam FOOD</Link>
                
                {/* Mobile Menu Button */}
                <div className="mobile-toggle">
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                        className="menu-button"
                    >
                        <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/>
                        </svg>
                    </button>
                </div>

                {/* Menu List */}
                <ul className={`menu-list ${isMobileMenuOpen ? 'open' : ''}`}>
                    <li><Link to="/" className="menu-link">Home</Link></li>
                    <li><Link to="/menu" className="menu-link">Menu</Link></li>
                    <li><Link to="/table-booking" className="menu-link">Book Table</Link></li>
                    <li><Link to="/cart" className="menu-link">Cart</Link></li>

                    {user ? (
                        <>
                            <li><Link to="/profile" className="menu-link">Profile</Link></li>
                            {user.role === 'admin' && (
                                <li><Link to="/admin" className="menu-link">Admin Dashboard</Link></li>
                            )}
                            {user.role === 'waiter' && (
                                <li><Link to="/orders" className="menu-link">Orders</Link></li>
                            )}
                            {user.role === 'chef' && (
                                <li><Link to="/chef" className="menu-link">Chef</Link></li>
                            )}
                            {user.role === 'cashier' && (
                                <li><Link to="/cashier" className="menu-link">Cashier</Link></li>
                            )}
                            <li>
                                <button onClick={logout} className="logout-button">Logout</button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to="/auth" className="login-button">Login / Register</Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;

