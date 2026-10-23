import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Copy, Lock, Plus, Share2, Users, Zap, WifiOff } from "lucide-react";
import { toast } from "sonner";
import burkozel from "@/assets/burkozel.jpg";
import durak from "@/assets/durak.jpg";
import nard from "@/assets/nard.jpg";
import { Avatar, Btn, PageHeader, Section, Skeleton } from "@/components/kozir/ui";
import { useKozir } from "@/lib/kozir";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Play — KOZIR" },
      { name: "description", content: "Pick a game, start a quick match, create a room or join friends with a code." },
      { property: "og:title", content: "Play — KOZIR" },
      { property: "og:description", content: "Pick a game, start a quick match, create a room or join friends with a code." },
    ],
  }),
  component: Play,
});

const GAMES = [
  { id: "burkozel", name: "Burkozel", players: "2–3", img: burkozel, available: true },
  { id: "durak", name: "Durak", players: "2–6", img: durak, available: false },
  { id: "nard", name: "Nard", players: "2", img: nard, available: false },
];

const ROOMS = [
  { code: "K7Q2XM", host: "Dilshod", game: "Burkozel", filled: 2, total: 3, hues: [30, 150] },
  { code: "P3LZ9A", host: "Malika", game: "Burkozel", filled: 1, total: 2, hues: [320] },
  { code: "TR8W1C", host: "Sardor", game: "Burkozel", filled: 2, total: 3, hues: [210, 90] },
];

type Status = "loading" | "ok" | "empty" | "error";

function Play() {
  const { t } = useKozir();
  const nav = useNavigate();
  const [status, setStatus] = useState<Status>("loading");
  const [code, setCode] = useState("");
  const [codeErr, setCodeErr] = useState(false);
  const [create, setCreate] = useState(false);
  const [searching, setSearching] = useState(false);

  const load = (s: Status = "ok") => {
    setStatus("loading");
    setTimeout(() => setStatus(s), 700);
  };
  useEffect(() => load(), []);

  const joinByCode = () => {
    if (code.length !== 6) return setCodeErr(true);
    nav({ to: "/room/$code", params: { code } });
  };

  const quick = () => {
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      nav({ to: "/room/$code", params: { code: "QM4821" } });
    }, 1400);
  };

  return (
    <>
      <PageHeader />

      <Section title={t("games")}>
        <div className="space-y-3">
          {GAMES.map((g, i) => (
            <article
              key={g.id}
              aria-disabled={!g.available}
              className={cn("overflow-hidden rounded-[20px] border border-border bg-card shadow-raised", !g.available && "opacity-60")}
            >
              <div className="relative aspect-[16/7]">
                <img src={g.img} alt="" width={992} height={672} loading={i === 0 ? "eager" : "lazy"} className={cn("size-full object-cover", !g.available && "grayscale")} />
                {!g.available && (
                  <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-micro font-semibold">
                    <Lock className="size-3.5" /> {t("comingSoon")}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <h3 className="truncate text-section font-bold">{g.name}</h3>
                  <p className="flex items-center gap-1 text-caption text-muted-foreground">
                    <Users className="size-4" /> {g.players} {t("players")}
                  </p>
                </div>
                <Btn size="sm" disabled={!g.available} onClick={quick} className="shrink-0">
                  {g.available ? t("play") : t("comingSoon")}
                </Btn>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section title={t("playNow")}>
        <div className="space-y-3 rounded-[20px] border border-border bg-card p-4 shadow-soft">
          <Btn full size="lg" onClick={quick} disabled={searching}>
            <Zap className="size-5" /> {searching ? t("searching") : t("quickMatch")}
          </Btn>
          <Btn full variant="secondary" onClick={() => setCreate(true)}>
            <Plus className="size-5" /> {t("createRoom")}
          </Btn>
          <div>
            <label htmlFor="code" className="mb-1.5 block text-caption font-medium text-muted-foreground">
              {t("joinCode")}
            </label>
            <div className="flex gap-2">
              <input
                id="code"
                value={code}
                maxLength={6}
                onChange={(e) => {
                  setCodeErr(false);
                  setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""));
                }}
                placeholder="A1B2C3"
                className={cn(
                  "h-12 min-w-0 flex-1 rounded-xl border bg-input/40 px-4 text-center font-mono text-section tracking-[0.35em] uppercase outline-none focus:border-ring",
                  codeErr ? "border-destructive" : "border-input",
                )}
              />
              <Btn variant="secondary" onClick={joinByCode} disabled={!code}>
                {t("join")}
              </Btn>
            </div>
            {codeErr && <p className="mt-1.5 text-caption text-destructive">{t("invalidCode")}</p>}
          </div>
        </div>
      </Section>

      <Section
        title={t("rooms")}
        action={
          <div className="flex gap-1 text-micro text-muted-foreground">
            {(["ok", "empty", "error"] as const).map((s) => (
              <button key={s} onClick={() => load(s)} className="rounded-full px-2 py-1 hover:bg-accent">
                {s}
              </button>
            ))}
          </div>
        }
      >
        {status === "loading" && (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-[72px]" />
            ))}
          </div>
        )}
        {status === "ok" && (
          <ul className="space-y-2">
            {ROOMS.map((r) => (
              <li key={r.code} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                <div className="flex -space-x-3">
                  {r.hues.map((h, i) => (
                    <Avatar key={i} name={i === 0 ? r.host : "F"} hue={h} />
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body font-semibold">{r.host}</p>
                  <p className="truncate text-caption text-muted-foreground">
                    {r.game} · {r.filled}/{r.total}
                  </p>
                </div>
                <Link to="/room/$code" params={{ code: r.code }} className="shrink-0 rounded-xl bg-secondary px-4 py-2.5 text-caption font-semibold">
                  {t("join")}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {status === "empty" && (
          <div className="rounded-[20px] border border-dashed border-border p-6 text-center">
            <div className="mx-auto mb-3 flex w-fit -space-x-4">
              {["♠", "♥", "♣"].map((s, i) => (
                <span key={s} className={cn("grid h-14 w-10 place-items-center rounded-lg border border-border bg-card text-section shadow-soft", i === 1 ? "-translate-y-1 text-destructive" : "rotate-[-8deg]", i === 2 && "rotate-[8deg]")}>
                  {s}
                </span>
              ))}
            </div>
            <p className="text-body font-semibold">{t("noRooms")}</p>
            <p className="mt-1 text-caption text-muted-foreground">{t("noRoomsHint")}</p>
            <Btn className="mt-4" onClick={() => setCreate(true)}>
              <Share2 className="size-4" /> {t("invite")}
            </Btn>
          </div>
        )}
        {status === "error" && (
          <div className="rounded-[20px] border border-destructive/40 bg-destructive/10 p-5 text-center">
            <WifiOff className="mx-auto mb-2 size-6 text-destructive" />
            <p className="text-body font-semibold">{t("loadError")}</p>
            <Btn variant="secondary" size="sm" className="mt-3" onClick={() => load()}>
              {t("retry")}
            </Btn>
          </div>
        )}
      </Section>

      <CreateRoomSheet open={create} onOpenChange={setCreate} />
    </>
  );
}

function Seg<T extends string | number>({ value, options, onChange }: { value: T; options: { v: T; label: string; disabled?: boolean }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-1 rounded-xl bg-muted p-1">
      {options.map((o) => (
        <button
          key={String(o.v)}
          disabled={o.disabled}
          onClick={() => onChange(o.v)}
          className={cn("min-h-10 flex-1 rounded-lg px-2 text-caption font-semibold leading-tight disabled:opacity-40", value === o.v ? "bg-card text-foreground shadow-soft" : "text-muted-foreground")}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function CreateRoomSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (b: boolean) => void }) {
  const { t } = useKozir();
  const nav = useNavigate();
  const [game, setGame] = useState("burkozel");
  const [seats, setSeats] = useState(3);
  const [priv, setPriv] = useState<"private" | "public">("private");
  const code = "B8KZ4R";

  const share = async () => {
    const text = `Join my KOZIR room: ${code}`;
    if (navigator.share) await navigator.share({ text }).catch(() => {});
    else {
      await navigator.clipboard?.writeText(code);
      toast.success(t("copied"));
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="mx-auto max-w-[430px] border-border bg-popover">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-title">{t("createRoom")}</DrawerTitle>
        </DrawerHeader>
        <div className="space-y-5 px-4 pb-6">
          <Field label={t("game")}>
            <Seg value={game} onChange={setGame} options={GAMES.map((g) => ({ v: g.id, label: g.name, disabled: !g.available }))} />
          </Field>
          <Field label={t("seats")}>
            <Seg value={seats} onChange={setSeats} options={[{ v: 2, label: "2" }, { v: 3, label: "3" }]} />
          </Field>
          <Field label={t("privacy")}>
            <Seg value={priv} onChange={setPriv} options={[{ v: "private", label: t("private") }, { v: "public", label: t("public") }]} />
          </Field>
          <Field label={t("roomCode")}>
            <div className="flex items-center gap-2 rounded-2xl bg-felt-gradient p-3">
              <span className="flex-1 text-center font-mono text-title font-bold tracking-[0.3em] text-gold">{code}</span>
              <button aria-label="Copy" onClick={() => { navigator.clipboard?.writeText(code); toast.success(t("copied")); }} className="grid size-11 place-items-center rounded-xl bg-background/30">
                <Copy className="size-5" />
              </button>
              <button aria-label={t("share")} onClick={share} className="grid size-11 place-items-center rounded-xl bg-background/30">
                <Share2 className="size-5" />
              </button>
            </div>
          </Field>
          <Btn full size="lg" onClick={() => { onOpenChange(false); nav({ to: "/room/$code", params: { code } }); }}>
            {t("create")}
          </Btn>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-caption font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
