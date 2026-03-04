import * as React from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { Separator } from "./separator";
import { ThemeToggle } from "./theme-toggle";

type HeaderProps = React.ComponentProps<"header"> & {
  children?: React.ReactNode;
};

function Header({ children, className, ...props }: HeaderProps) {
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
              <span>Каталог</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Подборки</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Корзина</span>
            </nav>
          )}
        </div>

        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export { Header };
export type { HeaderProps };
