import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "mst_site_settings_v1";
export const DEFAULT_PASSWORDS = ["12345678", "12345768"];

export type SiteSettings = {
  password: string;
  announcement: { enabled: boolean; text: string };
  hero: {
    badge: string;
    titleTop: string;
    titleBottom: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
  };
  marquee: string[];
  cta: { title: string; highlight: string; subtitle: string; button: string };
  footer: {
    about: string;
    email: string;
    phone: string;
    line1: string;
    line2: string;
  };
};

export const defaultSettings: SiteSettings = {
  password: "12345678",
  announcement: {
    enabled: false,
    text: "Free delivery across Pakistan — limited time",
  },
  hero: {
    badge: "Luxury compact tech",
    titleTop: "mysmall",
    titleBottom: "things.",
    subtitle: "Small Things. Big Impact.",
    primaryCta: "Explore the collection",
    secondaryCta: "See all products",
  },
  marquee: [
    "Small Things. Big Impact.",
    "Cinematic engineering",
    "1-year warranty",
    "Nationwide delivery",
    "Quiet by design",
    "Premium materials",
  ],
  cta: {
    title: "Ready for the",
    highlight: "small upgrade",
    subtitle: "Free delivery, one-year warranty and a support team that actually answers.",
    button: "Shop My Small Things",
  },
  footer: {
    about: "Small Things. Big Impact. Compact machines engineered with flagship obsession.",
    email: "sales@mysmallthings.com",
    phone: "0335-4405555",
    line1: "Free nationwide delivery",
    line2: "1-year warranty",
  },
};

type Ctx = {
  settings: SiteSettings;
  updateSettings: (patch: Partial<SiteSettings>) => void;
  replaceSettings: (settings: SiteSettings) => void;
  setPassword: (password: string) => void;
  checkPassword: (input: string) => boolean;
  resetSettings: () => void;
  isHydrated: boolean;
};

const SiteSettingsContext = createContext<Ctx | undefined>(undefined);

function merge(saved: unknown): SiteSettings {
  if (!saved || typeof saved !== "object") return defaultSettings;
  const s = saved as Partial<SiteSettings>;
  return {
    password: typeof s.password === "string" && s.password ? s.password : defaultSettings.password,
    announcement: { ...defaultSettings.announcement, ...(s.announcement ?? {}) },
    hero: { ...defaultSettings.hero, ...(s.hero ?? {}) },
    marquee:
      Array.isArray(s.marquee) && s.marquee.length
        ? s.marquee.filter((m): m is string => typeof m === "string")
        : defaultSettings.marquee,
    cta: { ...defaultSettings.cta, ...(s.cta ?? {}) },
    footer: { ...defaultSettings.footer, ...(s.footer ?? {}) },
  };
}

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings(merge(JSON.parse(raw)));
    } catch {
      // ignore corrupt storage
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings, isHydrated]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        setSettings(merge(JSON.parse(e.newValue)));
      } catch {
        // ignore
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      settings,
      isHydrated,
      updateSettings: (patch) => setSettings((prev) => ({ ...prev, ...patch })),
      replaceSettings: (next) => setSettings(merge(next)),
      setPassword: (password) => setSettings((prev) => ({ ...prev, password })),
      checkPassword: (input) => {
        const clean = input.trim();
        if (!clean) return false;
        if (clean === settings.password) return true;
        // Original factory passwords keep working until a custom one is set.
        return settings.password === defaultSettings.password && DEFAULT_PASSWORDS.includes(clean);
      },
      resetSettings: () => setSettings({ ...defaultSettings, password: settings.password }),
    }),
    [settings, isHydrated],
  );

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  return ctx;
}
