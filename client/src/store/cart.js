import { create } from 'zustand';
import { api } from '../api';

export const useCartStore = create((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const items = await api.getCart();
      set({ items });
    } catch {
      set({ items: [] });
    } finally {
      set({ loading: false });
    }
  },

  addToCart: async (product_id, quantity) => {
    await api.addToCart(product_id, quantity);
    await get().fetchCart();
  },

  updateItem: async (id, quantity) => {
    await api.updateCartItem(id, quantity);
    set((s) => ({
      items: quantity === 0 ? s.items.filter((i) => i.id !== id) : s.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    }));
  },

  removeItem: async (id) => {
    await api.removeCartItem(id);
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
  },

  get total() {
    return get().items.reduce((sum, i) => sum + i.price * (1 - (i.discountPercentage || 0) / 100) * i.quantity, 0);
  },

  get count() {
    return get().items.reduce((sum, i) => sum + i.quantity, 0);
  },
}));
