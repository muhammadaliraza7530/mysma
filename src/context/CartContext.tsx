import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  buyNow: (product: Product, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function parsePriceToNumber(priceStr: string): number {
  const numeric = priceStr.replace(/[^0-9.]/g, "");
  return parseFloat(numeric) || 0;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("my_small_things_cart");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("my_small_things_cart", JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const addToCart = (product: Product, quantity: number) => {
    if (quantity <= 0) return;
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.slug === product.slug);
      if (existingIndex > -1) {
        const updated = [...prev];
        const existing = updated[existingIndex]!;
        updated[existingIndex] = {
          ...existing,
          quantity: existing.quantity + quantity,
        };
        return updated;
      } else {
        return [...prev, { product, quantity }];
      }
    });

    toast.custom(
      (id) => (
        <div className="flex items-center gap-3.5 rounded-2xl border border-primary/40 bg-card/95 p-3.5 shadow-2xl backdrop-blur-lg text-foreground w-full max-w-sm">
          <img
            src={product.image}
            alt={product.name}
            className="size-12 rounded-xl object-cover border border-border shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-primary uppercase tracking-wider">
              Item Added to Cart
            </p>
            <p className="text-sm font-bold truncate">{product.name}</p>
            <p className="text-xs text-muted-foreground">
              Qty: {quantity} • {product.price}
            </p>
          </div>
          <button
            onClick={() => {
              toast.dismiss(id);
              setIsCartOpen(true);
            }}
            className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:glow-ring transition-all shrink-0"
          >
            View Cart
          </button>
        </div>
      ),
      { duration: 4000 },
    );
  };

  const buyNow = (product: Product, quantity: number) => {
    addToCart(product, quantity);
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.slug === productId ? { ...item, quantity } : item)),
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.slug !== productId));
    toast.info("Item removed from cart");
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cart.reduce(
    (sum, item) => sum + parsePriceToNumber(item.product.price) * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        buyNow,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
