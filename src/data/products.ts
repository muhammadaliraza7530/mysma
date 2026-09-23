export type Product = {
  slug: string;
  name: string;
  tagline: string;
  eyebrow: string;
  price: number;
  image: string;
  video?: string;
  gallery: string[];
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
};

export const products: Product[] = [
  {
    slug: "mini-washing-machine",
    name: "Mini washing machine",
    tagline: "Smart Sky Panel touchscreen in a palm-sized drum",
    eyebrow: "Compact laundry, studio-grade care",
    price: 65000,
    image: "/images/mini-washer.webp",
    video: "/videos/mini-washer.mp4",
    gallery: [
      "/images/mini-washer.webp",
      "/images/gallery/mini-washer-open.webp",
      "/images/gallery/mini-washer-angle.webp",
      "/images/gallery/mini-washer-touch-panel.webp",
      "/images/gallery/mini-washer-child-lock.webp",
    ],
    description:
      "A full laundry ritual condensed into a desktop footprint. The entire round front face is a Smart Sky Panel touchscreen — one tap picks the programme, shows the live timer and locks the door. Wash, rinse, spin and warm-air dry in one sealed 304 stainless drum, with UVC sterilisation running automatically through every cycle.",
    features: [
      "Full-face Smart Sky Panel — the front screen is a real touchscreen",
      "One-click touch programmes with live 26-minute countdown display",
      "Child lock: the machine stops automatically when the door is opened",
      "UVC sterilisation with 99.99% germ removal",
      "60°C hot wash and 70°C warm-air drying",
      "750 rpm spin with whisper-quiet <32 dB running",
    ],
    specs: [
      { label: "Control", value: "Smart Sky Panel touchscreen" },
      { label: "Safety", value: "Child lock + door sensor" },
      { label: "Model", value: "GQ-27" },
      { label: "Power", value: "Wash 15W / Dry 180W" },
      { label: "Spin", value: "750 rpm" },
      { label: "Drum", value: "304 stainless steel" },
      { label: "Noise", value: "< 32 dB" },
      { label: "Size", value: "335 × 268 × 375 mm" },
      { label: "Weight", value: "9.7 kg net" },
      { label: "Sterilise", value: "UVC + 60°C" },
    ],

  },
  {
    slug: "mini-washing-machine-grey",
    name: "Mini washing machine Grey",
    tagline: "Brushed graphite finish with the same full wash ritual",
    eyebrow: "Grey edition, quietly powerful",
    price: 68000,
    image: "/images/mini-washer-grey.webp",
    video: "/videos/mini-washer-grey.mp4",
    gallery: [
      "/images/mini-washer-grey.webp",
      "/images/gallery/grey-1.webp",
      "/images/gallery/grey-2.webp",
      "/images/gallery/grey-3.webp",
      "/images/gallery/grey-4.webp",
    ],
    description:
      "The grey edition of our compact washer. A brushed metallic shell wraps the same sealed stainless drum, full-face dark touch panel and sterilising wash-rinse-spin-dry cycle — finished in a deep graphite tone that disappears into modern interiors.",
    features: [
      "Brushed graphite metallic shell",
      "Full-face dark touch control panel",
      "Wash, rinse, spin and warm-air dry in one drum",
      "UVC sterilisation with 99.99% germ removal",
      "Child lock with automatic stop on door open",
      "Whisper-quiet running under 32 dB",
    ],
    specs: [
      { label: "Finish", value: "Brushed grey" },
      { label: "Control", value: "Touch panel" },
      { label: "Power", value: "Wash 15W / Dry 180W" },
      { label: "Spin", value: "750 rpm" },
      { label: "Drum", value: "304 stainless steel" },
      { label: "Noise", value: "< 32 dB" },
      { label: "Size", value: "335 × 268 × 375 mm" },
      { label: "Sterilise", value: "UVC + 60°C" },
    ],
  },
  {
    slug: "mini-shoe-washing-machine",
    name: "Mini shoe washer",
    tagline: "Deep-clean cycles tuned for footwear",
    eyebrow: "Sneaker care, engineered",
    price: 45000,
    image: "/images/shoe-washer.webp",
    video: "/videos/shoe-washer.mp4",
    gallery: ["/images/shoe-washer.webp", "/images/gallery/shoe-box-open.webp", "/images/gallery/shoe-box-panel.webp", "/images/gallery/shoe-box-side.webp", "/images/gallery/shoe-washer-5.webp", "/images/gallery/shoe-washer-6.webp", "/images/gallery/shoe-washer-7.webp", "/images/gallery/shoe-washer-8.webp", "/images/gallery/shoe-washer-9.webp", "/images/gallery/shoe-washer-10.webp", "/images/gallery/shoe-washer-11.webp", "/images/gallery/shoe-washer-12.webp", "/images/gallery/shoe-washer-13.webp"],
    description:
      "Restores sneakers without wrecking them. Gentle agitation, controlled temperature and a drying pass that keeps the silhouette intact.",
    features: [
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
  },
  {
    slug: "electronic-badge",
    name: "Electronic Badge",
    tagline: "Programmable LED badge for teams",
    eyebrow: "Your identity, illuminated",
    price: 15000,
    image: "/images/badge.webp",
    gallery: [
      "/images/badge.webp",
      "/images/gallery/badge-01.webp",
      "/images/gallery/badge-02.webp",
      "/images/gallery/badge-03.webp",
      "/images/gallery/badge-04.webp",
      "/images/gallery/badge-05.webp",
      "/images/gallery/badge-06.webp",
      "/images/gallery/badge-07.webp",
      "/images/gallery/badge-08.webp",
      "/images/gallery/badge-09.webp",
      "/images/gallery/badge-10.webp",
      "/images/gallery/badge-11.webp",
    ],
    description:
      "A crisp LED name badge you program from your phone. Scrolling text, logos and shift-based profiles for the whole floor team.",
    features: [
      "App-programmable text and logos",
      "Seven-day battery on one charge",
      "Magnetic mount, no pin holes",
    ],
    specs: [
      { label: "Display", value: "LED matrix" },
      { label: "Battery", value: "7 days" },
      { label: "Mount", value: "Magnetic" },
      { label: "Sync", value: "Bluetooth" },
    ],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const formatPKR = (n: number) => `Rs. ${n.toLocaleString("en-US")}`;
