import { useState } from "react";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  CheckCircle2,
  MapPin,
  CreditCard,
  Truck,
  Building2,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CheckoutModal, type OrderConfirmationData } from "@/components/CheckoutModal";

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartCount, cartTotal } =
    useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(false);
  const [lastOrder, setLastOrder] = useState<OrderConfirmationData | null>(null);

  if (!isCartOpen) return null;

  const handleOpenCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleOrderConfirmed = (orderData: OrderConfirmationData) => {
    setLastOrder(orderData);
    setIsCheckoutOpen(false);
    setCompletedOrder(true);
  };

  return (
    <>
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
              <h2 className="text-lg font-semibold text-white">
                {completedOrder ? "Order Summary" : "Shopping Cart"}
              </h2>
              {!completedOrder && (
                <span className="rounded-full bg-blue-500/20 border border-blue-500/30 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
                  {cartCount}
                </span>
              )}
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
          {completedOrder && lastOrder ? (
            <div className="flex flex-1 flex-col overflow-y-auto p-5 space-y-5">
              {/* Status Header */}
              <div className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <div className="rounded-full bg-blue-500/20 p-3 text-blue-400">
                  <CheckCircle2 className="size-10" />
                </div>
                <h3 className="mt-3 text-2xl font-bold text-white">Order Confirmed!</h3>
                <p className="mt-1 text-xs text-slate-300">
                  Thank you,{" "}
                  <span className="font-semibold text-white">{lastOrder.customerName}</span>! Your
                  order has been placed.
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-mono font-semibold text-blue-400 border border-slate-800">
                  Order ID: #{lastOrder.orderId}
                </div>
              </div>

              {/* Delivery & Customer Info */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3 text-xs">
                <div className="flex items-center gap-2 font-semibold text-blue-400 uppercase tracking-wider">
                  <User className="size-3.5" />
                  <span>Customer & Shipping</span>
                </div>
                <div className="space-y-1.5 text-slate-300">
                  <p className="flex items-center gap-2">
                    <User className="size-3 text-slate-500 shrink-0" />
                    <span>{lastOrder.customerName}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="size-3 text-slate-500 shrink-0" />
                    <span>{lastOrder.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="size-3 text-slate-500 shrink-0" />
                    <span>{lastOrder.phone}</span>
                  </p>
                  <p className="flex items-start gap-2 pt-1 border-t border-slate-800/80">
                    <MapPin className="size-3 text-slate-500 shrink-0 mt-0.5" />
                    <span>
                      {lastOrder.address}, {lastOrder.city}, {lastOrder.postalCode}
                    </span>
                  </p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-semibold text-blue-400 uppercase tracking-wider">
                  <CreditCard className="size-3.5" />
                  <span>Payment Method</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  {lastOrder.paymentMethod === "cod" ? (
                    <>
                      <Truck className="size-4 text-blue-400" />
                      <span className="font-medium">Cash on Delivery (COD)</span>
                    </>
                  ) : lastOrder.paymentMethod === "card" ? (
                    <>
                      <CreditCard className="size-4 text-blue-400" />
                      <span className="font-medium">
                        Credit / Debit Card {lastOrder.cardDetails?.cardNumber}
                      </span>
                    </>
                  ) : (
                    <>
                      <Building2 className="size-4 text-blue-400" />
                      <span className="font-medium">Direct Bank Transfer</span>
                    </>
                  )}
                </div>
                {lastOrder.paymentMethod === "bank_transfer" && (
                  <p className="text-[11px] text-slate-400 italic">
                    Please complete transfer to Account #4829-1029-8841-0012 with Ref #
                    {lastOrder.orderId}.
                  </p>
                )}
              </div>

              {/* Items Purchased */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between font-semibold text-blue-400 uppercase tracking-wider">
                  <span>Purchased Items</span>
                  <span className="text-slate-400 font-normal">{lastOrder.items.length} items</span>
                </div>

                <div className="space-y-2.5">
                  {lastOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 border-b border-slate-800/60 pb-2 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="size-10 rounded-lg object-contain bg-slate-950 p-1 border border-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">{item.name}</p>
                          <p className="text-slate-400 text-[11px]">
                            Qty: {item.quantity} × {item.price}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-blue-400 shrink-0">
                        ${item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total Summary */}
                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span>${lastOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Shipping</span>
                    <span className="text-blue-400 font-medium">FREE Nationwide</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-1">
                    <span>Grand Total</span>
                    <span className="text-blue-400 text-base">
                      ${lastOrder.grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setCompletedOrder(false);
                  setIsCartOpen(false);
                }}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-sm font-semibold text-white shadow-lg transition-colors"
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
                  onClick={handleOpenCheckout}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-colors"
                >
                  Proceed to Checkout
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderConfirmed={handleOrderConfirmed}
      />
    </>
  );
}
