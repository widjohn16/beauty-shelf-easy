import { useState, useCallback, useSyncExternalStore } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
  free_shipping: boolean;
}

interface CartStore {
  items: CartItem[];
}

let store: CartStore = { items: [] };
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((l) => l());
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(store.items));
  }
}

function loadFromStorage() {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) store.items = JSON.parse(saved);
    } catch {}
  }
}

loadFromStorage();

export function addToCart(item: Omit<CartItem, "quantity">) {
  const existing = store.items.find((i) => i.id === item.id);
  if (existing) {
    store = {
      items: store.items.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ),
    };
  } else {
    store = { items: [...store.items, { ...item, quantity: 1 }] };
  }
  emitChange();
}

export function removeFromCart(id: string) {
  store = { items: store.items.filter((i) => i.id !== id) };
  emitChange();
}

export function updateQuantity(id: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(id);
    return;
  }
  store = {
    items: store.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
  };
  emitChange();
}

export function clearCart() {
  store = { items: [] };
  emitChange();
}

export function getCartTotal() {
  return store.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function getCartCount() {
  return store.items.reduce((sum, i) => sum + i.quantity, 0);
}

export function useCart() {
  const items = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => store.items,
    () => store.items
  );

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    count: items.reduce((sum, i) => sum + i.quantity, 0),
  };
}
