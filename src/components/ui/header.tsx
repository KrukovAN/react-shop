import * as React from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { Button } from "./button";
import { Separator } from "./separator";
import { ThemeToggle } from "./theme-toggle";

type HeaderProps = React.ComponentProps<"header"> & {
  children?: React.ReactNode;
  onProfileClick?: () => void;
  onLoginClick?: () => void;
  actions?: React.ReactNode;
};

const ZITADEL_AUTH_URL = "https://auth.uonn.ru";

function Header({
  children,
  className,
  onProfileClick,
  onLoginClick,
  actions,
  ...props
}: HeaderProps) {
  const navItemClassName =
    "cursor-pointer transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
      return;
    }

    if (typeof window !== "undefined") {
      window.location.assign(ZITADEL_AUTH_URL);
    }
  };

  return (
    <header
      data-slot="header"
      className={cn(
        "sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex min-h-18 w-full max-w-[1440px] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Logo compact className="sm:hidden" />
        <Logo className="hidden sm:inline-flex" />

        <div className="flex flex-1 justify-center px-2">
          {children ?? (
            <nav
              aria-label="Основная навигация"
              className="hidden items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground md:flex"
            >
              <button type="button" className={navItemClassName}>
                Каталог
              </button>
              <Separator orientation="vertical" className="h-4" />
              <button
                type="button"
                className={navItemClassName}
                onClick={onProfileClick}
              >
                Профиль
              </button>
              <Separator orientation="vertical" className="h-4" />
              <button type="button" className={navItemClassName}>
                Корзина
              </button>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          {actions ?? (
            <Button type="button" size="sm" onClick={handleLoginClick}>
              <User className="size-4" />
              <span>Войти</span>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export { Header };
export type { HeaderProps };
