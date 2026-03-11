import * as React from "react";
import logoMarkUrl from "@/assets/logo-mark.svg";
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
      <img
        src={logoMarkUrl}
        alt=""
        aria-hidden="true"
        className="size-11 shrink-0 drop-shadow-[0_10px_20px_rgba(249,115,22,0.22)]"
      />

      {!compact ? (
        <div className="min-w-0">
          <div className="text-sm font-semibold leading-none tracking-[0.24em] text-foreground uppercase">
            Маркет
          </div>
          <div className="mt-1 text-[11px] leading-none tracking-[0.18em] text-muted-foreground uppercase">
            смелые находки
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { Logo };
export type { LogoProps };




