import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Bell, BookOpen, Camera, Check, ChevronRight, Gauge, Globe, Info, LogOut, Pencil, Shield, Star, Sun, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Btn } from "@/components/kozir/ui";
import { LANGS, useKozir } from "@/lib/kozir";
import { Switch } from "@/components/ui/switch";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — KOZIR" },
      { name: "description", content: "Your KOZIR stats, rating and settings." },
      { property: "og:title", content: "Profile — KOZIR" },
      { property: "og:description", content: "Your KOZIR stats, rating and settings." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { t, name, setName, lang, setLang, light, setLight } = useKozir();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const [langOpen, setLangOpen] = useState(false);
  const [sound, setSound] = useState(true);
  const [notif, setNotif] = useState(true);
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast">("normal");
  const [hue, setHue] = useState(80);

  return (
    <>
      <PageHeader title={t("profile")} />
      <div className="flex flex-col items-center px-4 pt-2 text-center">
        <button onClick={() => setHue((h) => (h + 70) % 360)} className="relative" aria-label="Change avatar">
          <span className="grid size-24 place-items-center rounded-full text-[36px] font-black shadow-raised ring-4 ring-gold/40" style={{ background: `oklch(0.5 0.12 ${hue})` }}>
            {name[0]}
          </span>
          <span className="absolute right-0 bottom-0 grid size-8 place-items-center rounded-full bg-gold-gradient text-primary-foreground">
            <Camera className="size-4" />
          </span>
        </button>
        {editing ? (
          <div className="mt-3 flex w-full max-w-xs gap-2">
            <input autoFocus value={draft} maxLength={20} onChange={(e) => setDraft(e.target.value)} className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-input/40 px-3 text-body outline-none focus:border-ring" />
            <Btn size="sm" onClick={() => { if (draft.trim()) setName(draft.trim()); setEditing(false); }}>
              {t("done")}
            </Btn>
          </div>
        ) : (
          <button onClick={() => { setDraft(name); setEditing(true); }} className="mt-3 flex items-center gap-2 text-title font-bold" aria-label={t("editName")}>
            {name} <Pencil className="size-4 text-muted-foreground" />
          </button>
        )}
        <div className="mt-1 flex items-center gap-2 text-caption text-muted-foreground">
          <span className="font-mono">#482913</span>
          <span className="flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 font-semibold text-gold">
            <Star className="size-3.5" fill="currentColor" /> 1 642
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 px-4 pt-6">
        {[
          [t("gamesPlayed"), "214"],
          [t("wins"), "121"],
          [t("winRate"), "57%"],
        ].map(([l, v]) => (
          <div key={l} className="rounded-2xl border border-border bg-card p-3 text-center">
            <p className="text-title font-black tabular-nums">{v}</p>
            <p className="text-micro text-muted-foreground">{l}</p>
          </div>
        ))}
      </div>

      <Group title={t("account")}>
        <Row icon={<GoogleG />} label={t("linkGoogle")} onClick={() => toast(t("linkGoogle"))} chevron />
        <Row icon={<LogOut className="size-5 text-destructive" />} label={<span className="text-destructive">{t("signOut")}</span>} onClick={() => toast(t("signOut"))} />
      </Group>

      <Group title={t("preferences")}>
        <Row icon={<Globe className="size-5" />} label={t("language")} value={LANGS.find((l) => l.code === lang)?.native} onClick={() => setLangOpen(true)} chevron />
        <Row icon={<Volume2 className="size-5" />} label={t("sound")} right={<Switch checked={sound} onCheckedChange={setSound} />} />
        <Row icon={<Bell className="size-5" />} label={t("notifications")} right={<Switch checked={notif} onCheckedChange={setNotif} />} />
        <Row icon={<Sun className="size-5" />} label={t("lightTheme")} right={<Switch checked={light} onCheckedChange={setLight} />} />
        <div className="px-4 py-3">
          <div className="mb-2 flex items-center gap-3 text-body">
            <Gauge className="size-5 text-muted-foreground" /> {t("animSpeed")}
          </div>
          <div className="flex gap-1 rounded-xl bg-muted p-1">
            {(["slow", "normal", "fast"] as const).map((s) => (
              <button key={s} onClick={() => setSpeed(s)} className={cn("min-h-10 flex-1 rounded-lg text-caption font-semibold", speed === s ? "bg-card shadow-soft" : "text-muted-foreground")}>
                {t(s)}
              </button>
            ))}
          </div>
        </div>
      </Group>

      <Group title={t("support")}>
        <Row icon={<Shield className="size-5" />} label={t("privacy")} chevron onClick={() => {}} />
        <Row icon={<BookOpen className="size-5" />} label={t("about")} chevron onClick={() => {}} />
        <Row icon={<Info className="size-5" />} label={t("version")} value="1.0.0" />
      </Group>

      <Drawer open={langOpen} onOpenChange={setLangOpen}>
        <DrawerContent className="mx-auto max-w-[430px] border-border bg-popover">
          <DrawerHeader className="text-left">
            <DrawerTitle className="text-title">{t("language")}</DrawerTitle>
          </DrawerHeader>
          <ul className="px-4 pb-6">
            {LANGS.map((l) => (
              <li key={l.code}>
                <button
                  onClick={() => { setLang(l.code); setLangOpen(false); }}
                  className={cn("mb-2 flex min-h-14 w-full items-center gap-3 rounded-2xl border px-4 text-left", lang === l.code ? "border-gold bg-gold/10" : "border-border bg-card")}
                >
                  <span className="flex-1">
                    <span className="block text-body font-semibold">{l.native}</span>
                    <span className="block text-caption text-muted-foreground">{l.sub}</span>
                  </span>
                  {lang === l.code && <Check className="size-5 text-gold" />}
                </button>
              </li>
            ))}
          </ul>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="px-4 pt-6">
      <h2 className="mb-2 px-1 text-caption font-semibold tracking-wide text-muted-foreground uppercase">{title}</h2>
      <div className="divide-y divide-border overflow-hidden rounded-[20px] border border-border bg-card">{children}</div>
    </section>
  );
}

function Row({ icon, label, value, right, chevron, onClick }: { icon: ReactNode; label: ReactNode; value?: string; right?: ReactNode; chevron?: boolean; onClick?: () => void }) {
  const inner = (
    <>
      <span className="shrink-0 text-muted-foreground">{icon}</span>
      <span className="min-w-0 flex-1 text-body">{label}</span>
      {value && <span className="shrink-0 text-caption text-muted-foreground">{value}</span>}
      {right}
      {chevron && <ChevronRight className="size-5 shrink-0 text-muted-foreground" />}
    </>
  );
  const cls = "flex min-h-14 w-full items-center gap-3 px-4 py-2 text-left";
  return onClick ? <button className={cn(cls, "active:bg-accent")} onClick={onClick}>{inner}</button> : <div className={cls}>{inner}</div>;
}

function GoogleG() {
  return <span className="grid size-5 place-items-center rounded-full bg-foreground text-micro font-black text-background">G</span>;
}
