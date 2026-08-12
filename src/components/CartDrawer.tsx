import { useState } from "react";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCompletedOrder(true);
      clearCart();
      toast.success("Order placed successfully!", {
        description: "Thank you for shopping with My Small Things.",
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => {
          setIsCartOpen(false);
          setCompletedOrder(false);
        }}
      />

      {/* Drawer */}
      <div className="glass-panel relative z-10 flex h-full w-full max-w-md flex-col bg-background/95 p-6 shadow-2xl transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-5 text-primary" />
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {cartCount}
            </span>
          </div>
          <button
            onClick={() => {
              setIsCartOpen(false);
              setCompletedOrder(false);
            }}
            className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close cart"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        {completedOrder ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-primary/20 p-4 text-primary">
              <CheckCircle2 className="size-12" />
            </div>
            <h3 className="mt-4 text-2xl font-bold">Order Confirmed!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your luxury compact tech products are being packed with care and will be delivered
              shortly.
            </p>
            <button
              onClick={() => {
                setCompletedOrder(false);
                setIsCartOpen(false);
              }}
              className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              Continue Shopping
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
            <ShoppingBag className="size-12 text-muted-foreground/40" />
            <p className="mt-4 text-lg font-medium text-foreground">Your cart is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Explore our luxury compact tech collection and add items to your cart.
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <>
            {/* Cart items list */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.map(({ product, quantity }) => (
                <div
                  key={product.slug}
                  className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card/50 p-3 transition-colors hover:border-primary/40"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="size-20 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="truncate font-semibold text-sm">{product.name}</h4>
                    <p className="text-xs text-muted-foreground">{product.short}</p>
                    <p className="mt-1 font-semibold text-primary text-sm">{product.price}</p>

                    {/* Quantity Selector */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center rounded-lg border border-border bg-background/80">
                        <button
                          onClick={() => updateQuantity(product.slug, quantity - 1)}
                          className="p-1 hover:text-primary transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.slug, quantity + 1)}
                          className="p-1 hover:text-primary transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.slug)}
                        className="ml-auto text-muted-foreground hover:text-destructive transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Summary */}
            <div className="border-t border-border/60 pt-4 space-y-3">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span className="text-primary font-medium">FREE Nationwide</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-foreground">
                <span>Total</span>
                <span className="text-xl text-primary font-bold">${cartTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:glow-ring disabled:opacity-50"
              >
                {isCheckingOut ? (
                  "Processing Order..."
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
