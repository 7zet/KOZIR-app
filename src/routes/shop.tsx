import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, ChevronRight, Crown, Lock, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { Btn, CoinIcon, PageHeader, Skeleton } from "@/components/kozir/ui";
import { useKozir, tryPurchase } from "@/lib/kozir";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — KOZIR" },
      { name: "description", content: "Get coins, card skins and table skins for KOZIR." },
      { property: "og:title", content: "Shop — KOZIR" },
      { property: "og:description", content: "Get coins, card skins and table skins for KOZIR." },
    ],
  }),
  component: Shop,
});

type Tab = "coins" | "cardSkins" | "tableSkins";
type SkinState = "equipped" | "owned" | "buy" | "locked";
type Skin = { id: string; name: string; price: number; state: SkinState; bg: string; h: string; lock?: number };

const CARD_SKINS: Skin[] = [
  { id: "c1", name: "Classic", price: 0, state: "equipped", bg: "linear-gradient(135deg,oklch(0.45 0.15 25),oklch(0.3 0.12 25))", h: "aspect-[3/4]" },
  { id: "c2", name: "Samarkand", price: 400, state: "buy", bg: "repeating-linear-gradient(45deg,oklch(0.45 0.12 240) 0 8px,oklch(0.35 0.1 240) 8px 16px)", h: "aspect-[3/5]" },
  { id: "c3", name: "Gold Leaf", price: 900, state: "buy", bg: "linear-gradient(135deg,oklch(0.85 0.13 88),oklch(0.6 0.13 65))", h: "aspect-[3/4]" },
  { id: "c4", name: "Emerald", price: 0, state: "owned", bg: "radial-gradient(circle,oklch(0.6 0.15 155),oklch(0.3 0.08 160))", h: "aspect-[3/5]" },
  { id: "c5", name: "Midnight", price: 1500, state: "locked", lock: 1800, bg: "linear-gradient(160deg,oklch(0.25 0.05 270),oklch(0.12 0.02 270))", h: "aspect-[3/4]" },
  { id: "c6", name: "Ikat", price: 650, state: "buy", bg: "repeating-linear-gradient(90deg,oklch(0.6 0.16 20) 0 10px,oklch(0.8 0.12 85) 10px 14px,oklch(0.4 0.1 300) 14px 24px)", h: "aspect-[3/5]" },
];
const TABLE_SKINS: Skin[] = [
  { id: "t1", name: "Green felt", price: 0, state: "equipped", bg: "var(--gradient-felt)", h: "aspect-square" },
  { id: "t2", name: "Cork", price: 600, state: "buy", bg: "radial-gradient(circle,oklch(0.55 0.08 60),oklch(0.35 0.06 50))", h: "aspect-[4/5]" },
  { id: "t3", name: "Walnut", price: 0, state: "owned", bg: "repeating-linear-gradient(100deg,oklch(0.35 0.06 50) 0 6px,oklch(0.3 0.05 45) 6px 11px)", h: "aspect-[4/5]" },
  { id: "t4", name: "Royal blue", price: 1100, state: "buy", bg: "radial-gradient(circle,oklch(0.45 0.14 255),oklch(0.22 0.08 260))", h: "aspect-square" },
  { id: "t5", name: "Marble", price: 2000, state: "locked", lock: 2000, bg: "linear-gradient(120deg,oklch(0.9 0.01 90),oklch(0.75 0.01 90) 40%,oklch(0.92 0.01 90))", h: "aspect-square" },
];

const PACKS = [
  { coins: 100, price: "$0.99" },
  { coins: 500, price: "$3.99" },
  { coins: 1000, price: "$6.99", best: true },
];

function Shop() {
  const { t, coins, setCoins } = useKozir();
  const [tab, setTab] = useState<Tab>("coins");
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState(CARD_SKINS);
  const [tables, setTables] = useState(TABLE_SKINS);
  const [preview, setPreview] = useState<Skin | null>(null);
  const [adBusy, setAdBusy] = useState(false);
  const [buying, setBuying] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    const id = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(id);
  }, [tab]);

  const list = tab === "cardSkins" ? cards : tables;
  const setList = tab === "cardSkins" ? setCards : setTables;

  const act = (s: Skin) => {
    if (s.state === "buy") {
      const next = tryPurchase(coins, s.price);
      if (next === null) { toast.error(t("notEnough")); return; }
      setCoins(() => next);
      setList((l) => l.map((x) => (x.id === s.id ? { ...x, state: "owned" } : x)));
      setPreview({ ...s, state: "owned" });
      toast.success(t("purchased"));
    } else if (s.state === "owned") {
      setList((l) => l.map((x) => ({ ...x, state: x.id === s.id ? "equipped" : x.state === "equipped" ? "owned" : x.state })));
      setPreview(null);
      toast.success(t("applied"));
    }
  };

  return (
    <>
      <PageHeader title={t("shop")} />
      <div className="space-y-3 px-4 pt-2">
        <div className="rounded-[20px] bg-felt-gradient p-5 shadow-raised">
          <p className="text-caption text-foreground/75">{t("balance")}</p>
          <p className="flex items-center gap-2 text-[32px] font-black tabular-nums">
            <CoinIcon className="size-8" /> {coins.toLocaleString()}
          </p>
          <Btn
            full
            className="mt-4"
            disabled={adBusy}
            onClick={() => {
              setAdBusy(true);
              setTimeout(() => {
                setCoins((c) => c + 25);
                setAdBusy(false);
                toast.success("+25");
              }, 1200);
            }}
          >
            <PlayCircle className="size-5" /> {adBusy ? "…" : `${t("freeCoins")} · +25`}
          </Btn>
        </div>
        <Link to="/subscription" className="flex items-center gap-3 rounded-[20px] border border-gold/40 bg-gold/10 p-4">
          <Crown className="size-7 shrink-0 text-gold" />
          <div className="min-w-0 flex-1">
            <p className="text-body font-semibold">{t("subscribe")}</p>
            <p className="text-caption text-muted-foreground">{t("subscribeHint")}</p>
          </div>
          <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
        </Link>
      </div>

      <div className="sticky top-14 z-10 bg-background/90 px-4 py-3 backdrop-blur">
        <div className="flex gap-1 rounded-xl bg-muted p-1" role="tablist">
          {(["coins", "cardSkins", "tableSkins"] as Tab[]).map((k) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cn("min-h-10 flex-1 rounded-lg px-1 text-caption font-semibold leading-tight", tab === k ? "bg-card shadow-soft" : "text-muted-foreground")}>
              {t(k)}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4">
        {tab === "coins" ? (
          <div className="grid grid-cols-3 gap-2">
            {PACKS.map((p, i) =>
              loading ? (
                <Skeleton key={i} className="h-40" />
              ) : (
                <button
                  key={p.coins}
                  disabled={buying !== null}
                  onClick={() => {
                    setBuying(i);
                    setTimeout(() => {
                      setBuying(null);
                      setCoins((c) => c + p.coins);
                      toast.success(`${t("purchased")} +${p.coins}`);
                    }, 900);
                  }}
                  className={cn("relative flex flex-col items-center gap-2 rounded-2xl border bg-card p-3 pt-5", p.best ? "border-gold shadow-gold" : "border-border")}
                >
                  {p.best && <span className="absolute -top-2.5 rounded-full bg-gold-gradient px-2 py-0.5 text-micro font-bold text-primary-foreground">{t("bestValue")}</span>}
                  <CoinIcon className="size-10" />
                  <span className="text-section font-bold tabular-nums">{p.coins}</span>
                  <span className="w-full rounded-lg bg-secondary py-1.5 text-caption font-semibold">{buying === i ? "…" : p.price}</span>
                </button>
              ),
            )}
          </div>
        ) : (
          <div className="columns-2 gap-3">
            {loading
              ? [0, 1, 2, 3].map((i) => <Skeleton key={i} className={cn("mb-3 break-inside-avoid", i % 2 ? "h-56" : "h-44")} />)
              : list.map((s) => <SkinTile key={s.id} s={s} onOpen={() => setPreview(s)} />)}
          </div>
        )}
      </div>

      <Drawer open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DrawerContent className="mx-auto max-w-[430px] border-border bg-popover">
          {preview && (
            <>
              <DrawerHeader className="text-left">
                <DrawerTitle className="text-title">{preview.name}</DrawerTitle>
              </DrawerHeader>
              <div className="px-4 pb-6">
                <div className="mx-auto aspect-[4/3] w-full rounded-[20px] shadow-raised" style={{ background: preview.bg }} />
                <div className="mt-5">
                  {preview.state === "locked" ? (
                    <Btn full size="lg" disabled>
                      <Lock className="size-5" /> {t("unlockAt")} {preview.lock}
                    </Btn>
                  ) : preview.state === "equipped" ? (
                    <Btn full size="lg" variant="secondary" disabled>
                      <Check className="size-5" /> {t("equipped")}
                    </Btn>
                  ) : preview.state === "owned" ? (
                    <Btn full size="lg" onClick={() => act(preview)}>{t("apply")}</Btn>
                  ) : (
                    <Btn full size="lg" onClick={() => act(preview)}>
                      {t("buy")} · <CoinIcon /> {preview.price}
                    </Btn>
                  )}
                </div>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}

function SkinTile({ s, onOpen }: { s: Skin; onOpen: () => void }) {
  const { t } = useKozir();
  return (
    <button onClick={onOpen} className="mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-border bg-card text-left">
      <div className={cn("relative w-full", s.h, s.state === "locked" && "opacity-50")} style={{ background: s.bg }}>
        {s.state === "locked" && <Lock className="absolute inset-0 m-auto size-7 text-foreground" />}
      </div>
      <div className="flex items-center justify-between gap-2 p-3">
        <span className="min-w-0 truncate text-caption font-semibold">{s.name}</span>
        <StateTag s={s} label={t(s.state === "buy" ? "buy" : s.state)} />
      </div>
    </button>
  );
}

function StateTag({ s, label }: { s: Skin; label: string }) {
  if (s.state === "buy")
    return (
      <span className="flex shrink-0 items-center gap-1 text-caption font-bold text-gold">
        <CoinIcon className="size-4" /> {s.price}
      </span>
    );
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-micro font-semibold",
        s.state === "equipped" && "bg-success/20 text-success",
        s.state === "owned" && "bg-secondary text-muted-foreground",
        s.state === "locked" && "bg-muted text-muted-foreground",
      )}
    >
      {label}
    </span>
  );
}
