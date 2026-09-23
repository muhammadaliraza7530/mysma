import { useEffect, useState } from "react";
import { Save, Megaphone, Type, PanelBottom } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSiteSettings, type SiteSettings } from "@/context/SiteSettingsContext";

const inputClass = "mt-2 w-full rounded-lg border border-border bg-card/60 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary";

export function WebsiteSettingsPanel() {
  const { settings, replaceSettings } = useSiteSettings();
  const [draft, setDraft] = useState(settings);

  useEffect(() => setDraft(settings), [settings]);

  const hero = (patch: Partial<SiteSettings["hero"]>) => setDraft((value) => ({ ...value, hero: { ...value.hero, ...patch } }));
  const announcement = (patch: Partial<SiteSettings["announcement"]>) => setDraft((value) => ({ ...value, announcement: { ...value.announcement, ...patch } }));
  const cta = (patch: Partial<SiteSettings["cta"]>) => setDraft((value) => ({ ...value, cta: { ...value.cta, ...patch } }));
  const footer = (patch: Partial<SiteSettings["footer"]>) => setDraft((value) => ({ ...value, footer: { ...value.footer, ...patch } }));

  const save = () => {
    replaceSettings(draft);
    toast.success("Website content saved");
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground sm:text-4xl">Website content</h1>
          <p className="mt-2 text-sm text-muted-foreground">Update the most important wording shown across your website.</p>
        </div>
        <Button onClick={save} className="h-11 w-full rounded-full px-6 font-bold sm:w-auto"><Save /> Save changes</Button>
      </div>

      <SettingsSection icon={Megaphone} title="Offer bar">
        <label className="flex items-center gap-3 text-sm font-semibold text-foreground">
          <input type="checkbox" checked={draft.announcement.enabled} onChange={(event) => announcement({ enabled: event.target.checked })} className="size-4 accent-primary" />
          Show offer bar above the menu
        </label>
        <Field label="Offer message" value={draft.announcement.text} onChange={(text) => announcement({ text })} />
      </SettingsSection>

      <SettingsSection icon={Type} title="Home page">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Brand first line" value={draft.hero.titleTop} onChange={(titleTop) => hero({ titleTop })} />
          <Field label="Brand second line" value={draft.hero.titleBottom} onChange={(titleBottom) => hero({ titleBottom })} />
        </div>
        <Field label="Short message" value={draft.hero.subtitle} onChange={(subtitle) => hero({ subtitle })} multiline />
        <Field label="Main button" value={draft.hero.primaryCta} onChange={(primaryCta) => hero({ primaryCta })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Bottom title" value={draft.cta.title} onChange={(title) => cta({ title })} />
          <Field label="Highlighted words" value={draft.cta.highlight} onChange={(highlight) => cta({ highlight })} />
        </div>
        <Field label="Bottom message" value={draft.cta.subtitle} onChange={(subtitle) => cta({ subtitle })} multiline />
        <Field label="Bottom button" value={draft.cta.button} onChange={(button) => cta({ button })} />
        <Field label="Moving offer messages (one per line)" value={draft.marquee.join("\n")} onChange={(value) => setDraft((current) => ({ ...current, marquee: value.split("\n").map((item) => item.trim()).filter(Boolean) }))} multiline />
      </SettingsSection>

      <SettingsSection icon={PanelBottom} title="Footer">
        <Field label="About text" value={draft.footer.about} onChange={(about) => footer({ about })} multiline />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" value={draft.footer.email} onChange={(email) => footer({ email })} />
          <Field label="Phone" value={draft.footer.phone} onChange={(phone) => footer({ phone })} />
          <Field label="Support line 1" value={draft.footer.line1} onChange={(line1) => footer({ line1 })} />
          <Field label="Support line 2" value={draft.footer.line2} onChange={(line2) => footer({ line2 })} />
        </div>
      </SettingsSection>

      <div className="flex justify-end"><Button onClick={save} className="h-11 rounded-full px-6 font-bold"><Save /> Save changes</Button></div>
    </div>
  );
}

function SettingsSection({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return <section className="glass-panel rounded-2xl border border-border/60 p-4 sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5" /></span><h2 className="min-w-0 text-lg font-bold">{title}</h2></div><div className="space-y-4">{children}</div></section>;
}

function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  return <label className="block text-xs font-semibold text-muted-foreground">{label}{multiline ? <textarea rows={3} value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} /> : <input value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} />}</label>;
}