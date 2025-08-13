import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../style/Bill.css';

const Bill = ({ userRole }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [billItems, setBillItems] = useState([]);
    const [billNumber, setBillNumber] = useState('');
    const [billDate, setBillDate] = useState('');

    const paymentDone = location.state?.paymentDone;
    const paymentStatus = localStorage.getItem("paymentStatus");
    const printRef = useRef();

    // Restrict chef
    if (userRole === "chef") {
        return (
            <div className="bill-container">
                <h2 className="bill-title">Access Denied</h2>
                <p className="bill-error">Only waiter, customer, and cashier can access this page.</p>
            </div>
        );
    }

    // Load bill data
    useEffect(() => {
        const storedBill = localStorage.getItem("billData");
        if (storedBill) {
            setBillItems(JSON.parse(storedBill));

            const savedBillNum = localStorage.getItem("billNumber");
            const savedBillDate = localStorage.getItem("billDate");

            if (savedBillNum && savedBillDate) {
                setBillNumber(savedBillNum);
                setBillDate(savedBillDate);
            } else {
                const newBillNum = `BILL-${Date.now().toString().slice(-6)}`;
                const newBillDate = new Date().toLocaleString();
                localStorage.setItem("billNumber", newBillNum);
                localStorage.setItem("billDate", newBillDate);
                setBillNumber(newBillNum);
                setBillDate(newBillDate);
            }
        } else {
            navigate('/');
        }
    }, [navigate]);

    // Calculate total
    const total = billItems.reduce(
        (sum, item) => sum + Number(item.price) * (item.quantity || 1),
        0
    );

    // Auto-clear after payment success
    useEffect(() => {
        if (paymentDone && paymentStatus === "success") {
            setTimeout(() => {
                localStorage.removeItem("billData");
                localStorage.removeItem("billNumber");
                localStorage.removeItem("billDate");
                localStorage.removeItem("paymentStatus");
            }, 5000);
        }
    }, [paymentDone, paymentStatus]);

    // Print function
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bill-container" ref={printRef}>
            <h2 className="bill-title">Bill Summary</h2>

            {/* Show payment success */}
            {paymentDone && paymentStatus === "success" && (
                <div className="bill-payment-success">
                    <div className="checkmark">&#10004;</div>
                    <p>Payment Successful!</p>
                </div>
            )}

            <div className="bill-info">
                <p><strong>Bill No:</strong> {billNumber}</p>
                <p><strong>Date:</strong> {billDate}</p>
            </div>

            <div className="bill-items">
                {billItems.map((item) => (
                    <div key={item._id} className="bill-item">
                        <span>{item.name} (x{item.quantity || 1})</span>
                        <span>₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            <h3 className="bill-total">Total: ₹{total.toFixed(2)}</h3>

            <div className="bill-btn-container no-print">
                <button className="back-btn" onClick={() => navigate('/menu')}>
                    Back to Menu
                </button>
                <button
                    className="pay-btn"
                    onClick={() => navigate('/payment', { state: { totalAmount: total } })}
                >
                    Pay Online
                </button>
                <button className="print-btn" onClick={handlePrint}>
                    🖨️ Print Bill
                </button>
            </div>
        </div>
    );
};

export default Bill;




// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import QRCode from 'qrcode.react';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import '../style/Bill.css';

// const Bill = ({ userRole }) => {
//     const navigate = useNavigate();
//     const [billItems, setBillItems] = useState([]);
//     const [billNumber, setBillNumber] = useState('');
//     const [billDate, setBillDate] = useState('');
//     const [customer, setCustomer] = useState({ name: '', phone: '' });

//     // Restrict chef
//     if (userRole === "chef") {
//         return (
//             <div className="bill-container">
//                 <h2 className="bill-title">Access Denied</h2>
//                 <p className="bill-error">
//                     Only waiter, customer, and cashier can access this page.
//                 </p>
//             </div>
//         );
//     }

//     useEffect(() => {
//         const storedBill = localStorage.getItem("billData");
//         const storedCustomer = localStorage.getItem("customerData");

//         if (storedBill) {
//             setBillItems(JSON.parse(storedBill));

//             if (storedCustomer) setCustomer(JSON.parse(storedCustomer));

//             const savedBillNum = localStorage.getItem("billNumber");
//             const savedBillDate = localStorage.getItem("billDate");

//             if (savedBillNum && savedBillDate) {
//                 setBillNumber(savedBillNum);
//                 setBillDate(savedBillDate);
//             } else {
//                 const newBillNum = `BILL-${Date.now().toString().slice(-6)}`;
//                 const newBillDate = new Date().toLocaleString();
//                 localStorage.setItem("billNumber", newBillNum);
//                 localStorage.setItem("billDate", newBillDate);
//                 setBillNumber(newBillNum);
//                 setBillDate(newBillDate);
//             }
//         } else {
//             navigate('/');
//         }
//     }, [navigate]);

//     const total = billItems.reduce(
//         (sum, item) => sum + Number(item.price) * (item.quantity || 1),
//         0
//     );

//     // Print
//     const handlePrint = () => {
//         window.print();
//     };

//     // Generate PDF
//     const handlePDF = () => {
//         const input = document.getElementById("bill-content");
//         html2canvas(input).then((canvas) => {
//             const imgData = canvas.toDataURL("image/png");
//             const pdf = new jsPDF('p', 'mm', 'a4');
//             const imgWidth = 190;
//             const imgHeight = (canvas.height * imgWidth) / canvas.width;
//             pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
//             pdf.save(`${billNumber}.pdf`);
//         });
//     };

//     return (
//         <div className="bill-container">
//             <div id="bill-content">
//                 {/* Header */}
//                 <div className="bill-header">
//                     <img src="/logo.png" alt="Restaurant Logo" className="bill-logo" />
//                     <div className="bill-company-info">
//                         <h2>Little Lemon Restaurant</h2>
//                         <p>123 Main Street, City, 600001</p>
//                         <p>Phone: +91 98765 43210</p>
//                     </div>
//                 </div>

//                 {/* Customer Info */}
//                 <div className="bill-customer-info">
//                     <p><strong>Customer:</strong> {customer.name || 'Guest'}</p>
//                     <p><strong>Phone:</strong> {customer.phone || 'N/A'}</p>
//                 </div>

//                 {/* Bill Info */}
//                 <div className="bill-info">
//                     <p><strong>Bill No:</strong> {billNumber}</p>
//                     <p><strong>Date:</strong> {billDate}</p>
//                 </div>

//                 {/* Items */}
//                 <div className="bill-items">
//                     {billItems.map((item) => (
//                         <div key={item._id} className="bill-item">
//                             <span>{item.name} (x{item.quantity || 1})</span>
//                             <span>₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Total */}
//                 <h3 className="bill-total">Total: ₹{total.toFixed(2)}</h3>

//                 {/* QR Code */}
//                 <div className="qr-section">
//                     <p>Scan to Pay:</p>
//                     <QRCode value={`upi://pay?pa=restaurant@upi&pn=LittleLemon&am=${total}`} size={120} />
//                 </div>
//             </div>

//             {/* Buttons */}
//             <div className="bill-btn-container">
//                 <button
//                     className="back-btn"
//                     onClick={() => {
//                         localStorage.removeItem("billData");
//                         localStorage.removeItem("billNumber");
//                         localStorage.removeItem("billDate");
//                         localStorage.removeItem("customerData");
//                         navigate('/');
//                     }}
//                 >
//                     Back to Menu
//                 </button>
//                 <button
//                     className="pay-btn"
//                     onClick={() => navigate('/payment', { state: { totalAmount: total } })}
//                 >
//                     Pay Online
//                 </button>
//                 <button className="print-btn" onClick={handlePrint}>
//                     Print Bill
//                 </button>
//                 <button className="pdf-btn" onClick={handlePDF}>
//                     Download PDF
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Bill;
