import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 🟢 1. Initialize state from LocalStorage instead of an empty array
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error reading cart from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

const addToCart = (product) => {
    setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item._id === product._id);
        
        if (existingItem) {
            return prevCart.map((item) =>
                item._id === product._id 
                    ? { ...item, quantity: item.quantity + (product.quantity || 1) } 
                    : item
            );
        } else {
            return [...prevCart, { ...product, quantity: product.quantity || 1 }];
        }
    });
};

  // Remove specific item from cart
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  // Update quantity (+ and - buttons)
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id); 
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Clear the entire cart (Called after successful payment/order)
  const clearCart = () => {
    setCart([]);
    // LocalStorage will automatically clear because of the useEffect above watching the state!
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};