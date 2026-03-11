import * as React from "react";
import { ChevronDown, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type UserAuthControlProps = Omit<React.ComponentProps<"div">, "children"> & {
  authenticated: boolean;
  userName?: string | null;
  onLogin: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
};

function UserAuthControl({
  authenticated,
  userName,
  onLogin,
  onLogout,
  onOpenProfile,
  className,
  ...props
}: UserAuthControlProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!authenticated || !open) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [authenticated, open]);

  React.useEffect(() => {
    if (!authenticated) {
      setOpen(false);
    }
  }, [authenticated]);

  if (!authenticated) {
    return (
      <Button type="button" size="sm" onClick={onLogin}>
        <User className="size-4" />
        <span>Войти</span>
      </Button>
    );
  }

  const displayName = userName?.trim() || "Пользователь";

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      data-slot="user-auth-control"
      {...props}
    >
      <Button
        type="button"
        size="sm"
        variant="outline"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        className="max-w-[14rem] justify-between gap-2"
      >
        <span className="flex min-w-0 items-center gap-2">
          <User className="size-4 shrink-0" />
          <span className="truncate">{displayName}</span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 transition-transform",
            open ? "rotate-180" : undefined,
          )}
        />
      </Button>

      {open ? (
        <div
          role="menu"
          aria-label="Меню пользователя"
          className="absolute top-full right-0 z-50 mt-2 flex min-w-44 flex-col gap-1 rounded-xl border bg-popover p-1.5 text-popover-foreground shadow-sm"
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none"
            onClick={() => {
              setOpen(false);
              onOpenProfile();
            }}
          >
            <User className="size-4" />
            <span>Профиль</span>
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            <LogOut className="size-4" />
            <span>Выйти</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

export { UserAuthControl };
export type { UserAuthControlProps };
