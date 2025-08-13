
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../../api/api';
// import Message from '../../components/Message';
// import { useCart } from '../../context/CartContext';
// import '../style/Menu.css';

// const Menu = () => {
//     const [menuItems, setMenuItems] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const { addToCart } = useCart();
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchMenu = async () => {
//             try {
//                 const defaultRestaurantId = '688997c798c2c09dc62f87a7';
//                 const res = await api.get(`/menu/${defaultRestaurantId}`);
//                 const items = Array.isArray(res.data) ? res.data : res.data.data;
//                 setMenuItems(items);
//             } catch (err) {
//                 setError(err.response?.data?.message || err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchMenu();
//     }, []);

//     if (loading) return <div className="menu-loading">Loading menu...</div>;

//     return (
//         <div className="menu-container">
//             <h2 className="menu-title">Our Delicious Menu</h2>
//             {error && <Message type="error" message={error} />}

//             {menuItems.length === 0 ? (
//                 <p className="menu-empty">No menu items available for this restaurant.</p>
//             ) : (
//                 <div className="menu-grid">
//                     {menuItems.map((item) => (
//                         <div key={item._id} className="menu-card">
//                             {item.photo && <img src={item.photo} alt={item.name} className="menu-image" />}
//                             <div className="menu-content">
//                                 <h3 className="menu-name">{item.name}</h3>
//                                 <p className="menu-description">{item.description}</p>
//                                 {item.review && <p className="menu-review">{item.review}</p>}
//                                 <div className="menu-bottom">
//                                     <span className="menu-price">₹{Number(item.price).toFixed(2)}</span>
//                                     <button
//                                         onClick={() => {
//                                             addToCart(item);
//                                             navigate('/cart');
//                                         }}
//                                         className="menu-button"
//                                     >
//                                         Add to Cart
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Menu;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { useCart } from '../../context/CartContext';
import '../style/Menu.css';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const defaultRestaurantId = '688997c798c2c09dc62f87a7';
        const res = await api.get(`/menu/${defaultRestaurantId}`);
        const items = Array.isArray(res.data) ? res.data : res.data.data;
        setMenuItems(items);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  if (loading) return <p className="menu-loading">Loading menu...</p>;
  if (error) return <p className="menu-error">Error: {error}</p>;

  return (
    <div className="menu-container">
      <h2 className="menu-title">Our Menu</h2>
      {menuItems.length === 0 ? (
        <p className="menu-empty">No menu items found.</p>
      ) : (
        <div className="menu-grid">
          {menuItems.map((item) => (
            <div className="menu-card" key={item._id}>
              {item.photo && (
                <img src={item.photo} alt={item.name} className="menu-image" />
              )}
              <div className="menu-content">
                <h3 className="menu-name">{item.name}</h3>
                <p className="menu-description">{item.description}</p>
                {item.review && (
                  <p className="menu-review">⭐ {item.review}</p>
                )}
                <div className="menu-bottom">
                  <span className="menu-price">₹{item.price}</span>
                  <button
                    className="menu-button1"
                    onClick={() => {
                      addToCart(item);
                      navigate('/cart');
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;

