import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ThemeToggle } from "@/widgets/theme-toggle";

type HeaderProps = React.ComponentProps<"header"> & {
  children?: React.ReactNode;
  actions?: React.ReactNode;
};

function Header({ children, className, actions, ...props }: HeaderProps) {
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
        <Link
          to="/products"
          className="cursor-pointer sm:hidden"
          aria-label="На главную"
        >
          <Logo compact />
        </Link>
        <Link
          to="/products"
          className="hidden cursor-pointer sm:inline-flex"
          aria-label="На главную"
        >
          <Logo />
        </Link>

        <div className="flex flex-1 justify-center px-2">
          {children ?? (
            <nav
              aria-label="Основная навигация"
              className="hidden items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground md:flex"
            >
              <Link
                to="/products"
                className="cursor-pointer hover:text-foreground"
              >
                Каталог
              </Link>
              <span className="h-4 w-px bg-border" aria-hidden />
              <Link
                to="/profile"
                className="cursor-pointer hover:text-foreground"
              >
                Профиль
              </Link>
              <span className="h-4 w-px bg-border" aria-hidden />
              <Link
                to="/cart"
                className="cursor-pointer hover:text-foreground"
              >
                Корзина
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          {actions}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export { Header };
export type { HeaderProps };





