import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Crown } from "lucide-react";
import { toast } from "sonner";
import { Btn, PageHeader } from "@/components/kozir/ui";
import { useKozir } from "@/lib/kozir";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/subscription")({
  head: () => ({
    meta: [
      { title: "KOZIR Plus subscription" },
      { name: "description", content: "Daily coins, no ads and exclusive card skins with KOZIR Plus." },
      { property: "og:title", content: "KOZIR Plus subscription" },
      { property: "og:description", content: "Daily coins, no ads and exclusive card skins with KOZIR Plus." },
    ],
  }),
  component: Sub,
});

function Sub() {
  const { t } = useKozir();
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");
  const [busy, setBusy] = useState(false);
  const plans = [
    { id: "monthly" as const, price: "$2.99", per: "/mo" },
    { id: "yearly" as const, price: "$21.99", per: "/yr", save: true },
  ];
  return (
    <>
      <PageHeader
        title={
          <Link to="/shop" className="flex items-center gap-2">
            <ArrowLeft className="size-6" /> {t("subscription")}
          </Link>
        }
      />
      <div className="px-4 pt-2">
        <div className="rounded-[20px] bg-felt-gradient p-6 text-center shadow-raised">
          <Crown className="mx-auto size-12 text-gold" fill="currentColor" fillOpacity={0.3} />
          <p className="mt-2 text-title font-black tracking-[0.12em] text-gold">KOZIR PLUS</p>
        </div>
        <ul className="mt-5 space-y-3">
          {(["b1", "b2", "b3", "b4"] as const).map((b) => (
            <li key={b} className="flex items-start gap-3 text-body">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-success/20 text-success">
                <Check className="size-4" strokeWidth={3} />
              </span>
              {t(b)}
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-3">
          {plans.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlan(p.id)}
              aria-pressed={plan === p.id}
              className={cn("relative flex w-full items-center gap-3 rounded-[20px] border-2 bg-card p-4 text-left", plan === p.id ? "border-gold shadow-gold" : "border-border")}
            >
              <span className={cn("grid size-6 shrink-0 place-items-center rounded-full border-2", plan === p.id ? "border-gold bg-gold" : "border-muted-foreground")}>
                {plan === p.id && <Check className="size-3.5 text-primary-foreground" strokeWidth={3} />}
              </span>
              <span className="min-w-0 flex-1 text-section font-semibold">{t(p.id)}</span>
              <span className="text-body font-bold tabular-nums">
                {p.price}
                <span className="text-caption font-normal text-muted-foreground">{p.per}</span>
              </span>
              {p.save && <span className="absolute -top-2.5 right-4 rounded-full bg-gold-gradient px-2 py-0.5 text-micro font-bold text-primary-foreground">{t("save")}</span>}
            </button>
          ))}
        </div>
        <Btn
          full
          size="lg"
          className="mt-5"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            setTimeout(() => {
              setBusy(false);
              toast.success(t("purchased"));
            }, 1000);
          }}
        >
          {busy ? "…" : t("continue")}
        </Btn>
        <button onClick={() => toast(t("restore"))} className="mt-3 w-full py-3 text-center text-caption font-semibold text-muted-foreground underline">
          {t("restore")}
        </button>
      </div>
    </>
  );
}
