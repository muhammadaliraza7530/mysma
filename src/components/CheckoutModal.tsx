import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  CreditCard,
  Truck,
  Building2,
  Lock,
  ChevronDown,
  ChevronUp,
  Tag,
  ShoppingBag,
  ShieldCheck,
  Check,
  Info,
} from "lucide-react";
import { useCart, parsePriceToNumber } from "@/context/CartContext";
import { toast } from "sonner";

export interface OrderConfirmationData {
  orderId: string;
  firstName: string;
  lastName: string;
  customerName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  city: string;
  postalCode: string;
  emailOffers: boolean;
  paymentMethod: "cod" | "card" | "bank_transfer";
  cardDetails?: {
    cardNumber: string;
    expDate: string;
    cvc: string;
    cardName: string;
  };
  billingOption: "same" | "different";
  billingAddress?: {
    country: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
  };
  discountCode?: string;
  discountAmount: number;
  items: Array<{
    name: string;
    image: string;
    short: string;
    quantity: number;
    price: string;
    subtotal: number;
  }>;
  subtotal: number;
  shippingFee: number;
  grandTotal: number;
  date: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderConfirmed: (orderData: OrderConfirmationData) => void;
}

interface FormErrors {
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  phone?: string;
  // Card errors
  cardNumber?: string;
  expDate?: string;
  cvc?: string;
  cardName?: string;
  // Billing errors
  billingFirstName?: string;
  billingLastName?: string;
  billingAddress?: string;
  billingCity?: string;
}

export function CheckoutModal({ isOpen, onClose, onOrderConfirmed }: CheckoutModalProps) {
  const { cart, cartTotal, clearCart } = useCart();

  // Mobile Order Summary Toggle State
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  // 1. Contact Section
  const [email, setEmail] = useState("");
  const [emailOffers, setEmailOffers] = useState(true);

  // 2. Delivery Section
  const [country, setCountry] = useState("Pakistan");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");

  // 3. Payment Section
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card" | "bank_transfer">("cod");
  const [cardNumber, setCardNumber] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");

  // 4. Billing Address Section
  const [billingOption, setBillingOption] = useState<"same" | "different">("same");
  const [billingCountry, setBillingCountry] = useState("Pakistan");
  const [billingFirstName, setBillingFirstName] = useState("");
  const [billingLastName, setBillingLastName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingPostalCode, setBillingPostalCode] = useState("");

  // Discount / Gift card
  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    percentage?: number;
    fixed?: number;
  } | null>(null);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Calculation Logic
  const shippingFee = 0; // Free shipping
  let discountAmount = 0;

  if (appliedDiscount) {
    if (appliedDiscount.percentage) {
      discountAmount = (cartTotal * appliedDiscount.percentage) / 100;
    } else if (appliedDiscount.fixed) {
      discountAmount = Math.min(cartTotal, appliedDiscount.fixed);
    }
  }

  const grandTotal = Math.max(0, cartTotal - discountAmount + shippingFee);

  // Discount code handler
  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = discountInput.trim().toUpperCase();
    if (!cleanCode) return;

    if (cleanCode === "WELCOME10") {
      setAppliedDiscount({ code: "WELCOME10", percentage: 10 });
      toast.success("Promo code WELCOME10 applied! (10% OFF)");
    } else if (cleanCode === "LUXURY20") {
      setAppliedDiscount({ code: "LUXURY20", percentage: 20 });
      toast.success("Promo code LUXURY20 applied! (20% OFF)");
    } else if (cleanCode === "FREESHIP") {
      setAppliedDiscount({ code: "FREESHIP", fixed: 0 });
      toast.success("Free Shipping code FREESHIP active!");
    } else {
      toast.error("Invalid discount code or gift card", {
        description: "Try codes WELCOME10 or LUXURY20 for a special discount.",
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Enter an email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!firstName.trim()) {
      newErrors.firstName = "Enter a first name";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Enter a last name";
    }

    if (!address.trim()) {
      newErrors.address = "Enter an address";
    }

    if (!city.trim()) {
      newErrors.city = "Enter a city";
    }

    if (!phone.trim()) {
      newErrors.phone = "Enter a phone number for delivery updates";
    }

    if (paymentMethod === "card") {
      if (!cardNumber.trim() || cardNumber.replace(/\s/g, "").length < 15) {
        newErrors.cardNumber = "Enter a valid card number";
      }
      if (!expDate.trim()) {
        newErrors.expDate = "MM / YY";
      }
      if (!cvc.trim() || cvc.length < 3) {
        newErrors.cvc = "Security code";
      }
      if (!cardName.trim()) {
        newErrors.cardName = "Enter name on card";
      }
    }

    if (billingOption === "different") {
      if (!billingFirstName.trim()) newErrors.billingFirstName = "Enter first name";
      if (!billingLastName.trim()) newErrors.billingLastName = "Enter last name";
      if (!billingAddress.trim()) newErrors.billingAddress = "Enter billing address";
      if (!billingCity.trim()) newErrors.billingCity = "Enter city";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please complete all required fields");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = `MST-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderData: OrderConfirmationData = {
        orderId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        customerName: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        phone: phone.trim(),
        country,
        address: apartment ? `${address.trim()}, ${apartment.trim()}` : address.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        emailOffers,
        paymentMethod,
        cardDetails:
          paymentMethod === "card"
            ? {
                cardNumber: `•••• •••• •••• ${cardNumber.replace(/\s/g, "").slice(-4)}`,
                expDate,
                cvc,
                cardName,
              }
            : undefined,
        billingOption,
        billingAddress:
          billingOption === "different"
            ? {
                country: billingCountry,
                firstName: billingFirstName,
                lastName: billingLastName,
                address: billingAddress,
                city: billingCity,
                postalCode: billingPostalCode,
              }
            : undefined,
        discountCode: appliedDiscount?.code,
        discountAmount,
        items: cart.map((item) => ({
          name: item.product.name,
          image: item.product.image,
          short: item.product.short,
          quantity: item.quantity,
          price: item.product.price,
          subtotal: parsePriceToNumber(item.product.price) * item.quantity,
        })),
        subtotal: cartTotal,
        shippingFee,
        grandTotal,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      };

      clearCart();
      setIsSubmitting(false);
      onOrderConfirmed(orderData);
      toast.success("Order Placed Successfully!", {
        description: `Order #${orderId}. Confirmation email sent to ${email}`,
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-slate-950 text-slate-100 overflow-y-auto flex flex-col font-sans">
      {/* Top Header bar with Logo & Close Button */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur-md sm:px-8">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo.png"
            alt="My Small Things logo"
            className="h-10 sm:h-12 w-auto object-contain mix-blend-screen"
          />
          <div className="hidden sm:block border-l border-slate-800 pl-3">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Shopify Secure Checkout
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
        >
          <span>Return to Store</span>
          <X className="size-4" />
        </button>
      </header>

      {/* Mobile Collapsible Order Summary Bar */}
      <div className="lg:hidden border-b border-slate-800 bg-slate-900/80">
        <button
          type="button"
          onClick={() => setShowMobileSummary((prev) => !prev)}
          className="flex w-full items-center justify-between px-4 py-3 text-xs font-medium text-blue-400 hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-4" />
            <span>{showMobileSummary ? "Hide order summary" : "Show order summary"}</span>
            {showMobileSummary ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </div>
          <span className="text-sm font-bold text-white">${grandTotal.toFixed(2)}</span>
        </button>

        <AnimatePresence>
          {showMobileSummary && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-slate-800/80 bg-slate-950 p-4 space-y-4"
            >
              {/* Items List */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.product.slug}
                    className="flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 shrink-0 rounded-xl border border-slate-800 bg-slate-900 p-1">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="size-full object-contain"
                        />
                        <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-white">
                          {item.quantity}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">{item.product.name}</p>
                        <p className="text-[11px] text-slate-400">{item.product.short}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-white">
                      ${(parsePriceToNumber(item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Discount Code */}
              <form
                onSubmit={handleApplyDiscount}
                className="flex gap-2 pt-2 border-t border-slate-800"
              >
                <input
                  type="text"
                  placeholder="Discount code or gift card"
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-white transition-colors"
                >
                  Apply
                </button>
              </form>

              {appliedDiscount && (
                <div className="flex items-center justify-between text-xs bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg text-blue-400">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Tag className="size-3.5" />
                    {appliedDiscount.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAppliedDiscount(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-1.5 border-t border-slate-800 pt-3 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-blue-400">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span className="text-slate-300 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total</span>
                  <span className="text-blue-400 text-base">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Container Split Layout */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:flex-row">
        {/* LEFT COLUMN: Form Sections */}
        <div className="flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:border-r lg:border-slate-800 space-y-8">
          <form onSubmit={handleCompleteOrder} className="space-y-8 max-w-2xl">
            {/* 1. CONTACT SECTION */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Contact</h2>
                <span className="text-xs text-slate-400">
                  Have an account?{" "}
                  <a
                    href="#login"
                    onClick={(e) => e.preventDefault()}
                    className="text-blue-400 hover:underline"
                  >
                    Log in
                  </a>
                </span>
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email or mobile phone number"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className={`w-full rounded-xl border bg-slate-900/90 p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500/30"
                      : "border-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={emailOffers}
                  onChange={(e) => setEmailOffers(e.target.checked)}
                  className="size-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                />
                <span>Email me with news and offers</span>
              </label>
            </section>

            {/* 2. DELIVERY SECTION */}
            <section className="space-y-4 pt-4 border-t border-slate-800/80">
              <h2 className="text-lg font-bold text-white">Delivery</h2>

              {/* Country/Region Dropdown */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Country / Region
                </label>
                <div className="relative">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 pr-10 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Pakistan">Pakistan</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* First name & Last name */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (errors.firstName)
                        setErrors((prev) => ({ ...prev, firstName: undefined }));
                    }}
                    className={`w-full rounded-xl border bg-slate-900/90 p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                      errors.firstName
                        ? "border-red-500 focus:ring-red-500/30"
                        : "border-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: undefined }));
                    }}
                    className={`w-full rounded-xl border bg-slate-900/90 p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                      errors.lastName
                        ? "border-red-500 focus:ring-red-500/30"
                        : "border-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
                  }}
                  className={`w-full rounded-xl border bg-slate-900/90 p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                    errors.address
                      ? "border-red-500 focus:ring-red-500/30"
                      : "border-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
                {errors.address && <p className="mt-1 text-xs text-red-400">{errors.address}</p>}
              </div>

              {/* Apartment / Suite (optional) */}
              <div>
                <input
                  type="text"
                  placeholder="Apartment, suite, etc. (optional)"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* City & Postal Code */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (errors.city) setErrors((prev) => ({ ...prev, city: undefined }));
                    }}
                    className={`w-full rounded-xl border bg-slate-900/90 p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                      errors.city
                        ? "border-red-500 focus:ring-red-500/30"
                        : "border-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
                    }`}
                  />
                  {errors.city && <p className="mt-1 text-xs text-red-400">{errors.city}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Postal code (optional)"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    className={`w-full rounded-xl border bg-slate-900/90 p-3.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 ${
                      errors.phone
                        ? "border-red-500 focus:ring-red-500/30"
                        : "border-slate-800 focus:border-blue-500 focus:ring-blue-500/20"
                    }`}
                  />
                  <Info className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                </div>
                {errors.phone ? (
                  <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
                ) : (
                  <p className="mt-1 text-[11px] text-slate-400">
                    In case we need to contact you about your order
                  </p>
                )}
              </div>
            </section>

            {/* 3. PAYMENT SECTION */}
            <section className="space-y-4 pt-4 border-t border-slate-800/80">
              <div>
                <h2 className="text-lg font-bold text-white">Payment</h2>
                <p className="text-xs text-slate-400">All transactions are secure and encrypted.</p>
              </div>

              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/40">
                {/* Choice 1: Cash on Delivery (COD) */}
                <label
                  className={`flex items-center justify-between p-4 cursor-pointer border-b border-slate-800 transition-colors ${
                    paymentMethod === "cod" ? "bg-blue-500/10" : "hover:bg-slate-900/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="size-4 text-blue-600 accent-blue-600"
                    />
                    <span className="font-semibold text-sm text-white">Cash on Delivery (COD)</span>
                  </div>
                  <Truck className="size-4 text-slate-400" />
                </label>

                {paymentMethod === "cod" && (
                  <div className="p-4 bg-slate-950/60 border-b border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-blue-400 shrink-0" />
                    <span>Pay with cash or card upon doorstep delivery.</span>
                  </div>
                )}

                {/* Choice 2: Debit/Credit Card */}
                <label
                  className={`flex items-center justify-between p-4 cursor-pointer border-b border-slate-800 transition-colors ${
                    paymentMethod === "card" ? "bg-blue-500/10" : "hover:bg-slate-900/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="size-4 text-blue-600 accent-blue-600"
                    />
                    <span className="font-semibold text-sm text-white">
                      Credit Card / Debit Card
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <span>VISA</span>
                    <span>MC</span>
                    <span>AMEX</span>
                  </div>
                </label>

                {paymentMethod === "card" && (
                  <div className="p-4 bg-slate-950/80 border-b border-slate-800 space-y-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Card number"
                        value={cardNumber}
                        onChange={(e) => {
                          setCardNumber(e.target.value);
                          if (errors.cardNumber)
                            setErrors((prev) => ({ ...prev, cardNumber: undefined }));
                        }}
                        className={`w-full rounded-xl border bg-slate-900 p-3 text-xs text-white placeholder-slate-500 focus:outline-none ${
                          errors.cardNumber
                            ? "border-red-500"
                            : "border-slate-800 focus:border-blue-500"
                        }`}
                      />
                      {errors.cardNumber && (
                        <p className="mt-1 text-[11px] text-red-400">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          placeholder="Expiration date (MM / YY)"
                          value={expDate}
                          onChange={(e) => {
                            setExpDate(e.target.value);
                            if (errors.expDate)
                              setErrors((prev) => ({ ...prev, expDate: undefined }));
                          }}
                          className={`w-full rounded-xl border bg-slate-900 p-3 text-xs text-white placeholder-slate-500 focus:outline-none ${
                            errors.expDate
                              ? "border-red-500"
                              : "border-slate-800 focus:border-blue-500"
                          }`}
                        />
                        {errors.expDate && (
                          <p className="mt-1 text-[11px] text-red-400">{errors.expDate}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Security code (CVC)"
                          value={cvc}
                          onChange={(e) => {
                            setCvc(e.target.value);
                            if (errors.cvc) setErrors((prev) => ({ ...prev, cvc: undefined }));
                          }}
                          className={`w-full rounded-xl border bg-slate-900 p-3 text-xs text-white placeholder-slate-500 focus:outline-none ${
                            errors.cvc ? "border-red-500" : "border-slate-800 focus:border-blue-500"
                          }`}
                        />
                        {errors.cvc && (
                          <p className="mt-1 text-[11px] text-red-400">{errors.cvc}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Name on card"
                        value={cardName}
                        onChange={(e) => {
                          setCardName(e.target.value);
                          if (errors.cardName)
                            setErrors((prev) => ({ ...prev, cardName: undefined }));
                        }}
                        className={`w-full rounded-xl border bg-slate-900 p-3 text-xs text-white placeholder-slate-500 focus:outline-none ${
                          errors.cardName
                            ? "border-red-500"
                            : "border-slate-800 focus:border-blue-500"
                        }`}
                      />
                      {errors.cardName && (
                        <p className="mt-1 text-[11px] text-red-400">{errors.cardName}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Choice 3: Direct Bank Transfer */}
                <label
                  className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                    paymentMethod === "bank_transfer" ? "bg-blue-500/10" : "hover:bg-slate-900/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === "bank_transfer"}
                      onChange={() => setPaymentMethod("bank_transfer")}
                      className="size-4 text-blue-600 accent-blue-600"
                    />
                    <span className="font-semibold text-sm text-white">Direct Bank Transfer</span>
                  </div>
                  <Building2 className="size-4 text-slate-400" />
                </label>

                {paymentMethod === "bank_transfer" && (
                  <div className="p-4 bg-slate-950/90 text-xs space-y-2 border-t border-slate-800">
                    <p className="text-slate-300 font-semibold">Our Corporate Bank Account:</p>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 font-mono text-[11px] text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Bank:</span>
                        <span className="text-white font-sans font-medium">Global Tech Bank</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Account Title:</span>
                        <span className="text-white font-sans font-medium">
                          My Small Things Ltd
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Account Number:</span>
                        <span className="text-blue-400 font-bold">4829-1029-8841-0012</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">SWIFT/IBAN:</span>
                        <span className="text-white font-sans">GTBKUS33</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* 4. BILLING ADDRESS SECTION */}
            <section className="space-y-4 pt-4 border-t border-slate-800/80">
              <h2 className="text-lg font-bold text-white">Billing Address</h2>

              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/40">
                <label
                  className={`flex items-center gap-3 p-4 cursor-pointer border-b border-slate-800 transition-colors ${
                    billingOption === "same" ? "bg-blue-500/10" : "hover:bg-slate-900/80"
                  }`}
                >
                  <input
                    type="radio"
                    name="billingOption"
                    value="same"
                    checked={billingOption === "same"}
                    onChange={() => setBillingOption("same")}
                    className="size-4 text-blue-600 accent-blue-600"
                  />
                  <span className="text-sm font-medium text-white">Same as shipping address</span>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                    billingOption === "different" ? "bg-blue-500/10" : "hover:bg-slate-900/80"
                  }`}
                >
                  <input
                    type="radio"
                    name="billingOption"
                    value="different"
                    checked={billingOption === "different"}
                    onChange={() => setBillingOption("different")}
                    className="size-4 text-blue-600 accent-blue-600"
                  />
                  <span className="text-sm font-medium text-white">
                    Use a different billing address
                  </span>
                </label>

                {billingOption === "different" && (
                  <div className="p-4 bg-slate-950/90 border-t border-slate-800 space-y-3">
                    <select
                      value={billingCountry}
                      onChange={(e) => setBillingCountry(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs text-white focus:outline-none"
                    >
                      <option value="Pakistan">Pakistan</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                    </select>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          placeholder="First name"
                          value={billingFirstName}
                          onChange={(e) => setBillingFirstName(e.target.value)}
                          className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                        />
                        {errors.billingFirstName && (
                          <p className="mt-1 text-[11px] text-red-400">{errors.billingFirstName}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Last name"
                          value={billingLastName}
                          onChange={(e) => setBillingLastName(e.target.value)}
                          className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                        />
                        {errors.billingLastName && (
                          <p className="mt-1 text-[11px] text-red-400">{errors.billingLastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        placeholder="Address"
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                      {errors.billingAddress && (
                        <p className="mt-1 text-[11px] text-red-400">{errors.billingAddress}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          placeholder="City"
                          value={billingCity}
                          onChange={(e) => setBillingCity(e.target.value)}
                          className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                        />
                        {errors.billingCity && (
                          <p className="mt-1 text-[11px] text-red-400">{errors.billingCity}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Postal code (optional)"
                          value={billingPostalCode}
                          onChange={(e) => setBillingPostalCode(e.target.value)}
                          className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Desktop Action Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-4 text-base font-bold text-white shadow-xl hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <Lock className="size-4" />
                    <span>Complete order</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Desktop Order Summary Sidebar */}
        <div className="hidden lg:block w-[420px] bg-slate-900/50 p-8 border-l border-slate-800/80 sticky top-16 h-fit space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShoppingBag className="size-4 text-blue-400" />
            <span>Order summary</span>
          </h3>

          {/* Items List */}
          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
            {cart.map((item) => (
              <div
                key={item.product.slug}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative size-16 shrink-0 rounded-2xl border border-slate-800 bg-slate-950 p-1.5">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="size-full object-contain"
                    />
                    <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white shadow-md">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate text-xs sm:text-sm">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{item.product.short}</p>
                  </div>
                </div>
                <span className="font-bold text-white shrink-0 text-sm">
                  ${(parsePriceToNumber(item.product.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Discount code input */}
          <form
            onSubmit={handleApplyDiscount}
            className="flex gap-2 pt-2 border-t border-slate-800"
          >
            <input
              type="text"
              placeholder="Discount code or gift card"
              value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value)}
              className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-xs font-semibold text-white transition-colors"
            >
              Apply
            </button>
          </form>

          {appliedDiscount && (
            <div className="flex items-center justify-between text-xs bg-blue-500/10 border border-blue-500/20 px-3.5 py-2 rounded-xl text-blue-400">
              <span className="flex items-center gap-2 font-mono">
                <Tag className="size-4" />
                {appliedDiscount.code}
              </span>
              <button
                type="button"
                onClick={() => setAppliedDiscount(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          {/* Totals Breakdown */}
          <div className="space-y-2 border-t border-slate-800 pt-4 text-xs sm:text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="text-slate-200 font-medium">${cartTotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-blue-400 font-medium">
                <span>Discount ({appliedDiscount?.code})</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>Shipping</span>
              <span className="text-blue-400 font-medium">Free</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-slate-800">
              <span>Total</span>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-normal mr-1">USD</span>
                <span className="text-xl text-blue-400 font-extrabold">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4 text-xs text-slate-400 flex items-center gap-3">
            <ShieldCheck className="size-5 text-blue-400 shrink-0" />
            <span>Encrypted 256-bit SSL transaction. 100% money-back satisfaction guarantee.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
