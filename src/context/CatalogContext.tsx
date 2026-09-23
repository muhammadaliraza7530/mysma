import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products as seedProducts, type Product } from "@/data/products";

export type CatalogProduct = Product & { hidden?: boolean };

type HistoryEntry = { items: CatalogProduct[]; label: string };
type CatalogContextValue = {
  products: CatalogProduct[];
  allProducts: CatalogProduct[];
  getBySlug: (slug: string) => CatalogProduct | undefined;
  addProduct: (product: CatalogProduct) => void;
  updateProduct: (slug: string, product: CatalogProduct) => void;
  deleteProduct: (slug: string) => void;
  duplicateProduct: (slug: string) => void;
  toggleVisibility: (slug: string) => void;
  reorder: (fromIndex: number, toIndex: number) => void;
  replaceProducts: (products: CatalogProduct[]) => boolean;
  undo: () => string | null;
  canUndo: boolean;
  lastChangeLabel: string | null;
  historyCount: number;
  isHydrated: boolean;
};

const STORAGE_KEY = "mst_catalog_v2";
const MAX_HISTORY = 30;
const CatalogContext = createContext<CatalogContextValue | undefined>(undefined);

export function slugify(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "product";
}

export function uniqueSlug(name: string, taken: string[]) {
  const base = slugify(name);
  if (!taken.includes(base)) return base;
  let suffix = 2;
  while (taken.includes(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

function sanitize(value: unknown): CatalogProduct[] | null {
  if (!Array.isArray(value)) return null;
  const products = value.filter(
    (item): item is CatalogProduct =>
      Boolean(item) && typeof item === "object" && typeof (item as CatalogProduct).slug === "string",
  );
  return products.map((product) => ({
    ...product,
    name: product.name ?? "Untitled product",
    tagline: product.tagline ?? "",
    eyebrow: product.eyebrow ?? "",
    price: Number(product.price) || 0,
    image: product.image ?? "/images/logo.webp",
    gallery: Array.isArray(product.gallery) ? product.gallery : [],
    description: product.description ?? "",
    features: Array.isArray(product.features) ? product.features : [],
    specs: Array.isArray(product.specs) ? product.specs : [],
  }));
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CatalogProduct[]>(seedProducts);
  const [past, setPast] = useState<HistoryEntry[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const saved = raw ? sanitize(JSON.parse(raw)) : null;
      if (saved?.length) setItems(saved);
    } catch {
      // Ignore unavailable or corrupt browser storage.
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore unavailable browser storage.
    }
  }, [isHydrated, items]);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        const saved = sanitize(JSON.parse(event.newValue));
        if (saved) setItems(saved);
      } catch {
        // Ignore malformed updates from another tab.
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const value = useMemo<CatalogContextValue>(() => {
    const commit = (label: string, next: CatalogProduct[]) => {
      setPast((history) => [...history, { items, label }].slice(-MAX_HISTORY));
      setItems(next);
    };

    return {
      products: items.filter((product) => !product.hidden),
      allProducts: items,
      getBySlug: (slug) => items.find((product) => product.slug === slug && !product.hidden),
      addProduct: (product) => commit(`Added “${product.name}”`, [...items, product]),
      updateProduct: (slug, product) =>
        commit(`Edited “${product.name}”`, items.map((item) => (item.slug === slug ? product : item))),
      deleteProduct: (slug) => {
        const product = items.find((item) => item.slug === slug);
        commit(`Deleted “${product?.name ?? "product"}”`, items.filter((item) => item.slug !== slug));
      },
      duplicateProduct: (slug) => {
        const product = items.find((item) => item.slug === slug);
        if (!product) return;
        const copy = {
          ...product,
          name: `${product.name} copy`,
          slug: uniqueSlug(`${product.name} copy`, items.map((item) => item.slug)),
          hidden: true,
        };
        const next = [...items];
        next.splice(items.findIndex((item) => item.slug === slug) + 1, 0, copy);
        commit(`Copied “${product.name}”`, next);
      },
      toggleVisibility: (slug) => {
        const product = items.find((item) => item.slug === slug);
        commit(
          product?.hidden ? `Showed “${product.name}”` : `Hid “${product?.name ?? "product"}”`,
          items.map((item) => (item.slug === slug ? { ...item, hidden: !item.hidden } : item)),
        );
      },
      reorder: (fromIndex, toIndex) => {
        if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= items.length || toIndex >= items.length) return;
        const next = [...items];
        const removed = next.splice(fromIndex, 1);
        const moved = removed[0];
        if (!moved) return;
        next.splice(toIndex, 0, moved);
        commit(`Moved “${moved.name}”`, next);
      },
      replaceProducts: (products) => {
        const clean = sanitize(products);
        if (!clean?.length) return false;
        commit("Restored catalogue backup", clean);
        return true;
      },
      undo: () => {
        const last = past[past.length - 1];
        if (!last) return null;
        setPast((history) => history.slice(0, -1));
        setItems(last.items);
        return last.label;
      },
      canUndo: past.length > 0,
      lastChangeLabel: past[past.length - 1]?.label ?? null,
      historyCount: past.length,
      isHydrated,
    };
  }, [isHydrated, items, past]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error("useCatalog must be used inside CatalogProvider");
  return context;
}