import { useRef, useState } from "react";
import { Download, KeyRound, Upload, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCatalog, type CatalogProduct } from "@/context/CatalogContext";
import { useSiteSettings, type SiteSettings } from "@/context/SiteSettingsContext";

type Backup = { version: 1; exportedAt: string; products: CatalogProduct[]; settings: SiteSettings };
const inputClass = "mt-2 w-full rounded-lg border border-border bg-card/60 px-3.5 py-2.5 text-sm outline-none focus:border-primary";

export function SecurityPanel() {
  const catalog = useCatalog();
  const { settings, checkPassword, setPassword, replaceSettings } = useSiteSettings();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const changePassword = () => {
    if (!checkPassword(current)) {
      toast.error("Current password is incorrect");
      return;
    }
    if (next.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (next !== confirm) {
      toast.error("New passwords do not match");
      return;
    }
    setPassword(next);
    setCurrent(""); setNext(""); setConfirm("");
    toast.success("Dashboard password changed");
  };

  const download = () => {
    const backup: Backup = { version: 1, exportedAt: new Date().toISOString(), products: catalog.allProducts, settings };
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }));
    link.download = `my-small-things-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success("Backup downloaded");
  };

  const restore = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text()) as Partial<Backup>;
      if (parsed.version !== 1 || !Array.isArray(parsed.products) || !parsed.settings) throw new Error("Invalid backup");
      if (!catalog.replaceProducts(parsed.products)) throw new Error("No products");
      replaceSettings(parsed.settings);
      toast.success("Backup restored successfully");
    } catch {
      toast.error("This backup file is not valid");
    }
  };

  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-bold sm:text-4xl">Password & backup</h1><p className="mt-2 text-sm text-muted-foreground">Protect access and keep a safe copy of your website data.</p></div>
      <section className="glass-panel rounded-2xl border border-border/60 p-4 sm:p-6">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary"><KeyRound /></span><div><h2 className="font-bold">Change password</h2><p className="text-xs text-muted-foreground">Use at least 8 characters.</p></div></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <PasswordField label="Current password" value={current} onChange={setCurrent} />
          <PasswordField label="New password" value={next} onChange={setNext} />
          <PasswordField label="Confirm new password" value={confirm} onChange={setConfirm} />
        </div>
        <Button onClick={changePassword} className="mt-5 h-11 w-full rounded-full px-6 sm:w-auto"><ShieldCheck /> Update password</Button>
      </section>
      <section className="glass-panel rounded-2xl border border-border/60 p-4 sm:p-6">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary"><Download /></span><div><h2 className="font-bold">Website backup</h2><p className="text-xs text-muted-foreground">Includes products, prices, website text and your password.</p></div></div>
        <div className="mt-5 grid gap-3 sm:flex sm:flex-wrap">
          <Button onClick={download} className="h-11 rounded-full px-6"><Download /> Download backup</Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()} className="h-11 rounded-full px-6"><Upload /> Restore backup</Button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void restore(file); event.target.value = ""; }} />
        </div>
      </section>
    </div>
  );
}

function PasswordField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="text-xs font-semibold text-muted-foreground">{label}<input type="password" value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} /></label>;
}