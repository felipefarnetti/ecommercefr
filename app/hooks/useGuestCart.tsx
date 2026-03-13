"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { toast } from "react-toastify";

export interface GuestCartItem {
  productId: string;
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
}

interface GuestCartContextType {
  items: GuestCartItem[];
  count: number;
  total: number;
  addItem: (item: Omit<GuestCartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const GuestCartContext = createContext<GuestCartContextType | null>(null);

const STORAGE_KEY = "guest_cart";

function loadCart(): GuestCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveCart(items: GuestCartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function GuestCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<GuestCartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveCart(items);
  }, [items, loaded]);

  const addItem = useCallback(
    (item: Omit<GuestCartItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === item.productId);
        if (existing) {
          return prev.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, { ...item, quantity }];
      });
      toast.success("Produit ajouté au panier");
    },
    []
  );

  const updateQuantity = useCallback((productId: string, delta: number) => {
    setItems((prev) => {
      const updated = prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity: i.quantity + delta }
          : i
      );
      return updated.filter((i) => i.quantity > 0);
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <GuestCartContext.Provider
      value={{ items, count, total, addItem, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </GuestCartContext.Provider>
  );
}

export default function useGuestCart() {
  const ctx = useContext(GuestCartContext);
  if (!ctx) throw new Error("useGuestCart must be used within GuestCartProvider");
  return ctx;
}
