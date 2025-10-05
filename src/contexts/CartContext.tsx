import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartContextType, CartItem, Course } from '../types';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('skillHunter_cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('skillHunter_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (course: Course) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.course.id === course.id);
      if (existingItem) {
        return prevItems; // Don't add duplicate courses
      }
      return [...prevItems, { course, quantity: 1 }];
    });
  };

  const removeFromCart = (courseId: string) => {
    setItems(prevItems => prevItems.filter(item => item.course.id !== courseId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + (item.course.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    total,
    itemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
