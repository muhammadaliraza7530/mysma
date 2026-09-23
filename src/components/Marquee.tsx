import { Sparkles } from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const DEFAULT_ITEMS = [
  "Limited Launch Offer",
  "Free Delivery Nationwide",
  "1-Year Premium Warranty",
  "Exclusive Online Price",
  "New Arrivals Now Live",
  "Shop the Collection",
];

export function Marquee({ items }: { items?: string[] }) {
  const { settings } = useSiteSettings();
  const activeItems = items ?? (settings.marquee.length ? settings.marquee : DEFAULT_ITEMS);
  const loop = [...activeItems, ...activeItems];
  return (
    <div className="relative overflow-hidden border-y border-primary/20 bg-primary/5 py-3.5">
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-10 eyebrow text-sm font-medium tracking-widest text-primary uppercase"
          >
            {item}
            <Sparkles className="size-3.5 text-primary/80" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}

