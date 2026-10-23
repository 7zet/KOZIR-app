import { Link, useLocation } from "@tanstack/react-router";
import { cva, type VariantProps } from "class-variance-authority";
import { House, ShoppingBag, UserRound, Coins } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useKozir } from "@/lib/kozir";

export const btn = cva(
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-body font-semibold disabled:opacity-45 disabled:pointer-events-none text-center leading-tight",
  {
    variants: {
      variant: {
        gold: "bg-gold-gradient text-primary-foreground shadow-gold",
        secondary: "bg-secondary text-secondary-foreground border border-border",
        ghost: "text-foreground hover:bg-accent",
        danger: "bg-destructive/15 text-destructive",
      },
      size: { md: "", sm: "min-h-10 px-4 text-caption rounded-xl", lg: "min-h-14 text-section" },
      full: { true: "w-full" },
    },
    defaultVariants: { variant: "gold", size: "md" },
  },
);

export function Btn({
  variant,
  size,
  full,
  className,
  ...p
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof btn>) {
  return <button className={cn(btn({ variant, size, full }), className)} {...p} />;
}

export function CoinIcon({ className }: { className?: string }) {
  return (
    <span className={cn("grid size-5 place-items-center rounded-full bg-gold-gradient text-primary-foreground", className)}>
      <Coins className="size-3" strokeWidth={2.5} />
    </span>
  );
}

export function CoinPill() {
  const { coins } = useKozir();
  return (
    <Link to="/shop" className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-caption font-semibold tabular-nums shadow-soft">
      <CoinIcon />
      {coins.toLocaleString()}
    </Link>
  );
}

export function Wordmark() {
  return (
    <span className="text-title font-black tracking-[0.18em] text-gold">
      KOZIR
    </span>
  );
}

export function PageHeader({ title, right }: { title?: ReactNode; right?: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 bg-background/90 px-4 backdrop-blur">
      <div className="min-w-0 truncate text-title font-bold">{title ?? <Wordmark />}</div>
      {right ?? <CoinPill />}
    </header>
  );
}

export function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="px-4 pt-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-section font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-muted", className)} />;
}

const tabs = [
  { to: "/", icon: House, key: "play" },
  { to: "/shop", icon: ShoppingBag, key: "shop" },
  { to: "/profile", icon: UserRound, key: "profile" },
] as const;

export function BottomNav() {
  const { t } = useKozir();
  const { pathname } = useLocation();
  const activeFor = (to: string) =>
    to === "/" ? pathname === "/" || pathname.startsWith("/room") : pathname.startsWith(to) || (to === "/shop" && pathname.startsWith("/subscription"));
  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[430px] border-t border-border bg-nav backdrop-blur">
      <ul className="grid h-[68px] grid-cols-3">
        {tabs.map(({ to, icon: Icon, key }) => {
          const active = activeFor(to);
          return (
            <li key={to}>
              <Link
                to={to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-micro font-semibold transition-colors duration-200",
                  active ? "text-gold" : "text-muted-foreground",
                )}
              >
                <span className={cn("grid h-8 w-14 place-items-center rounded-full transition-colors duration-200", active && "bg-gold/15")}>
                  <Icon className="size-6" strokeWidth={active ? 2.4 : 1.8} fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.25 : 0} />
                </span>
                <span className={cn("max-w-full truncate px-1", !active && "sr-only")}>{t(key)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Avatar({ name, hue, className }: { name: string; hue: number; className?: string }) {
  return (
    <span
      className={cn("grid size-9 place-items-center rounded-full border-2 border-card text-caption font-bold text-foreground", className)}
      style={{ background: `oklch(0.5 0.1 ${hue})` }}
    >
      {name[0]}
    </span>
  );
}
