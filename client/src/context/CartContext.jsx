import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Add to cart: increment quantity if exists
    const addToCart = (item) => {
        setCartItems((prevItems) => {
            const existing = prevItems.find((i) => i._id === item._id);
            if (existing) {
                return prevItems.map((i) =>
                    i._id === item._id
                        ? { ...i, quantity: (i.quantity || 1) + 1 }
                        : i
                );
            }
            return [...prevItems, { ...item, quantity: 1 }];
        });
    };

    // Increase quantity manually
    const increaseQuantity = (id) => {
        setCartItems((prevItems) =>
            prevItems.map((i) =>
                i._id === id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
            )
        );
    };

    // Decrease quantity manually
    const decreaseQuantity = (id) => {
        setCartItems((prevItems) =>
            prevItems
                .map((i) =>
                    i._id === id ? { ...i, quantity: (i.quantity || 1) - 1 } : i
                )
                .filter((i) => i.quantity > 0)
        );
    };

    // Remove item completely
    const removeFromCart = (id) => {
        setCartItems((prevItems) => prevItems.filter((i) => i._id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
