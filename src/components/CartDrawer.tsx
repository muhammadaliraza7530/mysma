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
      <div className="relative z-10 flex h-full max-h-screen w-full max-w-[100vw] sm:max-w-md flex-col bg-slate-950 shadow-2xl transition-transform duration-300 border-l border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Shopping Cart</h2>
            <span className="rounded-full bg-blue-500/20 border border-blue-500/30 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
              {cartCount}
            </span>
          </div>
          <button
            onClick={() => {
              setIsCartOpen(false);
              setCompletedOrder(false);
            }}
            className="rounded-full border border-slate-800 p-2 text-slate-400 transition-colors hover:text-white hover:border-slate-700"
            aria-label="Close cart"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        {completedOrder ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-blue-500/20 p-4 text-blue-400">
              <CheckCircle2 className="size-12" />
            </div>
            <h3 className="mt-4 text-2xl font-bold text-white">Order Confirmed!</h3>
            <p className="mt-2 text-sm text-slate-400">
              Your luxury compact tech products are being packed with care and will be delivered
              shortly.
            </p>
            <button
              onClick={() => {
                setCompletedOrder(false);
                setIsCartOpen(false);
              }}
              className="mt-6 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
            <ShoppingBag className="size-12 text-slate-600" />
            <p className="mt-4 text-lg font-medium text-white">Your cart is empty</p>
            <p className="mt-1 text-sm text-slate-400">
              Explore our luxury compact tech collection and add items to your cart.
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="mt-6 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <>
            {/* Cart items list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.map(({ product, quantity }) => (
                <div
                  key={product.slug}
                  className="flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3 transition-colors hover:border-blue-500/40"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="size-20 rounded-xl object-contain bg-slate-950 p-2 border border-slate-800"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="truncate font-semibold text-sm text-white">{product.name}</h4>
                    <p className="text-xs text-slate-400">{product.short}</p>
                    <p className="mt-1 font-semibold text-blue-400 text-sm">${product.price}</p>

                    {/* Quantity Selector */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950">
                        <button
                          onClick={() => updateQuantity(product.slug, quantity - 1)}
                          className="p-1 text-slate-400 hover:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-white">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.slug, quantity + 1)}
                          className="p-1 text-slate-400 hover:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.slug)}
                        className="ml-auto text-slate-400 hover:text-red-400 transition-colors p-1"
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
            <div className="mt-auto border-t border-slate-800 p-4 sticky bottom-0 bg-[#0d1424] z-10 space-y-3">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Shipping</span>
                <span className="text-blue-400 font-medium">FREE Nationwide</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-white">
                <span>Total</span>
                <span className="text-xl text-blue-400 font-bold">${cartTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
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
