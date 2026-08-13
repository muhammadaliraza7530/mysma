export type Product = {
  slug: string;
  name: string;
  short: string;
  tagline: string;
  price: string;
  image: string;
  cutout: string;
  gallery: string[];
  video?: string;
  color: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  description: string;
};

export const products: Product[] = [
  {
    slug: "mini-washing-machine",
    name: "Mini Washing Machine",
    short: "Compact laundry, studio-grade care",
    tagline: "Sky Panel intelligence in a palm-sized drum",
    price: "PKR 24,900",
    image: "/images/mini-washer.jpg",
    cutout: "/images/hero/washer.png",
    gallery: [
      "/images/mini-washer.jpg",
      "/images/washer-panel.jpg",
      "/images/washer-childlock.jpg",
    ],
    color: "#39b7ea",
    highlights: [
      "Smart Sky Panel with one-tap programs",
      "Child lock — stops instantly when opened",
      "High-temperature sterilising wash",
    ],
    specs: [
      { label: "Capacity", value: "3.0 kg" },
      { label: "Programs", value: "8 smart cycles" },
      { label: "Power", value: "260 W" },
      { label: "Noise", value: "< 48 dB" },
    ],
    description:
      "Engineered for small spaces and big standards. A sculpted shell, a glass Sky Panel and a whisper-quiet inverter drum turn everyday laundry into a quiet ritual.",
  },
  {
    slug: "mini-shoe-washing-machine",
    name: "Mini Shoe Washing Machine",
    short: "Sneaker care, engineered",
    tagline: "Deep-clean cycles tuned for footwear",
    price: "PKR 27,500",
    image: "/images/shoe-washer.jpg",
    cutout: "/images/hero/shoe.png",
    gallery: [
      "/images/washer-panel.jpg",
      "/images/washer-childlock.jpg",
      "/images/newShoeImages/WhatsApp Image 2026-08-13 at 4.13.57 AM.jpeg",
      "/images/newShoeImages/WhatsApp Image 2026-08-13 at 4.13.58 AM (1).jpeg",
      "/images/newShoeImages/WhatsApp Image 2026-08-13 at 4.13.58 AM.jpeg",
      "/images/newShoeImages/WhatsApp Image 2026-08-13 at 4.13.59 AM (1).jpeg",
      "/images/newShoeImages/WhatsApp Image 2026-08-13 at 4.13.59 AM (2).jpeg",
      "/images/newShoeImages/WhatsApp Image 2026-08-13 at 4.13.59 AM.jpeg",
    ],
    video: "/images/shoeVideo.mp4",
    color: "#3aa7ff",
    highlights: [
      "Dedicated sneaker drum with soft ribs",
      "25-minute quick refresh cycle",
      "Ozone-assisted odour removal",
    ],
    specs: [
      { label: "Capacity", value: "2 pairs" },
      { label: "Cycle", value: "25 / 45 min" },
      { label: "Power", value: "220 W" },
      { label: "Drum", value: "Soft-touch ABS" },
    ],
    description:
      "Restores sneakers without wrecking them. Gentle agitation, controlled temperature and a drying pass that keeps the silhouette intact.",
  },
  {
    slug: "precision-blower",
    name: "Precision Blower",
    short: "Cordless airflow gadget",
    tagline: "Turbine-grade air in one hand",
    price: "PKR 12,400",
    image: "/images/blower.jpg",
    cutout: "/images/hero/blower.png",
    gallery: ["/images/blower.jpg", "/images/beambox.jpg"],
    color: "#5cc8f5",
    highlights: [
      "110,000 RPM brushless turbine",
      "3 airflow modes, hot and cold",
      "USB-C fast charge, 40 min runtime",
    ],
    specs: [
      { label: "Airflow", value: "52 m/s" },
      { label: "Battery", value: "2600 mAh" },
      { label: "Weight", value: "480 g" },
      { label: "Charge", value: "USB-C PD" },
    ],
    description:
      "A machined, cordless blower for desks, keyboards, cameras and cars. Precision nozzles, aerospace-style venting, zero cables.",
  },
  {
    slug: "electronic-badge",
    name: "Electronic Badge",
    short: "Your identity, illuminated",
    tagline: "Programmable LED badge for teams",
    price: "PKR 8,900",
    image: "/images/badge.jpg",
    cutout: "/images/hero/badge.png",
    gallery: ["/images/badge.jpg", "/images/beambox.jpg"],
    color: "#2fd2ff",
    highlights: [
      "App-programmable scrolling display",
      "Brushed metal frame, magnetic mount",
      "7-day battery on a single charge",
    ],
    specs: [
      { label: "Display", value: "44 x 11 LED" },
      { label: "Battery", value: "7 days" },
      { label: "Mount", value: "Magnet / pin" },
      { label: "Control", value: "Bluetooth app" },
    ],
    description:
      "A crisp LED nameplate for hospitality, retail and events. Set names, roles and animations from your phone in seconds.",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
