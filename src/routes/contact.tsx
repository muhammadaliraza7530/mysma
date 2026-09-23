import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Building2, Check, Clock, Copy, Mail, MapPin, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Starfield } from "@/components/Starfield";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | My Small Things by Mishel" },
      {
        name: "description",
        content:
          "Talk to the My Small Things team about orders, delivery and warranty. We answer every message within one business day.",
      },
      { property: "og:title", content: "Contact | My Small Things by Mishel" },
      { property: "og:description", content: "We answer every message within one business day." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const input =
  "w-full rounded-2xl border border-border bg-surface/60 px-4 py-3 text-sm outline-none backdrop-blur transition-colors placeholder:text-muted-foreground focus:border-primary";

import { WHATSAPP_DISPLAY, waLink } from "@/lib/contact";

const NOTIFY_EMAIL = "sales@mysmallthings.com";

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [links, setLinks] = useState({ wa: "", mail: "" });

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText("04251011256733");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "");
    const email = String(fd.get("email") ?? "");
    const phone = String(fd.get("phone") ?? "");
    const message = String(fd.get("message") ?? "");

    const body = [
      "New enquiry — My Small Things",
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : "",
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const wa = waLink(body);
    const mail = `mailto:${NOTIFY_EMAIL}?subject=${encodeURIComponent(
      `New enquiry from ${name || "website"}`,
    )}&body=${encodeURIComponent(body)}`;

    setLinks({ wa, mail });
    setSent(true);
    if (typeof window !== "undefined") window.open(wa, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="pb-24">
      <section
        className="relative overflow-hidden pt-32 pb-16"
        style={{ background: "var(--gradient-hero)" }}
      >
        <Starfield count={22} />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <span className="eyebrow text-primary">Contact</span>
          <h1 className="light-sweep mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            We actually answer.
          </h1>
          <p className="mt-5 text-sm text-muted-foreground sm:text-base">
            Questions about a machine, delivery or warranty? Send a note and our team replies within
            one business day.
          </p>
        </div>
      </section>

      <div className="mx-auto mt-14 grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <Reveal>
          <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 sm:p-8">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >
                <Check className="mx-auto size-10 text-primary" />
                <h2 className="mt-4 text-xl font-semibold">Message ready to send</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  WhatsApp just opened with your message. You can also send it by email.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <a
                    href={links.wa}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground glow-ring transition-transform hover:scale-[1.01]"
                  >
                    Send on WhatsApp
                  </a>
                  <a
                    href={links.mail}
                    className="rounded-full border border-border py-3 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
                  >
                    Send by email
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-5 text-xs text-muted-foreground underline-offset-4 hover:underline"
                >
                  Write another message
                </button>
              </motion.div>
            ) : (
              <>
                <h2 className="text-xl font-semibold">Send a message</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <input required name="name" placeholder="Your name" className={input} />
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="Email address"
                    className={input}
                  />
                </div>
                <input name="phone" placeholder="Phone (optional)" className={`${input} mt-3`} />
                <textarea
                  required
                  name="message"
                  rows={5}
                  placeholder="How can we help?"
                  className={`${input} mt-3`}
                />
                <button
                  type="submit"
                  className="mt-5 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground glow-ring transition-transform hover:scale-[1.01]"
                >
                  Send message
                </button>
              </>
            )}
          </form>
        </Reveal>


        <Reveal delay={0.1}>
          <div className="space-y-4">
            {[
              {
                icon: Mail,
                label: "Email",
                value: "sales@mysmallthings.com",
                href: "mailto:sales@mysmallthings.com",
              },
              {
                icon: MessageCircle,
                label: "WhatsApp",
                value: WHATSAPP_DISPLAY,
                href: waLink("Hi! I have a question about My Small Things."),
              },
              {
                icon: MapPin,
                label: "Address",
                value: "308 Y Phase 3, DHA, Lahore, Punjab, Pakistan",
                href: "https://maps.google.com/?q=308+Y+Phase+3+DHA+Lahore+Punjab+Pakistan",
              },
              { icon: Clock, label: "Hours", value: "Mon–Sat, 10am – 5pm PKT" },
              {
                icon: Building2,
                label: "Bank Transfer",
                value: "Bank Alfalah · 04251011256733 · Mishel Usman",
                copy: "04251011256733",
              },
            ].map(({ icon: Icon, label, value, href, copy }) => (
              <div key={label} className="glass-card flex items-center gap-4 rounded-2xl p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="eyebrow text-muted-foreground">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="mt-1 block break-words text-sm font-medium transition-colors hover:text-primary"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm font-medium">{value}</p>
                  )}
                </div>
                {copy && (
                  <button
                    type="button"
                    onClick={copyAccount}
                    aria-label="Copy account number"
                    className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/15 text-primary transition-colors hover:bg-primary/25"
                  >
                    {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  </button>
                )}
              </div>
            ))}

            <div className="glass-card overflow-hidden rounded-2xl p-1.5">
              <iframe
                title="My Small Things studio location — 308 Y Phase 3, DHA, Lahore"
                src="https://www.google.com/maps?q=308%20Y%20Phase%203%20DHA%20Lahore%20Punjab%20Pakistan&output=embed"
                width="100%"
                height="260"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl border-0 grayscale-[35%] contrast-110"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
