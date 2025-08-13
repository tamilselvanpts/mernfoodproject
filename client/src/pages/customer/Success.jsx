import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Success.css';

const Success = () => {
    const navigate = useNavigate();
    const billNumber = localStorage.getItem("billNumber");
    const total = localStorage.getItem("lastPaidAmount");

    // Auto clear all data and redirect after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.removeItem("billData");
            localStorage.removeItem("billNumber");
            localStorage.removeItem("billDate");
            localStorage.removeItem("paymentStatus");
            localStorage.removeItem("lastPaidAmount");
            navigate('/menu');
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="success-page">
            <div className="success-animation">
                <div className="circle"></div>
                <div className="checkmark">&#10004;</div>
            </div>
            <h2>Payment Successful!</h2>
            <p>Your order <strong>{billNumber}</strong> has been confirmed.</p>
            <h3>Total Paid: ₹{Number(total).toFixed(2)}</h3>
            <p className="redirect-text">Redirecting to Menu...</p>
        </div>
    );
};

export default Success;
