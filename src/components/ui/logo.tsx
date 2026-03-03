import * as React from "react";
import { ShoppingBag, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type LogoProps = React.ComponentProps<"div"> & {
  compact?: boolean;
};

function Logo({ className, compact = false, ...props }: LogoProps) {
  return (
    <div
      data-slot="logo"
      className={cn("inline-flex items-center gap-3", className)}
      {...props}
    >
      <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-orange-500 via-amber-400 to-emerald-400 shadow-lg shadow-orange-500/20 ring-1 ring-black/5">
        <div className="absolute inset-0.5 rounded-[14px] bg-linear-to-br from-white/30 via-white/10 to-black/10" />
        <ShoppingBag
          className="relative size-5 text-slate-950"
          strokeWidth={2.25}
        />
        <Sparkles
          className="absolute right-1.5 top-1.5 size-3 text-white"
          strokeWidth={2.5}
        />
      </div>

      {!compact ? (
        <div className="min-w-0">
          <div className="text-sm font-semibold leading-none tracking-[0.24em] text-foreground uppercase">
            Маркет
          </div>
          <div className="mt-1 text-xs leading-none text-muted-foreground">
            отборные товары
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { Logo };
export type { LogoProps };
