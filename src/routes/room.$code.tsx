import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Crown, Share2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Avatar, Btn, PageHeader } from "@/components/kozir/ui";
import { useKozir } from "@/lib/kozir";

export const Route = createFileRoute("/room/$code")({
  head: ({ params }) => ({
    meta: [
      { title: `Room ${params.code} — KOZIR` },
      { name: "description", content: "Waiting room for a KOZIR card game with friends." },
      { property: "og:title", content: `Room ${params.code} — KOZIR` },
      { property: "og:description", content: "Join this KOZIR table and play Burkozel with friends." },
    ],
  }),
  component: Room,
});

function Room() {
  const { code } = Route.useParams();
  const { t, name } = useKozir();
  const seats = [
    { name, hue: 80, host: true },
    { name: "Dilshod", hue: 30, host: false },
    null,
  ];
  return (
    <>
      <PageHeader
        title={
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="size-6" /> Burkozel
          </Link>
        }
      />
      <div className="px-4 pt-2">
        <div className="relative overflow-hidden rounded-[28px] bg-felt-gradient p-6 shadow-raised">
          <p className="text-center text-caption text-foreground/75">{t("roomCode")}</p>
          <p className="text-center font-mono text-[32px] font-bold tracking-[0.3em] text-gold">{code}</p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {seats.map((s, i) =>
              s ? (
                <div key={i} className="flex flex-col items-center gap-2 text-center">
                  <div className="relative">
                    <Avatar name={s.name} hue={s.hue} className="size-16 text-section" />
                    {s.host && <Crown className="absolute -top-2 -right-1 size-5 text-gold" fill="currentColor" />}
                  </div>
                  <span className="w-full truncate text-caption font-semibold">{s.name}</span>
                  {s.host && <span className="text-micro text-gold">{t("host")}</span>}
                </div>
              ) : (
                <button key={i} className="flex flex-col items-center gap-2 text-center" onClick={() => toast(t("invite"))}>
                  <span className="grid size-16 place-items-center rounded-full border-2 border-dashed border-foreground/30">
                    <UserPlus className="size-6 text-foreground/60" />
                  </span>
                  <span className="w-full truncate text-caption text-foreground/70">{t("emptySeat")}</span>
                </button>
              ),
            )}
          </div>
          <p className="mt-6 animate-pulse text-center text-caption text-foreground/75">{t("waiting")}</p>
        </div>
        <div className="mt-4 space-y-3">
          <Btn full size="lg" disabled>
            {t("start")} · 2/3
          </Btn>
          <Btn full variant="secondary" onClick={() => { navigator.clipboard?.writeText(code); toast.success(t("copied")); }}>
            <Share2 className="size-5" /> {t("share")}
          </Btn>
          <Link to="/" className="block py-3 text-center text-body font-semibold text-destructive">
            {t("leave")}
          </Link>
        </div>
      </div>
    </>
  );
}
