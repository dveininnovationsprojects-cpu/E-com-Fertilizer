import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

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


  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };


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


  const clearCart = () => {
    setCart([]);

  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};