import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../style/Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = useCart();
    const navigate = useNavigate();

    // Track order status per item
    const [status, setStatus] = useState({});

    const handleFinish = () => {
    // Save bill data in localStorage
    localStorage.setItem("billData", JSON.stringify(cartItems));

    clearCart(); // clear cart after saving bill data
    navigate('/bill');
};


    // Calculate total price dynamically
    const totalPrice = cartItems.reduce(
        (total, item) => total + Number(item.price) * (item.quantity || 1),
        0
    );

    const handleStatusChange = (id, newStatus) => {
        setStatus((prev) => ({ ...prev, [id]: newStatus }));
    };

    return (
        <div className="cart-container">
            <h2 className="cart-title">Your Cart</h2>

            {cartItems.length === 0 ? (
                <p className="cart-empty">Your cart is empty.</p>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item._id} className="cart-item">
                                <div className="cart-item-left">
                                    {item.photo && (
                                        <img
                                            src={item.photo}
                                            alt={item.name}
                                            className="cart-item-image"
                                        />
                                    )}
                                    <div>
                                        <h3 className="cart-item-name">{item.name}</h3>
                                        <p className="cart-item-price">
                                            Price: ₹{Number(item.price).toFixed(2)}
                                        </p>
                                        <div className="cart-item-qty">
                                            <button
                                                className="qty-btn"
                                                onClick={() => decreaseQuantity(item._id)}
                                            >
                                                -
                                            </button>
                                            <span className="qty-count">{item.quantity || 1}</span>
                                            <button
                                                className="qty-btn"
                                                onClick={() => increaseQuantity(item._id)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <p className="cart-item-price">
                                            Subtotal: ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                                        </p>

                                        {/* Status buttons per item */}
                                        <div className="item-status-buttons">
                                            <button
                                                className={`status-btn ${
                                                    status[item._id] === 'processing' ? 'active' : ''
                                                }`}
                                                onClick={() => handleStatusChange(item._id, 'processing')}
                                            >
                                                Processing
                                            </button>
                                            <button
                                                className={`status-btn ${
                                                    status[item._id] === 'ready' ? 'active' : ''
                                                }`}
                                                onClick={() => handleStatusChange(item._id, 'ready')}
                                            >
                                                Ready
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="remove-btn"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Total & Finish */}
                    <div className="cart-total-container">
                        <h3 className="cart-total">Total: ₹{totalPrice.toFixed(2)}</h3>
                        <button className="finish-btn" onClick={handleFinish}>
                            Finish
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;

// import React, { useState } from 'react';
// import { useCart } from '../../context/CartContext';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import '../style/Cart.css';

// const Cart = () => {
//     const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = useCart();
//     const { user } = useAuth();
//     const navigate = useNavigate();

//     const [status, setStatus] = useState({});

//     const handleStatusChange = (id, newStatus) => {
//         // Only chefs are allowed to update status
//         if (user?.role === 'chef') {
//             setStatus((prevStatus) => ({
//                 ...prevStatus,
//                 [id]: newStatus
//             }));
//         }
//     };

//     const handleFinish = () => {
//         localStorage.setItem('billData', JSON.stringify(cartItems));
//         clearCart();
//         navigate('/bill');
//     };

//     const totalPrice = cartItems.reduce(
//         (total, item) => total + Number(item.price) * (item.quantity || 1),
//         0
//     );

//     const isAnyReady = Object.values(status).includes('ready');

//     return (
//         <div className="cart-container">
//             <h2 className="cart-title">Your Cart</h2>

//             {cartItems.length === 0 ? (
//                 <p className="cart-empty">Your cart is empty.</p>
//             ) : (
//                 <>
//                     <div className="cart-items">
//                         {cartItems.map((item) => (
//                             <div key={item._id} className="cart-item">
//                                 <div className="cart-item-left">
//                                     {item.photo && (
//                                         <img
//                                             src={item.photo}
//                                             alt={item.name}
//                                             className="cart-item-image"
//                                         />
//                                     )}
//                                     <div>
//                                         <h3 className="cart-item-name">{item.name}</h3>
//                                         <p className="cart-item-price">
//                                             Price: ₹{Number(item.price).toFixed(2)}
//                                         </p>
//                                         <div className="cart-item-qty">
//                                             <button onClick={() => decreaseQuantity(item._id)} className="qty-btn">-</button>
//                                             <span className="qty-count">{item.quantity || 1}</span>
//                                             <button onClick={() => increaseQuantity(item._id)} className="qty-btn">+</button>
//                                         </div>
//                                         <p className="cart-item-price">
//                                             Subtotal: ₹{(item.price * (item.quantity || 1)).toFixed(2)}
//                                         </p>

//                                         {/* ✅ Visible to all, only chefs can interact */}
//                                         <div className="item-status-buttons">
//                                             <button
//                                                 className={`status-btn ${status[item._id] === 'processing' ? 'active' : ''}`}
//                                                 disabled={user?.role !== 'chef'}
//                                                 onClick={() => handleStatusChange(item._id, 'processing')}
//                                             >
//                                                 Processing
//                                             </button>
//                                             <button
//                                                 className={`status-btn ${status[item._id] === 'ready' ? 'active' : ''}`}
//                                                 disabled={user?.role !== 'chef'}
//                                                 onClick={() => handleStatusChange(item._id, 'ready')}
//                                             >
//                                                 Ready
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <button
//                                     onClick={() => removeFromCart(item._id)}
//                                     className="remove-btn"
//                                 >
//                                     Remove
//                                 </button>
//                             </div>
//                         ))}
//                     </div>

//                     <div className="cart-total-container">
//                         <h3 className="cart-total">Total: ₹{totalPrice.toFixed(2)}</h3>

//                         <button
//                             className="finish-btn"
//                             onClick={handleFinish}
//                             disabled={!isAnyReady}
//                             style={{
//                                 backgroundColor: isAnyReady ? '#4CAF50' : '#ccc',
//                                 cursor: isAnyReady ? 'pointer' : 'not-allowed'
//                             }}
//                         >
//                             Finish
//                         </button>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

// export default Cart;

