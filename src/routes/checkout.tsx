import { Logo } from "@/components/Logo";
import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Banknote,
  Building2,
  CheckCircle2,
  ChevronDown,
  Copy,
  CreditCard,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { formatPKR } from "@/data/products";
import { WHATSAPP_DISPLAY, waLink } from "@/lib/contact";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout | My Small Things by Mishel" },
      {
        name: "description",
        content:
          "Complete your My Small Things order with cash on delivery, card or bank transfer. Free nationwide delivery.",
      },
      { property: "og:title", content: "Secure Checkout | My Small Things" },
      { property: "og:description", content: "Fast, encrypted checkout with free delivery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Checkout,
});

const PAYMENTS = [
  {
    id: "cod",
    label: "Cash on Delivery",
    note: "10% advance payment is required to confirm the order. Remaining amount is paid at your doorstep.",
    icon: Banknote,
  },
  { id: "card", label: "Credit / Debit Card", note: "VISA · MC · AMEX", icon: CreditCard },
  { id: "bank", label: "Direct Bank Transfer", note: "Transfer the full amount to our business account.", icon: Building2 },
];

const inputClass =
  "w-full min-w-0 rounded-2xl border border-border bg-surface/60 px-4 py-3.5 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/40";


function Checkout() {
  const { items, subtotal, clear } = useCart();
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [payment, setPayment] = useState("cod");
  const [billingSame, setBillingSame] = useState(true);
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    contact: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    postal: "",
    phone: "",
  });

  const orderId = useMemo(
    () => `#MST-${Math.floor(100000 + Math.random() * 899999).toString().slice(0, 6)}`,
    [],
  );

  const advance = Math.round(subtotal * 0.1);
  const balance = subtotal - advance;


  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = [
      `New order ${orderId} — My Small Things`,
      `Name: ${form.firstName} ${form.lastName}`.trim(),
      `Contact: ${form.contact}`,
      form.phone ? `Phone: ${form.phone}` : "",
      `Address: ${[form.address, form.apartment, form.city, form.postal].filter(Boolean).join(", ")}`,
      `Payment: ${payment}`,
      "",
      ...items.map((i) => `• ${i.product.name} x${i.qty}`),
    ]
      .filter(Boolean)
      .join("\n");
    if (typeof window !== "undefined") window.open(waLink(body), "_blank", "noopener,noreferrer");
    setStatus("processing");
    window.setTimeout(() => {
      setStatus("done");
      clear();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1800);
  };

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText("04251011256733");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  if (status === "done") {
    return <Confirmation orderId={orderId} form={form} payment={payment} />;
  }

  return (
    <div className="min-h-screen">
      {/* checkout bar */}
      <div className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Logo className="h-5 w-auto shrink-0 sm:h-6" />
          <Link
            to="/products"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-2 text-xs sm:px-4 sm:text-sm"
          >
            Return to Store <X className="size-3.5" />
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setSummaryOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 border-t border-border bg-surface/40 px-4 py-3 sm:px-6"
        >
          <span className="flex min-w-0 items-center gap-2 text-sm text-primary">
            <ShoppingBag className="size-4 shrink-0" />{" "}
            <span className="truncate">Show order summary</span>
            <ChevronDown
              className={`size-4 shrink-0 transition-transform ${summaryOpen ? "rotate-180" : ""}`}
            />
          </span>
          <span className="shrink-0 text-base font-semibold">{formatPKR(subtotal)}</span>

        </button>
        <AnimatePresence>
          {summaryOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border bg-background/95"
            >
              <ul className="mx-auto max-w-6xl space-y-3 px-4 py-4 sm:px-6">
                {items.map(({ product, qty }) => (
                  <li key={product.slug} className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="size-12 rounded-xl border border-border object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty {qty}</p>
                    </div>
                    <span className="text-sm text-primary">{formatPKR(product.price * qty)}</span>
                  </li>
                ))}
                {items.length === 0 && (
                  <li className="py-4 text-center text-sm text-muted-foreground">
                    Your cart is empty.
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={submit} className="mx-auto w-full max-w-6xl overflow-x-hidden px-4 pb-24 pt-36 sm:px-6 sm:pt-40">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
          <div className="min-w-0 space-y-10">

            {/* Contact */}
            <section>
              <div className="flex items-baseline justify-between">
                <h2 className="text-2xl font-semibold">Contact</h2>
                <span className="text-xs text-muted-foreground">
                  Have an account? <span className="text-primary">Log in</span>
                </span>
              </div>
              <input
                required
                value={form.contact}
                onChange={set("contact")}
                placeholder="Email or mobile phone number"
                className={`${inputClass} mt-4`}
              />
              <label className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" defaultChecked className="size-4 accent-[oklch(0.64_0.2_258)]" />
                Email me with news and offers
              </label>
            </section>

            {/* Delivery */}
            <section className="border-t border-border pt-8">
              <h2 className="text-2xl font-semibold">Delivery</h2>
              <p className="mt-4 eyebrow text-muted-foreground">Country / Region</p>
              <div className="relative mt-2">
                <select
                  className={`${inputClass} appearance-none`}
                  defaultValue="Pakistan"
                  aria-label="Country or region"
                >
                  <option>Pakistan</option>
                  <option>United Arab Emirates</option>
                  <option>United Kingdom</option>
                  <option>United States</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input required value={form.firstName} onChange={set("firstName")} placeholder="First name" className={inputClass} />
                <input required value={form.lastName} onChange={set("lastName")} placeholder="Last name" className={inputClass} />
              </div>
              <input required value={form.address} onChange={set("address")} placeholder="Address" className={`${inputClass} mt-3`} />
              <input value={form.apartment} onChange={set("apartment")} placeholder="Apartment, suite, etc. (optional)" className={`${inputClass} mt-3`} />
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input required value={form.city} onChange={set("city")} placeholder="City" className={inputClass} />
                <input value={form.postal} onChange={set("postal")} placeholder="Postal code (optional)" className={inputClass} />
              </div>
              <input required value={form.phone} onChange={set("phone")} placeholder="Phone" className={`${inputClass} mt-3`} />
              <p className="mt-2 text-xs text-muted-foreground">
                In case we need to contact you about your order
              </p>
            </section>

            {/* Payment */}
            <section className="border-t border-border pt-8">
              <h2 className="text-2xl font-semibold">Payment</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                All transactions are secure and encrypted.
              </p>
              <div className="mt-4 overflow-hidden rounded-2xl border border-border">
                {PAYMENTS.map(({ id, label, note, icon: Icon }) => (
                  <div key={id} className="border-b border-border last:border-0">
                    <button
                      type="button"
                      onClick={() => setPayment(id)}
                      className={`flex w-full items-center justify-between px-4 py-4 text-left text-sm transition-colors ${
                        payment === id ? "bg-primary/10" : "bg-surface/40 hover:bg-surface-2/40"
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span
                          className={`grid size-4 shrink-0 place-items-center rounded-full border ${
                            payment === id ? "border-primary" : "border-muted-foreground"
                          }`}
                        >
                          {payment === id && <span className="size-2 rounded-full bg-primary" />}
                        </span>
                        <span className="truncate">{label}</span>
                      </span>
                      <Icon className="size-4 shrink-0 text-muted-foreground" />

                    </button>
                    {payment === id && (
                      <div className="bg-surface/60 px-3 pb-4 sm:px-4">
                        <div className="space-y-3 pt-1">
                          <p className="text-xs leading-relaxed text-muted-foreground">{note}</p>

                          {id === "cod" && (
                            <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 sm:p-4">
                              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                                <span className="text-xs text-muted-foreground">
                                  Advance payable now (10%)
                                </span>
                                <span className="text-sm font-semibold text-primary">
                                  {formatPKR(advance)}
                                </span>
                              </div>
                              <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                                <span className="text-xs text-muted-foreground">
                                  Balance on delivery
                                </span>
                                <span className="text-sm font-medium">{formatPKR(balance)}</span>
                              </div>
                            </div>
                          )}

                          {(id === "cod" || id === "bank") && (
                            <div className="rounded-xl border border-border bg-surface/80 p-3 sm:p-4">
                              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                                {id === "cod"
                                  ? "Send the 10% advance to"
                                  : "Transfer the amount to"}
                              </p>
                              <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="text-xs text-muted-foreground">Bank Alfalah</p>
                                  <p className="mt-0.5 break-all text-sm font-semibold tracking-wide">
                                    04251011256733
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Account Title: Mishel Usman
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={copyAccount}
                                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/25"
                                >
                                  {copied ? (
                                    <>
                                      <CheckCircle2 className="size-3.5" /> Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="size-3.5" /> Copy
                                    </>
                                  )}
                                </button>
                              </div>
                              <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                                After transferring, share the receipt screenshot on WhatsApp
                                ({WHATSAPP_DISPLAY}) or at sales@mysmallthings.com for faster
                                confirmation.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                ))}
              </div>

              <h3 className="mt-8 text-lg font-semibold">Billing Address</h3>
              <div className="mt-3 overflow-hidden rounded-2xl border border-border">
                {[
                  { id: true, label: "Same as shipping address" },
                  { id: false, label: "Use a different billing address" },
                ].map((opt) => (
                  <button
                    key={String(opt.id)}
                    type="button"
                    onClick={() => setBillingSame(opt.id)}
                    className={`flex w-full items-center gap-3 border-b border-border px-4 py-4 text-left text-sm last:border-0 ${
                      billingSame === opt.id ? "bg-primary/10" : "bg-surface/40"
                    }`}
                  >
                    <span
                      className={`grid size-4 shrink-0 place-items-center rounded-full border ${
                        billingSame === opt.id ? "border-primary" : "border-muted-foreground"
                      }`}
                    >
                      {billingSame === opt.id && <span className="size-2 rounded-full bg-primary" />}
                    </span>
                    <span className="min-w-0 truncate">{opt.label}</span>
                  </button>
                ))}
              </div>

              {/* mobile totals */}
              <div className="mt-8 space-y-2 rounded-2xl border border-border bg-surface/40 p-4 text-sm lg:hidden">
                <div className="flex justify-between gap-3 text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between gap-3 text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-primary">FREE Nationwide</span>
                </div>
                <div className="flex justify-between gap-3 border-t border-border pt-2 text-base font-semibold">
                  <span>Grand Total</span>
                  <span>{formatPKR(subtotal)}</span>
                </div>
                {payment === "cod" && (
                  <div className="flex justify-between gap-3 text-xs text-primary">
                    <span>Advance due now (10%)</span>
                    <span>{formatPKR(advance)}</span>
                  </div>
                )}
              </div>

              <button

                type="submit"
                disabled={status === "processing" || items.length === 0}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold text-primary-foreground glow-ring transition-transform enabled:hover:scale-[1.01] disabled:opacity-60"
              >
                {status === "processing" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Processing Order...
                  </>
                ) : (
                  "Complete Order"
                )}
              </button>
            </section>
          </div>

          {/* Summary column */}
          <aside className="hidden lg:block">
            <div className="surface-panel sticky top-40 rounded-3xl p-6">
              <h3 className="eyebrow text-muted-foreground">Order summary</h3>
              <ul className="mt-5 space-y-4">
                {items.map(({ product, qty }) => (
                  <li key={product.slug} className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="size-14 rounded-xl border border-border object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {qty} × {formatPKR(product.price)}
                      </p>
                    </div>
                    <span className="text-sm">{formatPKR(product.price * qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-primary">FREE Nationwide</span>
                </div>
                <div className="flex justify-between pt-2 text-base font-semibold">
                  <span>Grand Total</span>
                  <span>{formatPKR(subtotal)}</span>
                </div>
                {payment === "cod" && (
                  <>
                    <div className="flex justify-between text-xs text-primary">
                      <span>Advance due now (10%)</span>
                      <span>{formatPKR(advance)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Balance on delivery</span>
                      <span>{formatPKR(balance)}</span>
                    </div>
                  </>
                )}

              </div>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}

function Confirmation({
  orderId,
  form,
  payment,
}: {
  orderId: string;
  form: {
    contact: string;
    firstName: string;
    lastName: string;
    address: string;
    apartment: string;
    city: string;
    postal: string;
    phone: string;
  };
  payment: string;
}) {
  const label = PAYMENTS.find((p) => p.id === payment)?.label ?? "Cash on Delivery (COD)";
  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <CheckCircle2 className="mx-auto size-16 text-primary" />
          <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">Order Confirmed!</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Thank you, <span className="text-foreground">{form.firstName || "friend"}</span>! Your
            order has been placed.
          </p>
          <p className="mt-4 inline-block rounded-full border border-border bg-surface/60 px-4 py-2 text-xs">
            Order ID: <span className="text-primary">{orderId}</span>
          </p>
        </motion.div>

        <div className="surface-panel mt-10 rounded-3xl p-6">
          <h2 className="eyebrow text-primary">Customer &amp; Shipping</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <User className="size-4" /> {form.firstName} {form.lastName}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4" /> {form.contact}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4" /> {form.phone}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4" /> {form.address}, {form.city} {form.postal}
            </li>
          </ul>
        </div>

        <div className="surface-panel mt-4 rounded-3xl p-6">
          <h2 className="eyebrow text-primary">Payment method</h2>
          <p className="mt-3 text-sm text-muted-foreground">{label}</p>
        </div>

        <Link
          to="/products"
          className="mt-8 block rounded-full bg-primary py-4 text-center text-sm font-semibold text-primary-foreground glow-ring"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
