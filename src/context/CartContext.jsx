import { createContext, useState, useEffect, useCallback, useContext, useMemo } from "react";

export const CartContext = createContext(null);
const CART_KEY = "rfo_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((food, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item._id === food._id);
      if (existing) {
        return prev.map((item) =>
          item._id === food._id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          _id: food._id,
          name: food.name,
          price: food.price,
          image: food.imageUrl,
          quantity,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((foodId) => {
    setItems((prev) => prev.filter((item) => item._id !== foodId));
  }, []);

  const updateQuantity = useCallback((foodId, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item._id !== foodId);
      }
      return prev.map((item) => (item._id === foodId ? { ...item, quantity } : item));
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const deliveryFee = subtotal > 0 && subtotal < 500 ? 40 : 0;
    const total = subtotal + deliveryFee;
    return { subtotal, deliveryFee, total, itemCount };
  }, [items]);

  const value = { items, addItem, removeItem, updateQuantity, clearCart, ...totals };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
