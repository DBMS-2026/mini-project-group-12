import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [restaurantId, setRestaurantId] = useState(() => {
    const saved = localStorage.getItem('cartRestaurantId');
    return saved ? JSON.parse(saved) : null;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('cartRestaurantId', JSON.stringify(restaurantId));
  }, [cartItems, restaurantId]);

  const addToCart = (item, restId, restName) => {
    if (restaurantId && restaurantId !== restId && cartItems.length > 0) {
      if (window.confirm('Your cart contains items from another restaurant. Do you want to clear it and add this item?')) {
        clearCart();
        setRestaurantId(restId);
        setCartItems([{ ...item, quantity: 1, restaurantName: restName }]);
        toast.success(`Added ${item.name} to cart`);
      }
      return;
    }

    setRestaurantId(restId);
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, restaurantName: restName }];
    });
    toast.success(`Added ${item.name} to cart`);
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => {
      const updated = prev.filter(i => i.id !== itemId);
      if (updated.length === 0) {
        setRestaurantId(null);
      }
      return updated;
    });
  };

  const updateQuantity = (itemId, change) => {
    setCartItems(prev => {
      const updated = prev.map(i => {
        if (i.id === itemId) {
          return { ...i, quantity: i.quantity + change };
        }
        return i;
      }).filter(i => i.quantity > 0);
      
      if (updated.length === 0) {
        setRestaurantId(null);
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurantId(null);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      restaurantId,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};
