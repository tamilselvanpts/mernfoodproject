// import React, { useState, useEffect } from 'react';
// import '../style/Payment.css';
// import { useNavigate, useLocation } from 'react-router-dom';

// const Payment = () => {
//     const [selectedOption, setSelectedOption] = useState('');
//     const [formData, setFormData] = useState({});
//     const [showAmountAnim, setShowAmountAnim] = useState(false);
//     const navigate = useNavigate();
//     const location = useLocation();

//     // Get total amount from Bill page
//     const totalAmount = location.state?.totalAmount || 0;

//     useEffect(() => {
//         setShowAmountAnim(true);
//         const timer = setTimeout(() => setShowAmountAnim(false), 30000);
//         return () => clearTimeout(timer);
//     }, []);

//     const handlePay = () => {
//         if (!selectedOption) {
//             alert("Please select a payment option!");
//             return;
//         }

//         // Validation for specific methods
//         if (selectedOption === 'UPI' && !formData.upiId) {
//             alert("Please enter a valid UPI ID!");
//             return;
//         }
//         if (selectedOption === 'Card' && (!formData.cardNumber || !formData.expiry || !formData.cvv)) {
//             alert("Please fill in all card details!");
//             return;
//         }
//         if (selectedOption === 'NetBanking' && !formData.bank) {
//             alert("Please select your bank!");
//             return;
//         }
//         if (selectedOption === 'Wallets' && !formData.wallet) {
//             alert("Please enter your wallet number!");
//             return;
//         }

//         // Store payment success and redirect
//         localStorage.setItem("paymentStatus", "success");
//         localStorage.setItem("lastPaidAmount", totalAmount);

//         // Navigate to success animation
//         navigate('/success');
//     };

//     const handleCancel = () => {
//         navigate('/menu');
//     };

//     return (
//         <div className="payment-container">
//             <h2 className="payment-title">💳 Choose Your Payment Method</h2>

//             {/* Amount popup */}
//             {showAmountAnim && (
//                 <div className="amount-popup">
//                     Total Amount: <span>₹{totalAmount.toFixed(2)}</span>
//                 </div>
//             )}

//             {/* Payment options */}
//             <div className="payment-options">
//                 {['UPI', 'Card', 'NetBanking', 'Wallets'].map((method) => (
//                     <label key={method} className="option-label">
//                         <input
//                             type="radio"
//                             value={method}
//                             checked={selectedOption === method}
//                             onChange={(e) => {
//                                 setSelectedOption(e.target.value);
//                                 setFormData({});
//                             }}
//                         />
//                         <span className="radio-custom"></span>
//                         {method === 'UPI' && 'UPI (Google Pay / PhonePe / Paytm)'}
//                         {method === 'Card' && 'Credit / Debit Card'}
//                         {method === 'NetBanking' && 'Net Banking'}
//                         {method === 'Wallets' && 'Wallets (Paytm, Amazon Pay)'}
                        
//                     </label>
//                 ))}
//             </div>

//             {/* Payment form */}
//             <div className="payment-form">
//                 {selectedOption === 'UPI' && (
//                     <div>
//                         <label>UPI ID:</label>
//                         <input
//                             type="text"
//                             placeholder="example@upi"
//                             value={formData.upiId || ''}
//                             onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
//                         />
//                     </div>
//                 )}
//                 {selectedOption === 'Card' && (
//                     <div>
//                         <label>Card Number:</label>
//                         <input
//                             type="text"
//                             maxLength="16"
//                             placeholder="1234 5678 9101 1121"
//                             value={formData.cardNumber || ''}
//                             onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
//                         />
//                         <label>Expiry Date:</label>
//                         <input
//                             type="month"
//                             value={formData.expiry || ''}
//                             onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
//                         />
//                         <label>CVV:</label>
//                         <input
//                             type="password"
//                             maxLength="3"
//                             value={formData.cvv || ''}
//                             onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
//                         />
//                     </div>
//                 )}
//                 {selectedOption === 'NetBanking' && (
//                     <div>
//                         <label>Select Bank:</label>
//                         <select
//                             value={formData.bank || ''}
//                             onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
//                         >
//                             <option value="">-- Select Bank --</option>
//                             <option value="SBI">SBI</option>
//                             <option value="ICICI">ICICI</option>
//                             <option value="HDFC">HDFC</option>
//                         </select>
//                     </div>
//                 )}
//                 {selectedOption === 'Wallets' && (
//                     <div>
//                         <label>Wallet Number:</label>
//                         <input
//                             type="text"
//                             placeholder="Enter wallet number"
//                             value={formData.wallet || ''}
//                             onChange={(e) => setFormData({ ...formData, wallet: e.target.value })}
//                         />
//                     </div>
//                 )}
               
//             </div>

//             {/* Buttons */}
//             <div className="payment-buttons">
//                 <button className="cancel-btn" onClick={handleCancel}>❌ Cancel</button>
//                 <button className="confirm-pay-btn" onClick={handlePay}>✅ Confirm & Pay</button>
//             </div>
//         </div>
//     );
// };

// export default Payment;

import React, { useState, useEffect } from 'react';
import '../style/Payment.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
    const [selectedOption, setSelectedOption] = useState('');
    const [formData, setFormData] = useState({});
    const [showAmountAnim, setShowAmountAnim] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const totalAmount = location.state?.totalAmount || 0;

    useEffect(() => {
        const timer = setTimeout(() => setShowAmountAnim(false), 30000);
        return () => clearTimeout(timer);
    }, []);

    const handlePay = async () => {
        if (!selectedOption) return alert("Please select a payment option!");

        if (selectedOption === 'UPI' && !formData.upiId) return alert("Please enter a valid UPI ID!");
        if (selectedOption === 'Card' && (!formData.cardNumber || !formData.expiry || !formData.cvv))
            return alert("Please fill in all card details!");
        if (selectedOption === 'NetBanking' && !formData.bank) return alert("Please select your bank!");
        if (selectedOption === 'Wallets' && !formData.wallet) return alert("Please enter your wallet number!");

        // Save to backend
        try {
            await axios.post('http://localhost:5000/api/payments', {
                method: selectedOption,
                details: formData,
                amount: totalAmount,
            });

            localStorage.setItem("paymentStatus", "success");
            localStorage.setItem("lastPaidAmount", totalAmount);
            navigate('/success');
        } catch (error) {
            alert("Payment failed. Try again.");
        }
    };

    const handleCancel = () => {
        navigate('/menu');
    };

    return (
        <div className="payment-container">
            <h2 className="payment-title">💳 Choose Your Payment Method</h2>

            {showAmountAnim && (
                <div className="amount-popup always-show">
                    Total Amount: <span>₹{totalAmount.toFixed(2)}</span>
                </div>
            )}

            <div className="payment-options">
                {['UPI', 'Card', 'NetBanking', 'Wallets'].map((method) => (
                    <label key={method} className="option-label">
                        <input
                            type="radio"
                            value={method}
                            checked={selectedOption === method}
                            onChange={(e) => {
                                setSelectedOption(e.target.value);
                                setFormData({});
                            }}
                        />
                        <span className="radio-custom"></span>
                        {method === 'UPI' && 'UPI (Google Pay / PhonePe / Paytm)'}
                        {method === 'Card' && 'Credit / Debit Card'}
                        {method === 'NetBanking' && 'Net Banking'}
                        {method === 'Wallets' && 'Wallets (Paytm, Amazon Pay)'}
                    </label>
                ))}
            </div>

            <div className="payment-form">
                {selectedOption === 'UPI' && (
                    <input
                        type="text"
                        placeholder="example@upi"
                        value={formData.upiId || ''}
                        onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                    />
                )}
                {selectedOption === 'Card' && (
                    <>
                        <input
                            type="text"
                            maxLength="16"
                            placeholder="Card Number"
                            value={formData.cardNumber || ''}
                            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                        />
                        <input
                            type="month"
                            value={formData.expiry || ''}
                            onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                        />
                        <input
                            type="password"
                            maxLength="3"
                            placeholder="CVV"
                            value={formData.cvv || ''}
                            onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                        />
                    </>
                )}
                {selectedOption === 'NetBanking' && (
                    <select
                        value={formData.bank || ''}
                        onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                    >
                        <option value="">-- Select Bank --</option>
                        <option value="SBI">SBI</option>
                        <option value="ICICI">ICICI</option>
                        <option value="HDFC">HDFC</option>
                    </select>
                )}
                {selectedOption === 'Wallets' && (
                    <input
                        type="text"
                        placeholder="Wallet Number"
                        value={formData.wallet || ''}
                        onChange={(e) => setFormData({ ...formData, wallet: e.target.value })}
                    />
                )}
            </div>

            <div className="payment-buttons">
                <button className="cancel-btn" onClick={handleCancel}>❌ Cancel</button>
                <button className="confirm-pay-btn" onClick={handlePay}>✅ Confirm & Pay</button>
            </div>
        </div>
    );
};

export default Payment;

