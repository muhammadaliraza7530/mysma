import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Lock,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  PackageSearch,
  Boxes,
  Wallet,
  ShieldCheck,
  Undo2,

  Search,
  LayoutGrid,
  MonitorPlay,
  Paintbrush,
  KeyRound,
  ArrowLeft,
  Home,
} from "lucide-react";
import { useCatalog, uniqueSlug, type CatalogProduct } from "@/context/CatalogContext";
import {
  ProductFormDialog,
  emptyDraft,
  draftFromProduct,
  type ProductDraft,
} from "@/components/admin/ProductFormDialog";
import { formatPKR } from "@/data/products";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { WebsiteSettingsPanel } from "@/components/admin/WebsiteSettingsPanel";
import { PreviewPanel } from "@/components/admin/PreviewPanel";
import { SecurityPanel } from "@/components/admin/SecurityPanel";
import { Button } from "@/components/ui/button";

const SESSION_KEY = "mst_admin_unlocked";

const TABS = [
  { key: "products", label: "Products", icon: LayoutGrid },
  { key: "website", label: "Website", icon: Paintbrush },
  { key: "preview", label: "Preview", icon: MonitorPlay },
  { key: "security", label: "Password & Backup", icon: KeyRound },
] as const;

type TabKey = (typeof TABS)[number]["key"];
type ProductFilter = "all" | "live" | "hidden";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — My Small Things" },
      {
        name: "description",
        content:
          "Private control panel for My Small Things: add, edit, reorder, hide and delete products without any coding.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin Dashboard — My Small Things" },
      { property: "og:description", content: "Manage the My Small Things product catalogue." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setUnlocked(localStorage.getItem(SESSION_KEY) === "yes");
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  const unlock = () => {
    try {
      localStorage.setItem(SESSION_KEY, "yes");
    } catch {
      // ignore
    }
    setUnlocked(true);
  };

  const lock = () => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
    setUnlocked(false);
    toast.success("Signed out");
    void navigate({ to: "/" });
  };

  if (!ready) {
    return <div className="min-h-screen bg-background" />;
  }

  return unlocked ? <Dashboard onLogout={lock} /> : <LoginScreen onUnlock={unlock} />;
}

/* ------------------------------- LOGIN ---------------------------------- */

function LoginScreen({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { checkPassword } = useSiteSettings();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkPassword(password)) {
      setError(false);
      onUnlock();
      toast.success("Welcome back, admin");
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0 scene-vignette" />
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />

      <form
        onSubmit={submit}
        className="glass-panel relative w-full max-w-md rounded-[32px] border border-primary/25 p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center">
          <img
            src="/images/logo-alpha.webp"
            alt="My Small Things"
            width={240}
            height={72}
            className="h-11 w-auto mix-blend-screen"
          />
          <div className="mt-7 flex size-14 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10">
            <Lock className="size-6 text-primary" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-foreground">Admin Portal</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your password to manage the store.
          </p>
        </div>

        <div className="mt-8">
          <label className="text-xs font-semibold tracking-widest text-primary uppercase">
            Password
          </label>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="••••••••"
            className={`mt-2 w-full rounded-2xl border bg-card/60 px-4 py-4 text-center text-lg tracking-[0.4em] text-foreground outline-none transition-colors ${
              error ? "border-red-500/70" : "border-border focus:border-primary"
            }`}
          />
          {error && (
            <p className="mt-2.5 text-center text-sm text-red-400">
              Wrong password. Please try again.
            </p>
          )}
        </div>

        <button
          type="submit"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:glow-ring"
        >
          <ShieldCheck className="size-4" />
          Unlock Dashboard
        </button>

        <Link
          to="/"
          className="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Back to website
        </Link>
      </form>
    </div>
  );
}

/* ----------------------------- DASHBOARD -------------------------------- */

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const catalog = useCatalog();
  const { allProducts } = catalog;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft());
  const [confirmDelete, setConfirmDelete] = useState<CatalogProduct | null>(null);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<TabKey>("products");
  const [productFilter, setProductFilter] = useState<ProductFilter>("all");

  const stats = useMemo(() => {
    const visible = allProducts.filter((p) => !p.hidden).length;
    const values = allProducts.map((p) => p.price);
    const total = values.reduce((a, b) => a + b, 0);
    return {
      total: allProducts.length,
      visible,
      hidden: allProducts.length - visible,
      average: allProducts.length ? Math.round(total / allProducts.length) : 0,
    };
  }, [allProducts]);

  const filtered = allProducts
    .map((p, index) => ({ p, index }))
    .filter(({ p }) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
    .filter(({ p }) => productFilter === "all" || (productFilter === "hidden" ? p.hidden : !p.hidden));

  const openAdd = () => {
    setMode("add");
    setEditingSlug(null);
    setDraft(emptyDraft());
    setDialogOpen(true);
  };

  const openEdit = (p: CatalogProduct) => {
    setMode("edit");
    setEditingSlug(p.slug);
    setDraft(draftFromProduct(p));
    setDialogOpen(true);
  };

  const save = (d: ProductDraft) => {
    const base: Omit<CatalogProduct, "slug"> = {
      name: d.name,
      tagline: d.tagline,
      eyebrow: d.eyebrow,
      price: d.price,
      description: d.description,
      image: d.image,
      gallery: d.gallery.length ? d.gallery : [d.image],
      features: d.features,
      specs: d.specs,
      hidden: d.hidden,
      ...(d.video ? { video: d.video } : {}),
    };

    if (mode === "add") {
      const slug = uniqueSlug(
        d.name,
        allProducts.map((p) => p.slug),
      );
      catalog.addProduct({ ...base, slug });
      toast.success(`${d.name} added to the store`);
    } else if (editingSlug) {
      catalog.updateProduct(editingSlug, { ...base, slug: editingSlug });
      toast.success(`${d.name} updated`);
    }
    setDialogOpen(false);
  };

  const doDelete = () => {
    if (!confirmDelete) return;
    catalog.deleteProduct(confirmDelete.slug);
    toast.success(`${confirmDelete.name} deleted`);
    setConfirmDelete(null);
  };

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden pb-24">
      <div className="pointer-events-none fixed inset-0 scene-vignette opacity-60" />

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:flex sm:flex-wrap sm:justify-between sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <img
             src="/images/logo-alpha.webp"
              alt="My Small Things"
              width={200}
              height={60}
              className="h-8 w-auto max-w-full mix-blend-screen sm:h-9"
            />
            <div className="hidden h-8 w-px bg-border sm:block" />
            <div className="hidden sm:block">
              <p className="text-[10px] font-semibold tracking-[0.25em] text-primary uppercase">
                Control panel
              </p>
              <p className="text-sm font-bold text-foreground">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/"
              aria-label="View website"
              title="View website"
              className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary/60 sm:h-auto sm:w-auto sm:gap-1.5 sm:px-4 sm:py-2.5"
            >
              <Home className="size-4" /> <span className="hidden text-xs font-semibold sm:inline">View website</span>
            </Link>
            <Button
              variant="outline"
              size="icon"
              onClick={onLogout}
              aria-label="Log out"
              title="Log out"
              className="size-10 rounded-full border-destructive/40 bg-destructive/10 text-destructive-foreground hover:bg-destructive/20 sm:h-auto sm:w-auto sm:gap-1.5 sm:px-4 sm:py-2.5"
            >
              <LogOut className="size-4" /> <span className="hidden text-xs font-semibold sm:inline">Log out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        {/* TABS */}
        <div className="glass-panel hide-scrollbar mb-6 flex snap-x gap-1 overflow-x-auto rounded-2xl border border-border/60 p-1.5 sm:mb-8 sm:gap-2 sm:rounded-3xl sm:p-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`inline-flex min-h-11 min-w-max flex-1 snap-start items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-bold transition-colors sm:rounded-2xl sm:px-4 sm:text-sm ${
                tab === t.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="size-4" /> {t.label}
            </button>
          ))}
        </div>

        {tab === "preview" && <PreviewPanel />}
        {tab === "website" && <WebsiteSettingsPanel />}
        {tab === "security" && <SecurityPanel />}


        {tab === "products" && (
          <>
        {/* TITLE */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Your <span className="text-gradient">products</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Choose a product below, then tap the clearly labeled button you need. Everything
              saves by itself.
            </p>
          </div>
          <Button
            onClick={openAdd}
            className="h-12 w-full rounded-full px-6 text-sm font-bold sm:w-auto"
          >
            <Plus className="size-4" /> Add product
          </Button>
        </div>

        {/* STATS */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard icon={Boxes} label="Total products" value={String(stats.total)} />
          <StatCard icon={Eye} label="Live on site" value={String(stats.visible)} />
          <StatCard icon={EyeOff} label="Hidden" value={String(stats.hidden)} />
          <StatCard
            icon={Wallet}
            label="Average price"
            value={`PKR ${stats.average.toLocaleString()}`}
          />
        </div>

        {/* SEARCH */}
        <div className="mt-8 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products by name"
              className="w-full rounded-2xl border border-border bg-card/60 py-3 pl-10 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              const label = catalog.undo();
              if (label) toast.success(`Undone: ${label}`);
            }}
            disabled={!catalog.canUndo}
            title={
              catalog.lastChangeLabel
                ? `Undo: ${catalog.lastChangeLabel}`
                : "Nothing to undo right now"
            }
            className="h-11 w-full rounded-xl text-xs text-muted-foreground lg:w-auto"
          >
            <Undo2 className="size-3.5" />
            {catalog.canUndo ? `Undo last change (${catalog.historyCount})` : "Undo last change"}
          </Button>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 rounded-2xl border border-border/60 bg-card/40 p-1.5" aria-label="Filter products">
          {(["all", "live", "hidden"] as const).map((filter) => (
            <Button
              key={filter}
              type="button"
              variant={productFilter === filter ? "default" : "ghost"}
              onClick={() => setProductFilter(filter)}
              className="h-10 rounded-xl px-2 text-xs capitalize"
            >
              {filter} <span className="text-[10px] opacity-70">{filter === "all" ? stats.total : filter === "live" ? stats.visible : stats.hidden}</span>
            </Button>
          ))}
        </div>

        {catalog.lastChangeLabel && (
          <p className="mt-3 text-xs text-muted-foreground">
            Last change: <span className="font-semibold text-foreground">{catalog.lastChangeLabel}</span>{" "}
            — press “Undo last change” to take back only this one step.
          </p>
        )}


        {/* LIST */}
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {filtered.length === 0 && (
            <div className="glass-panel flex flex-col items-center gap-3 rounded-3xl border border-border/60 px-6 py-16 text-center">
              <PackageSearch className="size-8 text-primary" />
              <p className="text-base font-semibold text-foreground">No products here yet</p>
              <p className="text-sm text-muted-foreground">
                Tap “Add product” to put your first item on the website.
              </p>
            </div>
          )}

          {filtered.map(({ p }) => (
            <article
              key={p.slug}
              className="glass-panel overflow-hidden rounded-3xl border border-border/60 transition-colors hover:border-primary/40"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-border/60 bg-muted/30">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="size-full object-contain p-4 sm:p-6" />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <PackageSearch className="size-10" />
                  </div>
                )}
                <span
                  className={`absolute right-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold ${
                    p.hidden
                      ? "bg-muted text-muted-foreground"
                      : "bg-emerald-500/15 text-emerald-300"
                  }`}
                >
                  {p.hidden ? "Hidden" : "Live on website"}
                </span>
              </div>

              <div className="p-5 sm:p-6">
                <h2 className="break-words text-xl font-bold text-foreground sm:text-2xl">{p.name}</h2>
                <p className="mt-1 text-lg font-semibold text-primary">{formatPKR(p.price)}</p>
                {(p.tagline || p.eyebrow) && (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {p.tagline || p.eyebrow}
                  </p>
                )}

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => openEdit(p)}
                    aria-label={`Edit ${p.name}`}
                    className="h-14 rounded-2xl text-base font-bold"
                  >
                    <Pencil className="size-4" /> Edit Product
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setConfirmDelete(p)}
                    aria-label={`Delete ${p.name}`}
                    className="h-14 rounded-2xl text-base font-bold"
                  >
                    <Trash2 className="size-4" /> Delete
                  </Button>
                </div>

              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Changes appear on the website immediately and stay saved in this browser.
        </p>
          </>
        )}
      </main>

      <ProductFormDialog
        open={dialogOpen}
        mode={mode}
        initial={draft}
        onClose={() => setDialogOpen(false)}
        onSave={save}
      />

      {confirmDelete && (
        <ConfirmDialog
          title={`Delete “${confirmDelete.name}”?`}
          body="This removes the product from the website completely. You can add it again later."
          confirmLabel="Yes, delete"
          danger
          onCancel={() => setConfirmDelete(null)}
          onConfirm={doDelete}
        />
      )}

    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="glass-panel rounded-3xl border border-border/60 p-4 sm:p-5">
      <Icon className="size-5 text-primary" />
      <p className="mt-3 text-xl font-bold text-foreground sm:text-2xl">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function ConfirmDialog({
  title,
  body,
  confirmLabel,
  danger,
  onCancel,
  onConfirm,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-sm rounded-3xl border border-border p-6 text-center shadow-2xl">
        <div
          className={`mx-auto flex size-12 items-center justify-center rounded-2xl border ${
            danger ? "border-red-500/40 bg-red-500/10" : "border-primary/40 bg-primary/10"
          }`}
        >
          <Trash2 className={`size-5 ${danger ? "text-red-400" : "text-primary"}`} />
        </div>
        <h3 className="mt-4 text-lg font-bold text-foreground">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{body}</p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-full border border-border py-3 text-sm font-semibold transition-colors hover:border-primary/60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-full py-3 text-sm font-bold transition-all hover:-translate-y-0.5 ${
              danger
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-primary text-primary-foreground hover:glow-ring"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
