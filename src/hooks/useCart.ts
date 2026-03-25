'use client';

import { useState, useCallback } from 'react';
import { Product, Addon } from '@/types';

interface CartState {
  product: Product | null;
  addons: Addon[];
  total: number;
}

export function useCart() {
  const [cart, setCart] = useState<CartState>({
    product: null,
    addons: [],
    total: 0,
  });

  const setProduct = useCallback((product: Product) => {
    setCart(prev => ({
      ...prev,
      product,
      total: product.price + prev.addons.reduce((sum, a) => sum + a.price, 0),
    }));
  }, []);

  const toggleAddon = useCallback((addon: Addon) => {
    setCart(prev => {
      const exists = prev.addons.find(a => a.id === addon.id);
      let newAddons: Addon[];
      
      if (exists) {
        newAddons = prev.addons.filter(a => a.id !== addon.id);
      } else {
        newAddons = [...prev.addons, addon];
      }
      
      const addonsTotal = newAddons.reduce((sum, a) => sum + a.price, 0);
      const productTotal = prev.product?.price || 0;
      
      return {
        ...prev,
        addons: newAddons,
        total: productTotal + addonsTotal,
      };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart({
      product: null,
      addons: [],
      total: 0,
    });
  }, []);

  const isAddonSelected = useCallback((addonId: string) => {
    return cart.addons.some(a => a.id === addonId);
  }, [cart.addons]);

  return {
    cart,
    setProduct,
    toggleAddon,
    clearCart,
    isAddonSelected,
  };
}
