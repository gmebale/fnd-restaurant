import React, { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../lib/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const GUEST_CART_KEY = 'guest_cart';

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart from API when user is authenticated or localStorage for guests
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      loadGuestCart();
    }
  }, [user]);

  const loadCart = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const cartData = await api.getCart();

      // Transform API response to match expected format
      const transformedItems = cartData.items?.map(item => ({
        id: item.id,
        product: item.product,
        qty: item.quantity,
      })) || [];

      setItems(transformedItems);
    } catch (error) {
      console.error('Error loading cart:', error);
      setError(error.message);
      // If cart doesn't exist, create empty cart
      if (error.response?.status === 404) {
        setItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadGuestCart = () => {
    try {
      const guestCart = localStorage.getItem(GUEST_CART_KEY);
      if (guestCart) {
        setItems(JSON.parse(guestCart));
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error('Error loading guest cart:', error);
      setItems([]);
    }
  };

  const saveGuestCart = (cartItems) => {
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  };

  const addItem = async (product, qty = 1) => {
    try {
      setError(null);

      if (user) {
        // Authenticated user: use API
        await api.addToCart(product.id, qty);
        await loadCart(); // Reload cart from API
      } else {
        // Guest user: use localStorage
        setItems(currentItems => {
          const existingItem = currentItems.find(item => item.product?.id === product.id);
          let newItems;

          if (existingItem) {
            newItems = currentItems.map(item =>
              item.product?.id === product.id
                ? { ...item, qty: item.qty + qty }
                : item
            );
          } else {
            newItems = [...currentItems, {
              id: `guest_${Date.now()}_${product.id}`,
              product,
              qty
            }];
          }

          saveGuestCart(newItems);
          return newItems;
        });
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setError(error.message);
      throw error;
    }
  };

  const updateQty = async (itemId, qty) => {
    try {
      setError(null);

      if (user) {
        // Authenticated user: use API
        if (qty <= 0) {
          await removeItem(itemId);
        } else {
          await api.updateCartItem(itemId, qty);
          await loadCart(); // Reload cart from API
        }
      } else {
        // Guest user: update localStorage
        setItems(currentItems => {
          let newItems;

          if (qty <= 0) {
            newItems = currentItems.filter(item => item.id !== itemId);
          } else {
            newItems = currentItems.map(item =>
              item.id === itemId ? { ...item, qty } : item
            );
          }

          saveGuestCart(newItems);
          return newItems;
        });
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      setError(error.message);
      throw error;
    }
  };

  const removeItem = async (itemId) => {
    try {
      setError(null);

      if (user) {
        // Authenticated user: use API
        await api.removeFromCart(itemId);
        await loadCart(); // Reload cart from API
      } else {
        // Guest user: update localStorage
        setItems(currentItems => {
          const newItems = currentItems.filter(item => item.id !== itemId);
          saveGuestCart(newItems);
          return newItems;
        });
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setError(error.message);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);

      if (user) {
        // Authenticated user: use API
        await api.clearCart();
      } else {
        // Guest user: clear localStorage
        localStorage.removeItem(GUEST_CART_KEY);
      }

      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError(error.message);
      throw error;
    }
  };

  // Calculate totals
  const totalCount = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.qty * (item.product?.price ?? item.price ?? 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        error,
        addItem,
        updateQty,
        removeItem,
        clearCart,
        totalCount,
        subtotal,
        refreshCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
