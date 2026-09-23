import { useEffect, useRef, useState } from "react";
import { ExternalLink, Monitor, Smartphone, Laptop, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEVICES = [
  { key: "mobile", label: "Mobile", icon: Smartphone, width: 390, height: 760 },
  { key: "laptop", label: "Laptop", icon: Laptop, width: 1024, height: 700 },
  { key: "desktop", label: "Desktop", icon: Monitor, width: 1440, height: 760 },
] as const;

type DeviceKey = (typeof DEVICES)[number]["key"];

export function PreviewPanel() {
  const [device, setDevice] = useState<DeviceKey>("mobile");
  const [refreshKey, setRefreshKey] = useState(0);
  const [available, setAvailable] = useState(900);
  const host = useRef<HTMLDivElement | null>(null);
  const selected = DEVICES.find((item) => item.key === device) ?? DEVICES[0];
  const scale = Math.min(1, Math.max(0.2, (available - 24) / selected.width));

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setAvailable(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0"><h1 className="text-2xl font-bold sm:text-4xl">Live preview</h1><p className="mt-2 text-sm text-muted-foreground">Check the live website at each screen size.</p></div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="icon" title="Refresh preview" onClick={() => setRefreshKey((value) => value + 1)}><RotateCw /></Button>
          <Button asChild variant="outline" size="icon" className="sm:hidden"><a href="/" target="_blank" rel="noreferrer" aria-label="Open website"><ExternalLink /></a></Button>
          <Button asChild variant="outline" className="hidden sm:inline-flex"><a href="/" target="_blank" rel="noreferrer"><ExternalLink /> Open website</a></Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-1.5 rounded-xl border border-border bg-card/50 p-1.5 sm:gap-2 sm:p-2">
        {DEVICES.map(({ key, label, icon: Icon }) => <Button key={key} variant={device === key ? "default" : "ghost"} onClick={() => setDevice(key)} className="h-11 min-w-0 gap-1 px-1 text-[11px] sm:gap-2 sm:px-4 sm:text-sm"><Icon /> <span>{label}</span></Button>)}
      </div>

      <div ref={host} className="mt-6 overflow-hidden rounded-xl border border-border bg-muted/30 p-2 sm:rounded-2xl sm:p-6">
        <div className="mx-auto overflow-hidden rounded-xl border border-border bg-background shadow-2xl" style={{ width: selected.width * scale, height: selected.height * scale }}>
          <iframe key={`${device}-${refreshKey}`} src="/?adminPreview=1" title={`${selected.label} website preview`} style={{ width: selected.width, height: selected.height, transform: `scale(${scale})`, transformOrigin: "top left" }} className="border-0 bg-background" />
        </div>
      </div>
    </div>
  );
}